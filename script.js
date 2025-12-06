document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // GSAP basic setup
  // -----------------------------
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from(".hero-title-block", {
      opacity: 0,
      y: 24,
      duration: 1.1,
      ease: "power3.out",
    });

    // Section fade-ups
    gsap.utils
      .toArray([
        "#chapter-nav .section-inner",
        "#themes .section-inner",
        "#sanskrit-tools .section-inner",
        "#daily-shloka .section-inner",
      ])
      .forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power2.out",
        });
      });
  }

  // -----------------------------
  // DATA
  // -----------------------------
  const chapters = [
    {
      number: 1,
      title: "Arjuna Vishada Yoga",
      summary:
        "The Yoga of Arjuna's Dejection. Arjuna sees his relatives and teachers on the battlefield and becomes overwhelmed with compassion and doubt.",
      shlokas: 46,
      theme: "dharma",
    },
    {
      number: 2,
      title: "Sankhya Yoga",
      summary:
        "The Yoga of Knowledge. Krishna explains the eternal nature of the soul and the importance of steady wisdom while performing one's duty.",
      shlokas: 72,
      theme: "jnana",
    },
    {
      number: 3,
      title: "Karma Yoga",
      summary:
        "The Yoga of Action. Krishna teaches selfless action — performing one's responsibilities without attachment to results.",
      shlokas: 43,
      theme: "karma",
    },
    {
      number: 4,
      title: "Jnana Karma Sanyasa Yoga",
      summary:
        "The Yoga of Knowledge and Renunciation of Action. Krishna reveals his divine manifestations and the paths of knowledge and devotion.",
      shlokas: 42,
      theme: "jnana",
    },
  ];

  const themeShlokas = {
    karma: [
      {
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
        translation:
          "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
        chapter: 2,
        verse: 47,
      },
    ],
    dharma: [
      {
        sanskrit: "स्वधर्मे निधनं श्रेयः परधर्मो भयावहः",
        translation:
          "It is better to die in one's own duty than to follow another's duty, which is fraught with fear.",
        chapter: 3,
        verse: 35,
      },
    ],
    bhakti: [
      {
        sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु",
        translation:
          "Always think of Me, become My devotee, worship Me, and offer your homage unto Me.",
        chapter: 9,
        verse: 34,
      },
    ],
    jnana: [
      {
        sanskrit:
          "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः",
        translation:
          "The soul is neither born, nor does it ever die; nor having once existed, does it ever cease to be.",
        chapter: 2,
        verse: 20,
      },
    ],
  };

  const sanskritWords = {
    कर्मणि: { meaning: "in action", pronunciation: "karmani" },
    एव: { meaning: "only", pronunciation: "eva" },
    अधिकारः: { meaning: "right", pronunciation: "adhikarah" },
    ते: { meaning: "your", pronunciation: "te" },
    मा: { meaning: "do not", pronunciation: "maa" },
    फलेषु: { meaning: "in the fruits", pronunciation: "phaleshu" },
  };

  // Verse counts per chapter for the API
  const versesPerChapter = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
  ];

  // -----------------------------
  // CHAPTER NAVIGATION
  // -----------------------------
  (function initChapterNavigation() {
    const chapterSelect = document.getElementById("chapterSelect");
    const prevBtn = document.getElementById("prevChapter");
    const nextBtn = document.getElementById("nextChapter");
    const progressBar = document.getElementById("progressBar");
    const chapterContent = document.getElementById("chapterContent");
    const chapterTitle = document.getElementById("chapterTitle");
    const chapterSummary = document.getElementById("chapterSummary");

    if (!chapterSelect || !chapterContent) return;

    // Populate dropdown
    chapters.forEach((ch) => {
      const option = document.createElement("option");
      option.value = ch.number;
      option.textContent = `Chapter ${ch.number}: ${ch.title}`;
      chapterSelect.appendChild(option);
    });

    let currentChapter = 1;

    function showChapter(chapterNum) {
      const chapter = chapters.find((c) => c.number === chapterNum);
      if (!chapter) return;

      currentChapter = chapterNum;
      chapterTitle.textContent = `Chapter ${chapter.number}: ${chapter.title}`;
      chapterSummary.textContent = chapter.summary;

      const progress = (chapterNum / chapters.length) * 100;
      progressBar.style.width = `${progress}%`;

      chapterContent.classList.remove("hidden");

      if (window.gsap) {
        gsap.fromTo(
          chapterContent,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }
    }

    chapterSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        showChapter(parseInt(e.target.value, 10));
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentChapter > 1) {
        showChapter(currentChapter - 1);
        chapterSelect.value = currentChapter;
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentChapter < chapters.length) {
        showChapter(currentChapter + 1);
        chapterSelect.value = currentChapter;
      }
    });

    // Initial
    showChapter(1);
    chapterSelect.value = 1;
  })();

  // -----------------------------
  // THEME-BASED LEARNING
  // -----------------------------
  (function initThemeLearning() {
    const themeFilters = document.querySelectorAll(".theme-filter");
    const container = document.getElementById("themeShlokas");
    if (!container || !themeFilters.length) return;

    function renderThemeShlokas(theme) {
      container.innerHTML = "";

      let list = [];
      if (theme === "all") {
        Object.values(themeShlokas).forEach((arr) => list.push(...arr));
      } else {
        list = themeShlokas[theme] || [];
      }

      list.forEach((sh) => {
        const el = document.createElement("div");
        el.className = "theme-shloka";
        el.innerHTML = `
          <div class="shloka-sanskrit">${sh.sanskrit}</div>
          <div class="shloka-translation">${sh.translation}</div>
          <small>Chapter ${sh.chapter}, Verse ${sh.verse}</small>
        `;
        container.appendChild(el);
      });

      if (window.gsap && list.length) {
        gsap.fromTo(
          ".theme-shloka",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }
        );
      }
    }

    themeFilters.forEach((button) => {
      button.addEventListener("click", () => {
        themeFilters.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        renderThemeShlokas(button.dataset.theme);
      });
    });

    // Initial
    renderThemeShlokas("all");
  })();

  // -----------------------------
  // SANSKRIT TOOLS
  // -----------------------------
  (function initSanskritTools() {
    const wordBreakdown = document.getElementById("wordBreakdown");
    const wordMeaning = document.getElementById("wordMeaning");
    const playBtn = document.getElementById("playShloka");
    const slowBtn = document.getElementById("slowPlay");

    if (!wordBreakdown || !wordMeaning) return;

    // Build word chips
    Object.keys(sanskritWords).forEach((word) => {
      const span = document.createElement("span");
      span.className = "sanskrit-word";
      span.textContent = word;
      span.title = sanskritWords[word].meaning;

      span.addEventListener("click", () => {
        // Active visual state
        wordBreakdown
          .querySelectorAll(".sanskrit-word")
          .forEach((el) => el.classList.remove("active"));
        span.classList.add("active");

        const data = sanskritWords[word];
        wordMeaning.textContent = `${word}: ${data.meaning} (${data.pronunciation})`;

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(
            data.pronunciation || word
          );
          utterance.rate = 0.8;
          speechSynthesis.cancel();
          speechSynthesis.speak(utterance);
        }
      });

      wordBreakdown.appendChild(span);
    });

    function speakFullShloka(rate) {
      if (!("speechSynthesis" in window)) return;
      const utterance = new SpeechSynthesisUtterance(
        "karmani eva adhikarah te ma phaleshu kada chana"
      );
      utterance.rate = rate;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }

    playBtn?.addEventListener("click", () => speakFullShloka(1.0));
    slowBtn?.addEventListener("click", () => speakFullShloka(0.6));
  })();

  // -----------------------------
  // DAILY SHLOKA (API)
  // -----------------------------
  (function initDailyShloka() {
    const card = document.getElementById("shlokaCard");
    const loader = document.getElementById("loader");
    const errorMessage = document.getElementById("errorMessage");
    const btn = document.getElementById("newShlokaBtn");

    const chapterVerseEl = document.getElementById("chapter-verse");
    const sanskritEl = document.getElementById("sanskrit-text");
    const transliterationEl =
      document.getElementById("transliteration-text");
    const translationEl = document.getElementById("translation-text");
    const authorEl = document.getElementById("author-name");

    if (!card || !btn) return;

    let isLoading = false;

    function getRandomChapterVerse() {
      const chapter = Math.floor(Math.random() * 18) + 1;
      const maxVerse = versesPerChapter[chapter - 1];
      const verse = Math.floor(Math.random() * maxVerse) + 1;
      return { chapter, verse };
    }

    async function fetchShloka() {
      if (isLoading) return;
      isLoading = true;

      loader.textContent = "Loading shloka…";
      errorMessage.hidden = true;
      btn.disabled = true;

      try {
        const { chapter, verse } = getRandomChapterVerse();
        const res = await fetch(
          `https://bhagavadgita-api.vercel.app/slok/${chapter}/${verse}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (!data || !data.slok) throw new Error("Invalid data from API");

        updateShlokaUI(data, chapter, verse);
      } catch (err) {
        console.error("Shloka API Error:", err);
        loader.textContent = "";
        errorMessage.hidden = false;
        errorMessage.textContent =
          "Could not fetch a verse right now. Please try again.";
      } finally {
        isLoading = false;
        btn.disabled = false;
      }
    }

    function updateShlokaUI(data, chapter, verse) {
      loader.textContent = "";

      chapterVerseEl.textContent = `Chapter ${chapter}, Verse ${verse}`;
      sanskritEl.textContent = data.slok || "—";
      transliterationEl.textContent = data.transliteration || "";

      const translation =
        data.tej?.et ||
        data.siva?.et ||
        data.rams?.et ||
        data.adi?.et ||
        "";
      const author =
        data.tej?.author ||
        data.siva?.author ||
        data.rams?.author ||
        data.adi?.author ||
        "";

      translationEl.textContent = translation;
      authorEl.textContent = author ? `Translation: ${author}` : "";

      if (window.gsap) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" }
        );
      }
    }

    btn.addEventListener("click", fetchShloka);

    // Initial fetch
    fetchShloka();
  })();
});
