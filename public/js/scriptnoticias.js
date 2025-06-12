document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('http://localhost:3000/noticias');
  const noticias = await response.json();
  const container = document.getElementById('noticias-container');

  noticias.slice(0, 6).forEach(noticia => {
    const card = document.createElement('div');
    card.className = 'card-noticia';
    card.innerHTML = `
      <img src="${noticia.imagem}" alt="${noticia.titulo}">
      <h3>${noticia.titulo}</h3>
      <p>${noticia.resumo}</p>
    `;
    card.addEventListener('click', () => abrirModal(noticia));
    container.appendChild(card);
  });
  // Função para abrir o modal com os dados da notícia
function abrirModal(noticia) {
  document.getElementById('modal-titulo').textContent = noticia.titulo;
  document.getElementById('modal-imagem').src = `img/img-danton/${noticia.imagem}`;
  document.getElementById('modal-conteudo').textContent = noticia.conteudo;
  document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
setTimeout(() => {
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('modal').style.display = 'none';
    });
  }
}, 100);

  });


