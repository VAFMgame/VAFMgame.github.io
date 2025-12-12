// MENU DÉROULANT — version finale corrigée
document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = (() => {
    try {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(hover: none)').matches)
      );
    } catch {
      return false;
    }
  })();

  // limiter la délégation au menu central si possible
  const menuRoot = document.querySelector('.menu-central') || document.body;
  if (!menuRoot) return;

  // s'assurer que chaque .menu-item peut positionner son sous-menu
  document.querySelectorAll('.menu-item').forEach(mi => {
    if (getComputedStyle(mi).position === 'static') mi.style.position = 'relative';
  });

  const closeAll = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(sub => {
      if (sub !== except) {
        sub.classList.remove('open');
        const trigger = sub.previousElementSibling;
        if (trigger && trigger.setAttribute) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // initialisation ARIA
  document.querySelectorAll('.menu-item > a').forEach(link => {
    const next = link.nextElementSibling;
    const hasSub = next && next.classList && next.classList.contains('submenu');
    link.setAttribute('aria-haspopup', hasSub ? 'true' : 'false');
    link.setAttribute('aria-expanded', 'false');
  });

  // click delegation : desktop placeholders / tactile toggle
  menuRoot.addEventListener('click', (e) => {
    const link = e.target.closest('.menu-item > a');
    if (!link) {
      // clic hors menu-item : fermer
      if (!e.target.closest('.menu-item')) closeAll();
      return;
    }

    const submenu = link.nextElementSibling && link.nextElementSibling.classList.contains('submenu')
      ? link.nextElementSibling
      : null;

    // Desktop : laisser la navigation si href réel, empêcher seulement les placeholders
    if (!isTouchDevice) {
      const href = (link.getAttribute('href') || '').trim();
      if (!href || href === '#' || href.startsWith('javascript:')) e.preventDefault();
      return;
    }

    // Touch device : toggle du sous-menu
    if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
    e.preventDefault();
    if (!submenu) return;
    closeAll(submenu);
    const opened = submenu.classList.toggle('open');
    link.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }, { passive: false });

  // clavier : Enter/Space toggle, Escape ferme tout
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (e.key === 'Escape') {
      closeAll();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && active && active.matches && active.matches('.menu-item > a')) {
      const link = active;
      const submenu = link.nextElementSibling && link.nextElementSibling.classList.contains('submenu')
        ? link.nextElementSibling
        : null;
      if (!submenu) return;
      e.preventDefault();
      const opened = submenu.classList.toggle('open');
      link.setAttribute('aria-expanded', opened ? 'true' : 'false');
      if (!opened) link.focus();
    }
  });

  // focusout : fermer proprement quand le focus sort du menu-item
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('focusout', (ev) => {
      if (!item.contains(ev.relatedTarget)) {
        const submenu = item.querySelector('.submenu');
        const trigger = item.querySelector('a');
        if (submenu && submenu.classList.contains('open')) {
          submenu.classList.remove('open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // fermer au resize / orientation (debounced)
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => closeAll(), 150);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // état initial
  closeAll();
});
