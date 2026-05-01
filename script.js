/* ============================================
   ASABA SCHOOL MASINDI — MAIN JAVASCRIPT
   BSE1208 Introduction to Web Development
   ============================================ */

/* ---- NAVIGATION: Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburger.setAttribute(
      'aria-expanded',
      mainNav.classList.contains('open') ? 'true' : 'false'
    );
  });
  // Close nav when a link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

/* ---- ACTIVE NAV LINK (highlight current page) ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav ul li a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ---- SCROLL TO TOP BUTTON ---- */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- FADE-IN ON SCROLL (Intersection Observer) ---- */
const fadeElements = document.querySelectorAll('.fade-in');
if (fadeElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeElements.forEach(el => observer.observe(el));
}

/* ---- GALLERY FILTER ---- */
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = category === 'all' || item.dataset.category === category;
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      setTimeout(() => {
        item.style.display = match ? 'flex' : 'none';
        if (match) {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        }
      }, 200);
    });
  });
});

/* ---- IMAGE SLIDESHOW (Hero banner if present) ---- */
const slides    = document.querySelectorAll('.slideshow-slide');
const dots      = document.querySelectorAll('.slide-dot');
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === n);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === n);
  });
  currentSlide = n;
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

if (slides.length > 0) {
  showSlide(0);
  slideInterval = setInterval(nextSlide, 4000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(i);
      slideInterval = setInterval(nextSlide, 4000);
    });
  });

  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    showSlide((currentSlide - 1 + slides.length) % slides.length);
    slideInterval = setInterval(nextSlide, 4000);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    slideInterval = setInterval(nextSlide, 4000);
  });
}

/* ---- COUNTER ANIMATION (Stats) ---- */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        animateCounter(counter, parseInt(counter.dataset.count), 1200);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statSection = document.querySelector('.hero-stats, .stats-section');
if (statSection) statObserver.observe(statSection);

/* ---- CONTACT FORM VALIDATION ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Clear all errors
    this.querySelectorAll('.form-error').forEach(err => {
      err.style.display = 'none';
      err.textContent = '';
    });
    this.querySelectorAll('input, select, textarea').forEach(el => {
      el.style.borderColor = '#d4e6da';
    });

    // Validate name
    const name = this.querySelector('#name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // Validate email
    const email = this.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate phone (optional but must be valid if filled)
    const phone = this.querySelector('#phone');
    if (phone && phone.value.trim()) {
      const phoneRegex = /^[\+\d\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(phone.value.trim())) {
        showError(phone, 'Please enter a valid phone number.');
        isValid = false;
      }
    }

    // Validate subject
    const subject = this.querySelector('#subject');
    if (subject && !subject.value) {
      showError(subject, 'Please select a subject.');
      isValid = false;
    }

    // Validate message
    const message = this.querySelector('#message');
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Please enter a message (at least 10 characters).');
      isValid = false;
    }

    if (isValid) {
      // Show success
      const successMsg = document.getElementById('formSuccess');
      if (successMsg) {
        contactForm.reset();
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }
  });

  function showError(input, message) {
    input.style.borderColor = '#c0392b';
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  // Real-time validation feedback
  contactForm.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', function () {
      this.style.borderColor = this.value.trim() ? 'var(--green-mid)' : '#d4e6da';
      const errorEl = document.getElementById(this.id + 'Error');
      if (errorEl) errorEl.style.display = 'none';
    });
  });
}

/* ---- DYNAMIC YEAR IN FOOTER ---- */
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
