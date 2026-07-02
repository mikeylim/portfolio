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

// ===== Project Round Slider =====
function initProjectRoundSlider() {
  const slider = document.querySelector('[data-project-round-slider]');
  if (!slider) return;

  const stage = slider.querySelector('[data-project-stage]');
  const cards = Array.from(slider.querySelectorAll('.project-round-card'));
  const prevButton = slider.querySelector('[data-project-prev]');
  const nextButton = slider.querySelector('[data-project-next]');
  const statusEl = slider.querySelector('[data-project-status]');

  if (!stage || cards.length === 0) return;

  const angleInterval = 360 / cards.length;
  let currentAngle = 0;
  let activeIndex = 0;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let isDragging = false;
  let suppressClick = false;
  let activeAnimationTimer = null;
  let resizeFrame = null;

  const mod = (value, length) => ((value % length) + length) % length;
  const normalizeAngle = (angle) => {
    const normalized = ((angle + 180) % 360 + 360) % 360 - 180;
    return normalized === -180 ? 180 : normalized;
  };

  function getConfig() {
    const width = window.innerWidth;

    if (width <= 640) {
      return {
        width: 35,
        depth: 72,
        size: 1.95,
        rotate: 0.36,
        drag: 0.38,
        minScale: 0.62,
        scaleBoost: 0.42,
        scalePower: 2.4,
        verticalLift: 22
      };
    }

    if (width <= 900) {
      return {
        width: 44,
        depth: 110,
        size: 2.25,
        rotate: 0.44,
        drag: 0.34,
        minScale: 0.5,
        scaleBoost: 0.56,
        scalePower: 3.4,
        verticalLift: 34
      };
    }

    return {
      width: 50,
      depth: 172,
      size: 2.8,
      rotate: 0.56,
      drag: 0.32,
      minScale: 0.42,
      scaleBoost: 0.68,
      scalePower: 4.8,
      verticalLift: 44
    };
  }

  function getCardTitle(card, index) {
    const title = card.querySelector('h3');
    return title ? title.textContent.trim() : `Project ${index + 1}`;
  }

  function setActiveState() {
    activeIndex = mod(Math.round(-currentAngle / angleInterval), cards.length);

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-current', isActive ? 'true' : 'false');
      card.setAttribute('aria-hidden', isActive ? 'false' : 'true');

      card.querySelectorAll('a, button').forEach(control => {
        control.tabIndex = isActive ? 0 : -1;
      });
    });

    if (statusEl) {
      statusEl.textContent = `${getCardTitle(cards[activeIndex], activeIndex)}, ${activeIndex + 1} of ${cards.length}`;
    }
  }

  function render(angleOffset = currentAngle) {
    const config = getConfig();

    cards.forEach((card, index) => {
      const angle = angleInterval * index + angleOffset;
      const normalized = normalizeAngle(angle);
      const radians = normalized * Math.PI / 180;
      const x = config.width * Math.sin(radians) * config.size;
      const z = (config.depth - config.depth * Math.cos(radians)) * config.size * -1;
      const distance = Math.min(Math.abs(normalized), 180);
      const frontness = Math.max(0, 1 - distance / 180);
      const depthScale = Math.pow(frontness, config.scalePower);
      const scale = config.minScale + depthScale * config.scaleBoost;
      const y = (1 - frontness) * config.verticalLift;
      const rotateY = normalized * -config.rotate;
      const opacity = distance > 170 ? 0 : 0.36 + frontness * 0.64;

      card.style.transform = `translate(-50%, -50%) translate3d(${x}%, ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale}) scale(var(--project-active-pop-scale, 1))`;
      card.style.opacity = Math.max(0, opacity).toFixed(3);
      card.style.zIndex = String(Math.round(1000 + frontness * 500));
      card.classList.toggle('is-far', distance > 152);
    });
  }

  function animateActiveCard() {
    if (activeAnimationTimer) clearTimeout(activeAnimationTimer);

    cards.forEach(card => card.classList.remove('is-expanding'));
    activeAnimationTimer = setTimeout(() => {
      const card = cards[activeIndex];
      if (!card || isDragging) return;

      card.classList.remove('is-expanding');
      void card.offsetWidth;
      card.classList.add('is-expanding');
    }, 430);
  }

  function snapToAngle(angle) {
    currentAngle = Math.round(angle / angleInterval) * angleInterval;
    setActiveState();
    render();
    animateActiveCard();
  }

  function nearestAngleForIndex(index) {
    const desiredAngle = -index * angleInterval;
    const turnOffset = Math.round((currentAngle - desiredAngle) / 360);
    return desiredAngle + turnOffset * 360;
  }

  function goToIndex(index) {
    currentAngle = nearestAngleForIndex(mod(index, cards.length));
    setActiveState();
    render();
    animateActiveCard();
  }

  function rotate(direction) {
    currentAngle -= direction * angleInterval;
    setActiveState();
    render();
    animateActiveCard();
    slider.focus({ preventScroll: true });
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest('a, button')) return;

    isDragging = true;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    suppressClick = false;
    if (activeAnimationTimer) clearTimeout(activeAnimationTimer);
    cards.forEach(card => card.classList.remove('is-expanding'));
    slider.classList.add('is-dragging');
    slider.focus({ preventScroll: true });

    if (stage.setPointerCapture) {
      stage.setPointerCapture(event.pointerId);
    }
  }

  function onPointerMove(event) {
    if (!isDragging) return;

    dragDeltaX = event.clientX - dragStartX;
    if (Math.abs(dragDeltaX) > 3) {
      render(currentAngle + dragDeltaX * getConfig().drag);
      event.preventDefault();
    }
  }

  function onPointerEnd(event) {
    if (!isDragging) return;

    const config = getConfig();
    let targetAngle = currentAngle + dragDeltaX * config.drag;

    if (
      Math.abs(dragDeltaX) > 48 &&
      Math.round(targetAngle / angleInterval) === Math.round(currentAngle / angleInterval)
    ) {
      targetAngle = currentAngle + (dragDeltaX > 0 ? angleInterval : -angleInterval);
    }

    suppressClick = Math.abs(dragDeltaX) > 8;
    isDragging = false;
    slider.classList.remove('is-dragging');

    if (
      stage.releasePointerCapture &&
      stage.hasPointerCapture &&
      stage.hasPointerCapture(event.pointerId)
    ) {
      stage.releasePointerCapture(event.pointerId);
    }

    snapToAngle(targetAngle);
    setTimeout(() => {
      suppressClick = false;
    }, 0);
  }

  cards.forEach((card, index) => {
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${index + 1} of ${cards.length}: ${getCardTitle(card, index)}`);
    card.dataset.projectIndex = String(index);

    const image = card.querySelector('img');
    if (image) image.setAttribute('draggable', 'false');

    card.addEventListener('animationend', (event) => {
      if (event.animationName === 'projectSelectedExpand') {
        card.classList.remove('is-expanding');
      }
    });

    card.addEventListener('click', (event) => {
      if (suppressClick) return;
      if (event.target.closest('a, button') && index === activeIndex) return;

      event.preventDefault();
      if (index !== activeIndex) {
        goToIndex(index);
        slider.focus({ preventScroll: true });
      }
    });
  });

  if (prevButton) prevButton.addEventListener('click', () => rotate(-1));
  if (nextButton) nextButton.addEventListener('click', () => rotate(1));

  slider.addEventListener('keydown', (event) => {
    if (event.target !== slider) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      rotate(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      rotate(1);
    }
  });

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerEnd);
  stage.addEventListener('pointercancel', onPointerEnd);
  stage.addEventListener('lostpointercapture', onPointerEnd);

  window.addEventListener('resize', () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      render();
    });
  });

  setActiveState();
  render();
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
  initProjectRoundSlider();
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
      'Multifaceted Individual',
      'Avid Adventurer',
      'Passionate Learner',
    ]);
  }
});
