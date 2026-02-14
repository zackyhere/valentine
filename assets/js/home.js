/**
 * home.js
 * Handles the "Enter" button logic and confetti.
 */

const enterBtn = document.getElementById('enterBtn');

if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add a visual "pop" effect
        enterBtn.innerText = "Here we go! 🚀";
        enterBtn.style.transform = "scale(0.9)";
        
        // Simple manual confetti burst (creating a few DOM elements)
        // In a real scenario, we might use a library, but sticking to Vanilla JS DOM here
        spawnConfetti(e.clientX, e.clientY);

        // Delay navigation slightly to show effect
        setTimeout(() => {
            window.location.href = 'wish.html';
        }, 600);
    });
}

function spawnConfetti(x, y) {
    const colors = ['#ff6fa3', '#fff', '#ffd700'];
    for(let i=0; i<15; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[i % colors.length];
        confetti.style.borderRadius = '50%';
        confetti.style.transition = 'all 0.5s ease-out';
        confetti.style.zIndex = '999';
        
        document.body.appendChild(confetti);

        // Explode outward
        requestAnimationFrame(() => {
            const destX = (Math.random() - 0.5) * 200;
            const destY = (Math.random() - 0.5) * 200;
            confetti.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
            confetti.style.opacity = 0;
        });

        setTimeout(() => confetti.remove(), 500);
    }
}
