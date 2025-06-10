let jsonData = {
    "investimentos": [
      { "tipo": "Renda Fixa", "valor": 1600 },
      { "tipo": "Ações", "valor": 100 },
      { "tipo": "Fundos Imobiliários", "valor": 500 },
      { "tipo": "Criptomoedas", "valor": 300 }
    ]
  };
  
  // Carregar o Google Charts
  google.charts.load('current', { packages: ['corechart', 'table'] });
  google.charts.setOnLoadCallback(drawEverything);
  
  function drawEverything() {
    calcularERenderizarSobra();
    drawChart();
    drawTable();
    buildForm();
  }
  
  
  function drawChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Tipo de Investimento');
    data.addColumn('number', 'Valor (R$)');
  
    jsonData.investimentos
      .filter(item => item.tipo.toLowerCase() !== "renda fixa")
      .forEach(item => {
        data.addRow([item.tipo, item.valor]);
      });
  
    const options = {
      title: 'Distribuição dos Gastos/Investimentos ',
      pieHole: 0.4
    };
  
    const chart = new google.visualization.PieChart(document.getElementById('grafico'));
    chart.draw(data, options);
  }
  
  function drawTable() {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Categoria');
    data.addColumn('number', 'Valor (R$)');
  
    jsonData.investimentos.forEach((item, index) => {
      data.addRow([item.tipo, { v: item.valor, f: `R$ ${item.valor.toLocaleString()}` }]);
    });
  
    const table = new google.visualization.Table(document.getElementById('tabela'));
    table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
  }
  
  function buildForm() {
    const form = document.getElementById('form-investimentos');
    form.innerHTML = '';
    jsonData.investimentos.forEach((item, index) => {
      form.innerHTML += `
        <div style="margin-bottom: 10px;">
          <input type="text" id="tipo-${index}" value="${item.tipo}" placeholder="Tipo" />
          <input type="number" id="valor-${index}" value="${item.valor}" min="0" />
          <button type="button" onclick="removerInvestimento(${index})" style="background-color: #e74c3c;">Remover</button>
        </div>
      `;
    });
  }
  
  function atualizarDados() {
    jsonData.investimentos.forEach((_, index) => {
      const tipo = document.getElementById(`tipo-${index}`).value;
      const valor = parseFloat(document.getElementById(`valor-${index}`).value);
      if (tipo && !isNaN(valor)) {
        jsonData.investimentos[index].tipo = tipo;
        jsonData.investimentos[index].valor = valor;
      }
    });
    drawEverything();
  }
  
  function removerInvestimento(index) {
    jsonData.investimentos.splice(index, 1);
    drawEverything();
  }
  
  function adicionarInvestimento(index) {
    jsonData.investimentos.push({ "tipo": "", "valor": 0 });
    drawEverything();
  }

  function calcularERenderizarSobra() {
    const rendaFixa = jsonData.investimentos.find(item => item.tipo.toLowerCase().includes("renda fixa"));
    const outros = jsonData.investimentos.filter(item => item !== rendaFixa);
  
    if (!rendaFixa) return;
  
    const somaOutros = outros.reduce((total, item) => total + item.valor, 0);
    const sobra = rendaFixa.valor - somaOutros;
  
    const p = document.getElementById('renda-fixa-sobra');
    p.innerText = `Sobra da Renda Fixa após os outros investimentos: R$ ${sobra.toLocaleString()}`;
  }
  