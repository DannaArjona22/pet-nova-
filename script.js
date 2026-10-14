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
// Escena del gato: te acercas a sus ojos y por ellos ves el mundo (el mapa)
var road=document.getElementById('road'),ep=document.getElementById('ep');
function seg(m,a,b){return Math.max(0,Math.min(1,(m-a)/(b-a)))}
function roadUpdate(){var r=road.getBoundingClientRect();if(!r.height)return;var m=Math.max(0,Math.min(1,-r.top/(r.height-innerHeight)));
 road.style.setProperty('--a',seg(m,0,.18).toFixed(3));road.style.setProperty('--b',seg(m,.2,.62).toFixed(3));var c=seg(m,.6,.92);road.style.setProperty('--c',c.toFixed(3));road.classList.toggle('on',c>.5);
 var e=ep.getBoundingClientRect();road.style.setProperty('--px',(e.left+e.width/2)+'px');road.style.setProperty('--py',(e.top+e.height/2)+'px')}
addEventListener('scroll',roadUpdate,{passive:true});addEventListener('resize',roadUpdate);setTimeout(roadUpdate,300);
// Pet Moments: las tarjetas se deslizan hacia la izquierda en un abanico sin fin
var mo=document.getElementById('moments'),fan=document.getElementById('fan'),pcs=[].slice.call(fan.children),NP=pcs.length,off=0,spd=0,hov=false,lt=0,vis=false;
fan.addEventListener('pointerenter',function(){hov=true});fan.addEventListener('pointerleave',function(){hov=false});
function fanLayout(){var W=pcs[0].offsetWidth;pcs.forEach(function(c,i){var d=((i-off)%NP+NP)%NP;if(d>NP/2)d-=NP;var a=Math.abs(d);
 var x=d*W*.74,y=10*a*a-40*Math.max(0,1-a),r=Math.max(-26,Math.min(26,d*6.5)),sc=1.14-.1*Math.min(a,1.3),op=Math.max(0,Math.min(1,(3.7-a)/1.2));
 c.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,0) rotate('+r.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';c.style.opacity=op.toFixed(2);c.style.zIndex=100-Math.round(a*10);c.style.pointerEvents=op<.3?'none':'auto'})}
function fanFrame(t){var dt=Math.min((t-lt)/1000||0,.05);lt=t;if(vis){spd+=((hov||reduce?0:.3)-spd)*Math.min(1,dt*5);off=(off+spd*dt)%NP;fanLayout()}requestAnimationFrame(fanFrame)}
new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(mo);
var moIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){mo.classList.add('in');moIO.disconnect()}})},{threshold:.25});moIO.observe(mo);
fanLayout();requestAnimationFrame(fanFrame);addEventListener('resize',fanLayout);

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
var dv=document.getElementById('days'),hh='';'LMMJVSD'.split('').forEach(function(l){hh+='<span style="opacity:.5">'+l+'</span>'});
for(var i=0;i<3;i++)hh+='<span></span>';for(var j=1;j<=31;j++)hh+='<span class="'+(j==17||j==22||j==30?'h':'')+'">'+j+'</span>';if(dv)dv.innerHTML=hh;
document.getElementById('flogo').src=document.querySelector('.logo img').src;
document.getElementById('f').addEventListener('submit',function(e){e.preventDefault();document.getElementById('fb').textContent='Message sent!'});
// Scroll: las letras se separan y el beagle baja
var away=false,iv2;
addEventListener('scroll',function(){var p=Math.min(scrollY/innerHeight,1);hero.style.setProperty('--p',p.toFixed(3));
 if(p>.6)away=true;
 if(p<.12&&away&&!reduce){away=false;var n=0;clearInterval(iv2);iv2=setInterval(function(){P.push(pour());while(P.length>MAX)P.shift();if(++n>=12)clearInterval(iv2)},420)}
},{passive:true});
})();