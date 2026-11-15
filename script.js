/* ==========================================================================
   My Cafe — Shared Interactive JavaScript (Lab 12)
   Vanilla JS only | Preserves Lab 11 window.alert() & console.log()
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("My Cafe Website Initialized — Lab 12 Project by Anas Shahid (26i-3113, Section E)");

    // 1. Mobile Navigation Toggle
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    // 2. Preserved Lab 11 Interactive Welcome Alert Button
    const welcomeAlertBtns = document.querySelectorAll(".js-welcome-alert");
    welcomeAlertBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            window.alert("Welcome to My Cafe! Freshly brewed coffee, traditional teas, and warm hospitality await you.");
            console.log("User triggered My Cafe welcome alert.");
        });
    });

    // 3. Menu Category Filter & Live Search (menu.html)
    const menuFilterBtns = document.querySelectorAll(".js-menu-filter");
    const menuSearchInput = document.getElementById("menuSearch");
    const menuSections = document.querySelectorAll(".menu-category-section");
    const menuNoResults = document.getElementById("menuNoResults");

    let activeCategory = "all";

    function filterMenu() {
        if (!menuSections.length) return;
        const query = menuSearchInput ? menuSearchInput.value.trim().toLowerCase() : "";
        let totalVisibleRows = 0;

        menuSections.forEach((section) => {
            const sectionCat = section.getAttribute("data-category");
            const categoryMatches = activeCategory === "all" || activeCategory === sectionCat;
            let visibleInSection = 0;

            const rows = section.querySelectorAll(".menu-item-row");
            rows.forEach((row) => {
                const text = row.textContent.toLowerCase();
                const searchMatches = query === "" || text.includes(query);
                if (categoryMatches && searchMatches) {
                    row.style.display = "";
                    visibleInSection++;
                    totalVisibleRows++;
                } else {
                    row.style.display = "none";
                }
            });

            section.style.display = visibleInSection > 0 ? "" : "none";
        });

        if (menuNoResults) {
            menuNoResults.style.display = totalVisibleRows === 0 ? "block" : "none";
        }
    }

    if (menuFilterBtns.length) {
        menuFilterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                menuFilterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                activeCategory = btn.getAttribute("data-filter") || "all";
                filterMenu();
            });
        });
    }

    if (menuSearchInput) {
        menuSearchInput.addEventListener("input", filterMenu);
    }

    // 4. Gallery Category Filter & Lightbox (gallery.html)
    const galleryFilterBtns = document.querySelectorAll(".js-gallery-filter");
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDesc = document.getElementById("lightboxDesc");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    let currentGalleryIndex = 0;

    if (galleryFilterBtns.length) {
        galleryFilterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                galleryFilterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.getAttribute("data-filter");
                galleryItems.forEach((item) => {
                    const cat = item.getAttribute("data-category");
                    item.style.display = (filter === "all" || filter === cat) ? "" : "none";
                });
            });
        });
    }

    function openLightbox(index) {
        if (!lightbox || !galleryItems[index]) return;
        currentGalleryIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector("img");
        const title = item.querySelector("h3");
        const desc = item.querySelector("p");

        lightboxImg.src = img ? img.src : "";
        lightboxImg.alt = img ? img.alt : "";
        lightboxTitle.textContent = title ? title.textContent : "";
        lightboxDesc.textContent = desc ? desc.textContent : "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
    }

    if (galleryItems.length && lightbox) {
        galleryItems.forEach((item, idx) => {
            item.addEventListener("click", () => openLightbox(idx));
            item.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(idx);
                }
            });
        });

        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", () => {
                const nextIdx = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
                openLightbox(nextIdx);
            });
        }
        if (lightboxNext) {
            lightboxNext.addEventListener("click", () => {
                const nextIdx = (currentGalleryIndex + 1) % galleryItems.length;
                openLightbox(nextIdx);
            });
        }
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("open")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft" && lightboxPrev) lightboxPrev.click();
            if (e.key === "ArrowRight" && lightboxNext) lightboxNext.click();
        });
    }

    // 5. FAQ Accordion & Live Search (faq.html)
    const accordionTriggers = document.querySelectorAll(".accordion-trigger");
    const faqSearchInput = document.getElementById("faqSearch");
    const faqItems = document.querySelectorAll(".accordion-item");
    const faqNoResults = document.getElementById("faqNoResults");

    accordionTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const expanded = trigger.getAttribute("aria-expanded") === "true";
            const panel = trigger.nextElementSibling;
            const icon = trigger.querySelector(".acc-icon");

            trigger.setAttribute("aria-expanded", String(!expanded));
            if (panel) panel.classList.toggle("open", !expanded);
            if (icon) icon.textContent = !expanded ? "−" : "+";
        });
    });

    if (faqSearchInput && faqItems.length) {
        faqSearchInput.addEventListener("input", () => {
            const query = faqSearchInput.value.trim().toLowerCase();
            let matches = 0;
            faqItems.forEach((item) => {
                const match = query === "" || item.textContent.toLowerCase().includes(query);
                item.style.display = match ? "" : "none";
                if (match) matches++;
            });
            if (faqNoResults) {
                faqNoResults.style.display = matches === 0 ? "block" : "none";
            }
        });
    }

    // 6. Reservation Form Validation & Demonstration Confirmation (reservation.html)
    const reservationForm = document.getElementById("reservationForm");
    if (reservationForm) {
        reservationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById("resName");
            const email = document.getElementById("resEmail");
            const phone = document.getElementById("resPhone");
            const date = document.getElementById("resDate");
            const time = document.getElementById("resTime");
            const guests = document.getElementById("resGuests");
            const message = document.getElementById("resMessage");

            const showErr = (id, show) => {
                const el = document.getElementById(id);
                if (el) el.style.display = show ? "block" : "none";
                if (show) isValid = false;
            };

            showErr("errResName", !name.value || name.value.trim().length < 2);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            showErr("errResEmail", !emailRegex.test(email.value.trim()));
            const phoneDigits = phone.value.replace(/\D/g, "");
            showErr("errResPhone", phoneDigits.length < 7);
            showErr("errResDate", !date.value);
            showErr("errResTime", !time.value);
            const guestCount = parseInt(guests.value, 10);
            showErr("errResGuests", isNaN(guestCount) || guestCount < 1 || guestCount > 20);

            if (!isValid) return;

            const feedback = document.getElementById("reservationConfirmation");
            if (feedback) {
                feedback.innerHTML = `
                    <h3>Demonstration Reservation Enquiry Received</h3>
                    <p><strong>Note:</strong> This is a frontend demonstration confirmation for My Cafe (no backend database is connected).</p>
                    <p><strong>Guest Name:</strong> ${escapeHTML(name.value.trim())}<br>
                    <strong>Email:</strong> ${escapeHTML(email.value.trim())} | <strong>Phone:</strong> ${escapeHTML(phone.value.trim())}<br>
                    <strong>Date &amp; Time:</strong> ${escapeHTML(date.value)} at ${escapeHTML(time.value)}<br>
                    <strong>Party Size:</strong> ${guestCount} Guest(s)<br>
                    <strong>Special Notes:</strong> ${escapeHTML(message.value.trim() || "None specified")}</p>
                `;
                feedback.style.display = "block";
                feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            window.alert(`Thank you, ${name.value.trim()}! Your demonstration reservation request for ${date.value} at ${time.value} has been recorded.`);
            console.log("Reservation form validated and demonstration confirmation displayed.");
        });
    }

    // 7. Contact Form Validation & Demonstration Confirmation (contact.html)
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById("contactName");
            const email = document.getElementById("contactEmail");
            const subject = document.getElementById("contactSubject");
            const message = document.getElementById("contactMessage");

            const showErr = (id, show) => {
                const el = document.getElementById(id);
                if (el) el.style.display = show ? "block" : "none";
                if (show) isValid = false;
            };

            showErr("errContactName", !name.value || name.value.trim().length < 2);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            showErr("errContactEmail", !emailRegex.test(email.value.trim()));
            showErr("errContactSubject", !subject.value || subject.value.trim().length < 3);
            showErr("errContactMessage", !message.value || message.value.trim().length < 10);

            if (!isValid) return;

            const feedback = document.getElementById("contactConfirmation");
            if (feedback) {
                feedback.innerHTML = `
                    <h3>Demonstration Message Sent</h3>
                    <p><strong>Note:</strong> This is a static frontend confirmation for demonstration purposes.</p>
                    <p><strong>From:</strong> ${escapeHTML(name.value.trim())} (${escapeHTML(email.value.trim())})<br>
                    <strong>Subject:</strong> ${escapeHTML(subject.value.trim())}<br>
                    <strong>Message:</strong> ${escapeHTML(message.value.trim())}</p>
                `;
                feedback.style.display = "block";
            }
            console.log("Contact form validated and submitted (demo mode).");
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, (m) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[m]));
    }
});
