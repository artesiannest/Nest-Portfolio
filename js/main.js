(function () {
  'use strict';
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const isExternal = url => /^https?:\/\//i.test(url || '');
  const safeUrl = url => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) { try { const parsed = new URL(url); return parsed.username || parsed.password ? '' : parsed.href; } catch (_) { return ''; } }
    return /^assets\/[a-zA-Z0-9_./ -]+$/.test(url) && !url.includes('..') ? url : '';
  };
  const docUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' && u.hostname === 'docs.google.com' && u.pathname.startsWith('/document/') ? u.href : ''; } catch (_) { return ''; } };
  const fileLink = (url, label, className = 'button secondary') => { const valid = safeUrl(url); return valid ? `<a class="${className}" href="${escapeHTML(valid)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>` : ''; };
  const thumb = src => src.replace(/\.png$/i, '.webp');

  // Profile links and resume controls share one editable source.
  $('.hero-copy > .eyebrow').textContent = `${data.profile.name.toUpperCase()} / ${data.profile.nickname.toUpperCase()}`;
  $('.profession').textContent = data.profile.title;
  $('.hero-description').textContent = data.profile.heroDescription;
  $('.hero-copy h1').innerHTML = escapeHTML(data.profile.headline).replace('lebih membantu', '<em>lebih membantu</em>');
  $('.about-content > p:not(.large-text)').textContent = data.profile.aboutDescription;
  $('footer > p').textContent = `${data.profile.name} · ${data.profile.location}`;
  $('.education').innerHTML = data.education.map((e, i) => `<article><span class="eyebrow">${i === 0 ? 'PENDIDIKAN SARJANA' : 'STUDI LANJUTAN'}</span><h3>${escapeHTML(e.level)}</h3><p>${escapeHTML(e.institution)}${e.period ? ' · ' + escapeHTML(e.period) : ''}</p>${e.gpa ? '<strong>IPK ' + escapeHTML(e.gpa) + '</strong>' : ''}${e.thesis ? '<p class="small">Tugas akhir: ' + escapeHTML(e.thesis) + '</p>' : ''}${e.status ? '<span class="tag">' + escapeHTML(e.status) + '</span>' : ''}</article>`).join('');
  $$('a[href="assets/documents/resume-nestiara.pdf"]').forEach(a => { if (safeUrl(data.profile.resumeUrl)) a.href = data.profile.resumeUrl; });
  $('#skills').innerHTML = data.skills.map(s => `<article class="skill-group"><h3>${escapeHTML(s.title)}</h3><p>${s.items.map(escapeHTML).join(' · ')}</p></article>`).join('');
  $('#experience').innerHTML = data.experience.map(e => `<article class="experience-row"><p class="experience-date">${escapeHTML(e.period)}</p><div class="experience-role"><h3>${escapeHTML(e.role)}</h3><p>${escapeHTML(e.company)}</p></div><p class="experience-description">${escapeHTML(e.description)}</p></article>`).join('');
  $('#certificates').innerHTML = data.certificates.map(c => `<article class="cert"><h4>${escapeHTML(c.title)}</h4><p>${escapeHTML(c.issuer)}<br>${escapeHTML(c.date)}</p></article>`).join('');
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email) ? data.profile.email : '';
  const whatsapp = /^\d{8,15}$/.test(data.profile.whatsapp) ? data.profile.whatsapp : '';
  $('#contact-actions').innerHTML = (email ? `<a class="button primary" href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a>` : '') + (whatsapp ? `<a class="button secondary" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : '') + fileLink(data.profile.linkedinUrl, 'LinkedIn') + fileLink(data.profile.githubUrl, 'GitHub');

  // Theme and mobile navigation.
  function updateThemeLabel() { const light = document.documentElement.dataset.theme === 'light'; $('#theme').setAttribute('aria-label', `Aktifkan mode ${light ? 'gelap' : 'terang'}`); $('#theme').setAttribute('title', `Aktifkan mode ${light ? 'gelap' : 'terang'}`); }
  updateThemeLabel();
  $('#theme').addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try { localStorage.setItem('nest-theme', next); } catch (_) {} updateThemeLabel(); });
  function closeMenu() { $('#navigation').classList.remove('open'); $('#menu').setAttribute('aria-expanded', 'false'); $('#menu').setAttribute('aria-label', 'Buka menu'); }
  $('#menu').addEventListener('click', () => { const open = $('#navigation').classList.toggle('open'); $('#menu').setAttribute('aria-expanded', String(open)); $('#menu').setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu'); });
  $$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#navigation').classList.contains('open')) { closeMenu(); $('#menu').focus(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });

  // Portfolio cards: document anchor and gallery trigger are siblings.
  data.systems.forEach(s => { const o = document.createElement('option'); o.value = s.category; o.textContent = s.category; $('#category').appendChild(o); });
  function renderProjects() {
    const q = $('#search').value.trim().toLocaleLowerCase('id');
    const category = $('#category').value;
    const systems = data.systems.filter(s => (!category || s.category === category) && [s.title, s.category, s.summary].join(' ').toLocaleLowerCase('id').includes(q));
    $('#projects').innerHTML = systems.map(s => {
      const url = docUrl(s.documentationUrl);
      const content = `<div class="project-image"><span class="project-index">${String(data.systems.indexOf(s) + 1).padStart(2, '0')} / 06</span><img src="${escapeHTML(thumb(s.cover))}" alt="Tampilan ${escapeHTML(s.title)}" loading="lazy" width="900" height="500"></div><div class="project-content"><div class="project-category">${escapeHTML(s.category)}</div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.summary)}</p><span class="doc-status ${url ? 'doc-active' : ''}">${url ? 'Baca Dokumentasi' : 'Dokumentasi segera tersedia'}</span>${url ? '<span class="doc-meta">Google Docs · Tab baru</span>' : ''}</div>`;
      const body = url ? `<a class="project-body" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="Baca dokumentasi ${escapeHTML(s.title)} di Google Docs, tab baru">${content}</a>` : `<div class="project-body">${content}</div>`;
      return `<article class="project-card">${body}<div class="project-footer"><button type="button" data-gallery="${s.id}">Lihat Screenshot</button><span>${s.gallery.length} tampilan</span></div></article>`;
    }).join('');
    $('#result-count').textContent = `${systems.length} dari ${data.systems.length} sistem`;
    $('#empty-projects').hidden = systems.length > 0;
  }
  $('#search').addEventListener('input', renderProjects);
  $('#category').addEventListener('change', renderProjects);
  renderProjects();
  $('#prototypes').innerHTML = data.systems.map(s => {
    const demo = isExternal(s.demoUrl) && safeUrl(s.demoUrl);
    const source = isExternal(s.sourceUrl) && safeUrl(s.sourceUrl);
    const state = demo ? (s.requiresLogin === true ? 'Demo tersedia · Membutuhkan akun' : s.requiresLogin === false ? (s.accessType === 'open' ? 'Demo open access' : 'Demo tersedia · Tanpa login') : 'Demo tersedia · Ketentuan akses belum dikonfirmasi') : 'Demo belum tersedia';
    return `<article class="prototype-card"><span class="eyebrow">${escapeHTML(s.category)}</span><h3>${escapeHTML(s.title)}</h3><p>Galeri ${s.gallery.length} screenshot</p><p class="prototype-status">${escapeHTML(state)}<br>${source ? 'Source code publik tersedia' : 'Source code publik belum ditautkan'}</p><div class="actions">${demo ? fileLink(demo, 'Coba Prototype', 'button primary') : '<button class="button secondary" disabled>Coba Prototype</button>'}<button class="button secondary" data-gallery="${s.id}">Lihat Tampilan</button>${source ? fileLink(source, 'Source Code') : ''}</div></article>`;
  }).join('');

  // Native dialogs keep focus inside; close restores the original trigger.
  const dialogs = [$('#gallery-dialog'), $('#research-dialog')];
  let returnFocus = null;
  function openDialog(dialog, trigger) { returnFocus = trigger || document.activeElement; dialog.showModal(); document.body.style.overflow = 'hidden'; $('.close-dialog', dialog).focus(); }
  function closeDialog(dialog) { dialog.close(); }
  dialogs.forEach(dialog => {
    $('.close-dialog', dialog).addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (returnFocus && returnFocus.isConnected) returnFocus.focus(); });
    dialog.addEventListener('click', e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(dialog); });
  });
  $('#full-image').addEventListener('load', () => { $('#full-image').classList.remove('image-enter'); requestAnimationFrame(() => $('#full-image').classList.add('image-enter')); });
  let currentSystem = null;
  let imageIndex = 0;
  function showImage(index) {
    if (!currentSystem) return;
    imageIndex = (index + currentSystem.gallery.length) % currentSystem.gallery.length;
    const img = currentSystem.gallery[imageIndex];
    $('#full-image').classList.remove('image-enter');
    $('#full-image').src = img.src;
    $('#full-image').alt = `${currentSystem.title} — ${img.caption}`;
    $('#gallery-caption').textContent = img.caption;
    $('#gallery-number').textContent = `${imageIndex + 1} / ${currentSystem.gallery.length}`;
    $$('#gallery-thumbnails button').forEach((b, i) => b.setAttribute('aria-current', String(i === imageIndex)));
    const selected = $$('#gallery-thumbnails button')[imageIndex];
    if (selected && $('#gallery-dialog').open) selected.scrollIntoView({block:'nearest', inline:'nearest', behavior:'auto'});
  }
  function openGallery(id, trigger) {
    currentSystem = data.systems.find(s => s.id === id);
    if (!currentSystem || !currentSystem.gallery.length) return;
    $('#gallery-title').textContent = currentSystem.title;
    $('#gallery-thumbnails').innerHTML = currentSystem.gallery.map((im, i) => `<button data-image="${i}" aria-label="Tampilan ${i + 1}: ${escapeHTML(im.caption)}" aria-current="${i === 0}"><img src="${escapeHTML(thumb(im.src))}" alt="" loading="lazy"></button>`).join('');
    showImage(0);
    openDialog($('#gallery-dialog'), trigger);
    $('#gallery-thumbnails').scrollLeft = 0;
  }
  $('#previous-image').addEventListener('click', () => showImage(imageIndex - 1));
  $('#next-image').addEventListener('click', () => showImage(imageIndex + 1));
  $('#gallery-thumbnails').addEventListener('click', e => { const button = e.target.closest('[data-image]'); if (button) showImage(Number(button.dataset.image)); });
  $('#gallery-dialog').addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); showImage(imageIndex + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); showImage(imageIndex - 1); } });
  let touchX = null, touchY = null;
  $('.image-stage').addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; touchY = e.changedTouches[0].clientY; }, {passive:true});
  $('.image-stage').addEventListener('touchend', e => { if (touchX === null) return; const dx = e.changedTouches[0].clientX - touchX; const dy = e.changedTouches[0].clientY - touchY; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showImage(imageIndex + (dx < 0 ? 1 : -1)); touchX = null; }, {passive:true});

  // Academic works keep study objects separate from system portfolio.
  const topics = ['Semua', ...new Set(data.research.map(r => r.topic))];
  $('#research-filters').innerHTML = topics.map((topic, i) => `<button data-topic="${escapeHTML(topic)}" aria-pressed="${i === 0}">${escapeHTML(topic)}</button>`).join('');
  function renderResearch(topic) {
    $('#research').innerHTML = data.research.filter(r => topic === 'Semua' || r.topic === topic).map(r => `<article class="research-row"><span class="research-number">${String(data.research.indexOf(r) + 1).padStart(2, '0')}</span><div><span class="tag">${escapeHTML(r.type)}</span><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(r.summary)}</p><p class="research-method"><strong>Fokus:</strong> ${escapeHTML(r.focus)}<br><strong>Metode:</strong> ${escapeHTML(r.method)}</p><p class="research-authors">${r.authors.map(escapeHTML).join(' · ')}</p></div><div class="research-actions"><button class="button secondary" data-research="${r.id}">Baca Ringkasan</button>${fileLink(r.documentUrl, `Lihat Dokumen · ${r.documentUrl.split('.').pop().toUpperCase()}`)}<span class="research-status">${escapeHTML(r.status)}</span></div></article>`).join('');
  }
  $('#research-filters').addEventListener('click', e => { const b = e.target.closest('[data-topic]'); if (!b) return; $$('#research-filters button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderResearch(b.dataset.topic); });
  renderResearch('Semua');
  function openResearch(id, trigger) {
    const r = data.research.find(x => x.id === id); if (!r) return;
    $('#research-detail').innerHTML = `<span class="tag">${escapeHTML(r.type)}</span><h2 id="research-title">${escapeHTML(r.title)}</h2><p class="research-authors">${r.authors.map(escapeHTML).join(' · ')}</p><p>${escapeHTML(r.summary)}</p><h3>Fokus & metode</h3><p>${escapeHTML(r.focus)}<br>${escapeHTML(r.method)}</p><h3>Ringkasan</h3><p>${escapeHTML(r.detail)}</p><div class="actions">${fileLink(r.documentUrl, 'Lihat Dokumen')}${r.supports.map(s => fileLink(s.url, s.label)).join('')}</div><span class="research-status">${escapeHTML(r.status)}</span>`;
    openDialog($('#research-dialog'), trigger);
  }
  document.addEventListener('click', e => { const gallery = e.target.closest('[data-gallery]'); if (gallery) openGallery(gallery.dataset.gallery, gallery); const research = e.target.closest('[data-research]'); if (research) openResearch(research.dataset.research, research); });

  // Explicitly labelled local simulation, with no API or account data.
  $('#ai-scenario').innerHTML = data.scenarios.map(s => `<option value="${s.id}">${escapeHTML(s.label)}</option>`).join('');
  function renderScenario() { const s = data.scenarios.find(x => x.id === $('#ai-scenario').value); $('#ai-title').textContent = s.title; $('#ai-output').textContent = s.output; }
  $('#ai-scenario').addEventListener('change', renderScenario);
  renderScenario();
  // Motion preference can be paused and honours changes to system settings.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = false;
  try { motionPaused = localStorage.getItem('nest-motion') === 'paused'; } catch (_) {}
  function updateMotion() {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    document.documentElement.classList.toggle('motion-reduced', reducedMotion.matches);
    const running = !motionPaused && !reducedMotion.matches;
    $('#motion-toggle').setAttribute('aria-pressed', String(running));
    $('#motion-toggle').setAttribute('aria-label', reducedMotion.matches ? 'Animasi nonaktif sesuai pengaturan perangkat' : running ? 'Jeda animasi' : 'Aktifkan animasi');
    $('#motion-toggle').title = $('#motion-toggle').getAttribute('aria-label');
    $('#motion-toggle').disabled = reducedMotion.matches;
  }
  $('#motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; try { localStorage.setItem('nest-motion', motionPaused ? 'paused' : 'on'); } catch (_) {} updateMotion(); });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', updateMotion);
  updateMotion();
  $$('.focus-strip span').forEach((el, i) => el.style.setProperty('--item-delay', `${i * 80}ms`));
  if ('IntersectionObserver' in window) {
    const cardsObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); cardsObserver.unobserve(entry.target); } }), {threshold:0.06});
    const animatedSelectors = '.project-card,.prototype-card,.research-row,.cert,.experience-row';
    function observeCards() { $$(animatedSelectors).forEach((el, i) => { if (el.classList.contains('motion-item')) return; el.classList.add('motion-item'); el.style.setProperty('--item-delay', `${(i % 3) * 65}ms`); cardsObserver.observe(el); }); }
    observeCards();
    const cardChanges = new MutationObserver(observeCards);
    [$('#projects'), $('#research')].forEach(container => cardChanges.observe(container, {childList:true}));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { document.documentElement.classList.add('js-motion'); const reveal = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); } }), {threshold:0.08}); $$('.reveal').forEach(el => reveal.observe(el)); }
    const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { $$('#navigation a').forEach(a => { const active = a.hash === '#' + e.target.id; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); } }); }, {rootMargin:'-15% 0px -65% 0px', threshold:0}); $$('main>section[id]').filter(s => s.id !== 'ai').forEach(s => observer.observe(s));
  }
  function updateBackTop() { $('.back-top').hidden = window.scrollY < 600; }
  window.addEventListener('scroll', updateBackTop, {passive:true}); updateBackTop();
})();
