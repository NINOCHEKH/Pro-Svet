// стерка
window.addEventListener("load", () => {
  const life = document.querySelector(".life");
  const canvas = document.querySelector(".lifeEraser");

  if (!life || !canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const rect = life.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(107, 134, 231, 0.65)";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  function erase(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  resizeCanvas();

  canvas.addEventListener("mousemove", (event) => {
    const lifeWhiteSector = document.querySelector(".lifeWhiteSector");

    if (!lifeWhiteSector.classList.contains("is-up")) return;

    erase(event);
  });
  window.addEventListener("resize", resizeCanvas);
});

// кнопка 1 экран
const lifeWhiteSector = document.querySelector(".lifeWhiteSector");
const lifeWhiteButton = document.querySelector(".lifeWhiteButton");

lifeWhiteButton.addEventListener("click", (event) => {
  const rect = lifeWhiteButton.getBoundingClientRect();

  const ripple = document.createElement("span");
  ripple.classList.add("ripple");

  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;

  lifeWhiteButton.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 100);

  lifeWhiteSector.classList.toggle("is-up");
});

lifeWhiteButton.addEventListener("mouseenter", (event) => {
  const oldRipple = lifeWhiteButton.querySelector(".hover-ripple");

  if (oldRipple) {
    oldRipple.remove();
  }

  const rect = lifeWhiteButton.getBoundingClientRect();

  const hoverRipple = document.createElement("span");
  hoverRipple.classList.add("hover-ripple");

  hoverRipple.style.left = `${event.clientX - rect.left}px`;
  hoverRipple.style.top = `${event.clientY - rect.top}px`;

  lifeWhiteButton.appendChild(hoverRipple);
});

lifeWhiteButton.addEventListener("mouseleave", () => {
  const hoverRipple = lifeWhiteButton.querySelector(".hover-ripple");

  if (hoverRipple) {
    hoverRipple.classList.add("is-leaving");

    setTimeout(() => {
      hoverRipple.remove();
    }, 450);
  }
});
