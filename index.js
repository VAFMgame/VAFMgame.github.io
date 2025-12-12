// MENU DÉROULANT — version corrigée et robuste
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

  const menuRoot = document.querySelector('body'); // délégation globale
  if (!menuRoot) return;

  const ensurePosition = () => {
    document.querySelectorAll('.menu-item').forEach(mi => {
      if (getComputedStyle(mi).position === 'static') mi.style.position = 'relative';
    });
  };
  ensurePosition();

  const closeAll = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(sub => {
      if (sub !== except) {
        sub.classList.remove('open');
        const trigger = sub.previousElementSibling;
        if (trigger && trigger.setAttribute) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Initial ARIA setup
  document.querySelectorAll('.menu-item > a').forEach(link => {
    const next = link.nextElementSibling;
    const hasSub = next && next.classList && next.classList.contains('submenu');
    link.setAttribute('aria-haspopup', hasSub ? 'true' : 'false');
    link.setAttribute('aria-expanded', 'false');
  });

  // Délégation click : gère toggle sur mobile/tactile et placeholders sur desktop
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

    // Desktop : laisser navigation si href réel, empêcher seulement les placeholders
    if (!isTouchDevice) {
      const href = (link.getAttribute('href') || '').trim();
      if (!href || href === '#' || href.startsWith('javascript:')) e.preventDefault();
      // on ne toggle pas via JS sur desktop (CSS :hover gère l'affichage)
      return;
    }

    // Touch device : toggle du sous-menu
    // Laisser ctrl/meta/middle click passer
    if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
    e.preventDefault();
    if (!submenu) return;
    closeAll(submenu);
    const opened = submenu.classList.toggle('open');
    link.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }, { passive: false });

  // Délégation pointerup pour compatibilité tactile (prévenir double triggers)
  menuRoot.addEventListener('pointerup', (e) => {
    if (!isTouchDevice) return;
    const link = e.target.closest('.menu-item > a');
    if (!link) return;
    if (e.pointerType === 'touch') {
      // pointerup déclenchera le même toggle que le click handler, mais on garde pour compatibilité
      // rien à faire ici pour éviter double toggle
    }
  }, { passive: true });

  // Clavier : Enter/Space pour toggle sur éléments avec sous-menu, Escape pour fermer
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
      // toggle accessible
      const opened = submenu.classList.toggle('open');
      link.setAttribute('aria-expanded', opened ? 'true' : 'false');
      if (!opened) link.focus();
    }
  });

  // Focusout sur chaque menu-item pour fermer proprement au clavier
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

  // Fermer au clic extérieur (déjà géré par délégation click) et au resize/orientation
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => closeAll(), 150);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // Nettoyage initial
  closeAll();
});
