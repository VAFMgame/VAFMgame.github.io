// === MENU DÉROULANT : hover desktop, click only on touch devices ===
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

const menuItems = Array.from(document.querySelectorAll('.menu-item'));
const menuLinks = Array.from(document.querySelectorAll('.menu-item > a'));

if (!menuLinks.length) {
  console.warn('Menu: aucun lien .menu-item > a trouvé.');
} else {
  // Assurer que chaque menu-item peut positionner son sous-menu
  menuItems.forEach(mi => {
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

  // Nettoyage initial
  closeAll();

  // Pour éviter d'attacher plusieurs fois les mêmes handlers, on mémorise les liens traités
  const handled = new WeakSet();

  menuLinks.forEach(link => {
    if (handled.has(link)) return;
    handled.add(link);

    const submenu = link.nextElementSibling && link.nextElementSibling.classList.contains('submenu')
      ? link.nextElementSibling
      : null;

    // ARIA
    link.setAttribute('aria-haspopup', submenu ? 'true' : 'false');
    link.setAttribute('aria-expanded', 'false');

    if (!isTouchDevice) {
      // Desktop : laisser CSS :hover gérer l'ouverture. Empêcher navigation pour placeholder.
      link.addEventListener('click', e => {
        const href = (link.getAttribute('href') || '').trim();
        if (!href || href === '#' || href.startsWith('javascript:')) e.preventDefault();
      });

      // Fermer au focusout (clavier) si le focus sort du menu-item
      const parent = link.closest('.menu-item');
      if (parent) {
        parent.addEventListener('focusout', ev => {
          if (!parent.contains(ev.relatedTarget)) {
            if (submenu) {
              submenu.classList.remove('open');
              link.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }
    } else {
      // Mobile / tactile : toggle au tap
      const toggle = e => {
        if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
        e.preventDefault();
        if (!submenu) return;
        closeAll(submenu);
        const opened = submenu.classList.toggle('open');
        link.setAttribute('aria-expanded', opened ? 'true' : 'false');
      };

      // Attacher handlers une seule fois
      link.addEventListener('click', toggle);
      link.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(e);
        } else if (e.key === 'Escape') {
          if (submenu && submenu.classList.contains('open')) {
            submenu.classList.remove('open');
            link.setAttribute('aria-expanded', 'false');
            link.focus();
          }
        }
      });
      link.addEventListener('pointerup', e => {
        if (e.pointerType === 'touch') toggle(e);
      }, { passive: true });
    }
  });

  // Fermer quand on clique en dehors du menu (mais pas si on clique dans un sous-menu)
  document.addEventListener('click', e => {
    if (!e.target.closest('.menu-item')) closeAll();
  });

  // Fermer avec Escape (global)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });

  // Fermer au resize et changement d'orientation (debounced)
  let resizeCloseTimer = null;
  const onResize = () => {
    clearTimeout(resizeCloseTimer);
    resizeCloseTimer = setTimeout(() => closeAll(), 150);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
}
