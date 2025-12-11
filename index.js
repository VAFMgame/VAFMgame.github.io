// === MENU DÉROULANT (only click on touch devices) ===
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
const menuLinks = Array.from(document.querySelectorAll('.menu-item > a'));

if (!menuLinks.length) {
  console.warn('Menu: aucun lien .menu-item > a trouvé.');
} else {
  // ensure positioning
  document.querySelectorAll('.menu-item').forEach(mi => {
    if (getComputedStyle(mi).position === 'static') mi.style.position = 'relative';
  });

  const closeAllSubmenus = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(sub => {
      if (sub !== except) {
        sub.classList.remove('open');
        const parentLink = sub.previousElementSibling;
        if (parentLink && parentLink.setAttribute) parentLink.setAttribute('aria-expanded', 'false');
      }
    });
  };

  menuLinks.forEach(link => {
    // accessibility attributes
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('tabindex', '0');

    // If device is touch-only, attach toggle handlers
    if (isTouchDevice) {
      const toggle = (e) => {
        if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
        e.preventDefault();
        const submenu = link.nextElementSibling;
        if (!submenu || !submenu.classList.contains('submenu')) return;
        closeAllSubmenus(submenu);
        const opened = submenu.classList.toggle('open');
        link.setAttribute('aria-expanded', opened ? 'true' : 'false');
      };

      link.addEventListener('click', toggle);
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
      });
      // pointerdown for touch responsiveness
      link.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') toggle(e); }, { passive: true });
    } else {
      // Desktop: ensure aria-expanded is false and remove any inline style toggles
      link.setAttribute('aria-expanded', 'false');
      // keep keyboard support: open submenu on focus + ArrowDown or Enter if desired
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          const submenu = link.nextElementSibling;
          if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.add('open');
            link.setAttribute('aria-expanded', 'true');
            // focus first item
            const firstItem = submenu.querySelector('a');
            if (firstItem) firstItem.focus();
          }
        }
      });
    }
  });

  // Close when clicking outside (works for both)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-item')) closeAllSubmenus();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllSubmenus(); });

  // Close on resize (debounced)
  let resizeCloseTimer = null;
  window.addEventListener('resize', () => { clearTimeout(resizeCloseTimer); resizeCloseTimer = setTimeout(() => closeAllSubmenus(), 150); });
}
