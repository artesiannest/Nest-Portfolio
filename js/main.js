(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const escapeHTML = value =>
    String(value == null ? "" : value).replace(
      /[&<>"']/g,
      character =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[character]
    );

  function safeUrl(url) {
    if (!url) return "";

    if (/^https?:\/\//i.test(url)) {
      try {
        const parsed = new URL(url);

        if (parsed.username || parsed.password) {
          return "";
        }

        return parsed.href;
      } catch (error) {
        return "";
      }
    }

    if (
      /^assets\/[a-zA-Z0-9_./ -]+$/.test(url) &&
      !url.includes("..")
    ) {
      return url;
    }

    return "";
  }

  function documentationUrl(value) {
    try {
      const url = new URL(value);

      if (
        url.protocol === "https:" &&
        url.hostname === "docs.google.com" &&
        url.pathname.startsWith("/document/") &&
        !url.username &&
        !url.password
      ) {
        return url.href;
      }
    } catch (error) {}

    return "";
  }

  function fileLink(url, label, className = "button secondary") {
    const validUrl = safeUrl(url);

    if (!validUrl) return "";

    return `
      <a
        class="${escapeHTML(className)}"
        href="${escapeHTML(validUrl)}"
        target="_blank"
        rel="noopener noreferrer"
      >${escapeHTML(label)}</a>
    `;
  }

  const thumbnail = source =>
    source.replace(/\.png$/i, ".webp");

  // PROFIL
  $(".hero-copy > .eyebrow").textContent =
    `${data.profile.name.toUpperCase()} / ` +
    data.profile.nickname.toUpperCase();

  $(".profession").textContent = data.profile.title;

  $(".hero-description").textContent =
    data.profile.heroDescription;

  $(".hero-copy h1").innerHTML =
    escapeHTML(data.profile.headline).replace(
      "lebih membantu",
      "<em>lebih membantu</em>"
    );

  $(".about-content > p:not(.large-text)").textContent =
    data.profile.aboutDescription;

  $("footer > p").textContent =
    `${data.profile.name} · ${data.profile.location}`;

  $(".education").innerHTML = data.education
    .map((education, index) => `
      <article>
        <span class="eyebrow">
          ${index === 0 ? "PENDIDIKAN SARJANA" : "STUDI LANJUTAN"}
        </span>

        <h3>${escapeHTML(education.level)}</h3>

        <p>
          ${escapeHTML(education.institution)}
          ${
            education.period
              ? " · " + escapeHTML(education.period)
              : ""
          }
        </p>

        ${
          education.gpa
            ? `<strong>IPK ${escapeHTML(education.gpa)}</strong>`
            : ""
        }

        ${
          education.thesis
            ? `<p class="small">
                 Tugas akhir: ${escapeHTML(education.thesis)}
               </p>`
            : ""
        }

        ${
          education.status
            ? `<span class="tag">
                 ${escapeHTML(education.status)}
               </span>`
            : ""
        }
      </article>
    `)
    .join("");

  $$('a[href="assets/documents/resume-nestiara.pdf"]')
    .forEach(link => {
      const resumeUrl = safeUrl(data.profile.resumeUrl);

      if (resumeUrl) {
        link.href = resumeUrl;
      }
    });

  $("#skills").innerHTML = data.skills
    .map(skill => `
      <article class="skill-group">
        <h3>${escapeHTML(skill.title)}</h3>
        <p>${skill.items.map(escapeHTML).join(" · ")}</p>
      </article>
    `)
    .join("");

  $("#experience").innerHTML = data.experience
    .map(experience => `
      <article class="experience-row">
        <p class="experience-date">
          ${escapeHTML(experience.period)}
        </p>

        <div class="experience-role">
          <h3>${escapeHTML(experience.role)}</h3>
          <p>${escapeHTML(experience.company)}</p>
        </div>

        <p class="experience-description">
          ${escapeHTML(experience.description)}
        </p>
      </article>
    `)
    .join("");

  $("#certificates").innerHTML = data.certificates
    .map(certificate => `
      <article class="cert">
        <h4>${escapeHTML(certificate.title)}</h4>

        <p>
          ${escapeHTML(certificate.issuer)}<br>
          ${escapeHTML(certificate.date)}
        </p>
      </article>
    `)
    .join("");

  // KONTAK
  const email =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email)
      ? data.profile.email
      : "";

  const whatsapp =
    /^\d{8,15}$/.test(data.profile.whatsapp)
      ? data.profile.whatsapp
      : "";

  $("#contact-actions").innerHTML =
    (
      email
        ? `
          <a
            class="button primary"
            href="mailto:${escapeHTML(email)}"
          >${escapeHTML(email)}</a>
        `
        : ""
    ) +
    (
      whatsapp
        ? `
          <a
            class="button secondary"
            href="https://wa.me/${whatsapp}"
            target="_blank"
            rel="noopener noreferrer"
          >WhatsApp</a>
        `
        : ""
    ) +
    fileLink(data.profile.linkedinUrl, "LinkedIn") +
    fileLink(data.profile.githubUrl, "GitHub");

  // TEMA
  function updateThemeLabel() {
    const light =
      document.documentElement.dataset.theme === "light";

    const label =
      `Aktifkan mode ${light ? "gelap" : "terang"}`;

    $("#theme").setAttribute("aria-label", label);
    $("#theme").setAttribute("title", label);
  }

  updateThemeLabel();

  $("#theme").addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem("nest-theme", nextTheme);
    } catch (error) {}

    updateThemeLabel();
  });

  // MENU MOBILE
  function closeMenu() {
    $("#navigation").classList.remove("open");

    $("#menu").setAttribute("aria-expanded", "false");
    $("#menu").setAttribute("aria-label", "Buka menu");
  }

  $("#menu").addEventListener("click", () => {
    const open =
      $("#navigation").classList.toggle("open");

    $("#menu").setAttribute("aria-expanded", String(open));

    $("#menu").setAttribute(
      "aria-label",
      open ? "Tutup menu" : "Buka menu"
    );
  });

  $$("#navigation a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      $("#navigation").classList.contains("open")
    ) {
      closeMenu();
      $("#menu").focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  // PORTFOLIO
  data.systems.forEach(system => {
    const option = document.createElement("option");

    option.value = system.category;
    option.textContent = system.category;

    $("#category").appendChild(option);
  });

  function renderProjects() {
    const query =
      $("#search").value.trim().toLocaleLowerCase("id");

    const category = $("#category").value;

    const systems = data.systems.filter(system => {
      const matchesCategory =
        !category || system.category === category;

      const searchableText = [
        system.title,
        system.category,
        system.summary
      ]
        .join(" ")
        .toLocaleLowerCase("id");

      return matchesCategory && searchableText.includes(query);
    });

    $("#projects").innerHTML = systems
      .map(system => {
        const url =
          documentationUrl(system.documentationUrl);

        const number = String(
          data.systems.indexOf(system) + 1
        ).padStart(2, "0");

        const content = `
          <div class="project-image">
            <span class="project-index">
              ${number} / ${String(data.systems.length).padStart(2, "0")}
            </span>

            <img
              src="${escapeHTML(thumbnail(system.cover))}"
              alt="Tampilan ${escapeHTML(system.title)}"
              loading="lazy"
              width="900"
              height="500"
            >
          </div>

          <div class="project-content">
            <div class="project-category">
              ${escapeHTML(system.category)}
            </div>

            <h3>${escapeHTML(system.title)}</h3>
            <p>${escapeHTML(system.summary)}</p>

            <span class="doc-status ${url ? "doc-active" : ""}">
              ${
                url
                  ? "Baca Dokumentasi"
                  : "Dokumentasi segera tersedia"
              }
            </span>

            ${
              url
                ? '<span class="doc-meta">Google Docs · Tab baru</span>'
                : ""
            }
          </div>
        `;

        const body = url
          ? `
            <a
              class="project-body"
              href="${escapeHTML(url)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Baca dokumentasi ${escapeHTML(system.title)} di Google Docs, tab baru"
            >${content}</a>
          `
          : `<div class="project-body">${content}</div>`;

        return `
          <article class="project-card">
            ${body}

            <div class="project-footer">
              <button
                type="button"
                data-gallery="${escapeHTML(system.id)}"
              >Lihat Screenshot</button>

              <span>${system.gallery.length} tampilan</span>
            </div>
          </article>
        `;
      })
      .join("");

    $("#result-count").textContent =
      `${systems.length} dari ${data.systems.length} sistem`;

    $("#empty-projects").hidden = systems.length > 0;
  }

  $("#search").addEventListener("input", renderProjects);
  $("#category").addEventListener("change", renderProjects);

  renderProjects();

  // DIALOG
  const dialogs = [
    $("#gallery-dialog"),
    $("#research-dialog")
  ];

  let returnFocus = null;

  function openDialog(dialog, trigger) {
    returnFocus = trigger || document.activeElement;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    $(".close-dialog", dialog).focus();
  }

  function closeDialog(dialog) {
    dialog.close();
  }

  dialogs.forEach(dialog => {
    $(".close-dialog", dialog).addEventListener(
      "click",
      () => closeDialog(dialog)
    );

    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";

      if (returnFocus && returnFocus.isConnected) {
        returnFocus.focus();
      }
    });

    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;

      const rectangle = dialog.getBoundingClientRect();

      const outside =
        event.clientX < rectangle.left ||
        event.clientX > rectangle.right ||
        event.clientY < rectangle.top ||
        event.clientY > rectangle.bottom;

      if (outside) {
        closeDialog(dialog);
      }
    });
  });

  // GALERI
  $("#full-image").addEventListener("load", () => {
    $("#full-image").classList.remove("image-enter");

    requestAnimationFrame(() => {
      $("#full-image").classList.add("image-enter");
    });
  });

  let currentSystem = null;
  let imageIndex = 0;

  function showImage(index) {
    if (!currentSystem) return;

    imageIndex =
      (index + currentSystem.gallery.length) %
      currentSystem.gallery.length;

    const image = currentSystem.gallery[imageIndex];

    $("#full-image").classList.remove("image-enter");
    $("#full-image").src = image.src;

    $("#full-image").alt =
      `${currentSystem.title} — ${image.caption}`;

    $("#gallery-caption").textContent = image.caption;

    $("#gallery-number").textContent =
      `${imageIndex + 1} / ${currentSystem.gallery.length}`;

    $$("#gallery-thumbnails button").forEach(
      (button, index) => {
        button.setAttribute(
          "aria-current",
          String(index === imageIndex)
        );
      }
    );

    const selected =
      $$("#gallery-thumbnails button")[imageIndex];

    if (selected && $("#gallery-dialog").open) {
      selected.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "auto"
      });
    }
  }

  function openGallery(id, trigger) {
    currentSystem =
      data.systems.find(system => system.id === id);

    if (
      !currentSystem ||
      !currentSystem.gallery.length
    ) {
      return;
    }

    $("#gallery-title").textContent = currentSystem.title;

    $("#gallery-thumbnails").innerHTML =
      currentSystem.gallery
        .map((image, index) => `
          <button
            type="button"
            data-image="${index}"
            aria-label="Tampilan ${index + 1}: ${escapeHTML(image.caption)}"
            aria-current="${index === 0}"
          >
            <img
              src="${escapeHTML(thumbnail(image.src))}"
              alt=""
              loading="lazy"
            >
          </button>
        `)
        .join("");

    showImage(0);
    openDialog($("#gallery-dialog"), trigger);

    $("#gallery-thumbnails").scrollLeft = 0;
  }

  $("#previous-image").addEventListener(
    "click",
    () => showImage(imageIndex - 1)
  );

  $("#next-image").addEventListener(
    "click",
    () => showImage(imageIndex + 1)
  );

  $("#gallery-thumbnails").addEventListener(
    "click",
    event => {
      const button =
        event.target.closest("[data-image]");

      if (button) {
        showImage(Number(button.dataset.image));
      }
    }
  );

  $("#gallery-dialog").addEventListener(
    "keydown",
    event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(imageIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(imageIndex - 1);
      }
    }
  );

  let touchX = null;
  let touchY = null;

  $(".image-stage").addEventListener(
    "touchstart",
    event => {
      touchX = event.changedTouches[0].clientX;
      touchY = event.changedTouches[0].clientY;
    },
    { passive: true }
  );

  $(".image-stage").addEventListener(
    "touchend",
    event => {
      if (touchX === null) return;

      const differenceX =
        event.changedTouches[0].clientX - touchX;

      const differenceY =
        event.changedTouches[0].clientY - touchY;

      if (
        Math.abs(differenceX) > 45 &&
        Math.abs(differenceX) > Math.abs(differenceY)
      ) {
        showImage(
          imageIndex + (differenceX < 0 ? 1 : -1)
        );
      }

      touchX = null;
      touchY = null;
    },
    { passive: true }
  );

  // RISET AKADEMIK
  const topics = [
    "Semua",
    ...new Set(data.research.map(research => research.topic))
  ];

  $("#research-filters").innerHTML = topics
    .map((topic, index) => `
      <button
        type="button"
        data-topic="${escapeHTML(topic)}"
        aria-pressed="${index === 0}"
      >${escapeHTML(topic)}</button>
    `)
    .join("");

  function renderResearch(topic) {
    $("#research").innerHTML = data.research
      .filter(research =>
        topic === "Semua" || research.topic === topic
      )
      .map(research => {
        const number = String(
          data.research.indexOf(research) + 1
        ).padStart(2, "0");

        const extension =
          research.documentUrl.split(".").pop().toUpperCase();

        return `
          <article class="research-row">
            <span class="research-number">${number}</span>

            <div>
              <span class="tag">
                ${escapeHTML(research.type)}
              </span>

              <h3>${escapeHTML(research.title)}</h3>
              <p>${escapeHTML(research.summary)}</p>

              <p class="research-method">
                <strong>Fokus:</strong>
                ${escapeHTML(research.focus)}<br>

                <strong>Metode:</strong>
                ${escapeHTML(research.method)}
              </p>

              <p class="research-authors">
                ${research.authors.map(escapeHTML).join(" · ")}
              </p>
            </div>

            <div class="research-actions">
              <button
                class="button secondary"
                type="button"
                data-research="${escapeHTML(research.id)}"
              >Baca Ringkasan</button>

              ${
                fileLink(
                  research.documentUrl,
                  `Lihat Dokumen · ${extension}`
                )
              }

              <span class="research-status">
                ${escapeHTML(research.status)}
              </span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  $("#research-filters").addEventListener(
    "click",
    event => {
      const button =
        event.target.closest("[data-topic]");

      if (!button) return;

      $$("#research-filters button").forEach(item => {
        item.setAttribute(
          "aria-pressed",
          String(item === button)
        );
      });

      renderResearch(button.dataset.topic);
    }
  );

  renderResearch("Semua");

  function openResearch(id, trigger) {
    const research =
      data.research.find(item => item.id === id);

    if (!research) return;

    $("#research-detail").innerHTML = `
      <span class="tag">${escapeHTML(research.type)}</span>

      <h2 id="research-title">
        ${escapeHTML(research.title)}
      </h2>

      <p class="research-authors">
        ${research.authors.map(escapeHTML).join(" · ")}
      </p>

      <p>${escapeHTML(research.summary)}</p>

      <h3>Fokus &amp; metode</h3>

      <p>
        ${escapeHTML(research.focus)}<br>
        ${escapeHTML(research.method)}
      </p>

      <h3>Ringkasan</h3>
      <p>${escapeHTML(research.detail)}</p>

      <div class="actions">
        ${fileLink(research.documentUrl, "Lihat Dokumen")}

        ${
          (research.supports || [])
            .map(support => fileLink(support.url, support.label))
            .join("")
        }
      </div>

      <span class="research-status">
        ${escapeHTML(research.status)}
      </span>
    `;

    openDialog($("#research-dialog"), trigger);
  }

  document.addEventListener("click", event => {
    const gallery =
      event.target.closest("[data-gallery]");

    if (gallery) {
      openGallery(gallery.dataset.gallery, gallery);
    }

    const research =
      event.target.closest("[data-research]");

    if (research) {
      openResearch(research.dataset.research, research);
    }
  });

  // IDE PENGEMBANGAN AI — SIMULASI LOKAL
  $("#ai-scenario").innerHTML = data.scenarios
    .map(scenario => `
      <option value="${escapeHTML(scenario.id)}">
        ${escapeHTML(scenario.label)}
      </option>
    `)
    .join("");

  function renderScenario() {
    const scenario = data.scenarios.find(
      item => item.id === $("#ai-scenario").value
    );

    if (!scenario) return;

    $("#ai-title").textContent = scenario.title;
    $("#ai-output").textContent = scenario.output;
  }

  $("#ai-scenario").addEventListener(
    "change",
    renderScenario
  );

  renderScenario();

  // KONTROL ANIMASI
  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)");

  let motionPaused = false;

  try {
    motionPaused =
      localStorage.getItem("nest-motion") === "paused";
  } catch (error) {}

  function updateMotion() {
    document.documentElement.classList.toggle(
      "motion-paused",
      motionPaused
    );

    document.documentElement.classList.toggle(
      "motion-reduced",
      reducedMotion.matches
    );

    const running =
      !motionPaused && !reducedMotion.matches;

    const label = reducedMotion.matches
      ? "Animasi nonaktif sesuai pengaturan perangkat"
      : running
        ? "Jeda animasi"
        : "Aktifkan animasi";

    $("#motion-toggle").setAttribute(
      "aria-pressed",
      String(running)
    );

    $("#motion-toggle").setAttribute("aria-label", label);
    $("#motion-toggle").title = label;

    $("#motion-toggle").disabled = reducedMotion.matches;
  }

  $("#motion-toggle").addEventListener("click", () => {
    motionPaused = !motionPaused;

    try {
      localStorage.setItem(
        "nest-motion",
        motionPaused ? "paused" : "on"
      );
    } catch (error) {}

    updateMotion();
  });

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener(
      "change",
      updateMotion
    );
  }

  updateMotion();

  // ANIMASI KARTU SAAT TERLIHAT
  if ("IntersectionObserver" in window) {
    const cardsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            cardsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );

    const animatedSelectors =
      ".project-card,.research-row,.cert,.experience-row";

    function observeCards() {
      $$(animatedSelectors).forEach((element, index) => {
        if (element.classList.contains("motion-item")) {
          return;
        }

        element.classList.add("motion-item");

        element.style.setProperty(
          "--item-delay",
          `${(index % 3) * 65}ms`
        );

        cardsObserver.observe(element);
      });
    }

    observeCards();

    if ("MutationObserver" in window) {
      const cardChanges =
        new MutationObserver(observeCards);

      [$("#projects"), $("#research")].forEach(container => {
        cardChanges.observe(container, {
          childList: true
        });
      });
    }

    if (!reducedMotion.matches) {
      document.documentElement.classList.add("js-motion");

      const revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );

      $$(".reveal").forEach(element => {
        revealObserver.observe(element);
      });
    }
  }

  // TOMBOL KEMBALI KE KAMAR
  function updateBackTop() {
    $(".back-top").hidden = window.scrollY < 600;
  }

  window.addEventListener(
    "scroll",
    updateBackTop,
    { passive: true }
  );

  updateBackTop();
})();
