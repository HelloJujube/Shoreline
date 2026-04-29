/* ═══════════════════════════════════════════
   Dialectic of the Shore — scroll logic
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


// ── Per-step image switching ─────────────────
// Each .step can carry data-image="path"; when it enters view,
// the sticky image in the same chapter fades to that image.
function swapImage(chapter, newSrc, newCredit) {
  const img = chapter.querySelector('.sticky-image img');
  if (!img || img.dataset.current === newSrc) return;
  img.dataset.current = newSrc;
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = newSrc;
    img.style.opacity = '1';
  }, 250);
  if (newCredit !== undefined) {
    const credit = chapter.querySelector('.photo-credit');
    if (credit) credit.textContent = newCredit;
  }
}

const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const chapter = entry.target.closest('.scrolly-chapter');
        if (!chapter) return;

        if (chapter.classList.contains('scrolly-chapter--grid')) {
          // Multi-image grid: activate matching mini-img(s) by index
          const indices = (entry.target.dataset.imgIndex || '').split(',').map(s => s.trim());
          chapter.querySelectorAll('.mini-img').forEach(mi => mi.classList.remove('active'));
          indices.forEach(idx => {
            const target = chapter.querySelector(`.mini-img[data-img-index="${idx}"]`);
            if (target) target.classList.add('active');
          });
        } else {
          // Single sticky image: swap src
          const imgSrc = entry.target.dataset.image;
          if (imgSrc) swapImage(chapter, imgSrc, entry.target.dataset.credit);
        }
      }
    });
  },
  { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
);
document.querySelectorAll('.step').forEach(step => stepObserver.observe(step));


// ── Chapter visibility (opacity pulse on enter) ──
const chapterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const img = entry.target.querySelector('.sticky-image img');
      if (!img) return;
      img.style.opacity = entry.isIntersecting ? '1' : '0.35';
    });
  },
  { threshold: 0.05 }
);
document.querySelectorAll('.scrolly-chapter').forEach(ch => chapterObserver.observe(ch));


// ── Scroll cue ───────────────────────────────
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


// ── Sound toggle ─────────────────────────────
const video = document.getElementById('hero-video');
const soundBtn = document.getElementById('sound-toggle');
const iconMuted = soundBtn.querySelector('.icon-muted');
const iconSound = soundBtn.querySelector('.icon-sound');

soundBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  iconMuted.style.display = video.muted ? '' : 'none';
  iconSound.style.display = video.muted ? 'none' : '';
  if (!video.muted && video.paused) video.play();
});


// ── Closing title fade-in ────────────────────
const closingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        closingObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
const closingInner = document.querySelector('.closing-inner');
if (closingInner) closingObserver.observe(closingInner);


// ── Activate steps already in view on load ──
window.addEventListener('load', () => {
  document.querySelectorAll('.step').forEach(step => {
    const rect = step.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      step.classList.add('active');
    }
  });
});
