/**
 * album.js
 * Fetches images from the local API and renders the gallery.
 */

const API_ENDPOINT = 'https://pic.zackyhere.my.id/our-pic';
const grid = document.getElementById('gallery-grid');
const statusMsg = document.getElementById('status-message');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

// 1. Fetch Logic
async function loadPhotos() {
    try {
        const res = await fetch(API_ENDPOINT);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        
        const photoUrls = await res.json();
        
        if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
            throw new Error('API returned empty or invalid data');
        }

        renderGallery(photoUrls);

    } catch (err) {
        console.error("Fetch Error:", err);
        showError(err);
        
        // Optional: Render fallback/demo images if API fails so the site isn't empty
        renderFallback();
    }
}

// 2. Render Logic
function renderGallery(urls) {
    grid.innerHTML = ''; // Clear loader

    urls.forEach((url, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.tabIndex = 0; // Accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View photo ${index + 1}`);

        const img = document.createElement('img');
        img.src = url;
        img.alt = `Memory number ${index + 1}`;
        img.loading = 'lazy';
        
        // Click / Enter interaction
        const openAction = () => openLightbox(url, `Memory #${index + 1}`);
        card.addEventListener('click', openAction);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAction();
            }
        });

        card.appendChild(img);
        grid.appendChild(card);
    });
}

// 3. Error Handling
function showError(err) {
    statusMsg.classList.remove('hidden');
    statusMsg.innerHTML = `
        <h3 class="error-text">Oops! Couldn't load our photos.</h3>
        <p>Ensure the local server is running on port 3545 and allows CORS.</p>
        <code class="code-snippet">Error: ${err.message}</code>
        <p style="margin-top:10px; font-size:0.9rem; color:#666;">(Showing demo images instead)</p>
    `;
}

function renderFallback() {
    // Fallback images (Placeholders)
    const fallbacks = [
        'https://placehold.co/600x600/ffc0db/4b2a3a?text=You+&+Me',
        'https://placehold.co/600x600/ff6fa3/ffffff?text=Date+Night',
        'https://placehold.co/600x600/fff5f8/ff6fa3?text=Cute+Moment'
    ];
    // Create new elements for fallback without clearing the error message
    const fragment = document.createDocumentFragment();
    fallbacks.forEach((url, i) => {
        const div = document.createElement('div');
        div.className = 'photo-card';
        div.innerHTML = `<img src="${url}" alt="Demo ${i}">`;
        div.addEventListener('click', () => openLightbox(url, 'Demo Image'));
        fragment.appendChild(div);
    });
    // If grid was cleared, append. If not, replace loader
    if(grid.innerHTML.includes('Loading')) grid.innerHTML = '';
    grid.appendChild(fragment);
}

// 4. Lightbox Logic
function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling bg
    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
    document.body.style.overflow = '';
}

// Event Listeners for Lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
    }
});

// Start
loadPhotos();
