// MENU DÉROULANT — version stable et universelle
document.addEventListener('DOMContentLoaded', () => {
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

  const menuRoot = document.querySelector('.menu-central') || document.body;
  if (!menuRoot) return;

  // Assure que chaque .menu-item peut positionner son sous-menu
  document.querySelectorAll('.menu-item').forEach(item => {
    if (getComputedStyle(item).position === 'static') item.style.position = 'relative';
  });

  const closeAll = (except = null) => {
    document.querySelectorAll('.submenu.open').forEach(sub => {
      if (sub !== except) {
        sub.classList.remove('open');
        const trigger = sub.previousElementSibling;
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Initialisation ARIA
  document.querySelectorAll('.menu-item > a').forEach(link => {
    const submenu = link.nextElementSibling;
    const hasSub = submenu && submenu.classList.contains('submenu');
    link.setAttribute('aria-haspopup', hasSub ? 'true' : 'false');
    link.setAttribute('aria-expanded', 'false');
  });

  // Gestion du clic (desktop et tactile)
  menuRoot.addEventListener('click', e => {
    const link = e.target.closest('.menu-item > a');
    if (!link) {
      if (!e.target.closest('.menu-item')) closeAll();
      return;
    }

    const submenu = link.nextElementSibling;
    const hasSub = submenu && submenu.classList.contains('submenu');

    if (!isTouchDevice) {
      const href = (link.getAttribute('href') || '').trim();
      if (!href || href === '#' || href.startsWith('javascript:')) e.preventDefault();
      return;
    }

    if (!hasSub) return;
    e.preventDefault();
    closeAll(submenu);
    const opened = submenu.classList.toggle('open');
    link.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // Gestion clavier : Enter / Space / Escape
  document.addEventListener('keydown', e => {
    const active = document.activeElement;
    if (e.key === 'Escape') {
      closeAll();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && active && active.matches('.menu-item > a')) {
      const submenu = active.nextElementSibling;
      if (!submenu || !submenu.classList.contains('submenu')) return;
      e.preventDefault();
      const opened = submenu.classList.toggle('open');
      active.setAttribute('aria-expanded', opened ? 'true' : 'false');
      if (!opened) active.focus();
    }
  });

  // Fermeture au focusout
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('focusout', e => {
      if (!item.contains(e.relatedTarget)) {
        const submenu = item.querySelector('.submenu');
        const trigger = item.querySelector('a');
        if (submenu && submenu.classList.contains('open')) {
          submenu.classList.remove('open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Fermeture au resize / orientation
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => closeAll(), 150);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // Fermeture initiale
  closeAll();
});

// Carousel — défilement via scrollLeft (fix immédiat)
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.carousel-wrapper');
  const track = document.querySelector('.carousel-track');
  let btnLeft = document.querySelector('.carousel-btn.left');
  let btnRight = document.querySelector('.carousel-btn.right');
  const items = Array.from(track.querySelectorAll('.vignette-illustration'));
  if (!wrapper || !track || !btnLeft || !btnRight || items.length === 0) return;

  // Remplacer les boutons pour éliminer d’anciens écouteurs
  const replaceBtn = (sel) => {
    const old = document.querySelector(sel);
    if (!old) return null;
    const clone = old.cloneNode(true);
    old.parentNode.replaceChild(clone, old);
    return clone;
  };
  btnLeft = replaceBtn('.carousel-btn.left');
  btnRight = replaceBtn('.carousel-btn.right');

  let index = 0;
  let visible = 1;

  const gap = () => parseFloat(getComputedStyle(track).gap) || 0;
  const itemW = () => items[0]?.getBoundingClientRect().width || items[0]?.offsetWidth || 0;

  const computeVisible = () => {
    const w = itemW();
    if (!w) return visible;
    visible = Math.max(1, Math.floor((wrapper.getBoundingClientRect().width + gap()) / (w + gap())));
    return visible;
  };
  const maxIndex = () => Math.max(0, items.length - visible);

  const updateButtons = () => {
    btnLeft.disabled = index === 0;
    btnRight.disabled = index >= maxIndex();
    const hide = items.length <= visible;
    btnLeft.style.visibility = hide ? 'hidden' : 'visible';
    btnRight.style.visibility = hide ? 'hidden' : 'visible';
  };

  const scrollToIndex = (i, smooth = true) => {
    const step = Math.round(itemW() + gap());
    const target = i * step;
    if (smooth && 'scrollTo' in wrapper) {
      wrapper.scrollTo({ left: target, behavior: 'smooth' });
    } else {
      wrapper.scrollLeft = target;
    }
    updateButtons();
  };

  btnLeft.addEventListener('click', () => {
    if (index > 0) index--;
    scrollToIndex(index);
  });
  btnRight.addEventListener('click', () => {
    if (index < maxIndex()) index++;
    scrollToIndex(index);
  });

  const onResize = () => {
    computeVisible();
    if (index > maxIndex()) index = maxIndex();
    scrollToIndex(index, false);
  };
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(onResize);
    ro.observe(wrapper);
    items.forEach(i => ro.observe(i));
  } else {
    window.addEventListener('resize', () => setTimeout(onResize, 120));
  }

  const waitImages = () => {
    const imgs = Array.from(track.querySelectorAll('img'));
    return Promise.all(imgs.map(img => new Promise(res => {
      if (img.complete && img.naturalWidth > 0) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    })));
  };

  waitImages().then(() => {
    computeVisible();
    scrollToIndex(index, false);
  }).catch(() => scrollToIndex(index, false));
});
