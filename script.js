document.body.classList.add('loading');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused=reduce;
const loadCount=document.querySelector('#load-count');
let loaded=0;
const loadingTimer=setInterval(()=>{loaded=Math.min(100,loaded+Math.ceil(Math.random()*9));loadCount.textContent=String(loaded).padStart(3,'0');if(loaded===100)clearInterval(loadingTimer)},70);
addEventListener('load',()=>setTimeout(()=>{loadCount.textContent='100';document.querySelector('.loader').classList.add('done');document.body.classList.remove('loading')},reduce?0:1350));

const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');
menu.addEventListener('click',()=>{const on=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(on));menu.textContent=on?'CLOSE':'MENU'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.textContent='MENU';menu.setAttribute('aria-expanded','false')}));

const cursor=document.querySelector('.cursor');
if(!reduce){addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth-.5).toFixed(3));document.documentElement.style.setProperty('--my',(e.clientY/innerHeight-.5).toFixed(3));document.documentElement.style.setProperty('--px',e.clientX+'px');document.documentElement.style.setProperty('--py',e.clientY+'px')});document.querySelectorAll('a,button,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))})}

const clock=document.querySelector('#local-time');
function updateClock(){clock.textContent='TIMMINS · '+new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}
updateClock();setInterval(updateClock,30000);

const motionToggle=document.querySelector('.motion-toggle');
if(reduce){document.body.classList.add('motion-paused');motionToggle.setAttribute('aria-pressed','true');motionToggle.innerHTML='<i></i> MOTION OFF'}
motionToggle.addEventListener('click',()=>{motionPaused=!motionPaused;document.body.classList.toggle('motion-paused',motionPaused);motionToggle.setAttribute('aria-pressed',String(motionPaused));motionToggle.innerHTML=motionPaused?'<i></i> MOTION OFF':'<i></i> MOTION ON';if(!motionPaused)requestAnimationFrame(draw)});

const observer=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
let scrollTick=false;
addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight,ratio=scrollY/max;document.querySelector('.progress i').style.height=(ratio*100)+'%';document.documentElement.style.setProperty('--scroll',Math.min(1,scrollY/innerHeight).toFixed(3));scrollTick=false});scrollTick=true}},{passive:true});

if(!reduce)document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--px',(e.clientX-r.left)+'px');card.style.setProperty('--py',(e.clientY-r.top)+'px');if(!motionPaused)card.style.transform=`perspective(1600px) rotateX(${-y*2.5}deg) rotateY(${x*2.5}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

if(!reduce)document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{if(motionPaused)return;const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.13}px,${(e.clientY-r.top-r.height/2)*.13}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

const numberObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count);let n=0;const timer=setInterval(()=>{n++;el.textContent=String(n).padStart(2,'0');if(n>=target)clearInterval(timer)},120)});numberObserver.unobserve(entry.target)}),{threshold:.45});
document.querySelectorAll('.profile-numbers').forEach(el=>numberObserver.observe(el));

const canvas=document.querySelector('#network'),ctx=canvas.getContext('2d');let w,h,dpr,points=[];
function resize(){dpr=Math.min(devicePixelRatio,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:Math.min(80,Math.floor(w/16))},()=>({x:(Math.random()-.5)*w,y:(Math.random()-.5)*h,z:Math.random()*w}));}
function draw(t){ctx.clearRect(0,0,w,h);const fov=Math.max(w,h)*.7;points.forEach((p,i)=>{if(!motionPaused)p.z-=.7;if(p.z<1)p.z=w;const s=fov/(fov+p.z),x=w/2+p.x*s+Math.sin(t*.0002+i)*12,y=h/2+p.y*s;const a=(1-p.z/w)*.55;ctx.fillStyle=`rgba(10,10,10,${a})`;ctx.beginPath();ctx.arc(x,y,1+s*2,0,Math.PI*2);ctx.fill();if(i%4===0){const q=points[(i+7)%points.length],qs=fov/(fov+q.z),qx=w/2+q.x*qs,qy=h/2+q.y*qs;if(Math.hypot(x-qx,y-qy)<180){ctx.strokeStyle=`rgba(10,10,10,${a*.22})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(qx,qy);ctx.stroke()}}});if(!motionPaused)requestAnimationFrame(draw)}
resize();addEventListener('resize',resize);requestAnimationFrame(draw);
