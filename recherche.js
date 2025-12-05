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
      const link = bloc.querySelector("a")?.getAttribute("href") || "#";

      if (title) {
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

      resultsDiv.innerHTML = filtered
        .map(a => `
          <a href="${a.link}" class="vignette-result">
            <img src="${a.image}" alt="${a.title}">
            <h4>${a.title}</h4>
            <p>${a.text}</p>
          </a>
        `)
        .join("");
    });
  });
