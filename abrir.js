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
// 2. DATOS DE EXPEDIENTES (documentos clasificados)
// =========================
const expedientes = {
    bolsa: {
        titulo: "✦ EXPEDIENTE: RESIDUOS CONFIDENCIALES ✦",
        img: "assets/img/bolsas negras.jpg",
        desc: "Bolsas negras marcadas como 'material sensible'. Contienen fragmentos de discursos oficiales que nunca fueron pronunciados. El sello indica que su apertura sin autorización es un delito."
    },
    hilo: {
        titulo: "✦ EXPEDIENTE: HILO DE MEMORIA ✦",
        img: "assets/img/raul observando al presidente.jpg",
        desc: "Fragmento de un decreto presidencial que buscaba 'romper el ciclo electoral'. Las palabras se reordenan solas. Parece que el documento sigue vivo, latiendo."
    },
    periodista: {
        titulo: "✦ EXPEDIENTE: PERIODISTA ✦",
        img: "assets/img/raul con el expediente.jpg",
        desc: "Foto de archivo: una reportera de investigación que ha cubierto casos de corrupción. Su nombre aparece en varios expedientes clasificados."
    },
    presidente: {
        titulo: "✦ EXPEDIENTE: FIGURA PRESIDENCIAL ✦",
        img: "assets/img/raul ve las mentiras del presidente.jpg",
        desc: "Borrador del discurso que nunca se emitió. La frase 'no necesitaremos más presidentes' está subrayada tres veces."
    },
    exp1: {
        titulo: "✦ EXPEDIENTE 001 - SILENCIO ✦",
        img: "assets/img/raul descubirendo mentiras.jpg",
        desc: "Registro de llamadas interceptadas. Todos los testigos del caso guardaron silencio por órdenes superiores. El miedo es más efectivo que la justicia."
    },
    exp2: {
        titulo: "✦ EXPEDIENTE 002 - SECRETOS ✦",
        img: "assets/img/raul con los hilos.jpg",
        desc: "Lista de nombres de funcionarios implicados en una red de ocultamiento de información. Algunos tachados, otros con notas 'pendiente de citación'."
    },
    exp3: {
        titulo: "✦ EXPEDIENTE 003 - REGISTROS ✦",
        img: "assets/img/raul con el expediente.jpg",
        desc: "Documento interno del ministerio de gobierno. Detalla el protocolo para 'eliminar rastros' de ciertos expedientes."
    }
};

// =========================
// 3. MEDIDOR DE CONSECUENCIA
// =========================
let peso = 0;
const meterFill = document.getElementById('decisionWeight');
const weightMessage = document.getElementById('weightMessage');

function aumentarPeso(cantidad, texto) {
    peso = Math.min(peso + cantidad, 100);
    meterFill.style.width = peso + '%';
    if (peso >= 70) {
        weightMessage.innerText = "⚠️ YA ES DEMASIADO TARDE PARA VOLVER ATRÁS ⚠️";
        weightMessage.style.color = "#c97a5a";
    } else if (peso >= 40) {
        weightMessage.innerText = "La conciencia comienza a pesar. El riesgo es real.";
    } else {
        weightMessage.innerText = "Cada expediente abierto es un paso sin retorno.";
    }
    // Mostrar subdecisión cuando se alcanza cierto peso o después de abrir documentos suficientes
    if (peso >= 50 && !subdecisionShown) {
        mostrarSubdecision();
    }
    if (texto) console.log(texto);
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
    aumentarPeso(10, `Has revisado ${data.titulo} - el peso de la verdad crece.`);
}

function cerrarExpediente() {
    popupOverlay.style.display = 'none';
}
closeBtn.addEventListener('click', cerrarExpediente);
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) cerrarExpediente();
});

// Asignar eventos a palabras clave y documentos
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
// 5. SUBDECISIÓN (aparece al llegar a 50% de peso o manualmente)
// =========================
const subDecisionDiv = document.getElementById('subDecision');
const triggerContainer = document.getElementById('triggerContainer');
let subdecisionShown = false;

function mostrarSubdecision() {
    if (!subdecisionShown) {
        subDecisionDiv.classList.remove('hidden');
        subdecisionShown = true;
        // También mostrar el contenedor del botón de apagón después de elegir?
        // Se hará después de la subdecisión.
    }
}

// Si el usuario nunca abre suficientes expedientes, la subdecisión aparecerá después de un tiempo
setTimeout(() => {
    if (!subdecisionShown) {
        mostrarSubdecision();
    }
}, 12000); // 12 segundos como respaldo

// Manejar la elección de la subdecisión
let eleccionTomada = false;
document.querySelectorAll('.subchoice-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (eleccionTomada) return;
        const choice = card.getAttribute('data-sub');
        eleccionTomada = true;
        localStorage.setItem('abrirSubDecision', choice);
        
        // Mostrar un mensaje de confirmación dentro de la narrativa
        const narrativeDiv = document.querySelector('.narrative-card');
        const confirmMsg = document.createElement('p');
        confirmMsg.classList.add('highlight');
        if (choice === 'proteger') {
            confirmMsg.innerHTML = "Raúl agarra a la periodista del brazo y la empuja hacia la salida. '¡Corra!', grita. Pero ya es tarde...";
        } else {
            confirmMsg.innerHTML = "Raúl sale corriendo sin mirar atrás. Escucha un golpe seco y luego un silencio absoluto. La culpa lo acompañará siempre.";
        }
        narrativeDiv.appendChild(confirmMsg);
        
        // Ocultar las tarjetas de subdecisión
        subDecisionDiv.style.display = 'none';
        // Mostrar el botón para activar el apagón
        triggerContainer.classList.remove('hidden');
    });
});

// =========================
// 6. APAGÓN MANUAL (al hacer clic en el botón)
// =========================
const triggerBtn = document.getElementById('triggerBlackoutBtn');
const blackout = document.getElementById('blackoutOverlay');
const blackoutText = document.getElementById('blackoutText');
const footsteps = document.getElementById('footstepsSound');
const hitSound = document.getElementById('hitSound');
const staticSound = document.getElementById('staticSound');
const creditsBtnBlackout = document.getElementById('creditsAfterBlackout');

triggerBtn.addEventListener('click', () => {
    // Deshabilitar botón para evitar múltiples disparos
    triggerBtn.disabled = true;
    triggerBtn.innerText = '⏳ PROCESANDO...';
    
    // Sonido de pasos
    if (footsteps) footsteps.play().catch(e=>console.log);
    
    setTimeout(() => {
        if (hitSound) hitSound.play().catch(e=>console.log);
        // Modificar el mensaje del blackout según la subdecisión
        const subChoice = localStorage.getItem('abrirSubDecision');
        if (subChoice === 'proteger') {
            blackoutText.innerHTML = "Raúl protegió a la periodista, pero ambos desaparecieron esa noche.<br>El expediente fue cerrado con un sello rojo: 'ACCIDENTE LABORAL'.";
        } else {
            blackoutText.innerHTML = "Raúl huyó. La periodista fue encontrada al día siguiente, sin recordar nada.<br>Nadie creyó su historia sobre los hilos.";
        }
        blackout.classList.add('active');
        if (staticSound) {
            staticSound.volume = 0.3;
            staticSound.play().catch(e=>console.log);
        }
    }, 800);
});

// Botón de créditos dentro del apagón
creditsBtnBlackout.addEventListener('click', () => {
    window.location.href = 'creditos.html';
});

// =========================
// 7. BOTÓN DE REINICIO
// =========================
document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// =========================
// 8. SONIDO DE PAPEL Y ACTIVACIÓN AUDIO
// =========================
let audioStarted = false;
document.body.addEventListener('click', () => {
    if (!audioStarted) {
        const dummy = new Audio();
        dummy.play().catch(e=>console.log);
        audioStarted = true;
    }
}, { once: true });