const LILAS_STATES=[
["AC","Acre"],["AL","Alagoas"],["AP","Amapá"],["AM","Amazonas"],["BA","Bahia"],["CE","Ceará"],["DF","Distrito Federal"],["ES","Espírito Santo"],["GO","Goiás"],["MA","Maranhão"],["MT","Mato Grosso"],["MS","Mato Grosso do Sul"],["MG","Minas Gerais"],["PA","Pará"],["PB","Paraíba"],["PR","Paraná"],["PE","Pernambuco"],["PI","Piauí"],["RJ","Rio de Janeiro"],["RN","Rio Grande do Norte"],["RS","Rio Grande do Sul"],["RO","Rondônia"],["RR","Roraima"],["SC","Santa Catarina"],["SP","São Paulo"],["SE","Sergipe"],["TO","Tocantins"]];
const POPULAR_STATES=["SP","RJ","MG","PR","SC","BA","PE","CE"];
const POPULAR_CITIES=[
{city:"São Paulo",uf:"SP"},{city:"Rio de Janeiro",uf:"RJ"},{city:"Belo Horizonte",uf:"MG"},
{city:"Curitiba",uf:"PR"},{city:"Brasília",uf:"DF"},{city:"Campinas",uf:"SP"},
{city:"Porto Alegre",uf:"RS"},{city:"Salvador",uf:"BA"},{city:"Recife",uf:"PE"},
{city:"Fortaleza",uf:"CE"},{city:"Florianópolis",uf:"SC"},{city:"Goiânia",uf:"GO"}
];
const FALLBACK_CITIES={
SP:["São Paulo","Campinas","Guarulhos","Santo André","São Bernardo do Campo","Osasco","Sorocaba","Ribeirão Preto","Santos","São José dos Campos"],
RJ:["Rio de Janeiro","Niterói","Duque de Caxias","Nova Iguaçu","São Gonçalo","Petrópolis","Cabo Frio"],
MG:["Belo Horizonte","Uberlândia","Contagem","Juiz de Fora","Betim","Uberaba"],
PR:["Curitiba","Londrina","Maringá","Cascavel","Foz do Iguaçu"],
SC:["Florianópolis","Joinville","Balneário Camboriú","Blumenau","Itajaí"],
BA:["Salvador","Feira de Santana","Vitória da Conquista","Porto Seguro"],
PE:["Recife","Jaboatão dos Guararapes","Olinda","Caruaru"],
CE:["Fortaleza","Caucaia","Juazeiro do Norte"],DF:["Brasília"],RS:["Porto Alegre","Caxias do Sul","Canoas"],GO:["Goiânia","Aparecida de Goiânia","Anápolis"]
};
