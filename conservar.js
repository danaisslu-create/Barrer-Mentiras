// =========================
// 1. CANVAS HILOS (igual que antes)
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
        opacity: 0.1 + Math.random() * 0.3
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
        ctx.strokeStyle = `rgba(230, 200, 138, ${t.opacity})`;
        ctx.lineWidth = t.thickness;
        ctx.stroke();
        t.angle += 0.008 * t.speed;
        t.x += Math.sin(Date.now() * 0.0004 + t.angle) * 0.2;
        t.y += Math.cos(Date.now() * 0.0003 + t.angle) * 0.2;
        if (t.x < -50) t.x = width + 50;
        if (t.x > width + 50) t.x = -50;
        if (t.y < -50) t.y = height + 50;
        if (t.y > height + 50) t.y = -50;
    }
    requestAnimationFrame(drawThreads);
}
drawThreads();

// =========================
// 2. DATOS DE EXPEDIENTES
// =========================
const expedientes = {
    hilo: {
        titulo: "✦ EXPEDIENTE: HILO DE MEMORIA ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-21 3.jpg",
        desc: "Fragmento de un discurso que nunca fue pronunciado. Las palabras cambian solas. Este hilo pertenece a una categoría especial: 'material sensible'."
    },
    maleta: {
        titulo: "✦ EXPEDIENTE: PERTENENCIAS ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-20 3.jpg",
        desc: "La maleta de Raúl contiene restos de expedientes clasificados. El forro tiene manchas de tinta borrada."
    },
    rastros: {
        titulo: "✦ EXPEDIENTE: RASTROS ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-22 4.jpg",
        desc: "Nombres: Gómez, Martínez, López. Fechas: todas coinciden con cambios de gobierno. Edificios: ministerios, sedes alternas."
    },
    carro: {
        titulo: "✦ EXPEDIENTE: VIGILANCIA ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-23.jpg",
        desc: "El vehículo gris con vidrios polarizados lleva tres días estacionado. Placas oficiales."
    },
    exp1: {
        titulo: "✦ EXP. 001 - PROPIEDAD GUBERNAMENTAL ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-22 4.jpg",
        desc: "Documento que certifica la transferencia de fondos a cuentas off shore."
    },
    exp2: {
        titulo: "✦ EXP. 002 - FINANZAS OCULTAS ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-23.jpg",
        desc: "Registro de movimientos bancarios del ministerio. Hay un desfase de millones sin explicación."
    }
};

// =========================
// 3. MEDIDOR DE RASTRO (sube al abrir expedientes)
// =========================
let rastro = 0;
const traceFill = document.getElementById('traceFill');
const traceMessage = document.getElementById('traceMessage');

function aumentarRastro(cantidad, texto) {
    rastro = Math.min(rastro + cantidad, 100);
    traceFill.style.width = rastro + '%';
    if (rastro >= 80) {
        traceMessage.innerText = "⚠️ ESTÁS DEMASIADO CERCA ⚠️";
        traceMessage.style.color = "#ff6a4a";
    } else if (rastro >= 50) {
        traceMessage.innerText = "Los rastros te miran. Cuidado.";
    } else if (rastro >= 20) {
        traceMessage.innerText = "Algo se mueve en las sombras...";
    } else {
        traceMessage.innerText = "El silencio aún es cómplice.";
    }
    if (texto) console.log(texto);
}

// =========================
// 4. POPUP DE EXPEDIENTE (estilo clasificado)
// =========================
const popupOverlay = document.getElementById('expedientePopup');
const closeExp = document.querySelector('.close-expediente');
const popupTitulo = document.getElementById('expedienteTitulo');
const popupImg = document.getElementById('expedienteImg');
const popupDesc = document.getElementById('expedienteDesc');
const paperSound = document.getElementById('paperSound');

function abrirExpediente(key) {
    const data = expedientes[key];
    if (!data) return;
    popupTitulo.innerText = data.titulo;
    popupImg.src = data.img;
    popupDesc.innerText = data.desc;
    popupOverlay.style.display = 'flex';
    if (paperSound) paperSound.play().catch(e=>console.log);
    aumentarRastro(12, `Revisaste ${data.titulo} - el rastro se hace más claro.`);
}

function cerrarExpediente() {
    popupOverlay.style.display = 'none';
}
closeExp.addEventListener('click', cerrarExpediente);
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) cerrarExpediente();
});

// Asignar a palabras clave y documentos
document.querySelectorAll('.clue').forEach(el => {
    el.addEventListener('click', () => {
        const key = el.getAttribute('data-doc');
        abrirExpediente(key);
    });
});
document.querySelectorAll('.doc-item').forEach(doc => {
    doc.addEventListener('click', () => {
        const key = doc.getAttribute('data-doc');
        abrirExpediente(key);
    });
});

// =========================
// 5. SUBDECISIÓN (con fuego si quema)
// =========================
const subDecisionDiv = document.getElementById('subDecision');
const carEngine = document.getElementById('carEngine');
let subdecisionShown = false;

setTimeout(() => {
    if (!subdecisionShown) {
        subDecisionDiv.classList.remove('hidden');
        subdecisionShown = true;
        if (carEngine) {
            carEngine.volume = 0.15;
            carEngine.loop = true;
            carEngine.play().catch(e=>console.log);
        }
    }
}, 5000);

// Manejar elección
document.querySelectorAll('.subchoice-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const choice = card.getAttribute('data-sub');
        localStorage.setItem('subDecision', choice);
        localStorage.setItem('conservarRastro', rastro);
        
        const narrativeDiv = document.querySelector('.narrative-card');
        const finalMsg = document.createElement('div');
        finalMsg.classList.add('subdecision-result');
        
        if (choice === 'investigar') {
            finalMsg.innerHTML = `<p class="highlight">Raúl decide seguir los rastros. Pasa noches investigando, conecta nombres, descubre una red de corrupción. Una semana después, recibe una llamada anónima: "Deja de buscar o pagarás las consecuencias". El hilo se vuelve más pesado. Afuera, el mismo coche sigue ahí.</p>`;
        } else {
            // ANIMACIÓN DE FUEGO
            const fireContainer = document.getElementById('fireContainer');
            fireContainer.classList.remove('hidden');
            for (let i = 0; i < 30; i++) {
                const flame = document.createElement('div');
                flame.classList.add('flame');
                flame.style.left = Math.random() * 100 + '%';
                flame.style.animationDelay = Math.random() * 1.5 + 's';
                flame.style.animationDuration = 0.6 + Math.random() * 0.6 + 's';
                fireContainer.appendChild(flame);
            }
            const fireSound = document.getElementById('fireSound');
            if (fireSound) fireSound.play().catch(e=>console.log);
            finalMsg.innerHTML = `<p class="highlight">Raúl enciende un fósforo. El hilo arde entre sus dedos, las letras se retuercen y se convierten en ceniza. Pero en la pared, la sombra de las palabras quemadas permanece. Nunca sabrá si hizo lo correcto. El coche afuera arranca y se va.</p>`;
            // Detener sonido de coche
            if (carEngine) carEngine.pause();
        }
        narrativeDiv.appendChild(finalMsg);
        subDecisionDiv.style.display = 'none';
    });
});

// =========================
// 6. BOTONES DE NAVEGACIÓN
// =========================
document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
document.getElementById('creditsBtn').addEventListener('click', () => {
    window.location.href = 'creditos.html';
});

// =========================
// 7. ACTIVAR SONIDOS CON CLIC
// =========================
let audioStarted = false;
document.body.addEventListener('click', () => {
    if (!audioStarted) {
        const dummy = new Audio();
        dummy.play().catch(e=>console.log);
        audioStarted = true;
    }
}, { once: true });