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
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
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