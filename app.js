const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
let selectedCategory="Acompanhantes",selectedGender="Todos",viewMode="grid",onlyFavorites=false;
let cityCache={};

const demoProfiles=[
{"id":"demo1","name":"Marina","age":27,"state":"SP","city":"São Paulo","district":"Jardins","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-11.jpg","gallery":["model-11.jpg","model-01.jpg","model-06.jpg","model-13.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":90,"min30":160,"hour1":290}},
{"id":"demo2","coverMedia":"video","name":"Bianca","age":25,"state":"RJ","city":"Rio de Janeiro","district":"Copacabana","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-12.jpg","gallery":["model-12.jpg","model-02.jpg","model-07.jpg","model-14.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":120,"min30":190,"hour1":350}},
{"id":"demo3","name":"Carla","age":29,"state":"MG","city":"Belo Horizonte","district":"Savassi","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"model-13.jpg","gallery":["model-13.jpg","model-03.jpg","model-08.jpg","model-15.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":80,"min30":145,"hour1":250}},
{"id":"demo4","name":"Luna","age":26,"state":"PR","city":"Curitiba","district":"Batel","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-14.jpg","gallery":["model-14.jpg","model-04.jpg","model-09.jpg","model-11.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":110,"min30":180,"hour1":320}},
{"id":"demo5","coverMedia":"video","name":"Maya","age":31,"state":"BA","city":"Salvador","district":"Barra","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-15.jpg","gallery":["model-15.jpg","model-05.jpg","model-10.jpg","model-12.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":100,"min30":170,"hour1":300}},
{"id":"demo6","name":"Isabela","age":24,"state":"DF","city":"Brasília","district":"Asa Sul","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-06.jpg","gallery":["model-06.jpg","model-11.jpg","model-02.jpg","model-14.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":130,"min30":210,"hour1":390}},
{"id":"demo7","name":"Camila","age":28,"state":"SC","city":"Florianópolis","district":"Centro","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-07.jpg","gallery":["model-07.jpg","model-12.jpg","model-03.jpg","model-15.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":95,"min30":155,"hour1":280}},
{"id":"demo8","coverMedia":"video","name":"Júlia","age":30,"state":"PE","city":"Recife","district":"Boa Viagem","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"model-08.jpg","gallery":["model-08.jpg","model-13.jpg","model-04.jpg","model-11.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":85,"min30":150,"hour1":265}},
{"id":"demo9","name":"Amanda","age":27,"state":"GO","city":"Goiânia","district":"Setor Bueno","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-09.jpg","gallery":["model-09.jpg","model-14.jpg","model-05.jpg","model-12.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":105,"min30":175,"hour1":315}},
{"id":"demo10","name":"Sofia","age":26,"state":"CE","city":"Fortaleza","district":"Meireles","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"model-10.jpg","gallery":["model-10.jpg","model-15.jpg","model-01.jpg","model-13.jpg"],"video":"lilas-video-final.mp4","prices":{"min15":115,"min30":185,"hour1":335}}
];

function userProfiles(){
  const keys=["lilasPerfil","lilasPerfis"];
  let out=[];
  for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k)||"null");if(Array.isArray(v))out.push(...v);else if(v&&typeof v==="object")out.push(v)}catch{}}
  return out.map((p,i)=>({
    id:p.id||`user${i}`,name:p.nome||p.name||"Perfil",age:p.idade||p.age||"",
    state:(p.estado||p.state||"").toUpperCase(),city:p.cidade||p.city||"",district:p.bairro||p.district||"",
    category:p.categoria||p.category||"Acompanhantes",gender:p.genero||p.gender||"Mulheres",
    text:p.descricao||p.text||"Veja mais informações no perfil.",verified:!!(p.verificado||p.verified),
    image:p.fotoCapa||p.image||p.foto||((p.fotos||[])[0]||""),
    gallery:(p.fotos||[]).filter(Boolean),
    video:(p.video||((p.videos||[])[0])||""),
    prices:{
      min15:Number(p.preco15||p.valor15||p.caches?.min15||0)||0,
      min30:Number(p.preco30||p.valor30||p.caches?.min30||0)||0,
      hour1:Number(p.preco60||p.valor60||p.valor1h||p.caches?.hora1||0)||0
    }
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
  $("#cards").innerHTML=rows.map(p=>`<article class="card" data-id="${p.id}">
    <div class="card-media">${p.coverMedia==="video"&&p.video?`<video class="card-cover-video" src="${p.video}" muted autoplay loop playsinline preload="metadata" aria-label="Vídeo de ${p.name}"></video>`:(p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>Foto do perfil<br>${p.name}</span>`)}${(p.image||p.video)?'<span class="media-watermark">www.lilassclub.com.br</span>':''}${p.video?'<span class="video-indicator" title="Perfil com vídeo">▶</span>':''}</div>
    <button class="fav ${fav.includes(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favoritar">${fav.includes(p.id)?"♥":"♡"}</button>
    <div class="card-body"><div class="card-title">${p.name}${p.age?`, ${p.age}`:""} ${p.verified?'<span class="verified">✓</span>':""}</div>
    <div class="meta">${[p.district,p.city,p.state].filter(Boolean).join(" • ")}</div><p class="tagline">${p.text}</p></div>
  </article>`).join("");
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
  if(!document.getElementById('adminAiModal')){
    document.body.insertAdjacentHTML('beforeend',`<div id="adminAiModal" class="demo-layer hidden" role="dialog" aria-modal="true">
      <div class="admin-ai-card"><button class="demo-close" id="adminAiClose" aria-label="Fechar">×</button>
        <div class="admin-ai-head"><div><small>LILÁS CLUB</small><h2>Admin IA</h2></div><span>DEMO FICTÍCIA</span></div>
        <p class="admin-ai-note">Ambiente administrativo de teste. Nenhuma cobrança, notificação ou aprovação é executada de verdade.</p>
        <div class="admin-ai-kpis"><div><b>10</b><span>perfis demo</span></div><div><b>3</b><span>revisões</span></div><div><b>2</b><span>alertas</span></div><div><b>R$ 0</b><span>movimentação real</span></div></div>
        <div class="admin-ai-tabs"><button class="active" data-admin-tab="review">Revisão</button><button data-admin-tab="alerts">Alertas</button><button data-admin-tab="finance">Financeiro</button><button data-admin-tab="assistant">Assistente IA</button></div>
        <div class="admin-ai-panel active" data-admin-panel="review">
          <div class="admin-row"><div><b>Marina, São Paulo</b><small>Mídia e valores preenchidos para o teste.</small></div><button data-demo-action="Aprovação simulada registrada">APROVAR</button></div>
          <div class="admin-row"><div><b>Luna, Curitiba</b><small>Vídeo de demonstração disponível.</small></div><button data-demo-action="Perfil encaminhado para revisão fictícia">REVISAR</button></div>
          <div class="admin-row"><div><b>Maya, Salvador</b><small>Cadastro demonstrativo completo.</small></div><button data-demo-action="Aprovação simulada registrada">APROVAR</button></div>
        </div>
        <div class="admin-ai-panel" data-admin-panel="alerts"><div class="admin-row"><div><b>⚠️ Alerta de teste</b><small>2 perfis marcados para conferência manual.</small></div><button data-demo-action="Alertas fictícios revisados">VER</button></div></div>
        <div class="admin-ai-panel" data-admin-panel="finance"><div class="admin-ai-kpis finance"><div><b>R$ 620</b><span>receita simulada</span></div><div><b>R$ 390</b><span>pendente simulado</span></div><div><b>0</b><span>transações reais</span></div></div><p class="admin-ai-note"><strong>Teste somente:</strong> nenhum gateway ou dado bancário está conectado.</p></div>
        <div class="admin-ai-panel" data-admin-panel="assistant"><div class="admin-ai-chat"><input id="adminAiQuestion" placeholder="Ex.: quais perfis precisam de revisão?"><button id="adminAiAsk">PERGUNTAR</button></div><div id="adminAiAnswer" class="admin-ai-answer">Digite uma pergunta sobre o ambiente de teste.</div></div>
        <div id="adminAiToast" class="admin-ai-toast hidden"></div>
      </div>
    </div>`);
    document.getElementById('adminAiClose').onclick=()=>document.getElementById('adminAiModal').classList.add('hidden');
    document.getElementById('adminAiModal').onclick=e=>{if(e.target.id==='adminAiModal')e.currentTarget.classList.add('hidden')};
    document.querySelectorAll('[data-admin-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-admin-tab]').forEach(x=>x.classList.remove('active'));document.querySelectorAll('[data-admin-panel]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector(`[data-admin-panel="${b.dataset.adminTab}"]`).classList.add('active')});
    document.querySelectorAll('[data-demo-action]').forEach(b=>b.onclick=()=>demoToast(b.dataset.demoAction));
    document.getElementById('adminAiAsk').onclick=askAdminAI;
  }
  const drawerLinks=[...document.querySelectorAll('#drawer a')];
  const panel=drawerLinks.find(a=>normalize(a.textContent).includes('painel de controle'));
  if(panel){panel.href='#';panel.textContent='Painel de controle • Admin IA';panel.onclick=e=>{e.preventDefault();closeDrawer();openAdminAI()}}
}
function demoToast(msg){const t=document.getElementById('adminAiToast');t.textContent=msg+' — somente demonstração.';t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2200)}
function askAdminAI(){
  const q=normalize(document.getElementById('adminAiQuestion').value);let a='Posso resumir perfis demo, revisão, alertas e financeiro fictício.';
  if(q.includes('revis')||q.includes('perfil'))a='Há 3 itens na fila fictícia de revisão. As mídias e os valores de teste estão preenchidos.';
  else if(q.includes('alert'))a='Há 2 alertas simulados para conferência manual.';
  else if(q.includes('finance')||q.includes('valor')||q.includes('pag'))a='O painel financeiro é 100% demonstrativo e não existe gateway ou transação real conectada.';
  document.getElementById('adminAiAnswer').textContent=a;
}
function openAdminAI(){ensureDemoLayers();document.getElementById('adminAiModal').classList.remove('hidden')}
function openDemoProfile(id){
  const p=allProfiles().find(x=>x.id===id);if(!p)return;ensureDemoLayers();
  const gallery=(p.gallery&&p.gallery.length?p.gallery:[p.image]).filter(Boolean);
  const prices=p.prices||{};
  const media=[];
  gallery.forEach((src,i)=>{media.push({type:'image',src});if(i===0&&p.video)media.push({type:'video',src:p.video})});
  const thumbs=media.map((m,i)=>`<button class="demo-thumb ${i===0?'active':''}" data-demo-type="${m.type}" data-demo-src="${escText(m.src)}">${m.type==='video'?`<video src="${escText(m.src)}" muted playsinline preload="metadata"></video><span class="thumb-play">▶</span>`:`<img src="${escText(m.src)}" alt="">`}</button>`).join('');
  const first=media[0]||{type:'image',src:p.image||''};
  const main=first.type==='video'?`<video id="demoMainVideo" controls playsinline preload="metadata" src="${escText(first.src)}"></video>`:`<img id="demoMainImage" src="${escText(first.src)}" alt="${escText(p.name)}">`;
  document.getElementById('profileDemoContent').innerHTML=`<div class="demo-profile-grid"><div><div class="demo-main-media" id="demoMainMedia">${main}<span class="media-watermark large">www.lilassclub.com.br</span></div><div class="demo-thumbs">${thumbs}</div></div><div class="demo-profile-info"><small>PERFIL DEMONSTRATIVO</small><h2>${escText(p.name)}${p.age?`, ${p.age}`:''} ${p.verified?'<span class="verified">✓</span>':''}</h2><p>${escText([p.district,p.city,p.state].filter(Boolean).join(' • '))}</p><div class="demo-rates"><div><span>15 minutos</span><b>${moneyBR(prices.min15)}</b></div><div><span>30 minutos</span><b>${moneyBR(prices.min30)}</b></div><div><span>1 hora</span><b>${moneyBR(prices.hour1)}</b></div></div><p class="demo-copy">${escText(p.text)}</p><div class="demo-only">DEMO • dados e valores fictícios para teste</div></div></div>`;
  document.querySelectorAll('[data-demo-src]').forEach(b=>b.onclick=()=>{
    const box=document.getElementById('demoMainMedia');
    box.querySelector('img,video')?.remove();
    let el;
    if(b.dataset.demoType==='video'){
      el=document.createElement('video');el.id='demoMainVideo';el.controls=true;el.playsInline=true;el.preload='metadata';el.src=b.dataset.demoSrc;
    }else{
      el=document.createElement('img');el.id='demoMainImage';el.alt=p.name;el.src=b.dataset.demoSrc;
    }
    box.prepend(el);
    document.querySelectorAll('[data-demo-src]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  });
  document.getElementById('profileDemoModal').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded",()=>{
  fillStates(); render(); ensureDemoLayers();
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
