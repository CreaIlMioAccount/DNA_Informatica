document.addEventListener("DOMContentLoaded", function() {

    // --- 1. CARICAMENTO DEL MENU DA FILE ESTERNO ---
    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        fetch('menu.html')
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
                attivaHamburger();
            })
            .catch(error => console.error('ERRORE MENU:', error));
    }

    // --- 2. FUNZIONE PER LE FRECCE DEL MENU (DESKTOP) ---
    window.scrollMenu = function(direzione) {
        const nav = document.getElementById('mainNav');
        if (nav) nav.scrollBy({ left: direzione * 200, behavior: 'smooth' });
    };

    // --- 3. LOGICA PER I MEGA MENU (APERTURA AL CLICK) ---
    window.toggleMegamenu = function(event, elemento) {
        event.preventDefault(); 
        event.stopPropagation(); 
        const hasMegamenu = elemento.closest('.has-megamenu');
        if (!hasMegamenu) return;

        // Chiudi gli altri megamenu aperti
        const tuttiIMegamenu = document.querySelectorAll('.has-megamenu.active');
        tuttiIMegamenu.forEach(menu => {
            if (menu !== hasMegamenu) menu.classList.remove('active');
        });

        // Apri/Chiudi questo megamenu
        hasMegamenu.classList.toggle('active');
    };

    // Chiudi megamenu se clicchi fuori
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.has-megamenu')) {
            document.querySelectorAll('.has-megamenu.active').forEach(menu => menu.classList.remove('active'));
        }
    });

    // --- 4. ATTIVAZIONE HAMBURGER MENU ---
    function attivaHamburger() {
        const hamburger = document.querySelector('.hamburger-btn');
        const mainNav = document.getElementById('mainNav');

        if (hamburger && mainNav) {
            hamburger.removeEventListener('click', toggleMenu);
            
            function toggleMenu(e) {
                e.preventDefault();
                e.stopPropagation();
                mainNav.classList.toggle('open');
            }
            
            hamburger.addEventListener('click', toggleMenu);

            // Chiudi il menu quando si clicca su un link normale (non megamenu)
            const links = mainNav.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (!this.parentElement.classList.contains('has-megamenu')) {
                        mainNav.classList.remove('open');
                    }
                });
            });
        }
    }

});