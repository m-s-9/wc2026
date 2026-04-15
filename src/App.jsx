import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');`;

const T = {
  bg:"#F7F5F2", surface:"#FFFFFF", border:"#E8E4DF", borderMd:"#D6D0C8",
  text:"#1A1A1A", muted:"#7A7369", faint:"#B0A89E",
  red:"#C84B31", redLight:"#FAF0ED", redMid:"#F0C4B8", ink:"#111111",
};
const H = { fontFamily:"'Bricolage Grotesque',sans-serif" };
const B = { fontFamily:"'DM Sans',sans-serif" };
const CC = {UEFA:"#2563EB",CONMEBOL:"#D97706",CAF:"#16A34A",AFC:"#DC2626",CONCACAF:"#7C3AED",OFC:"#0891B2"};

// ── TEAMS ─────────────────────────────────────────────────────────────────────
const TEAMS = [
  {name:"France",conf:"UEFA",elo:1985,flag:"🇫🇷"},
  {name:"Argentina",conf:"CONMEBOL",elo:1965,flag:"🇦🇷"},
  {name:"England",conf:"UEFA",elo:1960,flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
  {name:"Brazil",conf:"CONMEBOL",elo:1955,flag:"🇧🇷"},
  {name:"Spain",conf:"UEFA",elo:1952,flag:"🇪🇸"},
  {name:"Germany",conf:"UEFA",elo:1940,flag:"🇩🇪"},
  {name:"Portugal",conf:"UEFA",elo:1935,flag:"🇵🇹"},
  {name:"Netherlands",conf:"UEFA",elo:1912,flag:"🇳🇱"},
  {name:"Belgium",conf:"UEFA",elo:1893,flag:"🇧🇪"},
  {name:"Italy",conf:"UEFA",elo:1882,flag:"🇮🇹"},
  {name:"Croatia",conf:"UEFA",elo:1870,flag:"🇭🇷"},
  {name:"Morocco",conf:"CAF",elo:1860,flag:"🇲🇦"},
  {name:"Austria",conf:"UEFA",elo:1855,flag:"🇦🇹"},
  {name:"Uruguay",conf:"CONMEBOL",elo:1855,flag:"🇺🇾"},
  {name:"Japan",conf:"AFC",elo:1845,flag:"🇯🇵"},
  {name:"Switzerland",conf:"UEFA",elo:1845,flag:"🇨🇭"},
  {name:"Colombia",conf:"CONMEBOL",elo:1840,flag:"🇨🇴"},
  {name:"Turkey",conf:"UEFA",elo:1838,flag:"🇹🇷"},
  {name:"USA",conf:"CONCACAF",elo:1835,flag:"🇺🇸"},
  {name:"Serbia",conf:"UEFA",elo:1830,flag:"🇷🇸"},
  {name:"Senegal",conf:"CAF",elo:1828,flag:"🇸🇳"},
  {name:"Denmark",conf:"UEFA",elo:1825,flag:"🇩🇰"},
  {name:"South Korea",conf:"AFC",elo:1815,flag:"🇰🇷"},
  {name:"Mexico",conf:"CONCACAF",elo:1810,flag:"🇲🇽"},
  {name:"Ecuador",conf:"CONMEBOL",elo:1810,flag:"🇪🇨"},
  {name:"Canada",conf:"CONCACAF",elo:1800,flag:"🇨🇦"},
  {name:"Iran",conf:"AFC",elo:1800,flag:"🇮🇷"},
  {name:"Nigeria",conf:"CAF",elo:1798,flag:"🇳🇬"},
  {name:"Egypt",conf:"CAF",elo:1788,flag:"🇪🇬"},
  {name:"Paraguay",conf:"CONMEBOL",elo:1785,flag:"🇵🇾"},
  {name:"Saudi Arabia",conf:"AFC",elo:1780,flag:"🇸🇦"},
  {name:"Hungary",conf:"UEFA",elo:1778,flag:"🇭🇺"},
  {name:"Scotland",conf:"UEFA",elo:1774,flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿"},
  {name:"Cameroon",conf:"CAF",elo:1770,flag:"🇨🇲"},
  {name:"Ivory Coast",conf:"CAF",elo:1762,flag:"🇨🇮"},
  {name:"Australia",conf:"AFC",elo:1758,flag:"🇦🇺"},
  {name:"Venezuela",conf:"CONMEBOL",elo:1748,flag:"🇻🇪"},
  {name:"South Africa",conf:"CAF",elo:1738,flag:"🇿🇦"},
  {name:"Tunisia",conf:"CAF",elo:1730,flag:"🇹🇳"},
  {name:"Panama",conf:"CONCACAF",elo:1728,flag:"🇵🇦"},
  {name:"Uzbekistan",conf:"AFC",elo:1728,flag:"🇺🇿"},
  {name:"Algeria",conf:"CAF",elo:1720,flag:"🇩🇿"},
  {name:"Georgia",conf:"UEFA",elo:1718,flag:"🇬🇪"},
  {name:"Costa Rica",conf:"CONCACAF",elo:1715,flag:"🇨🇷"},
  {name:"Jordan",conf:"AFC",elo:1708,flag:"🇯🇴"},
  {name:"Honduras",conf:"CONCACAF",elo:1698,flag:"🇭🇳"},
  {name:"Iraq",conf:"AFC",elo:1695,flag:"🇮🇶"},
  {name:"Indonesia",conf:"AFC",elo:1658,flag:"🇮🇩"},
];

// ── SQUADS ────────────────────────────────────────────────────────────────────
const SQUADS = {
  "France":[
    {name:"Mike Maignan",pos:"GK",club:"AC Milan",age:29,rating:88},
    {name:"Théo Hernandez",pos:"LB",club:"AC Milan",age:27,rating:86},
    {name:"William Saliba",pos:"CB",club:"Arsenal",age:24,rating:87},
    {name:"Ibrahima Konaté",pos:"CB",club:"Liverpool",age:25,rating:85},
    {name:"Jules Koundé",pos:"RB",club:"Barcelona",age:27,rating:86},
    {name:"Eduardo Camavinga",pos:"CM",club:"Real Madrid",age:22,rating:85},
    {name:"Aurélien Tchouaméni",pos:"DM",club:"Real Madrid",age:25,rating:86},
    {name:"Antoine Griezmann",pos:"CAM",club:"Atlético Madrid",age:35,rating:86},
    {name:"Ousmane Dembélé",pos:"RW",club:"PSG",age:28,rating:86},
    {name:"Marcus Thuram",pos:"ST",club:"Inter Milan",age:27,rating:85},
    {name:"Kylian Mbappé",pos:"LW",club:"Real Madrid",age:27,rating:93},
    {name:"Kingsley Coman",pos:"RW",club:"Bayern Munich",age:28,rating:83},
    {name:"Randal Kolo Muani",pos:"ST",club:"PSG",age:26,rating:82},
    {name:"N'Golo Kanté",pos:"DM",club:"Al-Ittihad",age:34,rating:81},
    {name:"Benjamin Pavard",pos:"CB",club:"Inter Milan",age:29,rating:83},
  ],
  "Argentina":[
    {name:"Emiliano Martínez",pos:"GK",club:"Aston Villa",age:32,rating:89},
    {name:"Nahuel Molina",pos:"RB",club:"Atlético Madrid",age:27,rating:82},
    {name:"Cristian Romero",pos:"CB",club:"Tottenham",age:26,rating:86},
    {name:"Nicolás Otamendi",pos:"CB",club:"Benfica",age:37,rating:80},
    {name:"Nicolás Tagliafico",pos:"LB",club:"Lyon",age:32,rating:80},
    {name:"Rodrigo De Paul",pos:"CM",club:"Atlético Madrid",age:30,rating:84},
    {name:"Alexis Mac Allister",pos:"CM",club:"Liverpool",age:26,rating:85},
    {name:"Enzo Fernández",pos:"CM",club:"Chelsea",age:24,rating:83},
    {name:"Lionel Messi",pos:"CF",club:"Inter Miami",age:38,rating:91},
    {name:"Julián Álvarez",pos:"ST",club:"Atlético Madrid",age:25,rating:86},
    {name:"Lautaro Martínez",pos:"ST",club:"Inter Milan",age:27,rating:87},
    {name:"Paulo Dybala",pos:"CAM",club:"Roma",age:32,rating:83},
    {name:"Ángel Di María",pos:"RW",club:"Benfica",age:37,rating:80},
    {name:"Thiago Almada",pos:"CAM",club:"Botafogo",age:23,rating:79},
    {name:"Germán Pezzella",pos:"CB",club:"Real Betis",age:33,rating:78},
  ],
  "England":[
    {name:"Jordan Pickford",pos:"GK",club:"Everton",age:31,rating:83},
    {name:"Trent Alexander-Arnold",pos:"RB",club:"Real Madrid",age:27,rating:88},
    {name:"John Stones",pos:"CB",club:"Manchester City",age:31,rating:85},
    {name:"Harry Maguire",pos:"CB",club:"Manchester United",age:33,rating:80},
    {name:"Luke Shaw",pos:"LB",club:"Manchester United",age:30,rating:82},
    {name:"Declan Rice",pos:"DM",club:"Arsenal",age:26,rating:87},
    {name:"Jude Bellingham",pos:"CAM",club:"Real Madrid",age:22,rating:90},
    {name:"Phil Foden",pos:"AM",club:"Manchester City",age:25,rating:88},
    {name:"Bukayo Saka",pos:"RW",club:"Arsenal",age:24,rating:88},
    {name:"Harry Kane",pos:"ST",club:"Bayern Munich",age:32,rating:89},
    {name:"Cole Palmer",pos:"CAM",club:"Chelsea",age:23,rating:86},
    {name:"Marcus Rashford",pos:"LW",club:"Manchester United",age:27,rating:83},
    {name:"Ollie Watkins",pos:"ST",club:"Aston Villa",age:29,rating:83},
    {name:"Jack Grealish",pos:"LW",club:"Manchester City",age:30,rating:82},
    {name:"Conor Gallagher",pos:"CM",club:"Atlético Madrid",age:25,rating:82},
  ],
  "Brazil":[
    {name:"Alisson Becker",pos:"GK",club:"Liverpool",age:32,rating:89},
    {name:"Danilo",pos:"RB",club:"Juventus",age:33,rating:82},
    {name:"Marquinhos",pos:"CB",club:"PSG",age:30,rating:86},
    {name:"Gabriel Magalhães",pos:"CB",club:"Arsenal",age:27,rating:85},
    {name:"Bruno Guimarães",pos:"DM",club:"Newcastle",age:27,rating:86},
    {name:"Lucas Paquetá",pos:"CM",club:"West Ham",age:27,rating:84},
    {name:"Raphinha",pos:"RW",club:"Barcelona",age:28,rating:85},
    {name:"Vinícius Jr",pos:"LW",club:"Real Madrid",age:24,rating:91},
    {name:"Rodrygo",pos:"ST",club:"Real Madrid",age:24,rating:85},
    {name:"Endrick",pos:"ST",club:"Real Madrid",age:18,rating:79},
    {name:"Éder Militão",pos:"CB",club:"Real Madrid",age:27,rating:85},
    {name:"Casemiro",pos:"DM",club:"Manchester United",age:33,rating:83},
    {name:"Gabriel Jesus",pos:"ST",club:"Arsenal",age:27,rating:81},
    {name:"Antony",pos:"RW",club:"Manchester United",age:24,rating:79},
    {name:"Wendell",pos:"LB",club:"Porto",age:30,rating:78},
  ],
  "Spain":[
    {name:"Unai Simón",pos:"GK",club:"Athletic Bilbao",age:27,rating:83},
    {name:"Dani Carvajal",pos:"RB",club:"Real Madrid",age:33,rating:85},
    {name:"Pau Cubarsí",pos:"CB",club:"Barcelona",age:18,rating:82},
    {name:"Aymeric Laporte",pos:"CB",club:"Al-Nassr",age:31,rating:84},
    {name:"Alejandro Grimaldo",pos:"LB",club:"Bayer Leverkusen",age:29,rating:84},
    {name:"Rodri",pos:"DM",club:"Manchester City",age:29,rating:91},
    {name:"Pedri",pos:"CM",club:"Barcelona",age:23,rating:88},
    {name:"Fabián Ruiz",pos:"CM",club:"PSG",age:28,rating:83},
    {name:"Lamine Yamal",pos:"RW",club:"Barcelona",age:18,rating:88},
    {name:"Nico Williams",pos:"LW",club:"Athletic Bilbao",age:22,rating:85},
    {name:"Álvaro Morata",pos:"ST",club:"Atlético Madrid",age:33,rating:82},
    {name:"Dani Olmo",pos:"CAM",club:"Barcelona",age:27,rating:85},
    {name:"Martín Zubimendi",pos:"DM",club:"Real Sociedad",age:26,rating:83},
    {name:"Mikel Oyarzabal",pos:"LW",club:"Real Sociedad",age:28,rating:82},
    {name:"David Raya",pos:"GK",club:"Arsenal",age:29,rating:83},
  ],
  "Germany":[
    {name:"Manuel Neuer",pos:"GK",club:"Bayern Munich",age:40,rating:83},
    {name:"Joshua Kimmich",pos:"DM",club:"Bayern Munich",age:31,rating:87},
    {name:"Antonio Rüdiger",pos:"CB",club:"Real Madrid",age:32,rating:85},
    {name:"Jonathan Tah",pos:"CB",club:"Bayern Munich",age:29,rating:83},
    {name:"Florian Wirtz",pos:"CAM",club:"Bayer Leverkusen",age:22,rating:89},
    {name:"Jamal Musiala",pos:"LW",club:"Bayern Munich",age:22,rating:88},
    {name:"Kai Havertz",pos:"ST",club:"Arsenal",age:26,rating:84},
    {name:"Leroy Sané",pos:"RW",club:"Bayern Munich",age:29,rating:85},
    {name:"Toni Kroos",pos:"CM",club:"Real Madrid",age:36,rating:87},
    {name:"Marc-André ter Stegen",pos:"GK",club:"Barcelona",age:33,rating:87},
    {name:"Ilkay Gündogan",pos:"CM",club:"Barcelona",age:35,rating:83},
    {name:"Niklas Süle",pos:"CB",club:"Dortmund",age:30,rating:81},
    {name:"Thomas Müller",pos:"CAM",club:"Bayern Munich",age:36,rating:80},
    {name:"Maximilian Mittelstädt",pos:"LB",club:"Stuttgart",age:27,rating:81},
    {name:"Deniz Undav",pos:"ST",club:"Stuttgart",age:28,rating:80},
  ],
  "Portugal":[
    {name:"Diogo Costa",pos:"GK",club:"Porto",age:25,rating:83},
    {name:"João Cancelo",pos:"RB",club:"Barcelona",age:31,rating:84},
    {name:"Rúben Dias",pos:"CB",club:"Manchester City",age:27,rating:88},
    {name:"Nuno Mendes",pos:"LB",club:"PSG",age:23,rating:84},
    {name:"João Palhinha",pos:"DM",club:"Bayern Munich",age:30,rating:84},
    {name:"Bernardo Silva",pos:"CM",club:"Manchester City",age:30,rating:88},
    {name:"Bruno Fernandes",pos:"CAM",club:"Manchester United",age:31,rating:87},
    {name:"Cristiano Ronaldo",pos:"ST",club:"Al-Nassr",age:41,rating:84},
    {name:"Rafael Leão",pos:"LW",club:"AC Milan",age:25,rating:86},
    {name:"Pedro Neto",pos:"RW",club:"Chelsea",age:25,rating:83},
    {name:"Vitinha",pos:"CM",club:"PSG",age:25,rating:83},
    {name:"João Félix",pos:"CAM",club:"Chelsea",age:26,rating:83},
    {name:"Gonçalo Ramos",pos:"ST",club:"PSG",age:24,rating:82},
    {name:"Rui Patrício",pos:"GK",club:"AS Roma",age:38,rating:80},
    {name:"Pepe",pos:"CB",club:"Porto",age:43,rating:76},
  ],
  "Morocco":[
    {name:"Yassine Bounou",pos:"GK",club:"Al-Hilal",age:33,rating:84},
    {name:"Achraf Hakimi",pos:"RB",club:"PSG",age:26,rating:87},
    {name:"Nayef Aguerd",pos:"CB",club:"West Ham",age:28,rating:82},
    {name:"Noussair Mazraoui",pos:"LB",club:"Manchester United",age:27,rating:82},
    {name:"Sofyan Amrabat",pos:"DM",club:"Manchester United",age:28,rating:82},
    {name:"Hakim Ziyech",pos:"RW",club:"Galatasaray",age:32,rating:82},
    {name:"Youssef En-Nesyri",pos:"ST",club:"Fenerbahçe",age:27,rating:82},
    {name:"Sofiane Boufal",pos:"LW",club:"Southampton",age:30,rating:79},
    {name:"Azzedine Ounahi",pos:"CM",club:"OM Marseille",age:24,rating:80},
    {name:"Jawad El Yamiq",pos:"CB",club:"Real Valladolid",age:32,rating:79},
    {name:"Bono",pos:"GK",club:"Sevilla",age:33,rating:82},
    {name:"Ilias Chair",pos:"CAM",club:"Leicester City",age:27,rating:78},
    {name:"Ibrahim Diaz",pos:"LW",club:"Real Sociedad",age:23,rating:78},
    {name:"Selim Amallah",pos:"CM",club:"Sevilla",age:27,rating:78},
  ],
};

// ── VENUES ────────────────────────────────────────────────────────────────────
const VENUES = [
  {city:"New York / New Jersey",stadium:"MetLife Stadium",cap:"82,500",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2010,wiki:"MetLife_Stadium",maps:"https://maps.google.com/?q=MetLife+Stadium+East+Rutherford+NJ"},
  {city:"Los Angeles",stadium:"SoFi Stadium",cap:"70,240",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2020,wiki:"SoFi_Stadium",maps:"https://maps.google.com/?q=SoFi+Stadium+Inglewood+CA"},
  {city:"Dallas",stadium:"AT&T Stadium",cap:"80,000",country:"USA",flag:"🇺🇸",surface:"Bermuda grass",opened:2009,wiki:"AT%26T_Stadium",maps:"https://maps.google.com/?q=AT%26T+Stadium+Arlington+TX"},
  {city:"San Francisco Bay Area",stadium:"Levi's Stadium",cap:"68,500",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2014,wiki:"Levi%27s_Stadium",maps:"https://maps.google.com/?q=Levis+Stadium+Santa+Clara+CA"},
  {city:"Miami",stadium:"Hard Rock Stadium",cap:"65,326",country:"USA",flag:"🇺🇸",surface:"Grass",opened:1987,wiki:"Hard_Rock_Stadium",maps:"https://maps.google.com/?q=Hard+Rock+Stadium+Miami+Gardens+FL"},
  {city:"Seattle",stadium:"Lumen Field",cap:"72,000",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2002,wiki:"Lumen_Field",maps:"https://maps.google.com/?q=Lumen+Field+Seattle+WA"},
  {city:"Boston",stadium:"Gillette Stadium",cap:"65,878",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2002,wiki:"Gillette_Stadium",maps:"https://maps.google.com/?q=Gillette+Stadium+Foxborough+MA"},
  {city:"Houston",stadium:"NRG Stadium",cap:"72,220",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2002,wiki:"NRG_Stadium",maps:"https://maps.google.com/?q=NRG+Stadium+Houston+TX"},
  {city:"Kansas City",stadium:"Arrowhead_Stadium",cap:"76,416",country:"USA",flag:"🇺🇸",surface:"Grass",opened:1972,wiki:"Arrowhead_Stadium",maps:"https://maps.google.com/?q=Arrowhead+Stadium+Kansas+City+MO"},
  {city:"Atlanta",stadium:"Mercedes-Benz Stadium",cap:"75,000",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2017,wiki:"Mercedes-Benz_Stadium",maps:"https://maps.google.com/?q=Mercedes-Benz+Stadium+Atlanta+GA"},
  {city:"Philadelphia",stadium:"Lincoln Financial Field",cap:"69,796",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2003,wiki:"Lincoln_Financial_Field",maps:"https://maps.google.com/?q=Lincoln+Financial+Field+Philadelphia+PA"},
  {city:"Vancouver",stadium:"BC Place",cap:"54,500",country:"Canada",flag:"🇨🇦",surface:"FieldTurf",opened:1983,wiki:"BC_Place",maps:"https://maps.google.com/?q=BC+Place+Vancouver+BC"},
  {city:"Toronto",stadium:"BMO Field",cap:"30,990",country:"Canada",flag:"🇨🇦",surface:"Grass",opened:2007,wiki:"BMO_Field",maps:"https://maps.google.com/?q=BMO+Field+Toronto+ON"},
  {city:"Guadalajara",stadium:"Estadio Akron",cap:"49,850",country:"Mexico",flag:"🇲🇽",surface:"Grass",opened:2010,wiki:"Estadio_Akron",maps:"https://maps.google.com/?q=Estadio+Akron+Guadalajara+Mexico"},
  {city:"Mexico City",stadium:"Estadio Azteca",cap:"87,523",country:"Mexico",flag:"🇲🇽",surface:"Grass",opened:1966,wiki:"Estadio_Azteca",maps:"https://maps.google.com/?q=Estadio+Azteca+Mexico+City"},
  {city:"Monterrey",stadium:"Estadio BBVA",cap:"53,500",country:"Mexico",flag:"🇲🇽",surface:"Grass",opened:2015,wiki:"Estadio_BBVA",maps:"https://maps.google.com/?q=Estadio+BBVA+Monterrey+Mexico"},
];

// ── SIMULATION ────────────────────────────────────────────────────────────────
function poisson(λ){const L=Math.exp(-λ);let p=1,k=0;do{k++;p*=Math.random();}while(p>L);return k-1;}
function eloWin(a,b){return 1/(1+Math.pow(10,-(a.elo-b.elo)/400));}
function simGroup(group){
  const st=group.map(t=>({team:t,pts:0,gf:0,ga:0,gd:0}));
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
    const p1=eloWin(group[i],group[j]);
    const eq=Math.max(0,1-Math.abs(group[i].elo-group[j].elo)/900);
    const pD=0.10+0.20*eq,pW=(1-pD)*p1,r=Math.random();
    const g1=poisson(2.5*p1),g2=poisson(2.5*(1-p1));
    if(r<pW){st[i].gf+=Math.max(g1,g2+1);st[i].ga+=g2;st[j].gf+=g2;st[j].ga+=Math.max(g1,g2+1);st[i].pts+=3;}
    else if(r<pW+pD){const g=Math.round((g1+g2)/2);st[i].gf+=g;st[i].ga+=g;st[j].gf+=g;st[j].ga+=g;st[i].pts+=1;st[j].pts+=1;}
    else{st[i].gf+=g1;st[i].ga+=Math.max(g2,g1+1);st[j].gf+=Math.max(g2,g1+1);st[j].ga+=g1;st[j].pts+=3;}
  }
  return st.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||Math.random()-0.5);
}
function simKO(a,b){const p=0.5+(eloWin(a,b)-0.5)*0.72;return Math.random()<p?a:b;}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function runSim(stats){
  const sorted=[...TEAMS].sort((a,b)=>b.elo-a.elo);
  const pots=[shuffle(sorted.slice(0,12)),shuffle(sorted.slice(12,24)),shuffle(sorted.slice(24,36)),shuffle(sorted.slice(36,48))];
  const groups=Array.from({length:12},(_,i)=>[pots[0][i],pots[1][i],pots[2][i],pots[3][i]]);
  const gRes=groups.map(simGroup);
  const q=gRes.flatMap(g=>[g[0].team,g[1].team]);
  const thirds=gRes.map(g=>g[2]).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
  let round=shuffle([...q,...thirds.slice(0,8).map(t=>t.team)]);
  round.forEach(t=>stats[t.name].r32++);
  function runRound(r){const n=[];for(let i=0;i<r.length;i+=2){const w=simKO(r[i],r[i+1]);const key=["r16","qf","sf","f"][Math.log2(r.length)-2];stats[w.name][key]++;n.push(w);}return n;}
  round=runRound(round);round=runRound(round);round=runRound(round);
  const[f1,f2]=[round[0],round[1]];
  stats[f1.name].fn++;stats[f2.name].fn++;
  const w=simKO(f1,f2);stats[w.name].w++;
}
function mkStats(){const s={};TEAMS.forEach(t=>{s[t.name]={w:0,fn:0,sf:0,qf:0,r16:0,r32:0};});return s;}

// ── API ───────────────────────────────────────────────────────────────────────
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
async function callClaude(userPrompt,systemPrompt="",useSearch=false){
  if(!ANTHROPIC_KEY)throw new Error("API key not configured.");
  const body={model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:userPrompt}]};
  if(systemPrompt)body.system=systemPrompt;
  if(useSearch)body.tools=[{type:"web_search_20250305",name:"web_search"}];
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(body)});
  const data=await r.json();
  if(data.error)throw new Error(data.error.message);
  return data.content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
}

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
function Tooltip({children,text}){
  const [show,setShow]=useState(false);
  return(
    <span style={{position:"relative",display:"inline-block"}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <span style={{...B,borderBottom:`1px dashed ${T.faint}`,cursor:"help",color:"inherit"}}>{children}</span>
      {show&&(
        <div style={{
          position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
          background:T.ink,color:"#fff",borderRadius:8,padding:"10px 14px",
          width:240,zIndex:200,pointerEvents:"none",
          ...B,fontSize:12,lineHeight:1.6,fontWeight:400,
          boxShadow:"0 4px 20px rgba(0,0,0,0.18)",
        }}>
          {text}
          <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
            width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",
            borderTop:`6px solid ${T.ink}`}} />
        </div>
      )}
    </span>
  );
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Tag({children,color}){
  return <span style={{...B,fontSize:10,fontWeight:600,letterSpacing:.8,padding:"2px 7px",borderRadius:4,background:color+"18",color,textTransform:"uppercase",display:"inline-block"}}>{children}</span>;
}
function Card({children,style={},onClick}){
  return <div onClick={onClick} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px",...style}}>{children}</div>;
}
function Label({children}){
  return <div style={{...B,fontSize:10,fontWeight:600,letterSpacing:1.5,color:T.faint,textTransform:"uppercase",marginBottom:8}}>{children}</div>;
}
function OutlineBtn({children,onClick,active}){
  return <button onClick={onClick} style={{...B,fontSize:12,fontWeight:500,padding:"5px 13px",borderRadius:6,border:`1px solid ${active?T.red:T.border}`,background:active?T.redLight:"transparent",color:active?T.red:T.muted,cursor:"pointer",transition:"all .15s"}}>{children}</button>;
}
function Divider(){return <div style={{height:1,background:T.border,margin:"20px 0"}} />;}
function Page({children}){return <div style={{maxWidth:1060,margin:"0 auto",padding:"32px 20px 80px"}}>{children}</div>;}

// ── NAV ───────────────────────────────────────────────────────────────────────
const TABS=[{id:"home",label:"Overview"},{id:"teams",label:"Teams"},{id:"sim",label:"Simulator"},{id:"predictor",label:"Predictor"},{id:"lineups",label:"Lineups"},{id:"news",label:"News"}];
function Nav({tab,setTab}){
  return(
    <nav style={{background:T.surface,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"stretch",overflowX:"auto",paddingLeft:24}}>
      <div style={{...H,fontWeight:800,fontSize:20,color:T.red,display:"flex",alignItems:"center",paddingRight:28,borderRight:`1px solid ${T.border}`,marginRight:8,flexShrink:0,letterSpacing:-.5}}>
        WC<span style={{color:T.ink}}>26</span>
      </div>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{...B,fontWeight:500,fontSize:14,padding:"0 16px",border:"none",background:"transparent",color:tab===t.id?T.red:T.muted,borderBottom:tab===t.id?`2px solid ${T.red}`:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s",flexShrink:0}}>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

// ── VENUE MODAL ───────────────────────────────────────────────────────────────
function VenueModal({venue,onClose}){
  const [imgUrl,setImgUrl]=useState(null);
  const [imgLoading,setImgLoading]=useState(true);

  useEffect(()=>{
    setImgUrl(null);setImgLoading(true);
    const apiUrl=`https://en.wikipedia.org/w/api.php?action=query&titles=${venue.wiki}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    fetch(apiUrl)
      .then(r=>r.json())
      .then(data=>{
        const pages=data.query.pages;
        const page=Object.values(pages)[0];
        if(page.thumbnail?.source){setImgUrl(page.thumbnail.source);}
        setImgLoading(false);
      })
      .catch(()=>setImgLoading(false));
  },[venue.wiki]);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(17,17,17,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:16,width:"100%",maxWidth:520,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
        {/* Image */}
        <div style={{height:220,background:T.border,position:"relative",overflow:"hidden"}}>
          {imgLoading&&(
            <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{...B,fontSize:13,color:T.faint}}>Loading…</div>
            </div>
          )}
          {!imgLoading&&imgUrl&&(
            <img src={imgUrl} alt={venue.stadium} style={{width:"100%",height:"100%",objectFit:"cover"}} />
          )}
          {!imgLoading&&!imgUrl&&(
            <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
              <div style={{fontSize:40}}>🏟️</div>
              <div style={{...B,fontSize:13,color:T.faint}}>{venue.stadium}</div>
            </div>
          )}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.5)",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* Details */}
        <div style={{padding:"22px 24px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <h2 style={{...H,fontSize:22,fontWeight:800,color:T.ink,letterSpacing:-.5,marginBottom:4}}>{venue.stadium}</h2>
              <div style={{...B,fontSize:14,color:T.muted}}>{venue.flag} {venue.city}, {venue.country}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{...H,fontSize:24,fontWeight:800,color:T.red,lineHeight:1}}>{venue.cap}</div>
              <div style={{...B,fontSize:11,color:T.faint,marginTop:2}}>capacity</div>
            </div>
          </div>
          <Divider />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Surface",venue.surface],["Opened",venue.opened]].map(([k,v])=>(
              <div key={k} style={{background:T.bg,borderRadius:8,padding:"10px 12px"}}>
                <div style={{...B,fontSize:10,fontWeight:600,letterSpacing:1,color:T.faint,textTransform:"uppercase",marginBottom:4}}>{k}</div>
                <div style={{...B,fontSize:14,fontWeight:500,color:T.ink}}>{v}</div>
              </div>
            ))}
          </div>
          <a href={venue.maps} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,...B,fontSize:13,fontWeight:500,color:T.muted,textDecoration:"none"}}>
            <span>📍</span> View on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomeSection({setTab}){
  const [results,setResults]=useState(null);
  const [venueModal,setVenueModal]=useState(null);
  useEffect(()=>{
    const stats=mkStats();let done=0;
    function batch(){const end=Math.min(done+600,5000);while(done<end){runSim(stats);done++;}
      if(done<5000)setTimeout(batch,10);
      else{const r=TEAMS.map(t=>({...t,...stats[t.name],winPct:stats[t.name].w/50,finalPct:stats[t.name].fn/50})).sort((a,b)=>b.w-a.w);setResults(r);}
    }
    setTimeout(batch,50);
  },[]);

  return(
    <Page>
      {venueModal&&<VenueModal venue={venueModal} onClose={()=>setVenueModal(null)} />}

      {/* Hero */}
      <div style={{borderBottom:`1px solid ${T.border}`,paddingBottom:28,marginBottom:32}}>
        <div style={{...B,fontSize:11,fontWeight:600,letterSpacing:2,color:T.red,textTransform:"uppercase",marginBottom:12}}>June 11 – July 19, 2026 · USA · Canada · Mexico</div>
        <h1 style={{...H,fontSize:"clamp(40px,7vw,80px)",fontWeight:800,lineHeight:1,letterSpacing:-2,color:T.ink,marginBottom:16}}>
          FIFA World Cup<br/><span style={{color:T.red}}>2026 Hub</span>
        </h1>
        <p style={{...B,fontSize:16,color:T.muted,maxWidth:560,lineHeight:1.6,marginBottom:24}}>
          Data, simulations, and team analysis for the 2026 World Cup — covering all 48 qualified nations across the expanded 104-match format.
        </p>
        <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
          {[["48","Teams"],["16","Venues"],["104","Matches"],["3","Host nations"]].map(([n,l])=>(
            <div key={l}>
              <div style={{...H,fontSize:36,fontWeight:800,color:T.ink,lineHeight:1}}>{n}</div>
              <div style={{...B,fontSize:12,color:T.muted,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Favourites */}
      <div style={{marginBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <h2 style={{...H,fontSize:22,fontWeight:800,color:T.ink,letterSpacing:-.5}}>Simulated favourites</h2>
          <span style={{...B,fontSize:12,color:T.faint}}>5,000 scenarios</span>
        </div>
        <p style={{...B,fontSize:13,color:T.faint,marginBottom:20}}>
          Win probabilities based on{" "}
          <Tooltip text="The Elo rating system measures relative team strength on a numerical scale. A higher Elo means a stronger team. Each match updates ratings based on the result versus what the model predicted — similar to how chess rankings work.">Elo ratings</Tooltip>
          {" "}and a{" "}
          <Tooltip text="A Monte Carlo simulation runs the tournament thousands of times using random variation and probability models. The percentage shown is how often each team won across all simulated runs — not a guarantee, but a statistical estimate.">Monte Carlo simulation</Tooltip>.
          Results are probabilistic, not predictive.
        </p>
        {!results?(
          <div style={{...B,fontSize:13,color:T.faint,padding:"40px 0",textAlign:"center"}}>Calculating…</div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
            {results.slice(0,8).map((t,i)=>(
              <Card key={t.name} onClick={()=>setTab("sim")} style={{cursor:"pointer",borderColor:i===0?T.redMid:T.border}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <span style={{fontSize:32}}>{t.flag}</span>
                  <span style={{...B,fontSize:11,fontWeight:600,color:i===0?T.red:T.faint}}>#{i+1}</span>
                </div>
                <div style={{...H,fontSize:16,fontWeight:700,color:T.ink,marginBottom:4}}>{t.name}</div>
                <Tag color={CC[t.conf]||T.muted}>{t.conf}</Tag>
                <div style={{marginTop:12,display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{...H,fontSize:28,fontWeight:800,color:i===0?T.red:T.ink,lineHeight:1}}>{t.winPct.toFixed(1)}</span>
                  <span style={{...B,fontSize:12,color:T.faint}}>% win</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Explore */}
      <div style={{marginBottom:40}}>
        <h2 style={{...H,fontSize:22,fontWeight:800,color:T.ink,letterSpacing:-.5,marginBottom:20}}>Explore</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {[
            {id:"teams",label:"Team Database",desc:"Squads, ratings & stats for all 48 nations"},
            {id:"sim",label:"Monte Carlo Simulator",desc:"25,000 full tournament simulations with Elo-Poisson model"},
            {id:"predictor",label:"Match Predictor",desc:"AI head-to-head analysis — coming soon"},
            {id:"lineups",label:"Lineup Predictor",desc:"Predicted XIs with injury data — coming soon"},
            {id:"news",label:"News Feed",desc:"AI-powered tournament news — coming soon"},
          ].map(s=>(
            <Card key={s.id} onClick={()=>setTab(s.id)} style={{cursor:"pointer"}}>
              <div style={{...H,fontSize:15,fontWeight:700,color:T.ink,marginBottom:6}}>{s.label}</div>
              <div style={{...B,fontSize:13,color:T.muted,lineHeight:1.5}}>{s.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Venues */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}>
          <h2 style={{...H,fontSize:22,fontWeight:800,color:T.ink,letterSpacing:-.5}}>Host venues</h2>
          <span style={{...B,fontSize:12,color:T.faint}}>Click for details</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
          {VENUES.map(v=>(
            <div key={v.city} onClick={()=>setVenueModal(v)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.redMid}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <div>
                <div style={{...B,fontSize:13,fontWeight:600,color:T.ink}}>{v.city}</div>
                <div style={{...B,fontSize:11,color:T.faint,marginTop:2}}>{v.stadium}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{...H,fontSize:13,fontWeight:700,color:T.red}}>{v.cap}</div>
                <div style={{...B,fontSize:10,color:T.faint}}>{v.flag} {v.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

// ── TEAMS ─────────────────────────────────────────────────────────────────────
function TeamsSection(){
  const [search,setSearch]=useState("");
  const [conf,setConf]=useState("ALL");
  const [selected,setSelected]=useState(null);
  const posOrder=["GK","RB","CB","LB","DM","CM","CAM","AM","RW","LW","ST","CF"];
  const posColor={"GK":"#D97706","CB":"#2563EB","RB":"#2563EB","LB":"#2563EB","DM":"#16A34A","CM":"#16A34A","CAM":"#C84B31","AM":"#C84B31","RW":"#7C3AED","LW":"#7C3AED","ST":"#C84B31","CF":"#C84B31"};
  const filtered=TEAMS.filter(t=>(conf==="ALL"||t.conf===conf)&&t.name.toLowerCase().includes(search.toLowerCase()));

  function SquadPanel({team}){
    const squad=SQUADS[team.name];
    if(!squad) return(
      <div style={{gridColumn:"1 / -1",background:T.redLight,border:`1px solid ${T.redMid}`,borderRadius:12,padding:"20px 24px",...B,fontSize:14,color:T.muted}}>
        Detailed squad data not available for {team.name} yet.
      </div>
    );
    const sorted=[...squad].sort((a,b)=>posOrder.indexOf(a.pos)-posOrder.indexOf(b.pos));
    return(
      <div style={{gridColumn:"1 / -1",background:T.surface,border:`1px solid ${T.redMid}`,borderRadius:12,padding:"20px 24px",marginTop:-4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontSize:32}}>{team.flag}</span>
            <div>
              <div style={{...H,fontSize:20,fontWeight:800,color:T.ink}}>{team.name}</div>
              <div style={{display:"flex",gap:8,marginTop:3}}>
                <Tag color={CC[team.conf]||T.muted}>{team.conf}</Tag>
                <span style={{...B,fontSize:11,color:T.faint}}>
                  <Tooltip text="The Elo rating system measures relative team strength. Higher = stronger. Updated after every international match based on result vs expectation.">Elo {team.elo}</Tooltip>
                </span>
              </div>
            </div>
          </div>
          <OutlineBtn onClick={()=>setSelected(null)}>Close ✕</OutlineBtn>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",...B,fontSize:13}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["Pos","Name","Club","Age","Rating"].map(h=>(
                  <th key={h} style={{padding:"8px 10px",textAlign:h==="Rating"?"center":"left",fontSize:10,fontWeight:600,letterSpacing:1,color:T.faint,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p,i)=>(
                <tr key={p.name} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?T.surface:"#FAFAF8"}}>
                  <td style={{padding:"9px 10px"}}><Tag color={posColor[p.pos]||T.muted}>{p.pos}</Tag></td>
                  <td style={{padding:"9px 10px",fontWeight:500,color:T.ink}}>{p.name}</td>
                  <td style={{padding:"9px 10px",color:T.muted}}>{p.club}</td>
                  <td style={{padding:"9px 10px",color:T.faint}}>{p.age}</td>
                  <td style={{padding:"9px 10px",textAlign:"center"}}>
                    <span style={{...H,fontWeight:700,color:p.rating>=88?T.red:p.rating>=83?"#D97706":T.ink}}>{p.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{...B,fontSize:11,color:T.faint,marginTop:12,borderTop:`1px solid ${T.border}`,paddingTop:10}}>
          Ratings are approximate consensus values compiled from publicly available sources including EA Sports FC, WhoScored, and Sofascore. They are not an official or proprietary rating system.
        </div>
      </div>
    );
  }

  // Build grid items, injecting squad panel inline after selected team
  const items=[];
  filtered.forEach((t)=>{
    items.push(
      <div key={t.name} onClick={()=>setSelected(selected?.name===t.name?null:t)}
        style={{background:T.surface,border:`1px solid ${selected?.name===t.name?T.red:T.border}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",transition:"border-color .15s",background:selected?.name===t.name?T.redLight:T.surface}}>
        <div style={{fontSize:30,marginBottom:8}}>{t.flag}</div>
        <div style={{...H,fontSize:14,fontWeight:700,color:T.ink,marginBottom:5}}>{t.name}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Tag color={CC[t.conf]||T.muted}>{t.conf}</Tag>
          <span style={{...B,fontSize:10,color:T.faint}}>{t.elo}</span>
        </div>
        {SQUADS[t.name]&&<div style={{...B,fontSize:10,color:T.red,fontWeight:500,marginTop:8}}>Squad available ↓</div>}
      </div>
    );
    if(selected?.name===t.name){
      items.push(<SquadPanel key="__squad__" team={t} />);
    }
  });

  return(
    <Page>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams…"
          style={{...B,padding:"8px 14px",borderRadius:7,border:`1px solid ${T.border}`,background:T.surface,color:T.ink,fontSize:14,flex:"1 1 200px",outline:"none"}} />
        {["ALL","UEFA","CONMEBOL","CAF","AFC","CONCACAF"].map(c=>(
          <OutlineBtn key={c} active={conf===c} onClick={()=>setConf(c)}>{c}</OutlineBtn>
        ))}
      </div>
      <div style={{...B,fontSize:11,fontWeight:600,letterSpacing:1,color:T.faint,textTransform:"uppercase",marginBottom:14}}>{filtered.length} teams · click any to expand squad</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
        {items}
      </div>
    </Page>
  );
}

// ── SIMULATOR ─────────────────────────────────────────────────────────────────
const N=25000;
function SimulatorSection(){
  const [progress,setProgress]=useState(0);
  const [results,setResults]=useState(null);
  const [conf,setConf]=useState("ALL");
  const statsRef=useRef(mkStats());
  const ran=useRef(false);

  useEffect(()=>{
    if(ran.current)return;ran.current=true;
    const stats=statsRef.current;let done=0;
    function batch(){const end=Math.min(done+500,N);while(done<end){runSim(stats);done++;}
      setProgress(done);
      if(done<N)setTimeout(batch,8);
      else{
        const r=TEAMS.map(t=>({...t,...stats[t.name],winPct:stats[t.name].w/N*100,finalPct:stats[t.name].fn/N*100,sfPct:stats[t.name].sf/N*100,qfPct:stats[t.name].qf/N*100,r16Pct:stats[t.name].r16/N*100})).sort((a,b)=>b.w-a.w);
        setResults(r);
      }
    }
    setTimeout(batch,60);
  },[]);

  const pct=Math.round(progress/N*100);
  const filtered=results?(conf==="ALL"?results:results.filter(t=>t.conf===conf)):[];
  const maxWin=results?results[0].winPct:1;

  return(
    <Page>
      <div style={{marginBottom:24}}>
        <h2 style={{...H,fontSize:28,fontWeight:800,color:T.ink,letterSpacing:-.5,marginBottom:8}}>
          <Tooltip text="A Monte Carlo simulation runs the entire tournament thousands of times using probability-based match outcomes. Each run has a random element — the percentages shown reflect how often each team won across all simulated tournaments.">Monte Carlo</Tooltip> Simulator
        </h2>
        <p style={{...B,fontSize:13,color:T.muted}}>
          {N.toLocaleString()} full tournaments simulated using{" "}
          <Tooltip text="Elo ratings measure team strength on a numerical scale, updated after every match. The difference between two teams' Elo scores determines the win probability assigned before each simulated match.">Elo ratings</Tooltip>
          {" "}and a Poisson goal model. Results are statistical estimates, not predictions.
        </p>
      </div>

      {!results?(
        <Card style={{textAlign:"center",padding:"60px 32px"}}>
          <div style={{...H,fontSize:24,fontWeight:800,color:T.ink,marginBottom:8}}>Running simulations…</div>
          <div style={{...B,fontSize:14,color:T.muted,marginBottom:28}}>{progress.toLocaleString()} of {N.toLocaleString()}</div>
          <div style={{height:6,background:T.border,borderRadius:3,maxWidth:400,margin:"0 auto",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:T.red,borderRadius:3,transition:"width .3s"}} />
          </div>
          <div style={{...B,fontSize:12,color:T.faint,marginTop:10}}>{pct}%</div>
        </Card>
      ):(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
            {[{label:"Champion",medal:"🥇",idx:0},{label:"Finalist",medal:"🥈",idx:1},{label:"Semi-finalist",medal:"🥉",idx:2}].map(({label,medal,idx})=>{
              const t=results[idx];
              return(
                <Card key={label} style={{textAlign:"center",borderColor:idx===0?T.redMid:T.border,background:idx===0?T.redLight:T.surface,transform:idx===0?"scale(1.03)":"scale(1)"}}>
                  <div style={{...B,fontSize:10,fontWeight:600,letterSpacing:1.5,color:T.faint,textTransform:"uppercase",marginBottom:8}}>{medal} {label}</div>
                  <div style={{fontSize:36,marginBottom:6}}>{t.flag}</div>
                  <div style={{...H,fontSize:18,fontWeight:800,color:T.ink,marginBottom:10}}>{t.name}</div>
                  <div style={{...H,fontSize:30,fontWeight:800,color:idx===0?T.red:T.ink,lineHeight:1}}>{t.winPct.toFixed(1)}<span style={{fontSize:14,color:T.faint}}>%</span></div>
                  <Divider />
                  <div style={{...B,fontSize:11,color:T.muted,lineHeight:2}}>
                    <div>Final · {t.finalPct.toFixed(1)}%</div>
                    <div>Semi · {t.sfPct.toFixed(1)}%</div>
                    <div>QF · {t.qfPct.toFixed(1)}%</div>
                  </div>
                </Card>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {["ALL","UEFA","CONMEBOL","CAF","AFC","CONCACAF"].map(c=>(
              <OutlineBtn key={c} active={conf===c} onClick={()=>setConf(c)}>{c}</OutlineBtn>
            ))}
          </div>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"36px 30px 1fr 90px 64px 64px 64px 64px",gap:8,padding:"10px 14px",borderBottom:`1px solid ${T.border}`,background:"#FAFAF8"}}>
              {["#","","Team","Win %","Final","SF","QF","R16"].map(h=>(
                <div key={h} style={{...B,fontSize:10,fontWeight:600,letterSpacing:1,color:T.faint,textTransform:"uppercase",textAlign:h==="Team"?"left":"center"}}>{h}</div>
              ))}
            </div>
            {filtered.map((t)=>{
              const rank=results.indexOf(t)+1;
              return(
                <div key={t.name} style={{display:"grid",gridTemplateColumns:"36px 30px 1fr 90px 64px 64px 64px 64px",gap:8,alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${T.border}`,background:rank<=3?T.redLight:T.surface,borderLeft:rank<=3?`3px solid ${T.red}`:"3px solid transparent"}}>
                  <div style={{...B,fontSize:11,fontWeight:600,color:rank<=3?T.red:T.faint,textAlign:"right"}}>{rank}</div>
                  <div style={{fontSize:18,textAlign:"center"}}>{t.flag}</div>
                  <div>
                    <div style={{...B,fontSize:13,fontWeight:600,color:T.ink}}>{t.name}</div>
                    <Tag color={CC[t.conf]||T.muted}>{t.conf}</Tag>
                  </div>
                  <div style={{position:"relative",height:20,background:T.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min(100,(t.winPct/maxWin)*100)}%`,background:T.red,opacity:.8}} />
                    <span style={{position:"absolute",right:5,top:2,...B,fontSize:10,fontWeight:600,color:T.ink}}>{t.winPct.toFixed(1)}%</span>
                  </div>
                  {[t.finalPct,t.sfPct,t.qfPct,t.r16Pct].map((v,j)=>(
                    <div key={j} style={{...B,fontSize:11,color:[T.red,T.muted,T.faint,T.faint][j],textAlign:"center",fontWeight:j===0?600:400}}>{v.toFixed(1)}%</div>
                  ))}
                </div>
              );
            })}
          </Card>
        </>
      )}
    </Page>
  );
}

// ── COMING SOON ───────────────────────────────────────────────────────────────
function ComingSoon({title,desc}){
  return(
    <Page>
      <div style={{maxWidth:520,margin:"60px auto",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:T.redLight,border:`1px solid ${T.redMid}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:28}}>⏳</div>
        <h2 style={{...H,fontSize:32,fontWeight:800,color:T.ink,letterSpacing:-1,marginBottom:12}}>{title}</h2>
        <p style={{...B,fontSize:15,color:T.muted,lineHeight:1.7,marginBottom:28}}>{desc}</p>
        <div style={{...B,fontSize:12,color:T.faint,padding:"10px 20px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,display:"inline-block"}}>Powered by Claude AI · Available soon</div>
      </div>
    </Page>
  );
}
function PredictorSection(){return <ComingSoon title="Match Predictor" desc="Pick any two teams for a full AI tactical breakdown — win probabilities, key individual battles, score prediction, and wild card factors." />;}
function LineupsSection(){return <ComingSoon title="Lineup Predictor" desc="Select any team and get a predicted starting XI based on current injuries, suspensions, and form — sourced from live news via Claude AI." />;}
function NewsSection(){return <ComingSoon title="Live News Feed" desc="Real-time World Cup 2026 news summaries synthesised by Claude AI with web search. Covering transfers, qualifications, and tournament developments." />;}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("home");
  return(
    <div style={{...B,background:T.bg,minHeight:"100vh",color:T.ink}}>
      <style>{`${FONTS}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:5px;background:${T.bg};}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}button{cursor:pointer;font-family:inherit;}`}</style>
      <Nav tab={tab} setTab={setTab} />
      {tab==="home"     &&<HomeSection setTab={setTab} />}
      {tab==="teams"    &&<TeamsSection />}
      {tab==="sim"      &&<SimulatorSection />}
      {tab==="predictor"&&<PredictorSection />}
      {tab==="lineups"  &&<LineupsSection />}
      {tab==="news"     &&<NewsSection />}
    </div>
  );
}
