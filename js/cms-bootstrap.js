(async function () {
  'use strict';

  // Ambil konten terbaru dari CMS.
  if (window.NestCMS && NestCMS.configured()) {
    try {
      const rows = await NestCMS.readPublic();

      if (rows[0] && rows[0].content) {
        window.PORTFOLIO_DATA = rows[0].content;
      }
    } catch (error) {
      console.warn(
        'CMS tidak tersedia; menggunakan data cadangan.',
        error.message
      );
    }
  }

  function updateCounts() {
    const data = window.PORTFOLIO_DATA;
    if (!data) return;

    const systems = Array.isArray(data.systems)
      ? data.systems
      : [];

    const research = Array.isArray(data.research)
      ? data.research
      : [];

    const screenshots = systems.reduce(
      (total, system) =>
        total + (
          Array.isArray(system.gallery)
            ? system.gallery.length
            : 0
        ),
      0
    );

    // Targetkan label mading, bukan caption screenshot.
    const boardLabel = document.querySelector(
      '#board-hotspot .hotspot-label small'
    );

    if (boardLabel) {
      boardLabel.textContent =
        `${systems.length} sistem · ${screenshots} tampilan`;
    }

    const researchLabel = document.querySelector(
      '#research-hotspot .hotspot-label small'
    );

    if (researchLabel) {
      researchLabel.textContent =
        `${research.length} riset akademik`;
    }

    const portfolioHeading = document.querySelector(
      '#portfolio .section-heading h2 em'
    );

    if (portfolioHeading) {
      portfolioHeading.textContent =
        `${systems.length} sistem.`;
    }
  }

  updateCounts();

  // Jalankan tampilan setelah data selesai dimuat.
  for (const path of ['js/main.js', 'js/room.js']) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = path;
      script.onload = resolve;

      script.onerror = () => {
        console.error('Gagal memuat:', path);
        resolve();
      };

      document.body.appendChild(script);
    });
  }

  updateCounts();
})();
