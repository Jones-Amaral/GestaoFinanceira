document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-gasto");
    const tabela = document.querySelector("#tabela-gastos tbody");
    const mensagem = document.getElementById("mensagem-feedback");
  
    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let editIndex = null;
  
    renderTabela();
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const descricao = document.getElementById("descricao").value;
      const categoria = document.getElementById("categoria").value;
      const tipo = document.getElementById("tipo").value;
      const valor = parseFloat(document.getElementById("valor").value).toFixed(2);
      const data = document.getElementById("data").value;
  
      if (!descricao || !categoria || !tipo || !valor || !data) return;
  
      if (editIndex === null) {
        // Novo gasto
        gastos.push({ descricao, categoria, tipo, valor, data });
        mostrarMensagem("Gasto adicionado com sucesso!");
      } else {
        // Edição
        gastos[editIndex] = { descricao, categoria, tipo, valor, data };
        editIndex = null;
        mostrarMensagem("Gasto atualizado com sucesso!");
      }
  
      localStorage.setItem("gastos", JSON.stringify(gastos));
      form.reset();
      renderTabela();
    });
  
    function renderTabela() {
      tabela.innerHTML = "";
  
      if (gastos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6">Nenhum gasto cadastrado.</td></tr>`;
        return;
      }
  
      gastos.forEach((gasto, index) => {
        const tr = document.createElement("tr");
  
        tr.innerHTML = `
  <td data-label="Descrição">${gasto.descricao}</td>
  <td data-label="Categoria">${gasto.categoria}</td>
  <td data-label="Tipo">${gasto.tipo}</td>
  <td data-label="Valor">R$ ${gasto.valor}</td>
  <td data-label="Data">${gasto.data}</td>
  <td data-label="Ações" class="acoes">
    <button onclick="editarGasto(${index})">Editar</button>
    <button onclick="excluirGasto(${index})">Excluir</button>
  </td>
`;

  
        tabela.appendChild(tr);
      });
    }
  
    window.editarGasto = (index) => {
      const gasto = gastos[index];
      document.getElementById("descricao").value = gasto.descricao;
      document.getElementById("categoria").value = gasto.categoria;
      document.getElementById("tipo").value = gasto.tipo;
      document.getElementById("valor").value = gasto.valor;
      document.getElementById("data").value = gasto.data;
      editIndex = index;
    };
  
    window.excluirGasto = (index) => {
      if (confirm("Deseja realmente excluir este gasto?")) {
        gastos.splice(index, 1);
        localStorage.setItem("gastos", JSON.stringify(gastos));
        renderTabela();
        mostrarMensagem("Gasto removido com sucesso.");
      }
    };
  
    function mostrarMensagem(texto) {
      mensagem.textContent = texto;
      mensagem.style.opacity = 1;
  
      setTimeout(() => {
        mensagem.style.opacity = 0;
      }, 3000);
    }
  });
  