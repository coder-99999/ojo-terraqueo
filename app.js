const CAT={todas:"Todas",ciudad:"🏙️ Ciudades",playa:"🏖️ Playas",montana:"🏔️ Montañas",aeropuerto:"✈️ Aeropuertos",trafico:"🚗 Tráfico",naturaleza:"🌋 Naturaleza"};
let camaras=[],filtro="todas",marcadores=[];
const mapa=L.map("mapa",{worldCopyJump:true}).setView([20,0],2);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(mapa);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function media(c,auto){
  if(c.tipo==="youtube"){const f=document.createElement("iframe");
    f.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(c.videoId)}?autoplay=${auto?1:0}&mute=1&playsinline=1`;
    f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.loading="lazy";f.title=c.nombre;return f;}
  const i=document.createElement("img");const load=()=>i.src=c.imagen+"?t="+Date.now();load();
  i.alt=c.nombre;i.referrerPolicy="no-referrer";const t=setInterval(()=>{if(!i.isConnected)clearInterval(t);else load()},(c.refrescoSeg||300)*1000);return i;}
function abrir(c){const v=document.getElementById("visor");v.hidden=false;
  document.getElementById("vt").textContent=`${c.nombre} · ${c.pais}`;const vc=document.getElementById("vc");vc.replaceChildren(media(c,true));
  document.getElementById("vf").innerHTML=`Fuente: ${esc(c.fuente)} · <a href="${esc(c.url)}" target="_blank" rel="noopener">ver en origen</a>`;v.scrollIntoView({behavior:"smooth"});}
document.getElementById("cerrar").onclick=()=>{document.getElementById("vc").replaceChildren();document.getElementById("visor").hidden=true};
function render(){const lista=camaras.filter(c=>filtro==="todas"||c.categoria===filtro);
  marcadores.forEach(m=>m.remove());marcadores=lista.map(c=>L.marker([c.lat,c.lon]).addTo(mapa).bindTooltip(c.nombre).on("click",()=>abrir(c)));
  const g=document.getElementById("grid");g.replaceChildren(...lista.map(c=>{const d=document.createElement("article");d.className="card";
    d.innerHTML=`<div class="media"></div><h3>${esc(c.nombre)}</h3><p>${esc(c.pais)} · ${esc(CAT[c.categoria]||c.categoria)} · ${esc(c.fuente)}</p>`;
    const m=d.querySelector(".media");
    if(c.tipo==="youtube"){const b=document.createElement("button");b.className="play";b.textContent="▶";b.setAttribute("aria-label","Reproducir "+c.nombre);
      b.style.backgroundImage=`url(https://i.ytimg.com/vi/${encodeURIComponent(c.videoId)}/hqdefault_live.jpg)`;b.onclick=()=>m.replaceChildren(media(c,true));m.append(b);}
    else m.append(media(c,false));return d;}));}
function filtros(){const n=document.getElementById("filtros");n.replaceChildren(...Object.entries(CAT).map(([k,v])=>{const b=document.createElement("button");
  b.textContent=v;b.className=k===filtro?"on":"";b.onclick=()=>{filtro=k;filtros();render()};return b;}));}
fetch("cameras.json").then(r=>r.json()).then(d=>{camaras=d.camaras;filtros();render();}).catch(e=>{document.getElementById("grid").textContent="No se pudo cargar cameras.json: "+e});
