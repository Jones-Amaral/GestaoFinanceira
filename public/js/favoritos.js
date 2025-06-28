document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/noticias'); // Confirme se está usando "noticias"
    const noticias = await response.json();

    const container = document.getElementById('favoritos-container');
    if (!container) return;

    const favoritas = noticias.filter(n => n.favoritado);

    if (favoritas.length === 0) {
      container.innerHTML = '<p>Nenhuma notícia favoritada.</p>';
      return;
    }

    favoritas.forEach(noticia => {
      const caminhoImagem = noticia.banner || noticia.imagem; // Usa o que estiver presente

      const card = document.createElement('div');
      card.className = 'card-noticia favorito-card';

      card.innerHTML = `
        <img src="${caminhoImagem}" alt="${noticia.titulo}">
        <h3>${noticia.titulo}</h3>
        <p>${noticia.resumo}</p>
        <i class="fas fa-heart favorite-icon favorito" data-id="${noticia.id}"></i>
      `;

      // Abre modal ao clicar em qualquer parte do card (menos o coração)
      card.querySelector('img').addEventListener('click', () => abrirModal(noticia));
      card.querySelector('h3').addEventListener('click', () => abrirModal(noticia));
      card.querySelector('p').addEventListener('click', () => abrirModal(noticia));

      // Alternar favorito
      card.querySelector('.favorite-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorito(noticia.id, e.target, card);
      });

      container.appendChild(card);
    });

    function abrirModal(noticia) {
      document.getElementById('modal-titulo').textContent = noticia.titulo;
      document.getElementById('modal-imagem').src = noticia.banner || noticia.imagem;
      document.getElementById('modal-conteudo').innerHTML = noticia.texto || noticia.conteudo;
      document.getElementById('modal').style.display = 'block';
    }

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
      });
    }

    async function toggleFavorito(id, icon, card) {
      const url = `http://localhost:3000/noticias/${id}`;
      const res = await fetch(url);
      const noticia = await res.json();
      const novoStatus = !noticia.favoritado;

      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ favoritado: novoStatus })
      });

      if (!novoStatus) {
        card.remove(); // Remove o card da lista se desfavoritado
      }

      icon.classList.toggle("favorito", novoStatus);
    }

  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
});
