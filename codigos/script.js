
(function(){
var hero=document.getElementById('home'),cv=document.getElementById('cv'),cx=cv.getContext('2d'),bowl=document.getElementById('bowl');
var SRC=["images/kibble.png", "images/kibble-2.png", "images/kibble-3.png", "images/kibble-4.png", "images/kibble-5.png", "images/kibble-6.png", "images/kibble-7.png", "images/kibble-8.png", "images/kibble-9.png", "images/kibble-10.png", "images/kibble-11.png", "images/kibble-12.png"],IM=[],W=0,H=0,mx=-999,my=-999,P=[],MAX=70,last=0,dpr=Math.min(devicePixelRatio||1,2);
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){var r=hero.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
function spawn(){var h=hero.getBoundingClientRect(),b=bowl.getBoundingClientRect();return{x:b.left-h.left+b.width*.34,y:b.top-h.top+b.height*.28}}
function mk(x,y,vx,vy){return{x:x,y:y,vx:vx,vy:vy,r:Math.random()*6.28,vr:(Math.random()-.5)*.09,s:.75+Math.random()*.7,i:Math.random()*IM.length|0}}
function pour(){var s=spawn();return mk(s.x+(Math.random()-.5)*30,s.y,-(.6+Math.random()*1.8),-(1.4+Math.random()*2.4))}
function burst(x,y){for(var i=0;i<7;i++){var a=Math.random()*6.28,v=2+Math.random()*3;P.push(mk(x,y,Math.cos(a)*v,Math.sin(a)*v-1.5))}while(P.length>MAX)P.shift()}
function draw(p){var im=IM[p.i],w=54*p.s,h=w*im.naturalHeight/im.naturalWidth;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.drawImage(im,-w/2,-h/2,w,h);cx.restore()}
function frame(t){var dt=Math.min((t-last)/16.7||1,2.5);last=t;cx.clearRect(0,0,W,H);
 for(var k=0;k<P.length;k++){var p=P[k];p.vy+=.03*dt;p.vx*=.996;
  var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);
  if(d<130&&d>1){var f=(130-d)/130*1.8*dt;p.vx+=dx/d*f;p.vy+=dy/d*f}
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
  if(p.y>H+90||p.x<-90||p.x>W+90){P.splice(k,1);k--;continue}
  draw(p)}
 requestAnimationFrame(frame)}
function start(){size();
 if(reduce){for(var i=0;i<40;i++)P.push(mk(Math.random()*W,Math.random()*H,0,0));P.forEach(draw);return}
 setTimeout(function(){var n=0,iv=setInterval(function(){P.push(pour());if(++n>=10)clearInterval(iv)},550)},1700);
 setInterval(function(){if(P.length<14&&!document.hidden&&scrollY<innerHeight*.6)P.push(pour())},1800);
 requestAnimationFrame(frame)}
var loaded=0;SRC.forEach(function(s){var i=new Image();i.onload=function(){if(++loaded==SRC.length)start()};i.src=s;IM.push(i)});
addEventListener('resize',size);
// Mouse, clic y cursor de pata
var pata=document.getElementById('cursor-pata'),dn=false;
function pm(e){pata.style.transform='translate('+e.clientX+'px,'+e.clientY+'px) translate(-50%,-50%) scale('+(dn?.85:1)+')'}
addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;
 if(e.pointerType==='mouse'){pata.style.opacity=1;document.documentElement.classList.add('pata-activa');pm(e)}});
addEventListener('pointerdown',function(e){var r=hero.getBoundingClientRect();dn=true;pata.classList.add('presionada');pm(e);
 if(e.clientY>=r.top&&e.clientY<=r.bottom&&!reduce)burst(e.clientX-r.left,e.clientY-r.top)});
addEventListener('pointerup',function(e){dn=false;pata.classList.remove('presionada');pm(e);mx=my=-999});
document.addEventListener('mouseleave',function(){pata.style.opacity=0;mx=my=-999});
// Páginas: Contact y Privacy Policy se abren como página aparte
var curPg='home';
function pourSome(n){var k=0;clearInterval(iv2);iv2=setInterval(function(){P.push(pour());while(P.length>MAX)P.shift();if(++k>=n)clearInterval(iv2)},420)}
function route(){var h=location.hash;var pg={'#contact':'contact','#privacy':'privacy','#about':'about','#functions':'functions','#login':'login'}[h]||'home',was=curPg;
 document.body.dataset.page=pg;curPg=pg;document.body.classList.remove('pgfade');void document.body.offsetWidth;document.body.classList.add('pgfade');
 if(pg!=='home'){scrollTo(0,0);return}
 requestAnimationFrame(function(){size();var t=h&&h.length>1&&h!=='#home'?document.querySelector(h):null;if(t){t.scrollIntoView()}else{scrollTo(0,0)}
  if(was!=='home'&&!reduce){P.length=0;pourSome(12)}})}
addEventListener('hashchange',route);route();
// Escena del gato: el pin cae sobre el gato, el gato rebota y el pin viaja al mapa dejando huellitas
var road=document.getElementById('road'),rcat=document.getElementById('rcat'),rmap=document.getElementById('rmap'),rpin=document.getElementById('rpin'),rtrail=document.getElementById('rtrail');
var PAWSVG='<svg viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="5.2" ry="4.4"/><ellipse cx="5.2" cy="10.2" rx="2.2" ry="2.8"/><ellipse cx="9.3" cy="6" rx="2.2" ry="2.9"/><ellipse cx="14.7" cy="6" rx="2.2" ry="2.9"/><ellipse cx="18.8" cy="10.2" rx="2.2" ry="2.8"/></svg>';
var NPAW=11,rpaws=[];for(var i=0;i<NPAW;i++){var pw=document.createElement('span');pw.className='r-paw';pw.innerHTML=PAWSVG;rtrail.appendChild(pw);rpaws.push(pw)}
var catHit=false;
function seg(m,a,b){return Math.max(0,Math.min(1,(m-a)/(b-a)))}
function ease(x){return x*x*(3-2*x)}
function ebounce(x){var n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375}
function bez(a,b,c,t){var u=1-t;return u*u*a+2*u*t*b+t*t*c}
function roadUpdate(){var r=road.getBoundingClientRect();if(!r.height)return;var m=Math.max(0,Math.min(1,-r.top/(r.height-innerHeight))),
 a=seg(m,0,.12),d=seg(m,.14,.34),k=ease(seg(m,.5,.78)),k2=ease(seg(m,.56,.84)),t=seg(m,.86,.97),st=road.style;
 st.setProperty('--a',a.toFixed(3));st.setProperty('--k',k.toFixed(3));st.setProperty('--t',t.toFixed(3));st.setProperty('--m',m.toFixed(4));
 // el gato rebota cuando el pin le cae en la cabeza
 if(d>.37&&!catHit){catHit=true;rcat.classList.remove('boing');void rcat.offsetWidth;rcat.classList.add('boing')}else if(d<.2)catHit=false;
 road.classList.toggle('land',k2>=.999);
 var rb=road.querySelector('.road-in').getBoundingClientRect(),rc=rcat.getBoundingClientRect(),rm=rmap.getBoundingClientRect(),S=Math.min(innerHeight*.18,innerWidth*.15),
  px0=rc.left+rc.width*.5-rb.left,py0=rc.top+rc.height*.05-rb.top,drop=-(1-ebounce(d))*(py0+S*1.4),px1=rm.left+rm.width*.39-rb.left,py1=rm.top+rm.height*.52-rb.top,
  cx=(px0+px1)/2,cy=Math.max(py0,py1)+innerHeight*.16,
  tx=bez(px0,cx,px1,k2),ty=bez(py0,cy,py1,k2)+drop*(1-k2),sc=1-.3*k2;
 rpin.style.width=S+'px';rpin.style.height=(S*1.3)+'px';rpin.style.opacity=d>0?1:0;
 rpin.style.transform='translate('+(tx-S/2).toFixed(1)+'px,'+(ty-S*1.3).toFixed(1)+'px) scale('+sc.toFixed(3)+') rotate('+(Math.sin(k2*Math.PI)*-14).toFixed(1)+'deg)';
 // huellitas detras del pin, siguiendo la misma curva
 for(var i=0;i<NPAW;i++){var f=(i+.6)/(NPAW+1),x=bez(px0,cx,px1,f),y=bez(py0,cy,py1,f)-S*.2,
   dx=2*(1-f)*(cx-px0)+2*f*(px1-cx),dy=2*(1-f)*(cy-py0)+2*f*(py1-cy),ang=Math.atan2(dy,dx),side=(i%2?1:-1)*12;
   x+=Math.cos(ang+Math.PI/2)*side;y+=Math.sin(ang+Math.PI/2)*side;
   rpaws[i].style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+(ang*180/Math.PI+90).toFixed(1)+'deg)';
   rpaws[i].classList.toggle('on',k2>f+.02&&k2<.999||(k2>=.999&&t<.5))}}
addEventListener('scroll',roadUpdate,{passive:true});addEventListener('resize',roadUpdate);setTimeout(roadUpdate,300);
// Pet Moments: album de polaroids que se pueden arrastrar, abrir y subir tu propia foto
var mo=document.getElementById('moments'),board=document.getElementById('board'),molb=document.getElementById('molb'),zTop=10;
var moIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){mo.classList.add('in');moIO.disconnect()}})},{threshold:.25});moIO.observe(mo);
function bigScreen(){return innerWidth>760}
function openLB(el){var im=el.querySelector('img'),cap=el.querySelector('figcaption');if(!im)return;
 molb.querySelector('img').src=im.src;molb.querySelector('img').alt=im.alt;molb.querySelector('figcaption').innerHTML=cap?cap.innerHTML:'';
 molb.classList.add('on');molb.setAttribute('aria-hidden','false')}
function closeLB(){molb.classList.remove('on');molb.setAttribute('aria-hidden','true')}
molb.addEventListener('click',closeLB);addEventListener('keydown',function(e){if(e.key==='Escape')closeLB()});
function tapCard(el){if(el.classList.contains('add')){el.querySelector('input').click()}else if(el.classList.contains('pol')){openLB(el)}}
[].forEach.call(board.querySelectorAll('.pol,.stk'),function(el){
 var sx=0,sy=0,ox=0,oy=0,down=false,moved=false;
 el.addEventListener('pointerdown',function(e){if(e.button>0)return;down=true;moved=false;sx=e.clientX;sy=e.clientY;
  if(!bigScreen())return;
  ox=el.offsetLeft;oy=el.offsetTop;el.style.zIndex=++zTop;el.style.animation='none';el.style.opacity=1;
  try{el.setPointerCapture(e.pointerId)}catch(err){}e.preventDefault()});
 el.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx,dy=e.clientY-sy;
  if(Math.abs(dx)+Math.abs(dy)>5){moved=true;el.classList.add('drag')}
  if(!bigScreen()||!moved)return;
  var bw=board.clientWidth,bh=board.clientHeight,x=Math.max(-30,Math.min(bw-el.offsetWidth+30,ox+dx)),y=Math.max(-30,Math.min(bh-el.offsetHeight+30,oy+dy));
  el.style.left=(x/bw*100)+'%';el.style.top=(y/bh*100)+'%'});
 function end(){if(!down)return;down=false;el.classList.remove('drag');if(!moved)tapCard(el)}
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',function(){down=false;el.classList.remove('drag')});
 el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tapCard(el)}});
});
// "Add your moment": sube una foto desde tu dispositivo (solo se ve en tu navegador)
var addCard=board.querySelector('.pol.add');
if(addCard){addCard.querySelector('input').addEventListener('change',function(){var fl=this.files&&this.files[0];if(!fl)return;
 var ph=addCard.querySelector('.add-ph'),im=document.createElement('img');im.src=URL.createObjectURL(fl);im.alt='Your pet';im.draggable=false;
 ph.parentNode.replaceChild(im,ph);addCard.querySelector('figcaption').innerHTML='My best friend<span>a new moment</span>';addCard.classList.remove('add')})}

// Every high five counts: al tocar, la mano y la patita chocan y salen corazones
var h5=document.getElementById('h5'),h5n=document.getElementById('h5n'),h5c=12480;
var HEART='<svg viewBox="0 0 24 24"><path d="M12 21.4l-1.5-1.3C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.6L12 21.4z"/></svg>';
var PAW='<svg viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="5.2" ry="4.4"/><ellipse cx="5.2" cy="10.2" rx="2.2" ry="2.8"/><ellipse cx="9.3" cy="6" rx="2.2" ry="2.9"/><ellipse cx="14.7" cy="6" rx="2.2" ry="2.9"/><ellipse cx="18.8" cy="10.2" rx="2.2" ry="2.8"/></svg>';
var COLS=['#ffffff','#2bd3e3','#c9bff0','#ff8fb1','#8268d5'];
function highFive(){h5.classList.remove('hit');void h5.offsetWidth;h5.classList.add('hit');
 h5c++;h5n.textContent=h5c.toLocaleString('en-US');h5n.classList.remove('pop');void h5n.offsetWidth;h5n.classList.add('pop');
 if(reduce)return;
 for(var i=0;i<12;i++){var p=document.createElement('span'),a=Math.random()*Math.PI*2,d=90+Math.random()*120;
  p.className='h5-p';p.innerHTML=Math.random()<.65?HEART:PAW;
  p.style.cssText='--s:'+(14+Math.random()*20).toFixed(0)+'px;--c:'+COLS[i%COLS.length]+';--tx:'+(Math.cos(a)*d).toFixed(0)+'px;--ty:'+(Math.sin(a)*d-40).toFixed(0)+'px;--rt:'+((Math.random()-.5)*120).toFixed(0)+'deg';
  h5.appendChild(p);setTimeout(function(x){return function(){x.remove()}}(p),1000)}}
h5.addEventListener('click',highFive);
var h5IO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){setTimeout(highFive,700);h5IO.disconnect()}})},{threshold:.6});h5IO.observe(h5);

// Contadores de la seccion Raised
function cnt(el){var to=+el.dataset.to,dc=+el.dataset.d||0,s0=performance.now();(function f(n){var k=Math.min((n-s0)/1400,1);el.textContent=(to*(1-Math.pow(1-k,3))).toFixed(dc);if(k<1)requestAnimationFrame(f)})(s0)}
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cnt(e.target);cio.unobserve(e.target)}})});document.querySelectorAll('[data-to]').forEach(function(e){cio.observe(e)});
// Titular de Raised: las lineas se deslizan a los lados al bajar
var rls=[].slice.call(document.querySelectorAll('.rline'));
function rlUpdate(){var sct=document.getElementById('intro'),r=sct.getBoundingClientRect();if(!r.height)return;var m=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)))-.5;rls.forEach(function(l,i){l.style.translate=(m*(i%2?1:-1)*9*(1+i*.12)).toFixed(2)+'vw 0'})}
addEventListener('scroll',rlUpdate,{passive:true});rlUpdate();
// Cargando (gato) y pagina de login (el gato sigue el cursor)
function showLoad(ms){var l=document.getElementById('loader');if(!l)return;l.classList.add('on');clearTimeout(window._lt);window._lt=setTimeout(function(){l.classList.remove('on');document.body.classList.add('ready')},ms)}
function hideLoad(){var l=document.getElementById('loader');if(l)l.classList.remove('on');document.body.classList.add('ready')}
document.body.classList.add('ready');
var lcat=document.getElementById('lcat'),lhead=document.getElementById('lhead'),pps=[].slice.call(document.querySelectorAll('.pp'));
addEventListener('pointermove',function(e){if(curPg!=='login'||!lcat)return;var r=lcat.getBoundingClientRect(),cx=r.left+r.width*.5,cy=r.top+r.height*.4;
 var ax=Math.max(-1,Math.min(1,(e.clientX-cx)/(innerWidth*.4))),ay=Math.max(-1,Math.min(1,(e.clientY-cy)/(innerHeight*.4)));
 lhead.style.transform='translate('+(ax*14).toFixed(1)+'px,'+(ay*8).toFixed(1)+'px) rotate('+(ax*7).toFixed(1)+'deg)';
 pps.forEach(function(q){q.style.transform='translate('+(ax*8).toFixed(1)+'px,'+(ay*6).toFixed(1)+'px)'})});
var lf=document.getElementById('lf');
[].forEach.call(lf.querySelectorAll('.tabs button'),function(b){b.addEventListener('click',function(){[].forEach.call(lf.querySelectorAll('.tabs button'),function(x){x.classList.toggle('on',x===b)});lf.classList.toggle('up',b.dataset.t==='up');document.getElementById('lgo').textContent=b.dataset.t==='up'?'Create account':'Log in'})});
lf.addEventListener('submit',function(e){e.preventDefault();lf.classList.add('loading');setTimeout(function(){lf.classList.remove('loading');location.hash='#home'},2400)});
document.querySelectorAll('.clip,.pa-art').forEach(function(el){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){el.classList.add('in');o.disconnect()}},{threshold:.3}).observe(el)});
// Resto de la página
document.documentElement.classList.add('js');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
var dv=document.getElementById('days'),hh='';['M','T','W','T','F','S','S'].forEach(function(l){hh+='<span style="opacity:.5">'+l+'</span>'});
for(var i=0;i<3;i++)hh+='<span></span>';for(var j=1;j<=31;j++)hh+='<span class="'+(j==17||j==22||j==30?'h':'')+'">'+j+'</span>';if(dv)dv.innerHTML=hh;
document.getElementById('flogo').src=document.querySelector('.logo img').src;
// Contact: temas, mensaje enviado y "enviar otro"
var cf=document.getElementById('f');
[].forEach.call(document.querySelectorAll('#ctt button'),function(b){b.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('#ctt button'),function(x){x.classList.toggle('on',x===b)})})});
cf.addEventListener('submit',function(e){e.preventDefault();var n=document.getElementById('fn1').value.trim();
 document.getElementById('ctmsg').textContent='Thanks'+(n?', '+n:'')+'! We\'ll get back to you very soon.';cf.classList.add('sent')});
document.getElementById('ctnew').addEventListener('click',function(){cf.reset();cf.classList.remove('sent')});
// Botones que bajan a una parte de la pagina sin cambiar de pagina (Functions y Privacy)
[].forEach.call(document.querySelectorAll('[data-go]'),function(b){b.addEventListener('click',function(){var t=document.getElementById(b.dataset.go);if(t)t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})})});
// Privacy: el indice marca la seccion que estas leyendo
var pvb=[].slice.call(document.querySelectorAll('#pvtoc button'));
var pvio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){pvb.forEach(function(b){b.classList.toggle('on',b.dataset.go===e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('.pv-s').forEach(function(s){pvio.observe(s)});
// Paw Alert: demo de la alerta
var paart=document.getElementById('paart'),pabtn=document.getElementById('pabtn');
pabtn.addEventListener('click',function(){var on=!paart.classList.contains('alerting');paart.classList.toggle('alerting',on);
 pabtn.innerHTML=on?'<i class="ms">check_circle</i> I found my pet':'<i class="ms">campaign</i> Try Paw Alert';
 if(on){paart.classList.remove('in');void paart.offsetWidth;paart.classList.add('in')}});
// Pet Moments (Functions): historias que avanzan solas, tocar para pasar y dar like
(function(){var st=document.getElementById('story');if(!st)return;
 var ims=[].slice.call(st.querySelectorAll('.st-imgs img')),bars=[].slice.call(st.querySelectorAll('.st-bars i')),cur=0,tm=null,DUR=4000,vis=false,left=DUR,t0=0;
 var nm=document.getElementById('stn'),tt=document.getElementById('stt'),lk=document.getElementById('stlike');
 function show(i){cur=(i+ims.length)%ims.length;ims.forEach(function(im,k){im.classList.toggle('on',k===cur)});
  bars.forEach(function(b,k){b.classList.remove('now');b.classList.toggle('done',k<cur)});void st.offsetWidth;bars[cur].classList.add('now');
  nm.innerHTML=ims[cur].dataset.n;tt.textContent=ims[cur].dataset.t;lk.classList.remove('on');left=DUR;plan()}
 function plan(){clearTimeout(tm);if(!vis||reduce)return;t0=Date.now();tm=setTimeout(function(){show(cur+1)},left)}
 function heart(){var h=document.createElement('span');h.className='st-heart';h.innerHTML=HEART;st.appendChild(h);setTimeout(function(){h.remove()},950)}
 st.querySelector('.st-next').addEventListener('click',function(){show(cur+1)});
 st.querySelector('.st-prev').addEventListener('click',function(){show(cur-1)});
 lk.addEventListener('click',function(e){e.stopPropagation();lk.classList.toggle('on');if(lk.classList.contains('on'))heart()});
 st.addEventListener('dblclick',function(){lk.classList.add('on');heart()});
 st.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
 st.addEventListener('pointerenter',function(){if(!vis)return;clearTimeout(tm);left=Math.max(300,left-(Date.now()-t0));st.classList.add('paused')});
 st.addEventListener('pointerleave',function(){st.classList.remove('paused');plan()});
 st.style.setProperty('--dur',DUR/1000+'s');
 new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)show(cur);else clearTimeout(tm)},{threshold:.4}).observe(st)})();

// Scroll: las letras se separan y el beagle baja
var away=false,iv2;
addEventListener('scroll',function(){var p=Math.min(scrollY/innerHeight,1);hero.style.setProperty('--p',p.toFixed(3));
 if(p>.6)away=true;
 if(p<.12&&away&&!reduce){away=false;var n=0;clearInterval(iv2);iv2=setInterval(function(){P.push(pour());while(P.length>MAX)P.shift();if(++n>=12)clearInterval(iv2)},420)}
},{passive:true});
})();
