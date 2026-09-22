const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
let selectedCategory="Acompanhantes",selectedGender="Todos",viewMode="grid",onlyFavorites=false;
let cityCache={};
let hydratedUserProfiles=[];
const mediaObjectUrls=[];

const demoProfiles=[{"id":"demo1","name":"Marina","age":24,"state":"SP","city":"São Paulo","district":"Jardins","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-01.jpg","gallery":["new-01.jpg","new-06.jpg","model-01.jpg","model-08.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo2","name":"Bianca","age":25,"state":"RJ","city":"Rio de Janeiro","district":"Copacabana","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-02.jpg","gallery":["new-02.jpg","new-07.jpg","model-02.jpg","model-09.jpg"],"video":"video-01.mp4","prices":{"min15":100,"min30":165,"hour1":305},"coverMedia":"video"},{"id":"demo3","name":"Carla","age":26,"state":"MG","city":"Belo Horizonte","district":"Savassi","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-03.jpg","gallery":["new-03.jpg","new-08.jpg","model-03.jpg","model-10.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo4","name":"Luna","age":27,"state":"PR","city":"Curitiba","district":"Batel","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-04.jpg","gallery":["new-04.jpg","new-09.jpg","model-04.jpg","model-11.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo5","name":"Maya","age":28,"state":"BA","city":"Salvador","district":"Barra","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-05.jpg","gallery":["new-05.jpg","new-10.jpg","model-05.jpg","model-12.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}},{"id":"demo6","name":"Isabela","age":29,"state":"DF","city":"Brasília","district":"Asa Sul","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-06.jpg","gallery":["new-06.jpg","new-11.jpg","model-06.jpg","model-13.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo7","name":"Camila","age":30,"state":"SC","city":"Florianópolis","district":"Centro","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-07.jpg","gallery":["new-07.jpg","new-12.jpg","model-07.jpg","model-14.jpg"],"video":"video-02.mp4","prices":{"min15":100,"min30":165,"hour1":305},"coverMedia":"video"},{"id":"demo8","name":"Júlia","age":31,"state":"PE","city":"Recife","district":"Boa Viagem","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-08.jpg","gallery":["new-08.jpg","new-13.jpg","model-08.jpg","model-15.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo9","name":"Amanda","age":24,"state":"GO","city":"Goiânia","district":"Setor Bueno","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-09.jpg","gallery":["new-09.jpg","new-14.jpg","model-09.jpg","model-01.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo10","name":"Sofia","age":25,"state":"CE","city":"Fortaleza","district":"Meireles","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-10.jpg","gallery":["new-10.jpg","new-15.jpg","model-10.jpg","model-02.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}},{"id":"demo11","name":"Valentina","age":26,"state":"RS","city":"Porto Alegre","district":"Moinhos de Vento","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-11.jpg","gallery":["new-11.jpg","new-16.jpg","model-11.jpg","model-03.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo12","name":"Natalia","age":27,"state":"ES","city":"Vitória","district":"Praia do Canto","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-12.jpg","gallery":["new-12.jpg","new-01.jpg","model-12.jpg","model-04.jpg"],"video":"video-03.mp4","prices":{"min15":100,"min30":165,"hour1":305},"coverMedia":"video"},{"id":"demo13","name":"Larissa","age":28,"state":"PA","city":"Belém","district":"Umarizal","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-13.jpg","gallery":["new-13.jpg","new-02.jpg","model-13.jpg","model-05.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo14","name":"Bruna","age":29,"state":"AM","city":"Manaus","district":"Adrianópolis","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-14.jpg","gallery":["new-14.jpg","new-03.jpg","model-14.jpg","model-06.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo15","name":"Melissa","age":30,"state":"RN","city":"Natal","district":"Ponta Negra","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-15.jpg","gallery":["new-15.jpg","new-04.jpg","model-15.jpg","model-07.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}},{"id":"demo16","name":"Gabriela","age":31,"state":"PB","city":"João Pessoa","district":"Tambaú","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-16.jpg","gallery":["new-16.jpg","new-05.jpg","model-01.jpg","model-08.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo17","name":"Juliana","age":24,"state":"AL","city":"Maceió","district":"Pajuçara","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-17.png","gallery":["new-17.png","new-05.jpg","model-04.jpg","new-11.jpg"],"video":"","prices":{"min15":100,"min30":165,"hour1":305}},{"id":"demo18","name":"Helena","age":25,"state":"SE","city":"Aracaju","district":"Atalaia","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-18.png","gallery":["new-18.png","new-09.jpg","model-06.jpg","new-14.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo19","name":"Renata","age":27,"state":"MT","city":"Cuiabá","district":"Goiabeiras","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-19.png","gallery":["new-19.png","new-02.jpg","model-12.jpg","new-16.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo20","name":"Paola","age":28,"state":"MS","city":"Campo Grande","district":"Santa Fé","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-20.png","gallery":["new-20.png","new-03.jpg","model-15.jpg","new-07.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}}];

function rawUserProfiles(){
  const keys=["lilasPerfil","lilasPerfis"];
  let out=[];
  for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k)||"null");if(Array.isArray(v))out.push(...v);else if(v&&typeof v==="object")out.push(v)}catch{}}
  return out;
}
function profileFromRaw(p,i){
  const runtime=p.__runtime||{};
  const gallery=(runtime.gallery&&runtime.gallery.length?runtime.gallery:(p.fotosFallback||p.fotos||[])).filter(Boolean);
  const video=runtime.video||p.videoDataUrl||p.video||((p.videos||[])[0])||"";
  return {
    id:p.id||`user${i}`,name:p.nome||p.name||"Perfil",age:p.idade||p.age||"",
    state:(p.estado||p.state||"").toUpperCase(),city:p.cidade||p.city||"",district:p.bairro||p.district||"",
    category:p.categoria||p.category||"Acompanhantes",gender:p.genero||p.gender||"Mulheres",
    text:p.descricao||p.text||"Veja mais informações no perfil.",verified:!!(p.verificado||p.verified),
    image:runtime.image||p.fotoCapa||p.image||p.foto||gallery[Number(p.capaIndex)||0]||gallery[0]||"",
    gallery,video,audio:runtime.audio||p.audioDataUrl||p.audioUrl||"",
    prices:{
      min15:Number(p.preco15||p.valor15||p.caches?.min15||0)||0,
      min30:Number(p.preco30||p.valor30||p.caches?.min30||0)||0,
      hour1:Number(p.preco60||p.valor60||p.valor1h||p.caches?.hora1||0)||0
    }
  };
}
function userProfiles(){return hydratedUserProfiles.length?hydratedUserProfiles:rawUserProfiles().map(profileFromRaw)}
function openMediaDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open('lilasClubMediaDB',1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('assets'))db.createObjectStore('assets')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function getMediaBlob(key){if(!key)return null;try{const db=await openMediaDB();const value=await new Promise((resolve,reject)=>{const tx=db.transaction('assets','readonly');const q=tx.objectStore('assets').get(key);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error)});if(!value)return null;if(value instanceof Blob)return value;if(value.__lilasAsset&&value.buffer)return new Blob([value.buffer],{type:value.type||'application/octet-stream'});if(value instanceof ArrayBuffer)return new Blob([value]);return null}catch{return null}}
async function blobUrl(key){const b=await getMediaBlob(key);if(!b)return '';const u=URL.createObjectURL(b);mediaObjectUrls.push(u);return u}
async function hydrateUserProfiles(){
  const raws=rawUserProfiles(); hydratedUserProfiles=[];
  for(let i=0;i<raws.length;i++){
    const p=raws[i], runtime={gallery:[],videos:[]};
    if(Array.isArray(p.photoKeys)&&p.photoKeys.length){for(const k of p.photoKeys){const u=await blobUrl(k);if(u)runtime.gallery.push(u)}runtime.image=runtime.gallery[Number(p.capaIndex)||0]||runtime.gallery[0]||''}
    if(Array.isArray(p.videoKeys)&&p.videoKeys.length){for(const k of p.videoKeys){const u=await blobUrl(k);if(u)runtime.videos.push(u)}runtime.video=runtime.videos[0]||'';}
    if(p.audioKey)runtime.audio=await blobUrl(p.audioKey);
    p.__runtime=runtime; hydratedUserProfiles.push(profileFromRaw(p,i));
  }
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
function minPositivePrice(p){const a=[p.prices?.min15,p.prices?.min30,p.prices?.hour1].map(Number).filter(v=>v>0);return a.length?Math.min(...a):0}
function badgeFor(p){
  const n=Number(String(p.id||'').replace(/\D/g,''))||0;
  const map={1:['🟢','AGORA'],2:['📍','CHEGUEI'],4:['🔥','EM ALTA'],6:['❤️','FAVORITA'],7:['🎥','COM VÍDEO'],10:['🎧','COM ÁUDIO'],12:['🟢','AGORA'],15:['🔥','EM ALTA'],18:['📍','CHEGUEI']};
  return map[n]||null;
}
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
  $("#cards").innerHTML=rows.map(p=>{const badge=badgeFor(p),min=minPositivePrice(p);return `<article class="card" data-id="${p.id}">
    <div class="card-media">${p.image?`<span class="media-backdrop" style="background-image:url('${p.image}')"></span>`:''}${p.coverMedia==="video"&&p.video?`<video class="card-cover-video" src="${p.video}" muted autoplay loop playsinline preload="metadata" aria-label="Vídeo de ${p.name}"></video>`:(p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>Foto do perfil<br>${p.name}</span>`)}${badge?`<span class="profile-badge"><i>${badge[0]}</i><b>${badge[1]}</b></span>`:''}${p.video?'<span class="video-indicator" title="Perfil com vídeo">▶</span>':''}</div>
    <button class="fav ${fav.includes(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favoritar">${fav.includes(p.id)?"♥":"♡"}</button>
    <div class="card-body"><div class="card-title">${p.name}${p.age?`, ${p.age}`:""} ${p.verified?'<span class="verified">✓</span>':""}</div>
    <div class="meta">${[p.district,p.city,p.state].filter(Boolean).join(" • ")}</div>${min?`<div class="card-price">A partir de ${moneyBR(min)}</div>`:''}<p class="tagline">${p.text}</p></div>
  </article>`}).join("");
  $$("[data-fav]").forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(b.dataset.fav)});
  $$(".card[data-id]").forEach(c=>c.onclick=()=>openDemoProfile(c.dataset.id));
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



// ===== Lilás Club — complementos DEMO autorizados =====
function moneyBR(v){return v?`R$ ${Number(v).toLocaleString('pt-BR')}`:'—'}
function escText(s){return String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function ensureDemoLayers(){
  if(!document.getElementById('profileDemoModal')){
    document.body.insertAdjacentHTML('beforeend',`<div id="profileDemoModal" class="demo-layer hidden" role="dialog" aria-modal="true">
      <div class="demo-profile-card"><button class="demo-close" id="profileDemoClose" aria-label="Fechar">×</button><div id="profileDemoContent"></div></div>
    </div>`);
    document.getElementById('profileDemoClose').onclick=()=>document.getElementById('profileDemoModal').classList.add('hidden');
    document.getElementById('profileDemoModal').onclick=e=>{if(e.target.id==='profileDemoModal')e.currentTarget.classList.add('hidden')};
  }
}

function openDemoProfile(id){
  const p=allProfiles().find(x=>x.id===id);if(!p)return;ensureDemoLayers();
  const gallery=(p.gallery&&p.gallery.length?p.gallery:[p.image]).filter(Boolean);
  const prices=p.prices||{};
  const media=[];
  if(p.video&&p.coverMedia==='video')media.push({type:'video',src:p.video});
  gallery.forEach((src,i)=>{media.push({type:'image',src});if(i===0&&p.video&&p.coverMedia!=='video')media.push({type:'video',src:p.video})});
  const thumbs=media.map((m,i)=>`<button class="demo-thumb ${i===0?'active':''}" data-demo-type="${m.type}" data-demo-src="${escText(m.src)}">${m.type==='video'?`<video src="${escText(m.src)}" muted playsinline preload="metadata"></video><span class="thumb-play">▶</span>`:`<img src="${escText(m.src)}" alt="">`}</button>`).join('');
  const first=media[0]||{type:'image',src:p.image||''};
  const main=first.type==='video'?`<video id="demoMainVideo" controls playsinline preload="metadata" src="${escText(first.src)}"></video>`:`<img id="demoMainImage" src="${escText(first.src)}" alt="${escText(p.name)}">`;
  document.getElementById('profileDemoContent').innerHTML=`<div class="demo-profile-grid"><div><div class="demo-main-media" id="demoMainMedia"><span class="profile-backdrop" style="background-image:url('${escText(p.image||'')}')"></span>${main}</div><div class="demo-thumbs">${thumbs}</div></div><div class="demo-profile-info"><small>PERFIL DEMONSTRATIVO</small><h2>${escText(p.name)}${p.age?`, ${p.age}`:''} ${p.verified?'<span class="verified">✓</span>':''}</h2><p>${escText([p.district,p.city,p.state].filter(Boolean).join(' • '))}</p><div class="demo-rates ${minPositivePrice(p)?'':'hidden'}">${prices.min15?`<div><span>15 minutos</span><b>${moneyBR(prices.min15)}</b></div>`:''}${prices.min30?`<div><span>30 minutos</span><b>${moneyBR(prices.min30)}</b></div>`:''}${prices.hour1?`<div><span>1 hora</span><b>${moneyBR(prices.hour1)}</b></div>`:''}</div>${p.audio?`<div class="demo-audio"><audio controls preload="metadata" src="${escText(p.audio)}"></audio></div>`:''}<p class="demo-copy">${escText(p.text)}</p><div class="demo-only">DEMO • dados e valores fictícios para teste</div></div></div>`;
  document.querySelectorAll('[data-demo-src]').forEach(b=>b.onclick=()=>{
    const box=document.getElementById('demoMainMedia');
    box.querySelector(':scope > img, :scope > video')?.remove();
    let el;
    if(b.dataset.demoType==='video'){
      el=document.createElement('video');el.id='demoMainVideo';el.controls=true;el.playsInline=true;el.preload='metadata';el.src=b.dataset.demoSrc;el.muted=false;el.volume=1;
    }else{
      el=document.createElement('img');el.id='demoMainImage';el.alt=p.name;el.src=b.dataset.demoSrc;
    }
    box.prepend(el);
    document.querySelectorAll('[data-demo-src]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    if(b.dataset.demoType==='video'){el.play().catch(()=>{});}
  });
  document.getElementById('profileDemoModal').classList.remove('hidden');
  const openedVideo=document.getElementById('demoMainVideo');
  if(openedVideo){openedVideo.muted=false;openedVideo.volume=1;openedVideo.play().catch(()=>{});}
}

const weatherIcon=code=>code===0?'☀️':code<=3?'⛅':code<=48?'🌫️':code<=67?'🌧️':code<=77?'❄️':code<=82?'🌦️':code<=99?'⛈️':'☀️';
async function updateWeatherFromCoords(lat,lon,label='Sua localização'){
  const loc=document.getElementById('weatherLocation'),now=document.getElementById('weatherNow');
  if(loc)loc.textContent=`📍 ${label}`;
  try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code&timezone=auto`);if(!r.ok)throw 0;const d=await r.json();const t=Math.round(Number(d.current?.temperature_2m));const c=Number(d.current?.weather_code||0);if(now)now.textContent=`${weatherIcon(c)} ${Number.isFinite(t)?t:'--'}°`;localStorage.setItem('lilasWeather',JSON.stringify({label,t,c,ts:Date.now()}))}catch{if(now)now.textContent='☀️ --°'}
}
function locateAndWeather(showMessage=false){
  if(!navigator.geolocation){if(showMessage)alert('Localização não disponível.');return}
  navigator.geolocation.getCurrentPosition(p=>{updateWeatherFromCoords(p.coords.latitude,p.coords.longitude);if(showMessage)document.querySelector('.weather-bar')?.scrollIntoView({behavior:'smooth',block:'nearest'})},()=>{if(showMessage)alert('Não foi possível acessar sua localização.')},{enableHighAccuracy:false,timeout:8000,maximumAge:600000});
}
async function initWeatherBar(){
  try{const c=JSON.parse(localStorage.getItem('lilasWeather')||'null');if(c&&Date.now()-c.ts<3600000){document.getElementById('weatherLocation').textContent=`📍 ${c.label||'Sua localização'}`;document.getElementById('weatherNow').textContent=`${weatherIcon(Number(c.c||0))} ${Number.isFinite(Number(c.t))?Math.round(Number(c.t)):'--'}°`;return}}catch{}
  try{if(navigator.permissions){const p=await navigator.permissions.query({name:'geolocation'});if(p.state==='granted')locateAndWeather(false)}}catch{}
}

document.addEventListener("DOMContentLoaded",async()=>{
  fillStates(); await hydrateUserProfiles(); render(); ensureDemoLayers(); initWeatherBar();
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
  $("#locateBtn").onclick=()=>locateAndWeather(true);
  $("#voiceBtn").onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return alert("Pesquisa por voz não disponível neste navegador.");const r=new SR();r.lang="pt-BR";r.onresult=e=>{$("#searchInput").value=e.results[0][0].transcript;showSuggestions()};r.start()};
});
