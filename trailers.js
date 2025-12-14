document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.video-slide video');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.6 });

  videos.forEach(v => observer.observe(v));
});

