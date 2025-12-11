// === MENU DÉROULANT : hover desktop, click only on touch devices ===
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
const menuLinks = Array.from(document.querySelectorAll('.menu-item > a'));

// safety
if (!menuLinks.length) {
  console.warn('Menu: aucun lien .menu-item > a trouvé.');
} else {
  // ensure each menu-item can position its submenu
  document.querySelectorAll('.menu-item').forEach(mi => {
    if (getComputedStyle(mi).position === 'static') mi.style.position = 'relative';
  });

  // close helper
  const closeAll = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(s => {
      if (s !== except) {
        s.classList.remove('open');
        const prev = s.previousElementSibling;
        if (prev && prev.setAttribute) prev.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Remove any leftover .open on load
  closeAll();

  menuLinks.forEach(link => {
    // accessibility attributes
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('tabindex', '0');

    const submenu = link.nextElementSibling;
    // Desktop (mouse) : rely on CSS :hover; ensure click does NOT toggle
    if (!isTouchDevice) {
      // Prevent click from toggling or leaving submenu stuck
      link.addEventListener('click', (e) => {
        // allow navigation if link has a real href (not '#'), otherwise prevent default
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:')) {
          e.preventDefault();
        }
      });

      // Ensure submenu closes when mouse leaves the menu-item
      const parent = link.closest('.menu-item');
      if (parent) {
        parent.addEventListener('mouseleave', () => {
          if (submenu && submenu.classList.contains('open')) {
            submenu.classList.remove('open');
            link.setAttribute('aria-expanded', 'false');
          }
        });
        // Also remove .open on focusout (keyboard)
        parent.addEventListener('focusout', (ev) => {
          // if focus moved outside the parent, close submenu
          if (!parent.contains(ev.relatedTarget)) {
            if (submenu) {
              submenu.classList.remove('open');
              link.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }
    } else {
      // Touch devices: allow click/tap to toggle submenu
      const toggle = (e) => {
        // allow modifier clicks / middle click to behave normally
        if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
        e.preventDefault();
        if (!submenu || !submenu.classList.contains('submenu')) return;
        closeAll(submenu);
        const opened = submenu.classList.toggle('open');
        link.setAttribute('aria-expanded', opened ? 'true' : 'false');
      };

      link.addEventListener('click', toggle);
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
      });
      link.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') toggle(e); }, { passive: true });
    }
  });

  // Close when clicking outside (works for both)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-item')) closeAll();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  // Close on resize (debounced)
  let resizeCloseTimer = null;
  window.addEventListener('resize', () => { clearTimeout(resizeCloseTimer); resizeCloseTimer = setTimeout(() => closeAll(), 150); });
}
