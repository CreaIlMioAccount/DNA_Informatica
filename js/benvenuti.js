// =========================================
// SCRIPT PER LA PAGINA BENVENUTI
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Pagina Benvenuti caricata correttamente.");
});

// =========================================
// FUNZIONE PER ESPANDERE/COMPRIMERE IL TESTO
// =========================================
function toggleTesto(idAccordion, bottone) {
    const accordion = document.getElementById(idAccordion);
    if (!accordion) return;
    
    if (accordion.classList.contains('espanso')) {
        accordion.classList.remove('espanso');
        bottone.innerHTML = 'Leggi tutto ↓';
    } else {
        accordion.classList.add('espanso');
        bottone.innerHTML = 'Mostra meno ↑';
    }
}