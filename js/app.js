document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. LOGICA PER LO SLIDER HERO ---
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

    // --- 2. LOGICA PER IL FORM DI PRENOTAZIONE ---
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

    // --- 4. LOGICA PER LO SLIDER BANNER (3 slide) ---
    let bannerIndex = 0;
    const bannerTrack = document.getElementById('bannerTrack');
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const bannerDots = document.querySelectorAll('.banner-dot');

    window.cambiaBannerSlide = function(direzione) {
        if (!bannerTrack || bannerSlides.length === 0) return;
        bannerIndex += direzione;
        if (bannerIndex >= bannerSlides.length) bannerIndex = 0;
        if (bannerIndex < 0) bannerIndex = bannerSlides.length - 1;
        updateBanner();
    };

    window.vaiABannerSlide = function(index) {
        bannerIndex = index;
        updateBanner();
    };

    function updateBanner() {
        if (!bannerTrack) return;
        bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
        bannerDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === bannerIndex);
        });
    }

    setInterval(function() {
        if (bannerTrack) window.cambiaBannerSlide(1);
    }, 8000);

});// --- LOGICA PER LO SLIDER BANNER (3 slide) ---
document.addEventListener("DOMContentLoaded", function() {
    let bannerIndex = 0;
    const bannerTrack = document.getElementById('bannerTrack');
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const bannerDots = document.querySelectorAll('.banner-dot');

    if (!bannerTrack || bannerSlides.length === 0) return;

    window.cambiaBannerSlide = function(direzione) {
        bannerIndex += direzione;
        if (bannerIndex >= bannerSlides.length) bannerIndex = 0;
        if (bannerIndex < 0) bannerIndex = bannerSlides.length - 1;
        updateBanner();
    };

    window.vaiABannerSlide = function(index) {
        bannerIndex = index;
        updateBanner();
    };

    function updateBanner() {
        bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
        bannerDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === bannerIndex);
        });
    }

    // Auto-play ogni 8 secondi
    setInterval(function() {
        window.cambiaBannerSlide(1);
    }, 8000);
});


















































































