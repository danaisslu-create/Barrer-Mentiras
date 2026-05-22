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
// 2. FUNCIÓN PARA MOSTRAR LA DECISIÓN
// =========================
function getDecisionText() {
    const decision = localStorage.getItem('decision');
    const subDecision = localStorage.getItem('subDecision');
    const abrirSubDecision = localStorage.getItem('abrirSubDecision');
    let text = '';

    if (decision === 'ignorar') {
        text = '🔒 Ignoraste el hilo. Preferiste la rutina, pero la duda te persigue.';
        const peso = localStorage.getItem('ignorarWeight');
        if (peso && parseInt(peso) > 50) {
            text += ' La culpa te carcome, nunca volverás a dormir igual.';
        }
    } else if (decision === 'conservar') {
        text = '🔍 Conservaste el hilo. ';
        if (subDecision === 'investigar') {
            text += 'Decidiste investigar los rastros. El coche sigue afuera, vigilándote.';
        } else if (subDecision === 'quemar') {
            text += 'Quemaste el hilo. Las cenizas aún pesan en el aire.';
        } else {
            text += 'No tomaste una segunda decisión clara. El hilo sigue ahí, latiendo.';
        }
    } else if (decision === 'abrir') {
        text = '🚪 Dejaste la bolsa entreabierta. La periodista leyó el hilo... ';
        if (abrirSubDecision === 'proteger') {
            text += 'Intentaste protegerla, pero ambos desaparecieron.';
        } else if (abrirSubDecision === 'huir') {
            text += 'Huir fue tu instinto, pero la culpa te persigue.';
        } else {
            text += 'y todo se apagó.';
        }
    } else {
        text = '❓ No se registró ninguna decisión. Quizás empezaste de nuevo.';
    }
    return text;
}

// =========================
// 3. INICIALIZAR TODO CUANDO EL DOM ESTÉ LISTO
// =========================
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar texto de decisión
    const decisionDiv = document.getElementById('decisionDisplay');
    if (decisionDiv) {
        decisionDiv.innerHTML = `<p>${getDecisionText()}</p>`;
    }

    // ========== MÚSICA ==========
    const music = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (music && playPauseBtn) {
        let musicPlaying = false;
        music.volume = 0.3;
        
        music.play().then(() => {
            musicPlaying = true;
            playPauseBtn.innerHTML = '🔊 Pausar música';
        }).catch(() => {
            playPauseBtn.innerHTML = '🔇 Reproducir música';
            musicPlaying = false;
        });
        
        playPauseBtn.addEventListener('click', () => {
            if (musicPlaying) {
                music.pause();
                playPauseBtn.innerHTML = '🔇 Reproducir música';
                musicPlaying = false;
            } else {
                music.play().then(() => {
                    playPauseBtn.innerHTML = '🔊 Pausar música';
                    musicPlaying = true;
                }).catch(e => console.log("Error al reproducir:", e));
            }
        });
    }

    // ========== BOTONES ==========
    const homeBtn = document.getElementById('homeBtn');
    const feedbackBtn = document.getElementById('feedbackBtn');

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    } else {
        console.error("Botón homeBtn no encontrado en el DOM");
    }

    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            window.location.href = 'feedback.html';
        });
    } else {
        console.error("Botón feedbackBtn no encontrado en el DOM");
    }
});