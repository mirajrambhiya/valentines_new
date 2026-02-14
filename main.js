/**
 * main.js — The whole show. Pure tease.
 */

// ── Particle BG (subtle, ambient) ──
function initBG() {
    const c = document.getElementById('bg-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let dots = [];

    function resize() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
        dots.push({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
            r: Math.random() * 1.2 + 0.3,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            a: Math.random() * 0.3 + 0.1,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, c.width, c.height);
        for (const d of dots) {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0) d.x = c.width;
            if (d.x > c.width) d.x = 0;
            if (d.y < 0) d.y = c.height;
            if (d.y > c.height) d.y = 0;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(194, 24, 91, ${d.a})`;
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ── Screen management ──
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    setTimeout(() => document.getElementById(id).classList.add('active'), 100);
}

// ── SCREEN 1: Open button dodge ──
function initIntro() {
    const btn = document.getElementById('btn-open');
    let dodges = 0;
    const maxDodges = 4;
    const texts = ["too slow", "nope", "almost 😏", "lol ok fine"];

    btn.addEventListener('mouseenter', () => {
        if (dodges >= maxDodges) return;
        dodges++;

        const x = Math.random() * (window.innerWidth - 200) + 50;
        const y = Math.random() * (window.innerHeight - 100) + 50;
        btn.style.position = 'fixed';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.zIndex = '100';
        btn.style.transition = 'left 0.25s cubic-bezier(0.34,1.56,0.64,1), top 0.25s cubic-bezier(0.34,1.56,0.64,1)';

        const label = document.querySelector('#screen-intro .small-text');
        if (label) label.textContent = texts[dodges - 1] || '';

        if (dodges >= maxDodges) {
            setTimeout(() => {
                btn.style.position = '';
                btn.style.left = '';
                btn.style.top = '';
                btn.style.zIndex = '';
                if (label) label.textContent = 'okay you can have it';
            }, 400);
        }
    });

    // Also handle touch — on mobile the button doesn't dodge, just works
    btn.addEventListener('click', () => {
        startLoader();
    });
}

// ── SCREEN 2: Fake loader ── 
function startLoader() {
    showScreen('screen-loading');
    const fill = document.getElementById('loader-fill');
    const text = document.getElementById('loader-text');

    const stages = [
        { pct: 15, msg: 'loading your surprise...', delay: 600 },
        { pct: 30, msg: 'still loading...', delay: 800 },
        { pct: 45, msg: 'almost there...', delay: 700 },
        { pct: 60, msg: 'jk this is gonna take a while', delay: 1200 },
        { pct: 65, msg: '...', delay: 1500 },
        { pct: 72, msg: 'okay for real now', delay: 800 },
        { pct: 88, msg: 'SO close', delay: 600 },
        { pct: 89, msg: '...', delay: 2000 },
        { pct: 90, msg: 'hehe', delay: 1000 },
        { pct: 99, msg: 'one more second', delay: 1500 },
        { pct: 99, msg: 'lied. ✌️', delay: 1200 },
        { pct: 100, msg: '💖', delay: 500 },
    ];

    let i = 0;
    function next() {
        if (i >= stages.length) {
            setTimeout(() => showScreen('screen-question'), 400);
            return;
        }
        const s = stages[i];
        fill.style.width = s.pct + '%';
        text.textContent = s.msg;
        i++;
        setTimeout(next, s.delay);
    }
    next();
}

// ── SCREEN 3: Yes/No question ──
function initQuestion() {
    const noBtn = document.getElementById('btn-no');
    const yesBtn = document.getElementById('btn-yes');
    const qText = document.getElementById('q-text');
    let noCount = 0;
    let yesScale = 1;

    const noTexts = [
        "wrong answer",
        "try again",
        "are you sure? 🤨",
        "really??",
        "the other button →",
        "i'll wait",
        "...",
        "just click yes",
    ];

    noBtn.addEventListener('mouseenter', () => {
        if (noCount < 2) return; // first 2 times let them click
        // After that, dodge
        const rect = noBtn.getBoundingClientRect();
        const parent = noBtn.closest('.btn-row');
        const parentRect = parent.getBoundingClientRect();

        const x = Math.random() * (window.innerWidth - 120) + 30;
        const y = Math.random() * (window.innerHeight - 80) + 30;
        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
        noBtn.style.zIndex = '100';
        noBtn.style.transition = 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)';
    });

    noBtn.addEventListener('click', () => {
        noCount++;
        yesScale += 0.2;
        yesBtn.style.transform = `scale(${Math.min(yesScale, 2.5)})`;

        if (noCount < noTexts.length) {
            qText.textContent = noTexts[noCount];
        } else {
            qText.textContent = 'click. yes. now.';
        }

        // Shrink no button
        if (noCount >= 3) {
            const s = Math.max(0.4, 1 - (noCount - 2) * 0.12);
            noBtn.style.transform = `scale(${s})`;
            noBtn.style.opacity = Math.max(0.3, 1 - (noCount - 2) * 0.1);
        }
    });

    yesBtn.addEventListener('click', () => {
        showScreen('screen-rate');
        initRating();
    });
}

// ── SCREEN 4: Rating (all wrong answers except 10) ──
function initRating() {
    const row = document.getElementById('rate-row');
    const resp = document.getElementById('rate-response');
    if (row.children.length > 0) return; // already init

    const responses = {
        1: "1?? blocked.",
        2: "i'm calling the police",
        3: "that's literally offensive",
        4: "not even a 5??",
        5: "mid??? i'm MID to you???",
        6: "six. you gave me a six.",
        7: "so close yet so insulting",
        8: "8 is not 10",
        9: "so what's the missing 1 for huh",
    };

    for (let n = 1; n <= 10; n++) {
        const btn = document.createElement('button');
        btn.className = 'rate-btn';
        btn.textContent = n;
        btn.addEventListener('click', () => {
            if (n < 10) {
                resp.textContent = responses[n];
                btn.classList.add('nope');
                setTimeout(() => btn.classList.remove('nope'), 400);
                // make the 10 button glow more each time
                const ten = row.children[9];
                if (ten) {
                    ten.style.boxShadow = `0 0 ${20 + n * 5}px rgba(194,24,91,0.5)`;
                    ten.style.borderColor = '#c2185b';
                    ten.style.transform = `scale(${1 + n * 0.05})`;
                }
            } else {
                // They clicked 10
                resp.textContent = '';
                showFinal();
            }
        });
        row.appendChild(btn);
    }
}

// ── SCREEN 5: Final ──
function showFinal() {
    showScreen('screen-final');
    const text = document.getElementById('final-text');
    const sub = document.getElementById('final-sub');

    text.textContent = 'knew it 😏';
    sub.textContent = 'happy valentine\'s day ❤️';

    // Confetti burst
    for (let i = 0; i < 80; i++) {
        setTimeout(() => spawnConfetti(), i * 20);
    }
}

function spawnConfetti() {
    const el = document.createElement('div');
    el.className = 'confetti';
    const colors = ['#c2185b', '#ffab40', '#e91e63', '#ff6f00', '#f48fb1', '#fff'];
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-10px';
    el.style.width = (Math.random() * 6 + 4) + 'px';
    el.style.height = (Math.random() * 6 + 4) + 'px';
    el.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
    el.style.animationDelay = Math.random() * 0.3 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// ── Cursor sparkle trail ──
function initSparkles() {
    let last = 0;
    const sparks = ['✦', '♡', '⋆', '✧', '˚'];
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - last < 60) return;
        last = now;
        const s = document.createElement('div');
        s.className = 'spark';
        s.textContent = sparks[Math.floor(Math.random() * sparks.length)];
        s.style.left = e.clientX + 'px';
        s.style.top = e.clientY + 'px';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 700);
    });
}

// ── Leave banner ──
function initLeaveBanner() {
    const banner = document.getElementById('leave-banner');
    let shown = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !shown) {
            shown = true;
            banner.classList.add('show');
            setTimeout(() => {
                banner.classList.remove('show');
                setTimeout(() => { shown = false; }, 10000);
            }, 3000);
        }
    });
}

// ── Init everything ──
document.addEventListener('DOMContentLoaded', () => {
    initBG();
    initIntro();
    initQuestion();
    initSparkles();
    initLeaveBanner();
});
