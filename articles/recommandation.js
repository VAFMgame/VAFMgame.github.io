// recommandation.js

// Charger les articles depuis la page d'accueil
fetch("index.html")
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const articles = [];

    // Sélectionner toutes les vignettes de la page d'accueil
    const vignettes = doc.querySelectorAll(
      ".vignette-une, .vignette-actu, .vignette-illustration"
    );

    vignettes.forEach(bloc => {
      const title =
        bloc.querySelector(".titre-fixe, .contenu-actu h4, .titre-sur-image")?.textContent.trim() || "";
      const text =
        bloc.querySelector(".texte-fondu p, .contenu-actu p")?.textContent.trim() || "";
      const image = bloc.querySelector("img")?.getAttribute("src") || "";

      // Correction : si le bloc est lui-même un <a>, on prend son href
      const link = bloc.tagName === "A"
        ? bloc.getAttribute("href")
        : bloc.querySelector("a")?.getAttribute("href") || "#";

      if (title && link !== "#") {
        articles.push({ title, text, image, link });
      }
    });

    // Fonction pour récupérer les préférences de lecture
    function getPreferences() {
      const vus = JSON.parse(localStorage.getItem("articlesVus") || "[]");
      const stats = {};
      vus.forEach(titre => {
        stats[titre] = (stats[titre] || 0) + 1;
      });
      return stats;
    }

    // Fonction pour recommander les articles
    function recommander(articles) {
      const prefs = getPreferences();
      return articles
        .sort((a, b) => (prefs[b.title] || 0) - (prefs[a.title] || 0))
        .slice(0, 3); // Top 3 recommandations
    }

    // Générer les recommandations
    const recommandations = recommander(articles);

    const bloc = document.getElementById("recommandations");
    if (bloc) {
      bloc.innerHTML = recommandations.map(a => `
        <a href="${a.link}" class="vignette-actu vignette-horizontal">
          <img src="${a.image}" alt="${a.title}">
          <div class="contenu-actu">
            <h4>${a.title}</h4>
            <p>${a.text}</p>
          </div>
        </a>
      `).join("");
    }
  })
  .catch(err => console.error("Erreur lors du chargement des recommandations :", err));
