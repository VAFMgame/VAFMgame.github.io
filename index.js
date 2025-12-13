// MENU DÉROULANT — version stable et universelle
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

  const menuRoot = document.querySelector('.menu-central') || document.body;
  if (!menuRoot) return;

  // Assure que chaque .menu-item peut positionner son sous-menu
  document.querySelectorAll('.menu-item').forEach(item => {
    if (getComputedStyle(item).position === 'static') item.style.position = 'relative';
  });

  const closeAll = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(sub => {
      if (sub !== except) {
        sub.classList.remove('open');
        const trigger = sub.previousElementSibling;
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Initialisation ARIA
  document.querySelectorAll('.menu-item > a').forEach(link => {
    const submenu = link.nextElementSibling;
    const hasSub = submenu && submenu.classList.contains('submenu');
    link.setAttribute('aria-haspopup', hasSub ? 'true' : 'false');
    link.setAttribute('aria-expanded', 'false');
  });

  // Gestion du clic (desktop et tactile)
  menuRoot.addEventListener('click', e => {
    const link = e.target.closest('.menu-item > a');
    if (!link) {
      if (!e.target.closest('.menu-item')) closeAll();
      return;
    }

    const submenu = link.nextElementSibling;
    const hasSub = submenu && submenu.classList.contains('submenu');

    if (!isTouchDevice) {
      const href = (link.getAttribute('href') || '').trim();
      if (!href || href === '#' || href.startsWith('javascript:')) e.preventDefault();
      return;
    }

    if (!hasSub) return;
    e.preventDefault();
    closeAll(submenu);
    const opened = submenu.classList.toggle('open');
    link.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // Gestion clavier : Enter / Space / Escape
  document.addEventListener('keydown', e => {
    const active = document.activeElement;
    if (e.key === 'Escape') {
      closeAll();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && active && active.matches('.menu-item > a')) {
      const submenu = active.nextElementSibling;
      if (!submenu || !submenu.classList.contains('submenu')) return;
      e.preventDefault();
      const opened = submenu.classList.toggle('open');
      active.setAttribute('aria-expanded', opened ? 'true' : 'false');
      if (!opened) active.focus();
    }
  });

  // Fermeture au focusout
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('focusout', e => {
      if (!item.contains(e.relatedTarget)) {
        const submenu = item.querySelector('.submenu');
        const trigger = item.querySelector('a');
        if (submenu && submenu.classList.contains('open')) {
          submenu.classList.remove('open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Fermeture au resize / orientation
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => closeAll(), 150);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // Fermeture initiale
  closeAll();
});
