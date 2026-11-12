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

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.has-megamenu')) {
            document.querySelectorAll('.has-megamenu.active').forEach(menu => menu.classList.remove('active'));
        }
    });

    // --- 4. LOGICA PER LO SLIDER (HERO) ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let indiceCorrente = 0;

    window.mostraSlide = function(indice) {
        if(slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        if (indice >= slides.length) indiceCorrente = 0;
        else if (indice < 0) indiceCorrente = slides.length - 1;
        else indiceCorrente = indice;
        slides[indiceCorrente].classList.add('active');
        if (dots[indiceCorrente]) dots[indiceCorrente].classList.add('active');
    }
    window.cambiaSlide = function(direzione) { window.mostraSlide(indiceCorrente + direzione); };
    window.vaiASlide = function(indice) { window.mostraSlide(indice); };
    setInterval(function() { window.cambiaSlide(1); }, 10000);

    // --- 5. LOGICA PER APRIRE/CHIUDERE IL FORM DI PRENOTAZIONE ---
    window.toggleFormPrenotazione = function() {
        const formContainer = document.getElementById('bookingFormContainer');
        if (!formContainer) return;
        if (formContainer.classList.contains('show-form')) {
            formContainer.classList.remove('show-form');
        } else {
            formContainer.classList.add('show-form');
            setTimeout(() => formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
    };

    // --- 6. LOGICA PER I TAB DEI SERVIZI ---
    window.apriTab = function(indice) {
        const bottoni = document.querySelectorAll('.tab-btn');
        const cards = document.querySelectorAll('.tab-pane');
        if (bottoni.length === 0 || cards.length === 0) return;
        if (bottoni[indice].classList.contains('active')) {
            bottoni.forEach(btn => btn.classList.remove('active'));
            cards.forEach(card => card.classList.remove('active'));
            return;
        }
        bottoni.forEach(btn => btn.classList.remove('active'));
        cards.forEach(card => card.classList.remove('active'));
        bottoni[indice].classList.add('active');
        cards[indice].classList.add('active');
    };
    if (document.querySelector('.tab-btn')) window.apriTab(0);

    // --- 7. ATTIVAZIONE HAMBURGER MENU ---
    function attivaHamburger() {
        const hamburger = document.querySelector('.hamburger-btn');
        const mainNav = document.getElementById('mainNav');

        if (hamburger && mainNav) {
            // Rimuoviamo eventuali listener precedenti per evitare doppi click
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
                    // Se il link è un link normale (non un toggle megamenu), chiudi il menu
                    if (!this.parentElement.classList.contains('has-megamenu')) {
                        mainNav.classList.remove('open');
                    }
                });
            });
        }
    }

});