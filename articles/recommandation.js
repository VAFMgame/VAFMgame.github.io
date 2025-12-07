// === CONFIGURATION ===
// On récupère automatiquement le titre de l'article depuis le <h1>
const titreArticleActuel = document.querySelector("h1")?.textContent.trim() || "";

// === Enregistrer l'article consulté ===
const vus = JSON.parse(localStorage.getItem("articlesVus") || "[]");
if (titreArticleActuel && !vus.includes(titreArticleActuel)) {
  vus.push(titreArticleActuel);
  localStorage.setItem("articlesVus", JSON.stringify(vus));
}

// === Charger les articles depuis la page d'accueil ===
fetch("../index.html")
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const articles = [];

    const vignettes = doc.querySelectorAll(
      ".vignette-une, .vignette-actu, .vignette-illustration"
    );

    vignettes.forEach(bloc => {
      const title =
        bloc.querySelector(".titre-fixe, .contenu-actu h4, .titre-sur-image")?.textContent.trim() || "";
      const text =
        bloc.querySelector(".texte-fondu p, .contenu-actu p")?.textContent.trim() || "";
      const image = bloc.querySelector("img")?.getAttribute("src") || "";

      const link = bloc.tagName === "A"
        ? bloc.getAttribute("href")
        : bloc.querySelector("a")?.getAttribute("href") || "#";

      // Corriger les liens relatifs pour qu'ils fonctionnent depuis une page article
      const base = "../"; 
      const lienCorrigé = link.startsWith("http") ? link : base + link;

      if (title && lienCorrigé !== "#" && title !== titreArticleActuel) {
        articles.push({ title, text, image, link: lienCorrigé });
      }
    });

    // === Préférences utilisateur ===
    const stats = {};
    vus.forEach(titre => {
      stats[titre] = (stats[titre] || 0) + 1;
    });

    // === Trier les articles selon les préférences ===
    const recommandations = articles
      .sort((a, b) => (stats[b.title] || 0) - (stats[a.title] || 0))
      .slice(0, 3); // Top 3

    // === Afficher dans la page ===
    const bloc = document.getElementById("recommandations");
    if (bloc) {
      bloc.innerHTML = recommandations.map(a => `
        <a href="${a.link}" class="vignette-horizontal">
          <img src="${a.image}" alt="${a.title}">
          <div class="contenu-actu">
            <h4>${a.title}</h4>
            <p>${a.text}</p>
          </div>
        </a>
      `).join("");
    }
  })
  .catch(err => console.error("Erreur chargement recommandations :", err));

