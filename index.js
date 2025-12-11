    document.addEventListener('DOMContentLoaded', () => {
      const track = document.querySelector('.carousel-track');
      const btnLeft = document.querySelector('.carousel-btn.left');
      const btnRight = document.querySelector('.carousel-btn.right');
      const items = document.querySelectorAll('.carousel-track .vignette-illustration');

      let currentIndex = 0;
      const visibleItems = 2;

      function updateCarousel() {
        const itemWidth = items[0].offsetWidth + 20; // largeur + gap
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

      window.addEventListener('resize', updateCarousel);
      updateCarousel();
    });


document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.menu-central .menu-item');

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('open');
    });

    // Accessibilité + fallback au clavier
    const link = item.querySelector('a');
    link.addEventListener('focus', () => item.classList.add('open'));
    // Ferme quand on sort du dernier lien du submenu
    const lastSubLink = item.querySelector('.submenu li:last-child a');
    if (lastSubLink) {
      lastSubLink.addEventListener('blur', () => item.classList.remove('open'));
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach(item => {
    const submenu = item.querySelector(".submenu");
    const link = item.querySelector("a");

    if (submenu && link) {
      link.addEventListener("click", e => {
        e.preventDefault(); // empêche le lien de naviguer
        submenu.classList.toggle("open");
      });

      // optionnel : referme les autres sous-menus
      link.addEventListener("mouseenter", () => {
        menuItems.forEach(other => {
          if (other !== item) {
            const otherSub = other.querySelector(".submenu");
            if (otherSub) otherSub.classList.remove("open");
          }
        });
      });
    }
  });
});
