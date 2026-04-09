// ===== Typing Animation =====
class TypingAnimation {
  constructor(element, words, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.words = words;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.tick();
  }

  tick() {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = currentWord.substring(0, this.charIndex);

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = 500;
    }

    setTimeout(() => this.tick(), delay);
  }
}

// ===== Theme Toggle =====
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('theme-toggle-mobile');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (!prefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcons();
  }

  function updateToggleIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const icon = isDark ? sunIcon : moonIcon;
    if (toggle) toggle.innerHTML = icon;
    if (mobileToggle) mobileToggle.innerHTML = icon;
  }

  if (toggle) toggle.addEventListener('click', toggleTheme);
  if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);
  updateToggleIcons();
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  window.addEventListener('scroll', () => {
    // Scrolled state
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== Scroll Reveal =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== Contact Form =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xnjoydbl', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        form.reset();
        btn.innerHTML = 'Message Sent!';
        btn.style.backgroundColor = '#22c55e';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 3000);
      } else {
        btn.innerHTML = 'Failed — try again';
        btn.style.backgroundColor = '#ef4444';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 3000);
      }
    } catch {
      btn.innerHTML = 'Failed — try again';
      btn.style.backgroundColor = '#ef4444';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ===== Clickable Cards =====
function initClickableCards() {
  document.querySelectorAll('.card[data-href]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if they clicked a button/link inside the card
      if (e.target.closest('a')) return;
      window.open(card.getAttribute('data-href'), '_blank');
    });
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  initClickableCards();
  initContactForm();

  // Start typing animation
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    new TypingAnimation(typingEl, [
      'Full-Stack Web Developer',
      'Software Engineer',
      'Problem Solver',
      'Code Enthusiast',
      'Multifaceted Individual',
      'Passionate Learner',
    ]);
  }
});
