function copyArticleLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url)
    .then(() => alert("Lien copié dans le presse-papiers !"))
    .catch(() => alert("Erreur lors de la copie du lien."));
}

// Quand la page est chargée, on relie le bouton
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".copy-button");
  if (btn) btn.addEventListener("click", copyArticleLink);
});


