(function () {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const clone = value => JSON.parse(JSON.stringify(value));

  const labels = {
    profile: 'Profil & Kontak',
    experience: 'Pengalaman',
    systems: 'Portfolio Sistem',
    games: 'Games',
    research: 'Riset Akademik',
    education: 'Pendidikan',
    skills: 'Keahlian',
    certificates: 'Sertifikasi'
  };

  const schemas = {
    profile: {
      name: 'Nama lengkap',
      nickname: 'Nama panggilan',
      title: 'Profesi',
      headline: 'Judul perkenalan',
      heroDescription: 'Deskripsi perkenalan',
      aboutDescription: 'Tentang saya',
      email: 'Email publik',
      phone: 'Nomor telepon',
      whatsapp: 'WhatsApp (angka saja, awalan 62)',
      location: 'Lokasi',
      resumeUrl: 'Resume',
      website: 'Website',
      linkedinUrl: 'LinkedIn',
      githubUrl: 'GitHub'
    },

    experience: {
      period: 'Periode',
      role: 'Jabatan',
      company: 'Perusahaan / klien',
      description: 'Tanggung jawab'
    },

    systems: {
      id: 'Kode unik sistem',
      title: 'Nama sistem',
      category: 'Kategori',
      summary: 'Deskripsi singkat',
      cover: 'Gambar sampul sistem',
      accessStatus: 'Status akses sistem',
      publicUrl: 'Tautan Public Access',
      documentationUrl: 'Dokumentasi Google Docs',
      demoUrl: 'Demo',
      sourceUrl: 'Source code'
    },

    games: {
      id: 'Kode unik game',
      title: 'Nama game',
      category: 'Kategori',
      summary: 'Deskripsi singkat',
      cover: 'Gambar sampul game',
      accessStatus: 'Status akses game',
      publicUrl: 'Tautan game'
    },

    research: {
      id: 'Kode unik riset',
      title: 'Judul riset',
      topic: 'Topik',
      type: 'Jenis penelitian',
      authors: 'Penulis (satu per baris)',
      summary: 'Deskripsi singkat',
      focus: 'Fokus',
      method: 'Metode',
      detail: 'Ringkasan lengkap',
      documentUrl: 'Dokumen riset',
      status: 'Status'
    },

    education: {
      level: 'Jenjang / program',
      institution: 'Institusi',
      period: 'Periode',
      gpa: 'IPK',
      thesis: 'Tugas akhir',
      status: 'Status'
    },

    skills: {
      title: 'Kelompok keahlian',
      items: 'Daftar keahlian (satu per baris)'
    },

    certificates: {
      title: 'Nama sertifikasi',
      issuer: 'Penerbit',
      date: 'Tanggal'
    }
  };

  const nestedSchemas = {
    gallery: {
      src: 'Gambar screenshot',
      caption: 'Keterangan'
    },

    supports: {
      label: 'Nama dokumen pendukung',
      url: 'Dokumen'
    }
  };

  const urlKeys = new Set([
    'resumeUrl',
    'cover',
    'src',
    'documentUrl',
    'url',
    'website',
    'linkedinUrl',
    'githubUrl',
    'documentationUrl',
    'demoUrl',
    'sourceUrl',
    'publicUrl'
  ]);

  const uploadKeys = new Set([
    'resumeUrl',
    'cover',
    'src',
    'documentUrl',
    'url'
  ]);

  const imageKeys = new Set(['cover', 'src']);
  const arrayKeys = new Set(['authors', 'items']);

  const longKeys = new Set([
    'description',
    'heroDescription',
    'aboutDescription',
    'summary',
    'detail',
    'focus',
    'method',
    'thesis'
  ]);

  let content = null;
  let revision = 0;
  let section = 'profile';
  let dirty = false;
  let busy = false;
  let pendingUploads = 0;

  const draftKey = 'nest-portfolio-admin-draft';

  function el(tag, text, className) {
    const node = document.createElement(tag);

    if (text != null) {
      node.textContent = text;
    }

    if (className) {
      node.className = className;
    }

    return node;
  }

  function button(text, handler, className) {
    const node = el('button', text, className);

    node.type = 'button';
    node.addEventListener('click', handler);

    return node;
  }

  function notice(message, error = false) {
    const node = $('#notice');

    node.textContent = message;
    node.classList.toggle('error', error);
  }

  function status() {
    $('#state').textContent =
      'Versi ' + revision + ' · ' +
      (
        dirty
          ? 'Ada perubahan belum diterbitkan'
          : 'Konten sesuai publikasi terakhir'
      );
  }

  function changed() {
    dirty = true;
    status();
    renderStats();
  }

  function normalize(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Data konten tidak tersedia.');
    }

    // Mendukung konten lama yang belum memiliki Games.
    if (!Array.isArray(data.games)) {
      data.games = [];
    }

    data.games.forEach(game => {
      if (game.cover == null) {
        game.cover = '';
      }

      if (game.accessStatus == null) {
        game.accessStatus = 'hidden';
      }

      if (game.publicUrl == null) {
        game.publicUrl = '';
      }
    });

    return data;
  }

  function safeUrl(value) {
    if (!value) return true;
    if (typeof value !== 'string') return false;

    if (
      /^assets\/[\w./ -]+$/.test(value) &&
      !value.includes('..')
    ) {
      return true;
    }

    try {
      const parsed = new URL(value);

      return (
        /^https?:$/.test(parsed.protocol) &&
        !parsed.username &&
        !parsed.password
      );
    } catch (_) {
      return false;
    }
  }

  // assets/ adalah path dari root website, bukan folder admin.
  function previewUrl(value) {
    const url = String(value || '').trim();

    if (!url || !safeUrl(url)) return '';

    if (url.startsWith('assets/')) {
      return new URL('../' + url, location.href).href;
    }

    return url;
  }

  function validate(data) {
    normalize(data);

    if (
      !data.profile ||
      !String(data.profile.name || '').trim()
    ) {
      throw new Error('Nama profil wajib diisi.');
    }

    for (const key of Object.keys(labels)) {
      if (key === 'profile') continue;

      if (!Array.isArray(data[key])) {
        throw new Error(
          'Data ' + labels[key] + ' harus berupa daftar.'
        );
      }
    }

    for (const key of ['systems', 'research', 'games']) {
      const ids = new Set();

      for (const item of data[key]) {
        if (
          !item ||
          !/^[a-zA-Z0-9_-]+$/.test(item.id || '') ||
          ids.has(item.id)
        ) {
          throw new Error(
            'Kode ' + labels[key] +
            ' wajib unik dan hanya berisi huruf, angka, - atau _.'
          );
        }

        ids.add(item.id);

        if (!String(item.title || '').trim()) {
          throw new Error(
            'Judul ' + labels[key] + ' wajib diisi.'
          );
        }
      }
    }

    function walk(obj) {
      for (const [key, value] of Object.entries(obj)) {
        if (
          urlKeys.has(key) &&
          typeof value === 'string' &&
          !safeUrl(value)
        ) {
          throw new Error(
            'Tautan ' + key +
            ' tidak valid. Gunakan https:// atau assets/.'
          );
        }

        if (value && typeof value === 'object') {
          walk(value);
        }
      }
    }

    walk(data);

    for (const key of ['systems', 'games']) {
      for (const item of data[key]) {
        if (
          item.accessStatus === 'public' &&
          (
            !/^https?:\/\//i.test(item.publicUrl || '') ||
            !safeUrl(item.publicUrl)
          )
        ) {
          throw new Error(
            'Isi tautan Public access yang valid untuk ' +
            item.title + '.'
          );
        }
      }
    }

    for (const system of data.systems) {
      if (
        !Array.isArray(system.gallery) ||
        !system.gallery.length
      ) {
        throw new Error(
          'Sistem ' + system.title +
          ' membutuhkan minimal satu screenshot.'
        );
      }

      for (const image of system.gallery) {
        if (!image.src) {
          throw new Error(
            'Gambar galeri ' + system.title +
            ' belum diisi.'
          );
        }
      }

      if (system.documentationUrl) {
        let parsed;

        try {
          parsed = new URL(system.documentationUrl);
        } catch (_) {
          throw new Error(
            'Dokumentasi sistem harus berupa tautan Google Docs.'
          );
        }

        if (
          parsed.protocol !== 'https:' ||
          parsed.hostname !== 'docs.google.com' ||
          !parsed.pathname.startsWith('/document/')
        ) {
          throw new Error(
            'Dokumentasi sistem harus berupa tautan Google Docs.'
          );
        }
      }
    }

    for (const research of data.research) {
      if (
        !Array.isArray(research.authors) ||
        !Array.isArray(research.supports)
      ) {
        throw new Error(
          'Penulis atau dokumen pendukung riset tidak valid.'
        );
      }
    }
  }

  function syncDisabled() {
    document.querySelectorAll(
      '.toolbar button,#login-button,.history button'
    ).forEach(node => {
      node.disabled = busy || pendingUploads > 0;
    });
  }

  async function task(handler) {
    if (busy || pendingUploads > 0) return;

    busy = true;
    syncDisabled();

    try {
      await handler();
    } catch (error) {
      notice(
        error.name === 'AbortError'
          ? 'Koneksi terlalu lama. Coba lagi.'
          : error.message,
        true
      );
    } finally {
      busy = false;
      syncDisabled();
    }
  }

  function field(obj, key, label) {
    const wrap = el('label', label);

    if (key === 'accessStatus') {
      const select = el('select');

      [
        ['hidden', 'Sistem disembunyikan'],
        ['public', 'Public access']
      ].forEach(([value, text]) => {
        const option = el('option', text);
        option.value = value;
        select.append(option);
      });

      select.value =
        obj[key] === 'public' ? 'public' : 'hidden';

      select.addEventListener('change', () => {
        obj[key] = select.value;
        changed();
      });

      wrap.append(select);
      return wrap;
    }

    const isArray =
      arrayKeys.has(key) || Array.isArray(obj[key]);

    const isLong = isArray || longKeys.has(key);

    if (isLong || key === 'cover') {
      wrap.classList.add('wide');
    }

    const input = el(isLong ? 'textarea' : 'input');

    if (!isLong) {
      input.type = 'text';
    }

    input.value = isArray
      ? (
          Array.isArray(obj[key])
            ? obj[key].join('\n')
            : ''
        )
      : (obj[key] ?? '');

    if (key === 'publicUrl') {
      input.placeholder =
        'https://alamat-website-atau-game.com';
    }

    if (key === 'cover') {
      input.placeholder =
        'Unggah gambar atau masukkan URL sampul';
    }

    let refreshPreview = () => {};

    input.addEventListener('input', () => {
      obj[key] = isArray
        ? input.value
            .split('\n')
            .map(value => value.trim())
            .filter(Boolean)
        : input.value;

      changed();
      refreshPreview();
    });

    if (uploadKeys.has(key)) {
      const row = el('div', null, 'upload-row');
      row.append(input);

      const picker = el('input');
      picker.type = 'file';
      picker.hidden = true;

      picker.accept = imageKeys.has(key)
        ? '.png,.jpg,.jpeg,.webp'
        : '.png,.jpg,.jpeg,.webp,.pdf,.docx,.pptx';

      const uploadButton = button(
        'Unggah',
        () => {
          if (busy || pendingUploads > 0) return;
          picker.click();
        }
      );

      picker.addEventListener('change', async () => {
        const file = picker.files[0];
        if (!file) return;

        if (
          imageKeys.has(key) &&
          !/\.(png|jpe?g|webp)$/i.test(file.name)
        ) {
          notice(
            'Pilih gambar PNG, JPG, JPEG, atau WEBP.',
            true
          );

          picker.value = '';
          return;
        }

        if (file.size > 20 * 1024 * 1024) {
          notice(
            'Ukuran file maksimal 20 MB.',
            true
          );

          picker.value = '';
          return;
        }

        pendingUploads++;
        syncDisabled();

        uploadButton.disabled = true;
        uploadButton.textContent = 'Mengunggah…';
        input.disabled = true;

        try {
          const url = await NestCMS.upload(file);

          obj[key] = url;
          input.value = url;

          changed();
          refreshPreview();

          notice(
            'File berhasil diunggah. Klik Terbitkan ' +
            'untuk memperbarui website.'
          );
        } catch (error) {
          notice(error.message, true);
        } finally {
          pendingUploads--;
          syncDisabled();

          uploadButton.disabled = false;
          uploadButton.textContent = 'Unggah';
          input.disabled = false;
          picker.value = '';
        }
      });

      row.append(uploadButton, picker);
      wrap.append(row);
    } else {
      wrap.append(input);
    }

    if (imageKeys.has(key)) {
      const preview = el('img');
      preview.alt = 'Preview gambar';
      preview.hidden = true;

      Object.assign(preview.style, {
        display: 'none',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '260px',
        objectFit: 'contain',
        marginTop: '12px',
        borderRadius: '8px',
        background: '#172a35'
      });

      const help = el(
        'small',
        key === 'cover'
          ? 'Sampul akan tampil pada kartu di website setelah diterbitkan.'
          : 'Preview screenshot.'
      );

      help.style.display = 'block';
      help.style.marginTop = '8px';

      refreshPreview = () => {
        const url = previewUrl(obj[key]);

        if (!url) {
          preview.hidden = true;
          preview.style.display = 'none';
          preview.removeAttribute('src');
          return;
        }

        preview.hidden = false;
        preview.style.display = 'block';

        if (preview.getAttribute('src') !== url) {
          preview.src = url;
        }
      };

      preview.addEventListener('error', () => {
        preview.hidden = true;
        preview.style.display = 'none';

        help.textContent =
          'Preview gagal dimuat. Periksa URL atau unggah gambar baru.';
      });

      preview.addEventListener('load', () => {
        help.textContent =
          'Gambar siap. Klik Terbitkan untuk menampilkannya di website.';
      });

      wrap.append(preview, help);
      refreshPreview();
    }

    return wrap;
  }

  function form(obj, schema) {
    const grid = el('div', null, 'fields');

    for (const [key, label] of Object.entries(schema)) {
      grid.append(field(obj, key, label));
    }

    return grid;
  }

  function move(list, index, delta) {
    if (busy || pendingUploads > 0) return;

    const next = index + delta;

    if (next < 0 || next >= list.length) return;

    [list[index], list[next]] =
      [list[next], list[index]];

    changed();
    render();
  }

  function nestedEditor(item, key) {
    if (!Array.isArray(item[key])) {
      item[key] = [];
    }

    const panel = el('div', null, 'wide');

    panel.append(
      el(
        'h3',
        key === 'gallery'
          ? 'Screenshot galeri'
          : 'Dokumen pendukung'
      )
    );

    item[key].forEach((obj, index) => {
      const box = el('div', null, 'nested');
      const head = el('div', null, 'entry-head');
      const actions = el('div', null, 'entry-actions');

      head.append(
        el(
          'h3',
          (
            key === 'gallery'
              ? 'Screenshot '
              : 'Dokumen '
          ) + (index + 1)
        )
      );

      actions.append(
        button('↑', () => move(item[key], index, -1)),
        button('↓', () => move(item[key], index, 1)),

        button('Hapus', () => {
          if (busy || pendingUploads > 0) return;

          if (confirm('Hapus item ini dari draft?')) {
            item[key].splice(index, 1);
            changed();
            render();
          }
        }, 'danger')
      );

      head.append(actions);
      box.append(head, form(obj, nestedSchemas[key]));
      panel.append(box);
    });

    panel.append(
      button(
        key === 'gallery'
          ? '+ Screenshot'
          : '+ Dokumen pendukung',

        () => {
          if (busy || pendingUploads > 0) return;

          item[key].push(
            key === 'gallery'
              ? { src: '', caption: '' }
              : { label: '', url: '' }
          );

          changed();
          render();
        }
      )
    );

    return panel;
  }

  function newItem(key) {
    const item = {};

    for (const fieldKey of Object.keys(schemas[key])) {
      item[fieldKey] = '';
    }

    if (key === 'skills') {
      item.items = [];
    }

    if (key === 'games') {
      Object.assign(item, {
        id: 'game-' + Date.now(),
        cover: '',
        accessStatus: 'hidden',
        publicUrl: ''
      });
    }

    if (key === 'systems') {
      Object.assign(item, {
        id: 'system-' + Date.now(),
        gallery: [],
        accessStatus: 'hidden',
        publicUrl: '',
        accessType: 'gallery',
        requiresLogin: null
      });
    }

    if (key === 'research') {
      Object.assign(item, {
        id: 'research-' + Date.now(),
        authors: [],
        supports: [],
        status: 'Naskah riset akademik'
      });
    }

    return item;
  }

  function renderStats() {
    if (!content) return;

    const stats = $('#stats');
    stats.replaceChildren();

    [
      ['Sistem', content.systems?.length || 0],
      ['Games', content.games?.length || 0],
      ['Riset', content.research?.length || 0],
      ['Pengalaman', content.experience?.length || 0]
    ].forEach(([label, value]) => {
      const stat = el('div', null, 'stat');

      stat.append(
        el('strong', String(value)),
        el('span', label)
      );

      stats.append(stat);
    });
  }

  function render() {
    if (!content) return;

    normalize(content);

    $('#section-title').textContent = labels[section];

    const editor = $('#editor');
    editor.replaceChildren();

    renderStats();

    if (section === 'profile') {
      const box = el('section', null, 'entry');

      box.append(
        form(content.profile, schemas.profile)
      );

      editor.append(box);
    } else {
      const list = content[section];

      if (!Array.isArray(list)) {
        throw new Error(
          'Data ' + labels[section] + ' tidak valid.'
        );
      }

      list.forEach((item, index) => {
        const box = el('section', null, 'entry');
        const head = el('div', null, 'entry-head');
        const actions = el('div', null, 'entry-actions');

        head.append(
          el(
            'h2',
            (index + 1) + '. ' +
            (
              item.title ||
              item.role ||
              item.level ||
              'Item baru'
            )
          )
        );

        actions.append(
          button('↑', () => move(list, index, -1)),
          button('↓', () => move(list, index, 1)),

          button('Hapus', () => {
            if (busy || pendingUploads > 0) return;

            if (confirm(
              'Hapus item ini dari draft? ' +
              'Perubahan berlaku setelah diterbitkan.'
            )) {
              list.splice(index, 1);
              changed();
              render();
            }
          }, 'danger')
        );

        head.append(actions);
        box.append(head, form(item, schemas[section]));

        if (section === 'systems') {
          box.append(nestedEditor(item, 'gallery'));
        }

        if (section === 'research') {
          box.append(nestedEditor(item, 'supports'));
        }

        editor.append(box);
      });

      if (!list.length) {
        editor.append(
          el(
            'p',
            'Belum ada item. Tambahkan konten pertama.',
            'empty'
          )
        );
      }

      editor.append(
        button('+ Tambah ' + labels[section], () => {
          if (busy || pendingUploads > 0) return;

          list.push(newItem(section));
          changed();
          render();
        })
      );
    }

    document.querySelectorAll('#tabs button')
      .forEach(node => {
        node.setAttribute(
          'aria-pressed',
          String(node.dataset.key === section)
        );
      });

    status();
  }

  async function loadHistory() {
    const select = $('#versions');
    select.replaceChildren();

    const rows = await NestCMS.history();

    rows.forEach(row => {
      const option = el(
        'option',
        'Versi ' + row.revision + ' · ' +
        new Date(row.created_at).toLocaleString('id-ID')
      );

      option.value = row.id;
      select.append(option);
    });

    if (!rows.length) {
      const option = el(
        'option',
        'Belum ada publikasi'
      );

      option.value = '';
      select.append(option);
    }
  }

  async function load() {
    const rows = await NestCMS.readAdmin();

    content = normalize(
      clone(rows[0]?.content || window.PORTFOLIO_DATA)
    );

    revision = rows[0]?.revision || 0;
    dirty = false;

    render();
    await loadHistory();

    if (!rows.length) {
      notice(
        'Konten website dimuat sebagai data awal. ' +
        'Periksa lalu klik Terbitkan untuk mengaktifkan CMS.'
      );
    }
  }

  async function enter() {
    const user = await NestCMS.authorize();

    $('#user-email').textContent = user.email;

    await load();

    $('#login').hidden = true;
    $('#dashboard').hidden = false;
  }

  const tabs = $('#tabs');
  tabs.replaceChildren();

  for (const [key, label] of Object.entries(labels)) {
    const tab = button(label, () => {
      if (!content || busy || pendingUploads > 0) return;

      section = key;
      render();
    });

    tab.dataset.key = key;
    tabs.append(tab);
  }

  $('#login-form').addEventListener('submit', event => {
    event.preventDefault();

    task(async () => {
      await NestCMS.login(
        $('#email').value,
        $('#password').value
      );

      $('#password').value = '';

      await enter();
      notice('Selamat datang, Nest.');
    });
  });

  $('#logout').addEventListener('click', () => {
    task(async () => {
      if (
        dirty &&
        !confirm(
          'Keluar dengan perubahan belum diterbitkan? ' +
          'Simpan draft terlebih dahulu jika diperlukan.'
        )
      ) {
        return;
      }

      await NestCMS.logout();
      location.reload();
    });
  });

  $('#publish').addEventListener('click', () => {
    task(async () => {
      if (!content) {
        throw new Error('Konten belum dimuat.');
      }

      validate(content);

      if (!confirm(
        'Terbitkan perubahan ini ke website publik?'
      )) {
        return;
      }

      // Salin data agar perubahan selama permintaan
      // tidak dianggap sudah ikut diterbitkan.
      const snapshot = clone(content);

      revision = await NestCMS.publish(
        snapshot,
        revision
      );

      dirty =
        JSON.stringify(content) !==
        JSON.stringify(snapshot);

      status();

      notice(
        'Versi ' + revision +
        ' berhasil diterbitkan. Muat ulang website ' +
        'untuk melihat perubahan.'
      );

      try {
        await loadHistory();
      } catch (_) {
        notice(
          'Publikasi berhasil, tetapi riwayat belum ' +
          'dapat dimuat ulang.'
        );
      }
    });
  });

  $('#draft').addEventListener('click', () => {
    if (!content || busy || pendingUploads > 0) return;

    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          content,
          date: new Date().toISOString(),
          revision
        })
      );

      notice(
        'Draft tersimpan di browser ini. ' +
        'Belum tampil di website.'
      );
    } catch (error) {
      notice(
        'Draft tidak dapat disimpan: ' + error.message,
        true
      );
    }
  });

  $('#load-draft').addEventListener('click', () => {
    if (busy || pendingUploads > 0) return;

    try {
      const draft = JSON.parse(
        localStorage.getItem(draftKey) || 'null'
      );

      if (!draft?.content) {
        throw new Error(
          'Belum ada draft di browser ini.'
        );
      }

      if (
        dirty &&
        !confirm(
          'Ganti perubahan saat ini dengan draft tersimpan?'
        )
      ) {
        return;
      }

      const restored = normalize(clone(draft.content));
      validate(restored);

      content = restored;

      changed();
      render();

      notice(
        'Draft dibuka. Periksa sebelum menerbitkan.'
      );
    } catch (error) {
      notice(error.message, true);
    }
  });

  $('#reload').addEventListener('click', () => {
    task(async () => {
      if (
        dirty &&
        !confirm(
          'Buang perubahan belum diterbitkan ' +
          'dan muat konten terbaru?'
        )
      ) {
        return;
      }

      await load();
      notice('Konten terbaru dimuat.');
    });
  });

  $('#restore').addEventListener('click', () => {
    task(async () => {
      const versionId = $('#versions').value;

      if (!versionId) {
        throw new Error(
          'Belum ada versi tersimpan.'
        );
      }

      if (
        dirty &&
        !confirm(
          'Ganti perubahan saat ini dengan versi yang dipilih?'
        )
      ) {
        return;
      }

      content = normalize(
        clone(await NestCMS.version(versionId))
      );

      changed();
      render();

      notice(
        'Versi lama dibuka sebagai draft. ' +
        'Klik Terbitkan untuk memulihkan.'
      );
    });
  });

  $('#export').addEventListener('click', () => {
    if (!content) return;

    const blob = new Blob(
      [JSON.stringify(content, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const link = el('a');

    link.href = url;
    link.download = 'nest-portfolio-backup.json';

    document.body.append(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  window.addEventListener('beforeunload', event => {
    if (dirty || pendingUploads > 0) {
      event.preventDefault();
      event.returnValue = '';
    }
  });

  if (
    !window.NestCMS ||
    !NestCMS.configured()
  ) {
    $('#setup').hidden = false;
    $('#login-button').disabled = true;

    notice(
      'Konfigurasi Supabase belum tersedia.',
      true
    );
  } else {
    task(async () => {
      let authorized = false;

      try {
        await NestCMS.authorize();
        authorized = true;
      } catch (_) {
        $('#login').hidden = false;
        $('#dashboard').hidden = true;
      }

      if (authorized) {
        await enter();
      }
    });
  }
})();
