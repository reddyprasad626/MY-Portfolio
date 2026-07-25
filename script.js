document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 500);
});

/* ---------- Scroll progress + navbar state ---------- */
const header = document.getElementById('header');
const progressBar = document.getElementById('scroll-progress');
function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (docHeight > 0 ? (scrollTop/docHeight)*100 : 0) + '%';
  header.classList.toggle('scrolled', scrollTop > 30);

  // active nav link
  let current = '';
  document.querySelectorAll('main section, .hero').forEach(sec=>{
    const top = sec.offsetTop - 140;
    if(scrollTop >= top) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });

  document.getElementById('backTop').style.opacity = scrollTop > 500 ? '1' : '.4';
}
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;
function setTheme(t){
  body.setAttribute('data-theme', t);
  themeIcon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  localStorage.setItem('portfolio-theme', t);
}
const savedTheme = localStorage.getItem('portfolio-theme');
if(savedTheme) setTheme(savedTheme);
themeToggle.addEventListener('click', ()=>{
  setTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- Mobile nav ---------- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const scrim = document.getElementById('scrim');
function toggleMenu(open){
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  mobileNav.classList.toggle('open', open);
  scrim.classList.toggle('show', open);
}
hamburger.addEventListener('click', ()=> toggleMenu(!mobileNav.classList.contains('open')));
scrim.addEventListener('click', ()=> toggleMenu(false));
document.querySelectorAll('.mobile-nav a').forEach(a=> a.addEventListener('click', ()=> toggleMenu(false)));

/* ---------- Hero role typing effect ---------- */
const roles = [
  'MCA Student', 'Aspiring Full Stack Developer', 'Tech Enthusiast'
];
const typedEl = document.getElementById('typedRole');
let rIdx = 0, cIdx = 0, deleting = false;
function typeLoop(){
  const full = roles[rIdx];
  if(!deleting){
    cIdx++;
    typedEl.textContent = full.slice(0, cIdx);
    if(cIdx === full.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    cIdx--;
    typedEl.textContent = full.slice(0, cIdx);
    if(cIdx === 0){ deleting = false; rIdx = (rIdx+1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el=> revealObserver.observe(el));

/* ---------- Skills data + render + animated bars ---------- */
const skills = [
  {name:'HTML', icon:'fa-brands fa-html5', pct:92},
  {name:'CSS', icon:'fa-brands fa-css3-alt', pct:88},
  {name:'JavaScript', icon:'fa-brands fa-js', pct:85},
  {name:'React', icon:'fa-brands fa-react', pct:80},
  {name:'Python', icon:'fa-brands fa-python', pct:82},
  {name:'Java', icon:'fa-brands fa-java', pct:75},
  {name:'SQL', icon:'fa-solid fa-database', pct:78},
  {name:'Git & GitHub', icon:'fa-brands fa-git-alt', pct:86},
  {name:'Bootstrap', icon:'fa-brands fa-bootstrap', pct:80},
  {name:'Tailwind CSS', icon:'fa-solid fa-wind', pct:84},
  {name:'C Programming', icon:'fa-solid fa-c', pct:70},
  {name:'Data Structures', icon:'fa-solid fa-sitemap', pct:76},
];
const skillsGrid = document.getElementById('skillsGrid');
skills.forEach((s, i)=>{
  const div = document.createElement('div');
  div.className = 'glass skill-card reveal reveal-delay-' + ((i%4)+1);
  div.innerHTML = `
    <div class="skill-top">
      <div class="skill-ic"><i class="${s.icon}"></i></div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-pct">${s.pct}%</div>
    </div>
    <div class="bar-track"><div class="bar-fill" data-pct="${s.pct}"></div></div>
  `;
  skillsGrid.appendChild(div);
  revealObserver.observe(div);
});
const barObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const fill = entry.target.querySelector('.bar-fill');
      if(fill) fill.style.width = fill.dataset.pct + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.3});
document.querySelectorAll('.skill-card').forEach(c=> barObserver.observe(c));

/* Journey bars animate on view too */
const journeyObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const span = entry.target.querySelector('.journey-bar span');
      if(span){ const w = span.style.width; span.style.width = '0%'; requestAnimationFrame(()=> setTimeout(()=> span.style.width = w, 50)); }
      journeyObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.3});
document.querySelectorAll('.journey-step').forEach(c=> journeyObserver.observe(c));

/* ---------- Contact form (front-end only) ---------- */
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = "Thanks! Your message is ready — connect a backend or mailto action to actually send it.";
  this.reset();
});

/* ---------- Back to top ---------- */
document.getElementById('backTop').addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior:'smooth'});
});
