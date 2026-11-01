/* Overlay "disturbo TV / glitch VHS" a schermo intero: grana leggera,
   sottili righe luminose, qualche puntino e, ogni tanto, una banda di
   tracking error. Disegna su un <canvas id="vhs-overlay"> fisso sopra la
   pagina (vedi styles.css). Si ferma con la scheda nascosta e non parte
   se il sistema chiede di ridurre i movimenti. */
(function () {
    "use strict";

    /* ---------- Parametri configurabili ---------- */
    var CONFIG = {
        enabled: true,
        intensity: 0.45,        // 0..1: scala l'opacita' di tutto
        fps: 24,                 // fotogrammi al secondo (24-30)
        grain: 0.09,             // opacita' base della grana costante
        maxLines: 3,             // righe sottili contemporanee (0-3)
        lineChance: 0.05,        // probabilita' per frame di una nuova riga
        lineLife: [1, 4],        // durata delle righe, in frame
        glitchChance: 0.002,     // probabilita' per frame di una banda
        bandHeight: [20, 60],    // altezza min/max delle bande (px)
        bandShift: 46,           // spostamento laterale massimo (px)
        bandLife: [2, 5],        // durata delle bande, in frame
        specks: 4,               // massimo di puntini/trattini per frame
        tint: [196, 214, 255]    // tinta bluastra delle righe (r, g, b)
    };

    /* ---------- Setup ---------- */
    var canvas = document.getElementById("vhs-overlay");
    var ctx = canvas.getContext("2d");
            
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var root = document.documentElement;
    var toggle = document.getElementById("crt-toggle");

    // Tessera di rumore, rigenerata a ogni frame: grana e bande la riusano.
    var TILE_W = 256;
    var TILE_H = 128;
    var tile = document.createElement("canvas");
    tile.width = TILE_W;
    tile.height = TILE_H;
    var tileCtx = tile.getContext("2d");
    var tileData = tileCtx.createImageData(TILE_W, TILE_H);

    var width = 0;
    var height = 0;
    var lines = [];
    var band = null;
    var rafId = 0;
    var last = 0;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    function resize() {
        // Risoluzione 1:1 con i pixel CSS: piu' leggera e "lo-fi".
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function refreshTile() {
        var d = tileData.data;
        for (var i = 0; i < d.length; i += 4) {
            var v = 150 + Math.random() * 105;
            d[i] = d[i + 1] = d[i + 2] = v;
            // Pochi pixel acquistano opacita' alta: grana a "sale e pepe".
            d[i + 3] = Math.random() < 0.5 ? 0 : Math.random() * 255;
        }
        tileCtx.putImageData(tileData, 0, 0);
    }

    function tintColor(alpha) {
        // Dal bianco/grigio chiaro alla tinta bluastra, a caso.
        var m = Math.random() * 0.7;
        var t = CONFIG.tint;
        var r = Math.round(235 + (t[0] - 235) * m);
        var g = Math.round(235 + (t[1] - 235) * m);
        var b = Math.round(235 + (t[2] - 235) * m);
        return "rgba(" + r + "," + g + "," + b + "," + alpha.toFixed(3) + ")";
    }

    /* ---------- Disegno ---------- */
    function drawGrain() {
        var pattern = ctx.createPattern(tile, "repeat");
        ctx.save();
        ctx.globalAlpha = CONFIG.grain * CONFIG.intensity;
        ctx.translate(-randInt(0, TILE_W), -randInt(0, TILE_H));
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width + TILE_W, height + TILE_H);
        ctx.restore();
    }

    function updateLines() {
        var i;
        for (i = lines.length - 1; i >= 0; i--) {
            if (--lines[i].life <= 0) lines.splice(i, 1);
        }
        if (lines.length < CONFIG.maxLines && Math.random() < CONFIG.lineChance) {
            var full = Math.random() < 0.3;
            var len = full ? width : rand(0.15, 0.7) * width;
            lines.push({
                y: Math.floor(rand(0, height)),
                x: full ? 0 : rand(0, width - len),
                len: len,
                h: Math.random() < 0.75 ? 1 : 2,
                alpha: rand(0.25, 0.85),
                life: randInt(CONFIG.lineLife[0], CONFIG.lineLife[1])
            });
        }
    }

    function drawLines() {
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            ctx.fillStyle = tintColor(l.alpha * CONFIG.intensity);
            ctx.fillRect(l.x, l.y, l.len, l.h);
        }
    }

    function updateBand() {
        if (band) {
            band.life--;
            band.y += rand(-4, 4);
            band.phase += rand(0.4, 1.2);
            if (band.life <= 0) band = null;
        }
        if (!band && Math.random() < CONFIG.glitchChance) {
            var h = randInt(CONFIG.bandHeight[0], CONFIG.bandHeight[1]);
            band = {
                y: rand(0, Math.max(1, height - h)),
                h: h,
                phase: rand(0, 6.28),
                shift: rand(0.4, 1) * CONFIG.bandShift,
                life: randInt(CONFIG.bandLife[0], CONFIG.bandLife[1])
            };
        }
    }

    function drawBand() {
        if (!band) return;
        var y0 = Math.round(band.y);
        var rowH = 2;

        for (var yy = 0; yy < band.h; yy += rowH) {
            // Spostamento laterale a onda piu' un po' di scatto casuale:
            // i pixel sembrano trascinati di lato.
            var dx = (Math.sin(yy * 0.18 + band.phase) * 0.7 + (Math.random() - 0.5) * 0.6) * band.shift;
            var sy = randInt(0, TILE_H - rowH);
            var sx = randInt(0, TILE_W - 1);

            ctx.globalAlpha = Math.min(1, CONFIG.intensity * rand(0.35, 0.8));
            // La tessera e' larga TILE_W: la ripeto per coprire lo schermo.
            for (var x = dx - sx; x < width; x += TILE_W) {
                ctx.drawImage(tile, 0, sy, TILE_W, rowH, Math.round(x), y0 + yy, TILE_W, rowH);
            }
        }
        ctx.globalAlpha = 1;

        // Qualche striscia piu' luminosa dentro la banda e un bordo chiaro in alto.
        for (var k = 0; k < 3; k++) {
            var sw = rand(0.2, 0.9) * width;
            ctx.fillStyle = tintColor(rand(0.2, 0.55) * CONFIG.intensity);
            ctx.fillRect(rand(0, width - sw), y0 + rand(0, band.h), sw, 1);
        }
        ctx.fillStyle = tintColor(0.4 * CONFIG.intensity);
        ctx.fillRect(0, y0, width, 1);
    }

    function drawSpecks() {
        if (Math.random() > 0.5) return;
        var n = randInt(1, CONFIG.specks);
        for (var i = 0; i < n; i++) {
            ctx.fillStyle = tintColor(rand(0.4, 0.95) * CONFIG.intensity);
            ctx.fillRect(rand(0, width), rand(0, height), randInt(2, 8), 1);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        refreshTile();
        drawGrain();
        updateLines();
        drawLines();
        updateBand();
        drawBand();
        drawSpecks();
    }

    /* ---------- Ciclo di animazione (limitato a CONFIG.fps) ---------- */
    function frame(now) {
        rafId = requestAnimationFrame(frame);
        var interval = 1000 / CONFIG.fps;
        if (now - last < interval) return;
        last = now - ((now - last) % interval);
        draw();
    }

    function shouldRun() {
        return CONFIG.enabled && !root.classList.contains("crt-off") && !document.hidden && !reduced.matches;
    }

    function start() {
        if (rafId) return;
        last = 0;
        rafId = requestAnimationFrame(frame);
    }

    function stop() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
    }

    function sync() {
        if (shouldRun()) {
            start();
        } else {
            stop();
            lines = [];
            band = null;
            ctx.clearRect(0, 0, width, height);
        }
    }

    /* ---------- Interruttore (scanlines + disturbo) ---------- */
    var LABELS = {
        en: { on: "CRT On", off: "CRT Off", disable: "Turn CRT effects off", enable: "Turn CRT effects on" },
        it: { on: "CRT Attivo", off: "CRT Spento", disable: "Disattiva effetti CRT", enable: "Attiva effetti CRT" }
    };

    function updateToggle() {
        var on = !root.classList.contains("crt-off");
        var t = LABELS[root.lang] || LABELS.en;
        toggle.setAttribute("aria-pressed", String(on));
        toggle.setAttribute("aria-label", on ? t.disable : t.enable);
        // Il tooltip dice lo stato attuale; l'etichetta per i lettori di schermo l'azione.
        toggle.title = on ? t.on : t.off;
    }

    // Segue il selettore di lingua, che cambia l'attributo lang sulla radice.
    new MutationObserver(updateToggle).observe(root, { attributes: true, attributeFilter: ["lang"] });

    toggle.addEventListener("click", function () {
        var off = root.classList.toggle("crt-off");
        try {
            localStorage.setItem("crt", off ? "off" : "on");
        } catch (e) { }
        updateToggle();
        sync();
    });

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);

    if (reduced.addEventListener) {
        reduced.addEventListener("change", sync);
    } else if (reduced.addListener) {
        reduced.addListener(sync);
    }

    resize();
    updateToggle();
    sync();
})();
