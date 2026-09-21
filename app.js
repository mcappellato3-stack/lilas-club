const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
let selectedCategory="Acompanhantes",selectedGender="Todos",viewMode="grid",onlyFavorites=false;
let cityCache={};

const demoProfiles=[{"id":"demo1","name":"Marina","age":24,"state":"SP","city":"São Paulo","district":"Jardins","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-01.jpg","gallery":["new-01.jpg","new-06.jpg","model-01.jpg","model-08.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo2","name":"Bianca","age":25,"state":"RJ","city":"Rio de Janeiro","district":"Copacabana","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-02.jpg","gallery":["new-02.jpg","new-07.jpg","model-02.jpg","model-09.jpg"],"video":"video-01.mp4","prices":{"min15":100,"min30":165,"hour1":305},"coverMedia":"video"},{"id":"demo3","name":"Carla","age":26,"state":"MG","city":"Belo Horizonte","district":"Savassi","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-03.jpg","gallery":["new-03.jpg","new-08.jpg","model-03.jpg","model-10.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo4","name":"Luna","age":27,"state":"PR","city":"Curitiba","district":"Batel","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-04.jpg","gallery":["new-04.jpg","new-09.jpg","model-04.jpg","model-11.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo5","name":"Maya","age":28,"state":"BA","city":"Salvador","district":"Barra","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-05.jpg","gallery":["new-05.jpg","new-10.jpg","model-05.jpg","model-12.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}},{"id":"demo6","name":"Isabela","age":29,"state":"DF","city":"Brasília","district":"Asa Sul","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-06.jpg","gallery":["new-06.jpg","new-11.jpg","model-06.jpg","model-13.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo7","name":"Camila","age":30,"state":"SC","city":"Florianópolis","district":"Centro","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-07.jpg","gallery":["new-07.jpg","new-12.jpg","model-07.jpg","model-14.jpg"],"video":"video-02.mp4","prices":{"min15":100,"min30":165,"hour1":305},"coverMedia":"video"},{"id":"demo8","name":"Júlia","age":31,"state":"PE","city":"Recife","district":"Boa Viagem","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-08.jpg","gallery":["new-08.jpg","new-13.jpg","model-08.jpg","model-15.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo9","name":"Amanda","age":24,"state":"GO","city":"Goiânia","district":"Setor Bueno","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-09.jpg","gallery":["new-09.jpg","new-14.jpg","model-09.jpg","model-01.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo10","name":"Sofia","age":25,"state":"CE","city":"Fortaleza","district":"Meireles","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-10.jpg","gallery":["new-10.jpg","new-15.jpg","model-10.jpg","model-02.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}},{"id":"demo11","name":"Valentina","age":26,"state":"RS","city":"Porto Alegre","district":"Moinhos de Vento","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-11.jpg","gallery":["new-11.jpg","new-16.jpg","model-11.jpg","model-03.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo12","name":"Natalia","age":27,"state":"ES","city":"Vitória","district":"Praia do Canto","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-12.jpg","gallery":["new-12.jpg","new-01.jpg","model-12.jpg","model-04.jpg"],"video":"video-03.mp4","prices":{"min15":100,"min30":165,"hour1":305},"coverMedia":"video"},{"id":"demo13","name":"Larissa","age":28,"state":"PA","city":"Belém","district":"Umarizal","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-13.jpg","gallery":["new-13.jpg","new-02.jpg","model-13.jpg","model-05.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo14","name":"Bruna","age":29,"state":"AM","city":"Manaus","district":"Adrianópolis","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-14.jpg","gallery":["new-14.jpg","new-03.jpg","model-14.jpg","model-06.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo15","name":"Melissa","age":30,"state":"RN","city":"Natal","district":"Ponta Negra","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-15.jpg","gallery":["new-15.jpg","new-04.jpg","model-15.jpg","model-07.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}},{"id":"demo16","name":"Gabriela","age":31,"state":"PB","city":"João Pessoa","district":"Tambaú","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-16.jpg","gallery":["new-16.jpg","new-05.jpg","model-01.jpg","model-08.jpg"],"video":"","prices":{"min15":90,"min30":150,"hour1":280}},{"id":"demo17","name":"Juliana","age":24,"state":"AL","city":"Maceió","district":"Pajuçara","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-17.png","gallery":["new-17.png","new-05.jpg","model-04.jpg","new-11.jpg"],"video":"","prices":{"min15":100,"min30":165,"hour1":305}},{"id":"demo18","name":"Helena","age":25,"state":"SE","city":"Aracaju","district":"Atalaia","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-18.png","gallery":["new-18.png","new-09.jpg","model-06.jpg","new-14.jpg"],"video":"","prices":{"min15":110,"min30":180,"hour1":330}},{"id":"demo19","name":"Renata","age":27,"state":"MT","city":"Cuiabá","district":"Goiabeiras","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":false,"image":"new-19.png","gallery":["new-19.png","new-02.jpg","model-12.jpg","new-16.jpg"],"video":"","prices":{"min15":120,"min30":195,"hour1":355}},{"id":"demo20","name":"Paola","age":28,"state":"MS","city":"Campo Grande","district":"Santa Fé","category":"Acompanhantes","gender":"Mulheres","text":"Perfil demonstrativo para teste do Lilás Club.","verified":true,"image":"new-20.png","gallery":["new-20.png","new-03.jpg","model-15.jpg","new-07.jpg"],"video":"","prices":{"min15":130,"min30":210,"hour1":380}}];

let hydratedUserProfiles=[];
const lilasObjectUrls=[];
function rawUserProfiles(){
  const keys=["lilasPerfil","lilasPerfis"];
  let out=[];
  for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k)||"null");if(Array.isArray(v))out.push(...v);else if(v&&typeof v==="object")out.push(v)}catch{}}
  return out;
}
function openLilDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('lilasClubMediaDB',1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('assets'))db.createObjectStore('assets')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function getAssetBlob(key){if(!key)return null;try{const db=await openLilDB();return await new Promise((resolve,reject)=>{const tx=db.transaction('assets','readonly');const st=tx.objectStore('assets');const rq=st.get(key);rq.onsuccess=()=>resolve(rq.result||null);rq.onerror=()=>reject(rq.error)})}catch{return null}}
async function hydrateUserProfiles(){
  lilasObjectUrls.splice(0).forEach(u=>{try{URL.revokeObjectURL(u)}catch{}});
  const raw=rawUserProfiles();
  const list=[];
  for(let i=0;i<raw.length;i++){
    const p=raw[i]||{};
    const videoKeys=(p.videoKeys||p.videoBlobKeys||[]).filter(Boolean);
    const videoUrls=[];
    for(const key of videoKeys){const blob=await getAssetBlob(key);if(blob instanceof Blob){const url=URL.createObjectURL(blob);lilasObjectUrls.push(url);videoUrls.push(url)}}
    const firstVideo=videoUrls[0]||p.video||((p.videos||[])[0])||'';
    const coverPref=p.coverMedia||p.capaMidia||(((firstVideo)&&((p.videoCapas||[]).length||videoUrls.length))?'video':'');
    list.push({
      id:p.id||`user${i}`,name:p.nome||p.name||"Perfil",age:p.idade||p.age||"",
      state:(p.estado||p.state||"").toUpperCase(),city:p.cidade||p.city||"",district:p.bairro||p.district||"",
      category:p.categoria||p.category||"Acompanhantes",gender:p.genero||p.gender||"Mulheres",
      text:p.descricao||p.text||"Veja mais informações no perfil.",verified:!!(p.verificado||p.verified),
      image:p.fotoCapa||p.image||p.foto||((p.fotos||[])[0]||""),
      gallery:(p.fotos||[]).filter(Boolean),
      video:firstVideo,
      videosResolved:videoUrls,
      coverMedia:coverPref,
      prices:{
        min15:Number(p.preco15||p.valor15||p.caches?.min15||0)||0,
        min30:Number(p.preco30||p.valor30||p.caches?.min30||0)||0,
        hour1:Number(p.preco60||p.valor60||p.valor1h||p.caches?.hora1||0)||0
      }
    });
  }
  hydratedUserProfiles=list;
  return list;
}
function userProfiles(){return hydratedUserProfiles}
const allProfiles=()=>[...hydratedUserProfiles,...demoProfiles];

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
  $("#cards").innerHTML=rows.map((p,index)=>`<article class="card" data-id="${p.id}">
    <div class="card-media">${p.image?`<span class="media-backdrop" style="background-image:url('${p.image}')"></span>`:''}${badgeForCard(index)}${p.coverMedia==="video"&&p.video?`<video class="card-cover-video" src="${p.video}" muted autoplay loop playsinline preload="metadata" aria-label="Vídeo de ${p.name}"></video>`:(p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>Foto do perfil<br>${p.name}</span>`)}${p.video?'<span class="video-indicator" title="Perfil com vídeo">▶ VÍDEO</span>':''}</div>
    <button class="fav ${fav.includes(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favoritar">${fav.includes(p.id)?"♥":"♡"}</button>
    <div class="card-body"><div class="card-title">${p.name}${p.age?`, ${p.age}`:""} ${p.verified?'<span class="verified">✓</span>':""}</div>
    <div class="meta">${[p.district,p.city,p.state].filter(Boolean).join(" • ")}</div>${priceLabel(p.prices)}<p class="tagline">${p.text}</p></div>
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

window.addEventListener('storage',async()=>{await hydrateUserProfiles();render()});
window.addEventListener('focus',async()=>{await hydrateUserProfiles();render()});



// ===== Lilás Club — complementos DEMO autorizados =====
function moneyBR(v){return v?`R$ ${Number(v).toLocaleString('pt-BR')}`:'—'}
function minPositivePrice(prices={}){const vals=[prices.min15,prices.min30,prices.hour1].map(v=>Number(v)||0).filter(v=>v>0);return vals.length?Math.min(...vals):0}
function priceLabel(prices={}){const min=minPositivePrice(prices);return min?`<div class="card-price"><span>A partir de</span><b>${moneyBR(min)}</b></div>`:''}
function badgeForCard(index){const seq=[["agora","🟢","AGORA"],null,["cheguei","📍🌃","CHEGUEI"],["favorita","❤️","FAVORITA"],null,["emalta","🔥","EM ALTA"]];const item=seq[index%seq.length];return !item?'':`<span class="smart-badge ${item[0]}"><span class="emoji">${item[1]}</span><span class="txt">${item[2]}</span></span>`}
function profileRates(prices={}){const map=[["15 minutos",prices.min15],["30 minutos",prices.min30],["1 hora",prices.hour1]].filter(([,v])=>Number(v)>0);return map.length?map.map(([label,v])=>`<div><span>${label}</span><b>${moneyBR(v)}</b></div>`).join(''):`<div><span>Valores</span><b>A combinar</b></div>`}
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
        <div class="admin-ai-kpis"><div><b>16</b><span>perfis demo</span></div><div><b>3</b><span>revisões</span></div><div><b>2</b><span>alertas</span></div><div><b>R$ 0</b><span>movimentação real</span></div></div>
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
  const videos=(p.videosResolved&&p.videosResolved.length?p.videosResolved:(p.video?[p.video]:[])).filter(Boolean);
  if(p.coverMedia==='video'&&videos.length){media.push({type:'video',src:videos[0]});gallery.forEach(src=>media.push({type:'image',src}));videos.slice(1).forEach(src=>media.push({type:'video',src}));}
  else {gallery.forEach((src,i)=>{media.push({type:'image',src});if(i===0&&videos.length)media.push({type:'video',src:videos[0]})});videos.slice(1).forEach(src=>media.push({type:'video',src}));}
  const thumbs=media.map((m,i)=>`<button class="demo-thumb ${i===0?'active':''}" data-demo-type="${m.type}" data-demo-src="${escText(m.src)}">${m.type==='video'?`<video src="${escText(m.src)}" muted playsinline preload="metadata"></video><span class="thumb-play">▶</span>`:`<img src="${escText(m.src)}" alt="">`}</button>`).join('');
  const first=media[0]||{type:'image',src:p.image||''};
  const main=first.type==='video'?`<video id="demoMainVideo" controls playsinline preload="metadata" src="${escText(first.src)}"></video>`:`<img id="demoMainImage" src="${escText(first.src)}" alt="${escText(p.name)}">`;
  document.getElementById('profileDemoContent').innerHTML=`<div class="demo-profile-grid"><div><div class="demo-main-media" id="demoMainMedia"><span class="profile-backdrop" style="background-image:url('${escText(p.image||'')}')"></span>${main}</div><div class="demo-thumbs">${thumbs}</div></div><div class="demo-profile-info"><small>PERFIL DEMONSTRATIVO</small><h2>${escText(p.name)}${p.age?`, ${p.age}`:''} ${p.verified?'<span class="verified">✓</span>':''}</h2><p>${escText([p.district,p.city,p.state].filter(Boolean).join(' • '))}</p><div class="demo-rates">${profileRates(prices)}</div><p class="demo-copy">${escText(p.text)}</p><div class="demo-only">DEMO • dados e valores fictícios para teste</div></div></div>`;
  document.querySelectorAll('[data-demo-src]').forEach(b=>b.onclick=()=>{
    const box=document.getElementById('demoMainMedia');
    box.querySelector(':scope > img, :scope > video')?.remove();
    let el;
    if(b.dataset.demoType==='video'){
      el=document.createElement('video');el.id='demoMainVideo';el.controls=true;el.playsInline=true;el.preload='metadata';el.muted=false;el.src=b.dataset.demoSrc;
    }else{
      el=document.createElement('img');el.id='demoMainImage';el.alt=p.name;el.src=b.dataset.demoSrc;
    }
    box.prepend(el);
    document.querySelectorAll('[data-demo-src]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  });
  document.getElementById('profileDemoModal').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", async ()=>{
  fillStates(); await hydrateUserProfiles(); render(); ensureDemoLayers();
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
