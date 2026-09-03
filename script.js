document.body.classList.add('loading');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('load',()=>setTimeout(()=>{document.querySelector('.loader').classList.add('done');document.body.classList.remove('loading')},reduce?0:1350));

const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');
menu.addEventListener('click',()=>{const on=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(on));menu.textContent=on?'CLOSE':'MENU'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.textContent='MENU';menu.setAttribute('aria-expanded','false')}));

const cursor=document.querySelector('.cursor');
if(!reduce){addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth-.5).toFixed(3));document.documentElement.style.setProperty('--my',(e.clientY/innerHeight-.5).toFixed(3))});document.querySelectorAll('a,button,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))})}

const observer=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress i').style.height=(scrollY/max*100)+'%'},{passive:true});

if(!reduce)document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1600px) rotateX(${-y*2.5}deg) rotateY(${x*2.5}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

const canvas=document.querySelector('#network'),ctx=canvas.getContext('2d');let w,h,dpr,points=[];
function resize(){dpr=Math.min(devicePixelRatio,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:Math.min(80,Math.floor(w/16))},()=>({x:(Math.random()-.5)*w,y:(Math.random()-.5)*h,z:Math.random()*w}));}
function draw(t){ctx.clearRect(0,0,w,h);const fov=Math.max(w,h)*.7;points.forEach((p,i)=>{p.z-=.7;if(p.z<1)p.z=w;const s=fov/(fov+p.z),x=w/2+p.x*s+Math.sin(t*.0002+i)*12,y=h/2+p.y*s;const a=(1-p.z/w)*.55;ctx.fillStyle=`rgba(10,10,10,${a})`;ctx.beginPath();ctx.arc(x,y,1+s*2,0,Math.PI*2);ctx.fill();if(i%4===0){const q=points[(i+7)%points.length],qs=fov/(fov+q.z),qx=w/2+q.x*qs,qy=h/2+q.y*qs;if(Math.hypot(x-qx,y-qy)<180){ctx.strokeStyle=`rgba(10,10,10,${a*.22})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(qx,qy);ctx.stroke()}}});if(!reduce)requestAnimationFrame(draw)}
resize();addEventListener('resize',resize);requestAnimationFrame(draw);
