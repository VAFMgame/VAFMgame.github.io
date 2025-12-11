document.addEventListener('DOMContentLoaded', () => {
  // === CAROUSEL ===
  const track = document.querySelector('.carousel-track');
  const btnLeft = document.querySelector('.carousel-btn.left');
  const btnRight = document.querySelector('.carousel-btn.right');
  const items = Array.from(document.querySelectorAll('.carousel-track .vignette-illustration'));

  let currentIndex = 0;
  const visibleItems = 2;

  if (!track || !btnLeft || !btnRight || items.length === 0) {
    console.warn('Carousel: éléments manquants ou aucun item trouvé.', {
      track: !!track,
      btnLeft: !!btnLeft,
      btnRight: !!btnRight,
      itemsCount: items.length
    });
  } else {
    const gap = 20; // doit correspondre au gap CSS
    const updateCarousel = () => {
      if (!items.length) return;
      const itemWidth = items[0].offsetWidth + gap;
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      btnLeft.disabled = currentIndex === 0;
      btnRight.disabled = currentIndex >= items.length - visibleItems;
    };

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

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCarousel, 120);
    });

    updateCarousel();
  }

  // === MENU DÉROULANT ===
  const menuLinks = Array.from(document.querySelectorAll('.menu-item > a'));

  if (!menuLinks.length) {
    console.warn('Menu: aucun lien .menu-item > a trouvé.');
    return;
  }

  // Ensure each menu-item can position its submenu
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

  // Toggle handler factory (keeps logic consistent)
  const makeToggleHandler = (link) => {
    return (e) => {
      // Allow normal navigation for modifier clicks or middle click
      if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return;

      const submenu = link.nextElementSibling;
      if (!submenu || !submenu.classList.contains('submenu')) return; // nothing to toggle

      // For keyboard events, prevent default to avoid scrolling on Space
      if (e.type === 'keydown' || e.type === 'click') e.preventDefault();

      closeAllSubmenus(submenu);
      const opened = submenu.classList.toggle('open');
      link.setAttribute('aria-expanded', opened ? 'true' : 'false');
    };
  };

  // Attach listeners with accessibility attributes
  menuLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('tabindex', '0');

    const handler = makeToggleHandler(link);

    // Click toggles submenu (only prevents default when submenu exists)
    link.addEventListener('click', handler);

    // Keyboard: Enter or Space toggles submenu
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        handler(e);
      }
    });

    // Pointerdown handles touch and pen; do not prevent default globally
    link.addEventListener('pointerdown', (e) => {
      // If pointer is touch, toggle; if mouse, let click handle it
      if (e.pointerType === 'touch') {
        // small delay not needed; call handler directly
        handler(e);
      }
    }, { passive: true });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-item')) closeAllSubmenus();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllSubmenus();
  });

  // Close on resize (debounced)
  let resizeCloseTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeCloseTimer);
    resizeCloseTimer = setTimeout(() => closeAllSubmenus(), 150);
  });
});
