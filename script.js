// Top-right menu (Media / Music / Lyrics)
const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');

const setMenuOpen = (open) => {
  menuPanel.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.classList.toggle('is-open', open);
};

menuToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  setMenuOpen(menuPanel.hidden);
});

document.addEventListener('click', (event) => {
  if (!menuPanel.hidden && !menuPanel.contains(event.target)) setMenuOpen(false);
});

menuPanel.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menuPanel.hidden) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Media lightbox
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryImages = Array.from(document.querySelectorAll('.media-item img'));
  let currentIndex = -1;

  const showIndex = (index) => {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  };

  const openLightbox = (index) => {
    showIndex(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (event) => {
      event.stopPropagation();
      showIndex(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (event) => {
      event.stopPropagation();
      showIndex(currentIndex + 1);
    });
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showIndex(currentIndex - 1);
    if (event.key === 'ArrowRight') showIndex(currentIndex + 1);
  });
}
