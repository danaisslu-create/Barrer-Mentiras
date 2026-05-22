// Popup para documentos (mismo de conservar)
const popup = document.getElementById('docPopup');
const popupImg = document.getElementById('popupImg');
const closePopup = document.querySelector('.close-popup');

document.querySelectorAll('.doc-item').forEach(doc => {
    doc.addEventListener('click', () => {
        const imgSrc = doc.getAttribute('data-img');
        popupImg.src = imgSrc;
        popup.style.display = 'flex';
    });
});
closePopup.addEventListener('click', () => popup.style.display = 'none');
popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.style.display = 'none';
});

document.getElementById('restartBtn').addEventListener('click', () => {
    window.location.href = 'intro.html';
});
document.getElementById('creditsBtn').addEventListener('click', () => {
    window.location.href = 'creditos.html';
});

const threadsContainer = document.getElementById('threadsContainer');
for (let i = 0; i < 30; i++) {
    const thread = document.createElement('div');
    thread.classList.add('thread');
    thread.style.left = Math.random() * 100 + '%';
    thread.style.animationDelay = Math.random() * 10 + 's';
    thread.style.animationDuration = 6 + Math.random() * 8 + 's';
    thread.style.height = 30 + Math.random() * 100 + 'px';
    thread.style.opacity = 0.2 + Math.random() * 0.4;
    threadsContainer.appendChild(thread);
}