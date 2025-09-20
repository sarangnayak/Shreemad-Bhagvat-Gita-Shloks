document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // -----------------------------
  // Hero Title Animation
  // -----------------------------
  const heroTitle = document.querySelector('.anime-title');
  if (heroTitle) {
    heroTitle.innerHTML = heroTitle.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    anime.timeline({ loop: true })
      .add({
        targets: '.anime-title .letter',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i + 1)
      })
      .add({
        targets: '.anime-title',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }

  // Hero subtitle fade (GSAP)
  gsap.fromTo(
    '.hero-subtitle',
    { y: 20, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
  );

  // -----------------------------
  // Splide Init (Carousel)
  // -----------------------------
  new Splide('.splide', { type: 'loop', autoplay: true, interval: 4000 }).mount();

  // -----------------------------
  // Packery Grid + Scroll Animation
  // -----------------------------
  const grid = document.querySelector('.grid');
  if (grid) {
    imagesLoaded(grid, () => {
      new Packery(grid, { itemSelector: '.grid-item', gutter: 10 });
      gsap.from('.grid-item', { opacity: 0, y: 40, stagger: 0.15, duration: 0.6, ease: 'power2.out' });

      gsap.utils.toArray('.grid-item img').forEach(img => {
        gsap.to(img, {
          y: 50,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            scrub: true
          }
        });
      });
    });
  }

  // -----------------------------
  // Particles.js Init
  // -----------------------------
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 100 },
      "color": { "value": "#FFD700" },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.8, "random": true },
      "size": { "value": 3, "random": true },
      "line_linked": { "enable": true, "color": "#FFD700", "opacity": 0.6 },
      "move": { "enable": true, "speed": 1.2, "random": true }
    },
    "interactivity": {
      "events": { "onhover": { "enable": true, "mode": "repulse" } }
    }
  });

  // -----------------------------
  // 3D Layered Parallax + Floating
  // -----------------------------
  const heroLayers = [
    { selector: '[data-image="clouds"]', yMove: 50, xMove: 20, rotate: 0.2 },
    { selector: '[data-image="battle"]', yMove: 30, xMove: 0, rotate: 0 },
    { selector: '[data-image="krishna"]', yMove: 20, xMove: 10, rotate: 1 },
    { selector: '[data-image="arjuna"]', yMove: 20, xMove: -10, rotate: 1 },
    { selector: '[data-image="chariot"]', yMove: 15, xMove: 0, rotate: 2 }
  ];

  heroLayers.forEach(layer => {
    const el = document.querySelector(layer.selector);
    if (!el) return;

    // Floating / drifting animation
    gsap.to(el, {
      y: `+=${layer.yMove}`,
      x: `+=${layer.xMove}`,
      rotation: `+=${layer.rotate}`,
      duration: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    // Scroll-based parallax depth
    gsap.to(el, {
      y: () => -(window.innerHeight * (layer.yMove / 200)),
      x: () => -(layer.xMove / 2),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // -----------------------------
  // Shloka API
  // -----------------------------
  const shlokaCard = document.getElementById('shlokaCard');
  const loader = document.getElementById('loader');
  const errorMessage = document.getElementById('errorMessage');
  const btn = document.getElementById('newShlokaBtn');

  async function getShloka() {
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    shlokaCard.classList.add('hidden');

    try {
      let data, chapter, verse;
      let attempts = 0;

      while (attempts < 5) {
        chapter = Math.floor(Math.random() * 18) + 1;
        verse = Math.floor(Math.random() * 72) + 1;
        data = await fetch(`https://bhagavadgita-api.vercel.app/slok/${chapter}/${verse}`).then(r => r.json());
        if (data?.slok) break;
        attempts++;
      }

      if (!data?.slok) throw new Error("No verse found");

      updateUI(data, chapter, verse);
    } catch (e) {
      console.error("API Error:", e);
      loader.classList.add('hidden');
      errorMessage.classList.remove('hidden');
      errorMessage.querySelector('p').textContent = "Could not fetch verse. Try again!";
      gsap.fromTo(errorMessage, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
    }
  }

  function updateUI(data, chapter, verse) {
    loader.classList.add('hidden');
    shlokaCard.classList.remove('hidden');

    document.getElementById('chapter-verse').textContent = `Chapter ${chapter}, Verse ${verse}`;
    document.getElementById('sanskrit-text').textContent = data.slok || '—';
    document.getElementById('transliteration-text').textContent = data.transliteration || '';

    const translation = data.tej?.et || data.siva?.et || data.rams?.et || data.adi?.et || '';
    const author = data.tej?.author || data.siva?.author || data.rams?.author || data.adi?.author || '';

    document.getElementById('translation-text').textContent = translation;
    document.getElementById('author-name').textContent = author;

    gsap.fromTo(shlokaCard, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
  }

  btn?.addEventListener('click', () => {
    gsap.to(shlokaCard, { y: -20, opacity: 0, duration: 0.3, onComplete: getShloka });
  });

  // Initial Load
  getShloka();

  // -----------------------------
  // Footer Credits Animation
  // -----------------------------
  const footerCredits = document.querySelector('.ml12');
  if (footerCredits) {
    footerCredits.innerHTML = footerCredits.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    anime.timeline({ loop: true })
      .add({
        targets: '.ml12 .letter',
        translateX: [40, 0],
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el, i) => 500 + 30 * i
      })
      .add({
        targets: '.ml12 .letter',
        translateX: [0, -30],
        opacity: [1, 0],
        easing: "easeInExpo",
        duration: 1100,
        delay: (el, i) => 100 + 30 * i
      });
  }
});
