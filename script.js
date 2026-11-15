/* ========================================================
   JONATHAN PERSONAL BRANDING - JAVASCRIPT LOGIC
   Cyber & AI Enthusiast | Telkom University S1 TI
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypingEffect();
  initStatCounters();
  initProfileTilt();
  initSkillsFilter();
  initTerminalCLI();
  initSoundSystem();
  initMobileMenu();
  initNavbarScrollSpy();
  initContactForm();
});

/* -------------------------------------------------------------------------- */
/* 1. INTERACTIVE NEURAL & CYBER CANVAS PARTICLES                             */
/* -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 90);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.5 ? '#06b6d4' : '#a855f7';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision repulsion / attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect close particles with neural synapse lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------------------- */
/* 2. DYNAMIC TYPING TEXT IN HERO                                            */
/* -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typedTarget = document.getElementById('typedText');
  if (!typedTarget) return;

  const phrases = [
    'Cybersecurity Enthusiast',
    'Artificial Intelligence Explorer',
    'S1 Teknologi Informasi @ Telkom Univ',
    'Ethical Hacking & Network Defense',
    'Machine Learning & Neural Networks',
    'Securing AI & Threat Intelligence'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new phrase
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* -------------------------------------------------------------------------- */
/* 3. ANIMATED STAT COUNTERS                                                 */
/* -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('[data-target]');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          statNumbers.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target + '+';
                if (target === 100) counter.textContent = '100%';
                clearInterval(timer);
              } else {
                counter.textContent = Math.ceil(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* 4. 3D CARD TILT EFFECT (PROFILE PHOTO)                                    */
/* -------------------------------------------------------------------------- */
function initProfileTilt() {
  const card = document.getElementById('profileCard');
  if (!card) return;

  const parent = card.parentElement;

  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  parent.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* -------------------------------------------------------------------------- */
/* 5. INTERACTIVE SKILLS FILTER                                              */
/* -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skill-tab');
  const items = document.querySelectorAll('.skill-item');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      playUiSound('click');
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-category');

      items.forEach((item) => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. INTERACTIVE TERMINAL CLI                                               */
/* -------------------------------------------------------------------------- */
function initTerminalCLI() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');

  if (!form || !input || !output) return;

  window.runCommand = function (cmdStr) {
    input.value = cmdStr;
    handleCommand(cmdStr);
    input.value = '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = input.value.trim();
    if (!cmd) return;
    handleCommand(cmd);
    input.value = '';
  });

  function printLine(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase().trim();
    playUiSound('terminal');

    // Echo user prompt
    printLine(
      `<div class="flex items-center space-x-2 text-slate-300 font-mono mt-2">` +
        `<span class="text-cyan-400 font-bold">jonathan@telu:~$</span>` +
        `<span class="text-white">${escapeHtml(rawCmd)}</span>` +
      `</div>`
    );

    switch (cmd) {
      case 'help':
        printLine(`
          <div class="text-slate-300 space-y-1 font-mono text-xs pl-2 border-l-2 border-cyan-500/40 my-2">
            <div><span class="text-cyan-400 font-bold">help</span> - Tampilkan daftar perintah CLI ini</div>
            <div><span class="text-cyan-400 font-bold">about</span> - Informasi singkat tentang Jonathan</div>
            <div><span class="text-cyan-400 font-bold">edu</span> - Info jurusan dan kampus Telkom University</div>
            <div><span class="text-cyan-400 font-bold">skills</span> - Ringkasan toolkit Cyber & AI</div>
            <div><span class="text-cyan-400 font-bold">projects</span> - Daftar showcase project terbaru</div>
            <div><span class="text-cyan-400 font-bold">github</span> - Buka repository GitHub (@graventas)</div>
            <div><span class="text-cyan-400 font-bold">linkedin</span> - Buka profil LinkedIn</div>
            <div><span class="text-cyan-400 font-bold">instagram</span> - Buka profil Instagram (@grevntaz)</div>
            <div><span class="text-cyan-400 font-bold">contact</span> - Info kontak & media sosial</div>
            <div><span class="text-cyan-400 font-bold">matrix</span> - Tampilkan efek matriks terminal</div>
            <div><span class="text-cyan-400 font-bold">whoami</span> - Identitas user sesi ini</div>
            <div><span class="text-cyan-400 font-bold">clear</span> - Bersihkan riwayat tampilan terminal</div>
          </div>
        `);
        break;

      case 'about':
        printLine(`
          <div class="text-slate-200 text-xs my-2 leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-cyan-500/20">
            [IDENTITAS]<br />
            &bull; Nama: <span class="text-cyan-400 font-bold">Jonathan</span><br />
            &bull; Program: <span class="text-white font-semibold">S1 Teknologi Informasi</span><br />
            &bull; Kampus: <span class="text-red-400 font-semibold">Telkom University (Tel-U)</span><br />
            &bull; Passion: <span class="text-cyan-300">Cybersecurity</span> (Ethical Hacking, Defense) & <span class="text-purple-300">Artificial Intelligence</span> (ML/DL, Securing AI).
          </div>
        `);
        break;

      case 'edu':
      case 'telu':
      case 'kampus':
        printLine(`
          <div class="text-slate-200 text-xs my-2 leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-red-500/30">
            [PENDIDIKAN TINGGI]<br />
            &bull; Institusi: <span class="text-red-400 font-bold">Telkom University</span> (Bandung Technoplex)<br />
            &bull; Fakultas: <span class="text-white">School of Computing / Fakultas Informatika</span><br />
            &bull; Program Studi: <span class="text-cyan-400 font-semibold">S1 Teknologi Informasi (Information Technology)</span><br />
            &bull; Akreditasi: <span class="text-emerald-400">Unggul</span><br />
            &bull; Fokus Utama: Arsitektur Jaringan, Cyber Defense, Sistem Terdistribusi, dan Rekayasa Kecerdasan Buatan.
          </div>
        `);
        break;

      case 'skills':
        printLine(`
          <div class="text-slate-200 text-xs my-2 font-mono">
            <span class="text-cyan-400 font-bold">[CYBERSECURITY]</span><br />
            Wireshark, Burp Suite, Nmap, Metasploit, Kali Linux, OWASP, Cryptography.<br /><br />
            <span class="text-purple-400 font-bold">[ARTIFICIAL INTELLIGENCE]</span><br />
            Python, PyTorch, TensorFlow, Scikit-Learn, OpenCV, RAG, LLM Prompt Defense.<br /><br />
            <span class="text-emerald-400 font-bold">[DEV & INFRA]</span><br />
            Bash Scripting, Docker, Git, Linux Administration, Network Routing & Switching.
          </div>
        `);
        break;

      case 'projects':
        printLine(`
          <div class="text-slate-200 text-xs my-2 font-mono space-y-1">
            <div>1. <span class="text-cyan-400">AI-Powered Network Intrusion Detection (NIDS)</span> - Deteksi serangan berbasis ML</div>
            <div>2. <span class="text-teal-400">Automated Web Recon & Vulnerability Auditor</span> - Fast reconnaissance CLI tool</div>
            <div>3. <span class="text-purple-400">Prompt Injection Defense Guardrail</span> - Firewall proteksi untuk LLM</div>
            <div>4. <span class="text-red-400">Tel-U Academic Assistant AI</span> - RAG bot kurikulum S1 Teknologi Informasi</div>
          </div>
        `);
        break;

      case 'contact':
        printLine(`
          <div class="text-slate-200 text-xs my-2 font-mono space-y-1">
            <div>LinkedIn: <a href="https://www.linkedin.com/in/jonathan-rafael-rori-02b96b443/" target="_blank" class="text-blue-400 underline">jonathan-rafael-rori</a></div>
            <div>GitHub: <a href="https://github.com/graventas" target="_blank" class="text-cyan-400 underline">github.com/graventas</a></div>
            <div>Instagram: <a href="https://instagram.com/grevntaz" target="_blank" class="text-pink-400 underline">@grevntaz</a></div>
          </div>
        `);
        break;

      case 'github':
        printLine(`<div class="text-xs text-slate-300">Membuka repositori GitHub (@graventas)...</div>`);
        window.open('https://github.com/graventas', '_blank');
        break;

      case 'linkedin':
        printLine(`<div class="text-xs text-slate-300">Membuka profil LinkedIn...</div>`);
        window.open('https://www.linkedin.com/in/jonathan-rafael-rori-02b96b443/', '_blank');
        break;

      case 'instagram':
      case 'ig':
        printLine(`<div class="text-xs text-slate-300">Membuka profil Instagram (@grevntaz)...</div>`);
        window.open('https://instagram.com/grevntaz', '_blank');
        break;

      case 'matrix':
        printMatrixEffect();
        break;

      case 'whoami':
        printLine(`<div class="text-xs text-emerald-400 font-mono">guest_collaborator@terminal: authorized with guest privileges.</div>`);
        break;

      case 'date':
        printLine(`<div class="text-xs text-slate-300 font-mono">${new Date().toString()}</div>`);
        break;

      case 'clear':
      case 'cls':
        output.innerHTML = '';
        printLine(`<div class="text-slate-500 text-xs">Terminal cleared. Ketik <span class="text-cyan-400">help</span> untuk menu.</div>`);
        break;

      case 'sudo':
      case 'sudo su':
        printLine(`<div class="text-xs text-rose-400 font-mono">Permission denied: You are not in the sudoers file. This incident will be reported to Telkom University SOC. 😉</div>`);
        break;

      case 'cat flag.txt':
      case 'flag':
        printLine(`<div class="text-xs text-yellow-300 font-mono bg-yellow-950/40 p-2 rounded border border-yellow-500/40">🚩 FLAG{T3LK0M_UNIV_CYB3R_AI_M4ST3R_2026}</div>`);
        break;

      default:
        printLine(
          `<div class="text-xs text-rose-400 font-mono">Perintah '${escapeHtml(cmd)}' tidak dikenali. Ketik <span class="text-cyan-400 underline cursor-pointer" onclick="runCommand('help')">help</span> untuk daftar perintah.</div>`
        );
        break;
    }
  }

  function printMatrixEffect() {
    let lines = 0;
    const interval = setInterval(() => {
      const chars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      let row = '';
      for (let i = 0; i < 35; i++) {
        row += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      printLine(`<div class="text-[11px] text-emerald-400 font-mono tracking-widest">${row}</div>`);
      lines++;
      if (lines > 6) clearInterval(interval);
    }, 100);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

/* -------------------------------------------------------------------------- */
/* 7. SOUND EFFECTS ENGINE (WEB AUDIO API - NO EXTERNAL AUDIO FILES REQUIRED) */
/* -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = false;

function initSoundSystem() {
  const toggleBtn = document.getElementById('soundToggleBtn');
  const icon = document.getElementById('soundIcon');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      icon.className = 'fa-solid fa-volume-high text-lg text-cyan-400';
      toggleBtn.classList.add('border-cyan-400', 'shadow-[0_0_15px_#06b6d4]');
      playUiSound('beep');
    } else {
      icon.className = 'fa-solid fa-volume-xmark text-lg text-slate-400';
      toggleBtn.classList.remove('border-cyan-400', 'shadow-[0_0_15px_#06b6d4]');
    }
  });
}

function playUiSound(type = 'click') {
  if (!soundEnabled || !audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'terminal') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(900, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

/* -------------------------------------------------------------------------- */
/* 8. MOBILE MENU TOGGLE                                                      */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    if (menu.classList.contains('hidden')) {
      icon.className = 'fa-solid fa-bars-staggered text-xl';
    } else {
      icon.className = 'fa-solid fa-xmark text-xl text-cyan-400';
    }
  });

  const links = document.querySelectorAll('.mobile-nav-link');
  links.forEach((l) => {
    l.addEventListener('click', () => {
      menu.classList.add('hidden');
      icon.className = 'fa-solid fa-bars-staggered text-xl';
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 9. NAVBAR SCROLL SPY & HIGHLIGHT                                           */
/* -------------------------------------------------------------------------- */
function initNavbarScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('text-cyan-400');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-cyan-400');
          }
        });
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 10. COPY EMAIL & CONTACT FORM DISPATCH                                     */
/* -------------------------------------------------------------------------- */
window.copyEmail = function () {
  const email = document.getElementById('emailText').textContent.trim();
  const icon = document.getElementById('copyIcon');

  navigator.clipboard.writeText(email).then(() => {
    playUiSound('beep');
    if (icon) {
      icon.className = 'fa-solid fa-check text-emerald-400 text-sm';
      setTimeout(() => {
        icon.className = 'fa-regular fa-copy text-sm';
      }, 2000);
    }
  });
};

function initContactForm() {
  const form = document.getElementById('contactForm');
  const alert = document.getElementById('formAlert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playUiSound('click');

    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('messageSubject').value;
    const message = document.getElementById('messageBody').value;

    const fullSubject = encodeURIComponent(`[Portofolio Inquiry] ${subject} - ${name}`);
    const fullBody = encodeURIComponent(
      `Halo Jonathan,\n\nNama: ${name}\nEmail: ${email}\nTopik: ${subject}\n\nPesan:\n${message}\n\nSalam,\n${name}`
    );

    if (alert) {
      alert.classList.remove('hidden');
    }

    setTimeout(() => {
      window.location.href = `mailto:jonathan@student.telkomuniversity.ac.id?subject=${fullSubject}&body=${fullBody}`;
    }, 600);
  });
}
