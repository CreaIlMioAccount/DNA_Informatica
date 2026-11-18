// =========================================
// SCRIPT PER LA PAGINA INTRODUZIONE
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Pagina Introduzione caricata correttamente.");

    // Animazione fade-in per le sezioni
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Sezioni da animare (se vuoi aggiungerle)
    document.querySelectorAll('.intro-identita, .intro-timeline-section, .intro-tech-world, .intro-vision, .intro-conclusion').forEach(el => {
        observer.observe(el);
    });
});