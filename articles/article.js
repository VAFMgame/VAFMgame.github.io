  function copyArticleLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Lien copié dans le presse-papiers !");
    }).catch(err => {
      alert("Erreur lors de la copie du lien.");
    });
  }


