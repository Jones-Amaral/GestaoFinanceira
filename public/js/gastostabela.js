
let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  const form        = document.getElementById("form-gasto");
  const tabelaBody  = document.querySelector("#tabela-gastos tbody");
  const feedbackBox = document.getElementById("mensagem-feedback");

  let gastos    = JSON.parse(localStorage.getItem("gastos")) || [];
  let editIndex = null;




  renderTabela();

  
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const descricao = form.descricao.value.trim();
    const categoria = form.categoria.value.trim();
    const tipo      = form.tipo.value;
    const valor     = Number(form.valor.value).toFixed(2);
    const data      = form.data.value;

    if (!descricao || !categoria || !tipo || !valor || !data) return;

    const novoGasto = { descricao, categoria, tipo, valor, data };

    if (editIndex === null) {
      gastos.push(novoGasto);
      mostrarMensagem("Gasto adicionado com sucesso!");
    } else {
      gastos[editIndex] = novoGasto;
      editIndex = null;
      mostrarMensagem("Gasto atualizado com sucesso!");
    }

    salvar();
    form.reset();
    renderTabela();
  });

  
  tabelaBody.addEventListener("click", (e) => {
    const idxEditar  = e.target.dataset.editar;
    const idxExcluir = e.target.dataset.excluir;

    if (idxEditar  !== undefined) editarGasto(+idxEditar);
    if (idxExcluir !== undefined) excluirGasto(+idxExcluir);
  });

  
  function renderTabela() {
    tabelaBody.innerHTML = "";

    if (!gastos.length) {
      tabelaBody.innerHTML = `<tr><td colspan="6">Nenhum gasto cadastrado.</td></tr>`;
      return;
    }

    gastos.forEach((g, i) => {
      tabelaBody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td data-label="Descrição">${g.descricao}</td>
          <td data-label="Categoria">${g.categoria}</td>
          <td data-label="Tipo">${g.tipo}</td>
          <td data-label="Valor">R$ ${Number(g.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          <td data-label="Data">${g.data}</td>
          <td data-label="Ações" class="acoes">
            <button data-editar="${i}">Editar</button>
            <button data-excluir="${i}">Excluir</button>
          </td>
        </tr>
        `
      );
    });
  }

  function editarGasto(i) {
    const g = gastos[i];
    form.descricao.value = g.descricao;
    form.categoria.value = g.categoria;
    form.tipo.value      = g.tipo;
    form.valor.value     = Number(g.valor);
    form.data.value      = g.data;
    editIndex = i;
  }

  function excluirGasto(i) {
    if (confirm("Deseja realmente excluir este gasto?")) {
      gastos.splice(i, 1);
      salvar();
      renderTabela();
      mostrarMensagem("Gasto removido com sucesso.");
    }
  }

  function mostrarMensagem(txt) {
    feedbackBox.textContent = txt;
    feedbackBox.style.opacity = 1;
    setTimeout(() => (feedbackBox.style.opacity = 0), 3000);
  }

  function salvar() {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }
});

/* ---------- GRÁFICO ---------- */
function gerarGrafico() {
  const dados = JSON.parse(localStorage.getItem("gastos")) || [];
  if (!dados.length) return alert("Nenhum gasto cadastrado para mostrar.");

  /* soma total por categoria */
  const totalCat = {};
  dados.forEach(({ categoria, valor }) => {
    totalCat[categoria] = (totalCat[categoria] || 0) + Number(valor);
  });

  /* destroi gráfico anterior */
  if (chartInstance) chartInstance.destroy();

  /* cria gráfico novo */
  chartInstance = new Chart(document.getElementById("grafico-gastos"), {
    type: "bar",
    data: {
      labels: Object.keys(totalCat),
      datasets: [{
        label: "Total por categoria (R$)",
        data: Object.values(totalCat),
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title:  { display: true, text: "Distribuição de Gastos" },
      },
      scales: { y: { beginAtZero: true } },
    },
  });
}
// data futura limitada
window.addEventListener("load", () => {
  const inputData = document.getElementById("data");

  /* Limita datas futuras */
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm   = String(hoje.getMonth() + 1).padStart(2, "0");
  const dd   = String(hoje.getDate()).padStart(2, "0");
  const hojeISO = `${yyyy}-${mm}-${dd}`;
  const hojeBR  = `${dd}/${mm}/${yyyy}`;
  inputData.max = hojeISO;

  /* Mensagem personalizada */
  inputData.addEventListener("invalid", function () {
    if (this.validity.rangeOverflow) {
      const [ano, mes, dia] = this.value.split("-");
      const dataDigitadaBR = `${dia}/${mes}/${ano}`;
      this.setCustomValidity(`Uau! temos um viajante do tempo aqui😮. Mas infelizmente só aceitamos datas até hoje: ${hojeBR}.`);
    } else {
      this.setCustomValidity("");
    }
  });

  /* Limpa mensagem ao digitar */
  inputData.addEventListener("input", function () {
    this.setCustomValidity("");
  });
});

