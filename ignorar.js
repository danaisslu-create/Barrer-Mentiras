// Popups para documentos
const popup = document.getElementById('docPopup');
const popupImg = document.getElementById('popupImg');
document.querySelectorAll('.doc-item').forEach(doc => {
    doc.addEventListener('click', () => {
        const img = doc.querySelector('img').src;
        popupImg.src = img;
        popup.style.display = 'flex';
        // Sonido de papel al abrir
    });
});
document.querySelector('.close-popup').addEventListener('click', () => popup.style.display = 'none');
popup.addEventListener('click', (e) => { if (e.target === popup) popup.style.display = 'none'; });

// Sonidos de ambiente (bolsa, ascensor)
const bagSound = document.getElementById('bagSound');
const elevatorSound = document.getElementById('elevatorSound');
// Reproducir al cargar la página si el usuario ya interactuó (pero se puede hacer al hacer clic)
window.addEventListener('load', () => {
    // no autoplay, mejor se activan con los botones
});
document.getElementById('restartBtn').addEventListener('click', () => window.location.href = 'index.html');
document.getElementById('creditsBtn').addEventListener('click', () => window.location.href = 'creditos.html');

// Hilos decorativos (mismo código que en index, pero más tenues)
// ... (copiar el canvas animation de index)