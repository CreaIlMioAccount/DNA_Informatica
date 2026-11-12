document.addEventListener("DOMContentLoaded", function() {
    
    // --- LOGICA PER LO SLIDER (HERO) ---
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

    window.cambiaSlide = function(direzione) {
        window.mostraSlide(indiceCorrente + direzione);
    };

    window.vaiASlide = function(indice) {
        window.mostraSlide(indice);
    };

    // Cambio automatico ogni 10 secondi
    setInterval(function() {
        window.cambiaSlide(1);
    }, 10000);


    // --- LOGICA PER APRIRE/CHIUDERE IL FORM DI PRENOTAZIONE ---
    window.toggleFormPrenotazione = function() {
        const formContainer = document.getElementById('bookingFormContainer');
        
        if (!formContainer) return; // Sicurezza se l'elemento non esiste

        if (formContainer.classList.contains('show-form')) {
            // Se è aperto, lo chiudo
            formContainer.classList.remove('show-form');
        } else {
            // Se è chiuso, lo apro e faccio scorrere la pagina fino al form
            formContainer.classList.add('show-form');
            setTimeout(() => {
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };


    // --- LOGICA PER I TAB DEI SERVIZI ---
    window.apriTab = function(indice) {
        const bottoni = document.querySelectorAll('.tab-btn');
        const cards = document.querySelectorAll('.tab-pane');

        if (bottoni.length === 0 || cards.length === 0) return;

        // Se clicchi sul tab già attivo, lo chiudi
        if (bottoni[indice].classList.contains('active')) {
            bottoni.forEach(btn => btn.classList.remove('active'));
            cards.forEach(card => card.classList.remove('active'));
            return;
        }

        // Altrimenti chiudi tutti e apri quello nuovo
        bottoni.forEach(btn => btn.classList.remove('active'));
        cards.forEach(card => card.classList.remove('active'));

        bottoni[indice].classList.add('active');
        cards[indice].classList.add('active');
    };

    // --- APERTURA AUTOMATICA DEL PRIMO TAB ALL'AVVIO ---
    // Questo comando apre il primo tab appena la pagina è caricata
    if (document.querySelector('.tab-btn')) {
        window.apriTab(0);
    }

});