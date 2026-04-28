/* ═══════════════════════════════════════════
   Dialectic of the Shore — scroll animations
═══════════════════════════════════════════ */

// ── Intro paragraph fade-in ──────────────────
const introObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        introObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll('.intro-text').forEach(el => introObserver.observe(el));


// ── Scrollytelling step activation ──────────
const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '0px 0px -10% 0px'
  }
);

document.querySelectorAll('.step').forEach(step => stepObserver.observe(step));


// ── Sticky image parallax tint per chapter ──
// Subtle brightness shift as you scroll through each chapter
const chapters = document.querySelectorAll('.scrolly-chapter');

const chapterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const img = entry.target.querySelector('.sticky-image img');
      if (!img) return;
      if (entry.isIntersecting) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0.4';
      }
    });
  },
  { threshold: 0.05 }
);

chapters.forEach(ch => chapterObserver.observe(ch));


// ── Scroll cue: hide once user scrolls ──────
const scrollCue = document.querySelector('.scroll-cue');
if (scrollCue) {
  const hideCue = () => {
    if (window.scrollY > 80) {
      scrollCue.style.opacity = '0';
      scrollCue.style.pointerEvents = 'none';
      window.removeEventListener('scroll', hideCue);
    }
  };
  window.addEventListener('scroll', hideCue, { passive: true });

  scrollCue.addEventListener('click', () => {
    document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });
  });
}


// ── Activate all steps already in view on load ──
window.addEventListener('load', () => {
  document.querySelectorAll('.step').forEach(step => {
    const rect = step.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      step.classList.add('active');
    }
  });
});
