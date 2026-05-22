// =========================
// 1. ANIMACIÓN DE HILOS (canvas, tonos rojizos)
// =========================
const canvas = document.getElementById('threadCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const threads = [];
for (let i = 0; i < 45; i++) {
    threads.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 25 + Math.random() * 80,
        speed: 0.4 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        thickness: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.35
    });
}

function drawThreads() {
    ctx.clearRect(0, 0, width, height);
    for (let t of threads) {
        ctx.beginPath();
        const endX = t.x + Math.sin(t.angle) * t.length;
        const endY = t.y + Math.cos(t.angle) * t.length;
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(200, 100, 80, ${t.opacity})`;
        ctx.lineWidth = t.thickness;
        ctx.stroke();
        t.angle += 0.009 * t.speed;
        t.x += Math.sin(Date.now() * 0.0005 + t.angle) * 0.25;
        t.y += Math.cos(Date.now() * 0.0004 + t.angle) * 0.25;
        if (t.x < -50) t.x = width + 50;
        if (t.x > width + 50) t.x = -50;
        if (t.y < -50) t.y = height + 50;
        if (t.y > height + 50) t.y = -50;
    }
    requestAnimationFrame(drawThreads);
}
drawThreads();

// =========================
// 2. POPUPS DE DOCUMENTOS
// =========================
const popup = document.getElementById('docPopup');
const popupImg = document.getElementById('popupImg');
const closePopup = document.querySelector('.close-popup');
const paperSound = document.getElementById('paperSound');

document.querySelectorAll('.doc-item').forEach(doc => {
    doc.addEventListener('click', () => {
        const img = doc.querySelector('img').src;
        popupImg.src = img;
        popup.style.display = 'flex';
        if (paperSound) paperSound.play().catch(e=>console.log);
    });
});
closePopup.addEventListener('click', () => popup.style.display = 'none');
popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.style.display = 'none';
});

// =========================
// 3. DISPARADOR MANUAL DEL APAGÓN (botón)
// =========================
const triggerBtn = document.getElementById('triggerBlackoutBtn');
const blackout = document.getElementById('blackoutOverlay');
const footsteps = document.getElementById('footstepsSound');
const hitSound = document.getElementById('hitSound');
const staticSound = document.getElementById('staticSound');

triggerBtn.addEventListener('click', () => {
    // Deshabilitar el botón para evitar múltiples disparos
    triggerBtn.disabled = true;
    triggerBtn.innerText = '💀 ... 💀';
    
    // Sonido de pasos acercándose
    if (footsteps) footsteps.play().catch(e=>console.log);
    
    // Pequeño retraso antes del golpe y apagón
    setTimeout(() => {
        if (hitSound) hitSound.play().catch(e=>console.log);
        // Mostrar overlay negro con texto
        blackout.classList.add('active');
        // Sonido de estática
        if (staticSound) {
            staticSound.volume = 0.3;
            staticSound.play().catch(e=>console.log);
        }
        // Opcional: después de 5 segundos no se necesita hacer nada porque el usuario ya tiene el botón de créditos dentro del blackout
    }, 800);
});

// =========================
// 4. BOTÓN DE CRÉDITOS DENTRO DEL APAGÓN
// =========================
const creditsBlackoutBtn = document.getElementById('creditsAfterBlackout');
if (creditsBlackoutBtn) {
    creditsBlackoutBtn.addEventListener('click', () => {
        window.location.href = 'creditos.html';
    });
}

// =========================
// 5. BOTÓN DE REINICIO (volver a empezar)
// =========================
document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// =========================
// 6. ACTIVAR SONIDOS CON UN CLIC (por políticas de autoplay)
// =========================
let audioStarted = false;
document.body.addEventListener('click', () => {
    if (!audioStarted) {
        const dummy = new Audio();
        dummy.play().catch(e=>console.log);
        audioStarted = true;
    }
}, { once: true });