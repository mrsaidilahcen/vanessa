(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Link checker (mockup only) ---------- */
  var NEW=['/soins/','/formations/en-ligne/','/calendrier-des-sessions/','/financement-opco/','/qualiopi/','/a-propos/','/avis/',
           '/mentions-legales/','/cgv/','/politique-de-confidentialite/','/cookies/'];
  var toast=document.querySelector('.toast'),tt;
  function show(msg){if(!toast)return;toast.innerHTML=msg;toast.hidden=false;clearTimeout(tt);tt=setTimeout(function(){toast.hidden=true},3600)}
  document.addEventListener('click',function(e){
    var a=e.target.closest('a,button');if(!a)return;
    if(a.dataset.toast){e.preventDefault();show(a.dataset.toast);return}
    var h=a.getAttribute('href');
    if(!h||a.closest('.review'))return;
    if(h==='/'){e.preventDefault();window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});return}
    if(h.charAt(0)==='/'){
      e.preventDefault();
      var isNew=NEW.some(function(p){return h.indexOf(p)===0});
      show('Lien prévu vers <b>'+h+'</b><br>'+(isNew?'Nouvelle page prévue dans l’arborescence du développeur.':'URL actuelle conservée (pas de redirection nécessaire).'));
      closeAll();
    }
  });

  /* ---------- Scrim ---------- */
  var scrim=document.createElement('div');scrim.className='scrim';document.body.appendChild(scrim);
  scrim.addEventListener('click',function(){closeMega()});

  /* ---------- Mega menu: hover intent, click, keyboard, live preview ---------- */
  var items=[].slice.call(document.querySelectorAll('.has-dd')),openT,closeT;
  function openMega(li){
    items.forEach(function(x){if(x!==li){x.classList.remove('open');x.querySelector('.dd-btn').setAttribute('aria-expanded','false')}});
    li.classList.add('open');li.querySelector('.dd-btn').setAttribute('aria-expanded','true');scrim.classList.add('on');
    li.querySelectorAll('img[loading=lazy]').forEach(function(i){i.loading='eager'});
  }
  function closeMega(){items.forEach(function(x){x.classList.remove('open');x.querySelector('.dd-btn').setAttribute('aria-expanded','false');resetFx(x)});scrim.classList.remove('on')}
  items.forEach(function(li){
    li.addEventListener('mouseenter',function(){clearTimeout(closeT);clearTimeout(openT);openT=setTimeout(function(){openMega(li)},90)});
    li.addEventListener('mouseleave',function(){clearTimeout(openT);closeT=setTimeout(closeMega,220)});
    li.querySelector('.dd-btn').addEventListener('click',function(){li.classList.contains('open')?closeMega():openMega(li)});
    li.addEventListener('focusin',function(){openMega(li)});
    li.addEventListener('focusout',function(e){if(!li.contains(e.relatedTarget))closeMega()});
    var fx=li.querySelector('.fx-img'),a=fx&&fx.querySelector('img'),b=fx&&fx.querySelector('.fx-b'),k=li.querySelector('.fx-k');
    li.querySelectorAll('.mg a[data-img]').forEach(function(l){
      function swap(){var src=l.getAttribute('data-img');if(!fx)return;
        var cur=fx.classList.contains('swap')?b:a,nxt=fx.classList.contains('swap')?a:b,url=cur.src.replace(/m-[a-z]+\.webp/,src+'.webp');
        if(cur.src.indexOf(src+'.webp')>-1){k.textContent=l.dataset.cap;return}
        nxt.src=url;fx.classList.toggle('swap');k.textContent=l.dataset.cap}
      l.addEventListener('mouseenter',swap);l.addEventListener('focus',swap);
    });
  });
  function resetFx(li){var k=li.querySelector('.fx-k');if(k)k.textContent=k.dataset.default}
  var hd=document.querySelector('.hd');

  /* ---------- Mobile menu ---------- */
  var m=document.getElementById('mnav'),burger=document.querySelector('.burger'),stage=m&&m.querySelector('.mn-stage');
  function openMenu(){m.hidden=false;document.body.style.overflow='hidden';burger.setAttribute('aria-expanded','true');
    requestAnimationFrame(function(){requestAnimationFrame(function(){m.classList.add('on')})});setTimeout(function(){m.querySelector('.mclose').focus()},300)}
  function closeMenu(){if(!m||m.hidden)return;m.classList.remove('on');document.body.style.overflow='';burger.setAttribute('aria-expanded','false');
    setTimeout(function(){m.hidden=true;backSub()},reduce?0:700)}
  function backSub(){if(!stage)return;stage.classList.remove('sub');stage.querySelectorAll('.mn-sub').forEach(function(s){s.classList.remove('on');setTimeout(function(){if(!s.classList.contains('on'))s.hidden=true},560)})}
  if(burger&&m){
    burger.addEventListener('click',openMenu);
    m.querySelector('.mclose').addEventListener('click',closeMenu);
    m.querySelectorAll('[data-sub]').forEach(function(b){b.addEventListener('click',function(){
      var s=document.getElementById(b.dataset.sub);s.hidden=false;requestAnimationFrame(function(){stage.classList.add('sub');s.classList.add('on');s.querySelector('.mn-back').focus()})})});
    m.querySelectorAll('.mn-back').forEach(function(b){b.addEventListener('click',backSub)});
  }

  /* ---------- Search ---------- */
  var sr=document.getElementById('srch');
  function openSearch(){sr.hidden=false;document.body.style.overflow='hidden';requestAnimationFrame(function(){requestAnimationFrame(function(){sr.classList.add('on');sr.querySelector('input').focus()})})}
  function closeSearch(){if(!sr||sr.hidden)return;sr.classList.remove('on');document.body.style.overflow='';setTimeout(function(){sr.hidden=true},400)}
  document.querySelectorAll('.js-search').forEach(function(b){b.addEventListener('click',openSearch)});
  if(sr){sr.querySelector('.srch-x').addEventListener('click',closeSearch);
    sr.querySelector('form').addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();var q=sr.querySelector('input').value.trim();
      show('Recherche « <b>'+(q||'…').replace(/</g,'&lt;')+'</b> » : résultats sur le gabarit <b>/?s=</b> prévu par le développeur.')})}

  function closeAll(){closeMega();closeMenu();closeSearch()}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});

  /* ---------- Forms (mockup) ---------- */
  document.querySelectorAll('main form, footer form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();show('Formulaire de démonstration : à relier à l’outil d’e-mailing choisi (Brevo, Mailchimp…) avec consentement RGPD.')})});

  /* ---------- Header state on scroll + parallax ---------- */
  var PX=['.hero-bg img','.wallimg img','.shop-band .bg img','.b-spa .ph img','.ch3 .ph img','.c-spa .ph img','.light-shop .bg img'];
  var pxEls=reduce?[]:[].slice.call(document.querySelectorAll(PX.join(',')));
  pxEls.forEach(function(el){el.setAttribute('data-px','');el.parentElement.style.overflow='hidden'});
  var ticking=false;
  function onScroll(){
    if(hd)hd.classList.toggle('scrolled',window.scrollY>40);
    var vh=innerHeight;
    pxEls.forEach(function(el){var r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
      var p=(r.top+r.height/2-vh/2)/vh;el.style.transform='translate3d(0,'+(p*-60).toFixed(1)+'px,0) scale(1.14)'});
    ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  onScroll();

  /* ---------- Reveal animations ---------- */
  if(reduce||!('IntersectionObserver' in window))return;
  root.classList.add('anim');
  try{
  var main=document.querySelector('main');
  // hero entrance
  var hero=main.querySelector('section');
  if(hero){
    var hs=[].slice.call(hero.querySelectorAll('.hero-copy>*, .hero-c>*, .hero-side>*, .hero-r, .hero-script'));
    var h1=hero.querySelector('h1');
    if(h1&&h1.children.length>1){var at=hs.indexOf(h1);hs.splice.apply(hs,[at<0?0:at,at<0?0:1].concat([].slice.call(h1.children)))}
    hs.forEach(function(el,i){el.classList.add('hi');el.style.setProperty('--d',(150+i*110)+'ms')});
    hero.querySelectorAll('.vanessa, .hero-vis img, .hero-l .vanessa').forEach(function(el){el.classList.add('hi-img');el.style.setProperty('--d','350ms')});
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('loaded')})});
    setTimeout(function(){hero.querySelectorAll('.hi,.hi-img').forEach(function(el){el.classList.add('done')})},3600);
  }
  // scroll reveals: images open like a curtain, cut-outs rise, text fades up with a short stagger
  var IMG='.ph, figure, .fx-photo, .about-ph, .jcard .jph, .card .ph, .fc .ph, .dcards figure',
      CUT='.vis, .kit, .hero-l',
      TXT='h2, h3, .eyebrow, .k, .cap, .sub, .num, p, .btn, .lnk, blockquote, details, li, .stats, .qualiopi, .qcard, .side-list, .chips a, .aside > *';
  var tagged=[];
  [].forEach.call(main.querySelectorAll(IMG+','+CUT+','+TXT),function(el){
    if(hero&&hero.contains(el))return;
    if(el.closest('.rv,.rv-img,.rv-cut,.marq,.no-rv'))return;
    if(el.matches(CUT)){el.classList.add('rv-cut')}
    else if(el.matches(IMG)){el.classList.add('rv-img');el.querySelectorAll('img[loading=lazy]').forEach(function(i){i.loading='eager'})}
    else{el.classList.add('rv');if(el.matches('h2'))el.classList.add('rv-h')}
    tagged.push(el);
  });
  // stagger among siblings
  var groups=new Map();
  tagged.forEach(function(el){var p=el.parentElement;var n=groups.get(p)||0;el.style.setProperty('--d',Math.min(n,7)*90+'ms');groups.set(p,n+1)});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;el.classList.add('is-in');io.unobserve(el);
    setTimeout(function(){el.classList.add('done')},2400+(parseInt(el.style.getPropertyValue('--d'))||0))}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  // clip-path hides curtain images from IntersectionObserver, so check them by position
  var curtains=[];
  tagged.forEach(function(el){if(el.classList.contains('rv-img'))curtains.push(el);else io.observe(el)});
  function checkCurtains(){var vh=innerHeight;curtains=curtains.filter(function(el){var r=el.getBoundingClientRect();
    if(r.top<vh*0.92&&r.bottom>0){el.classList.add('is-in');setTimeout(function(){el.classList.add('done')},2400+(parseInt(el.style.getPropertyValue('--d'))||0));return false}return true})}
  window.addEventListener('scroll',function(){requestAnimationFrame(checkCurtains)},{passive:true});
  window.addEventListener('resize',checkCurtains);
  setTimeout(checkCurtains,200);
  }catch(err){root.classList.remove('anim');console.warn(err)}
})();
