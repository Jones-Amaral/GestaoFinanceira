
// 1. Pegar o ID da URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// 2. Carregar os dados do JSON (simulação local)
fetch('http://localhost:3000/investimento')
  .then(res => res.json())
  .then(dados => {
    const investimento = dados.find(inv => inv.id == id);

    if (!investimento) {
      document.getElementById('conteudo-detalhes').innerHTML = '<p>Investimento não encontrado.</p>';
      return;
    }

    // 3. Montar HTML com os dados
    document.getElementById('conteudo-detalhes').innerHTML = `
      <h2>${investimento.nome}</h2>
      <img src="${investimento.imagem}" alt="${investimento.nome}" style="max-width: 300px;">
      <p><strong>Categoria:</strong> ${investimento.categoria}</p>
      <p><strong>Rentabilidade:</strong> ${investimento.rentabilidade}</p>
      <p><strong>Risco:</strong> ${investimento.risco}</p>
      <p><strong>Descrição:</strong> ${investimento.descricao}</p>
    `;
  })
  .catch(error => {
    console.error(error);
    document.getElementById('conteudo-detalhes').innerHTML = '<p>Erro ao carregar os dados.</p>';
  });
