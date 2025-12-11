document.addEventListener('DOMContentLoaded', () => {
  // === CAROUSEL ===
  const track = document.querySelector('.carousel-track');
  const btnLeft = document.querySelector('.carousel-btn.left');
  const btnRight = document.querySelector('.carousel-btn.right');
  const items = document.querySelectorAll('.carousel-track .vignette-illustration');

  let currentIndex = 0;
  const visibleItems = 2;

  // Safety checks for carousel elements
  if (!track || !btnLeft || !btnRight || items.length === 0) {
    console.warn('Carousel: éléments manquants ou aucun item trouvé.', { track, btnLeft, btnRight, itemsCount: items.length });
  } else {
    function updateCarousel() {
      if (!items.length) return;
      const gap = 20; // correspond au gap CSS
      const itemWidth = items[0].offsetWidth + gap;
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      btnLeft.disabled = currentIndex === 0;
      btnRight.disabled = currentIndex >= items.length - visibleItems;
    }

    btnLeft.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    btnRight.addEventListener('click', () => {
      if (currentIndex < items.length - visibleItems) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Debounce resize to avoid many recalculs
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCarousel, 120);
    });

    // Initial layout
    updateCarousel();
  }

  // === MENU DÉROULANT ===
  const menuLinks = Array.from(document.querySelectorAll('.menu-item > a'));

  if (!menuLinks.length) {
    console.warn('Menu: aucun lien .menu-item > a trouvé.');
  } else {
    // Ensure each menu-item has position:relative for submenu positioning
    document.querySelectorAll('.menu-item').forEach(mi => {
      const style = getComputedStyle(mi).position;
      if (style === 'static') mi.style.position = 'relative';
    });

    // Helper functions
    const closeAllSubmenus = (except = null) => {
      document.querySelectorAll('.submenu.open').forEach(sub => {
        if (sub !== except) {
          sub.classList.remove('open');
          // update ARIA
          const parentLink = sub.previousElementSibling;
          if (parentLink && parentLink.getAttribute) parentLink.setAttribute('aria-expanded', 'false');
        }
      });
    };

    // Add attributes and listeners
    menuLinks.forEach(link => {
      // Ensure link has aria attributes for accessibility
      link.setAttribute('role', 'button');
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('tabindex', '0');

      // Click / touch handler
      const onActivate = e => {
        // allow normal behavior for modifier clicks (ctrl/cmd) or middle click
        if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;
        e.preventDefault();

        const submenu = link.nextElementSibling;
        if (!submenu || !submenu.classList.contains('submenu')) return;

        // Close others then toggle this one
        closeAllSubmenus(submenu);
        const isOpen = submenu.classList.toggle('open');
        link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      };

      // Click
      link.addEventListener('click', onActivate);

      // Keyboard support: Enter and Space toggle submenu
      link.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate(e);
        }
      });

      // Prevent accidental double toggles on touch devices
      link.addEventListener('touchstart', e => {
        // small delay to allow click handler to run normally
        // but prevent default to avoid focus jump
        e.preventDefault();
        onActivate(e);
      }, { passive: false });
    });

    // Close submenus when clicking outside
    document.addEventListener('click', e => {
      if (!e.target.closest('.menu-item')) closeAllSubmenus();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAllSubmenus();
    });

    // Close submenus on resize (useful if layout changes)
    let resizeCloseTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeCloseTimer);
      resizeCloseTimer = setTimeout(() => closeAllSubmenus(), 150);
    });
  }
});
