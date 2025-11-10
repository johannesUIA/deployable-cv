// src/snow.js
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("snow-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  // number of flakes scales a bit with screen size
  const baseCount = 120;
  let flakeCount = Math.floor(
    baseCount * (Math.min(width * height, 1920 * 1080) / (1920 * 1080))
  );

  let flakes = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    flakeCount = Math.floor(
      baseCount * (Math.min(width * height, 1920 * 1080) / (1920 * 1080))
    );
    initFlakes();
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlake(startAbove = false) {
  const r = rand(1, 3); // radius
  return {
    x: rand(0, width),
    y: startAbove ? rand(-height, 0) : rand(0, height),
    r,
    speed: rand(0.5, 1.2) * (r / 2) * 0.6,  // slowed down ~40%
    drift: rand(-0.3, 0.3),
    phase: rand(0, Math.PI * 2),
    alpha: rand(0.35, 0.9),
  };
}

  function initFlakes() {
    flakes = [];
    for (let i = 0; i < flakeCount; i++) {
      flakes.push(createFlake(false));
    }
  }

  function updateAndDraw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      // Wobble + drift
      f.phase += 0.01;
      f.x += f.drift + Math.sin(f.phase) * 0.3;
      f.y += f.speed;

      // Recycle flake when out of view
      if (f.y - f.r > height) {
        flakes[i] = createFlake(true);
      }
      if (f.x < -10) f.x = width + 10;
      if (f.x > width + 10) f.x = -10;

      ctx.globalAlpha = f.alpha;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(updateAndDraw);
  }

  // Handle resize
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(updateAndDraw);
});
