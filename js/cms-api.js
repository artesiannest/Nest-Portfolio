(function () {
  'use strict';
  const config = window.NEST_CMS_CONFIG || {};
  let session = null;
  try { session = JSON.parse(sessionStorage.getItem('nest-admin-session') || 'null'); } catch (_) {}
  const base = String(config.url || '').replace(/\/$/, '');
  function configured() {
    try { if(String(config.key).startsWith('eyJ') && JSON.parse(atob(config.key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role !== 'anon') return false; } catch (_) { return false; }
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base) && !!config.key && !String(config.key).startsWith('sb_secret_'); }
  function remember(value) { session = value; if (value) { value.expires_at = value.expires_at || Date.now()/1000 + value.expires_in; sessionStorage.setItem('nest-admin-session',JSON.stringify(value)); } else sessionStorage.removeItem('nest-admin-session'); }
  async function request(path, options = {}, token = null) {
    if (!configured()) throw new Error('Isi konfigurasi Supabase di js/cms-config.js terlebih dahulu.');
    const headers = { apikey: config.key, ...options.headers };
    if (token) headers.Authorization = 'Bearer ' + token;
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(base + path, {...options,headers,signal:controller.signal});
      const raw = await response.text(); let result;
      try { result = raw ? JSON.parse(raw) : null; } catch (_) { result = raw; }
      if (!response.ok) throw new Error((result && (result.msg || result.message || result.error_description || result.error)) || 'Permintaan gagal ('+response.status+').');
      return result;
    } finally { clearTimeout(timeout); }
  }
  async function token() {
    if (!session) throw new Error('Silakan login terlebih dahulu.');
    if (!session.expires_at || session.expires_at < Date.now()/1000 + 60) {
      try { remember(await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})})); }
      catch (error) { remember(null); throw error; }
    }
    return session.access_token;
  }
  window.NestCMS = {
    configured,
    async login(email,password) { remember(await request('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})); },
    async logout() { try { if(session) await request('/auth/v1/logout',{method:'POST'},await token()); } finally { remember(null); } },
    async authorize() { const jwt = await token(); const user = await request('/auth/v1/user',{},jwt); const rows = await request('/rest/v1/nest_admins?select=user_id&user_id=eq.'+encodeURIComponent(user.id),{},jwt); if(!rows.length) {remember(null);throw new Error('Akun ini belum terdaftar sebagai admin.');} return user; },
    async readPublic(signal) { return request('/rest/v1/nest_content?id=eq.1&select=content,revision'); },
    async readAdmin() { return request('/rest/v1/nest_content?id=eq.1&select=content,revision',{},await token()); },
    async publish(content,revision) { return request('/rest/v1/rpc/nest_publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({new_content:content,expected_revision:revision})},await token()); },
    async history() { return request('/rest/v1/nest_versions?select=id,created_at,revision&order=revision.desc&limit=20',{},await token()); },
    async version(id) { const rows = await request('/rest/v1/nest_versions?id=eq.'+encodeURIComponent(id)+'&select=content',{},await token()); if(!rows.length) throw new Error('Versi tidak ditemukan.');return rows[0].content; },
    async upload(file) {
      if(file.size>20*1024*1024) throw new Error('Ukuran maksimum 20 MB.');
      const ext=file.name.split('.').pop().toLowerCase();
      const types={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
      if(!types[ext]) throw new Error('Gunakan PNG, JPG, WEBP, PDF, DOCX, atau PPTX.');
      const path='uploads/'+crypto.randomUUID()+'.'+ext;
      await request('/storage/v1/object/nest-assets/'+path,{method:'POST',headers:{'Content-Type':types[ext],'x-upsert':'false'},body:file},await token());
      return base+'/storage/v1/object/public/nest-assets/'+path;
    }
  };
})();
