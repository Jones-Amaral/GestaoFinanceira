function toggleMenu() {
  const menu = document.querySelector(".pages");
  menu.classList.toggle("show");
}

let currentIndex = 0;
let slides = [];

document.addEventListener("DOMContentLoaded", () => {
  const carrossel = document.querySelector('.carrossel');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  fetch('http://localhost:3000/investimento')
    .then(res => res.json())
    .then(data => {
      data.forEach(investimento => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.setAttribute('data-id', investimento.id);

        slide.innerHTML = `
          <a href="detalhesinvestimentos.html?id=${investimento.id}">
            <img src="${investimento.imagem}" alt="${investimento.titulo}" />
          </a>
        `;

        const btn = document.createElement('button');
        btn.classList.add('favorito-btn');
        btn.setAttribute('data-id', investimento.id);
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const icon = btn.querySelector('i');
          icon.classList.toggle('fa-regular');
          icon.classList.toggle('fa-solid');
        });

        slide.appendChild(btn);
        slide.style.position = 'relative';
        carrossel.appendChild(slide);
      });

      slides = document.querySelectorAll('.slide');
      updateCarrossel();

      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarrossel();
      });

      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarrossel();
      });
    });
});

function updateCarrossel() {
  const carrossel = document.querySelector('.carrossel');
  const offset = -currentIndex * 100;
  carrossel.style.transform = `translateX(${offset}%)`;
}


function toggleUserMenu() {
  const menu = document.getElementById('userDropdown');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function logout() {
  alert('Você saiu da conta.');
  // Aqui você pode apagar tokens/sessão se estiver usando login real
}

// Fecha o menu se clicar fora
window.addEventListener('click', function (e) {
  if (!e.target.matches('.fa-user')) {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown && dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    }
  }
});

//Função dropdown do menu//
function toggleMenu() {
  const menu = document.getElementById("menuDropdown");
  menu.classList.toggle("show");
}

// Fecha o menu-dropdown ao clicar fora
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("menuDropdown");
  const menuIcon = document.querySelector(".fa-bars");

// Se o clique for fora do menu e do ícone, fecha
  if (!dropdown.contains(event.target) && !menuIcon.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});





