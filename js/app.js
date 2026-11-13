document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. LOGICA PER LO SLIDER (HERO) ---
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

    // --- 2. LOGICA PER APRIRE/CHIUDERE IL FORM DI PRENOTAZIONE ---
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

    // --- 3. LOGICA PER I TAB DEI SERVIZI ---
    window.apriTab = function(indice) {
        const bottoni = document.querySelectorAll('.tab-btn');
        const cards = document.querySelectorAll('.tab-pane');
        if (bottoni.length === 0 || cards.length === 0) return;
        
        // Se clicchi su un tab già attivo, lo chiudi (opzionale)
        if (bottoni[indice].classList.contains('active')) {
            bottoni.forEach(btn => btn.classList.remove('active'));
            cards.forEach(card => card.classList.remove('active'));
            return;
        }
        
        // Rimuovi active da tutti
        bottoni.forEach(btn => btn.classList.remove('active'));
        cards.forEach(card => card.classList.remove('active'));
        
        // Aggiungi active a quello scelto
        bottoni[indice].classList.add('active');
        cards[indice].classList.add('active');
    };

    // *** QUESTA È LA RIGA FONDAMENTALE CHE MANCAVA ***
    // Attiva il primo tab all'avvio
    if (document.querySelector('.tab-btn')) {
        window.apriTab(0);
    }

});