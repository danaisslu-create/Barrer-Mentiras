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
        length: 30 + Math.random() * 70,
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

// Palabras interactivas (dentro de la narrativa)
document.querySelectorAll('.hint').forEach(hint => {
    hint.style.cursor = 'pointer';
    hint.style.borderBottom = '1px dashed #e6c88a';
    hint.addEventListener('click', () => {
        // Mostrar un documento específico (puedes personalizar)
        popupImg.src = 'assets/img/PHOTO-2026-05-21-16-19-23.jpg';
        popup.style.display = 'flex';
        if (paperSound) paperSound.play();
    });
});

// =========================
// 3. SUBDECISIÓN (aparece después de unos segundos)
// =========================
const subDecisionDiv = document.getElementById('subDecision');
const carEngine = document.getElementById('carEngine');
let subdecisionShown = false;

setTimeout(() => {
    if (!subdecisionShown) {
        subDecisionDiv.classList.remove('hidden');
        subdecisionShown = true;
        // Sonido de coche afuera (sutil)
        if (carEngine) {
            carEngine.volume = 0.15;
            carEngine.loop = true;
            carEngine.play().catch(e=>console.log);
        }
    }
}, 5000); // aparece 5 segundos después de cargar

// Manejar la subdecisión
document.querySelectorAll('.subchoice-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const choice = card.getAttribute('data-sub');
        // Guardar en localStorage para créditos
        localStorage.setItem('subDecision', choice);
        
        // Mostrar un mensaje o cambiar la narrativa según la elección
        const narrativeDiv = document.querySelector('.narrative-card');
        const finalMsg = document.createElement('div');
        finalMsg.classList.add('subdecision-result');
        
        if (choice === 'investigar') {
            finalMsg.innerHTML = `<p class="highlight">Raúl decide seguir los rastros. Pasa noches investigando, conecta nombres, descubre una red de corrupción. Una semana después, recibe una llamada anónima: "Deja de buscar o pagarás las consecuencias". El hilo se vuelve más pesado. Afuera, el mismo coche sigue ahí.</p>`;
            // Sonido de suspense (opcional)
        } else {
            finalMsg.innerHTML = `<p class="highlight">Raúl enciende un fósforo. El hilo arde entre sus dedos, las letras se retuercen y se convierten en ceniza. Pero en la pared, la sombra de las palabras quemadas permanece. Nunca sabrá si hizo lo correcto. El coche afuera arranca y se va.</p>`;
            const fireSound = document.getElementById('fireSound');
            if (fireSound) fireSound.play().catch(e=>console.log);
        }
        narrativeDiv.appendChild(finalMsg);
        // Ocultar las tarjetas de subdecisión para no repetir
        subDecisionDiv.style.display = 'none';
        // Detener el sonido del coche si se eligió quemar
        if (choice === 'quemar' && carEngine) carEngine.pause();
    });
});

// =========================
// 4. BOTONES DE NAVEGACIÓN
// =========================
document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
document.getElementById('creditsBtn').addEventListener('click', () => {
    window.location.href = 'creditos.html';
});

// =========================
// 5. SONIDO DE BUS (al cargar, opcional)
// =========================
const busSound = document.getElementById('busSound');
window.addEventListener('load', () => {
    // No autoplay; se puede activar con un clic global
    document.body.addEventListener('click', () => {
        if (busSound && busSound.paused) {
            busSound.volume = 0.2;
            busSound.play().catch(e=>console.log);
        }
    }, { once: true });
});