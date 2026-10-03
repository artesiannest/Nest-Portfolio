(function () {
  "use strict";

  const root = document.documentElement;

  const pages = Array.from(
    document.querySelectorAll("[data-view]")
  );

  const routeMap = {
    beranda: "beranda",
    tentang: "tentang",
    pengalaman: "tentang",
    portfolio: "portfolio",
    ai: "ai",
    riset: "riset",
    kontak: "kontak"
  };

  const names = {
    beranda: "Kamar Nest",
    tentang: "Tentang & Pengalaman",
    portfolio: "Portfolio Sistem",
    ai: "Ide Pengembangan AI",
    riset: "Riset Akademik",
    kontak: "Kontak"
  };

  let activeView = "beranda";
  let sourceHotspot = null;

  let soundEnabled = false;
  let audio = null;
  let ringTimer = null;

  const soundButton =
    document.getElementById("room-sound");

  const previews =
    document.getElementById("board-previews");

  // THUMBNAIL PADA MADING
  if (previews && window.PORTFOLIO_DATA) {
    window.PORTFOLIO_DATA.systems.forEach(system => {
      const card = document.createElement("span");
      card.className = "board-preview";

      const image = document.createElement("img");
      image.src = system.cover.replace(/\.png$/i, ".webp");
      image.alt = "";
      image.loading = "lazy";

      const caption = document.createElement("small");

      caption.textContent = system.title
        .split(" — ")[0]
        .replace("Learning Management System", "LMS");

      card.append(image, caption);
      previews.appendChild(card);
    });
  }

  // NAVIGASI HALAMAN
  function route(moveFocus) {
    let hash = "beranda";

    try {
      hash = decodeURIComponent(
        location.hash.slice(1) || "beranda"
      );
    } catch (error) {}

    activeView = routeMap[hash] || "beranda";

    pages.forEach(page => {
      page.hidden = page.dataset.view !== activeView;
    });

    root.classList.add("room-mode");

    root.classList.toggle(
      "room-view",
      activeView === "beranda"
    );

    document.title =
      `${names[activeView]} — Nestiara Lidya Kakihary`;

    document.querySelectorAll("#navigation a")
      .forEach(link => {
        const key = link.hash.slice(1);

        const selected =
          key === hash ||
          (activeView === "beranda" && key === "beranda");

        link.classList.toggle("active", selected);

        if (selected) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });

    const visiblePage =
      pages.find(page => !page.hidden);

    if (visiblePage) {
      visiblePage.querySelectorAll(".reveal")
        .forEach(element => {
          element.classList.add("visible");
        });
    }

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    if (moveFocus) {
      requestAnimationFrame(() => {
        if (
          activeView === "beranda" &&
          sourceHotspot &&
          sourceHotspot.isConnected
        ) {
          sourceHotspot.focus({
            preventScroll: true
          });

          sourceHotspot = null;
          return;
        }

        const specificSection =
          hash === "pengalaman"
            ? document.getElementById("pengalaman")
            : null;

        const heading = specificSection
          ? specificSection.querySelector("h2")
          : visiblePage &&
            visiblePage.querySelector("h1, h2");

        if (heading) {
          heading.setAttribute("tabindex", "-1");

          heading.focus({
            preventScroll: true
          });
        }

        if (specificSection) {
          specificSection.scrollIntoView({
            behavior: "auto",
            block: "start"
          });
        }
      });
    }

    scheduleRing();
  }

  document.querySelectorAll(
    ".room-stage a, .room-dock a"
  ).forEach(link => {
    link.addEventListener("click", () => {
      sourceHotspot = link;
    });
  });

  window.addEventListener("hashchange", () => {
    route(true);
  });

  // SUARA DERING — HANYA SETELAH DIAKTIFKAN
  function stopRinging() {
    if (ringTimer) {
      clearTimeout(ringTimer);
    }

    ringTimer = null;
  }

  function playRing() {
    if (
      !soundEnabled ||
      !audio ||
      document.hidden ||
      activeView !== "beranda" ||
      audio.state !== "running"
    ) {
      return;
    }

    const start = audio.currentTime;

    [0, 0.18, 0.5, 0.68].forEach((delay, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value =
        index % 2 ? 740 : 620;

      gain.gain.setValueAtTime(
        0,
        start + delay
      );

      gain.gain.linearRampToValueAtTime(
        0.025,
        start + delay + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        start + delay + 0.13
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start(start + delay);
      oscillator.stop(start + delay + 0.15);
    });
  }

  function scheduleRing() {
    stopRinging();

    if (
      !soundEnabled ||
      document.hidden ||
      activeView !== "beranda"
    ) {
      return;
    }

    ringTimer = setTimeout(() => {
      playRing();
      scheduleRing();
    }, 10000);
  }

  if (soundButton) {
    soundButton.addEventListener("click", async () => {
      if (soundEnabled) {
        soundEnabled = false;
        stopRinging();
      } else {
        const AudioContextClass =
          window.AudioContext ||
          window.webkitAudioContext;

        if (!AudioContextClass) {
          soundButton.textContent =
            "Suara tidak didukung";

          soundButton.disabled = true;
          return;
        }

        try {
          if (!audio) {
            audio = new AudioContextClass();
          }

          await audio.resume();

          soundEnabled = true;

          playRing();
          scheduleRing();
        } catch (error) {
          soundButton.textContent =
            "Suara tidak dapat diaktifkan";

          return;
        }
      }

      soundButton.textContent = soundEnabled
        ? "Suara: Aktif"
        : "Suara: Nonaktif";

      soundButton.setAttribute(
        "aria-pressed",
        String(soundEnabled)
      );
    });
  }

  document.addEventListener(
    "visibilitychange",
    scheduleRing
  );

  window.addEventListener("pagehide", stopRinging);

  // MEMBUKA HALAMAN SESUAI HASH SAAT PERTAMA DIMUAT
  route(false);
})();
