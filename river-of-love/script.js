/* River of My Love — interaction + animations (respects prefers-reduced-motion)
   - Tease overlay reveals the content on first click (user gesture enables audio)
   - SVG waves animated via CSS transforms
   - Floating hearts on canvas
   - IntersectionObserver triggers gentle fade-ins
   - Share button uses Web Share API when available
*/
(function(){
  // short helpers
  const $ = sel => document.querySelector(sel);
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elements
  const tease = $('#tease');
  const app = $('#app');
  const bg = $('#bg');
  const muteBtn = $('#mute');
  const shareBtn = $('#share');
  const replay = $('#replay');
  const heartsCanvas = document.getElementById('hearts');

  // Reveal function (called on user gesture)
  function reveal(startMusic = true){
    if(!app) return;
    // announce
    tease.setAttribute('aria-hidden','true');
    tease.style.opacity = '0';
    setTimeout(()=> tease.style.display = 'none', 600);
    app.hidden = false;
    // small entrance
    document.body.style.background = 'linear-gradient(180deg,#fff7f2,#eaf8ff)';
    // optionally start music (user gesture required for sound)
    if(startMusic && bg){
      bg.currentTime = 0;
      bg.play().catch(()=>{});
      muteBtn.setAttribute('aria-pressed','false');
    }
    // start particles
    if(!prefersReduce) startHearts();
    // animate waves (CSS handled)
    window.requestAnimationFrame(()=> initObservers());
  }

  // bind teaser
  ['click','keydown'].forEach(evt => tease.addEventListener(evt, (e)=>{
    if(evt === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    reveal(true);
  }));

  /*
   Enhanced audio handling
   - remember when the user explicitly started playback (userPlayed)
   - attempt to resume when the page becomes visible again (best-effort; browsers may suspend in background)
   - provide an extra touchstart fallback to resume audio after external navigation back to the tab
  */
  let userPlayed = false;
  function markUserPlayed(){ userPlayed = true; if(bg) bg.setAttribute('data-user-played','1'); }

  // mute / play toggle (improved UX + state tracking)
  muteBtn && muteBtn.addEventListener('click', ()=>{
    if(!bg) return;
    if(bg.paused){
      bg.play().then(()=> markUserPlayed()).catch(()=>{});
      muteBtn.setAttribute('aria-pressed','false');
    } else {
      bg.pause();
      muteBtn.setAttribute('aria-pressed','true');
    }
  });

  // resume audio when returning to the page if the user already started playback (best-effort)
  document.addEventListener('visibilitychange', ()=>{
    try{
      if(document.visibilityState === 'visible'){
        if(bg && (userPlayed || bg.getAttribute('data-user-played')==='1')){
          bg.play().catch(()=>{});
        }
      }
    }catch(e){}
  });

  // mobile: try resuming on the next user touch if audio was previously started
  ['touchstart','pointerdown','click'].forEach(ev => document.addEventListener(ev, function _tryResumeOnGesture(){
    if(!bg) return document.removeEventListener(ev, _tryResumeOnGesture);
    if((userPlayed || bg.getAttribute('data-user-played')==='1') && bg.paused){ bg.play().catch(()=>{}); }
    document.removeEventListener(ev, _tryResumeOnGesture);
  }, { passive: true }));

  // share
  shareBtn && shareBtn.addEventListener('click', async ()=>{
    const shareData = { title: document.title, text: 'A little surprise — open to reveal', url: location.href };
    if(navigator.share){
      try{ await navigator.share(shareData); }catch(e){}
      return;
    }
    // fallback: copy link
    try{ await navigator.clipboard.writeText(location.href); alert('Link copied — send it to them ✨'); }catch(e){ prompt('Copy this link:', location.href); }
  });

  // replay
  replay && replay.addEventListener('click', ()=>{
    // quick scroll to top + replay subtle animations
    window.scrollTo({ top: 0, behavior: prefersReduce ? 'auto' : 'smooth' });
    if(bg){ bg.currentTime = 0; bg.play().then(()=> markUserPlayed()).catch(()=>{}); }
    // re-run observers
    document.querySelectorAll('[data-animate]').forEach(el=> el.classList.remove('in'));
    setTimeout(()=> initObservers(), 200);
  });

  /*
   Safety: prevent any accidental automatic navigation to the Questions page
   (there were no auto-redirects here previously; this guard only blocks unexpected programmatic navigation)
  */
  (function preventUnexpectedQuestionsRedirect(){
    const originalAssign = location.assign.bind(location);
    const originalReplace = location.replace.bind(location);
    const shouldBlock = url => typeof url === 'string' && url.indexOf('questions.html') > -1;
    location.assign = function(u){ if(shouldBlock(u)) return console.warn('Blocked unexpected navigation to', u); return originalAssign(u); };
    location.replace = function(u){ if(shouldBlock(u)) return console.warn('Blocked unexpected navigation to', u); return originalReplace(u); };
    const pushState = history.pushState.bind(history);
    history.pushState = function(s,title,u){ if(shouldBlock(u)) return console.warn('Blocked history.pushState ->', u); return pushState(s,title,u); };
  })();

  /* -------------------- fade-in on scroll -------------------- */
  function initObservers(){
    const els = document.querySelectorAll('[data-animate]');
    if(prefersReduce){ els.forEach(e=> e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el=> io.observe(el));
  }

  /* -------------------- hearts canvas -------------------- */
  function startHearts(){
    if(!heartsCanvas) return;
    const ctx = heartsCanvas.getContext('2d');
    let W = heartsCanvas.width = heartsCanvas.clientWidth || innerWidth;
    let H = heartsCanvas.height = heartsCanvas.clientHeight || innerHeight;
    const colors = ['#ffd1d1','#ffd9c7','#ffe8d6','#cfe9ff','#ffd1ec'];
    function rand(a,b){ return Math.random()*(b-a)+a; }
    let hearts = [];
    function make(){ return { x: rand(0,W), y: rand(-H,0), r: rand(6,26), vx: rand(-0.3,0.6), vy: rand(0.4,1.6), c: colors[(Math.random()*colors.length)|0], a: rand(0.6,1), s: rand(-0.04,0.04) }; }
    for(let i=0;i<18;i++) hearts.push(make());
    window.addEventListener('resize', ()=>{ W = heartsCanvas.width = heartsCanvas.clientWidth || innerWidth; H = heartsCanvas.height = heartsCanvas.clientHeight || innerHeight; });
    function drawHeart(x,y,r,color,alpha,rot){
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.scale(r/36,r/36);
      ctx.beginPath(); ctx.moveTo(0,-12); ctx.bezierCurveTo(12,-28,36,-6,0,18); ctx.bezierCurveTo(-36,-6,-12,-28,0,-12); ctx.closePath(); ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.fill(); ctx.restore();
    }
    function loop(){
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<hearts.length;i++){
        const h = hearts[i];
        h.y += h.vy; h.x += Math.sin((h.y+i)/30)*1.6 + h.vx; h.r += Math.sin(h.y/40)*0.02; h.a = Math.max(0.18, h.a - 0.0006);
        drawHeart(h.x,h.y,h.r,h.c,h.a, h.s);
        if(h.y > H+40) hearts[i] = make();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* -------------------- gentle wave motion (CSS) -------------------- */
  // add a CSS-driven loop by toggling a class that animates transform via keyframes in CSS (declared inline)
  (function addWaveKeyframes(){
    if(prefersReduce) return;
    const style = document.createElement('style'); style.textContent = `@keyframes sway{0%{transform:translateX(-2%) translateY(0) }50%{transform:translateX(2%) translateY(-6px)}100%{transform:translateX(-2%) translateY(0)} } .wave{animation:sway 8s ease-in-out infinite}`;
    document.head.appendChild(style);
  })();

  /* -------------------- auto-reveal for demo if query present -------------------- */
  if(location.search.indexOf('open=1')>-1) setTimeout(()=> reveal(false), 420);

  // expose for debugging
  window._romance = { reveal };
})();
