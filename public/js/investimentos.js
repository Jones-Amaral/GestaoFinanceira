function toggleMenu() {
  const menu = document.querySelector(".pages")
  menu.classList.toggle("show")
}

const carrossel = document.querySelector('.carrossel');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
let currentIndex = 0;

function updateCarrossel() {
  const offset = -currentIndex * 100;
  carrossel.style.transform = `translateX(${offset}%)`;
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarrossel();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarrossel();
});

document.querySelectorAll('.slide').forEach(slide => {
  slide.addEventListener('click', () => {
    const tipo = slide.getAttribute('data-id');
    const infoBox = document.getElementById('info-investimento');

    const conteudo = {
      bitcoin: {
        titulo: "Criptomoedas",
        texto: "As criptomoedas, como o Bitcoin e o Ethereum, representam uma revolução no sistema financeiro. Elas são moedas digitais descentralizadas, operando por meio da tecnologia blockchain — uma estrutura segura e transparente que dispensa intermediários, como bancos. <br><br>Investir em criptoativos pode trazer grandes retornos em curto espaço de tempo, mas também apresenta alta volatilidade e riscos consideráveis. É ideal para investidores com perfil mais arrojado, dispostos a acompanhar tendências tecnológicas e econômicas. A chave é estudar o mercado, acompanhar notícias e investir com cautela e estratégia."
      },
      bolsa: {
        titulo: "Bolsa de Valores",
        texto: "A bolsa de valores é o ambiente onde se negociam ações de empresas de capital aberto, títulos de dívida e outros ativos financeiros. Investir em ações significa tornar-se sócio de empresas, participando de seus lucros (via dividendos) e crescimento (via valorização das ações). <br><br>Esse tipo de investimento é excelente para quem pensa no longo prazo, já que a oscilação diária do mercado pode assustar os iniciantes. Porém, com estudo, disciplina e diversificação, a bolsa oferece grandes oportunidades de construção de patrimônio. É uma ferramenta essencial para quem busca independência financeira."
      },
      ouro: {
        titulo: "Ouro",
        texto: "O ouro é um dos ativos mais antigos e valorizados da história da humanidade. Ele é visto como um “porto seguro” nos investimentos, pois tende a se valorizar em momentos de crise econômica, instabilidade política ou alta inflação. <br><br>Embora não gere renda como dividendos ou juros, o ouro preserva valor ao longo do tempo, sendo uma excelente opção para diversificação de portfólio. Também é utilizado como proteção contra a desvalorização de moedas locais. É indicado tanto para investidores conservadores quanto para aqueles que buscam equilíbrio em tempos incertos."
      }
    };

    if (conteudo[tipo]) {
      infoBox.innerHTML = `<h3>${conteudo[tipo].titulo}</h3><p>${conteudo[tipo].texto}</p>`;
    }
  });
});

document.querySelectorAll('.slide').forEach(slide => {
  const tipo = slide.getAttribute('data-id');

  const btn = document.createElement('button');
  btn.classList.add('favorito-btn');
  btn.setAttribute('data-id', tipo);
  btn.innerHTML = '<i class="fa-regular fa-heart"></i>';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-regular'); 
    icon.classList.toggle('fa-solid');   
  });

  slide.style.position = 'relative';
  slide.appendChild(btn);
});




