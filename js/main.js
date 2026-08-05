document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(".carousel-viewport");
  const track = document.querySelector(".carousel-track");
  const dotsContainer = document.querySelector(".dots");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  if (!viewport || !track || !dotsContainer) return;

  const slides = [...track.children];
  let index = 0;
  let perView = 1;
  let maxIndex = 0;

  function measure() {
    const first = slides[0];
    if (!first) return;
    const cardWidth = first.getBoundingClientRect().width;
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0");
    const step = cardWidth + gap;
    perView = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    maxIndex = Math.max(0, slides.length - perView);
    index = Math.min(index, maxIndex);
    buildDots();
    move(false);
  }

  function buildDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("span");
      if (i === index) dot.classList.add("active");
      dot.addEventListener("click", () => {
        index = i;
        move();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function move(animate = true) {
    const first = slides[0];
    const cardWidth = first.getBoundingClientRect().width;
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0");
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    [...dotsContainer.children].forEach((d, i) => d.classList.toggle("active", i === index));
  }

  prevBtn?.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    move();
  });

  nextBtn?.addEventListener("click", () => {
    index = Math.min(maxIndex, index + 1);
    move();
  });

  measure();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });
});
