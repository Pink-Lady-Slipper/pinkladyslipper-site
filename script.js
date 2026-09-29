// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mailing list signup. Hosts without a backend (including PROD, for now) keep the Join pill hidden.
const joinBlock = document.getElementById('joinBlock');

if (joinBlock) {
  const TEST_LIST_ENDPOINT = 'https://pls-list-test.baseball4537.workers.dev/api/list';
  const listEndpoints = {
    localhost: TEST_LIST_ENDPOINT,
    '127.0.0.1': TEST_LIST_ENDPOINT,
    'shankardba.github.io': TEST_LIST_ENDPOINT,
  };
  const listEndpoint = listEndpoints[location.hostname];

  if (listEndpoint) {
    const joinToggle = document.getElementById('joinToggle');
    const joinForm = document.getElementById('joinForm');

    // Must run before the deferred widget.js renders the form.
    joinForm.setAttribute('data-endpoint', listEndpoint);
    joinBlock.hidden = false;

    joinToggle.addEventListener('click', () => {
      const opening = joinForm.hidden;
      joinForm.hidden = !opening;
      joinToggle.setAttribute('aria-expanded', String(opening));
      joinToggle.classList.toggle('is-open', opening);
      if (opening) {
        const emailInput = joinForm.querySelector('input[type="email"]');
        if (emailInput) emailInput.focus();
      }
    });
  }
}

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
