function toggleMenu() {
    const menu = document.querySelector(".pages");
    menu.classList.toggle("show");
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
