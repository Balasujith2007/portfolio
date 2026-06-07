/* ── EmailJS Init ── */
(function(){
  if(typeof emailjs !== 'undefined') emailjs.init('hWoQqwbkmXW_v7gh6');
})();

/* ── Page Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if(loader) loader.classList.add('hidden');
  }, 1500);
});

/* ── Custom Cursor ── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor(){
  if(cursor && follower){
    cursor.style.left   = mx + 'px';
    cursor.style.top    = my + 'px';
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ── Navbar ── */
const navbar   = document.getElementById('navbar');
const hamburger= document.getElementById('hamburger');
const navMenu  = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
});

if(hamburger) hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navMenu.classList.remove('active')));

function highlightNav(){
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if(window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

/* ── Typing Animation ── */
const roles = ['Full Stack Developer','MERN Stack Developer','Software Engineer','React & Node.js Developer'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function type(){
  if(!typingEl) return;
  const word = roles[roleIdx];
  if(deleting){
    typingEl.textContent = word.substring(0, --charIdx);
    if(charIdx === 0){ deleting = false; roleIdx = (roleIdx+1) % roles.length; return setTimeout(type, 400); }
    return setTimeout(type, 50);
  }
  typingEl.textContent = word.substring(0, ++charIdx);
  if(charIdx === word.length){ deleting = true; return setTimeout(type, 2000); }
  setTimeout(type, 100);
}
type();

/* ── Particles (unique paths per particle) ── */
const particlesContainer = document.getElementById('particles');
if(particlesContainer){
  const count = 55;
  const styleSheet = document.createElement('style');
  let keyframes = '';

  for(let i = 0; i < count; i++){
    const size = Math.random()*3 + 1;
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:${Math.random()>.5?'#00f2ff':'#7b2ff7'};
      border-radius:50%;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      opacity:${(Math.random()*.4+.1).toFixed(2)};
      animation:particle${i} ${(Math.random()*15+8).toFixed(1)}s infinite ease-in-out;
    `;
    particlesContainer.appendChild(p);

    // Unique keyframe per particle
    const dx1=(Math.random()*120-60).toFixed(0), dy1=(Math.random()*120-60).toFixed(0);
    const dx2=(Math.random()*120-60).toFixed(0), dy2=(Math.random()*120-60).toFixed(0);
    const dx3=(Math.random()*80-40).toFixed(0),  dy3=(Math.random()*80-40).toFixed(0);
    keyframes += `
      @keyframes particle${i}{
        0%,100%{transform:translate(0,0)}
        25%{transform:translate(${dx1}px,${dy1}px)}
        50%{transform:translate(${dx2}px,${dy2}px)}
        75%{transform:translate(${dx3}px,${dy3}px)}
      }
    `;
  }
  styleSheet.textContent = keyframes;
  document.head.appendChild(styleSheet);
}

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Skill Bars ── */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.width = e.target.dataset.progress + '%';
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-progress').forEach(el => skillObserver.observe(el));

/* ── Counter Animation ── */
function animateCounter(el){
  const raw    = el.innerText.trim();
  const isPlus = raw.includes('+');
  const isDot  = raw.includes('.');
  const end    = parseFloat(raw);
  const dur    = 1800;
  const step   = 16;
  const steps  = dur / step;
  const inc    = end / steps;
  let current  = 0;
  el.setAttribute('data-target', end);

  const timer = setInterval(() => {
    current = Math.min(current + inc, end);
    el.innerText = (isDot ? current.toFixed(2) : Math.floor(current)) + (isPlus ? '+' : '');
    if(current >= end) clearInterval(timer);
  }, step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-item h4').forEach(el => counterObserver.observe(el));

/* ── Contact Form with EmailJS ── */
const form      = document.getElementById('contact-form');
const statusEl  = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const btnText   = document.getElementById('btn-text');
const btnLoad   = document.getElementById('btn-loading');

if(form){
  form.addEventListener('submit', async e => {
    e.preventDefault();
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline-flex';
    submitBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      if(typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
      const result = await emailjs.sendForm('service_jhnpxxj', 'template_ermvgd4', form);
      if(result.text === 'OK'){
        statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
        statusEl.className = 'form-status success';
        form.reset();
      } else { throw new Error('Send failed'); }
    } catch(err) {
      console.error('EmailJS error:', err);
      statusEl.textContent = '✗ Failed to send. Please email me directly at kit28.24bad026@gmail.com';
      statusEl.className = 'form-status error';
    } finally {
      btnText.style.display = 'inline-flex';
      btnLoad.style.display = 'none';
      submitBtn.disabled = false;
      setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'form-status'; }, 6000);
    }
  });
}

/* ── Profile floating particles ── */
(function spawnProfileParticles(){
    const container = document.getElementById('profile-particles');
    if(!container) return;

    const configs = [
        // [size, color,   tx,   ty,  dur, delay]
        [3, '#00f2ff',  55, -70,  5.5, 0.0],
        [2, '#7b2ff7', -60, -50,  6.2, 0.4],
        [4, '#00f2ff',  40,  65,  7.0, 0.8],
        [2, '#7b2ff7', -45,  55,  5.8, 1.2],
        [3, '#00f2ff',  70,  10,  6.8, 0.2],
        [2, '#00f2ff', -70,   5,  6.0, 1.6],
        [2, '#7b2ff7',  20, -80,  7.5, 0.6],
        [3, '#00f2ff', -25, -75,  5.2, 1.0],
        [2, '#7b2ff7',  65, -30,  6.4, 1.8],
        [2, '#00f2ff', -50, -60,  7.2, 0.3],
        [3, '#7b2ff7',  30,  80,  6.6, 0.9],
        [2, '#00f2ff', -35,  70,  5.6, 1.4],
    ];

    const r = 145; // radius from center to start position
    configs.forEach(([size, color, tx, ty, dur, delay], i) => {
        const angle = (i / configs.length) * 2 * Math.PI;
        const dot = document.createElement('div');
        dot.className = 'pp';
        dot.style.cssText = `
            width:${size}px; height:${size}px;
            background:${color};
            box-shadow: 0 0 ${size * 3}px ${color};
            left:calc(50% + ${Math.cos(angle)*r}px);
            top:calc(50% + ${Math.sin(angle)*r}px);
            --tx:${tx}px; --ty:${ty}px;
            --dur:${dur}s; --delay:${delay}s;
            animation-delay:${delay}s;
        `;
        container.appendChild(dot);
    });
})();
