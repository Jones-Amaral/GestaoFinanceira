let chartInstance = null;

const API_URL = 'http://localhost:3000/gastos';

// Função utilitária para buscar todos os gastos
async function buscarGastos() {
  const resp = await fetch(API_URL);
  if (!resp.ok) throw new Error('Erro ao buscar gastos');
  return await resp.json();
}

// Função utilitária para adicionar um gasto
async function adicionarGasto(gasto) {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto)
  });
  if (!resp.ok) throw new Error('Erro ao adicionar gasto');
  return await resp.json();
}

// Função utilitária para editar um gasto
async function editarGastoBackend(id, gasto) {
  const resp = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto)
  });
  if (!resp.ok) throw new Error('Erro ao editar gasto');
  return await resp.json();
}

// Função utilitária para excluir um gasto
async function excluirGastoBackend(id) {
  const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!resp.ok && resp.status !== 204) throw new Error('Erro ao excluir gasto');
}

// Estado local para edição
let editId = null;

// DOM
const form        = document.getElementById('form-gasto');
const tabelaBody  = document.querySelector('#tabela-gastos tbody');
const feedbackBox = document.getElementById('mensagem-feedback');

// Carrega e renderiza a tabela ao iniciar
async function renderTabela() {
  tabelaBody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
  try {
    const gastos = await buscarGastos();
    if (!gastos.length) {
      tabelaBody.innerHTML = `<tr><td colspan="6">Nenhum gasto cadastrado.</td></tr>`;
      return;
    }
    tabelaBody.innerHTML = '';
    gastos.forEach((g, i) => {
      tabelaBody.insertAdjacentHTML(
        'beforeend',
        `
        <tr>
          <td data-label="Descrição">${g.descricao}</td>
          <td data-label="Categoria">${g.categoria}</td>
          <td data-label="Tipo">${g.tipo}</td>
          <td data-label="Valor">R$ ${Number(g.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td data-label="Data">${g.data}</td>
          <td data-label="Ações" class="acoes">
            <button data-editar="${g.id}">Editar</button>
            <button data-excluir="${g.id}">Excluir</button>
          </td>
        </tr>
        `
      );
    });
  } catch (err) {
    tabelaBody.innerHTML = `<tr><td colspan="6">Erro ao carregar gastos.</td></tr>`;
  }
}

// Submissão do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const descricao = form.descricao.value.trim();
  const categoria = form.categoria.value.trim();
  const tipo      = form.tipo.value;
  const valor     = Number(form.valor.value).toFixed(2);
  const data      = form.data.value;
  if (!descricao || !categoria || !tipo || !valor || !data) return;
  const novoGasto = { descricao, categoria, tipo, valor, data };
  try {
    if (editId === null) {
      await adicionarGasto(novoGasto);
      mostrarMensagem('Gasto adicionado com sucesso!');
    } else {
      await editarGastoBackend(editId, novoGasto);
      mostrarMensagem('Gasto atualizado com sucesso!');
      editId = null;
    }
    form.reset();
    await renderTabela();
  } catch (err) {
    mostrarMensagem('Erro ao salvar gasto.');
  }
});

// Ações de editar/excluir
// Usa event delegation
// (Obs: agora usa id do backend)
tabelaBody.addEventListener('click', async (e) => {
  const idEditar  = e.target.dataset.editar;
  const idExcluir = e.target.dataset.excluir;
  if (idEditar) {
    try {
      const gastos = await buscarGastos();
      const g = gastos.find(g => g.id === idEditar);
      if (!g) return mostrarMensagem('Gasto não encontrado.');
      form.descricao.value = g.descricao;
      form.categoria.value = g.categoria;
      form.tipo.value      = g.tipo;
      form.valor.value     = Number(g.valor);
      form.data.value      = g.data;
      editId = g.id;
    } catch {
      mostrarMensagem('Erro ao buscar gasto para edição.');
    }
  }
  if (idExcluir) {
    if (confirm('Deseja realmente excluir este gasto?')) {
      try {
        await excluirGastoBackend(idExcluir);
        mostrarMensagem('Gasto removido com sucesso.');
        await renderTabela();
      } catch {
        mostrarMensagem('Erro ao excluir gasto.');
      }
    }
  }
});

function mostrarMensagem(txt) {
  feedbackBox.textContent = txt;
  feedbackBox.style.opacity = 1;
  setTimeout(() => (feedbackBox.style.opacity = 0), 3000);
}

// Gráfico
async function gerarGrafico() {
  let dados;
  try {
    dados = await buscarGastos();
  } catch {
    return alert('Erro ao buscar gastos para o gráfico.');
  }
  if (!dados.length) return alert('Nenhum gasto cadastrado para mostrar.');
  const totalCat = {};
  dados.forEach(({ categoria, valor }) => {
    totalCat[categoria] = (totalCat[categoria] || 0) + Number(valor);
  });
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(document.getElementById('grafico-gastos'), {
    type: 'bar',
    data: {
      labels: Object.keys(totalCat),
      datasets: [{
        label: 'Total por categoria (R$)',
        data: Object.values(totalCat),
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title:  { display: true, text: 'Distribuição de Gastos' },
      },
      scales: { y: { beginAtZero: true } },
    },
  });
}

// Limita datas futuras
window.addEventListener('load', () => {
  const inputData = document.getElementById('data');
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm   = String(hoje.getMonth() + 1).padStart(2, '0');
  const dd   = String(hoje.getDate()).padStart(2, '0');
  const hojeISO = `${yyyy}-${mm}-${dd}`;
  const hojeBR  = `${dd}/${mm}/${yyyy}`;
  inputData.max = hojeISO;
  inputData.addEventListener('invalid', function () {
    if (this.validity.rangeOverflow) {
      const [ano, mes, dia] = this.value.split('-');
      const dataDigitadaBR = `${dia}/${mes}/${ano}`;
      this.setCustomValidity(`Uau! temos um viajante do tempo aqui😮. Mas infelizmente só aceitamos datas até hoje: ${hojeBR}.`);
    } else {
      this.setCustomValidity('');
    }
  });
  inputData.addEventListener('input', function () {
    this.setCustomValidity('');
  });
  renderTabela(); // Renderiza a tabela ao carregar a página
});

// Deixa gerarGrafico disponível globalmente
window.gerarGrafico = gerarGrafico;

