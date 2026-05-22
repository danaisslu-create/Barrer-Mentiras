// =========================
// 1. CANVAS DE HILOS (decorativo)
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
        length: 30 + Math.random() * 80,
        speed: 0.4 + Math.random() * 1.2,
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
        ctx.strokeStyle = `rgba(138, 122, 92, ${t.opacity})`;
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
// 2. DATOS DE EXPEDIENTES (documentos clasificados)
// =========================
const expedientes = {
    bolsa: {
        titulo: "✦ EXPEDIENTE: RESIDUOS CONFIDENCIALES ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-20 3.jpg",
        desc: "Bolsas negras clasificadas como 'material de alto riesgo'. El sello indica que su contenido no debe ser abierto por personal no autorizado. Raúl las ha manipulado durante años sin saber qué contenían."
    },
    hilo: {
        titulo: "✦ EXPEDIENTE: HILO DE MEMORIA ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-21 3.jpg",
        desc: "Fragmento de un discurso presidencial que nunca fue pronunciado. Las palabras se reordenan solas, como si tuvieran vida propia. Este hilo pertenece a una categoría especial: 'material sensible'."
    },
    presidente: {
        titulo: "✦ EXPEDIENTE: FIGURA PRESIDENCIAL ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-22 4.jpg",
        desc: "Documento interno que muestra la planificación de un decreto para 'romper el ciclo'. Las firmas aún están frescas. El gobierno busca perpetuarse sin elecciones."
    },
    exp1: {
        titulo: "✦ EXPEDIENTE 001 - SILENCIO ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-20 3.jpg",
        desc: "Registro de llamadas interceptadas. Todos los testigos del caso guardaron silencio por órdenes superiores. El miedo es más efectivo que la justicia."
    },
    exp2: {
        titulo: "✦ EXPEDIENTE 002 - MENTIRAS ✦",
        img: "assets/img/PHOTO-2026-05-21-16-19-21 3.jpg",
        desc: "Lista de promesas rotas durante los últimos tres gobiernos. Cada frase tachada es una verdad que nunca salió a la luz."
    }
};

// =========================
// 3. MEDIDOR DE CONSECUENCIA (PESO DE LA DECISIÓN)
// =========================
let peso = 0;
const meterFill = document.getElementById('decisionWeight');
const weightMessage = document.getElementById('weightMessage');

function aumentarPeso(cantidad, texto) {
    peso = Math.min(peso + cantidad, 100);
    meterFill.style.width = peso + '%';
    if (peso >= 70) {
        weightMessage.innerText = "⚠️ LA CULPA TE ESTÁ CONSUMIENDO ⚠️";
        weightMessage.style.color = "#c97a5a";
    } else if (peso >= 40) {
        weightMessage.innerText = "La duda crece en tu interior.";
    } else {
        weightMessage.innerText = "El silencio pesa más de lo que imaginabas.";
    }
    if (texto) console.log(texto); // opcional: mostrar en consola
}

// =========================
// 4. POPUP DE EXPEDIENTE
// =========================
const popupOverlay = document.getElementById('expedientePopup');
const closeBtn = document.querySelector('.close-expediente');
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
    // Aumentar peso de decisión cada vez que se abre un expediente (la curiosidad duele)
    aumentarPeso(8, `Has revisado ${data.titulo} - la conciencia se agita.`);
}

function cerrarExpediente() {
    popupOverlay.style.display = 'none';
}
closeBtn.addEventListener('click', cerrarExpediente);
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) cerrarExpediente();
});

// =========================
// 5. ASIGNAR EVENTOS A PALABRAS CLAVE Y DOCUMENTOS
// =========================
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
// 6. SONIDOS DE ACCIÓN (bolsa, ascensor - opcionales)
// =========================
const bagSound = document.getElementById('bagSound');
const elevatorSound = document.getElementById('elevatorSound');

// Los sonidos se pueden activar al hacer clic en el texto (por ejemplo, en "bolsa negra")
document.querySelectorAll('.clue[data-doc="bolsa"]').forEach(el => {
    el.addEventListener('click', () => {
        if (bagSound) bagSound.play().catch(e=>console.log);
    });
});
document.querySelectorAll('.clue[data-doc="presidente"]').forEach(el => {
    el.addEventListener('click', () => {
        if (elevatorSound) elevatorSound.play().catch(e=>console.log);
    });
});

// =========================
// 7. BOTONES DE NAVEGACIÓN
// =========================
document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
document.getElementById('creditsBtn').addEventListener('click', () => {
    // Guardar el peso de la decisión para mostrarlo en créditos
    localStorage.setItem('ignorarWeight', peso);
    window.location.href = 'creditos.html';
});

// =========================
// 8. INICIAR SONIDO AMBIENTE (opcional, con primer clic)
// =========================
let audioStarted = false;
document.body.addEventListener('click', () => {
    if (!audioStarted) {
        const dummy = new Audio();
        dummy.play().catch(e=>console.log);
        audioStarted = true;
    }
}, { once: true });