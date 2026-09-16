const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const profileState=p=>(p.estado||p.state||((p.cidade||p.city||"").match(/-\s*([A-Z]{2})\s*$/)||[])[1]||"").toUpperCase();
const profileCity=p=>(p.cidade||p.city||"").replace(/\s*-\s*[A-Z]{2}\s*$/,"").trim();
let selectedCategory="Acompanhantes",selectedGender="Todos",viewMode="grid",onlyFavorites=false;
let cityCache={};

// Vídeos do protótipo ficam no IndexedDB do navegador.
// Isso permite testar arquivos reais no GitHub Pages sem colocar vídeos no localStorage.
const LILAS_MEDIA_DB="lilasClubMediaDB";
const LILAS_MEDIA_STORE="media";
function openMediaDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(LILAS_MEDIA_DB,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(LILAS_MEDIA_STORE))db.createObjectStore(LILAS_MEDIA_STORE);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function getStoredMedia(id){
  if(!id)return null;
  try{
    const db=await openMediaDB();
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(LILAS_MEDIA_STORE,"readonly");
      const req=tx.objectStore(LILAS_MEDIA_STORE).get(id);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
    });
  }catch{return null}
}
function firstVideoMeta(raw={}){
  const list=Array.isArray(raw.videos)?raw.videos:[];
  const objectVideo=list.find(v=>v&&typeof v==="object"&&v.id);
  if(objectVideo)return objectVideo;
  const legacy=list.find(v=>typeof v==="string"&&v.trim());
  return legacy?{legacy:true,name:legacy}:null;
}

const demoProfiles=[
{
  id:"teste-julia",name:"Júlia TESTE",age:25,state:"SP",city:"São Paulo",district:"Moema",category:"Acompanhantes",gender:"Mulheres",
  text:"Perfil fictício criado somente para testar o funcionamento do site.",verified:true,image:"julia-1.svg",videoUrl:"julia-demo.mp4",
  raw:{nome:"Júlia TESTE",idade:25,estado:"SP",cidade:"São Paulo",bairro:"Moema",categoria:"Acompanhantes",genero:"Mulheres",titulo:"Perfil demonstrativo",descricao:"Perfil totalmente fictício. Cadastro criado apenas para testar cards, busca, galeria, valores e página de perfil.",telefone:"",caches:{min15:"100",min30:"120",hora1:"200"},horario:{dias:["Seg","Ter","Qua","Qui","Sex"],inicio:"10:00",fim:"22:00"},fotos:["julia-1.svg","julia-2.svg","julia-3.svg"],capaIndex:0,teste:true}
},
{
  id:"teste-camila",name:"Camila TESTE",age:27,state:"RJ",city:"Rio de Janeiro",district:"Copacabana",category:"Acompanhantes",gender:"Mulheres",
  text:"Perfil fictício criado somente para testar o funcionamento do site.",verified:true,image:"camila-1.svg",videoUrl:"camila-demo.mp4",
  raw:{nome:"Camila TESTE",idade:27,estado:"RJ",cidade:"Rio de Janeiro",bairro:"Copacabana",categoria:"Acompanhantes",genero:"Mulheres",titulo:"Perfil demonstrativo",descricao:"Perfil totalmente fictício. Cadastro criado apenas para testar a navegação, os filtros, a galeria e os valores.",telefone:"",caches:{min15:"100",min30:"120",hora1:"200"},horario:{dias:["Ter","Qua","Qui","Sex","Sáb"],inicio:"11:00",fim:"23:00"},fotos:["camila-1.svg","camila-2.svg","camila-3.svg"],capaIndex:0,teste:true}
},
{
  id:"teste-larissa",name:"Larissa TESTE",age:29,state:"MG",city:"Belo Horizonte",district:"Savassi",category:"Acompanhantes",gender:"Mulheres",
  text:"Perfil fictício criado somente para testar o funcionamento do site.",verified:false,image:"larissa-1.svg",videoUrl:"larissa-demo.mp4",
  raw:{nome:"Larissa TESTE",idade:29,estado:"MG",cidade:"Belo Horizonte",bairro:"Savassi",categoria:"Acompanhantes",genero:"Mulheres",titulo:"Perfil demonstrativo",descricao:"Perfil totalmente fictício. Cadastro criado apenas para testar o site antes da entrada de anúncios reais.",telefone:"",caches:{min15:"100",min30:"120",hora1:"200"},horario:{dias:["Seg","Qua","Qui","Sex","Sáb"],inicio:"12:00",fim:"21:00"},fotos:["larissa-1.svg","larissa-2.svg","larissa-3.svg"],capaIndex:0,teste:true}
}
];

function userProfiles(){
  const keys=["lilasPerfil","lilasPerfis"];
  let out=[];
  for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k)||"null");if(Array.isArray(v))out.push(...v);else if(v&&typeof v==="object")out.push(v)}catch{}}
  return out.map((p,i)=>({
    id:p.id||`user${i}`,name:p.nome||p.name||"Perfil",age:p.idade||p.age||"",
    state:profileState(p),city:profileCity(p),district:p.bairro||p.district||"",
    category:p.categoria||p.category||"Acompanhantes",gender:p.genero||p.gender||"Mulheres",
    text:p.descricao||p.text||"Veja mais informações no perfil.",verified:!!(p.verificado||p.verified),
    image:p.fotoCapa||p.image||p.foto||((p.fotos||[])[0]||""),
    videoMeta:firstVideoMeta(p),videoPoster:p.videoPoster||"",videoUrl:p.videoUrl||"",raw:p
  }));
}
const allProfiles=()=>[...userProfiles(),...demoProfiles];

function fillStates(){
  const sel=$("#stateSelect");
  LILAS_STATES.forEach(([uf,n])=>sel.insertAdjacentHTML("beforeend",`<option value="${uf}">${n}</option>`));
  $("#popularStates").innerHTML=POPULAR_STATES.map(uf=>{
    const n=LILAS_STATES.find(x=>x[0]===uf)?.[1]||uf;
    return `<button class="pill" data-state="${uf}">${n}</button>`
  }).join("");
  $("#popularCities").innerHTML=POPULAR_CITIES.map(x=>`<button class="pill" data-city="${x.city}" data-state="${x.uf}">${x.city}</button>`).join("");
}
async function citiesFor(uf){
  if(!uf)return[];
  if(cityCache[uf])return cityCache[uf];
  try{
    const r=await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
    if(!r.ok)throw 0;
    const d=await r.json();
    cityCache[uf]=d.map(x=>x.nome).sort((a,b)=>a.localeCompare(b,"pt-BR"));
  }catch{cityCache[uf]=(FALLBACK_CITIES[uf]||[]).slice()}
  return cityCache[uf];
}
async function stateChanged(keepCity=""){
  const uf=$("#stateSelect").value, city=$("#citySelect");
  city.innerHTML='<option value="">Todas as Cidades</option>';
  city.disabled=!uf;
  if(!uf)return;
  (await citiesFor(uf)).forEach(n=>city.insertAdjacentHTML("beforeend",`<option value="${n}">${n}</option>`));
  if(keepCity)city.value=keepCity;
}
async function chooseLocation(uf,city=""){
  $("#stateSelect").value=uf; await stateChanged(city); $("#citySelect").value=city; render();
  document.querySelector(".results-section").scrollIntoView({behavior:"smooth"});
}
function favorites(){try{return JSON.parse(localStorage.getItem("lilasFavoritos")||"[]")}catch{return[]}}
function toggleFav(id){let f=favorites();f=f.includes(id)?f.filter(x=>x!==id):[...f,id];localStorage.setItem("lilasFavoritos",JSON.stringify(f));render()}
function render(){
  const state=$("#stateSelect").value,city=$("#citySelect").value,q=normalize($("#searchInput").value),fav=favorites();
  let rows=allProfiles().filter(p=>{
    const matchCat=!selectedCategory||p.category===selectedCategory;
    const matchGender=selectedGender==="Todos"||p.gender===selectedGender;
    const matchState=!state||p.state===state;
    const matchCity=!city||normalize(p.city)===normalize(city);
    const hay=normalize(`${p.name} ${p.city} ${p.state} ${p.district}`);
    return matchCat&&matchGender&&matchState&&matchCity&&(!q||hay.includes(q))&&(!onlyFavorites||fav.includes(p.id));
  });
  if($("#sortSelect").value==="name")rows.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
  $("#resultCount").textContent=`${rows.length} ${rows.length===1?"perfil":"perfis"}`;
  $("#emptyState").classList.toggle("hidden",rows.length>0);
  $("#cards").innerHTML=rows.map(p=>{
    const hasVideo=!!(p.videoUrl||p.videoMeta?.id||p.videoMeta?.legacy);
    const videoAttrs=`${p.videoMeta?.id?` data-video-id="${p.videoMeta.id}"`:""}${p.videoUrl?` data-video-url="${p.videoUrl}"`:""} data-video-poster="${p.videoPoster||p.image||""}"`;
    const media=hasVideo
      ? `<div class="card-media video-cover"${videoAttrs}>${p.videoUrl?`<video muted playsinline loop autoplay preload="metadata" poster="${p.videoPoster||p.image||""}" src="${p.videoUrl}"></video>`:((p.videoPoster||p.image)?`<img src="${p.videoPoster||p.image}" alt="Prévia do vídeo de ${p.name}">`:`<span>Vídeo do perfil<br>${p.name}</span>`)}<span class="media-watermark">LILÁS CLUB</span><span class="card-video-badge">VÍDEO</span><button class="card-video-play" type="button" aria-label="Reproduzir vídeo">▶</button></div>`
      : `<div class="card-media">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>Foto do perfil<br>${p.name}</span>`}<span class="media-watermark">LILÁS CLUB</span></div>`;
    return `<article class="card" data-id="${p.id}">
    ${media}
    <button class="fav ${fav.includes(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favoritar">${fav.includes(p.id)?"♥":"♡"}</button>
    <div class="card-body"><div class="card-title">${p.name}${p.age?`, ${p.age}`:""} ${p.verified?'<span class="verified">✓</span>':""}</div>
    <div class="meta">${[p.district,p.city,p.state].filter(Boolean).join(" • ")}</div>${p.raw?.caches?.hora1?`<div class="card-rate">1 hora • R$ ${p.raw.caches.hora1}</div>`:""}<p class="tagline">${p.text}</p></div>
  </article>`}).join("");
  $$("[data-fav]").forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(b.dataset.fav)});
  $$(".card").forEach(card=>card.onclick=()=>{localStorage.setItem("lilasPerfilSelecionado",card.dataset.id);location.href="perfil.html"});
  hydrateCardVideos();
}

async function hydrateCardVideos(){
  const medias=$$(".card-media.video-cover");
  for(const box of medias){
    const id=box.dataset.videoId||"";
    const direct=box.dataset.videoUrl||"";
    let video=box.querySelector("video");
    let objectUrl="";
    if(!video && id){
      const blob=await getStoredMedia(id);
      if(blob instanceof Blob){
        objectUrl=URL.createObjectURL(blob);
        const poster=box.dataset.videoPoster||"";
        const img=box.querySelector("img"); if(img)img.remove();
        video=document.createElement("video");
        video.muted=true; video.playsInline=true; video.loop=true; video.autoplay=true; video.preload="metadata";
        if(poster)video.poster=poster; video.src=objectUrl; box.prepend(video);
      }
    }
    if(!video)continue;
    const play=box.querySelector(".card-video-play");
    const sync=()=>{const playing=!video.paused&&!video.ended;box.classList.toggle("is-playing",playing);if(play)play.textContent=playing?"❚❚":"▶"};
    try{await video.play()}catch{}
    sync();
    const toggle=async e=>{e?.stopPropagation();if(video.paused){try{await video.play()}catch{}}else video.pause();sync()};
    if(play)play.onclick=toggle;
    video.onclick=toggle; video.onpause=sync; video.onplay=sync;
  }
}
function showSuggestions(){
  const q=normalize($("#searchInput").value.trim());
  const box=$("#suggestions"); if(q.length<2){box.classList.add("hidden");return}
  let items=[];
  POPULAR_CITIES.forEach(x=>{if(normalize(`${x.city} ${x.uf}`).includes(q))items.push(x)});
  allProfiles().forEach(p=>{if(p.city&&normalize(`${p.city} ${p.state}`).includes(q)&&!items.some(x=>x.city===p.city&&x.uf===p.state))items.push({city:p.city,uf:p.state})});
  items=items.slice(0,8);
  box.innerHTML=items.map(x=>`<div class="suggestion" data-scity="${x.city}" data-sstate="${x.uf}"><strong>${x.city}</strong><small>${LILAS_STATES.find(s=>s[0]===x.uf)?.[1]||x.uf}</small></div>`).join("");
  box.classList.toggle("hidden",!items.length);
  $$("[data-scity]").forEach(el=>el.onclick=async()=>{$("#searchInput").value="";box.classList.add("hidden");await chooseLocation(el.dataset.sstate,el.dataset.scity)});
}
function openDrawer(){ $("#drawer").classList.add("open");$("#overlay").classList.remove("hidden")}
function closeDrawer(){ $("#drawer").classList.remove("open");$("#overlay").classList.add("hidden")}
async function openModal(type){
  $("#modal").classList.remove("hidden");$("#modalSearch").value="";
  if(type==="states"){
    $("#modalTitle").textContent="Todos os Estados";
    $("#modalContent").innerHTML=LILAS_STATES.map(([uf,n])=>`<div class="modal-item" data-mstate="${uf}"><strong>${n}</strong><small> ${uf}</small></div>`).join("");
  }else{
    $("#modalTitle").textContent="Todas as cidades";
    $("#modalContent").innerHTML='<div class="modal-item">Escolha um Estado para carregar todas as cidades.</div>'+LILAS_STATES.map(([uf,n])=>`<div class="modal-item" data-loadstate="${uf}"><strong>${n}</strong><small>Ver cidades</small></div>`).join("");
  }
  bindModal();
}
function bindModal(){
  $$("[data-mstate]").forEach(e=>e.onclick=()=>{closeModal();chooseLocation(e.dataset.mstate)});
  $$("[data-loadstate]").forEach(e=>e.onclick=async()=>{
    const uf=e.dataset.loadstate,n=LILAS_STATES.find(x=>x[0]===uf)?.[1]||uf;
    $("#modalTitle").textContent=`Cidades de ${n}`;$("#modalContent").innerHTML='<div class="modal-item">Carregando…</div>';
    const cities=await citiesFor(uf);
    $("#modalContent").innerHTML=cities.map(c=>`<div class="modal-item" data-mcity="${c}" data-mstate="${uf}"><strong>${c}</strong></div>`).join("")||'<div class="modal-item">Não foi possível carregar agora.</div>';
    bindModal();
  });
  $$("[data-mcity]").forEach(e=>e.onclick=()=>{closeModal();chooseLocation(e.dataset.mstate,e.dataset.mcity)});
}
function closeModal(){ $("#modal").classList.add("hidden") }

document.addEventListener("DOMContentLoaded",()=>{
  if(!$("#stateSelect"))return;
  fillStates(); render();
  if(localStorage.getItem("lilas18")==="yes")$("#ageGate").classList.add("hidden");
  $("#enterBtn").onclick=()=>{localStorage.setItem("lilas18","yes");$("#ageGate").classList.add("hidden")};
  $("#leaveBtn").onclick=()=>history.length>1?history.back():location.replace("about:blank");
  $("#stateSelect").onchange=async()=>{await stateChanged();render()}; $("#citySelect").onchange=render;
  $("#searchBtn").onclick=render; $("#searchInput").oninput=showSuggestions;
  $("#filterBtn").onclick=()=>$("#filtersPanel").classList.toggle("hidden");
  $("#radius").oninput=e=>$("#radiusValue").textContent=`${e.target.value} km`; $("#sortSelect").onchange=render;
  $("#menuBtn").onclick=openDrawer;$("#closeMenu").onclick=closeDrawer;$("#overlay").onclick=closeDrawer;
  $("#allStatesBtn").onclick=()=>openModal("states");$("#allCitiesBtn").onclick=()=>openModal("cities");$("#drawerCities").onclick=()=>{closeDrawer();openModal("cities")};
  $("#modalClose").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
  $("#modalSearch").oninput=e=>{const q=normalize(e.target.value);$$(".modal-item").forEach(x=>x.style.display=normalize(x.textContent).includes(q)?"":"none")};
  $$("#popularStates [data-state]").forEach(b=>b.onclick=()=>chooseLocation(b.dataset.state));
  $$("#popularCities [data-city]").forEach(b=>b.onclick=()=>chooseLocation(b.dataset.state,b.dataset.city));
  $$("#categoryTabs .tab").forEach(b=>b.onclick=()=>{$$("#categoryTabs .tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");selectedCategory=b.dataset.category;render()});
  $$("#genderRow .chip").forEach(b=>b.onclick=()=>{$$("#genderRow .chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");selectedGender=b.dataset.gender;render()});
  const favMode=()=>{onlyFavorites=!onlyFavorites;closeDrawer();render();document.querySelector(".results-section").scrollIntoView({behavior:"smooth"})};
  $("#favoritesBtn").onclick=favMode;$("#drawerFav").onclick=favMode;
  $("#viewBtn").onclick=()=>{viewMode=viewMode==="grid"?"list":"grid";$("#cards").style.gridTemplateColumns=viewMode==="list"?"1fr":""};
  $("#locateBtn").onclick=()=>{if(!navigator.geolocation)return alert("Localização não disponível.");navigator.geolocation.getCurrentPosition(()=>alert("Localização autorizada. A busca por distância será conectada aos perfis com coordenadas."),()=>alert("Não foi possível acessar sua localização."))};
  $("#voiceBtn").onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return alert("Pesquisa por voz não disponível neste navegador.");const r=new SR();r.lang="pt-BR";r.onresult=e=>{$("#searchInput").value=e.results[0][0].transcript;showSuggestions()};r.start()};
});
