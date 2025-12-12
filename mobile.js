// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('sideMenu');

if (hamburger && sideMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    sideMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#hamburger') && !e.target.closest('#sideMenu')) {
      hamburger.classList.remove('open');
      sideMenu.classList.remove('open');
    }
  });
}

// === Sous-catégories dans le menu mobile ===
document.querySelectorAll('.menu-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const submenu = toggle.nextElementSibling;
    if (submenu && submenu.classList.contains('submenu-mobile')) {
      submenu.style.display = submenu.style.display === 'flex' ? 'none' : 'flex';
    }
  });
});
