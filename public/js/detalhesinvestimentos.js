function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  console.log("ID encontrado na URL:", id);
  return id;
}

async function carregarDetalhes() {
  const id = getIdFromURL();
  if (!id) {
    document.getElementById('titulo').textContent = 'ID não informado.';
    return;
  }

  try {
    const url = `http://localhost:3000/investimento/${id}`;
    console.log("Buscando dados em:", url);

    const resposta = await fetch(url);

    console.log("Status da resposta:", resposta.status);

    if (!resposta.ok) {
      throw new Error("Investimento não encontrado");
    }

    const investimento = await resposta.json();
    console.log("Dados recebidos:", investimento);

    document.getElementById('titulo').textContent = investimento.titulo;
    document.getElementById('imagem').src = investimento.imagem;
    document.getElementById('imagem').alt = investimento.titulo;
    document.getElementById('resumo').textContent = investimento.resumo;
    document.getElementById('conteudo').textContent = investimento.conteudo;

  } catch (erro) {
    console.error("Erro ao carregar os dados:", erro.message);
    document.querySelector('.container').innerHTML = `<p style="color:red;">Erro ao carregar os dados: ${erro.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', carregarDetalhes);

function salvarComentario(id, texto) {
  const comentarios = JSON.parse(localStorage.getItem('comentarios')) || {};
  if (!comentarios[id]) {
    comentarios[id] = [];
  }
  comentarios[id].push(texto);
  localStorage.setItem('comentarios', JSON.stringify(comentarios));
}

function carregarComentarios(id) {
  const comentarios = JSON.parse(localStorage.getItem('comentarios')) || {};
  const lista = document.getElementById('listaComentarios');
  lista.innerHTML = '';

  if (comentarios[id]) {
    comentarios[id].forEach(comentario => {
      const li = document.createElement('li');
      li.textContent = comentario;
      lista.appendChild(li);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarDetalhes(); // sua função original

  const id = new URLSearchParams(window.location.search).get('id');
  carregarComentarios(id);

  const form = document.getElementById('formComentario');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const texto = document.getElementById('comentarioTexto').value.trim();
    if (texto) {
      salvarComentario(id, texto);
      document.getElementById('comentarioTexto').value = '';
      carregarComentarios(id);
    }
  });
});

