// =========================================
// CARICAMENTO DINAMICO DEL FOOTER
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // Controlla se siamo dentro la cartella 'pages'
        const isInPages = window.location.pathname.includes('/pages/');
        // Se siamo in 'pages', il footer è un livello sopra
        const footerPath = isInPages ? '../footer.html' : 'footer.html';

        fetch(footerPath)
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('ERRORE FOOTER:', error));
    }
});