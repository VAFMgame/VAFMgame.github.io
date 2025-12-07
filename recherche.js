// Charger index.html et extraire les blocs
fetch("index.html")
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const articles = [];

    // Sélectionner tous les blocs de vignettes
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
        articles.push({
          title,
          text,
          image,
          link
        });
      }
    });

    const searchInput = document.getElementById("search");
    const resultsDiv = document.getElementById("results");

    searchInput.addEventListener("keyup", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = articles.filter(a =>
        a.title.toLowerCase().includes(query) || a.text.toLowerCase().includes(query)
      );

      resultsDiv.innerHTML = filtered.length > 0
        ? filtered.map(a => `
            <a href="${a.link}" class="vignette-horizontal">
              <img src="${a.image}" alt="${a.title}">
              <div class="vignette-texte">
                <h4>${a.title}</h4>
                <p>${a.text}</p>
              </div>
            </a>
          `).join("")
        : `<p class="no-result">Aucun résultat trouvé.</p>`;
    });
  })
  .catch(err => console.error("Erreur lors du chargement des vignettes :", err));
