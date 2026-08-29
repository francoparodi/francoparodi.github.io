(function () {
    "use strict";

    /* L'italiano e' il testo gia' presente nell'HTML ed e' la lingua
       predefinita: qui c'e' solo l'inglese. Le stringhe possono contenere
       markup, viene inserito con innerHTML. */
    var EN = {
        "meta.title": "Franco Parodi \u2014 Software Analyst and Developer",
        "meta.description": "Personal portfolio of Franco Parodi, software analyst and developer with many years of experience in desktop and web applications.",

        "nav.home": "127.0.0.1",
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.experience": "Experience",
        "nav.projects": "Projects",
        "nav.contact": "Contact",

        "hero.role": "Software analyst and developer",
        "hero.intro": "For over twenty years I have been designing, developing and maintaining desktop and web applications, on Linux and Windows, today with a focus on Python, ReactJS and AI integration. Curious and passionate about technology and innovation, I am at ease working in a team, both on site and remotely.",

        "about.title": "About",
        "about.p1": "I am <span class='highlight'>Franco</span>, a professional with many years of experience in IT as a software analyst and developer, working on desktop and web applications.",
        "about.p2": "I stand out for the wide range of skills built up over the years, working both on <span class='highlight'>projects</span> and on <span class='highlight'>products</span>: from ERP software on IBM AS/400 to modern web apps, through to the integration of artificial intelligence.",
        "about.p3": "Strong interpersonal communication skills, a team player with a positive and proactive attitude to solving even complex problems.",
        "about.p4": "<strong>Interests:</strong> tech and coding, trekking, kickboxing, snowboarding, running, motorbikes, cycling, film and TV series, electric guitar, scuba diving.",

        "skills.title": "Skills",
        "skills.languages": "Languages &amp; Frameworks",
        "skills.tooling": "Tooling &amp; DevOps",
        "skills.database": "Databases",
        "skills.envs": "Environments &amp; IDEs",

        "exp.title": "Experience",
        "exp1.date": "May 2022 \u2014 Present",
        "exp1.role": "Software analyst and developer",
        "exp1.meta": "Employee \u00b7 Bergamo",
        "exp2.date": "March 2004 \u2014 May 2022",
        "exp2.role": "Software analyst and developer \u2014 R&amp;D",
        "exp2.meta": "Employee \u00b7 Brescia",
        "exp3.date": "February 2002 \u2014 February 2004",
        "exp3.role": "Software analyst and developer",
        "exp3.meta": "Freelance \u00b7 Milan",
        "exp4.date": "January 1999 \u2014 January 2002",
        "exp4.role": "Software analyst and developer",
        "exp4.meta": "Freelance \u00b7 Milan",

        "proj.title": "Projects",
        "proj1.desc": "Mobile application for tracking body weight and nutrition with the support of artificial intelligence.",
        "proj2.desc": "Web app for managing and monitoring access to a gym through facial recognition.",
        "proj3.desc": "Web app for the remote control of a 4WD rover model based on Raspberry Pi.",
        "proj4.desc": "Mobile app for inventory management assisted by artificial intelligence.",
        "proj5.desc": "Web app for controlling room temperature through a thermostat based on Raspberry Pi.",
        "proj6.desc": "Open source interpreter that runs RPG programs on the JVM: a project I contributed to at SmeUP.",

        "contact.eyebrow": "What's next?",
        "contact.title": "Let's work together.",
        "contact.text": "If you have an interesting project, or simply want to get in touch, drop me a line.",
        "contact.button": "Say hello",
        "contact.city": "Palazzolo sull'Oglio (BS), Italia"
    };

    var nodes = document.querySelectorAll("[data-i18n]");
    var buttons = document.querySelectorAll("[data-lang-btn]");
    var meta = document.querySelector('meta[name="description"]');

    /* Testo italiano originale, cosi' il ritorno a IT non ha bisogno di dizionario. */
    var IT = {};
    var i;
    for (i = 0; i < nodes.length; i++) {
        IT[nodes[i].getAttribute("data-i18n")] = nodes[i].innerHTML;
    }
    IT["meta.title"] = document.title;
    IT["meta.description"] = meta ? meta.content : "";

    function apply(lang) {
        var dict = lang === "en" ? EN : IT;
        var k, j;
        for (j = 0; j < nodes.length; j++) {
            k = nodes[j].getAttribute("data-i18n");
            if (dict[k] !== undefined) {
                nodes[j].innerHTML = dict[k];
            }
        }
        document.title = dict["meta.title"];
        if (meta) {
            meta.content = dict["meta.description"];
        }
        document.documentElement.lang = lang;
        for (j = 0; j < buttons.length; j++) {
            buttons[j].setAttribute(
                "aria-pressed",
                buttons[j].getAttribute("data-lang-btn") === lang ? "true" : "false"
            );
        }
        try {
            localStorage.setItem("lang", lang);
        } catch (e) {
            /* localStorage non disponibile: la scelta vale solo per questa visita. */
        }
    }

    /* Lingua predefinita: italiano. Si passa all'inglese solo se il
       visitatore lo ha gia' scelto in una visita precedente. */
    var saved = null;
    try {
        saved = localStorage.getItem("lang");
    } catch (e) {
        saved = null;
    }

    if (saved === "en") {
        apply("en");
    }

    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            apply(this.getAttribute("data-lang-btn"));
        });
    }
})();

/* Menu laterale a scomparsa sui telefoni. */
(function () {
    "use strict";

    var toggle = document.querySelector(".nav-toggle");
    var overlay = document.querySelector(".nav-overlay");
    var nav = document.getElementById("site-nav");

    if (!toggle || !overlay || !nav) {
        return;
    }

    var LABELS = {
        en: { open: "Open menu", close: "Close menu" },
        it: { open: "Apri il menu", close: "Chiudi il menu" }
    };

    function labels() {
        return LABELS[document.documentElement.lang] || LABELS.en;
    }

    function isOpen() {
        return document.body.classList.contains("nav-open");
    }

    function focusable() {
        return nav.querySelectorAll("a[href], button:not([disabled])");
    }

    function open() {
        document.body.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", labels().close);
        var items = focusable();
        if (items.length) {
            items[0].focus();
        }
    }

    function close(returnFocus) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", labels().open);
        if (returnFocus) {
            toggle.focus();
        }
    }

    toggle.addEventListener("click", function () {
        if (isOpen()) {
            close(true);
        } else {
            open();
        }
    });

    overlay.addEventListener("click", function () {
        close(true);
    });

    /* Un tocco su una voce porta alla sezione e richiude il pannello. */
    nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            close(false);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!isOpen()) {
            return;
        }

        if (event.key === "Escape") {
            close(true);
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        /* Finche' il pannello e' aperto il focus resta al suo interno. */
        var items = focusable();
        if (!items.length) {
            return;
        }

        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    /* Tornando alla larghezza desktop il pannello non ha piu' senso. */
    window.addEventListener("resize", function () {
        if (isOpen() && window.innerWidth > 768) {
            close(false);
        }
    });

    /* L'etichetta segue la lingua scelta nel selettore IT/EN. */
    var langButtons = document.querySelectorAll("[data-lang-btn]");
    var b;
    for (b = 0; b < langButtons.length; b++) {
        langButtons[b].addEventListener("click", function () {
            toggle.setAttribute(
                "aria-label",
                isOpen() ? labels().close : labels().open
            );
        });
    }

    toggle.setAttribute("aria-label", labels().open);
})();

/* Rete di sicurezza: qualunque cosa succeda all'animazione, dopo
   quattro secondi il contenuto e' comunque visibile. */
window.setTimeout(function () {
    document.documentElement.classList.add("revealed");
}, 4000);

/* Il titolo si scrive da solo a ogni caricamento della pagina, poi il
   resto della pagina entra in dissolvenza. */
(function () {
    "use strict";

    var title = document.querySelector("h1");
    var typed = title && title.querySelector(".typed");

    function reveal() {
        document.documentElement.classList.add("revealed");
    }

    if (!typed) {
        reveal();
        return;
    }

    var text = typed.textContent;

    /* Chi ha chiesto meno animazioni vede subito titolo e contenuto. */
    if (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        reveal();
        return;
    }

    typed.textContent = "";
    title.classList.add("typing");

    var i = 0;

    function step() {
        i += 1;
        typed.textContent = text.slice(0, i);

        if (i < text.length) {
            /* Ritmo irregolare: una digitazione a intervalli fissi
               si riconosce subito come finta. */
            window.setTimeout(step, 55 + Math.random() * 85);
        } else {
            title.classList.remove("typing");
            /* Breve pausa a titolo finito, poi entra il resto. */
            window.setTimeout(reveal, 220);
        }
    }

    window.setTimeout(step, 350);
})();

/* Alone chiaro che insegue il puntatore. */
(function () {
    "use strict";

    var glow = document.querySelector(".cursor-glow");

    if (!glow || !window.matchMedia) {
        return;
    }

    /* Niente alone sui touch o per chi ha chiesto meno animazioni. */
    if (window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    var targetX = 0;
    var targetY = 0;
    var x = 0;
    var y = 0;
    var started = false;
    var pending = false;

    /* L'alone insegue il puntatore con un filo di ritardo:
       il movimento risulta piu' morbido di un aggancio secco. */
    function frame() {
        pending = false;

        x += (targetX - x) * 0.18;
        y += (targetY - y) * 0.18;

        glow.style.setProperty("--glow-x", x + "px");
        glow.style.setProperty("--glow-y", y + "px");

        if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
            pending = true;
            window.requestAnimationFrame(frame);
        }
    }

    function schedule() {
        if (!pending) {
            pending = true;
            window.requestAnimationFrame(frame);
        }
    }

    document.addEventListener("mousemove", function (event) {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!started) {
            /* Al primo movimento parte gia' sotto al puntatore,
               senza attraversare la pagina. */
            started = true;
            x = targetX;
            y = targetY;
            document.body.classList.add("glow-on");
        }

        schedule();
    });

    document.addEventListener("mouseleave", function () {
        document.body.classList.remove("glow-on");
    });

    document.addEventListener("mouseenter", function () {
        if (started) {
            document.body.classList.add("glow-on");
        }
    });
})();
