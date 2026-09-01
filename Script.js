(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Footer year
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Nav: scrolled state, mobile toggle, active link, smooth scroll
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScrollNav = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
  });

  document.querySelectorAll('.nav__links a, .footer__inner a[href="#hero"]').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('is-open'));
  });

  const sections = [...document.querySelectorAll('main section, header.hero')];
  const navAnchors = [...document.querySelectorAll('[data-nav]')];

  const setActiveLink = () => {
    let current = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ----------------------------------------------------------
     Scroll progress bar
  ---------------------------------------------------------- */
  const progressBar = document.getElementById('scrollProgress');
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  };
  onScrollProgress();
  window.addEventListener('scroll', onScrollProgress, { passive: true });

  /* ----------------------------------------------------------
     Cursor-follow ambient glow (desktop only)
  ---------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && !reduceMotion && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
    window.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
  }

  /* ----------------------------------------------------------
     Scroll reveal via IntersectionObserver
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Array.from(el.parentElement?.querySelectorAll('[data-reveal]') || [])
            .indexOf(el);
          setTimeout(() => el.classList.add('is-visible'), Math.min(delay, 4) * 90);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ----------------------------------------------------------
     Hero terminal "typing" sequence
  ---------------------------------------------------------- */
  const terminalBody = document.getElementById('terminalBody');

  const typeLine = (el, text, speed = 28) => new Promise((resolve) => {
    if (reduceMotion) { el.textContent = text; resolve(); return; }
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        requestAnimationFrame(() => setTimeout(tick, speed));
      } else {
        resolve();
      }
    };
    tick();
  });

  const runTerminal = async () => {
    if (!terminalBody) return;
    const lines = [
      { type: 'cmd', text: 'whoami' },
      { type: 'out', text: 'asad_ameer — full stack developer' },
      { type: 'cmd', text: 'cat stack.json' },
      { type: 'out', text: '{ "core": ["MERN", "MEAN"], "focus": "AI/ML-aware full stack apps" }' },
      { type: 'cmd', text: './build_project.sh --name GharFix' },
      { type: 'out', text: 'status: shipped ✓ role-based marketplace, React + Laravel + MySQL' },
    ];

    for (const line of lines) {
      const p = document.createElement('p');
      if (line.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '$';
        const span = document.createElement('span');
        p.appendChild(prompt);
        p.appendChild(span);
        terminalBody.appendChild(p);
        p.style.opacity = '1';
        await typeLine(span, line.text);
        await new Promise(r => setTimeout(r, 220));
      } else {
        p.className = 'out';
        p.textContent = line.text;
        terminalBody.appendChild(p);
        p.style.opacity = '1';
        await new Promise(r => setTimeout(r, 350));
      }
    }
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    const lastP = document.createElement('p');
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = '$';
    lastP.appendChild(prompt);
    lastP.appendChild(cursor);
    lastP.style.opacity = '1';
    terminalBody.appendChild(lastP);
  };

  // Kick off terminal once hero is visible
  runTerminal();

  /* ----------------------------------------------------------
     Tilt effect for cards
  ---------------------------------------------------------- */
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const glow = card.querySelector('.skill-card__glow');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = x - rect.width / 2;
        const cy = y - rect.height / 2;
        const rotateX = (cy / rect.height) * -6;
        const rotateY = (cx / rect.width) * 6;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        if (glow) {
          glow.style.setProperty('--mx', `${x}px`);
          glow.style.setProperty('--my', `${y}px`);
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     Magnetic buttons
  ---------------------------------------------------------- */
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     Back to top
  ---------------------------------------------------------- */
  document.getElementById('toTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ----------------------------------------------------------
     Contact form validation (client-side only)
  ---------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.',
  };

  const showError = (field, msg) => {
    const wrapper = field.closest('.field');
    const errorEl = wrapper.querySelector('.field__error');
    wrapper.classList.toggle('has-error', !!msg);
    errorEl.textContent = msg;
  };

  form?.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      const msg = validators[field.name]?.(field.value) || '';
      showError(field, msg);
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
      const msg = validators[field.name]?.(field.value) || '';
      showError(field, msg);
      if (msg) valid = false;
    });

    if (!valid) {
      status.textContent = 'Please fix the fields highlighted above.';
      status.style.color = '#FB7185';
      return;
    }

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // No backend is connected to this static page — open the user's mail
    // client pre-filled with the message as a functional fallback.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:asadameer656@gmail.com?subject=${subject}&body=${body}`;

    status.style.color = 'var(--accent)';
    status.textContent = 'Opening your email client to send this message…';
    form.reset();
  });

})();
/* ===== Certificate lightbox ===== */
(function(){
  const lightbox = document.getElementById('certLightbox');
  if (!lightbox) return;
  const imgEl = document.getElementById('certLightboxImg');
  const captionEl = document.getElementById('certLightboxTitle');
  const closeBtn = lightbox.querySelector('.cert-lightbox__close');

  function open(src, title){
    imgEl.src = src;
    imgEl.alt = title || '';
    captionEl.textContent = title || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    setTimeout(() => { imgEl.src = ''; }, 350);
  }

  document.querySelectorAll('[data-cert-src]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.certSrc, btn.dataset.certTitle));
  });
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close(); });
})();

/* ===== Dedicated Aesthetic Backdrop Animation (Behind Photo Only) ===== */
(function initPhotoCanvas() {
  const canvas = document.getElementById('photoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const visualFx = canvas.parentElement;
  if (!ctx || !visualFx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let time = 0;

  function resize() {
    const rect = visualFx.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Floating gold dust embers around photo
  const embers = Array.from({ length: 22 }, () => ({
    x: 0.15 + Math.random() * 0.7,
    y: Math.random(),
    r: 1 + Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: -0.0004 - Math.random() * 0.0006,
    alpha: 0.2 + Math.random() * 0.6,
    glow: Math.random() * 6 + 3,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }));

  // Aesthetic Circuit traces framing the arch
  function getPhotoCircuits(w, h) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const archHalfW = w * 0.32;
    const archTopY = h * 0.15;
    const paths = [];

    // Left-side branching lines
    for (let i = 0; i < 5; i++) {
      const y = archTopY + (i + 1) * (h * 0.12);
      const startX = cx - archHalfW - 10;
      const midX = startX - 35 - (i % 3) * 15;
      const endX = midX - 45 - (i % 2) * 25;
      const endY = y + (i % 2 === 0 ? 25 : -25);
      paths.push({
        pts: [
          { x: startX, y: y },
          { x: midX, y: y },
          { x: midX - 20, y: endY },
          { x: endX, y: endY }
        ],
        nodeR: 2 + (i % 2),
        pulseProgress: (i * 0.2) % 1,
        pulseSpeed: 0.003 + (i % 3) * 0.001
      });
    }

    // Right-side branching lines
    for (let i = 0; i < 5; i++) {
      const y = archTopY + (i + 1) * (h * 0.12);
      const startX = cx + archHalfW + 10;
      const midX = startX + 35 + (i % 3) * 15;
      const endX = midX + 45 + (i % 2) * 25;
      const endY = y + (i % 2 === 0 ? -25 : 25);
      paths.push({
        pts: [
          { x: startX, y: y },
          { x: midX, y: y },
          { x: midX + 20, y: endY },
          { x: endX, y: endY }
        ],
        nodeR: 2 + (i % 2),
        pulseProgress: ((i + 2) * 0.18) % 1,
        pulseSpeed: 0.003 + (i % 3) * 0.001
      });
    }

    // Top crown aura circuits
    paths.push({
      pts: [
        { x: cx - 40, y: archTopY - 15 },
        { x: cx - 20, y: archTopY - 45 },
        { x: cx + 20, y: archTopY - 45 },
        { x: cx + 40, y: archTopY - 15 }
      ],
      nodeR: 2.5,
      pulseProgress: 0.4,
      pulseSpeed: 0.0025
    });

    return paths;
  }

  let photoCircuits = getPhotoCircuits(width, height);
  window.addEventListener('resize', () => { photoCircuits = getPhotoCircuits(width, height); });

  function drawAestheticCircuits(t) {
    ctx.save();

    photoCircuits.forEach((cp) => {
      // Circuit track
      ctx.beginPath();
      cp.pts.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.28)';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Terminal nodes
      const startPt = cp.pts[0];
      const endPt = cp.pts[cp.pts.length - 1];
      [startPt, endPt].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, cp.nodeR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.65)';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      // Subtle pulse
      if (!reduceMotion) {
        cp.pulseProgress = (cp.pulseProgress + cp.pulseSpeed) % 1;
        const totalSegments = cp.pts.length - 1;
        const segIndex = Math.min(Math.floor(cp.pulseProgress * totalSegments), totalSegments - 1);
        const segT = (cp.pulseProgress * totalSegments) - segIndex;
        const p1 = cp.pts[segIndex];
        const p2 = cp.pts[segIndex + 1];
        const px = p1.x + (p2.x - p1.x) * segT;
        const py = p1.y + (p2.y - p1.y) * segT;

        ctx.beginPath();
        ctx.arc(px, py, cp.nodeR + 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 10;
        ctx.fill();
      }
    });

    ctx.restore();
  }

  function drawPhotoEmbers(t) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    embers.forEach((p) => {
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.05) { p.y = 1.05; p.x = 0.15 + Math.random() * 0.7; }
        if (p.x < 0.05) p.x = 0.95;
        if (p.x > 0.95) p.x = 0.05;
      }

      const px = p.x * width;
      const py = p.y * height;
      const alpha = Math.max(0.1, p.alpha + Math.sin(t * 3 + p.glow) * 0.25);

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 230, 138, ${alpha})`;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.75)';
      ctx.shadowBlur = p.glow;
      ctx.fill();
    });

    ctx.restore();
  }

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(visualFx);

  function loop() {
    if (isVisible) {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      drawAestheticCircuits(time);
      drawPhotoEmbers(time);
    }
    animId = requestAnimationFrame(loop);
  }

  loop();
})();
