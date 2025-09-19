body {
  margin: 0;
  font-family: "Georgia", serif;
  background: #faf7f0;
  color: #222;
  overflow-x: hidden;
}

/* Hero Section */
#hero {
  position: relative;
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
}

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #fffae3, #f5f0d0);
  z-index: 0;
}

#hero h1,
#hero p {
  position: relative;
  z-index: 1;
}

/* Anime Title (looping animation) */
.anime-title {
  font-weight: 900;
  font-size: 3.5em;
}

/* Subtitle */
.hero-subtitle {
  font-size: 1.2em;
  margin-top: 10px;
}

/* Splide */
.splide__slide img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Gallery Grid */
.grid {
  margin: 2rem;
}
.grid-item {
  width: 200px;
  margin-bottom: 10px;
}
.grid-item img {
  width: 100%;
  border-radius: 10px;
  display: block;
}

/* Shloka Section */
.shloka-section {
  text-align: center;
  padding: 2rem;
}
.card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin: 1rem auto;
  max-width: 500px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
button {
  background: #ff9933;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background: #cc7a29;
}

/* Transition CSS */
@keyframes circle-in-top-right {
  from {
    clip-path: circle(0%);
  }
  to {
    clip-path: circle(150% at top right);
  }
}
[transition-style="in:circle:top-right"] {
  animation: 2.5s cubic-bezier(.25, 1, .30, 1) circle-in-top-right both;
}

.hidden {
  display: none;
}
