(function () {
 'use strict';
 const $=s=>document.querySelector(s);
 const clone=v=>JSON.parse(JSON.stringify(v));
 const labels={profile:'Profil & Kontak',experience:'Pengalaman',systems:'Portfolio Sistem',research:'Riset Akademik',education:'Pendidikan',skills:'Keahlian',certificates:'Sertifikasi'};
 const schemas={
  profile:{name:'Nama lengkap',nickname:'Nama panggilan',title:'Profesi',headline:'Judul perkenalan',heroDescription:'Deskripsi perkenalan',aboutDescription:'Tentang saya',email:'Email publik',phone:'Nomor telepon',whatsapp:'WhatsApp (angka saja, awalan 62)',location:'Lokasi',resumeUrl:'Resume',website:'Website',linkedinUrl:'LinkedIn',githubUrl:'GitHub'},
  experience:{period:'Periode',role:'Jabatan',company:'Perusahaan / klien',description:'Tanggung jawab'},
  education:{level:'Jenjang / program',institution:'Institusi',period:'Periode',gpa:'IPK',thesis:'Tugas akhir',status:'Status'},
  skills:{title:'Kelompok keahlian',items:'Daftar keahlian (satu per baris)'},
  certificates:{title:'Nama sertifikasi',issuer:'Penerbit',date:'Tanggal'},
  systems:{id:'Kode unik sistem',title:'Nama sistem',category:'Kategori',summary:'Deskripsi singkat',cover:'Gambar sampul',documentationUrl:'Dokumentasi Google Docs',demoUrl:'Demo',sourceUrl:'Source code'},
  research:{id:'Kode unik riset',title:'Judul riset',topic:'Topik',type:'Jenis penelitian',authors:'Penulis (satu per baris)',summary:'Deskripsi singkat',focus:'Fokus',method:'Metode',detail:'Ringkasan lengkap',documentUrl:'Dokumen riset',status:'Status'}
 };
 const nested={gallery:{src:'Gambar screenshot',caption:'Keterangan'},supports:{label:'Nama dokumen pendukung',url:'Dokumen'}};
 const urls=new Set(['resumeUrl','cover','src','documentUrl','url','website','linkedinUrl','githubUrl','documentationUrl','demoUrl','sourceUrl']);
 const uploadKeys=new Set(['resumeUrl','cover','src','documentUrl','url']);
 let content=null,revision=0,section='profile',dirty=false,busy=false;
 const draftKey='nest-portfolio-admin-draft';
 function notice(message,error=false){$('#notice').textContent=message;$('#notice').classList.toggle('error',error);}
 function status(){ $('#state').textContent='Versi '+revision+' · '+(dirty?'Ada perubahan belum diterbitkan':'Konten sesuai publikasi terakhir'); }
 function changed(){dirty=true;status();}
 function el(tag,text,klass){const n=document.createElement(tag);if(text)n.textContent=text;if(klass)n.className=klass;return n;}
 function button(text,fn,klass){const b=el('button',text,klass);b.type='button';b.addEventListener('click',fn);return b;}
 async function task(fn){if(busy)return;busy=true;document.querySelectorAll('.toolbar button,#login-button,.history button').forEach(b=>b.disabled=true);try{await fn();}catch(e){notice(e.name==='AbortError'?'Koneksi terlalu lama. Coba lagi.':e.message,true);}finally{busy=false;document.querySelectorAll('.toolbar button,#login-button,.history button').forEach(b=>b.disabled=false);}}
 function safeUrl(value){return !value || (/^assets\/[\w./ -]+$/.test(value)&&!value.includes('..')) || (()=>{try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password;}catch(_){return false;}})();}
 function validate(data){
  if(!data.profile || !data.profile.name.trim())throw new Error('Nama profil wajib diisi.');
  for(const key of Object.keys(labels)){if(key==='profile')continue;if(!Array.isArray(data[key]))throw new Error('Data '+labels[key]+' harus berupa daftar.');}
  for(const key of ['systems','research']){const ids=new Set();for(const item of data[key]){if(!/^[a-zA-Z0-9_-]+$/.test(item.id)||ids.has(item.id))throw new Error('Kode '+labels[key]+' wajib unik dan hanya berisi huruf, angka, - atau _.');ids.add(item.id);if(!item.title.trim())throw new Error('Judul '+labels[key]+' wajib diisi.');}}
  function walk(obj){for(const [k,v] of Object.entries(obj)){if(urls.has(k)&&typeof v==='string'&&!safeUrl(v))throw new Error('Tautan '+k+' tidak valid. Gunakan https:// atau assets/.');if(v&&typeof v==='object')walk(v);}}
  walk(data);
  for(const s of data.systems){if(!Array.isArray(s.gallery)||!s.gallery.length)throw new Error('Sistem '+s.title+' membutuhkan minimal satu screenshot.');for(const g of s.gallery)if(!g.src)throw new Error('Gambar galeri '+s.title+' belum diisi.');if(s.documentationUrl){const u=new URL(s.documentationUrl);if(u.protocol!=='https:'||u.hostname!=='docs.google.com'||!u.pathname.startsWith('/document/'))throw new Error('Dokumentasi sistem harus berupa tautan Google Docs.');}}
  for(const r of data.research){if(!Array.isArray(r.authors)||!Array.isArray(r.supports))throw new Error('Penulis atau dokumen pendukung riset tidak valid.');}
 }
 function field(obj,key,label){
  const wrap=el('label',label);const array=Array.isArray(obj[key]);const long=array||['description','heroDescription','aboutDescription','summary','detail','focus','method','thesis'].includes(key);
  if(long)wrap.classList.add('wide');const input=el(long?'textarea':'input');input.value=array?obj[key].join('\n'):(obj[key]??'');
  if(!long)input.type='text';input.addEventListener('input',()=>{obj[key]=array?input.value.split('\n').map(v=>v.trim()).filter(Boolean):input.value;changed();});
  if(uploadKeys.has(key)){
   const row=el('div',null,'upload-row');row.append(input);const pick=el('input');pick.type='file';pick.accept='.png,.jpg,.jpeg,.webp,.pdf,.docx,.pptx';pick.hidden=true;
   const b=button('Unggah',()=>pick.click());pick.addEventListener('change',async()=>{if(!pick.files[0])return;b.disabled=true;try{const url=await NestCMS.upload(pick.files[0]);obj[key]=url;input.value=url;changed();notice('File berhasil diunggah. Terbitkan untuk memperbarui website.');}catch(e){notice(e.message,true);}finally{b.disabled=false;pick.value='';}});row.append(b,pick);wrap.append(row);
  }else wrap.append(input);
  return wrap;
 }
 function form(obj,schema){const grid=el('div',null,'fields');for(const [key,label] of Object.entries(schema))grid.append(field(obj,key,label));return grid;}
 function nestedEditor(item,key){
  if(!Array.isArray(item[key]))item[key]=[];const panel=el('div',null,'wide');panel.append(el('h3',key==='gallery'?'Screenshot galeri':'Dokumen pendukung'));
  item[key].forEach((obj,i)=>{const box=el('div',null,'nested');const head=el('div',null,'entry-head');head.append(el('h3',(key==='gallery'?'Screenshot ':'Dokumen ')+(i+1)));const actions=el('div',null,'entry-actions');actions.append(button('↑',()=>move(item[key],i,-1)),button('↓',()=>move(item[key],i,1)),button('Hapus',()=>{if(confirm('Hapus item ini dari draft?')){item[key].splice(i,1);changed();render();}},'danger'));head.append(actions);box.append(head,form(obj,nested[key]));panel.append(box);});
  panel.append(button(key==='gallery'?'+ Screenshot':'+ Dokumen pendukung',()=>{item[key].push(key==='gallery'?{src:'',caption:''}:{label:'',url:''});changed();render();}));return panel;
 }
 function move(list,index,delta){const next=index+delta;if(next<0||next>=list.length)return;[list[index],list[next]]=[list[next],list[index]];changed();render();}
 function newItem(key){const item={};for(const field of Object.keys(schemas[key]))item[field]='';if(key==='skills')item.items=[];if(key==='systems')Object.assign(item,{id:'system-'+Date.now(),gallery:[],accessType:'gallery',requiresLogin:null});if(key==='research')Object.assign(item,{id:'research-'+Date.now(),authors:[],supports:[],status:'Naskah riset akademik'});return item;}
 function render(){
  $('#section-title').textContent=labels[section];const editor=$('#editor');editor.replaceChildren();const stats=$('#stats');stats.replaceChildren();for(const [label,value] of [['Sistem',content.systems.length],['Riset',content.research.length],['Pengalaman',content.experience.length]]){const s=el('div',null,'stat');s.append(el('strong',String(value)),el('span',label));stats.append(s);}
  if(section==='profile'){const box=el('section',null,'entry');box.append(form(content.profile,schemas.profile));editor.append(box);}
  else{content[section].forEach((item,i)=>{const box=el('section',null,'entry');const head=el('div',null,'entry-head');head.append(el('h2',(i+1)+'. '+(item.title||item.role||item.level||'Item baru')));const actions=el('div',null,'entry-actions');actions.append(button('↑',()=>move(content[section],i,-1)),button('↓',()=>move(content[section],i,1)),button('Hapus',()=>{if(confirm('Hapus item ini dari draft? Perubahan berlaku setelah diterbitkan.')){content[section].splice(i,1);changed();render();}},'danger'));head.append(actions);box.append(head,form(item,schemas[section]));if(section==='systems')box.append(nestedEditor(item,'gallery'));if(section==='research')box.append(nestedEditor(item,'supports'));editor.append(box);});if(!content[section].length)editor.append(el('p','Belum ada item. Tambahkan konten pertama.', 'empty'));editor.append(button('+ Tambah '+labels[section],()=>{content[section].push(newItem(section));changed();render();}));}
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.key===section)));status();
 }
 async function history(){const select=$('#versions');select.replaceChildren();const rows=await NestCMS.history();for(const row of rows){const opt=el('option','Versi '+row.revision+' · '+new Date(row.created_at).toLocaleString('id-ID'));opt.value=row.id;select.append(opt);}if(!rows.length){const opt=el('option','Belum ada publikasi');opt.value='';select.append(opt);}}
 async function load(){const rows=await NestCMS.readAdmin();content=clone(rows[0]?.content||window.PORTFOLIO_DATA);revision=rows[0]?.revision||0;dirty=false;render();await history();if(!rows.length)notice('Konten dari website dimuat sebagai data awal. Periksa lalu tekan Terbitkan untuk mengaktifkan CMS.');}
 async function enter(){const user=await NestCMS.authorize();$('#user-email').textContent=user.email;$('#login').hidden=true;$('#dashboard').hidden=false;await load();}
 for(const [key,label] of Object.entries(labels)){const b=button(label,()=>{section=key;render();});b.dataset.key=key;$('#tabs').append(b);}
 $('#login-form').addEventListener('submit',e=>{e.preventDefault();task(async()=>{await NestCMS.login($('#email').value,$('#password').value);$('#password').value='';await enter();notice('Selamat datang, Nest.');});});
 $('#logout').addEventListener('click',()=>task(async()=>{if(dirty&&!confirm('Keluar dengan perubahan belum diterbitkan? Simpan draft terlebih dahulu jika diperlukan.'))return;await NestCMS.logout();location.reload();}));
 $('#publish').addEventListener('click',()=>task(async()=>{validate(content);if(!confirm('Terbitkan perubahan ini ke website publik?'))return;revision=await NestCMS.publish(content,revision);dirty=false;status();await history();notice('Versi '+revision+' berhasil diterbitkan. Muat ulang website untuk melihat perubahan.');}));
 $('#draft').addEventListener('click',()=>{try{localStorage.setItem(draftKey,JSON.stringify({content,date:new Date().toISOString(),revision}));notice('Draft tersimpan di browser ini. Belum tampil di website.');}catch(e){notice('Draft tidak dapat disimpan: '+e.message,true);}});
 $('#load-draft').addEventListener('click',()=>{try{const draft=JSON.parse(localStorage.getItem(draftKey)||'null');if(!draft)throw new Error('Belum ada draft di browser ini.');if(dirty&&!confirm('Ganti perubahan saat ini dengan draft tersimpan?'))return;validate(draft.content);content=clone(draft.content);changed();render();notice('Draft dibuka. Periksa sebelum menerbitkan.');}catch(e){notice(e.message,true);}});
 $('#reload').addEventListener('click',()=>task(async()=>{if(dirty&&!confirm('Buang perubahan belum diterbitkan dan muat konten terbaru?'))return;await load();notice('Konten terbaru dimuat.');}));
 $('#restore').addEventListener('click',()=>task(async()=>{if(!$('#versions').value)throw new Error('Belum ada versi tersimpan.');if(dirty&&!confirm('Ganti perubahan saat ini dengan versi yang dipilih?'))return;content=clone(await NestCMS.version($('#versions').value));changed();render();notice('Versi lama dibuka sebagai draft. Tekan Terbitkan untuk memulihkan.');}));
 $('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(content,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download='nest-portfolio-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 if(!NestCMS.configured()){$('#setup').hidden=false;$('#login-button').disabled=true;}else task(async()=>{try{await enter();}catch(_){$('#login').hidden=false;$('#dashboard').hidden=true;}});
})();
