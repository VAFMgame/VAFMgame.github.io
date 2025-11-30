const articles = [
  { title: "Fortnite Chapitre 5", content: "Toutes les nouveautés du chapitre", url: "articles/fortnite.html" },
  { title: "Elden Ring DLC", content: "Extension Shadow of the Erdtree", url: "articles/eldenring.html" },
  { title: "Apex Legends", content: "Battle royale dynamique", url: "articles/apex.html" }
];

const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");

searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query)
  );

  resultsDiv.innerHTML = filtered.map(a => `
    <div class="card">
      <h3><a href="${a.url}">${a.title}</a></h3>
      <p>${a.content}</p>
    </div>
  `).join("");
});

