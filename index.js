// === MENU DÉROULANT : hover desktop, click only on touch devices ===
const isTouchDevice =
  ('ontouchstart' in window) ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(hover: none)').matches;

const menuLinks = Array.from(document.querySelectorAll('.menu-item > a'));

if (!menuLinks.length) {
  console.warn('Menu: aucun lien .menu-item > a trouvé.');
} else {
  // chaque menu-item doit pouvoir positionner son sous-menu
  document.querySelectorAll('.menu-item').forEach(mi => {
    if (getComputedStyle(mi).position === 'static') mi.style.position = 'relative';
  });

  const closeAll = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(s => {
      if (s !== except) {
        s.classList.remove('open');
        const prev = s.previousElementSibling;
        if (prev) prev.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Nettoyage au chargement
  closeAll();

  menuLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('tabindex', '0');

    const submenu = link.nextElementSibling;

    if (!isTouchDevice) {
      // Desktop : clic ne bloque pas le menu
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:')) {
          e.preventDefault();
        }
      });
    } else {
      // Mobile : toggle au clic/tap
      const toggle = e => {
        if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
        e.preventDefault();
        if (!submenu || !submenu.classList.contains('submenu')) return;
        closeAll(submenu);
        const opened = submenu.classList.toggle('open');
        link.setAttribute('aria-expanded', opened ? 'true' : 'false');
      };

      link.addEventListener('click', toggle);
      link.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(e);
        }
      });
      link.addEventListener('pointerdown', e => {
        if (e.pointerType === 'touch') toggle(e);
      }, { passive: true });
    }
  });

  // Fermer quand on clique ailleurs
  document.addEventListener('click', e => {
    if (!e.target.closest('.menu-item')) closeAll();
  });

  // Fermer avec Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });

  // Fermer au resize
  let resizeCloseTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeCloseTimer);
    resizeCloseTimer = setTimeout(() => closeAll(), 150);
  });
}
