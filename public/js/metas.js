// Elementos principais
const btnNovaMeta = document.getElementById("btnNovaMeta");
const secaoFormulario = document.getElementById("formularioMeta");
let formMeta = document.getElementById("formMeta");
const btnCancelar = document.getElementById("cancelarMeta");
const corpoTabela = document.getElementById("corpoTabelaMetas");

// Mostrar formulário
btnNovaMeta.addEventListener("click", () => {
  secaoFormulario.style.display = "block";
  secaoFormulario.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


// Cancelar cadastro
btnCancelar.addEventListener("click", () => {
  secaoFormulario.style.display = "none";
  formMeta.reset();
});

// Exibir notificação toast
function mostrarNotificacao(mensagem) {
  const div = document.getElementById("notificacao");
  div.textContent = mensagem;
  div.classList.add("mostrar");

  setTimeout(() => {
    div.classList.remove("mostrar");
    div.classList.add("escondido");
  }, 3000);

  setTimeout(() => {
    div.classList.remove("escondido");
    div.textContent = "";
  }, 3500);
}

// Carregar metas do localStorage
function carregarMetas() {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  corpoTabela.innerHTML = "";

  metas.forEach((meta, index) => {
    const tr = document.createElement("tr");

    const progresso = calcularProgresso(meta.valorAtual, meta.valorObjetivo);
    const status = definirStatus(meta.valorAtual, meta.valorObjetivo, meta.dataLimite);
    const restante = meta.valorObjetivo - meta.valorAtual;
    const textoRestante = restante <= 0
      ? "Meta alcançada!"
      : `Faltam ${restante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para alcançar sua meta.`;


    const corStatus =
      status === "Concluída" ? "concluida" :
        status === "Vencida" ? "vencida" : "andamento";

    let corBarra = "#ccc";
    if (progresso >= 100) corBarra = "green";
    else if (progresso >= 30) corBarra = "#0c1c3b";

    tr.innerHTML = `
      <td>${meta.nome}</td>
  <td>${meta.valorObjetivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
<td>${meta.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>

      <td>${meta.dataLimite}</td>
      <td><progress value="${progresso}" max="100" style="accent-color: ${corBarra};"></progress> ${progresso}%</td>
<td>
  <span class="status ${corStatus}">${status}</span><br>
  <span class="faltam-texto">${textoRestante}</span>
</td>
      <td class="acoes">
        <button onclick="adicionarValor(${index})">+ Valor</button>
        <button onclick="removerValor(${index})">- Valor</button>
        <button onclick="editarMeta(${index})">Editar</button>
        <button onclick="removerMeta(${index})">Remover</button>
      </td>
    `;

    corpoTabela.appendChild(tr);
  });
}

// Calcular progresso da meta
function calcularProgresso(atual, objetivo) {
  const porcentagem = (atual / objetivo) * 100;
  return porcentagem > 100 ? 100 : porcentagem.toFixed(0);
}

// Determinar status da meta
function definirStatus(atual, objetivo, dataLimite) {
  const hoje = new Date();
  const limite = new Date(dataLimite);

  if (atual >= objetivo) return "Concluída";
  if (hoje > limite) return "Vencida";
  return "Em andamento";
}

// Adicionar nova meta
formMeta.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomeMeta").value;
  const valorObjetivo = parseFloat(document.getElementById("valorObjetivo").value);
  const valorAtual = parseFloat(document.getElementById("valorAtual").value);
  const dataLimite = document.getElementById("dataLimite").value;

  const novaMeta = {
    nome,
    valorObjetivo,
    valorAtual,
    dataLimite
  };

  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas.push(novaMeta);
  localStorage.setItem("metas", JSON.stringify(metas));

  formMeta.reset();
  secaoFormulario.style.display = "none";
  carregarMetas();
  mostrarNotificacao("✅ Meta criada com sucesso!");
});

// Remover meta
function removerMeta(index) {
  if (confirm("Tem certeza que deseja remover esta meta?")) {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    metas.splice(index, 1);
    localStorage.setItem("metas", JSON.stringify(metas));
    carregarMetas();
    mostrarNotificacao("🗑️ Meta removida com sucesso!");
  }
}

// Adicionar valor à meta
function adicionarValor(index) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const valor = parseFloat(prompt("Digite o valor a adicionar:"));

  if (!isNaN(valor) && valor > 0) {
    metas[index].valorAtual += valor;
    localStorage.setItem("metas", JSON.stringify(metas));
    carregarMetas();
    mostrarNotificacao("💰 Valor adicionado com sucesso!");
  } else {
    mostrarNotificacao("❌ Valor inválido.");
  }
}

// Remover valor da meta
function removerValor(index) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const valor = parseFloat(prompt("Digite o valor a remover:"));

  if (!isNaN(valor) && valor > 0) {
    metas[index].valorAtual -= valor;
    if (metas[index].valorAtual < 0) metas[index].valorAtual = 0;
    localStorage.setItem("metas", JSON.stringify(metas));
    carregarMetas();
    mostrarNotificacao("🧾 Valor removido com sucesso!");
  } else {
    mostrarNotificacao("❌ Valor inválido.");
  }
}

// Editar meta existente
function editarMeta(index) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas[index];

  // Preenche o formulário
  document.getElementById("nomeMeta").value = meta.nome;
  document.getElementById("valorObjetivo").value = meta.valorObjetivo;
  document.getElementById("valorAtual").value = meta.valorAtual;
  document.getElementById("dataLimite").value = meta.dataLimite;

  secaoFormulario.style.display = "block";

  // Substitui o evento de submit
  const novoForm = formMeta.cloneNode(true);
  formMeta.parentNode.replaceChild(novoForm, formMeta);
  formMeta = novoForm;

  formMeta.addEventListener("submit", function (e) {
    e.preventDefault();

    meta.nome = document.getElementById("nomeMeta").value;
    meta.valorObjetivo = parseFloat(document.getElementById("valorObjetivo").value);
    meta.valorAtual = parseFloat(document.getElementById("valorAtual").value);
    meta.dataLimite = document.getElementById("dataLimite").value;

    metas[index] = meta;
    localStorage.setItem("metas", JSON.stringify(metas));

    formMeta.reset();
    secaoFormulario.style.display = "none";
    carregarMetas();
    mostrarNotificacao("✏️ Meta editada com sucesso!");
  });

  // Botão de cancelar no novo form
  const novoCancelar = document.getElementById("cancelarMeta");
  novoCancelar.addEventListener("click", () => {
    secaoFormulario.style.display = "none";
    formMeta.reset();
  });
}

// Inicializa ao carregar a página
carregarMetas();
