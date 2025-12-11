document.addEventListener('DOMContentLoaded', () => {
  // === CAROUSEL ===
  const track = document.querySelector('.carousel-track');
  const btnLeft = document.querySelector('.carousel-btn.left');
  const btnRight = document.querySelector('.carousel-btn.right');
  const items = document.querySelectorAll('.carousel-track .vignette-illustration');

  let currentIndex = 0;
  const visibleItems = 2;

  function updateCarousel() {
    if (!items.length) return;
    const itemWidth = items[0].offsetWidth + 20;
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

  // === MENU DÉROULANT ===
  const menuLinks = document.querySelectorAll(".menu-item > a");

  menuLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const submenu = link.nextElementSibling;

      document.querySelectorAll(".submenu.open").forEach(sub => {
        if (sub !== submenu) sub.classList.remove("open");
      });

      if (submenu && submenu.classList.contains("submenu")) {
        submenu.classList.toggle("open");
      }
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".menu-item")) {
      document.querySelectorAll(".submenu.open").forEach(sub => sub.classList.remove("open"));
    }
  });
});
