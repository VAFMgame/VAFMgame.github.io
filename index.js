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
