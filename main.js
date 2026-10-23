import "@google/model-viewer";

const viewerWrap = document.querySelector(".machine-showcase__viewer-wrap");
const modelViewer = document.querySelector("#machine-model");
const progress = document.querySelector(".model-progress");
const progressBar = document.querySelector(".model-progress__bar");
const webglMessage = document.querySelector(".webgl-message");
const particlesLayer = document.querySelector(".machine-showcase__particles");

function createParticles() {
  const particleCount = window.matchMedia("(max-width: 640px)").matches ? 18 : 30;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = 1 + Math.random() * 3;

    particle.className = "machine-particle";
    particle.style.setProperty("--particle-x", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-size", `${size}px`);
    particle.style.setProperty("--particle-delay", `${-Math.random() * 18}s`);
    particle.style.setProperty("--particle-duration", `${11 + Math.random() * 13}s`);
    particle.style.setProperty("--particle-drift", `${-35 + Math.random() * 70}px`);
    particle.style.setProperty("--particle-opacity", `${0.18 + Math.random() * 0.5}`);
    fragment.appendChild(particle);
  }

  particlesLayer.appendChild(fragment);
}

createParticles();

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

if (!supportsWebGL()) {
  modelViewer.hidden = true;
  webglMessage.hidden = false;
} else {
  modelViewer.addEventListener("progress", ({ detail }) => {
    const percentage = Math.round(detail.totalProgress * 100);
    progressBar.style.width = `${percentage}%`;
    progress.setAttribute("aria-valuenow", String(percentage));

    if (detail.totalProgress === 1) {
      progress.style.opacity = "0";
    }
  });

  modelViewer.addEventListener("load", () => {
    modelViewer.classList.add("is-loaded");
    viewerWrap.classList.add("has-model");
  });

  modelViewer.addEventListener("error", () => {
    webglMessage.textContent =
      "Não foi possível carregar o modelo 3D. Verifique sua conexão e tente novamente.";
    webglMessage.hidden = false;
  });
}

const entranceObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (!entry.isIntersecting) return;

    viewerWrap.classList.add("is-visible");
    observer.disconnect();
  },
  { threshold: 0.16 },
);

entranceObserver.observe(viewerWrap);
