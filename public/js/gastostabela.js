'use strict';

// --- CONFIGURAÇÃO E ESTADO GLOBAL ---
const API_URL = 'http://localhost:3000/gastos';
let chartInstance = null; // Guarda a instância do gráfico para poder destruí-la
let editId = null; // Controla o ID do item em edição para o formulário

// --- FUNÇÕES DE INTERAÇÃO COM A API (BACKEND) ---

// Busca todos os gastos do servidor
async function buscarGastos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Erro ao buscar gastos do servidor.');
  return await response.json();
}

// Adiciona um novo gasto no servidor
async function adicionarGasto(gasto) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto),
  });
  if (!response.ok) throw new Error('Erro ao adicionar gasto.');
  return await response.json();
}

// Edita um gasto existente no servidor
async function editarGastoBackend(id, gasto) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto),
  });
  if (!response.ok) throw new Error('Erro ao editar gasto.');
  return await response.json();
}

// Exclui um gasto do servidor
async function excluirGastoBackend(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao excluir gasto.');
}

// --- FUNÇÕES DE MANIPULAÇÃO DA INTERFACE (UI) ---

// Renderiza a tabela de gastos na página
async function renderTabela() {
  const tabelaBody = document.querySelector('#tabela-gastos tbody');
  if (!tabelaBody) {
      console.error("Elemento 'tbody' da tabela de gastos não foi encontrado!");
      return;
  }

  tabelaBody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
  try {
    const gastos = await buscarGastos();
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de preencher

    if (!gastos.length) {
      tabelaBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1rem;">Nenhum gasto cadastrado.</td></tr>`;
      return;
    }

    gastos.forEach(gasto => {
      // Formata o valor para o padrão BRL (R$ 1.234,56)
      const valorFormatado = Number(gasto.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      // Formata a data para dd/mm/aaaa
      const [ano, mes, dia] = gasto.data.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const tr = `
        <tr>
          <td data-label="Descrição">${gasto.descricao}</td>
          <td data-label="Categoria">${gasto.categoria}</td>
          <td data-label="Tipo">${gasto.tipo}</td>
          <td data-label="Valor">${valorFormatado}</td>
          <td data-label="Data">${dataFormatada}</td>
          <td data-label="Ações" class="acoes">
            <button data-editar="${gasto.id}">Editar</button>
            <button data-excluir="${gasto.id}">Excluir</button>
          </td>
        </tr>
      `;
      tabelaBody.insertAdjacentHTML('beforeend', tr);
    });
  } catch (error) {
    console.error("Falha ao renderizar tabela:", error);
    tabelaBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1rem; color: red;">Erro ao carregar os dados.</td></tr>`;
  }
}

// Mostra uma mensagem de feedback temporária
function mostrarMensagem(texto) {
    const feedbackBox = document.getElementById('mensagem-feedback');
    if (!feedbackBox) return;

    feedbackBox.textContent = texto;
    feedbackBox.style.opacity = 1;
    setTimeout(() => {
        feedbackBox.style.opacity = 0;
    }, 3000);
}

// Gera o gráfico de pizza
async function gerarGrafico() {
  let gastos;
  try {
    gastos = await buscarGastos();
  } catch (error) {
    return alert('Erro ao buscar dados para o gráfico.');
  }

  if (!gastos.length) {
    return alert('Nenhum gasto cadastrado para exibir no gráfico.');
  }

  const totalPorCategoria = gastos.reduce((acc, { categoria, valor }) => {
    acc[categoria] = (acc[categoria] || 0) + Number(valor);
    return acc;
  }, {});

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(document.getElementById('grafico-gastos'), {
    type: 'pie',
    data: {
      labels: Object.keys(totalPorCategoria),
      datasets: [{
        label: 'Total Gasto por Categoria (R$)',
        data: Object.values(totalPorCategoria),
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC926'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Distribuição de Gastos por Categoria', font: {size: 16} }
      }
    }
  });
}

// --- INICIALIZAÇÃO E EVENT LISTENERS ---

// Roda quando o HTML da página está completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-gasto');
    const tabelaBody = document.querySelector('#tabela-gastos tbody');
    const inputData = document.getElementById('data');

    // Verifica se os elementos essenciais existem antes de continuar
    if (!form || !tabelaBody || !inputData) {
        console.error("Um ou mais elementos essenciais do HTML (formulário, corpo da tabela ou input de data) não foram encontrados. Verifique os IDs.");
        return;
    }

    // 1. Configura o formulário para Adicionar/Editar
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const gastoData = {
            descricao: form.descricao.value.trim(),
            categoria: form.categoria.value.trim(),
            tipo: form.tipo.value,
            valor: Number(form.valor.value).toFixed(2),
            data: form.data.value,
        };

        try {
            if (editId) {
                await editarGastoBackend(editId, gastoData);
                mostrarMensagem('Gasto atualizado com sucesso!');
                editId = null; // Sai do modo de edição
            } else {
                await adicionarGasto(gastoData);
                mostrarMensagem('Gasto adicionado com sucesso!');
            }
            form.reset();
            await renderTabela(); // Atualiza a tabela
        } catch (error) {
            console.error("Falha ao salvar:", error);
            mostrarMensagem('Erro ao salvar o gasto.');
        }
    });

    // 2. Configura a tabela para cliques em Editar/Excluir
    tabelaBody.addEventListener('click', async (e) => {
        const idParaEditar = e.target.dataset.editar;
        const idParaExcluir = e.target.dataset.excluir;

        if (idParaEditar) {
            try {
                const gastos = await buscarGastos();
                const gasto = gastos.find(g => g.id === idParaEditar);
                if (!gasto) return mostrarMensagem('Gasto não encontrado.');

                // Preenche o formulário com os dados do gasto
                form.descricao.value = gasto.descricao;
                form.categoria.value = gasto.categoria;
                form.tipo.value = gasto.tipo;
                form.valor.value = Number(gasto.valor);
                form.data.value = gasto.data;
                editId = g.id; // Entra no modo de edição

                form.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                mostrarMensagem('Erro ao buscar gasto para edição.');
            }
        }

        if (idParaExcluir) {
            if (confirm('Deseja realmente excluir este gasto?')) {
                try {
                    await excluirGastoBackend(idParaExcluir);
                    mostrarMensagem('Gasto removido com sucesso.');
                    await renderTabela();
                } catch (error) {
                    mostrarMensagem('Erro ao excluir gasto.');
                }
            }
        }
    });

    // 3. Limita o campo de data para não aceitar datas futuras
    inputData.max = new Date().toISOString().split("T")[0];

    // 4. FINALMENTE, RENDERIZA A TABELA AO CARREGAR A PÁGINA
    renderTabela();
});

// Disponibiliza a função gerarGrafico globalmente para o `onclick` do HTML
window.gerarGrafico = gerarGrafico;
