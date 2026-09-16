const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
let selectedCategory="Acompanhantes",selectedGender="Todos",viewMode="grid",onlyFavorites=false;
let cityCache={};

const demoProfiles=[
{id:"demo1",name:"Marina",age:27,state:"SP",city:"São Paulo",district:"Jardins",category:"Acompanhantes",gender:"Mulheres",text:"Atendimento com discrição e elegância.",verified:true,image:""},
{id:"demo2",name:"Bianca",age:25,state:"RJ",city:"Rio de Janeiro",district:"Copacabana",category:"Acompanhantes",gender:"Mulheres",text:"Perfil verificado • fotos e informações.",verified:true,image:""},
{id:"demo3",name:"Carla",age:29,state:"MG",city:"Belo Horizonte",district:"Savassi",category:"Massagens",gender:"Mulheres",text:"Atendimento mediante agendamento.",verified:false,image:""},
{id:"demo4",name:"Alex",age:28,state:"PR",city:"Curitiba",district:"Centro",category:"Videochamadas",gender:"Homens",text:"Disponibilidade informada no perfil.",verified:true,image:""}
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
    image:p.fotoCapa||p.image||p.foto||((p.fotos||[])[0]||"")
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
    <div class="card-media">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>Foto do perfil<br>${p.name}</span>`}</div>
    <button class="fav ${fav.includes(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favoritar">${fav.includes(p.id)?"♥":"♡"}</button>
    <div class="card-body"><div class="card-title">${p.name}${p.age?`, ${p.age}`:""} ${p.verified?'<span class="verified">✓</span>':""}</div>
    <div class="meta">${[p.district,p.city,p.state].filter(Boolean).join(" • ")}</div><p class="tagline">${p.text}</p></div>
  </article>`).join("");
  $$("[data-fav]").forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(b.dataset.fav)});
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
