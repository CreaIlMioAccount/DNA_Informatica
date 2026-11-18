document.addEventListener("DOMContentLoaded", function() {

    // --- 1. CARICAMENTO DEL MENU DA FILE ESTERNO ---
    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        const isInPages = window.location.pathname.includes('/pages/');
        const menuPath = isInPages ? '../menu.html' : 'menu.html';

        fetch(menuPath)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
                attivaHamburger();
            })
            .catch(error => console.error('ERRORE MENU:', error));
    }

    // --- 2. FRECCE DESKTOP ---
    window.scrollMenu = function(direzione) {
        const nav = document.getElementById('mainNav');
        if (nav) nav.scrollBy({ left: direzione * 200, behavior: 'smooth' });
    };

    // --- 3. LOGICA MEGAMENU (CORRETTA PER I LINK INTERNI) ---
    window.toggleMegamenu = function(event, elemento) {
        // 1. Se il click è su un link DENTRO il megamenu, lascialo navigare!
        if (event.target.closest('.megamenu')) {
            return; // Esci subito, non fare preventDefault
        }

        // 2. Se il click è sul testo del menu principale (es. "Home"), lascialo navigare
        if (event.target.classList.contains('home-link') || event.target.closest('.home-link')) {
            return;
        }

        // 3. Altrimenti (click sulla freccia o sullo spazio vuoto della riga), gestisci l'apertura
        event.preventDefault();
        event.stopPropagation();

        const hasMegamenu = elemento.closest('.has-megamenu');
        if (!hasMegamenu) return;

        // Chiudi tutti gli altri menu
        document.querySelectorAll('.has-megamenu.active').forEach(menu => {
            if (menu !== hasMegamenu) menu.classList.remove('active');
        });

        // Apri/Chiudi questo menu
        hasMegamenu.classList.toggle('active');
    };

    // Chiudi il menu se clicchi fuori (sia desktop che mobile)
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.has-megamenu') && !event.target.closest('.toggle-mega')) {
            document.querySelectorAll('.has-megamenu.active').forEach(menu => menu.classList.remove('active'));
        }
    });

    // --- 4. HAMBURGER MENU ---
    function attivaHamburger() {
        const hamburger = document.querySelector('.hamburger-btn');
        const mainNav = document.getElementById('mainNav');

        if (hamburger && mainNav) {
            hamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                mainNav.classList.toggle('open');
            });
        }
    }

});