document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('http://localhost:3000/noticias');
  const noticias = await response.json();
  const container = document.getElementById('noticias-container');

  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  noticias.slice(0, 6).forEach(noticia => {
    const card = document.createElement('div');
   card.className = 'card-noticia favorito-card';


    const isFavorito = favoritos.includes(String(noticia.id)); // ID como string

    card.innerHTML = `
      <img src="${noticia.imagem}" alt="${noticia.titulo}">
      <h3>${noticia.titulo}</h3>
      <p>${noticia.resumo}</p>
      <i class="fas fa-heart favorite-icon ${isFavorito ? 'favorito' : ''}" data-id="${noticia.id}"></i>
    `;

    card.querySelector('img').addEventListener('click', () => abrirModal(noticia));
    card.querySelector('h3').addEventListener('click', () => abrirModal(noticia));
    card.querySelector('p').addEventListener('click', () => abrirModal(noticia));
    card.querySelector('.favorite-icon').addEventListener('click', (e) => {
      e.stopPropagation(); // impede o clique de abrir o modal
      toggleFavorito(noticia.id, e.target);
    });

    container.appendChild(card);
  });

  // Função para abrir o modal com os dados da notícia
  function abrirModal(noticia) {
  document.getElementById('modal-titulo').textContent = noticia.titulo;
  document.getElementById('modal-imagem').src = noticia.imagem;
  document.getElementById('modal-conteudo').textContent = noticia.conteudo;
  document.getElementById('modal').style.display = 'block';
}


  // Função para fechar o modal
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('modal').style.display = 'none';
    });
  }

  // Função de favoritamento
  function toggleFavorito(id, icon) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.includes(String(id))) {
      favoritos = favoritos.filter(favId => favId !== String(id));
      icon.classList.remove('favorito');
    } else {
      favoritos.push(String(id));
      icon.classList.add('favorito');
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }
});
