

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






