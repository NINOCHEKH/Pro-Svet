function initNavHoverAnimation() {
  const navButtons = document.querySelectorAll(
    ".aboutNavContainer, .otherNavContainer"
  );

  navButtons.forEach((button) => {
    if (
      button.classList.contains("aboutNavActive") ||
      button.classList.contains("specialistsNavActive") ||
      button.classList.contains("subscribeNavActive") ||
      button.classList.contains("merchNavActive")
    ) {
      return;
    }

    if (button.dataset.navHoverReady === "true") return;

    button.dataset.navHoverReady = "true";

    button.addEventListener("mouseenter", (event) => {
      const oldRipple = button.querySelector(".navHoverRipple");

      if (oldRipple) {
        oldRipple.remove();
      }

      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");

      ripple.classList.add("navHoverRipple");
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;

      button.appendChild(ripple);
    });

    button.addEventListener("mouseleave", () => {
      const ripple = button.querySelector(".navHoverRipple");

      if (ripple) {
        ripple.classList.add("is-leaving");

        setTimeout(() => {
          ripple.remove();
        }, 450);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initNavHoverAnimation);

function initMobileMenu() {
  const mobileMenuPanel = document.querySelector(".mobileMenuPanel");
  const mobileMenuButton = document.querySelector(".mobileMenuButton");
  const mobileMenuBackdrop = document.querySelector(".mobileMenuBackdrop");
  const mobileMenuLinks = document.querySelectorAll(
    ".mobileMenuLogoLink, .mobileMenuLink"
  );

  if (!mobileMenuPanel || !mobileMenuButton) return;

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  mobileMenuLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("is-active");
    }
  });

  function setMobileMenuOpen(isOpen) {
    mobileMenuPanel.classList.toggle("is-open", isOpen);
    mobileMenuBackdrop?.classList.toggle("is-open", isOpen);
    mobileMenuButton.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("mobile-menu-open", isOpen);
    mobileMenuPanel.setAttribute("aria-hidden", String(!isOpen));
    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Закрыть меню" : "Открыть меню"
    );
  }

  mobileMenuButton.addEventListener("click", () => {
    setMobileMenuOpen(!mobileMenuPanel.classList.contains("is-open"));
  });

  mobileMenuBackdrop?.addEventListener("click", () => {
    setMobileMenuOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", initMobileMenu);

function initMobileSubscribePlans() {
  const subscribePlans = document.querySelectorAll("[data-subscribe-plan]");
  const subscribeNext = document.querySelector(".mobileSubscribeNext");

  if (!subscribePlans.length || !subscribeNext) return;

  subscribePlans.forEach((plan) => {
    plan.addEventListener("click", () => {
      subscribePlans.forEach((item) => item.classList.remove("is-selected"));
      plan.classList.add("is-selected");
      subscribeNext.classList.add("is-enabled");
    });
  });
}

document.addEventListener("DOMContentLoaded", initMobileSubscribePlans);

// стерка
window.addEventListener("load", () => {
  const life = document.querySelector(".life");
  const canvas = document.querySelector(".lifeEraser");
  const lifeWhiteSector = document.querySelector(".lifeWhiteSector");

  if (!life || !canvas) return;

  const ctx = canvas.getContext("2d");

  let lastX = null;
  let lastY = null;

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

    lastX = null;
    lastY = null;
  }

  function erase(event) {
    if (!lifeWhiteSector.classList.contains("is-up")) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (lastX === null || lastY === null) {
      lastX = x;
      lastY = y;
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
  }

  resizeCanvas();

  canvas.addEventListener("pointerdown", (event) => {
    lastX = null;
    lastY = null;
    erase(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    event.preventDefault();
    erase(event);
  });
  canvas.addEventListener("pointerup", () => {
    lastX = null;
    lastY = null;
  });
  canvas.addEventListener("pointercancel", () => {
    lastX = null;
    lastY = null;
  });

  canvas.addEventListener("mouseleave", () => {
    lastX = null;
    lastY = null;

    const aboutAccordion = document.querySelector(".aboutAccordion");

    if (aboutAccordion) {
      const slides = Array.from(aboutAccordion.querySelectorAll(".aboutSlide"));
      const tab = 5.6;

      function setActiveSlide(activeIndex) {
        slides.forEach((slide, index) => {
          slide.classList.toggle("active", index === activeIndex);

          if (index <= activeIndex) {
            slide.style.transform = `translateX(${index * tab}vw)`;
          } else {
            const rightTabs = slides.length - index;
            slide.style.transform = `translateX(calc(100vw - ${rightTabs * tab}vw))`;
          }
        });
      }

      slides.forEach((slide, index) => {
        const tabButton = slide.querySelector(".aboutSlideTab");

        tabButton.addEventListener("click", () => {
          setActiveSlide(index);
        });
      });

      setActiveSlide(0);
    }
  });

  window.addEventListener("resize", resizeCanvas);

  // рандомные звезды
  const starAnimationBox = document.querySelector(".starAnimationBox");

  if (starAnimationBox) {
    const starImages = [
      "images/StarAnimation.svg",
      "images/StarAnimation2.svg",
      "images/StarAnimation3.svg",
      "images/StarAnimation4.svg"
    ];

    const starCount = 34;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("img");
      const randomImage =
        starImages[Math.floor(Math.random() * starImages.length)];
      const isMobile = window.matchMedia("(max-width: 414px)").matches;
      const randomSize = isMobile
        ? 10 + Math.random() * 12
        : 2 + Math.random() * 7;
      const randomLeft = Math.random() * 100;
      const randomDuration = 5 + Math.random() * 5;
      const randomDelay = Math.random() * -8;
      const randomTop = isMobile ? Math.random() * 100 : null;

      star.classList.add("starAnimation");
      star.src = randomImage;
      star.alt = "";

      star.style.width = `${randomSize}vw`;
      star.style.left = `${randomLeft}%`;
      star.style.animationDuration = `${randomDuration}s`;
      star.style.animationDelay = `${randomDelay}s`;

      if (isMobile) {
        star.style.top = `${randomTop}%`;
      }

      star.addEventListener("mouseenter", () => {
        star.classList.add("is-disappearing");

        setTimeout(() => {
          star.remove();
        }, 350);
      });

      starAnimationBox.appendChild(star);
    }
  }
});

// кнопка 1 экран
const lifeWhiteSector = document.querySelector(".lifeWhiteSector");
const lifeWhiteButton = document.querySelector(".lifeWhiteButton");

if (lifeWhiteSector && lifeWhiteButton) {
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
}
