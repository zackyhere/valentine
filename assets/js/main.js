/**
 * main.js
 * Handles global interactions like the cursor heart trail.
 */

// Configuration
const TRAIL_CONFIG = {
    throttle: 50, // ms
    symbols: ['❤️', '✨', '💖', '🌸'],
    maxParticles: 30
};

// State
let lastParticleTime = 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Initializes the cursor trail effect
 */
function initCursorTrail() {
    if (prefersReducedMotion) return; // Respect accessibility

    const container = document.getElementById('cursor-trail');
    if (!container) return;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastParticleTime < TRAIL_CONFIG.throttle) return;
        
        createParticle(e.clientX, e.clientY, container);
        lastParticleTime = now;
    });
}

function createParticle(x, y, container) {
    // Limit DOM nodes
    if (container.childElementCount > TRAIL_CONFIG.maxParticles) {
        container.removeChild(container.firstChild);
    }

    const particle = document.createElement('span');
    const randomSymbol = TRAIL_CONFIG.symbols[Math.floor(Math.random() * TRAIL_CONFIG.symbols.length)];
    
    particle.textContent = randomSymbol;
    particle.className = 'trail-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Add random slight rotation or size var
    const randomRot = Math.random() * 40 - 20; 
    particle.style.transform = `rotate(${randomRot}deg)`;

    container.appendChild(particle);

    // Auto cleanup matches CSS animation duration (1000ms)
    setTimeout(() => {
        if (particle.parentNode === container) {
            container.removeChild(particle);
        }
    }, 1000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initCursorTrail();
});
