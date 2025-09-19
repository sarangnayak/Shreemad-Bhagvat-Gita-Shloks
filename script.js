document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // -----------------------------
  // Hero Title (looping animation)
  // -----------------------------
  const heroTitle = document.querySelector('.anime-title');
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

  // Hero subtitle fade (GSAP)
  gsap.fromTo(
    '.hero-subtitle',
    { y: 20, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
  );

  // Splide Init
  new Splide('.splide', { type: 'loop', autoplay: true, interval: 4000 }).mount();

  // Packery Grid + Parallax
  const grid = document.querySelector('.grid');
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

  // Particles.js Init
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 80 },
      "size": { "value": 3 },
      "move": { "speed": 1 },
      "line_linked": { "enable": true }
    }
  });

  // Shloka API
  const shlokaCard = document.getElementById('shlokaCard');
  const loader = document.getElementById('loader');
  const errorMessage = document.getElementById('errorMessage');
  const btn = document.getElementById('newShlokaBtn');

  async function getShloka() {
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    try {
      const chapter = Math.floor(Math.random() * 18) + 1;
      const meta = await fetch(`https://bhagavadgitaapi.io/v2/chapters/${chapter}/`).then(r => r.json());
      const verse = Math.floor(Math.random() * meta.verses_count) + 1;
      const data = await fetch(`https://bhagavadgitaapi.io/v2/sloks/${chapter}/${verse}/`).then(r => r.json());
      updateUI(data);
    } catch (e) {
      loader.classList.add('hidden');
      errorMessage.classList.remove('hidden');
      errorMessage.querySelector('p').textContent = "Error fetching verse";
      gsap.fromTo(errorMessage, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
    }
  }

  function updateUI(data) {
    loader.classList.add('hidden');
    shlokaCard.classList.remove('hidden');
    document.getElementById('chapter-verse').textContent = `Chapter ${data.chapter}, Verse ${data.verse}`;
    document.getElementById('sanskrit-text').textContent = data.slok || '—';
    document.getElementById('transliteration-text').textContent = data.transliteration || '';
    const t = data.translations && data.translations[0];
    document.getElementById('translation-text').textContent = t?.description || '';
    document.getElementById('author-name').textContent = t?.author_name || '';
    gsap.fromTo(shlokaCard, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
  }

  btn.addEventListener('click', () => {
    gsap.to(shlokaCard, { y: -20, opacity: 0, duration: 0.3, onComplete: getShloka });
  });

  // Initial Shloka Load
  getShloka();
});
