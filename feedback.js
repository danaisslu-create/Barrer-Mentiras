const canvas = document.getElementById('threadCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth, height = window.innerHeight;

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
        length: 25 + Math.random() * 70,
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

// Mostrar campo de texto si selecciona "otro"
const radios = document.querySelectorAll('input[name="medium"]');
const otroInput = document.getElementById('otroMedium');
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'otro') {
            otroInput.style.display = 'block';
        } else {
            otroInput.style.display = 'none';
        }
    });
});

// Envío del formulario
const form = document.getElementById('feedbackForm');
const thanksDiv = document.getElementById('thanksMessage');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const suggestions = document.getElementById('suggestions').value;
    let medium = document.querySelector('input[name="medium"]:checked')?.value;
    if (medium === 'otro') {
        medium = otroInput.value || 'Otro (sin especificar)';
    }
    if (!medium) medium = 'No seleccionado';
    // Guardar en localStorage (opcional)
    const feedback = { suggestions, medium, date: new Date().toISOString() };
    localStorage.setItem('userFeedback', JSON.stringify(feedback));
    thanksDiv.classList.remove('hidden');
    form.reset();
    otroInput.style.display = 'none';
    setTimeout(() => {
        thanksDiv.classList.add('hidden');
    }, 5000);
});

document.getElementById('backToCredits').addEventListener('click', () => {
    window.location.href = 'creditos.html';
});