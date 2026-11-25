
document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. CONFIGURAZIONE PREVENTIVO
    // ==========================================

    const STORAGE_KEY = "dna_quote_services";

    function getServices() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            console.error("Errore lettura preventivo:", error);
            return [];
        }
    }

    function saveServices(services) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
            return true;
        } catch (error) {
            console.error("Errore salvataggio preventivo:", error);
            return false;
        }
    }

    // ==========================================
    // 2. AGGIORNAMENTO GLOBALE INTERFACCIA
    // ==========================================

    function updateGlobalUI() {

        const services = getServices();

        document.querySelectorAll(
            "[data-quote-add], .pricing-add-quote"
        ).forEach(button => {

            const alreadyAdded = services.some(
                service => service.id === button.dataset.id
            );

            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent.trim();
            }

            if (alreadyAdded) {
                button.textContent = "Aggiunto ✓";
                button.classList.add("added");
            } else {
                button.textContent = button.dataset.originalText;
                button.classList.remove("added");
            }
        });

        // Aggiorna contatore header
        const headerBadge = document.getElementById("header-quote-count");

        if (headerBadge) {

            const count = services.length;

            headerBadge.textContent = count;

            headerBadge.setAttribute(
                "aria-label",
                count === 1
                    ? "1 servizio nel preventivo"
                    : count + " servizi nel preventivo"
            );
        }
    }

    // ==========================================
    // 3. AGGIUNTA SERVIZI AL PREVENTIVO
    // ==========================================

    document.addEventListener("click", function(event) {

        const button = event.target.closest(
            "[data-quote-add], .pricing-add-quote"
        );

        if (!button) return;

        const service = {

            id: button.dataset.id,

            name: button.dataset.name,

            description: button.dataset.description,

            tag: button.dataset.tag,

            icon: button.dataset.icon || "default",

            // NUOVO: PREZZO DEL SERVIZIO
            price: Number(button.dataset.price) || 0
        };

        if (!service.id) {
            console.error("Servizio senza ID:", button);
            return;
        }

        const services = getServices();

        const alreadyAdded = services.some(
            item => item.id === service.id
        );

        if (alreadyAdded) {
            updateGlobalUI();
            return;
        }

        services.push(service);

        if (!saveServices(services)) {
            return;
        }

        updateGlobalUI();

        window.dispatchEvent(
            new Event("dna_quote_updated")
        );
    });

    // ==========================================
    // 4. ASCOLTO MODIFICHE AL PREVENTIVO
    // ==========================================

    window.addEventListener(
        "dna_quote_updated",
        updateGlobalUI
    );

    window.addEventListener("storage", function(event) {

        if (event.key === STORAGE_KEY) {
            updateGlobalUI();
        }
    });

    // ==========================================
    // 5. CARICAMENTO MENU ESTERNO
    // ==========================================

    const placeholder = document.getElementById(
        "header-placeholder"
    );

    if (placeholder) {

        const isInPages = window.location.pathname.includes("/pages/");

        const menuPath = isInPages
            ? "../menu.html"
            : "menu.html";

        fetch(menuPath)
            .then(response => {

                if (!response.ok) {
                    throw new Error("Impossibile caricare menu.html");
                }

                return response.text();
            })
            .then(data => {

                placeholder.innerHTML = data;

                attivaHamburger();

                updateGlobalUI();
            })
            .catch(error => {
                console.error("ERRORE MENU:", error);
            });
    }

    // ==========================================
    // 6. FRECCE DESKTOP
    // ==========================================

    window.scrollMenu = function(direzione) {

        const nav = document.getElementById("mainNav");

        if (nav) {
            nav.scrollBy({
                left: direzione * 200,
                behavior: "smooth"
            });
        }
    };

    // ==========================================
    // 7. LOGICA MEGAMENU
    // ==========================================

    window.toggleMegamenu = function(event, elemento) {

        event.preventDefault();
        event.stopPropagation();

        const hasMegamenu = elemento.closest(".has-megamenu");

        if (!hasMegamenu) return;

        document.querySelectorAll(".has-megamenu.active").forEach(menu => {

            if (menu !== hasMegamenu) {
                menu.classList.remove("active");
            }
        });

        hasMegamenu.classList.toggle("active");
    };

    document.addEventListener("click", function(event) {

        if (!event.target.closest(".has-megamenu")) {

            document.querySelectorAll(".has-megamenu.active").forEach(menu => {
                menu.classList.remove("active");
            });
        }
    });

    // ==========================================
    // 8. HAMBURGER MENU
    // ==========================================

    function attivaHamburger() {

        const hamburger = document.querySelector(".hamburger-btn");
        const mainNav = document.getElementById("mainNav");

        if (hamburger && mainNav) {

            hamburger.addEventListener("click", function(event) {

                event.preventDefault();
                event.stopPropagation();

                mainNav.classList.toggle("open");
            });
        }
    }

    // ==========================================
    // 9. INIZIALIZZAZIONE
    // ==========================================

    updateGlobalUI();

});
