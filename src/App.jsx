import { useState, useEffect, useRef, useCallback } from "react";

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:5px;background:#080815;}
::-webkit-scrollbar-thumb{background:#1a1a30;border-radius:2px;}
button{cursor:pointer;font-family:inherit;}
`;

const CC = { UEFA:"#4A90E2",CONMEBOL:"#F5A623",CAF:"#7ED321",AFC:"#E91E63",CONCACAF:"#FF6D00",OFC:"#9C27B0" };
const ACCENT = "#00e676";

// ── 48 TEAMS ──────────────────────────────────────────────────────────────────
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

// ── SQUADS (top 10 teams) ─────────────────────────────────────────────────────
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
    {name:"Alphonse Aréola",pos:"GK",club:"West Ham",age:32,rating:80},
    {name:"Benjamin Pavard",pos:"CB",club:"Inter Milan",age:29,rating:83},
    {name:"N'Golo Kanté",pos:"DM",club:"Al-Ittihad",age:34,rating:81},
    {name:"Kingsley Coman",pos:"RW",club:"Bayern Munich",age:28,rating:83},
    {name:"Randal Kolo Muani",pos:"ST",club:"PSG",age:26,rating:82},
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
    {name:"Ángel Di María",pos:"RW",club:"Benfica",age:37,rating:80},
    {name:"Julián Álvarez",pos:"ST",club:"Atlético Madrid",age:25,rating:86},
    {name:"Lionel Messi",pos:"CF",club:"Inter Miami",age:38,rating:91},
    {name:"Lautaro Martínez",pos:"ST",club:"Inter Milan",age:27,rating:87},
    {name:"Paulo Dybala",pos:"CAM",club:"Roma",age:32,rating:83},
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
    {name:"Marcus Rashford",pos:"LW",club:"Manchester United",age:27,rating:83},
    {name:"Cole Palmer",pos:"CAM",club:"Chelsea",age:23,rating:86},
    {name:"Ollie Watkins",pos:"ST",club:"Aston Villa",age:29,rating:83},
    {name:"Conor Gallagher",pos:"CM",club:"Atlético Madrid",age:25,rating:82},
    {name:"Jack Grealish",pos:"LW",club:"Manchester City",age:30,rating:82},
  ],
  "Brazil":[
    {name:"Alisson Becker",pos:"GK",club:"Liverpool",age:32,rating:89},
    {name:"Danilo",pos:"RB",club:"Juventus",age:33,rating:82},
    {name:"Marquinhos",pos:"CB",club:"PSG",age:30,rating:86},
    {name:"Gabriel Magalhães",pos:"CB",club:"Arsenal",age:27,rating:85},
    {name:"Wendell",pos:"LB",club:"Porto",age:30,rating:78},
    {name:"Bruno Guimarães",pos:"DM",club:"Newcastle",age:27,rating:86},
    {name:"Casemiro",pos:"DM",club:"Manchester United",age:33,rating:83},
    {name:"Lucas Paquetá",pos:"CM",club:"West Ham",age:27,rating:84},
    {name:"Raphinha",pos:"RW",club:"Barcelona",age:28,rating:85},
    {name:"Vinícius Jr",pos:"LW",club:"Real Madrid",age:24,rating:91},
    {name:"Rodrygo",pos:"ST",club:"Real Madrid",age:24,rating:85},
    {name:"Endrick",pos:"ST",club:"Real Madrid",age:18,rating:79},
    {name:"Éder Militão",pos:"CB",club:"Real Madrid",age:27,rating:85},
    {name:"Antony",pos:"RW",club:"Manchester United",age:24,rating:79},
    {name:"Gabriel Jesus",pos:"ST",club:"Arsenal",age:27,rating:81},
  ],
  "Spain":[
    {name:"Unai Simón",pos:"GK",club:"Athletic Bilbao",age:27,rating:83},
    {name:"Dani Carvajal",pos:"RB",club:"Real Madrid",age:33,rating:85},
    {name:"Aymeric Laporte",pos:"CB",club:"Al-Nassr",age:31,rating:84},
    {name:"Pau Cubarsí",pos:"CB",club:"Barcelona",age:18,rating:82},
    {name:"Alejandro Grimaldo",pos:"LB",club:"Bayer Leverkusen",age:29,rating:84},
    {name:"Rodri",pos:"DM",club:"Manchester City",age:29,rating:91},
    {name:"Pedri",pos:"CM",club:"Barcelona",age:23,rating:88},
    {name:"Fabián Ruiz",pos:"CM",club:"PSG",age:28,rating:83},
    {name:"Lamine Yamal",pos:"RW",club:"Barcelona",age:18,rating:88},
    {name:"Álvaro Morata",pos:"ST",club:"Atlético Madrid",age:33,rating:82},
    {name:"Nico Williams",pos:"LW",club:"Athletic Bilbao",age:22,rating:85},
    {name:"David Raya",pos:"GK",club:"Arsenal",age:29,rating:83},
    {name:"Dani Olmo",pos:"CAM",club:"Barcelona",age:27,rating:85},
    {name:"Martín Zubimendi",pos:"DM",club:"Real Sociedad",age:26,rating:83},
    {name:"Mikel Oyarzabal",pos:"LW",club:"Real Sociedad",age:28,rating:82},
  ],
  "Germany":[
    {name:"Manuel Neuer",pos:"GK",club:"Bayern Munich",age:40,rating:83},
    {name:"Joshua Kimmich",pos:"DM",club:"Bayern Munich",age:31,rating:87},
    {name:"Antonio Rüdiger",pos:"CB",club:"Real Madrid",age:32,rating:85},
    {name:"Jonathan Tah",pos:"CB",club:"Bayern Munich",age:29,rating:83},
    {name:"Maximilian Mittelstädt",pos:"LB",club:"Stuttgart",age:27,rating:81},
    {name:"Toni Kroos",pos:"CM",club:"Real Madrid",age:36,rating:87},
    {name:"Florian Wirtz",pos:"CAM",club:"Bayer Leverkusen",age:22,rating:89},
    {name:"Leroy Sané",pos:"RW",club:"Bayern Munich",age:29,rating:85},
    {name:"Kai Havertz",pos:"ST",club:"Arsenal",age:26,rating:84},
    {name:"Jamal Musiala",pos:"LW",club:"Bayern Munich",age:22,rating:88},
    {name:"Marc-André ter Stegen",pos:"GK",club:"Barcelona",age:33,rating:87},
    {name:"Ilkay Gündogan",pos:"CM",club:"Barcelona",age:35,rating:83},
    {name:"Niklas Süle",pos:"CB",club:"Dortmund",age:30,rating:81},
    {name:"Thomas Müller",pos:"CAM",club:"Bayern Munich",age:36,rating:80},
    {name:"Deniz Undav",pos:"ST",club:"Stuttgart",age:28,rating:80},
  ],
  "Portugal":[
    {name:"Diogo Costa",pos:"GK",club:"Porto",age:25,rating:83},
    {name:"João Cancelo",pos:"RB",club:"Barcelona",age:31,rating:84},
    {name:"Rúben Dias",pos:"CB",club:"Manchester City",age:27,rating:88},
    {name:"Nuno Mendes",pos:"LB",club:"PSG",age:23,rating:84},
    {name:"João Palhinha",pos:"DM",club:"Bayern Munich",age:30,rating:84},
    {name:"Bernardo Silva",pos:"CM",club:"Manchester City",age:30,rating:88},
    {name:"Vitinha",pos:"CM",club:"PSG",age:25,rating:83},
    {name:"Pedro Neto",pos:"RW",club:"Chelsea",age:25,rating:83},
    {name:"Cristiano Ronaldo",pos:"ST",club:"Al-Nassr",age:41,rating:84},
    {name:"Rafael Leão",pos:"LW",club:"AC Milan",age:25,rating:86},
    {name:"Bruno Fernandes",pos:"CAM",club:"Manchester United",age:31,rating:87},
    {name:"João Félix",pos:"CAM",club:"Chelsea",age:26,rating:83},
    {name:"Gonçalo Ramos",pos:"ST",club:"PSG",age:24,rating:82},
    {name:"Pepe",pos:"CB",club:"Porto",age:43,rating:76},
    {name:"Rui Patrício",pos:"GK",club:"AS Roma",age:38,rating:80},
  ],
  "Netherlands":[
    {name:"Bart Verbruggen",pos:"GK",club:"Brighton",age:22,rating:82},
    {name:"Denzel Dumfries",pos:"RB",club:"Inter Milan",age:28,rating:83},
    {name:"Virgil van Dijk",pos:"CB",club:"Liverpool",age:34,rating:87},
    {name:"Stefan de Vrij",pos:"CB",club:"Inter Milan",age:33,rating:82},
    {name:"Nathan Aké",pos:"LB",club:"Manchester City",age:30,rating:83},
    {name:"Frenkie de Jong",pos:"DM",club:"Barcelona",age:28,rating:86},
    {name:"Tijjani Reijnders",pos:"CM",club:"AC Milan",age:26,rating:83},
    {name:"Teun Koopmeiners",pos:"CM",club:"Juventus",age:27,rating:84},
    {name:"Cody Gakpo",pos:"LW",club:"Liverpool",age:25,rating:84},
    {name:"Memphis Depay",pos:"ST",club:"Atlético Madrid",age:31,rating:82},
    {name:"Donyell Malen",pos:"RW",club:"Dortmund",age:26,rating:82},
    {name:"Xavi Simons",pos:"CAM",club:"RB Leipzig",age:22,rating:83},
    {name:"Ryan Gravenberch",pos:"CM",club:"Liverpool",age:22,rating:83},
    {name:"Wout Weghorst",pos:"ST",club:"Hoffenheim",age:32,rating:79},
  ],
  "Morocco":[
    {name:"Yassine Bounou",pos:"GK",club:"Al-Hilal",age:33,rating:84},
    {name:"Achraf Hakimi",pos:"RB",club:"PSG",age:26,rating:87},
    {name:"Nayef Aguerd",pos:"CB",club:"West Ham",age:28,rating:82},
    {name:"Jawad El Yamiq",pos:"CB",club:"Real Valladolid",age:32,rating:79},
    {name:"Noussair Mazraoui",pos:"LB",club:"Manchester United",age:27,rating:82},
    {name:"Sofyan Amrabat",pos:"DM",club:"Manchester United",age:28,rating:82},
    {name:"Azzedine Ounahi",pos:"CM",club:"OM Marseille",age:24,rating:80},
    {name:"Hakim Ziyech",pos:"RW",club:"Galatasaray",age:32,rating:82},
    {name:"Youssef En-Nesyri",pos:"ST",club:"Fenerbahçe",age:27,rating:82},
    {name:"Sofiane Boufal",pos:"LW",club:"Southampton",age:30,rating:79},
    {name:"Bono",pos:"GK",club:"Sevilla",age:33,rating:82},
    {name:"Ilias Chair",pos:"CAM",club:"Leicester City",age:27,rating:78},
    {name:"Ibrahim Diaz",pos:"LW",club:"Real Sociedad",age:23,rating:78},
    {name:"Selim Amallah",pos:"CM",club:"Sevilla",age:27,rating:78},
  ],
  "Japan":[
    {name:"Shuichi Gonda",pos:"GK",club:"Shimizu S-Pulse",age:34,rating:79},
    {name:"Hiroki Sakai",pos:"RB",club:"Urawa Red Diamonds",age:34,rating:79},
    {name:"Maya Yoshida",pos:"CB",club:"FC Machida Zelvia",age:36,rating:78},
    {name:"Ko Itakura",pos:"CB",club:"Borussia M'gladbach",age:27,rating:81},
    {name:"Yuto Nagatomo",pos:"LB",club:"FC Tokyo",age:38,rating:76},
    {name:"Wataru Endo",pos:"DM",club:"Liverpool",age:31,rating:81},
    {name:"Hidemasa Morita",pos:"CM",club:"Sporting CP",age:30,rating:80},
    {name:"Kaoru Mitoma",pos:"LW",club:"Brighton",age:27,rating:83},
    {name:"Takumi Minamino",pos:"CM",club:"Monaco",age:30,rating:81},
    {name:"Daichi Kamada",pos:"CAM",club:"Crystal Palace",age:28,rating:82},
    {name:"Ritsu Doan",pos:"RW",club:"Freiburg",age:26,rating:81},
    {name:"Ayase Ueda",pos:"ST",club:"Feyenoord",age:25,rating:79},
    {name:"Yukinari Sugawara",pos:"RB",club:"Southampton",age:23,rating:78},
    {name:"Takehiro Tomiyasu",pos:"CB",club:"Arsenal",age:26,rating:80},
  ],
};

// ── SIMULATION ENGINE ──────────────────────────────────────────────────────────
function poisson(λ){const L=Math.exp(-λ);let p=1,k=0;do{k++;p*=Math.random();}while(p>L);return k-1;}
function eloWin(a,b){return 1/(1+Math.pow(10,-(a.elo-b.elo)/400));}
function simGroup(group){
  const st=group.map(t=>({team:t,pts:0,gf:0,ga:0,gd:0}));
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
    const p1=eloWin(group[i],group[j]);
    const eq=Math.max(0,1-Math.abs(group[i].elo-group[j].elo)/900);
    const pD=0.10+0.20*eq,pW=( 1-pD)*p1,r=Math.random();
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
  round.forEach(t=>{stats[t.name].r32++;});
  function runRound(r){const n=[];for(let i=0;i<r.length;i+=2){const w=simKO(r[i],r[i+1]);stats[w.name][["r16","qf","sf","f"][Math.log2(r.length)-2]]++;n.push(w);}return n;}
  round=runRound(round);round=runRound(round);round=runRound(round);
  const[f1,f2]=[round[0],round[1]];
  stats[f1.name].fn++;stats[f2.name].fn++;
  const w=simKO(f1,f2);stats[w.name].w++;
}
function mkStats(){const s={};TEAMS.forEach(t=>{s[t.name]={w:0,fn:0,sf:0,qf:0,r16:0,r32:0};});return s;}

// ── CLAUDE API ──────────────────────────────────────────────────────────────────
const ANTHROPIC_KEY = (typeof import !== "undefined" && typeof import.meta !== "undefined" && import.meta.env)
  ? (import.meta.env.VITE_ANTHROPIC_API_KEY || "") : "";

async function callClaude(userPrompt,systemPrompt="",useSearch=false){
  if(!ANTHROPIC_KEY) throw new Error("API key missing — add VITE_ANTHROPIC_API_KEY to your .env file");
  const body={model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:userPrompt}]};
  if(systemPrompt)body.system=systemPrompt;
  if(useSearch)body.tools=[{type:"web_search_20250305",name:"web_search"}];
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(body)});
  const data=await r.json();
  if(data.error)throw new Error(data.error.message);
  return data.content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
}


// ── SHARED STYLES ──────────────────────────────────────────────────────────────
const S = {
  card:{background:"#0d0d20",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"16px 18px"},
  tag:(conf)=>({fontSize:9,padding:"2px 6px",borderRadius:3,background:(CC[conf]||"#888")+"22",color:CC[conf]||"#888",fontFamily:"'Space Mono',monospace",letterSpacing:0.5,textTransform:"uppercase"}),
  btn:(active,color=ACCENT)=>({padding:"6px 14px",borderRadius:5,border:`1px solid ${active?color:rgba(255,255,255,0.1)}`,background:active?color+"22":"transparent",color:active?color:"#888",fontFamily:"'Space Mono',monospace",fontSize:11,letterSpacing:0.5,transition:"all .2s"}),
  label:{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:2,color:"#555",textTransform:"uppercase"},
  mono:{fontFamily:"'Space Mono',monospace"},
};
function rgba(r,g,b,a){return`rgba(${r},${g},${b},${a})`;}

// ── NAV ────────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"home",label:"Overview",icon:"◉"},
  {id:"teams",label:"Teams",icon:"▦"},
  {id:"sim",label:"Simulator",icon:"⟳"},
  {id:"predictor",label:"Predictor",icon:"⚡"},
  {id:"lineups",label:"Lineups",icon:"◈"},
  {id:"news",label:"News",icon:"◎"},
];
function Nav({tab,setTab}){
  return(
    <nav style={{background:"#0a0a1a",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",gap:0,overflowX:"auto",padding:"0 8px"}}>
      <div style={{fontSize:22,fontWeight:800,letterSpacing:1,padding:"0 16px 0 8px",color:ACCENT,whiteSpace:"nowrap",flexShrink:0}}>
        WC<span style={{color:"#fff"}}>26</span>
      </div>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{
          padding:"16px 14px",border:"none",background:"transparent",
          color:tab===t.id?"#fff":"#555",
          fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,
          letterSpacing:0.5,whiteSpace:"nowrap",
          borderBottom:tab===t.id?`2px solid ${ACCENT}`:"2px solid transparent",
          transition:"all .2s",
        }}>
          <span style={{marginRight:5,fontSize:12}}>{t.icon}</span>{t.label}
        </button>
      ))}
    </nav>
  );
}

// ── OVERVIEW SECTION ───────────────────────────────────────────────────────────
function HomeSection({setTab}){
  const [results,setResults]=useState(null);
  useEffect(()=>{
    const stats=mkStats();let done=0;
    function batch(){const end=Math.min(done+500,5000);while(done<end){runSim(stats);done++;}
      if(done<5000)setTimeout(batch,10);
      else{const r=TEAMS.map(t=>({...t,...stats[t.name],winPct:stats[t.name].w/50,finalPct:stats[t.name].fn/50})).sort((a,b)=>b.w-a.w);setResults(r);}
    }
    setTimeout(batch,50);
  },[]);

  const venues=[{city:"New York/New Jersey",stadium:"MetLife Stadium",cap:82500,country:"USA"},
    {city:"Los Angeles",stadium:"SoFi Stadium",cap:70240,country:"USA"},
    {city:"Dallas",stadium:"AT&T Stadium",cap:80000,country:"USA"},
    {city:"San Francisco",stadium:"Levi's Stadium",cap:68500,country:"USA"},
    {city:"Miami",stadium:"Hard Rock Stadium",cap:65326,country:"USA"},
    {city:"Seattle",stadium:"Lumen Field",cap:72000,country:"USA"},
    {city:"Boston",stadium:"Gillette Stadium",cap:65878,country:"USA"},
    {city:"Houston",stadium:"NRG Stadium",cap:72220,country:"USA"},
    {city:"Kansas City",stadium:"Arrowhead Stadium",cap:76416,country:"USA"},
    {city:"Atlanta",stadium:"Mercedes-Benz Stadium",cap:75000,country:"USA"},
    {city:"Philadelphia",stadium:"Lincoln Financial Field",cap:69796,country:"USA"},
    {city:"Vancouver",stadium:"BC Place",cap:54500,country:"Canada"},
    {city:"Toronto",stadium:"BMO Field",cap:30990,country:"Canada"},
    {city:"Guadalajara",stadium:"Estadio Akron",cap:49850,country:"Mexico"},
    {city:"Mexico City",stadium:"Estadio Azteca",cap:87523,country:"Mexico"},
    {city:"Monterrey",stadium:"Estadio BBVA",cap:53500,country:"Mexico"},
  ];

  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px 80px"}}>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#0d1a2e 0%,#0a0a1a 60%)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"40px 32px",marginBottom:24,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:300,height:"100%",background:`radial-gradient(ellipse at 80% 50%, ${ACCENT}08, transparent 70%)`,pointerEvents:"none"}} />
        <div style={{...S.label,marginBottom:12,color:ACCENT}}>FIFA World Cup 2026 · June 11 – July 19</div>
        <h1 style={{fontSize:"clamp(36px,6vw,72px)",fontWeight:800,letterSpacing:2,lineHeight:1,textTransform:"uppercase",color:"#fff"}}>
          The Biggest<br/><span style={{color:ACCENT}}>World Cup</span><br/>in History
        </h1>
        <p style={{marginTop:16,color:"#888",fontSize:15,maxWidth:500,lineHeight:1.6}}>
          48 teams. 16 venues across USA, Canada & Mexico. 104 matches. The most expanded edition of the tournament ever — with AI-powered analysis, simulations, and live predictions.
        </p>
        <div style={{display:"flex",gap:24,marginTop:24,flexWrap:"wrap"}}>
          {[["48","Qualified Teams"],["16","Host Venues"],["104","Total Matches"],["3","Host Nations"]].map(([n,l])=>(
            <div key={l}>
              <div style={{fontSize:32,fontWeight:800,color:ACCENT,lineHeight:1}}>{n}</div>
              <div style={{fontSize:11,color:"#666",...S.mono,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Favourites */}
      <div style={{marginBottom:24}}>
        <div style={{...S.label,marginBottom:14}}>Tournament favourites — 5,000 simulated scenarios</div>
        {!results?
          <div style={{...S.card,color:"#555",...S.mono,fontSize:12}}>Running quick simulation…</div>:
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            {results.slice(0,8).map((t,i)=>(
              <div key={t.name} style={{...S.card,cursor:"pointer",transition:"border-color .2s",borderColor:i===0?ACCENT+"44":"rgba(255,255,255,0.07)"}} onClick={()=>setTab("sim")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <span style={{fontSize:28}}>{t.flag}</span>
                  <span style={{...S.mono,fontSize:11,color:i===0?ACCENT:"#777"}}>#{i+1}</span>
                </div>
                <div style={{fontSize:18,fontWeight:700}}>{t.name}</div>
                <div style={{...S.tag(t.conf),display:"inline-block",marginTop:4}}>{t.conf}</div>
                <div style={{marginTop:12,fontSize:28,fontWeight:800,color:i===0?ACCENT:"#ccc",lineHeight:1}}>{t.winPct.toFixed(1)}<span style={{fontSize:14,color:"#555"}}>%</span></div>
                <div style={{fontSize:10,...S.mono,color:"#555",marginTop:2}}>win probability</div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* Section cards */}
      <div style={{...S.label,marginBottom:14}}>Explore the hub</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[
          {id:"teams",icon:"▦",title:"Team Database",desc:"Full squads, ratings & stats for all 48 qualified nations"},
          {id:"sim",icon:"⟳",title:"Monte Carlo Sim",desc:"Run 25,000 full tournament scenarios with Elo-Poisson model"},
          {id:"predictor",icon:"⚡",title:"Match Predictor",desc:"AI-powered head-to-head analysis with tactical breakdown"},
          {id:"lineups",icon:"◈",title:"Lineup Predictor",desc:"Predicted starting XI with injury & form data from live news"},
          {id:"news",icon:"◎",title:"News Feed",desc:"Latest World Cup 2026 news with AI-sourced summaries"},
        ].map(s=>(
          <div key={s.id} style={{...S.card,cursor:"pointer",transition:"all .2s"}} onClick={()=>setTab(s.id)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT+"44";e.currentTarget.style.background="#111128";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.background="#0d0d20";}}>
            <div style={{fontSize:24,marginBottom:10,color:ACCENT}}>{s.icon}</div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:13,color:"#666",lineHeight:1.5}}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Venues */}
      <div style={{marginTop:32}}>
        <div style={{...S.label,marginBottom:14}}>Host Venues</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
          {venues.map(v=>(
            <div key={v.city} style={{background:"#0a0a1a",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{v.city}</div>
                <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.stadium}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,...S.mono,color:ACCENT}}>{(v.cap/1000).toFixed(0)}k</div>
                <div style={{fontSize:10,color:"#444"}}>{v.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TEAMS SECTION ──────────────────────────────────────────────────────────────
function TeamsSection(){
  const [search,setSearch]=useState("");
  const [conf,setConf]=useState("ALL");
  const [selected,setSelected]=useState(null);
  const filtered=TEAMS.filter(t=>(conf==="ALL"||t.conf===conf)&&t.name.toLowerCase().includes(search.toLowerCase()));
  const squad=selected?SQUADS[selected.name]:null;
  const posOrder=["GK","RB","CB","LB","DM","CM","CAM","RW","LW","AM","ST","CF"];
  const sorted=squad?[...squad].sort((a,b)=>posOrder.indexOf(a.pos)-posOrder.indexOf(b.pos)):[];
  const posCols={"GK":"#FF6D00","CB":"#4A90E2","RB":"#4A90E2","LB":"#4A90E2","DM":"#7ED321","CM":"#7ED321","CAM":"#F5A623","AM":"#F5A623","RW":"#E91E63","LW":"#E91E63","ST":"#E91E63","CF":"#E91E63"};

  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px 80px"}}>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams…"
          style={{padding:"8px 14px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"#0d0d20",color:"#e8e8f0",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,flex:"1 1 200px",outline:"none"}} />
        {["ALL",...Object.keys(CC)].map(c=>(
          <button key={c} onClick={()=>setConf(c)} style={{...S.btn(conf===c,CC[c]||ACCENT),flexShrink:0}}>{c}</button>
        ))}
      </div>

      <div style={{...S.label,marginBottom:12}}>{filtered.length} teams</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
        {filtered.map(t=>(
          <div key={t.name} onClick={()=>setSelected(selected?.name===t.name?null:t)} style={{
            ...S.card,cursor:"pointer",transition:"all .2s",
            borderColor:selected?.name===t.name?ACCENT+"66":"rgba(255,255,255,0.07)",
            background:selected?.name===t.name?"#111128":"#0d0d20",
          }}>
            <div style={{fontSize:32,marginBottom:8}}>{t.flag}</div>
            <div style={{fontSize:14,fontWeight:700}}>{t.name}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={S.tag(t.conf)}>{t.conf}</span>
              <span style={{...S.mono,fontSize:10,color:"#555"}}>Elo {t.elo}</span>
            </div>
            {SQUADS[t.name]&&<div style={{...S.mono,fontSize:9,color:ACCENT,marginTop:8}}>Squad available</div>}
          </div>
        ))}
      </div>

      {selected&&(
        <div style={{...S.card,marginTop:24,borderColor:ACCENT+"33"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <span style={{fontSize:48}}>{selected.flag}</span>
              <div>
                <h2 style={{fontSize:32,fontWeight:800,letterSpacing:1}}>{selected.name.toUpperCase()}</h2>
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <span style={S.tag(selected.conf)}>{selected.conf}</span>
                  <span style={{...S.mono,fontSize:10,color:"#555"}}>Elo Rating: {selected.elo}</span>
                </div>
              </div>
            </div>
            <button onClick={()=>setSelected(null)} style={{...S.btn(false),...S.mono,fontSize:11}}>✕ Close</button>
          </div>
          {squad?(
            <>
              <div style={{...S.label,marginBottom:12}}>Squad ({squad.length} players)</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                      {["Position","Name","Club","Age","Rating"].map(h=>(
                        <th key={h} style={{padding:"8px 12px",textAlign:h==="Rating"?"center":"left",...S.mono,fontSize:10,color:"#555",fontWeight:400,letterSpacing:1}}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p,i)=>(
                      <tr key={p.name} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                        <td style={{padding:"8px 12px"}}>
                          <span style={{...S.mono,fontSize:10,padding:"2px 6px",borderRadius:3,background:(posCols[p.pos]||"#888")+"22",color:posCols[p.pos]||"#888"}}>{p.pos}</span>
                        </td>
                        <td style={{padding:"8px 12px",fontWeight:600}}>{p.name}</td>
                        <td style={{padding:"8px 12px",color:"#888"}}>{p.club}</td>
                        <td style={{padding:"8px 12px",...S.mono,color:"#666",fontSize:12}}>{p.age}</td>
                        <td style={{padding:"8px 12px",textAlign:"center"}}>
                          <span style={{...S.mono,fontSize:12,color:p.rating>=88?ACCENT:p.rating>=83?"#F5A623":"#ccc",fontWeight:700}}>{p.rating}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ):(
            <div style={{color:"#555",fontSize:14,padding:"20px 0"}}>Detailed squad data not available for this team yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SIMULATOR SECTION ──────────────────────────────────────────────────────────
const N_SIMS=25000;
function SimulatorSection(){
  const [progress,setProgress]=useState(0);
  const [results,setResults]=useState(null);
  const [confFilter,setConfFilter]=useState("ALL");
  const statsRef=useRef(mkStats());
  const ranRef=useRef(false);

  useEffect(()=>{
    if(ranRef.current)return;ranRef.current=true;
    const stats=statsRef.current;let done=0;
    function batch(){const end=Math.min(done+500,N_SIMS);while(done<end){runSim(stats);done++;}
      setProgress(done);
      if(done<N_SIMS)setTimeout(batch,8);
      else{
        const r=TEAMS.map(t=>({...t,...stats[t.name],winPct:stats[t.name].w/N_SIMS*100,finalPct:stats[t.name].fn/N_SIMS*100,sfPct:stats[t.name].sf/N_SIMS*100,qfPct:stats[t.name].qf/N_SIMS*100,r16Pct:stats[t.name].r16/N_SIMS*100})).sort((a,b)=>b.w-a.w);
        setResults(r);
      }
    }
    setTimeout(batch,60);
  },[]);

  const pct=Math.round(progress/N_SIMS*100);
  const filtered=results?(confFilter==="ALL"?results:results.filter(t=>t.conf===confFilter)):[];
  const maxWin=results?results[0].winPct:1;

  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px 80px"}}>
      {!results?(
        <div style={{...S.card,textAlign:"center",padding:"60px 24px"}}>
          <div style={{fontSize:48,marginBottom:16}}>⚽</div>
          <div style={{...S.mono,fontSize:12,color:ACCENT,letterSpacing:2,marginBottom:24,textTransform:"uppercase"}}>Running {N_SIMS.toLocaleString()} tournament scenarios…</div>
          <div style={{background:"#111124",borderRadius:4,height:6,width:"100%",maxWidth:400,margin:"0 auto",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${ACCENT},#69ff47)`,borderRadius:4,transition:"width .3s ease"}} />
          </div>
          <div style={{...S.mono,fontSize:12,color:"#555",marginTop:12}}>{progress.toLocaleString()} / {N_SIMS.toLocaleString()} — {pct}%</div>
        </div>
      ):(
        <>
          {/* Podium */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
            {[{r:1,label:"🥇 Champion",c:"#FFD700",idx:0},{r:2,label:"🥈 Finalist",c:"#C0C0C0",idx:1},{r:3,label:"🥉 Semi-final",c:"#CD7F32",idx:2}].map(({r,label,c,idx})=>{
              const t=results[idx];
              return(
                <div key={r} style={{...S.card,textAlign:"center",borderColor:c+"33",background:`linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))`,transform:r===1?"scale(1.03)":"scale(1)"}}>
                  <div style={{fontSize:10,...S.mono,color:c,letterSpacing:2,marginBottom:8}}>{label}</div>
                  <div style={{fontSize:36}}>{t.flag}</div>
                  <div style={{fontSize:20,fontWeight:800,marginTop:6}}>{t.name.toUpperCase()}</div>
                  <div style={{fontSize:28,fontWeight:800,color:c,marginTop:8,lineHeight:1}}>{t.winPct.toFixed(1)}<span style={{fontSize:13,color:"#555"}}>%</span></div>
                  <div style={{...S.mono,fontSize:10,color:"#666",marginTop:4,lineHeight:1.8}}>
                    <div>Final {t.finalPct.toFixed(1)}%</div>
                    <div>Semi {t.sfPct.toFixed(1)}%</div>
                    <div>QF {t.qfPct.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {["ALL",...Object.keys(CC)].map(c=>(
              <button key={c} onClick={()=>setConfFilter(c)} style={{...S.btn(confFilter===c,CC[c]||ACCENT)}}>{c}</button>
            ))}
          </div>

          {/* Table */}
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"32px 28px 1fr 80px 60px 60px 60px 60px",gap:8,padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              {["#","","TEAM","WIN%","FINAL","SF","QF","R16"].map(h=>(
                <div key={h} style={{...S.mono,fontSize:9,color:"#444",letterSpacing:1.5,textAlign:h==="TEAM"?"left":"center"}}>{h}</div>
              ))}
            </div>
            {filtered.map((t,i)=>{
              const rank=results.indexOf(t)+1;
              return(
                <div key={t.name} style={{display:"grid",gridTemplateColumns:"32px 28px 1fr 80px 60px 60px 60px 60px",gap:8,alignItems:"center",padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",background:rank<=5?"rgba(0,230,118,0.03)":"transparent",borderLeft:rank<=5?`2px solid ${ACCENT}`:"2px solid transparent"}}>
                  <div style={{...S.mono,fontSize:11,color:rank<=3?"#FFD700":"#555",textAlign:"right"}}>{rank}</div>
                  <div style={{fontSize:18,textAlign:"center"}}>{t.flag}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700}}>{t.name}</div>
                    <span style={S.tag(t.conf)}>{t.conf}</span>
                  </div>
                  <div style={{position:"relative",height:18,background:"rgba(255,255,255,0.05)",borderRadius:2}}>
                    <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min(100,(t.winPct/maxWin)*100)}%`,background:ACCENT,borderRadius:2,opacity:.8}} />
                    <span style={{position:"absolute",right:4,top:0,lineHeight:"18px",...S.mono,fontSize:10,color:"#ccc"}}>{t.winPct.toFixed(1)}%</span>
                  </div>
                  {[t.finalPct,t.sfPct,t.qfPct,t.r16Pct].map((v,j)=>(
                    <div key={j} style={{...S.mono,fontSize:11,color:["#88aaff","#aaa","#777","#555"][j],textAlign:"center"}}>{v.toFixed(1)}%</div>
                  ))}
                </div>
              );
            })}
          </div>
          <div style={{...S.mono,fontSize:10,color:"#444",textAlign:"center",marginTop:12}}>{N_SIMS.toLocaleString()} simulations · Elo-Poisson model · 48 teams · 12 groups</div>
        </>
      )}
    </div>
  );
}

// ── PREDICTOR SECTION ──────────────────────────────────────────────────────────
function PredictorSection(){
  const [t1,setT1]=useState(TEAMS[0]);
  const [t2,setT2]=useState(TEAMS[3]);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);

  const winProb=useCallback((a,b)=>{
    const p=eloWin(a,b);
    const pW=(1-0.28)*p,pD=0.28,pL=1-pW-pD;
    return {win:+(pW*100).toFixed(1),draw:+(pD*100).toFixed(1),lose:+(pL*100).toFixed(1)};
  },[]);

  const predict=async()=>{
    setLoading(true);setResult(null);
    try{
      const p=winProb(t1,t2);
      const resp=await callClaude(
        `Analyse a FIFA World Cup 2026 knockout match between ${t1.name} (Elo ${t1.elo}) and ${t2.name} (Elo ${t2.elo}).

Statistical win probabilities: ${t1.name} ${p.win}% | Draw ${p.draw}% | ${t2.name} ${p.lose}%

Provide a sharp, IB-analyst style breakdown in 4 short sections:
1. TACTICAL MATCHUP (2-3 sentences on how the styles clash)
2. KEY BATTLES (3 individual matchups that will decide the game)  
3. PREDICTION (who wins, score, key turning point)
4. WILD CARD (one unexpected factor that could flip the outcome)

Be specific, confident, and concise. No fluff.`,
        "You are a world-class football analyst. Be specific and data-driven. Keep each section tight — max 3 sentences."
      );
      setResult({text:resp,probs:p});
    }catch(e){setResult({error:e.message});}
    setLoading(false);
  };

  const p=winProb(t1,t2);

  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 80px"}}>
      <div style={{...S.label,marginBottom:20}}>AI-powered head-to-head match analysis</div>

      {/* Team selectors */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",marginBottom:24}}>
        <TeamPicker teams={TEAMS} selected={t1} onSelect={setT1} exclude={t2.name} />
        <div style={{textAlign:"center",color:"#555",fontWeight:800,fontSize:20,fontFamily:"'Barlow Condensed',sans-serif"}}>VS</div>
        <TeamPicker teams={TEAMS} selected={t2} onSelect={setT2} exclude={t1.name} />
      </div>

      {/* Probability bars */}
      <div style={{...S.card,marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 80px 1fr",gap:8,alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{t1.flag} {t1.name}</div>
            <div style={{...S.mono,fontSize:22,fontWeight:700,color:ACCENT}}>{p.win}%</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{...S.mono,fontSize:10,color:"#555",marginBottom:4}}>DRAW</div>
            <div style={{...S.mono,fontSize:16,color:"#888"}}>{p.draw}%</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{t2.flag} {t2.name}</div>
            <div style={{...S.mono,fontSize:22,fontWeight:700,color:"#4A90E2"}}>{p.lose}%</div>
          </div>
        </div>
        <div style={{height:8,borderRadius:4,overflow:"hidden",display:"flex"}}>
          <div style={{width:`${p.win}%`,background:ACCENT}} />
          <div style={{width:`${p.draw}%`,background:"#888"}} />
          <div style={{flex:1,background:"#4A90E2"}} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
          {[["Elo Rating",t1.elo,t2.elo],["Confederation",t1.conf,t2.conf]].map(([label,v1,v2])=>(
            <div key={label} style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"8px 12px"}}>
              <div style={{...S.label,marginBottom:4}}>{label}</div>
              <div style={{fontSize:13,display:"flex",justifyContent:"space-between"}}>
                <span style={{color:CC[t1.conf]||"#ccc"}}>{v1}</span>
                <span style={{color:CC[t2.conf]||"#ccc"}}>{v2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={predict} disabled={loading} style={{width:"100%",padding:"14px 24px",border:`1px solid ${ACCENT}`,borderRadius:8,background:loading?ACCENT+"11":ACCENT+"22",color:loading?"#555":ACCENT,fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:1,transition:"all .2s",marginBottom:20}}>
        {loading?"⟳  Analysing…":"⚡  Generate AI Analysis"}
      </button>

      {result&&(
        <div style={{...S.card,borderColor:ACCENT+"33"}}>
          {result.error?<div style={{color:"#e57373",...S.mono,fontSize:12}}>{result.error}</div>:(
            <div style={{fontSize:14,lineHeight:1.8,color:"#ccc",whiteSpace:"pre-wrap"}}>{result.text}</div>
          )}
        </div>
      )}
    </div>
  );
}

function TeamPicker({teams,selected,onSelect,exclude}){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const filtered=teams.filter(t=>t.name!==exclude&&t.name.toLowerCase().includes(q.toLowerCase()));
  return(
    <div style={{position:"relative"}}>
      <div onClick={()=>setOpen(!open)} style={{...S.card,cursor:"pointer",textAlign:"center",padding:"16px 12px",borderColor:open?ACCENT+"44":"rgba(255,255,255,0.07)"}}>
        <div style={{fontSize:36}}>{selected.flag}</div>
        <div style={{fontSize:18,fontWeight:700,marginTop:4}}>{selected.name}</div>
        <div style={S.tag(selected.conf)}>{selected.conf}</div>
      </div>
      {open&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#0d0d20",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,zIndex:50,maxHeight:260,overflow:"hidden",display:"flex",flexDirection:"column",marginTop:4}}>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" style={{padding:"8px 12px",background:"#111128",border:"none",borderBottom:"1px solid rgba(255,255,255,0.07)",color:"#e8e8f0",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,outline:"none"}} />
          <div style={{overflowY:"auto",flex:1}}>
            {filtered.map(t=>(
              <div key={t.name} onClick={()=>{onSelect(t);setOpen(false);setQ("");}} style={{padding:"8px 12px",cursor:"pointer",display:"flex",gap:10,alignItems:"center",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#111128"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{t.flag}</span>
                <span style={{fontSize:14,fontWeight:600}}>{t.name}</span>
                <span style={{...S.mono,fontSize:10,color:"#555",marginLeft:"auto"}}>{t.elo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── LINEUPS SECTION ────────────────────────────────────────────────────────────
function LineupsSection(){
  const [team,setTeam]=useState(TEAMS[0]);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);

  const predict=async()=>{
    setLoading(true);setResult(null);
    try{
      const squad=SQUADS[team.name];
      const squadText=squad?squad.map(p=>`${p.pos}: ${p.name} (${p.club}, age ${p.age}, rating ${p.rating})`).join("\n"):"No detailed squad data — use your knowledge.";
      const resp=await callClaude(
        `Predict the most likely starting XI for ${team.flag} ${team.name} at FIFA World Cup 2026.

Known squad data:
${squadText}

Search for the latest news on injuries, suspensions, form, and manager decisions for ${team.name}.

Output your prediction in this exact format:
FORMATION: [e.g. 4-3-3]
STARTING XI:
GK: [name]
RB: [name]
CB: [name]
CB: [name]
LB: [name]
[midfield positions]:
[attacking positions]:

TACTICAL NOTES: [2 sentences on expected system]
KEY ABSENTEES: [any injuries/suspensions from latest news]
FORM NOTE: [1 sentence on team's recent form]`,
        "You are a football tactics expert with access to current team news. Be specific and use latest information.",
        true
      );
      setResult({text:resp});
    }catch(e){setResult({error:e.message});}
    setLoading(false);
  };

  const teamsWithSquads=TEAMS.filter(t=>SQUADS[t.name]);
  const others=TEAMS.filter(t=>!SQUADS[t.name]);

  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 80px"}}>
      <div style={{...S.label,marginBottom:6}}>AI Lineup Predictor</div>
      <div style={{color:"#666",fontSize:13,marginBottom:20,...S.mono}}>Uses Claude + live web search to factor in injuries, form & manager decisions</div>

      <div style={{...S.card,marginBottom:16}}>
        <div style={{...S.label,marginBottom:12}}>Select team</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:12}}>
          {teamsWithSquads.map(t=>(
            <div key={t.name} onClick={()=>setTeam(t)} style={{
              padding:"10px 12px",borderRadius:8,cursor:"pointer",
              border:`1px solid ${team.name===t.name?ACCENT+"66":"rgba(255,255,255,0.06)"}`,
              background:team.name===t.name?"rgba(0,230,118,0.06)":"rgba(255,255,255,0.02)",
              display:"flex",gap:8,alignItems:"center",transition:"all .15s",
            }}>
              <span style={{fontSize:20}}>{t.flag}</span>
              <div>
                <div style={{fontSize:12,fontWeight:700}}>{t.name}</div>
                <div style={{...S.mono,fontSize:9,color:ACCENT}}>Full squad</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{...S.label,marginBottom:8}}>Other teams (AI will generate from knowledge)</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {others.map(t=>(
            <div key={t.name} onClick={()=>setTeam(t)} style={{
              padding:"5px 10px",borderRadius:5,cursor:"pointer",fontSize:13,
              border:`1px solid ${team.name===t.name?ACCENT+"66":"rgba(255,255,255,0.06)"}`,
              background:team.name===t.name?"rgba(0,230,118,0.06)":"transparent",
              display:"flex",gap:6,alignItems:"center",
            }}>
              <span>{t.flag}</span><span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={predict} disabled={loading} style={{width:"100%",padding:"14px 24px",border:`1px solid ${ACCENT}`,borderRadius:8,background:loading?ACCENT+"11":ACCENT+"22",color:loading?"#555":ACCENT,fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:1,transition:"all .2s",marginBottom:20}}>
        {loading?`⟳  Scanning news & generating ${team.name} lineup…`:`◈  Predict ${team.flag} ${team.name} Starting XI`}
      </button>

      {result&&(
        <div style={{...S.card,borderColor:ACCENT+"33"}}>
          {result.error?<div style={{color:"#e57373",...S.mono,fontSize:12}}>{result.error}</div>:(
            <div style={{fontSize:14,lineHeight:1.9,color:"#ccc",whiteSpace:"pre-wrap",fontFamily:"'Space Mono',monospace"}}>{result.text}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── NEWS SECTION ───────────────────────────────────────────────────────────────
const NEWS_TOPICS=[
  "FIFA World Cup 2026 latest news",
  "World Cup 2026 qualification updates",
  "World Cup 2026 host cities venues",
  "World Cup 2026 draw groups format",
  "FIFA 2026 team preparations",
];
function NewsSection(){
  const [topic,setTopic]=useState(NEWS_TOPICS[0]);
  const [custom,setCustom]=useState("");
  const [articles,setArticles]=useState([]);
  const [loading,setLoading]=useState(false);
  const [summary,setSummary]=useState(null);

  const fetchNews=async(q)=>{
    setLoading(true);setArticles([]);setSummary(null);
    try{
      const resp=await callClaude(
        `Search for the latest news about: "${q}"

Provide a structured news briefing in this exact JSON format (array of 5 articles, no markdown):
[
  {
    "headline": "Short punchy headline",
    "summary": "2-sentence factual summary of the story",
    "source": "Publication name",
    "date": "Approximate date (e.g. April 2025)",
    "tag": "one of: Transfer|Qualification|Venue|Squad|Draw|Regulation|Form"
  }
]

Then on a new line after the JSON, add:
BRIEFING: [One paragraph synthesis of the overall news landscape on this topic]

Return real, accurate information only.`,
        "You are a football journalist. Search for current news and return accurate, factual information in the exact format requested.",
        true
      );
      const jsonMatch=resp.match(/\[[\s\S]*?\]/);
      const briefMatch=resp.match(/BRIEFING:([\s\S]*)/);
      if(jsonMatch){
        try{const parsed=JSON.parse(jsonMatch[0]);setArticles(parsed);}catch(e){setArticles([]);}
      }
      if(briefMatch)setSummary(briefMatch[1].trim());
    }catch(e){setSummary(`Error: ${e.message}`);}
    setLoading(false);
  };

  const tagColors={"Transfer":"#F5A623","Qualification":"#7ED321","Venue":"#4A90E2","Squad":"#E91E63","Draw":"#9C27B0","Regulation":"#FF6D00","Form":"#00e676"};

  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 80px"}}>
      <div style={{...S.label,marginBottom:6}}>Live News Feed</div>
      <div style={{...S.mono,fontSize:11,color:"#555",marginBottom:20}}>Powered by Claude + web search · Results reflect information at time of query</div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        {NEWS_TOPICS.map(t=>(
          <button key={t} onClick={()=>setTopic(t)} style={{...S.btn(topic===t),fontSize:10,padding:"5px 10px",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t}</button>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Custom search…" onKeyDown={e=>e.key==="Enter"&&custom&&fetchNews(custom)}
          style={{flex:1,padding:"8px 14px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"#0d0d20",color:"#e8e8f0",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,outline:"none"}} />
        <button onClick={()=>fetchNews(custom||topic)} disabled={loading} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${ACCENT}`,background:ACCENT+"22",color:loading?"#555":ACCENT,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700}}>
          {loading?"…":"Search"}
        </button>
      </div>

      {summary&&(
        <div style={{...S.card,borderColor:ACCENT+"33",marginBottom:20}}>
          <div style={{...S.label,marginBottom:8,color:ACCENT}}>AI Briefing</div>
          <div style={{fontSize:14,lineHeight:1.7,color:"#ccc"}}>{summary}</div>
        </div>
      )}

      {loading&&(
        <div style={{...S.card,textAlign:"center",padding:"40px",color:"#555",...S.mono,fontSize:12}}>
          ◎ Searching the web and synthesizing news…
        </div>
      )}

      {articles.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {articles.map((a,i)=>(
            <div key={i} style={{...S.card,transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=ACCENT+"33"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8}}>
                <h3 style={{fontSize:16,fontWeight:700,lineHeight:1.4,flex:1}}>{a.headline}</h3>
                <span style={{...S.mono,fontSize:9,padding:"2px 7px",borderRadius:3,background:(tagColors[a.tag]||"#888")+"22",color:tagColors[a.tag]||"#888",flexShrink:0}}>{a.tag}</span>
              </div>
              <p style={{fontSize:13,color:"#999",lineHeight:1.6,marginBottom:10}}>{a.summary}</p>
              <div style={{display:"flex",gap:12,...S.mono,fontSize:10,color:"#555"}}>
                <span>{a.source}</span>
                <span>·</span>
                <span>{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading&&articles.length===0&&!summary&&(
        <div style={{...S.card,textAlign:"center",padding:"60px 24px",color:"#555"}}>
          <div style={{fontSize:32,marginBottom:12}}>◎</div>
          <div style={{...S.mono,fontSize:12}}>Select a topic or enter a search query above to fetch live news</div>
        </div>
      )}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function FIFA2026Hub(){
  const [tab,setTab]=useState("home");
  return(
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",background:"#080815",minHeight:"100vh",color:"#e8e8f0"}}>
      <style>{FONT_CSS}</style>
      <Nav tab={tab} setTab={setTab} />
      {tab==="home"&&<HomeSection setTab={setTab} />}
      {tab==="teams"&&<TeamsSection />}
      {tab==="sim"&&<SimulatorSection />}
      {tab==="predictor"&&<PredictorSection />}
      {tab==="lineups"&&<LineupsSection />}
      {tab==="news"&&<NewsSection />}
    </div>
  );
}
