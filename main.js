(function () {
    "use strict";

    var EN = {
        "meta.title": "Franco Parodi \u2014 Software Analyst and Developer",
        "meta.description": "Personal portfolio of Franco Parodi, software analyst and developer with many years of experience in desktop and web applications.",

        "nav.skip": "Skip to content",
        "nav.home": "127.0.0.1",
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.experience": "Experience",
        "nav.projects": "Projects",
        "nav.contact": "Contact",

        "hero.intro": "Full Stack Developer, passionate about innovation and technology, with software development skills on Linux and Windows environments.",

        "about.title": "About",
        "about.p1": "I am <span class='highlight'>Franco</span>, an Analyst and Full Stack Developer with solid experience in developing desktop and web applications.<br>Along the way I have explored a variety of technologies, from enterprise software to modern web applications, up to artificial intelligence and the world of embedded systems, IoT and the interaction between software and the physical world.",
        "about.p2": "Curious by nature, collaborative by conviction and always focused on innovation, I love to experiment, explore new technologies and turn ideas into concrete solutions.",

        "skills.title": "Skills",
        "skills.languages": "Languages &amp; Frameworks",
        "skills.tooling": "Tooling &amp; DevOps",
        "skills.database": "Databases",
        "skills.envs": "Environments &amp; IDEs",

        "exp.title": "Experience",
        "exp0.date": "November 2026 \u2014 Present",
        "exp0.role": "Software development manager",
        "exp0.meta": "Employee \u00b7 Brescia",
        "exp1.date": "May 2022 \u2014 October 2026",
        "exp1.role": "Software analyst and developer",
        "exp1.meta": "Employee \u00b7 Bergamo",
        "exp2.date": "March 2004 \u2014 April 2022",
        "exp2.role": "Software analyst and developer \u2014 R&amp;D",
        "exp2.meta": "Employee \u00b7 Brescia",
        "exp3.date": "February 2002 \u2014 February 2004",
        "exp3.role": "Software analyst and developer",
        "exp3.meta": "Freelance \u00b7 Milan",
        "exp4.date": "January 1998 \u2014 January 2002",
        "exp4.role": "Software analyst and developer",
        "exp4.meta": "Freelance \u00b7 Milan",

        "proj.title": "Projects",
        "proj1.desc": "Mobile application for tracking body weight and nutrition with the support of artificial intelligence.",
        "proj2.desc": "Web app for managing and monitoring access to a gym through facial recognition.",
        "proj3.desc": "Web app for the remote control of a 4WD rover model based on Raspberry Pi.",
        "proj4.desc": "Mobile app for inventory management assisted by artificial intelligence.",
        "proj5.desc": "Web app for controlling room temperature through a thermostat based on Raspberry Pi.",
        "proj6.desc": "Open source interpreter that runs RPG programs on the JVM: a project I contributed to at SmeUP.",

        "contact.text": "If you have an interesting project, or simply want to get in touch, drop me a line.",
        "contact.button": "Say hello"
    };

    var nodes = document.querySelectorAll("[data-i18n]");
    var buttons = document.querySelectorAll("[data-lang-btn]");
    var meta = document.querySelector('meta[name="description"]');

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

        }
    }

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

    window.addEventListener("resize", function () {
        if (isOpen() && window.innerWidth > 768) {
            close(false);
        }
    });

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

(function () {
    "use strict";

    var title = document.querySelector("h1");
    var typed = title && title.querySelector(".typed");

    var nav = document.querySelectorAll(".fade-soft");

    var heroText = document.querySelectorAll(".hero .fade-in");
    var sections = document.querySelectorAll("section.fade-in");
    var footer = document.querySelectorAll("footer.fade-in");

    function show(nodes) {
        var i;
        for (i = 0; i < nodes.length; i++) {
            nodes[i].classList.add("is-visible");
        }
    }

    var failsafe = window.setTimeout(function () {
        show(nav);
        show(heroText);
        show(sections);
        show(footer);
    }, 8000);

    function watch(nodes, rootMargin) {
        if (!window.IntersectionObserver) {

            show(nodes);
            return;
        }

        var observer = new window.IntersectionObserver(function (entries) {
            var i, entry;
            for (i = 0; i < entries.length; i++) {
                entry = entries[i];

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                } else {
                    entry.target.classList.remove("is-visible");
                }
            }
        }, { rootMargin: rootMargin });

        var i;
        for (i = 0; i < nodes.length; i++) {
            observer.observe(nodes[i]);
        }
    }

    function reveal() {
        window.clearTimeout(failsafe);
        show(nav);

        watch(heroText, "0px 0px -15% 0px");
        watch(sections, "0px 0px -15% 0px");

        watch(footer, "0px");
    }

    function revealAll() {
        window.clearTimeout(failsafe);
        show(nav);
        show(heroText);
        show(sections);
        show(footer);
    }

    if (!typed) {
        revealAll();
        return;
    }

    var text = typed.textContent;

    if (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealAll();
        return;
    }

    typed.textContent = "";

    var i = 0;

    function step() {

        title.classList.add("typing");
        i += 1;
        typed.textContent = text.slice(0, i);

        if (i < text.length) {

            window.setTimeout(step, 55 + Math.random() * 85);
        } else {
            title.classList.remove("typing");

            window.setTimeout(reveal, 220);
        }
    }

    window.setTimeout(step, 3000);
})();

(function () {
    "use strict";

    var glow = document.querySelector(".cursor-glow");

    if (!glow || !window.matchMedia) {
        return;
    }

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
