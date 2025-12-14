document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.video-card video');

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

function computeScore(video, userPrefs) {
  let score = video.popularity;

  // Bonus si les tags correspondent aux préférences
  userPrefs.forEach(tag => {
    if (video.tags.includes(tag)) score += 20;
  });

  // Bonus récence (exemple : +10 si publié récemment)
  if (video.date && Date.now() - new Date(video.date).getTime() < 7*24*60*60*1000) {
    score += 10;
  }

  // Petit facteur aléatoire pour varier
  score += Math.random() * 5;

  return score;
}

function recommendVideos(videos, userPrefs) {
  return videos
    .map(v => ({ ...v, score: computeScore(v, userPrefs) }))
    .sort((a, b) => b.score - a.score);
}

function renderFeed(videos) {
  const container = document.querySelector('.feed-container');
  container.innerHTML = "";

  videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <video src="${video.src}" autoplay muted loop playsinline></video>
      <div class="video-info">
        <h2>${video.title}</h2>
        <p>#${video.tags.join(" #")}</p>
      </div>
    `;
    container.appendChild(card);
  });
}
