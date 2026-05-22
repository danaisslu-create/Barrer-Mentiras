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
for (let i = 0; i < 40; i++) {
    threads.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 40 + Math.random() * 80,
        speed: 0.5 + Math.random() * 1.5,
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
        ctx.strokeStyle = `rgba(212, 175, 55, ${t.opacity})`;
        ctx.lineWidth = t.thickness;
        ctx.stroke();
        t.angle += 0.01 * t.speed;
        t.x += Math.sin(Date.now() * 0.0005 + t.angle) * 0.2;
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
// 2. DATOS DE EXPEDIENTES (imágenes, textos)
// =========================
const expedientesData = {
    presidente: {
        titulo: "Expediente Presidencial",
        img: "assets/img/PHOTO-2026-05-21-16-19-20 3.jpg",
        texto: "Documento interno: declaraciones contradictorias, discursos ensayados. Los hilos de poder se tejen desde arriba."
    },
    hilos: {
        titulo: "Los Hilos del Poder",
        img: "assets/img/PHOTO-2026-05-21-16-19-21 3.jpg",
        texto: "Fragmentos de mentiras entrelazadas. Cada hilo contiene una promesa rota o un acuerdo oculto. Latente, palpitante."
    },
    bolsa: {
        titulo: "Bolsas Confidenciales",
        img: "assets/img/PHOTO-2026-05-21-16-19-22 4.jpg",
        texto: "Residuos del poder: documentos censurados, cifrados, destinados al olvido. Alguien los clasifica como 'basura'."
    },
    raul: {
        titulo: "Ficha de Personaje: Raúl",
        img: "assets/img/raul-profile.jpg", // Necesitarás una imagen de perfil (puedes usar un placeholder)
        texto: "Trabajador de limpieza en el palacio de gobierno. Silencioso, observador. Un día decidió que barrer no era suficiente."
    }
};

// =========================
// 3. POPUP DE EXPEDIENTES
// =========================
const popup = document.getElementById('expPopup');
const popupTitle = document.getElementById('popupTitle');
const popupImage = document.getElementById('popupImage');
const popupText = document.getElementById('popupText');
const closePopupBtn = document.querySelector('.close-popup');

let expedientesAbiertos = 0; // contador para desbloquear la decisión
const decisionSection = document.getElementById('decisionSection');
const hintMessage = document.getElementById('hintMessage');

function abrirExpediente(tipo) {
    const data = expedientesData[tipo];
    if (data) {
        popupTitle.innerText = data.titulo;
        popupImage.src = data.img;
        popupText.innerText = data.texto;
        popup.style.display = 'flex';
        // Incrementar contador la primera vez que se abre un expediente
        if (expedientesAbiertos === 0) {
            expedientesAbiertos++;
            // Mostrar sección de decisión después de un breve retraso (para dar tiempo a ver el popup)
            setTimeout(() => {
                decisionSection.style.display = 'block';
                hintMessage.style.display = 'none';
                // Efecto de brillo en los botones (opcional)
                document.querySelectorAll('.choice-card').forEach(card => {
                    card.style.animation = 'glowPulse 1s infinite';
                });
            }, 300);
        } else {
            expedientesAbiertos++;
        }
        // Sonido de papel (opcional)
    }
}

// Asignar eventos a los expedientes
document.querySelectorAll('.expediente').forEach(exp => {
    exp.addEventListener('click', () => {
        const tipo = exp.getAttribute('data-exp');
        abrirExpediente(tipo);
    });
});

closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});
popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.style.display = 'none';
});

// =========================
// 4. SELECCIÓN DE RAMA (solo visible después de abrir un expediente)
// =========================
document.querySelectorAll('.choice-card').forEach(card => {
    card.addEventListener('click', () => {
        const choice = card.getAttribute('data-choice');
        localStorage.setItem('decision', choice);
        if (choice === 'ignorar') window.location.href = 'ignorar.html';
        else if (choice === 'conservar') window.location.href = 'conservar.html';
        else if (choice === 'abrir') window.location.href = 'abrir.html';
    });
});

// =========================
// 5. SONIDO AMBIENTE
// =========================
const ambience = document.getElementById('ambienceSound');
let ambientStarted = false;
function iniciarSonidoAmbiente() {
    if (!ambientStarted && ambience) {
        ambience.volume = 0.3;
        ambience.play().catch(e => console.log("Audio no permitido"));
        ambientStarted = true;
    }
}
document.body.addEventListener('click', () => {
    if (!ambientStarted) iniciarSonidoAmbiente();
}, { once: true });

// Animación CSS para brillo de botones
const style = document.createElement('style');
style.textContent = `
    @keyframes glowPulse {
        0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); border-color: rgba(212,175,55,0.6); }
        70% { box-shadow: 0 0 0 10px rgba(212,175,55,0); border-color: #d4af37; }
        100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); border-color: rgba(212,175,55,0.6); }
    }
`;
document.head.appendChild(style);