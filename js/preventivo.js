
document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "dna_quote_services";

    const servicesContainer = document.getElementById("quote-selected-services");
    const serviceCount = document.getElementById("quote-service-count");
    const summaryCount = document.getElementById("quote-summary-count");
    const quoteForm = document.getElementById("quote-form");
    const feedback = document.getElementById("quote-form-feedback");

    // ======================================
    // ICONE SVG DEI SERVIZI
    // ======================================

    const serviceIcons = {
        web: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="8" width="38" height="30" rx="3"/><path d="M5 16h38M13 12h.1M18 12h.1M23 12h.1"/><path d="m19 24-5 4 5 4M29 24l5 4-5 4M26 22l-4 12"/></svg>`,

        marketing: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 39h34M12 34V23h7v11M23 34V14h7v20M34 34V7h7v27"/><path d="m10 17 10-7 8 2 10-8"/><path d="M32 4h6v6"/></svg>`,

        ai: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="10" width="28" height="28" rx="7"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6"/><path d="m19 19 5-3 5 3v10l-5 3-5-3z"/><path d="m19 19 5 3 5-3M24 22v10"/></svg>`,

        cloud: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 35h23a8 8 0 0 0 1-16 13 13 0 0 0-25-2 9 9 0 0 0 1 18z"/><path d="m18 27 6 6 7-8M24 33V20"/></svg>`,

        software: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="7" width="34" height="34" rx="4"/><path d="M7 16h34M14 12h.1M19 12h.1"/><path d="m18 24-4 4 4 4M30 24l4 4-4 4M27 22l-6 12"/></svg>`,

        default: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M24 15v18M15 24h18"/></svg>`
    };

    // ======================================
    // GESTIONE DATI
    // ======================================

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

    function formatEuro(value) {
        return Number(value || 0).toLocaleString("it-IT") + " €";
    }

    // ======================================
    // PREZZI DEI PACCHETTI
    // ======================================

    const knownPrices = {
        "presenza-digitale": 490,
        "soluzioni-business": 790,
        "digital-evolution": 990
    };

    function getServicePrice(service) {
        const savedPrice = Number(service.price);

        if (Number.isFinite(savedPrice) && savedPrice > 0) {
            return savedPrice;
        }

        return knownPrices[service.id] || 0;
    }

    // ======================================
    // CONFIGURATORE PREZZO
    // ======================================

    const packageOptions = document.querySelectorAll(
        'input[name="quote-package"]'
    );

    const extraOptions = document.querySelectorAll(".quote-extra");

    const liveTotal = document.getElementById("quote-live-total");
    const basePriceElement = document.getElementById("quote-base-price");
    const extraPriceElement = document.getElementById("quote-extra-price");

    const packageNames = {
        490: "Presenza digitale",
        790: "Soluzioni Business",
        990: "Digital Evolution"
    };

    function calculateQuote() {

        const selectedPackage = document.querySelector(
            'input[name="quote-package"]:checked'
        );

        const basePrice = selectedPackage
            ? Number(selectedPackage.value)
            : 0;

        let extrasTotal = 0;
        const selectedExtras = [];

        extraOptions.forEach(option => {
            if (option.checked) {
                const price = Number(option.value);

                extrasTotal += price;

                selectedExtras.push({
                    nome: option.dataset.name || "Funzionalità aggiuntiva",
                    prezzo: price
                });
            }
        });

        if (basePriceElement) {
            basePriceElement.textContent = selectedPackage
                ? formatEuro(basePrice)
                : "—";
        }

        if (extraPriceElement) {
            extraPriceElement.textContent = formatEuro(extrasTotal);
        }

        if (liveTotal) {
            liveTotal.textContent = selectedPackage
                ? formatEuro(basePrice + extrasTotal)
                : "Seleziona un pacchetto";
        }

        return {
            pacchetto: selectedPackage
                ? packageNames[basePrice] || selectedPackage.dataset.name || ""
                : "",

            prezzoBase: basePrice,
            funzionalita: selectedExtras,

            totale: selectedPackage
                ? basePrice + extrasTotal
                : null
        };
    }

    // ======================================
    // RIEPILOGO COMPATTO NEL MODULO CONTATTI
    // ======================================

    function renderFormServices() {

        if (!quoteForm) return;

        let summary = document.getElementById("quote-form-services");

        if (!summary) {
            summary = document.createElement("div");
            summary.id = "quote-form-services";
            summary.className = "quote-form-services";
            quoteForm.prepend(summary);
        }

        const services = getServices();
        const quote = calculateQuote();

        const servicesTotal = services.reduce(
            (sum, service) => sum + getServicePrice(service),
            0
        );

        const hasCartServices = services.length > 0;
        const hasConfiguration = quote.totale !== null;

        if (!hasCartServices && !hasConfiguration) {
            summary.style.display = "none";
            summary.replaceChildren();
            return;
        }

        summary.style.display = "block";

        summary.innerHTML = `
            <div class="quote-form-summary-heading">
                <span>RIEPILOGO</span>
                <h3>La tua configurazione</h3>
            </div>
            <div id="quote-form-services-list"></div>
        `;

        const list = summary.querySelector("#quote-form-services-list");

        // Crea una riga del riepilogo
        function createRow(name, price) {

            const row = document.createElement("div");
            row.className = "quote-form-summary-row";

            const nameElement = document.createElement("span");
            nameElement.textContent = name;

            const priceElement = document.createElement("strong");
            priceElement.textContent = formatEuro(price);

            row.append(nameElement, priceElement);

            return row;
        }

        // Crea il subtotale di un gruppo
        function createSubtotal(label, value) {

            const subtotal = document.createElement("div");
            subtotal.className = "quote-form-summary-subtotal";

            const labelElement = document.createElement("span");
            labelElement.textContent = label;

            const valueElement = document.createElement("strong");
            valueElement.textContent = formatEuro(value);

            subtotal.append(labelElement, valueElement);

            return subtotal;
        }

        // Crea un gruppo
        function createGroup(title) {

            const group = document.createElement("div");
            group.className = "quote-form-summary-group";

            const heading = document.createElement("h4");
            heading.className = "quote-form-summary-group-title";
            heading.textContent = title;

            group.appendChild(heading);

            return group;
        }

        // ----------------------------------
        // GRUPPO 1: SERVIZI DAL CARRELLO
        // ----------------------------------

        if (hasCartServices) {

            const group = createGroup("Servizi selezionati");

            services.forEach(service => {
                group.appendChild(
                    createRow(
                        service.name || "Servizio DNA",
                        getServicePrice(service)
                    )
                );
            });

            group.appendChild(
                createSubtotal("Subtotale servizi", servicesTotal)
            );

            list.appendChild(group);
        }

        // ----------------------------------
        // GRUPPO 2: CONFIGURATORE
        // ----------------------------------

        if (hasConfiguration) {

            const group = createGroup("Configurazione personalizzata");

            group.appendChild(
                createRow(quote.pacchetto, quote.prezzoBase)
            );

            quote.funzionalita.forEach(extra => {
                group.appendChild(
                    createRow(extra.nome, extra.prezzo)
                );
            });

            group.appendChild(
                createSubtotal("Subtotale configurazione", quote.totale)
            );

            list.appendChild(group);
        }

        // ----------------------------------
        // TOTALE COMPLESSIVO INDICATIVO
        // ----------------------------------

        const grandTotal = servicesTotal + (quote.totale || 0);

        const total = document.createElement("div");
        total.className = "quote-form-summary-total";

        const totalLabel = document.createElement("span");
        totalLabel.textContent = "Totale indicativo";

        const totalValue = document.createElement("strong");
        totalValue.textContent = formatEuro(grandTotal);

        total.append(totalLabel, totalValue);
        list.appendChild(total);

        const note = document.createElement("p");
        note.className = "quote-form-summary-note";
        note.textContent =
            "Il totale è indicativo. Il preventivo definitivo sarà definito dopo l'analisi delle tue esigenze.";

        list.appendChild(note);
    }

    // ======================================
    // ICONE
    // ======================================

    function createServiceIcon(iconName) {

        const wrapper = document.createElement("div");
        wrapper.className = "quote-service-icon";
        wrapper.innerHTML = serviceIcons[iconName] || serviceIcons.default;

        return wrapper;
    }

    // ======================================
    // CREAZIONE SINGOLO SERVIZIO
    // ======================================

    function createServiceElement(service, index) {

        const article = document.createElement("article");
        article.className = "quote-service-item";

        const info = document.createElement("div");
        info.className = "quote-service-info";

        const number = document.createElement("span");
        number.className = "quote-service-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const icon = createServiceIcon(service.icon);

        const details = document.createElement("div");
        details.className = "quote-service-details";

        const title = document.createElement("h3");
        title.textContent = service.name || "Servizio DNA";

        const description = document.createElement("p");
        description.textContent = service.description || "";

        details.append(title, description);
        info.append(number, icon, details);

        const actions = document.createElement("div");
        actions.className = "quote-service-actions";

        const tag = document.createElement("span");
        tag.className = "quote-service-tag";
        tag.textContent = service.tag || "SERVIZIO DNA";

        const price = document.createElement("strong");
        price.className = "quote-service-price";
        price.textContent = formatEuro(getServicePrice(service));

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "quote-remove";
        removeButton.textContent = "Rimuovi";

        removeButton.setAttribute(
            "aria-label",
            `Rimuovi ${service.name || "servizio"}`
        );

        removeButton.addEventListener("click", () => {

            const services = getServices();

            const updated = services.filter(
                item => item.id !== service.id
            );

            if (saveServices(updated)) {
                renderServices();

                window.dispatchEvent(
                    new Event("dna_quote_updated")
                );
            }
        });

        actions.append(tag, price, removeButton);
        article.append(info, actions);

        return article;
    }

    // ======================================
    // TOTALE NEL RIEPILOGO LATERALE
    // ======================================

    function updateServicesTotal(services) {

        const total = services.reduce(
            (sum, service) => sum + getServicePrice(service),
            0
        );

        const summaryBox = document.querySelector(".quote-summary-box");

        if (!summaryBox) {
            console.error("Riepilogo laterale .quote-summary-box non trovato.");
            return total;
        }

        let totalElement = document.getElementById("quote-services-total");

        if (!totalElement) {

            totalElement = document.createElement("div");
            totalElement.id = "quote-services-total";
            totalElement.className = "quote-summary-line quote-total-line";

            const label = document.createElement("span");
            label.textContent = "Totale servizi selezionati";

            const value = document.createElement("strong");
            value.id = "quote-services-total-value";

            totalElement.append(label, value);

            const description = summaryBox.querySelector(
                ".quote-summary-description"
            );

            if (description) {
                summaryBox.insertBefore(totalElement, description);
            } else {
                summaryBox.appendChild(totalElement);
            }
        }

        const valueElement = document.getElementById(
            "quote-services-total-value"
        );

        if (valueElement) {
            valueElement.textContent = formatEuro(total);
        }

        totalElement.style.display = services.length ? "flex" : "none";

        return total;
    }

    // ======================================
    // RENDER SERVIZI
    // ======================================

    function renderServices() {

        if (!servicesContainer) {
            console.error("Contenitore #quote-selected-services non trovato.");
            return;
        }

        const services = getServices();

        servicesContainer.replaceChildren();

        if (services.length === 0) {

            const empty = document.createElement("div");
            empty.className = "quote-empty";

            const title = document.createElement("h3");
            title.textContent = "Il tuo progetto parte da qui.";

            const text = document.createElement("p");
            text.textContent =
                "Non hai ancora selezionato servizi. Torna alle nostre aree di competenza e aggiungi quelli che ti interessano.";

            empty.append(title, text);
            servicesContainer.append(empty);

        } else {

            services.forEach((service, index) => {
                servicesContainer.append(
                    createServiceElement(service, index)
                );
            });
        }

        const count = String(services.length).padStart(2, "0");

        if (serviceCount) {
            serviceCount.textContent = count;
        }

        if (summaryCount) {
            summaryCount.textContent = count;
        }

        updateServicesTotal(services);
        renderFormServices();
    }

    // ======================================
    // COLLEGAMENTO RIEPILOGO -> MODULO
    // ======================================

    const proceedButton = document.querySelector(".quote-proceed");

    if (proceedButton) {

        proceedButton.addEventListener("click", event => {

            event.preventDefault();

            const services = getServices();
            const quote = calculateQuote();

            if (services.length === 0 && quote.totale === null) {

                if (feedback) {
                    feedback.textContent =
                        "Seleziona almeno un servizio o configura un pacchetto prima di procedere.";
                }

                return;
            }

            renderFormServices();

            const contactsSection = document.getElementById("quote-contacts");

            if (contactsSection) {

                contactsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else if (quoteForm) {

                quoteForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                console.error("Sezione contatti e modulo non trovati.");
            }
        });
    }

    // ======================================
    // AGGIORNAMENTO CONFIGURATORE
    // ======================================

    function updateConfiguration() {
        calculateQuote();
        renderFormServices();
    }

    packageOptions.forEach(option => {
        option.addEventListener("change", updateConfiguration);
    });

    extraOptions.forEach(option => {
        option.addEventListener("change", updateConfiguration);
    });

    // ======================================
    // MODULO PREVENTIVO
    // ======================================

    if (quoteForm) {

        quoteForm.addEventListener("submit", event => {

            event.preventDefault();

            const services = getServices();
            const preventivo = calculateQuote();

            if (services.length === 0 && preventivo.totale === null) {

                if (feedback) {
                    feedback.textContent =
                        "Seleziona almeno un servizio o configura un pacchetto prima di procedere.";
                }

                return;
            }

            const nome = document.getElementById("quote-name")?.value.trim() || "";
            const cognome = document.getElementById("quote-surname")?.value.trim() || "";
            const email = document.getElementById("quote-email")?.value.trim() || "";

            if (!nome || !cognome || !email) {

                if (feedback) {
                    feedback.textContent =
                        "Compila nome, cognome ed email per continuare.";
                }

                return;
            }

            const serviziTotale = services.reduce(
                (sum, service) => sum + getServicePrice(service),
                0
            );

            const totaleComplessivo = serviziTotale + (preventivo.totale || 0);

            const formData = {

                cliente: {
                    nome,
                    cognome,
                    email,

                    telefono: document.getElementById("quote-phone")?.value.trim() || ""
                },

                messaggio: document.getElementById("quote-message")?.value.trim() || "",

                servizi: services.map(service => ({
                    ...service,
                    price: getServicePrice(service)
                })),

                totaleServizi: serviziTotale,

                configurazione: {
                    pacchetto: preventivo.pacchetto,
                    prezzoBase: preventivo.prezzoBase,
                    funzionalita: preventivo.funzionalita,
                    stimaTotale: preventivo.totale
                },

                totaleComplessivo
            };

            console.log("Richiesta preventivo:", formData);

            if (feedback) {
                feedback.textContent =
                    "Perfetto! La tua richiesta è stata verificata. L'invio sarà attivato quando collegheremo il backend.";
            }
        });
    }

    // ======================================
    // RESET TOTALE
    // ======================================

    const resetBtn = document.getElementById("quote-reset-btn");

    if (resetBtn) {

        resetBtn.addEventListener("click", event => {

            event.preventDefault();

            if (confirm(
                "Sei sicuro di voler cancellare tutto? La pagina verrà ricaricata e tutte le selezioni andranno perse."
            )) {

                localStorage.removeItem(STORAGE_KEY);
                sessionStorage.clear();

                window.location.reload();
            }
        });
    }

    // ======================================
    // AVVIO E ASCOLTO
    // ======================================

    renderServices();
    calculateQuote();
    renderFormServices();

    window.addEventListener("dna_quote_updated", renderServices);

    window.addEventListener("storage", event => {
        if (event.key === STORAGE_KEY) {
            renderServices();
        }
    });

});
