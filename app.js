'use strict';
(() => {
 const data=window.PORTFOLIO_DATA||{projects:[],photos:[]};
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>[...root.querySelectorAll(s)];
 const esc=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const menu=$('.menu-button'),nav=$('#primary-nav');
 function closeMenu(){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
 $$('.nav a').forEach(link=>link.addEventListener('click',closeMenu));
 document.addEventListener('click',ev=>{if(!ev.target.closest('.topbar'))closeMenu();});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape')closeMenu();});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if('IntersectionObserver' in window&&!reduced){const observer=new IntersectionObserver(items=>{items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('seen');observer.unobserve(item.target);}});},{threshold:.07});$$('.reveal').forEach(el=>observer.observe(el));}
 else $$('.reveal').forEach(el=>el.classList.add('seen'));
 let ticking=false;
 function progress(){const height=document.documentElement.scrollHeight-window.innerHeight;$('.progress').style.width=`${height>0?Math.max(0,Math.min(100,window.scrollY/height*100)):0}%`;ticking=false;}
 window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true;}},{passive:true});window.addEventListener('resize',progress);progress();
 let toastTimer;
 function toast(message){const el=$('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2400);}
 $$('.copy-email').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('adhikaracn1235@gmail.com');toast('Email copied. Let’s talk.');}catch{toast('Email: adhikaracn1235@gmail.com');}}));
 function filter(kind,buttons,cards){const count=$(`#${kind}-count`);function apply(value){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[`filter${kind[0].toUpperCase()+kind.slice(1)}`]===value)));cards.forEach(c=>{c.hidden=value!=='all'&&c.dataset.category!==value;if(!c.hidden)c.classList.add('seen');});const n=cards.filter(c=>!c.hidden).length;if(count)count.textContent=`${String(n).padStart(2,'0')} ${kind==='photos'?'photographs':'projects'}`;progress();}buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset[`filter${kind[0].toUpperCase()+kind.slice(1)}`])));apply('all');}
 if($('[data-filter-projects]'))filter('projects',$$('[data-filter-projects]'),$$('.project-card'));
 if($('[data-filter-photos]'))filter('photos',$$('[data-filter-photos]'),$$('.gallery-item'));
 const extraProjects=[
  {id:'hint-gmv',title:'Product GMV Max: orders & CPO',label:'HINT / TikTok Ads',categoryLabel:'Campaign reporting',context:'Product GMV Max is one part of the wider TikTok conversion activity. The comparison uses campaign spend, orders and attributed GMV within that scope.',role:'Within the wider HINT work, my contribution includes performance reviews, budget decisions and creative requests. The figures here describe campaign totals.',actions:['Read campaign spend and orders together.','Calculate CPO as campaign spend divided by campaign orders.','Keep Product GMV Max separate from the wider conversion reporting total.'],takeaway:'More orders and lower cost per order need to be read within the same campaign scope; adding this spend to the conversion total would double count part of the activity.',metrics:[['~20%','More orders / September vs July'],['30–35%','Lower calculated CPO / September vs July'],['700–900','Monthly campaign orders / July–September']],note:'Rounded from July–September 2026 campaign reports. These are aggregate campaign outcomes, not an individual creative result.'},
  {id:'hint-shopee',title:'Shopee: efficiency & sales volume',label:'HINT / Shopee Insite',categoryLabel:'Performance interpretation',context:'The August comparison recorded higher ROAS alongside lower GMV and fewer items sold. An efficiency improvement did not describe the full sales-volume result.',role:'My wider HINT work includes performance reviews, delivery decisions and creative requests. I read spend, attributed GMV and ROAS together.',actions:['Review ROAS alongside the level of spend and attributed GMV.','Keep items sold separate from orders when reading the source report.','Discuss the sales-volume result alongside the efficiency result.'],takeaway:'A higher ROAS can coexist with lower sales volume. I keep both parts in view when discussing the campaign result.',metrics:[['11–13x','Reported ROAS range / July–September'],['~10%','Higher August ROAS / vs July'],['10–15%','Lower August Ad GMV / vs July']],note:'Rounded from 2026 Shopee Insite reporting. GMV is attributed sales value, not net profit; no monetary values or raw data table are shown.'}
 ];
 const projectDialog=$('#project-dialog');
 function openProject(id){const p=[...data.projects,...extraProjects].find(p=>p.id===id);if(!p)return;
  const image=p.image?`<img class="dialog-image" src="assets/${esc(p.image)}" alt="${esc(p.alt)}">`:'';
  const metricHtml=p.metrics?`<div class="dialog-metrics">${p.metrics.map(([value,label])=>`<div><strong>${esc(value)}</strong><p>${esc(label)}</p></div>`).join('')}</div>`:'';
  const gallery=p.gallery?.length>1?`<div class="frame-grid">${p.gallery.map((src,i)=>`<button class="creative-card" data-gallery-image="${esc(src)}" data-gallery-project="${esc(p.id)}" aria-label="Open ${esc(p.title)} example ${i+1}"><img src="assets/${esc(src)}" alt="${esc(p.title)} visual example ${i+1}"></button>`).join('')}</div>`:'';
  const link=p.link?`<a class="text-link" href="${esc(p.link)}" ${/^https:/.test(p.link)?'target="_blank" rel="noopener noreferrer"':''}>${p.link.includes('instagram.com')?'Visit brand profile':p.link==='https://adhikaracn.my.canva.site/'?'Open original portfolio':'Explore the full case'} <span>↗</span></a>`:'';
  $('#project-dialog-body').innerHTML=`<div class="eyebrow">${esc(p.label)}</div><h2 id="project-dialog-title">${esc(p.title)}</h2><p>${esc(p.context)}</p>${image}<div class="dialog-story"><div><h3>My part in the work.</h3><p>${esc(p.role)}</p></div><div><h3>What I worked on.</h3><ul>${p.actions.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div></div>${metricHtml}<p><strong>What I took from it.</strong><br>${esc(p.takeaway)}</p>${p.note?`<p class="case-note">${esc(p.note)}</p>`:''}${gallery}${link}`;
  projectDialog.showModal();projectDialog.scrollTop=0;
  $$('[data-gallery-image]',projectDialog).forEach(button=>button.addEventListener('click',()=>{const project=data.projects.find(p=>p.id===button.dataset.galleryProject);activePhotos=project.gallery.map((src,i)=>({id:src,src,title:project.title,alt:`${project.title} visual example ${i+1}`,category:'Project visual',context:project.label}));showPhoto(activePhotos.findIndex(p=>p.id===button.dataset.galleryImage));}));
 }
 $$('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project)));
 const lightbox=$('#lightbox');let activePhotos=[],activeIndex=0;
 function photoSrc(p){return p.src||`${p.id}.webp`;}
 function showPhoto(index){if(!activePhotos.length)return;activeIndex=(index+activePhotos.length)%activePhotos.length;const p=activePhotos[activeIndex];$('#lightbox-picture').src='assets/'+photoSrc(p);$('#lightbox-picture').alt=p.alt;$('#lightbox-title').textContent=p.title;$('#lightbox-description').textContent=[p.category,p.context].filter(Boolean).join(' / ');$('#lightbox-counter').textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(activePhotos.length).padStart(2,'0')} · Selected frame`;$('#previous-photo').hidden=activePhotos.length<2;$('#next-photo').hidden=activePhotos.length<2;if(!lightbox.open)lightbox.showModal();}
 $$('[data-photo]').forEach(button=>button.addEventListener('click',()=>{activePhotos=$$('[data-photo]').filter(b=>!b.hidden).map(b=>data.photos.find(p=>p.id===b.dataset.photo)).filter(Boolean);showPhoto(activePhotos.findIndex(p=>p.id===button.dataset.photo));}));
 $('#previous-photo')?.addEventListener('click',()=>showPhoto(activeIndex-1));$('#next-photo')?.addEventListener('click',()=>showPhoto(activeIndex+1));
 lightbox?.addEventListener('keydown',ev=>{if(ev.key==='ArrowRight'){ev.preventDefault();showPhoto(activeIndex+1);}if(ev.key==='ArrowLeft'){ev.preventDefault();showPhoto(activeIndex-1);}});
 const mediaDialog=$('#media-dialog');
 $$('[data-local-video]').forEach(button=>button.addEventListener('click',()=>{const file=button.dataset.localVideo;$('#media-dialog-title').textContent=button.dataset.videoTitle;$('#media-dialog-body').innerHTML=`<video src="assets/${esc(file)}" controls playsinline preload="metadata" poster="assets/${esc(file.replace('.mp4','.webp'))}" aria-label="${esc(button.dataset.videoTitle)}"></video><p>${esc(button.dataset.videoNote)}</p>`;mediaDialog.showModal();}));
 mediaDialog?.addEventListener('close',()=>{const video=$('video',mediaDialog);video?.pause();$('#media-dialog-body').innerHTML='';});
 $$('dialog').forEach(dialog=>{$('.close-dialog',dialog)?.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',ev=>{if(ev.target===dialog){const rect=dialog.getBoundingClientRect();if(ev.clientX<rect.left||ev.clientX>rect.right||ev.clientY<rect.top||ev.clientY>rect.bottom)dialog.close();}});});
 // A screen reader receives a stable, readable heading; motion is only decorative.
 window.addEventListener('pageshow',()=>{$$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('seen');});});
})();
