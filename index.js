// =========================
// 1. EFECTO MÁQUINA DE ESCRIBIR (narrativa)
// =========================
const narrativeSteps = [
    "Su reloj marca las 5:55 p.m. Raúl suspira y guarda lo que le queda de su comida en su maleta. De regreso a su turno, observa la rueda de prensa a través del vidrio. Ya sabe lo que verá, pero aún así se detiene unos segundos más de lo necesario.",
    "Los murmullos del discurso se mezclan con el ruido frenético de los reporteros. El presidente sonríe. Siempre sonríe. Y entonces aparecen: los hilos. Gruesos y delgados, tensos, saliendo de su cabeza como serpientes enredadas. Palabras que no fueron dichas. Intenciones que no llegaron al micrófono. Mentiras...",
    "Raúl aprieta el mango de la escoba. Hasta ahora, su trabajo ha sido claro: barrer; recoger; embolsar; olvidar. Pero el día de hoy algo va a cambiar.",
    "Cuando entra a la sala vacía, el silencio pesa. Saluda al presidente, como siempre, y comienza a barrer. Sin embargo, esta vez no aparta la mirada. Lee fragmentos mientras los junta: promesas rotas, acuerdos ocultos, decisiones calculadas.",
    "Entonces lo ve. Un hilo más grueso que los demás queda atrapado bajo la mesa. Late, casi como si estuviera vivo.",
    "“Con este decreto por fin romperé el ciclo y no se necesitarán más presidentes”. Raúl se queda quieto. Debe tomar una decisión."
];

const narrativeDiv = document.getElementById('narrativeCard');
let step = 0;
let typingTimeout = null;

function typeText(text, element, callback) {
    let i = 0;
    element.innerHTML = '';
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(typing, 25);
        } else {
            if (callback) callback();
        }
    }
    typing();
}

function startNarrative() {
    if (step < narrativeSteps.length) {
        const p = document.createElement('p');
        p.style.marginBottom = '1rem';
        narrativeDiv.appendChild(p);
        typeText(narrativeSteps[step], p, () => {
            step++;
            startNarrative();
        });
    } else {
        // Narrativa terminada, mostrar decisión
        document.getElementById('decisionSection').style.display = 'block';
        // Iniciar sonido ambiente (si no se ha iniciado)
        iniciarSonidoAmbiente();
    }
}
startNarrative();

// =========================
// 2. POPUPS DE DOCUMENTOS (imágenes)
// =========================
const docPopup = document.getElementById('docPopup');
const popupImg = document.getElementById('popupImg');
const closePopup = document.querySelector('.close-popup');

// Mapeo de palabras clave a imágenes
const docs = {
    presidente: 'assets/img/PHOTO-2026-05-21-16-19-20 3.jpg',
    hilos: 'assets/img/PHOTO-2026-05-21-16-19-21 3.jpg',
    bolsa: 'assets/img/PHOTO-2026-05-21-16-19-22 4.jpg'
};

document.querySelectorAll('.hint').forEach(el => {
    el.addEventListener('click', () => {
        const key = el.getAttribute('data-doc');
        if (docs[key]) {
            popupImg.src = docs[key];
            docPopup.style.display = 'flex';
            // Pequeño sonido de papel (opcional)
        }
    });
});
closePopup.addEventListener('click', () => docPopup.style.display = 'none');
docPopup.addEventListener('click', (e) => {
    if (e.target === docPopup) docPopup.style.display = 'none';
});

// =========================
// 3. SELECCIÓN DE RAMA Y REDIRECCIÓN
// =========================
document.querySelectorAll('.choice-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const choice = card.getAttribute('data-choice');
        // Guardar decisión en localStorage (para créditos)
        localStorage.setItem('decision', choice);
        // Redirigir según elección
        if (choice === 'ignorar') window.location.href = 'ignorar.html';
        else if (choice === 'conservar') window.location.href = 'conservar.html';
        else if (choice === 'abrir') window.location.href = 'abrir.html';
    });
});

// =========================
// 4. SONIDO AMBIENTE (se inicia con interacción)
// =========================
const ambience = document.getElementById('ambienceSound');
let ambientStarted = false;

function iniciarSonidoAmbiente() {
    if (!ambientStarted && ambience) {
        ambience.volume = 0.3;
        ambience.play().catch(e => console.log("Audio no permitido aún"));
        ambientStarted = true;
    }
}
// Al hacer clic en cualquier lugar, intentar iniciar sonido
document.body.addEventListener('click', () => {
    if (!ambientStarted) iniciarSonidoAmbiente();
}, { once: true });

// =========================
// 5. ANIMACIÓN DE HILOS (canvas)
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
const THREAD_COUNT = 35;

for (let i = 0; i < THREAD_COUNT; i++) {
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
        // Mover suavemente
        t.angle += 0.01 * t.speed;
        t.x += Math.sin(Date.now() * 0.0005 + t.angle) * 0.2;
        t.y += Math.cos(Date.now() * 0.0003 + t.angle) * 0.2;
        // Rebotar en bordes
        if (t.x < -50) t.x = width + 50;
        if (t.x > width + 50) t.x = -50;
        if (t.y < -50) t.y = height + 50;
        if (t.y > height + 50) t.y = -50;
    }
    requestAnimationFrame(drawThreads);
}
drawThreads();