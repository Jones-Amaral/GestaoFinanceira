
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/noticias')
    .then(response => response.json())
    .then(noticias => {
      const container = document.getElementById('noticias-grid');

      noticias.forEach(noticia => {
        const noticiaId = noticia.id;
        const likeKey = `like_count_${noticiaId}`;
        const likedKey = `liked_${noticiaId}`;
        let likes = parseInt(localStorage.getItem(likeKey)) || 0;
        let alreadyLiked = localStorage.getItem(likedKey) === "true";

        const card = document.createElement('div');
        card.classList.add('card');

        const imgUrl = `https://picsum.photos/300/150?random=${noticiaId}`;

        card.innerHTML = `
          <img src="${imgUrl}" alt="${noticia.titulo}">
          <h2>${noticia.titulo}</h2>
          <p>${noticia.resumo}</p>
          <button class="like-button" data-id="${noticiaId}" ${alreadyLiked ? "disabled" : ""}>
            ❤️ Curtir <span class="like-count">${likes}</span>
          </button>
        `;

        container.appendChild(card);
      });

      // Vincular evento aos botões após todos os cards
      document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', () => {
          const noticiaId = button.getAttribute('data-id');
          const likeKey = `like_count_${noticiaId}`;
          const likedKey = `liked_${noticiaId}`;
          let currentLikes = parseInt(localStorage.getItem(likeKey)) || 0;

          // Bloqueia curtida se já foi curtido
          if (localStorage.getItem(likedKey) === "true") return;

          currentLikes++;
          localStorage.setItem(likeKey, currentLikes);
          localStorage.setItem(likedKey, "true");

          button.querySelector('.like-count').textContent = currentLikes;
          button.disabled = true;
        });
      });
    });
});
