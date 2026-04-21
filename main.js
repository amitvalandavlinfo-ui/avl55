const ACCESS_CODE = "ASR555";
const LOCK_TIME = 180000;
const IG_URL = "https://www.instagram.com/amitvaland_14"


let lockedUntil = localStorage.getItem("asr_lock_until")
    ? parseInt(localStorage.getItem("asr_lock_until"))
    : 0;

const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const chars = "01";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

let matrixInterval = setInterval(() => {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const t = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(t, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}, 35);


setTimeout(() => {
    coming.style.display = "none";
    access.style.display = "flex";

    if (Date.now() < lockedUntil) startTimer();
}, 2000);


function checkAccess() {
    if (Date.now() < lockedUntil) {
        startTimer();
        return;
    }

    if (code.value === ACCESS_CODE) {

        clearInterval(matrixInterval);
        canvas.style.display = "none";

        localStorage.removeItem("asr_lock_until");
        localStorage.removeItem("asr_ig_redirected");

        access.style.display = "none";
        loading.style.display = "flex";

        setTimeout(() => {
            loading.style.display = "none";
            nav.style.display = "flex";
            main.style.display = "block";
        }, 1500);
    } else {
        error.innerText = "INVALID ACCESS KEY";
        lockSystem(true);
    }
}

function lockSystem(doRedirect) {
    lockedUntil = Date.now() + LOCK_TIME * 1000;
    localStorage.setItem("asr_lock_until", lockedUntil);
    startTimer();

    const redirected = localStorage.getItem("asr_ig_redirected");

    if (doRedirect && !redirected) {
        localStorage.setItem("asr_ig_redirected", "1");

        setTimeout(() => {
            window.location.href = IG_URL;
        }, 800);
    }
}

function startTimer() {
    let t = setInterval(() => {
        let r = Math.ceil((lockedUntil - Date.now()) / 1000);
        timer.innerText = "LOCKED · " + Math.max(0, r) + "s";

        if (r <= 0) {
            clearInterval(t);
            timer.innerText = "";
            error.innerText = "";
            localStorage.removeItem("asr_lock_until");
        }
    }, 1000);
}

terminalInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const c = terminalInput.value.trim();
        terminalInput.value = "";
        terminalOutput.innerHTML += `<br>&gt; ${c}`;

        if (c === "help") {
            terminalOutput.innerHTML += "<br>help, whoami, projects, clear";
        } else if (c === "whoami") {
            terminalOutput.innerHTML += "<br>authorized_user@asr-555";
        } else if (c === "projects") {
            terminalOutput.innerHTML += "<br>ASR-555 Secure Runtime<br>AVL INFO Systems<br>AINET Infrastructure";
        } else if (c === "clear") {
            terminalOutput.innerHTML = "";
        } else {
            terminalOutput.innerHTML += "<br>command not found";
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});
