// =========================
// 1. ANIMACIÓN DE HILOS (canvas)
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
        length: 30 + Math.random() * 80,
        speed: 0.3 + Math.random() * 1.2,
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
        t.angle += 0.008 * t.speed;
        t.x += Math.sin(Date.now() * 0.0005 + t.angle) * 0.2;
        t.y += Math.cos(Date.now() * 0.0004 + t.angle) * 0.2;
        if (t.x < -50) t.x = width + 50;
        if (t.x > width + 50) t.x = -50;
        if (t.y < -50) t.y = height + 50;
        if (t.y > height + 50) t.y = -50;
    }
    requestAnimationFrame(drawThreads);
}
drawThreads();

// =========================
// 2. MOSTRAR LA DECISIÓN DEL USUARIO (localStorage)
// =========================
function getDecisionText() {
    const decision = localStorage.getItem('decision');
    const subDecision = localStorage.getItem('subDecision');
    let text = '';

    if (decision === 'ignorar') {
        text = '🔒 Ignoraste el hilo. Preferiste la rutina, pero la duda te persigue.';
    } else if (decision === 'conservar') {
        text = '🔍 Conservaste el hilo. ';
        if (subDecision === 'investigar') {
            text += 'Decidiste investigar los rastros. El coche sigue afuera.';
        } else if (subDecision === 'quemar') {
            text += 'Quemaste el hilo. Las cenizas aún pesan.';
        } else {
            text += 'No tomaste una segunda decisión clara. El hilo sigue ahí, latiendo.';
        }
    } else if (decision === 'abrir') {
        text = '🚪 Dejaste la bolsa entreabierta. La periodista leyó el hilo... y todo se apagó.';
    } else {
        text = '❓ No se registró ninguna decisión. Quizás empezaste de nuevo.';
    }
    return text;
}

const decisionDiv = document.getElementById('decisionDisplay');
if (decisionDiv) {
    decisionDiv.innerHTML = `<p>${getDecisionText()}</p>`;
}

// =========================
// 3. BOTONES DE NAVEGACIÓN
// =========================
document.getElementById('restartBtn').addEventListener('click', () => {
    // Limpiar localStorage para empezar de verdad
    localStorage.removeItem('decision');
    localStorage.removeItem('subDecision');
    window.location.href = 'index.html';
});

document.getElementById('homeBtn').addEventListener('click', () => {
    // No limpiamos localStorage para mantener el recuerdo de la partida, pero redirigimos al inicio
    window.location.href = 'index.html';
});