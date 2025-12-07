  const titreArticle = "Elden Ring: Firestorm Hollow"; // ← change ça selon l’article

  function enregistrerArticleVu(titre) {
    const vus = JSON.parse(localStorage.getItem("articlesVus") || "[]");
    if (!vus.includes(titre)) {
      vus.push(titre);
      localStorage.setItem("articlesVus", JSON.stringify(vus));
    }
  }

  enregistrerArticleVu(titreArticle);


