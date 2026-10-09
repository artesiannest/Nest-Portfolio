(async function () {
  'use strict';
  if (window.NestCMS && NestCMS.configured()) {
    try { const rows=await NestCMS.readPublic(); if(rows[0] && rows[0].content) window.PORTFOLIO_DATA=rows[0].content; }
    catch(error) { console.warn('CMS tidak tersedia; website memakai data cadangan.',error.message); }
  }
  // Jalankan script tampilan setelah konten selesai dimuat.
  for(const path of ['js/main.js','js/room.js']) {
    await new Promise(resolve=>{const s=document.createElement('script');s.src=path;s.onload=resolve;s.onerror=resolve;document.body.appendChild(s);});
  }
  const data=window.PORTFOLIO_DATA;
  if(data) {
    const count=data.systems.length;
    const previews=data.systems.reduce((total,s)=>total+s.gallery.length,0);
    const board=document.querySelector('#board-hotspot small');
    if(board) board.textContent=count+' sistem · '+previews+' tampilan';
    const research=document.querySelector('#research-hotspot small');
    if(research) research.textContent=data.research.length+' riset akademik';
  }
})();
