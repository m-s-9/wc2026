import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');`;
const T = {
  bg:"#F7F5F2",surface:"#FFFFFF",border:"#E8E4DF",borderMd:"#D6D0C8",
  ink:"#111111",text:"#1A1A1A",muted:"#7A7369",faint:"#B0A89E",
  red:"#C84B31",redLight:"#FAF0ED",redMid:"#F0C4B8",
};
const H = {fontFamily:"'Bricolage Grotesque',sans-serif"};
const B = {fontFamily:"'DM Sans',sans-serif"};
const CC = {UEFA:"#2563EB",CONMEBOL:"#D97706",CAF:"#16A34A",AFC:"#DC2626",CONCACAF:"#7C3AED",OFC:"#0891B2"};

// ── 48 OFFICIAL FIFA WC 2026 QUALIFIED TEAMS — Rankings: April 1, 2026 ────────
const TEAMS = [
  // UEFA — 16 teams
  {name:"France",                 conf:"UEFA",     elo:1985, code:"fr",     rank:1},
  {name:"England",                conf:"UEFA",     elo:1960, code:"gb-eng", rank:4},
  {name:"Spain",                  conf:"UEFA",     elo:1952, code:"es",     rank:2},
  {name:"Germany",                conf:"UEFA",     elo:1940, code:"de",     rank:10},
  {name:"Portugal",               conf:"UEFA",     elo:1935, code:"pt",     rank:5},
  {name:"Netherlands",            conf:"UEFA",     elo:1912, code:"nl",     rank:7},
  {name:"Belgium",                conf:"UEFA",     elo:1893, code:"be",     rank:9},
  {name:"Croatia",                conf:"UEFA",     elo:1870, code:"hr",     rank:11},
  {name:"Austria",                conf:"UEFA",     elo:1855, code:"at",     rank:23},
  {name:"Switzerland",            conf:"UEFA",     elo:1845, code:"ch",     rank:18},
  {name:"Norway",                 conf:"UEFA",     elo:1838, code:"no",     rank:27},
  {name:"Türkiye",                conf:"UEFA",     elo:1830, code:"tr",     rank:24},
  {name:"Sweden",                 conf:"UEFA",     elo:1820, code:"se",     rank:29},
  {name:"Scotland",               conf:"UEFA",     elo:1774, code:"gb-sct", rank:34},
  {name:"Bosnia and Herzegovina", conf:"UEFA",     elo:1755, code:"ba",     rank:57},
  {name:"Czechia",                conf:"UEFA",     elo:1748, code:"cz",     rank:37},
  // CONMEBOL — 6 teams
  {name:"Argentina",              conf:"CONMEBOL", elo:1965, code:"ar",     rank:3},
  {name:"Brazil",                 conf:"CONMEBOL", elo:1955, code:"br",     rank:6},
  {name:"Uruguay",                conf:"CONMEBOL", elo:1855, code:"uy",     rank:17},
  {name:"Colombia",               conf:"CONMEBOL", elo:1840, code:"co",     rank:14},
  {name:"Ecuador",                conf:"CONMEBOL", elo:1810, code:"ec",     rank:22},
  {name:"Paraguay",               conf:"CONMEBOL", elo:1785, code:"py",     rank:35},
  // CAF — 10 teams
  {name:"Morocco",                conf:"CAF",      elo:1860, code:"ma",     rank:8},
  {name:"Senegal",                conf:"CAF",      elo:1828, code:"sn",     rank:13},
  {name:"Egypt",                  conf:"CAF",      elo:1788, code:"eg",     rank:31},
  {name:"Ivory Coast",            conf:"CAF",      elo:1762, code:"ci",     rank:28},
  {name:"Tunisia",                conf:"CAF",      elo:1730, code:"tn",     rank:32},
  {name:"South Africa",           conf:"CAF",      elo:1718, code:"za",     rank:63},
  {name:"Algeria",                conf:"CAF",      elo:1715, code:"dz",     rank:26},
  {name:"Ghana",                  conf:"CAF",      elo:1708, code:"gh",     rank:52},
  {name:"DR Congo",               conf:"CAF",      elo:1698, code:"cd",     rank:77},
  {name:"Cape Verde",             conf:"CAF",      elo:1672, code:"cv",     rank:51},
  // AFC — 9 teams
  {name:"Japan",                  conf:"AFC",      elo:1845, code:"jp",     rank:19},
  {name:"South Korea",            conf:"AFC",      elo:1815, code:"kr",     rank:21},
  {name:"Iran",                   conf:"AFC",      elo:1800, code:"ir",     rank:20},
  {name:"Saudi Arabia",           conf:"AFC",      elo:1780, code:"sa",     rank:33},
  {name:"Australia",              conf:"AFC",      elo:1758, code:"au",     rank:25},
  {name:"Uzbekistan",             conf:"AFC",      elo:1728, code:"uz",     rank:64},
  {name:"Qatar",                  conf:"AFC",      elo:1725, code:"qa",     rank:58},
  {name:"Jordan",                 conf:"AFC",      elo:1708, code:"jo",     rank:70},
  {name:"Iraq",                   conf:"AFC",      elo:1695, code:"iq",     rank:75},
  // CONCACAF — 6 teams
  {name:"USA",                    conf:"CONCACAF", elo:1835, code:"us",     rank:16},
  {name:"Mexico",                 conf:"CONCACAF", elo:1810, code:"mx",     rank:15},
  {name:"Canada",                 conf:"CONCACAF", elo:1800, code:"ca",     rank:30},
  {name:"Panama",                 conf:"CONCACAF", elo:1728, code:"pa",     rank:74},
  {name:"Haiti",                  conf:"CONCACAF", elo:1655, code:"ht",     rank:90},
  {name:"Curaçao",                conf:"CONCACAF", elo:1632, code:"cw",     rank:120},
  // OFC — 1 team
  {name:"New Zealand",            conf:"OFC",      elo:1635, code:"nz",     rank:85},
];

// ── ELO BREAKDOWN + FORM + QUALIFYING DATA ───────────────────────────────────
// form: last 5 results, oldest→newest. qW/qD/qL: official qualifying record.
const ELO_BD = {
  "France":         {b:1600,f:+185,q:+120,p:+80, note:"Topped UEFA Group D unbeaten. 2018 World Cup holders. Ranked #1 by FIFA entering the tournament.", form:["W","W","D","W","W"], qW:9,qD:0,qL:1},
  "England":        {b:1600,f:+175,q:+105,p:+80, note:"Euro 2024 finalists. Finished 2nd in UEFA Group B. Strong squad depth at every position.", form:["W","D","W","W","L"], qW:7,qD:2,qL:1},
  "Spain":          {b:1600,f:+168,q:+104,p:+80, note:"UEFA Euro 2024 winners. FIFA #2 ranked team. Dominant qualifying campaign.", form:["W","W","D","W","W"], qW:9,qD:1,qL:0},
  "Germany":        {b:1600,f:+158,q:+102,p:+80, note:"4× World Cup winners. Topped UEFA qualifying group. Wirtz and Musiala lead a new generation.", form:["W","W","W","W","D"], qW:8,qD:1,qL:1},
  "Portugal":       {b:1600,f:+155,q:+100,p:+80, note:"Won UEFA Group A. Nations League success. Squad depth extends well beyond Ronaldo.", form:["W","W","W","D","W"], qW:9,qD:0,qL:1},
  "Netherlands":    {b:1600,f:+138,q:+94, p:+80, note:"2022 quarter-finalists. Topped UEFA Group G. De Jong and Van Dijk anchor a strong spine.", form:["W","W","D","W","W"], qW:8,qD:1,qL:1},
  "Belgium":        {b:1600,f:+113,q:+100,p:+80, note:"Qualified through UEFA Group F. Rebuilding post-golden generation but still competitive.", form:["W","D","W","W","W"], qW:7,qD:2,qL:1},
  "Croatia":        {b:1600,f:+90, q:+100,p:+80, note:"2018 finalists, 2022 third place. Topped UEFA Group E. Experienced squad under Dalić.", form:["W","W","D","W","D"], qW:7,qD:2,qL:1},
  "Austria":        {b:1600,f:+95, q:+80, p:+80, note:"Euro 2024 quarter-finalists. Topped UEFA Group I. Rangnick's high-press has transformed them.", form:["W","W","W","W","D"], qW:8,qD:1,qL:1},
  "Switzerland":    {b:1600,f:+85, q:+80, p:+80, note:"Consistently qualify and advance. Topped UEFA Group C. Well-organised and hard to break down.", form:["W","D","W","D","W"], qW:8,qD:1,qL:1},
  "Norway":         {b:1600,f:+68, q:+90, p:+80, note:"Topped UEFA Group B. Haaland leads the most feared attack entering the tournament.", form:["W","W","W","W","W"], qW:9,qD:0,qL:1},
  "Türkiye":        {b:1600,f:+55, q:+95, p:+80, note:"Won UEFA Path C playoff, beating Kosovo 1-0. 2002 third-place finishers looking to recapture that.", form:["W","D","W","W","W"], qW:6,qD:2,qL:2},
  "Sweden":         {b:1600,f:+52, q:+88, p:+80, note:"Won UEFA Path B — Gyökeres' 88th-min winner vs Poland. Returning after missing Qatar 2022.", form:["W","W","D","W","W"], qW:6,qD:1,qL:3},
  "Scotland":       {b:1600,f:+44, q:+50, p:+80, note:"Qualified 2nd in UEFA Group B. Robertson and McTominay the engine. Targeting knockout stages.", form:["W","W","D","D","W"], qW:6,qD:3,qL:1},
  "Bosnia and Herzegovina":{b:1600,f:+35,q:+40,p:+80, note:"Won UEFA Path A by eliminating Italy on penalties. First World Cup since 2014. Historic.", form:["D","W","D","W","W"], qW:5,qD:2,qL:3},
  "Czechia":        {b:1600,f:+28, q:+40, p:+80, note:"Won UEFA Path D playoff, beating Denmark on penalties. Solid European qualifier.", form:["D","W","W","D","W"], qW:5,qD:1,qL:4},
  "Argentina":      {b:1600,f:+185,q:+100,p:+80, note:"Defending World Cup champions. Copa América 2024 winners. Topped CONMEBOL qualifying. FIFA #3.", form:["W","W","W","D","W"], qW:14,qD:2,qL:2},
  "Brazil":         {b:1600,f:+180,q:+95, p:+80, note:"5× World Cup winners — most ever. 2nd in CONMEBOL qualifying. Vinícius Jr at peak of powers.", form:["W","W","L","W","L"], qW:11,qD:3,qL:4},
  "Uruguay":        {b:1600,f:+90, q:+85, p:+80, note:"2× World Cup winners. Qualified 4th in CONMEBOL. Defensively resolute and tactically mature.", form:["W","W","W","W","D"], qW:10,qD:3,qL:5},
  "Colombia":       {b:1600,f:+90, q:+70, p:+80, note:"3rd in CONMEBOL. Copa América 2024 runners-up. Luis Díaz leads a talented attacking generation.", form:["W","W","W","D","L"], qW:10,qD:3,qL:5},
  "Ecuador":        {b:1600,f:+55, q:+75, p:+80, note:"5th in CONMEBOL qualifying. Caicedo arguably the world's best defensive midfielder.", form:["W","W","D","W","W"], qW:9,qD:4,qL:5},
  "Paraguay":       {b:1600,f:+35, q:+70, p:+80, note:"6th in CONMEBOL. Defensively organised. 2010 quarter-finalists historically.", form:["W","W","D","D","W"], qW:8,qD:5,qL:5},
  "Morocco":        {b:1600,f:+100,q:+80, p:+80, note:"2022 semi-finalists — best ever African finish at a World Cup. Won CAF qualifying group comfortably.", form:["W","W","W","W","D"], qW:6,qD:0,qL:0},
  "Senegal":        {b:1600,f:+58, q:+90, p:+80, note:"Africa Cup of Nations 2022 winners. Topped CAF qualifying group. Competitive post-Mané era.", form:["W","W","W","W","D"], qW:5,qD:1,qL:0},
  "Egypt":          {b:1600,f:+38, q:+70, p:+80, note:"Qualified from CAF Group D. Salah-led but an ageing squad. Previous World Cup was 1990.", form:["W","W","D","W","W"], qW:5,qD:1,qL:0},
  "Ivory Coast":    {b:1600,f:+42, q:+40, p:+80, note:"Africa Cup of Nations 2024 winners. Won CAF qualifying group. Strong squad with good depth.", form:["W","W","W","W","W"], qW:4,qD:2,qL:0},
  "Tunisia":        {b:1600,f:+10, q:+40, p:+80, note:"Qualified from CAF Group B. Defensively organised. Consistent qualifier, rarely advance far.", form:["W","D","W","D","W"], qW:4,qD:1,qL:1},
  "South Africa":   {b:1600,f:+8,  q:+30, p:+80, note:"Qualified from CAF Group C. 2010 hosts returning after missing several cycles.", form:["W","W","D","W","D"], qW:4,qD:1,qL:1},
  "Algeria":        {b:1600,f:+5,  q:+30, p:+80, note:"2019 Africa Cup of Nations winners. Qualified from CAF. Squad in transition after Mahrez era.", form:["W","W","D","D","W"], qW:3,qD:2,qL:1},
  "Ghana":          {b:1600,f:0,   q:+28, p:+80, note:"Qualified from CAF Group I. 2010 quarter-finalists. Talented squad but inconsistent results.", form:["W","D","W","D","D"], qW:4,qD:0,qL:2},
  "DR Congo":       {b:1600,f:-2,  q:+18, p:+82, note:"Won inter-confederation playoff beating Jamaica 1-0. First World Cup since 1974 as Zaire.", form:["W","W","W","W","W"], qW:4,qD:1,qL:1},
  "Cape Verde":     {b:1600,f:-8,  q:0,   p:+80, note:"First ever World Cup qualification. Topped CAF qualifying group. Debut appearance on the biggest stage.", form:["W","W","W","D","W"], qW:5,qD:1,qL:0},
  "Japan":          {b:1600,f:+85, q:+80, p:+80, note:"First nation to qualify for 2026. Dominated AFC qualifying. Shocked Germany and Spain in Qatar 2022.", form:["W","W","W","W","W"], qW:8,qD:0,qL:0},
  "South Korea":    {b:1600,f:+60, q:+75, p:+80, note:"Qualified 2nd in AFC Group B. Son Heung-min's likely final World Cup. Solid knockout experience.", form:["W","W","D","W","W"], qW:6,qD:1,qL:1},
  "Iran":           {b:1600,f:+60, q:+60, p:+80, note:"Qualified directly from AFC Group A. Disciplined and physical. Third consecutive World Cup.", form:["W","W","D","W","D"], qW:5,qD:2,qL:1},
  "Saudi Arabia":   {b:1600,f:+50, q:+50, p:+80, note:"Qualified from AFC. Famous 2-1 win over Argentina at Qatar 2022 remains their high watermark.", form:["W","W","D","D","W"], qW:5,qD:1,qL:2},
  "Australia":      {b:1600,f:+38, q:+40, p:+80, note:"2022 quarter-finalists. Qualified through AFC. Leckie and Hrustic lead a competitive squad.", form:["W","W","D","W","D"], qW:5,qD:1,qL:2},
  "Uzbekistan":     {b:1600,f:+8,  q:+40, p:+80, note:"Historic first World Cup qualification. Won AFC Group A. Rising football power in Central Asia.", form:["W","W","W","W","D"], qW:6,qD:1,qL:1},
  "Qatar":          {b:1600,f:+5,  q:+40, p:+80, note:"Second World Cup, first as qualifier. 2022 hosts. AFC qualifying success in an open group.", form:["W","D","W","W","D"], qW:5,qD:1,qL:2},
  "Jordan":         {b:1600,f:-12, q:+40, p:+80, note:"Historic first World Cup qualification. 2023 Asian Cup runners-up. Hard-fought qualifying campaign.", form:["W","W","W","D","W"], qW:5,qD:0,qL:3},
  "Iraq":           {b:1600,f:0,   q:+15, p:+80, note:"Won inter-confederation playoff final vs Bolivia 2-1. First World Cup since 1986. 40 years in the making.", form:["W","W","W","D","W"], qW:4,qD:2,qL:2},
  "USA":            {b:1600,f:+75, q:+80, p:+80, note:"Co-host nation. Young squad maturing fast. Pulisic leads a generation with real Premier League quality.", form:["W","W","D","W","D"], qW:8,qD:3,qL:1},
  "Mexico":         {b:1600,f:+55, q:+75, p:+80, note:"Co-host nation. 8 consecutive Round of 16 appearances. Aiming to finally break past that stage.", form:["W","W","W","W","D"], qW:7,qD:3,qL:2},
  "Canada":         {b:1600,f:+50, q:+70, p:+80, note:"Co-host nation. First World Cup since 1986 was in 2022. Davies and Johnston are genuine stars.", form:["W","W","D","W","W"], qW:7,qD:4,qL:1},
  "Panama":         {b:1600,f:+8,  q:+40, p:+80, note:"Qualified through CONCACAF. Second World Cup in history. Disciplined and physically strong.", form:["W","W","D","W","W"], qW:7,qD:2,qL:3},
  "Haiti":          {b:1600,f:-35, q:+10, p:+80, note:"Qualified through CONCACAF. Previous World Cup was 1974. A remarkable achievement for Haitian football.", form:["W","D","W","D","W"], qW:5,qD:2,qL:5},
  "Curaçao":        {b:1600,f:-48, q:0,   p:+80, note:"Smallest nation ever to qualify for the World Cup. First ever qualification. Historic CONCACAF achievement.", form:["W","W","D","W","D"], qW:5,qD:2,qL:5},
  "New Zealand":    {b:1600,f:-55, q:+5,  p:+85, note:"Won OFC qualifying — the confederation's sole guaranteed berth in 2026. Debut under great pressure.", form:["W","W","W","W","D"], qW:4,qD:0,qL:2},
};


// ── SQUADS (8 teams with detailed data) ───────────────────────────────────────
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

  // ── UEFA ─────────────────────────────────────────────────────────────────────
  "Austria":[
    {name:"Patrick Pentz",pos:"GK",club:"Anderlecht",age:27,rating:79},
    {name:"Alexander Schlager",pos:"GK",club:"VfB Stuttgart",age:30,rating:80},
    {name:"Stefan Posch",pos:"RB",club:"Bologna",age:27,rating:80},
    {name:"Maximilian Wöber",pos:"CB",club:"Borussia M'gladbach",age:26,rating:80},
    {name:"Kevin Danso",pos:"CB",club:"RC Lens",age:26,rating:81},
    {name:"Philipp Lienhart",pos:"CB",club:"SC Freiburg",age:28,rating:79},
    {name:"Philipp Mwene",pos:"LB",club:"Mainz",age:30,rating:77},
    {name:"Nicolas Seiwald",pos:"DM",club:"RB Leipzig",age:23,rating:81},
    {name:"Konrad Laimer",pos:"CM",club:"Bayern Munich",age:27,rating:83},
    {name:"Christoph Baumgartner",pos:"CM",club:"RB Leipzig",age:25,rating:81},
    {name:"Marcel Sabitzer",pos:"CAM",club:"Borussia Dortmund",age:31,rating:82},
    {name:"Patrick Wimmer",pos:"RW",club:"VfB Stuttgart",age:23,rating:78},
    {name:"Michael Gregoritsch",pos:"ST",club:"SC Freiburg",age:30,rating:79},
    {name:"Marko Arnautovic",pos:"ST",club:"Inter Milan",age:36,rating:80},
    {name:"Romano Schmid",pos:"CAM",club:"Werder Bremen",age:24,rating:78},
  ],
  "Switzerland":[
    {name:"Yann Sommer",pos:"GK",club:"Inter Milan",age:36,rating:84},
    {name:"Gregor Kobel",pos:"GK",club:"Borussia Dortmund",age:27,rating:83},
    {name:"Silvan Widmer",pos:"RB",club:"Mainz",age:31,rating:79},
    {name:"Manuel Akanji",pos:"CB",club:"Manchester City",age:29,rating:85},
    {name:"Nico Elvedi",pos:"CB",club:"Borussia M'gladbach",age:28,rating:81},
    {name:"Ricardo Rodriguez",pos:"LB",club:"Torino",age:32,rating:79},
    {name:"Granit Xhaka",pos:"DM",club:"Bayer Leverkusen",age:32,rating:84},
    {name:"Remo Freuler",pos:"CM",club:"Bologna",age:32,rating:81},
    {name:"Fabian Rieder",pos:"CM",club:"Stade Rennais",age:22,rating:79},
    {name:"Denis Zakaria",pos:"CM",club:"Monaco",age:28,rating:80},
    {name:"Ruben Vargas",pos:"LW",club:"Augsburg",age:26,rating:79},
    {name:"Dan Ndoye",pos:"RW",club:"Bologna",age:24,rating:80},
    {name:"Breel Embolo",pos:"ST",club:"Monaco",age:27,rating:80},
    {name:"Zeki Amdouni",pos:"ST",club:"Benfica",age:24,rating:79},
    {name:"Noah Okafor",pos:"LW",club:"AC Milan",age:24,rating:79},
  ],
  "Norway":[
    {name:"Ørjan Nyland",pos:"GK",club:"Southampton",age:34,rating:78},
    {name:"Kristoffer Ajer",pos:"RB",club:"Brentford",age:26,rating:80},
    {name:"Leo Østigård",pos:"CB",club:"Napoli",age:25,rating:79},
    {name:"Andreas Hanche-Olsen",pos:"CB",club:"Nottingham Forest",age:27,rating:78},
    {name:"Birger Meling",pos:"LB",club:"Stade Rennais",age:30,rating:78},
    {name:"Sander Berge",pos:"DM",club:"Burnley",age:27,rating:81},
    {name:"Martin Ødegaard",pos:"CAM",club:"Arsenal",age:26,rating:88},
    {name:"Fredrik Aursnes",pos:"CM",club:"Benfica",age:28,rating:80},
    {name:"Mohamed Elyounoussi",pos:"LW",club:"Southampton",age:30,rating:78},
    {name:"Antonio Nusa",pos:"RW",club:"RB Leipzig",age:19,rating:79},
    {name:"Alexander Sørloth",pos:"ST",club:"Atlético Madrid",age:28,rating:81},
    {name:"Erling Haaland",pos:"ST",club:"Manchester City",age:25,rating:94},
    {name:"Jørgen Strand Larsen",pos:"ST",club:"Celta Vigo",age:25,rating:78},
    {name:"Patrick Berg",pos:"CM",club:"Bodo/Glimt",age:26,rating:77},
    {name:"Mathias Normann",pos:"CM",club:"Nottingham Forest",age:28,rating:78},
  ],
  "Türkiye":[
    {name:"Mert Günok",pos:"GK",club:"Besiktas",age:36,rating:79},
    {name:"Altay Bayındır",pos:"GK",club:"Manchester United",age:26,rating:78},
    {name:"Zeki Çelik",pos:"RB",club:"Roma",age:27,rating:79},
    {name:"Merih Demiral",pos:"CB",club:"Al-Ahli",age:26,rating:82},
    {name:"Samet Akaydın",pos:"CB",club:"Fenerbahçe",age:27,rating:78},
    {name:"Ferdi Kadıoğlu",pos:"LB",club:"Brighton",age:25,rating:82},
    {name:"Hakan Çalhanoğlu",pos:"DM",club:"Inter Milan",age:31,rating:86},
    {name:"Salih Özcan",pos:"CM",club:"Borussia Dortmund",age:27,rating:79},
    {name:"Arda Güler",pos:"CAM",club:"Real Madrid",age:20,rating:83},
    {name:"Kerem Aktürkoğlu",pos:"LW",club:"Galatasaray",age:25,rating:81},
    {name:"Orkun Kökçü",pos:"CM",club:"Benfica",age:24,rating:81},
    {name:"Cenk Tosun",pos:"ST",club:"Besiktas",age:34,rating:78},
    {name:"Kaan Ayhan",pos:"CB",club:"Galatasaray",age:30,rating:79},
    {name:"Abdülkerim Bardakcı",pos:"CB",club:"Galatasaray",age:27,rating:79},
    {name:"Baris Alper Yilmaz",pos:"RW",club:"Galatasaray",age:24,rating:78},
  ],
  "Sweden":[
    {name:"Robin Olsen",pos:"GK",club:"Aston Villa",age:34,rating:79},
    {name:"Emil Krafth",pos:"RB",club:"Newcastle United",age:30,rating:78},
    {name:"Victor Lindelöf",pos:"CB",club:"Manchester United",age:30,rating:81},
    {name:"Isak Hien",pos:"CB",club:"Atalanta",age:25,rating:80},
    {name:"Ludwig Augustinsson",pos:"LB",club:"Aston Villa",age:30,rating:78},
    {name:"Dejan Kulusevski",pos:"CM",club:"Tottenham",age:25,rating:83},
    {name:"Emil Forsberg",pos:"CAM",club:"RB Leipzig",age:33,rating:81},
    {name:"Mattias Svanberg",pos:"CM",club:"Wolfsburg",age:27,rating:78},
    {name:"Anthony Elanga",pos:"RW",club:"Nottingham Forest",age:23,rating:79},
    {name:"Viktor Gyökeres",pos:"ST",club:"Sporting CP",age:27,rating:87},
    {name:"Alexander Isak",pos:"ST",club:"Newcastle United",age:25,rating:86},
    {name:"Jesper Karlsson",pos:"LW",club:"Bologna",age:27,rating:79},
    {name:"Samuel Chukwueze",pos:"RW",club:"AC Milan",age:25,rating:79},
    {name:"Robin Quaison",pos:"LW",club:"Mainz",age:31,rating:77},
    {name:"Albin Ekdal",pos:"DM",club:"Sampdoria",age:35,rating:77},
  ],
  "Scotland":[
    {name:"Angus Gunn",pos:"GK",club:"Norwich City",age:28,rating:78},
    {name:"Craig Gordon",pos:"GK",club:"Hearts",age:41,rating:77},
    {name:"Nathan Patterson",pos:"RB",club:"Everton",age:23,rating:78},
    {name:"Grant Hanley",pos:"CB",club:"Norwich City",age:33,rating:77},
    {name:"Scott McKenna",pos:"CB",club:"Nottingham Forest",age:28,rating:78},
    {name:"Andy Robertson",pos:"LB",club:"Liverpool",age:31,rating:85},
    {name:"Scott McTominay",pos:"CM",club:"Napoli",age:28,rating:83},
    {name:"John McGinn",pos:"CM",club:"Aston Villa",age:30,rating:82},
    {name:"Stuart Armstrong",pos:"CM",club:"Southampton",age:32,rating:78},
    {name:"Billy Gilmour",pos:"CM",club:"Brighton",age:23,rating:79},
    {name:"Ryan Christie",pos:"RW",club:"Bournemouth",age:30,rating:78},
    {name:"Che Adams",pos:"ST",club:"Torino",age:29,rating:78},
    {name:"Lyndon Dykes",pos:"ST",club:"QPR",age:29,rating:76},
    {name:"Lawrence Shankland",pos:"ST",club:"Hearts",age:29,rating:77},
    {name:"Ryan Jack",pos:"DM",club:"Rangers",age:32,rating:77},
  ],
  "Bosnia and Herzegovina":[
    {name:"Ibrahim Šehić",pos:"GK",club:"Konyaspor",age:36,rating:77},
    {name:"Sead Kolašinac",pos:"LB",club:"Atalanta",age:31,rating:79},
    {name:"Dario Šarić",pos:"CB",club:"Mallorca",age:30,rating:78},
    {name:"Anel Ahmedhodžić",pos:"CB",club:"Sheffield United",age:26,rating:78},
    {name:"Amar Dedić",pos:"RB",club:"RB Salzburg",age:22,rating:78},
    {name:"Dženis Burnić",pos:"CM",club:"Düsseldorf",age:26,rating:77},
    {name:"Miralem Pjanić",pos:"CM",club:"Sharjah",age:34,rating:79},
    {name:"Ermedin Demirović",pos:"ST",club:"VfB Stuttgart",age:26,rating:82},
    {name:"Rade Krunić",pos:"CM",club:"AC Milan",age:28,rating:79},
    {name:"Edin Džeko",pos:"ST",club:"Fenerbahçe",age:38,rating:79},
    {name:"Benjamin Šeško",pos:"ST",club:"RB Leipzig",age:21,rating:82},
    {name:"Haris Hajradinović",pos:"CAM",club:"Westerlo",age:27,rating:77},
    {name:"Ognjen Vranješ",pos:"CB",club:"Olympiacos",age:35,rating:76},
    {name:"Armin Gigović",pos:"RW",club:"Sturm Graz",age:21,rating:75},
    {name:"Haris Duljevic",pos:"LW",club:"Copenhagen",age:29,rating:77},
  ],
  "Czechia":[
    {name:"Jiří Staněk",pos:"GK",club:"Slavia Prague",age:27,rating:79},
    {name:"Vladimír Coufal",pos:"RB",club:"West Ham",age:32,rating:79},
    {name:"Tomáš Holeš",pos:"CB",club:"Slavia Prague",age:30,rating:78},
    {name:"Robin Hranáč",pos:"CB",club:"VfB Stuttgart",age:24,rating:79},
    {name:"Jan Bořil",pos:"LB",club:"Slavia Prague",age:32,rating:77},
    {name:"Tomáš Souček",pos:"CM",club:"West Ham",age:30,rating:82},
    {name:"Lukáš Provod",pos:"CM",club:"Slavia Prague",age:26,rating:78},
    {name:"Antonín Barák",pos:"CAM",club:"Fiorentina",age:29,rating:80},
    {name:"Ondřej Lingr",pos:"LW",club:"SC Freiburg",age:25,rating:77},
    {name:"Patrik Schick",pos:"ST",club:"Bayer Leverkusen",age:29,rating:83},
    {name:"Adam Hložek",pos:"RW",club:"Hoffenheim",age:22,rating:79},
    {name:"Lukáš Sadílek",pos:"DM",club:"Twente",age:25,rating:77},
    {name:"Jan Kuchta",pos:"ST",club:"Slavia Prague",age:27,rating:77},
    {name:"Pavel Kadeřábek",pos:"RB",club:"Hoffenheim",age:32,rating:78},
    {name:"Matěj Jurásek",pos:"LW",club:"Hamburger SV",age:21,rating:76},
  ],
  "Uruguay":[
    {name:"Sergio Rochet",pos:"GK",club:"Club Nacional",age:30,rating:80},
    {name:"Nahitan Nández",pos:"RB",club:"Cagliari",age:28,rating:79},
    {name:"Ronald Araújo",pos:"CB",club:"Barcelona",age:25,rating:85},
    {name:"Sebastián Coates",pos:"CB",club:"Sporting CP",age:33,rating:79},
    {name:"Mathías Olivera",pos:"LB",club:"Napoli",age:27,rating:81},
    {name:"Rodrigo Bentancur",pos:"DM",club:"Tottenham",age:27,rating:83},
    {name:"Federico Valverde",pos:"CM",club:"Real Madrid",age:26,rating:88},
    {name:"Manuel Ugarte",pos:"DM",club:"Manchester United",age:24,rating:82},
    {name:"Facundo Torres",pos:"RW",club:"Orlando City",age:25,rating:79},
    {name:"Darwin Núñez",pos:"ST",club:"Liverpool",age:25,rating:84},
    {name:"Maximiliano Araújo",pos:"LW",club:"Sporting CP",age:24,rating:78},
    {name:"Matías Vecino",pos:"CM",club:"Lazio",age:33,rating:78},
    {name:"Agustín Canobbio",pos:"RW",club:"Athletic Bilbao",age:25,rating:77},
    {name:"Santiago Bueno",pos:"CB",club:"Wolverhampton",age:25,rating:78},
    {name:"Brian Rodríguez",pos:"LW",club:"Independiente",age:24,rating:77},
  ],
  "Colombia":[
    {name:"Camilo Vargas",pos:"GK",club:"Atlas",age:33,rating:78},
    {name:"Daniel Muñoz",pos:"RB",club:"Crystal Palace",age:28,rating:80},
    {name:"Davinson Sánchez",pos:"CB",club:"Galatasaray",age:28,rating:80},
    {name:"Jhon Lucumí",pos:"CB",club:"Bologna",age:25,rating:79},
    {name:"Johan Mojica",pos:"LB",club:"Real Betis",age:32,rating:78},
    {name:"Jefferson Lerma",pos:"DM",club:"Crystal Palace",age:30,rating:79},
    {name:"Richard Ríos",pos:"CM",club:"Palmeiras",age:24,rating:80},
    {name:"Wilmar Barrios",pos:"DM",club:"Zenit",age:30,rating:79},
    {name:"James Rodríguez",pos:"CAM",club:"Rayo Vallecano",age:34,rating:81},
    {name:"Luis Díaz",pos:"LW",club:"Liverpool",age:28,rating:85},
    {name:"Jhon Durán",pos:"ST",club:"Aston Villa",age:21,rating:81},
    {name:"Cucho Hernández",pos:"ST",club:"Columbus Crew",age:25,rating:79},
    {name:"Rafael Santos Borré",pos:"ST",club:"Frankfurt",age:29,rating:78},
    {name:"Daniel Ruiz",pos:"CAM",club:"Royal Antwerp",age:22,rating:77},
    {name:"Juan Cuadrado",pos:"RW",club:"Inter Miami",age:36,rating:77},
  ],
  "Ecuador":[
    {name:"Hernán Galíndez",pos:"GK",club:"Deportivo Cuenca",age:36,rating:76},
    {name:"Angelo Preciado",pos:"RB",club:"Racing Club",age:26,rating:78},
    {name:"Piero Hincapié",pos:"CB",club:"Bayer Leverkusen",age:23,rating:82},
    {name:"Willian Pacho",pos:"CB",club:"PSG",age:23,rating:80},
    {name:"Pervis Estupiñán",pos:"LB",club:"Brighton",age:26,rating:82},
    {name:"Moisés Caicedo",pos:"DM",club:"Chelsea",age:23,rating:86},
    {name:"Carlos Gruezo",pos:"CM",club:"Augsburg",age:28,rating:77},
    {name:"Jeremy Sarmiento",pos:"RW",club:"Brighton",age:23,rating:77},
    {name:"Gonzalo Plata",pos:"LW",club:"Al-Qadsiah",age:24,rating:77},
    {name:"Enner Valencia",pos:"ST",club:"Fenerbahçe",age:35,rating:78},
    {name:"Kendry Páez",pos:"CAM",club:"Chelsea",age:18,rating:78},
    {name:"Leonardo Campana",pos:"ST",club:"Inter Miami",age:24,rating:76},
    {name:"Robert Arboleda",pos:"CB",club:"São Paulo",age:32,rating:78},
    {name:"John Yeboah",pos:"RW",club:"Nürnberg",age:24,rating:76},
    {name:"Kevin Rodríguez",pos:"CM",club:"Club Aucas",age:26,rating:75},
  ],
  "Paraguay":[
    {name:"Antony Silva",pos:"GK",club:"Olimpia",age:36,rating:75},
    {name:"Santiago Arzamendia",pos:"LB",club:"Celta Vigo",age:26,rating:78},
    {name:"Gustavo Gómez",pos:"CB",club:"Palmeiras",age:31,rating:80},
    {name:"Junior Alonso",pos:"CB",club:"Atlético Mineiro",age:30,rating:79},
    {name:"Fabián Balbuena",pos:"CB",club:"Nacional",age:33,rating:77},
    {name:"Mathías Villasanti",pos:"DM",club:"Grêmio",age:27,rating:77},
    {name:"Miguel Almirón",pos:"CM",club:"Newcastle United",age:31,rating:80},
    {name:"Ángel Romero",pos:"RW",club:"Cruz Azul",age:32,rating:77},
    {name:"Julio Enciso",pos:"CAM",club:"Brighton",age:21,rating:79},
    {name:"Antonio Sanabria",pos:"ST",club:"Torino",age:28,rating:78},
    {name:"Alejandro Romero Gamarra",pos:"LW",club:"Al-Qadsiah",age:32,rating:77},
    {name:"Richard Sánchez",pos:"CM",club:"América",age:29,rating:77},
    {name:"Omar Alderete",pos:"CB",club:"Getafe",age:28,rating:77},
    {name:"Carlos González",pos:"ST",club:"Tigres",age:32,rating:76},
    {name:"Gabriel Avalos",pos:"ST",club:"Libertad",age:34,rating:74},
  ],
  "Senegal":[
    {name:"Edouard Mendy",pos:"GK",club:"Al-Ahli",age:32,rating:82},
    {name:"Youssouf Sabaly",pos:"RB",club:"Real Betis",age:32,rating:79},
    {name:"Kalidou Koulibaly",pos:"CB",club:"Al-Hilal",age:33,rating:83},
    {name:"Abdou Diallo",pos:"CB",club:"RB Leipzig",age:28,rating:79},
    {name:"Formose Mendy",pos:"LB",club:"Stade Brestois",age:24,rating:77},
    {name:"Idrissa Gana Gueye",pos:"DM",club:"Everton",age:35,rating:80},
    {name:"Pape Matar Sarr",pos:"CM",club:"Tottenham",age:22,rating:80},
    {name:"Ismaïla Sarr",pos:"RW",club:"Crystal Palace",age:26,rating:81},
    {name:"Sadio Mané",pos:"LW",club:"Al-Nassr",age:32,rating:83},
    {name:"Nicolas Jackson",pos:"ST",club:"Chelsea",age:24,rating:81},
    {name:"Iliman Ndiaye",pos:"CAM",club:"Olympique Marseille",age:25,rating:80},
    {name:"Lamine Camara",pos:"CM",club:"Monaco",age:20,rating:79},
    {name:"Habib Diallo",pos:"ST",club:"Strasbourg",age:29,rating:78},
    {name:"Cheikhou Kouyaté",pos:"DM",club:"Al-Duhail",age:35,rating:76},
    {name:"Mamadou Loum",pos:"CM",club:"Stade de Reims",age:28,rating:77},
  ],
  "Egypt":[
    {name:"Mohamed El-Shennawy",pos:"GK",club:"Al-Ahly",age:36,rating:79},
    {name:"Zaki Tawfik",pos:"RB",club:"Al-Ahly",age:27,rating:75},
    {name:"Ahmed Hegazy",pos:"CB",club:"Al-Ittihad",age:33,rating:78},
    {name:"Omar Kamal",pos:"CB",club:"Zamalek",age:26,rating:75},
    {name:"Omar Gaber",pos:"LB",club:"Al-Ahly",age:31,rating:75},
    {name:"Tarek Hamed",pos:"DM",club:"Zamalek",age:35,rating:76},
    {name:"Amr El-Sulaya",pos:"CM",club:"Al-Ahly",age:29,rating:75},
    {name:"Omar Marmoush",pos:"RW",club:"Manchester City",age:26,rating:84},
    {name:"Mohamed Salah",pos:"CAM",club:"Liverpool",age:33,rating:88},
    {name:"Mostafa Mohamed",pos:"ST",club:"Galatasaray",age:27,rating:78},
    {name:"Ramadan Sobhi",pos:"LW",club:"Al-Ahly",age:28,rating:77},
    {name:"Trezeguet",pos:"LW",club:"Trabzonspor",age:30,rating:77},
    {name:"Ahmed Sayed Zizo",pos:"RW",club:"Zamalek",age:32,rating:75},
    {name:"Mahmoud Hamdy",pos:"DM",club:"Al-Ittihad",age:30,rating:76},
    {name:"Ibrahim Adel",pos:"RW",club:"Belenenses",age:22,rating:75},
  ],
  "Ivory Coast":[
    {name:"Badra Ali Sangaré",pos:"GK",club:"LOSC Lille",age:30,rating:78},
    {name:"Serge Aurier",pos:"RB",club:"Nottingham Forest",age:32,rating:78},
    {name:"Odilon Kossounou",pos:"CB",club:"Bayer Leverkusen",age:23,rating:80},
    {name:"Eric Bailly",pos:"CB",club:"Stade Brestois",age:30,rating:78},
    {name:"Ghislain Konan",pos:"LB",club:"Stade Reims",age:28,rating:77},
    {name:"Ibrahim Sangaré",pos:"DM",club:"Nottingham Forest",age:27,rating:81},
    {name:"Franck Kessié",pos:"CM",club:"Al-Ahli",age:28,rating:81},
    {name:"Jean Michaël Seri",pos:"CM",club:"Monaco",age:32,rating:78},
    {name:"Simon Adingra",pos:"RW",club:"Brighton",age:23,rating:79},
    {name:"Wilfried Zaha",pos:"LW",club:"Galatasaray",age:32,rating:80},
    {name:"Sébastien Haller",pos:"ST",club:"Borussia Dortmund",age:30,rating:80},
    {name:"Jonathan Bamba",pos:"LW",club:"Club Brugge",age:28,rating:78},
    {name:"Nicolas Pépé",pos:"RW",club:"OGC Nice",age:29,rating:78},
    {name:"Ismaël Traoré",pos:"CB",club:"Paris FC",age:28,rating:76},
    {name:"Wilfried Singo",pos:"RB",club:"Monaco",age:23,rating:78},
  ],
  "Tunisia":[
    {name:"Aymen Dahmen",pos:"GK",club:"Espérance de Tunis",age:26,rating:77},
    {name:"Mohamed Drager",pos:"RB",club:"FC Lorient",age:27,rating:77},
    {name:"Montassar Talbi",pos:"CB",club:"FC Lorient",age:25,rating:77},
    {name:"Dylan Bronn",pos:"CB",club:"Salernitana",age:29,rating:76},
    {name:"Wajdi Kechrida",pos:"RB",club:"Espérance de Tunis",age:28,rating:76},
    {name:"Ellyes Skhiri",pos:"DM",club:"Eintracht Frankfurt",age:29,rating:80},
    {name:"Aïssa Laïdouni",pos:"CM",club:"Ferencváros",age:28,rating:78},
    {name:"Hannibal Mejbri",pos:"CM",club:"Burnley",age:21,rating:78},
    {name:"Naïm Sliti",pos:"RW",club:"Sivasspor",age:30,rating:75},
    {name:"Seifeddine Jaziri",pos:"ST",club:"Montpellier",age:29,rating:76},
    {name:"Youssef Msakni",pos:"LW",club:"Espérance de Tunis",age:34,rating:76},
    {name:"Wahbi Khazri",pos:"CAM",club:"Montpellier",age:33,rating:76},
    {name:"Issam Jebali",pos:"ST",club:"Club Brugge",age:30,rating:76},
    {name:"Sayfallah Ltaief",pos:"LW",club:"CS Sfaxien",age:25,rating:74},
    {name:"Bechir Ben Said",pos:"GK",club:"Espérance de Tunis",age:30,rating:74},
  ],
  "South Africa":[
    {name:"Ronwen Williams",pos:"GK",club:"Mamelodi Sundowns",age:32,rating:78},
    {name:"Terrence Mashego",pos:"LB",club:"Mamelodi Sundowns",age:25,rating:75},
    {name:"Siyanda Xulu",pos:"CB",club:"Mamelodi Sundowns",age:31,rating:75},
    {name:"Rushine De Reuck",pos:"CB",club:"Mamelodi Sundowns",age:29,rating:75},
    {name:"Thapelo Morena",pos:"RB",club:"Mamelodi Sundowns",age:31,rating:76},
    {name:"Mothobi Mvala",pos:"DM",club:"Mamelodi Sundowns",age:29,rating:77},
    {name:"Teboho Mokoena",pos:"CM",club:"Mamelodi Sundowns",age:27,rating:78},
    {name:"Themba Zwane",pos:"CAM",club:"Mamelodi Sundowns",age:34,rating:77},
    {name:"Percy Tau",pos:"LW",club:"Al-Ahly",age:30,rating:78},
    {name:"Lyle Foster",pos:"ST",club:"Burnley",age:24,rating:76},
    {name:"Bongokuhle Hlongwane",pos:"RW",club:"Celtic",age:24,rating:76},
    {name:"Evidence Makgopa",pos:"ST",club:"Orlando Pirates",age:24,rating:76},
    {name:"Yusuf Maart",pos:"CM",club:"Mamelodi Sundowns",age:29,rating:76},
    {name:"Grant Kekana",pos:"CB",club:"Mamelodi Sundowns",age:30,rating:74},
    {name:"Gaston Sirino",pos:"CAM",club:"Mamelodi Sundowns",age:33,rating:75},
  ],
  "Algeria":[
    {name:"Raïs M'Bolhi",pos:"GK",club:"Wydad AC",age:38,rating:77},
    {name:"Youcef Atal",pos:"RB",club:"OGC Nice",age:28,rating:79},
    {name:"Aïssa Mandi",pos:"CB",club:"Villarreal",age:33,rating:79},
    {name:"Ramy Bensebaini",pos:"LB",club:"Borussia Dortmund",age:30,rating:80},
    {name:"Djamel Benlamri",pos:"CB",club:"Olympique Lyon",age:33,rating:76},
    {name:"Ismael Bennacer",pos:"DM",club:"AC Milan",age:27,rating:82},
    {name:"Ramiz Zerrouki",pos:"CM",club:"Feyenoord",age:25,rating:78},
    {name:"Riyad Mahrez",pos:"RW",club:"Al-Ahli",age:34,rating:83},
    {name:"Amine Gouiri",pos:"CAM",club:"Stade Rennais",age:24,rating:79},
    {name:"Yacine Adli",pos:"CM",club:"Fiorentina",age:24,rating:79},
    {name:"Islam Slimani",pos:"ST",club:"Stade Brestois",age:36,rating:77},
    {name:"Baghdad Bounedjah",pos:"ST",club:"Al-Sadd",age:32,rating:76},
    {name:"Hicham Boudaoui",pos:"CM",club:"OGC Nice",age:24,rating:78},
    {name:"Billal Brahimi",pos:"LW",club:"Al-Qadsiah",age:30,rating:77},
    {name:"Mehdi Tahrat",pos:"RB",club:"Montpellier",age:26,rating:75},
  ],
  "Ghana":[
    {name:"Lawrence Ati-Zigi",pos:"GK",club:"St. Gallen",age:27,rating:77},
    {name:"Tariq Lamptey",pos:"RB",club:"Brighton",age:24,rating:77},
    {name:"Alexander Djiku",pos:"CB",club:"Fenerbahçe",age:30,rating:79},
    {name:"Daniel Amartey",pos:"CB",club:"Leicester City",age:30,rating:77},
    {name:"Gideon Mensah",pos:"LB",club:"AJ Auxerre",age:25,rating:76},
    {name:"Thomas Partey",pos:"DM",club:"Arsenal",age:32,rating:83},
    {name:"Salis Abdul Samed",pos:"CM",club:"RC Lens",age:24,rating:78},
    {name:"Mohammed Kudus",pos:"CAM",club:"West Ham",age:24,rating:82},
    {name:"Inaki Williams",pos:"ST",club:"Athletic Bilbao",age:30,rating:81},
    {name:"Jordan Ayew",pos:"LW",club:"Leicester City",age:33,rating:77},
    {name:"Antoine Semenyo",pos:"RW",club:"Bournemouth",age:25,rating:78},
    {name:"Kamaldeen Sulemana",pos:"LW",club:"Southampton",age:23,rating:78},
    {name:"Iddrisu Baba",pos:"DM",club:"Rayo Vallecano",age:28,rating:77},
    {name:"Felix Afena-Gyan",pos:"ST",club:"Cremonese",age:22,rating:75},
    {name:"Osman Bukari",pos:"RW",club:"Red Star Belgrade",age:24,rating:76},
  ],
  "DR Congo":[
    {name:"Joël Kiassumbua",pos:"GK",club:"Os Belenenses",age:37,rating:75},
    {name:"Arthur Masuaku",pos:"LB",club:"Besiktas",age:30,rating:77},
    {name:"Chancel Mbemba",pos:"CB",club:"Marseille",age:30,rating:79},
    {name:"Christian Luyindama",pos:"CB",club:"Galatasaray",age:30,rating:77},
    {name:"Samuel Moutoussamy",pos:"CM",club:"Nantes",age:28,rating:77},
    {name:"Paul-José Mpoku",pos:"CM",club:"Standard Liège",age:32,rating:77},
    {name:"Yoane Wissa",pos:"RW",club:"Brentford",age:28,rating:80},
    {name:"Cédric Bakambu",pos:"ST",club:"Olympiacos",age:33,rating:77},
    {name:"Silas",pos:"LW",club:"VfB Stuttgart",age:25,rating:78},
    {name:"Théo Bongonda",pos:"RW",club:"Genk",age:29,rating:77},
    {name:"Fiston Mayele",pos:"ST",club:"Pyramids",age:28,rating:76},
    {name:"Bryan Limbombe",pos:"LW",club:"Club Brugge",age:22,rating:75},
    {name:"Gaël Kakuta",pos:"CAM",club:"Amiens",age:32,rating:76},
    {name:"Ngonda Muzinga",pos:"CB",club:"Austria Wien",age:26,rating:74},
    {name:"Pierre Kalulu",pos:"CB",club:"Juventus",age:24,rating:79},
  ],
  "Cape Verde":[
    {name:"Vozinha",pos:"GK",club:"Cádiz",age:33,rating:75},
    {name:"Roberto Lopes",pos:"CB",club:"Shamrock Rovers",age:31,rating:74},
    {name:"Logan Costa",pos:"CB",club:"Toulouse",age:25,rating:76},
    {name:"Stopira",pos:"CB",club:"Midtjylland",age:35,rating:74},
    {name:"Dylan Tavares",pos:"LB",club:"Benfica B",age:24,rating:73},
    {name:"Jamiro Monteiro",pos:"CM",club:"Nashville SC",age:30,rating:76},
    {name:"Kenny Rocha Santos",pos:"DM",club:"Sint-Truiden",age:29,rating:75},
    {name:"Garry Rodrigues",pos:"RW",club:"Galatasaray",age:33,rating:76},
    {name:"Jovane Cabral",pos:"LW",club:"Sporting CP",age:25,rating:77},
    {name:"Gilson Tavares",pos:"ST",club:"Servette",age:25,rating:74},
    {name:"Ryan Mendes",pos:"RW",club:"Vitória SC",age:34,rating:74},
    {name:"Djedson",pos:"LW",club:"SC Braga B",age:23,rating:73},
    {name:"Willy Semedo",pos:"RB",club:"Vitória SC",age:31,rating:73},
    {name:"Julio Tavares",pos:"ST",club:"Dijon",age:33,rating:73},
    {name:"Elízio",pos:"CM",club:"Estoril",age:27,rating:72},
  ],
  "Japan":[
    {name:"Shuichi Gonda",pos:"GK",club:"FC Machida Zelvia",age:35,rating:78},
    {name:"Ko Itakura",pos:"CB",club:"Borussia M'gladbach",age:27,rating:81},
    {name:"Maya Yoshida",pos:"CB",club:"FC Machida Zelvia",age:36,rating:77},
    {name:"Takehiro Tomiyasu",pos:"CB",club:"Arsenal",age:26,rating:80},
    {name:"Yukinari Sugawara",pos:"RB",club:"Southampton",age:23,rating:78},
    {name:"Miki Yamane",pos:"RB",club:"Kawasaki Frontale",age:31,rating:77},
    {name:"Wataru Endo",pos:"DM",club:"Liverpool",age:31,rating:81},
    {name:"Hidemasa Morita",pos:"CM",club:"Sporting CP",age:30,rating:80},
    {name:"Daichi Kamada",pos:"CAM",club:"Crystal Palace",age:28,rating:82},
    {name:"Kaoru Mitoma",pos:"LW",club:"Brighton",age:27,rating:83},
    {name:"Ritsu Doan",pos:"RW",club:"SC Freiburg",age:26,rating:81},
    {name:"Takumi Minamino",pos:"CM",club:"Monaco",age:30,rating:81},
    {name:"Ayase Ueda",pos:"ST",club:"Feyenoord",age:25,rating:79},
    {name:"Daniel Schmidt",pos:"GK",club:"Sint-Truiden",age:31,rating:78},
    {name:"Yuto Nagatomo",pos:"LB",club:"Vissel Kobe",age:38,rating:74},
  ],
  "South Korea":[
    {name:"Kim Seung-gyu",pos:"GK",club:"Al-Shabab",age:34,rating:77},
    {name:"Kim Min-jae",pos:"CB",club:"Bayern Munich",age:28,rating:86},
    {name:"Jung Seung-hyun",pos:"CB",club:"Yokohama F Marinos",age:30,rating:77},
    {name:"Kim Jin-su",pos:"LB",club:"Nottingham Forest",age:31,rating:77},
    {name:"Kim Moon-hwan",pos:"RB",club:"Jeonbuk Hyundai",age:29,rating:76},
    {name:"Hwang In-beom",pos:"CM",club:"Feyenoord",age:28,rating:79},
    {name:"Lee Kang-in",pos:"CAM",club:"PSG",age:24,rating:83},
    {name:"Hwang Hee-chan",pos:"LW",club:"Wolverhampton",age:28,rating:81},
    {name:"Son Heung-min",pos:"RW",club:"Tottenham",age:33,rating:86},
    {name:"Cho Gue-sung",pos:"ST",club:"Jeonbuk Hyundai",age:26,rating:78},
    {name:"Oh Hyeon-gyu",pos:"ST",club:"Celtic",age:23,rating:77},
    {name:"Yang Hyun-jun",pos:"LW",club:"Celtic",age:22,rating:77},
    {name:"Baek Seung-ho",pos:"DM",club:"Vissel Kobe",age:27,rating:77},
    {name:"Kim Young-gwon",pos:"CB",club:"Ulsan HD",age:35,rating:76},
    {name:"Seol Young-woo",pos:"RW",club:"Ulsan HD",age:23,rating:75},
  ],
  "Iran":[
    {name:"Alireza Beiranvand",pos:"GK",club:"Antwerp",age:32,rating:79},
    {name:"Sadegh Moharrami",pos:"RB",club:"Dinamo Zagreb",age:28,rating:76},
    {name:"Majid Hosseini",pos:"CB",club:"Trabzonspor",age:26,rating:77},
    {name:"Shojae Khalilzadeh",pos:"CB",club:"Al-Ahli",age:34,rating:76},
    {name:"Milad Mohammadi",pos:"LB",club:"Akhmat Grozny",age:30,rating:75},
    {name:"Saeid Ezatolahi",pos:"DM",club:"Al-Qadsiah",age:28,rating:77},
    {name:"Alireza Jahanbakhsh",pos:"RW",club:"Feyenoord",age:31,rating:80},
    {name:"Ali Gholizadeh",pos:"LW",club:"Chartres",age:28,rating:76},
    {name:"Mehdi Taremi",pos:"ST",club:"Inter Milan",age:32,rating:82},
    {name:"Sardar Azmoun",pos:"ST",club:"Roma",age:30,rating:82},
    {name:"Ahmad Nourollahi",pos:"CM",club:"Al-Sailiya",age:29,rating:76},
    {name:"Ali Karimi",pos:"CM",club:"Bayer Leverkusen",age:22,rating:77},
    {name:"Morteza Pouraliganji",pos:"CB",club:"Al-Sadd",age:32,rating:76},
    {name:"Hossein Kanaanizadegan",pos:"LB",club:"Tractor SC",age:23,rating:74},
    {name:"Karim Ansarifard",pos:"ST",club:"Omonia",age:34,rating:75},
  ],
  "Saudi Arabia":[
    {name:"Mohammed Al-Owais",pos:"GK",club:"Al-Hilal",age:33,rating:80},
    {name:"Saud Abdulhamid",pos:"RB",club:"Roma",age:25,rating:78},
    {name:"Ali Al-Bulayhi",pos:"CB",club:"Al-Hilal",age:33,rating:77},
    {name:"Hassan Tambakti",pos:"CB",club:"Al-Hilal",age:24,rating:76},
    {name:"Yasser Al-Shahrani",pos:"LB",club:"Al-Hilal",age:31,rating:76},
    {name:"Salman Al-Faraj",pos:"DM",club:"Al-Hilal",age:34,rating:78},
    {name:"Mohamed Kanno",pos:"CM",club:"Al-Hilal",age:30,rating:77},
    {name:"Salem Al-Dawsari",pos:"LW",club:"Al-Hilal",age:32,rating:79},
    {name:"Firas Al-Buraikan",pos:"ST",club:"Al-Fateh",age:24,rating:77},
    {name:"Abdullah Al-Hamdan",pos:"ST",club:"Al-Shabab",age:24,rating:76},
    {name:"Akram Al-Ouwais",pos:"RW",club:"Al-Qadsiah",age:25,rating:75},
    {name:"Ali Al-Hassan",pos:"DM",club:"Al-Ittihad",age:29,rating:75},
    {name:"Sami Al-Najei",pos:"LB",club:"Al-Qadsiah",age:29,rating:74},
    {name:"Mohammed Al-Breik",pos:"RB",club:"Al-Hilal",age:26,rating:75},
    {name:"Nasser Al-Dawsari",pos:"CAM",club:"Al-Hilal",age:28,rating:76},
  ],
  "Australia":[
    {name:"Mat Ryan",pos:"GK",club:"Real Sociedad",age:33,rating:80},
    {name:"Miloš Degenek",pos:"RB",club:"Columbus Crew",age:29,rating:77},
    {name:"Harry Souttar",pos:"CB",club:"Leicester City",age:27,rating:79},
    {name:"Kye Rowles",pos:"CB",club:"Hearts",age:26,rating:77},
    {name:"Aziz Behich",pos:"LB",club:"Perth Glory",age:33,rating:75},
    {name:"Jackson Irvine",pos:"CM",club:"St. Pauli",age:32,rating:79},
    {name:"Riley McGree",pos:"CM",club:"Middlesbrough",age:26,rating:78},
    {name:"Ajdin Hrustic",pos:"CM",club:"Columbus Crew",age:28,rating:78},
    {name:"Martin Boyle",pos:"RW",club:"Hibernian",age:31,rating:76},
    {name:"Mitchell Duke",pos:"ST",club:"Machida Zelvia",age:33,rating:75},
    {name:"Craig Goodwin",pos:"LW",club:"Adelaide United",age:33,rating:75},
    {name:"Marco Tilio",pos:"LW",club:"Celtic",age:24,rating:75},
    {name:"Fran Karacic",pos:"RB",club:"Brescia",age:28,rating:75},
    {name:"Chris Ikonomidis",pos:"RW",club:"Western United",age:29,rating:76},
    {name:"Lachie Wales",pos:"CM",club:"Oud-Heverlee Leuven",age:26,rating:74},
  ],
  "Uzbekistan":[
    {name:"Ulugbek Nishonov",pos:"GK",club:"FC Bunyodkor",age:30,rating:73},
    {name:"Eldor Shomurodov",pos:"ST",club:"Roma",age:29,rating:78},
    {name:"Khojimat Erkinov",pos:"CB",club:"Pakhtakor",age:29,rating:73},
    {name:"Khurshid Mukhammad",pos:"CB",club:"Pakhtakor",age:24,rating:72},
    {name:"Nodirbek Abdukholikov",pos:"LB",club:"Pakhtakor",age:24,rating:72},
    {name:"Otabek Shukurov",pos:"DM",club:"Pakhtakor",age:28,rating:73},
    {name:"Jaloliddin Masharipov",pos:"CAM",club:"Lokomotiv Tashkent",age:30,rating:75},
    {name:"Islom Tukhtakhujaev",pos:"RW",club:"Universitatea Craiova",age:23,rating:74},
    {name:"Sherzod Nasrullayev",pos:"LW",club:"Pakhtakor",age:26,rating:73},
    {name:"Dostonbek Khamdamov",pos:"ST",club:"Pakhtakor",age:25,rating:73},
    {name:"Abduqodir Khusanov",pos:"CB",club:"RC Lens",age:24,rating:76},
    {name:"Bobur Abdixoliqov",pos:"CM",club:"Pakhtakor",age:26,rating:74},
    {name:"Murodjon Yakhshiboev",pos:"CM",club:"Al-Faisaly",age:25,rating:73},
    {name:"Jasur Yakhshiboev",pos:"RB",club:"Sogdiana",age:26,rating:72},
    {name:"Umid Bektursunov",pos:"RW",club:"Pakhtakor",age:22,rating:71},
  ],
  "Qatar":[
    {name:"Meshaal Barsham",pos:"GK",club:"Al-Sadd",age:27,rating:75},
    {name:"Pedro Miguel",pos:"LB",club:"Al-Sadd",age:33,rating:76},
    {name:"Bassam Al-Rawi",pos:"CB",club:"Al-Duhail",age:27,rating:75},
    {name:"Tarek Salman",pos:"CB",club:"Al-Sadd",age:28,rating:74},
    {name:"Musaab Khidir",pos:"RB",club:"Al-Sadd",age:28,rating:74},
    {name:"Karim Boudiaf",pos:"DM",club:"Al-Duhail",age:33,rating:76},
    {name:"Hassan Al-Haydos",pos:"CAM",club:"Al-Sadd",age:33,rating:77},
    {name:"Akram Afif",pos:"LW",club:"Al-Sadd",age:27,rating:80},
    {name:"Almoez Ali",pos:"ST",club:"Al-Duhail",age:28,rating:78},
    {name:"Abdulaziz Hatem",pos:"CM",club:"Al-Rayyan",age:31,rating:75},
    {name:"Assim Omer Madibo",pos:"DM",club:"Al-Sadd",age:26,rating:74},
    {name:"Ahmed Alaaeldin",pos:"CAM",club:"Al-Hilal",age:26,rating:75},
    {name:"Yusuf Abdurisag",pos:"CM",club:"Al-Sadd",age:23,rating:73},
    {name:"Ismaeel Mohammad",pos:"RW",club:"Al-Gharafa",age:25,rating:73},
    {name:"Ahmed Suhail",pos:"ST",club:"Al-Wakrah",age:25,rating:72},
  ],
  "Jordan":[
    {name:"Yazeed Abulaila",pos:"GK",club:"Al-Faisaly",age:30,rating:73},
    {name:"Baha Abdelrahman",pos:"RB",club:"Swansea City",age:29,rating:74},
    {name:"Yazan Al-Arab",pos:"CB",club:"Al-Faisaly",age:28,rating:73},
    {name:"Ahmad Sarour",pos:"CB",club:"Al-Arabi",age:30,rating:72},
    {name:"Salem Al-Ajalin",pos:"LB",club:"Shabab Al-Ahli",age:27,rating:72},
    {name:"Abdullah Nasib",pos:"DM",club:"Al-Ramtha",age:28,rating:72},
    {name:"Musa Al-Taamari",pos:"LW",club:"Montpellier",age:25,rating:77},
    {name:"Ahmad Hayel",pos:"CM",club:"Al-Faisaly",age:27,rating:72},
    {name:"Hamza Al-Dardour",pos:"ST",club:"Al-Faisaly",age:28,rating:74},
    {name:"Yazan Al-Naimat",pos:"ST",club:"Al-Faisaly",age:24,rating:73},
    {name:"Oday Al-Dabbas",pos:"RW",club:"Waasland-Beveren",age:29,rating:73},
    {name:"Yazeen Bakeer",pos:"CB",club:"Al-Jazira",age:27,rating:73},
    {name:"Ehsan Haddad",pos:"CM",club:"Al-Jazeera",age:29,rating:72},
    {name:"Ali Olwan",pos:"CM",club:"Al-Ramtha",age:25,rating:71},
    {name:"Zaid Al-Jaber",pos:"RB",club:"Al-Arabi",age:26,rating:71},
  ],
  "Iraq":[
    {name:"Jalal Hassan",pos:"GK",club:"Al-Zawraa",age:27,rating:73},
    {name:"Ali Adnan",pos:"LB",club:"FC Cincinnati",age:30,rating:76},
    {name:"Rebin Sulaka",pos:"CB",club:"Al-Shorta",age:27,rating:72},
    {name:"Hussein Ali",pos:"CB",club:"Al-Zawraa",age:28,rating:72},
    {name:"Saman Quasim",pos:"RB",club:"Erbil SC",age:29,rating:72},
    {name:"Bashar Resan",pos:"CM",club:"Al-Shorta",age:25,rating:73},
    {name:"Aymen Hussein",pos:"ST",club:"Al-Shorta",age:28,rating:76},
    {name:"Mohanad Ali",pos:"RW",club:"Al-Zawraa",age:24,rating:73},
    {name:"Amjed Attwan",pos:"LW",club:"Al-Naft",age:27,rating:73},
    {name:"Zidan Iqbal",pos:"CM",club:"FC Utrecht",age:22,rating:74},
    {name:"Mohammed Daoud",pos:"DM",club:"Al-Zawraa",age:29,rating:72},
    {name:"Ahmed Ibrahim",pos:"ST",club:"Al-Zawraa",age:25,rating:72},
    {name:"Alaa Abbas",pos:"CM",club:"Al-Quwa Al-Jawiya",age:26,rating:72},
    {name:"Ibrahim Bayesh",pos:"RB",club:"Al-Shorta",age:26,rating:71},
    {name:"Sherko Kareem",pos:"LW",club:"Erbil SC",age:28,rating:72},
  ],
  "USA":[
    {name:"Matt Turner",pos:"GK",club:"Nottingham Forest",age:30,rating:79},
    {name:"Sergiño Dest",pos:"RB",club:"AC Milan",age:24,rating:79},
    {name:"Chris Richards",pos:"CB",club:"Crystal Palace",age:25,rating:79},
    {name:"Tim Ream",pos:"CB",club:"Fulham",age:37,rating:77},
    {name:"Antonee Robinson",pos:"LB",club:"Fulham",age:27,rating:81},
    {name:"Tyler Adams",pos:"DM",club:"Bournemouth",age:26,rating:81},
    {name:"Weston McKennie",pos:"CM",club:"Juventus",age:27,rating:80},
    {name:"Yunus Musah",pos:"CM",club:"AC Milan",age:22,rating:80},
    {name:"Christian Pulisic",pos:"RW",club:"AC Milan",age:27,rating:83},
    {name:"Timothy Weah",pos:"RW",club:"Juventus",age:25,rating:79},
    {name:"Folarin Balogun",pos:"ST",club:"Monaco",age:24,rating:79},
    {name:"Gio Reyna",pos:"CAM",club:"Borussia Dortmund",age:23,rating:79},
    {name:"Malik Tillman",pos:"CAM",club:"PSV Eindhoven",age:23,rating:78},
    {name:"Josh Sargent",pos:"ST",club:"Norwich City",age:25,rating:77},
    {name:"Joe Scally",pos:"RB",club:"Borussia M'gladbach",age:22,rating:77},
  ],
  "Mexico":[
    {name:"Guillermo Ochoa",pos:"GK",club:"Salernitana",age:39,rating:80},
    {name:"Jorge Sánchez",pos:"RB",club:"Club América",age:25,rating:76},
    {name:"César Montes",pos:"CB",club:"Espanyol",age:28,rating:77},
    {name:"Johan Vásquez",pos:"CB",club:"Genoa",age:27,rating:76},
    {name:"Jesús Gallardo",pos:"LB",club:"Monterrey",age:29,rating:77},
    {name:"Edson Álvarez",pos:"DM",club:"West Ham",age:27,rating:81},
    {name:"Carlos Rodríguez",pos:"CM",club:"Cruz Azul",age:27,rating:76},
    {name:"Hirving Lozano",pos:"RW",club:"PSV Eindhoven",age:29,rating:81},
    {name:"Raúl Jiménez",pos:"ST",club:"Fulham",age:33,rating:79},
    {name:"Henry Martín",pos:"ST",club:"Club América",age:31,rating:76},
    {name:"Alexis Vega",pos:"LW",club:"Guadalajara",age:28,rating:76},
    {name:"Rodrigo Huescas",pos:"LW",club:"Copenhagen",age:21,rating:76},
    {name:"Roberto Alvarado",pos:"CAM",club:"Guadalajara",age:26,rating:76},
    {name:"Jesús Manuel Corona",pos:"CM",club:"Sevilla",age:32,rating:78},
    {name:"Gerardo Arteaga",pos:"LB",club:"Genk",age:25,rating:76},
  ],
  "Canada":[
    {name:"Maxime Crépeau",pos:"GK",club:"LA Galaxy",age:30,rating:79},
    {name:"Richie Laryea",pos:"RB",club:"Nottingham Forest",age:29,rating:78},
    {name:"Kamal Miller",pos:"CB",club:"FC Cincinnati",age:27,rating:78},
    {name:"Alistair Johnston",pos:"RB",club:"Celtic",age:26,rating:79},
    {name:"Sam Adekugbe",pos:"LB",club:"Hatayspor",age:29,rating:76},
    {name:"Stephen Eustáquio",pos:"CM",club:"Porto",age:28,rating:80},
    {name:"Jonathan Osorio",pos:"CM",club:"Toronto FC",age:32,rating:76},
    {name:"Ismaël Koné",pos:"CM",club:"Marseille",age:23,rating:77},
    {name:"Alphonso Davies",pos:"LW",club:"Bayern Munich",age:24,rating:87},
    {name:"Jonathan David",pos:"ST",club:"LOSC Lille",age:25,rating:85},
    {name:"Tajon Buchanan",pos:"RW",club:"Inter Milan",age:25,rating:79},
    {name:"Cyle Larin",pos:"ST",club:"Club Brugge",age:29,rating:78},
    {name:"Liam Millar",pos:"RW",club:"Stade de Reims",age:25,rating:75},
    {name:"Jacob Shaffelburg",pos:"LW",club:"Nashville SC",age:24,rating:75},
    {name:"Atiba Hutchinson",pos:"DM",club:"Besiktas",age:41,rating:74},
  ],
  "Panama":[
    {name:"Luis Mejía",pos:"GK",club:"Millonarios",age:29,rating:75},
    {name:"Roderick Miller",pos:"RB",club:"FC Cincinnati",age:29,rating:74},
    {name:"Harold Cummings",pos:"CB",club:"Santos",age:31,rating:75},
    {name:"Fidel Escobar",pos:"CB",club:"New York Red Bulls",age:29,rating:74},
    {name:"Eric Davis",pos:"LB",club:"Columbus Crew",age:35,rating:73},
    {name:"Adalberto Carrasquilla",pos:"DM",club:"Deportivo Saprissa",age:27,rating:75},
    {name:"Aníbal Godoy",pos:"DM",club:"Nashville SC",age:35,rating:74},
    {name:"Ismael Díaz",pos:"LW",club:"Standard Liège",age:26,rating:75},
    {name:"Edgar Bárcenas",pos:"RW",club:"Newell's Old Boys",age:29,rating:74},
    {name:"Cecilio Waterman",pos:"ST",club:"Columbus Crew",age:32,rating:74},
    {name:"José Fajardo",pos:"RW",club:"FC Dallas",age:29,rating:74},
    {name:"Andrés Andrade",pos:"CM",club:"Deportivo Saprissa",age:30,rating:73},
    {name:"Rolando Blackburn",pos:"ST",club:"Olimpia",age:30,rating:73},
    {name:"Gabriel Torres",pos:"ST",club:"Olimpia",age:37,rating:73},
    {name:"Cristian Martínez",pos:"CM",club:"Olimpia",age:29,rating:73},
  ],
  "Haiti":[
    {name:"Josué Duverger",pos:"GK",club:"Étoile du Sahel",age:29,rating:72},
    {name:"Andrew Wooten",pos:"CB",club:"VfL Osnabrück",age:35,rating:72},
    {name:"James Léandre",pos:"CB",club:"Léogâne FC",age:27,rating:70},
    {name:"Steeven Saba",pos:"RB",club:"Étoile du Sahel",age:28,rating:71},
    {name:"Niko Hamalainen",pos:"LB",club:"QPR",age:28,rating:72},
    {name:"Derrick Etienne",pos:"CM",club:"Columbus Crew",age:29,rating:74},
    {name:"Wilde-Donald Guerrier",pos:"DM",club:"Charlotte FC",age:32,rating:72},
    {name:"Frantzdy Pierrot",pos:"LW",club:"New England Revolution",age:29,rating:73},
    {name:"Duckens Nazon",pos:"ST",club:"Istanbul Basaksehir",age:30,rating:73},
    {name:"Lesly St. Fleur",pos:"RW",club:"CS Sfaxien",age:26,rating:71},
    {name:"Mechack Jérôme",pos:"CB",club:"CF Montréal",age:27,rating:70},
    {name:"Steeve Elimane Zanzan",pos:"CM",club:"CF Montréal",age:25,rating:70},
    {name:"Edens Castillon",pos:"ST",club:"Olimpia Honduras",age:27,rating:70},
    {name:"Moise Gomis",pos:"LB",club:"FC Rouen",age:28,rating:70},
    {name:"Ricot Louis",pos:"CM",club:"AS Cavaly",age:28,rating:69},
  ],
  "Curaçao":[
    {name:"Eloy Room",pos:"GK",club:"Columbus Crew",age:32,rating:76},
    {name:"Leandro Bacuna",pos:"CM",club:"Millwall",age:33,rating:75},
    {name:"Riechedly Bazoer",pos:"CM",club:"FC Twente",age:28,rating:76},
    {name:"Quentin Boisgard",pos:"LB",club:"Stade Brestois",age:24,rating:73},
    {name:"Cuco Martina",pos:"RB",club:"Stoke City",age:36,rating:73},
    {name:"Gilmar Filipe",pos:"CM",club:"NEC Nijmegen",age:29,rating:74},
    {name:"Juniël Martina",pos:"DM",club:"NAC Breda",age:29,rating:72},
    {name:"Gevaro Nepomuceno",pos:"ST",club:"Caykur Rizespor",age:31,rating:74},
    {name:"Rangelo Janga",pos:"LW",club:"Colorado Rapids",age:32,rating:74},
    {name:"Cédric van der Gun",pos:"RW",club:"Almere City",age:24,rating:72},
    {name:"Christiano Martina",pos:"RB",club:"NEC Nijmegen",age:26,rating:71},
    {name:"Jael",pos:"ST",club:"RKC Waalwijk",age:36,rating:72},
    {name:"Sheldon Martis",pos:"CB",club:"Telstar",age:39,rating:70},
    {name:"Thierry Lutonda",pos:"CB",club:"Telstar",age:24,rating:69},
    {name:"Torino Hunte",pos:"LW",club:"Deportivo Cuenca",age:24,rating:70},
  ],
  "New Zealand":[
    {name:"Oliver Sail",pos:"GK",club:"FC Twente",age:28,rating:73},
    {name:"Liberato Cacace",pos:"LB",club:"Empoli",age:24,rating:75},
    {name:"Michael Boxall",pos:"CB",club:"Minnesota United",age:36,rating:73},
    {name:"Nando Pijnaker",pos:"CB",club:"SC Heerenveen",age:27,rating:73},
    {name:"Deklan Wynne",pos:"RB",club:"FC Dallas",age:28,rating:72},
    {name:"Joe Bell",pos:"DM",club:"Sacramento Republic",age:25,rating:73},
    {name:"Callum McCowatt",pos:"CM",club:"FC Nordsjaelland",age:26,rating:73},
    {name:"Clayton Lewis",pos:"CM",club:"Melbourne City",age:28,rating:72},
    {name:"Marko Stamenic",pos:"CM",club:"Auckland City",age:22,rating:73},
    {name:"Elijah Just",pos:"RW",club:"Estoril",age:22,rating:73},
    {name:"Matthew Garbett",pos:"CM",club:"Nottingham Forest",age:23,rating:72},
    {name:"Sarpreet Singh",pos:"CAM",club:"FC Winterthur",age:25,rating:74},
    {name:"Hamish Watson",pos:"CB",club:"FC Utrecht",age:23,rating:71},
    {name:"Ben Old",pos:"LW",club:"Estoril",age:22,rating:71},
    {name:"Ryan Thomas",pos:"CM",club:"Fortuna Sittard",age:30,rating:73},
  ],

  "Netherlands":[
    {name:"Bart Verbruggen",pos:"GK",club:"Brighton",age:22,rating:82},
    {name:"Mark Flekken",pos:"GK",club:"Brentford",age:31,rating:80},
    {name:"Denzel Dumfries",pos:"RB",club:"Inter Milan",age:28,rating:83},
    {name:"Virgil van Dijk",pos:"CB",club:"Liverpool",age:34,rating:87},
    {name:"Matthijs de Ligt",pos:"CB",club:"Manchester United",age:25,rating:83},
    {name:"Micky van de Ven",pos:"CB",club:"Tottenham",age:23,rating:82},
    {name:"Nathan Aké",pos:"LB",club:"Manchester City",age:30,rating:83},
    {name:"Stefan de Vrij",pos:"CB",club:"Inter Milan",age:33,rating:82},
    {name:"Frenkie de Jong",pos:"DM",club:"Barcelona",age:28,rating:86},
    {name:"Ryan Gravenberch",pos:"CM",club:"Liverpool",age:22,rating:83},
    {name:"Tijjani Reijnders",pos:"CM",club:"AC Milan",age:26,rating:83},
    {name:"Teun Koopmeiners",pos:"CM",club:"Juventus",age:27,rating:84},
    {name:"Xavi Simons",pos:"CAM",club:"RB Leipzig",age:22,rating:83},
    {name:"Cody Gakpo",pos:"LW",club:"Liverpool",age:25,rating:84},
    {name:"Donyell Malen",pos:"RW",club:"Borussia Dortmund",age:26,rating:82},
    {name:"Memphis Depay",pos:"ST",club:"Atlético Madrid",age:31,rating:82},
    {name:"Wout Weghorst",pos:"ST",club:"Hoffenheim",age:32,rating:79},
    {name:"Tyrell Malacia",pos:"LB",club:"Manchester United",age:25,rating:78},
  ],
  "Belgium":[
    {name:"Koen Casteels",pos:"GK",club:"Al-Qadsiah",age:32,rating:82},
    {name:"Thomas Kaminski",pos:"GK",club:"Luton Town",age:32,rating:77},
    {name:"Timothy Castagne",pos:"RB",club:"Fulham",age:29,rating:80},
    {name:"Zeno Debast",pos:"CB",club:"Sporting CP",age:21,rating:79},
    {name:"Wout Faes",pos:"CB",club:"Leicester City",age:26,rating:79},
    {name:"Jan Vertonghen",pos:"CB",club:"Anderlecht",age:37,rating:78},
    {name:"Arthur Theate",pos:"LB",club:"Stade Rennais",age:24,rating:79},
    {name:"Youri Tielemans",pos:"DM",club:"Aston Villa",age:27,rating:82},
    {name:"Amadou Onana",pos:"CM",club:"Aston Villa",age:23,rating:82},
    {name:"Kevin De Bruyne",pos:"CAM",club:"Manchester City",age:34,rating:90},
    {name:"Leandro Trossard",pos:"LW",club:"Arsenal",age:30,rating:82},
    {name:"Dodi Lukebakio",pos:"RW",club:"Sevilla",age:27,rating:79},
    {name:"Johan Bakayoko",pos:"RW",club:"PSV Eindhoven",age:22,rating:79},
    {name:"Lois Openda",pos:"ST",club:"RB Leipzig",age:24,rating:83},
    {name:"Romelu Lukaku",pos:"ST",club:"Roma",age:32,rating:83},
  ],
  "Croatia":[
    {name:"Dominik Livaković",pos:"GK",club:"Fenerbahçe",age:29,rating:83},
    {name:"Ivica Ivušić",pos:"GK",club:"PSV Eindhoven",age:28,rating:78},
    {name:"Josip Juranović",pos:"RB",club:"Union Berlin",age:29,rating:79},
    {name:"Joško Gvardiol",pos:"CB",club:"Manchester City",age:23,rating:86},
    {name:"Duje Ćaleta-Car",pos:"CB",club:"Southampton",age:28,rating:79},
    {name:"Martin Erlić",pos:"CB",club:"RB Leipzig",age:26,rating:79},
    {name:"Josip Stanišić",pos:"LB",club:"Bayer Leverkusen",age:24,rating:79},
    {name:"Borna Sosa",pos:"LB",club:"Atlético Madrid",age:27,rating:79},
    {name:"Marcelo Brozović",pos:"DM",club:"Al-Nassr",age:32,rating:82},
    {name:"Mateo Kovačić",pos:"CM",club:"Manchester City",age:30,rating:84},
    {name:"Luka Modrić",pos:"CM",club:"Real Madrid",age:40,rating:85},
    {name:"Lovro Majer",pos:"CAM",club:"Wolfsburg",age:27,rating:80},
    {name:"Mario Pašalić",pos:"CM",club:"Atalanta",age:29,rating:80},
    {name:"Andrej Kramarić",pos:"ST",club:"Hoffenheim",age:34,rating:82},
    {name:"Bruno Petković",pos:"ST",club:"Dinamo Zagreb",age:30,rating:78},
  ],

  "Netherlands":[
    {name:"Bart Verbruggen",pos:"GK",club:"Brighton",age:22,rating:82},
    {name:"Mark Flekken",pos:"GK",club:"Brentford",age:31,rating:80},
    {name:"Denzel Dumfries",pos:"RB",club:"Inter Milan",age:28,rating:83},
    {name:"Virgil van Dijk",pos:"CB",club:"Liverpool",age:33,rating:87},
    {name:"Stefan de Vrij",pos:"CB",club:"Inter Milan",age:32,rating:82},
    {name:"Nathan Aké",pos:"CB",club:"Manchester City",age:29,rating:83},
    {name:"Ian Maatsen",pos:"LB",club:"Aston Villa",age:22,rating:80},
    {name:"Frenkie de Jong",pos:"DM",club:"Barcelona",age:27,rating:86},
    {name:"Ryan Gravenberch",pos:"CM",club:"Liverpool",age:22,rating:83},
    {name:"Tijjani Reijnders",pos:"CM",club:"AC Milan",age:26,rating:83},
    {name:"Teun Koopmeiners",pos:"CM",club:"Juventus",age:26,rating:84},
    {name:"Xavi Simons",pos:"CAM",club:"RB Leipzig",age:21,rating:83},
    {name:"Cody Gakpo",pos:"LW",club:"Liverpool",age:25,rating:84},
    {name:"Donyell Malen",pos:"RW",club:"Borussia Dortmund",age:25,rating:82},
    {name:"Memphis Depay",pos:"ST",club:"Atlético Madrid",age:30,rating:82},
  ],
  "Belgium":[
    {name:"Koen Casteels",pos:"GK",club:"VfL Wolfsburg",age:32,rating:82},
    {name:"Simon Mignolet",pos:"GK",club:"Club Brugge",age:37,rating:80},
    {name:"Timothy Castagne",pos:"RB",club:"Fulham",age:29,rating:80},
    {name:"Wout Faes",pos:"CB",club:"Leicester City",age:26,rating:79},
    {name:"Jan Vertonghen",pos:"CB",club:"Anderlecht",age:37,rating:77},
    {name:"Arthur Theate",pos:"LB",club:"Stade Rennais",age:24,rating:80},
    {name:"Amadou Onana",pos:"DM",club:"Aston Villa",age:23,rating:82},
    {name:"Kevin De Bruyne",pos:"CM",club:"Manchester City",age:33,rating:90},
    {name:"Youri Tielemans",pos:"CM",club:"Aston Villa",age:27,rating:82},
    {name:"Charles De Ketelaere",pos:"CAM",club:"Atalanta",age:23,rating:82},
    {name:"Leandro Trossard",pos:"LW",club:"Arsenal",age:30,rating:82},
    {name:"Dodi Lukebakio",pos:"RW",club:"Sevilla",age:26,rating:79},
    {name:"Romelu Lukaku",pos:"ST",club:"Napoli",age:31,rating:83},
    {name:"Loïs Openda",pos:"ST",club:"RB Leipzig",age:24,rating:83},
    {name:"Alexis Saelemaekers",pos:"RW",club:"AC Milan",age:25,rating:79},
  ],
  "Croatia":[
    {name:"Dominik Livaković",pos:"GK",club:"Fenerbahçe",age:29,rating:82},
    {name:"Ivica Ivušić",pos:"GK",club:"PAOK",age:30,rating:78},
    {name:"Josip Stanišić",pos:"RB",club:"Bayer Leverkusen",age:24,rating:79},
    {name:"Joško Gvardiol",pos:"CB",club:"Manchester City",age:22,rating:84},
    {name:"Josip Šutalo",pos:"CB",club:"Ajax",age:23,rating:79},
    {name:"Martin Erlić",pos:"CB",club:"Sassuolo",age:27,rating:78},
    {name:"Borna Sosa",pos:"LB",club:"Ajax",age:26,rating:79},
    {name:"Luka Modrić",pos:"CM",club:"Real Madrid",age:39,rating:85},
    {name:"Mateo Kovačić",pos:"CM",club:"Manchester City",age:30,rating:84},
    {name:"Marcelo Brozović",pos:"DM",club:"Al-Nassr",age:32,rating:83},
    {name:"Mario Pašalić",pos:"CAM",club:"Atalanta",age:29,rating:81},
    {name:"Lovro Majer",pos:"CM",club:"Wolfsburg",age:27,rating:80},
    {name:"Andrej Kramarić",pos:"ST",club:"Hoffenheim",age:33,rating:82},
    {name:"Nikola Vlašić",pos:"CAM",club:"Torino",age:27,rating:80},
    {name:"Ivan Perišić",pos:"LW",club:"Hajduk Split",age:35,rating:80},
  ],
};

// ── VENUES ────────────────────────────────────────────────────────────────────
const VENUES = [
  {city:"New York / New Jersey",stadium:"MetLife Stadium",cap:"82,500",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2010,wiki:"MetLife_Stadium",maps:"https://maps.google.com/?q=MetLife+Stadium"},
  {city:"Los Angeles",stadium:"SoFi Stadium",cap:"70,240",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2020,wiki:"SoFi_Stadium",maps:"https://maps.google.com/?q=SoFi+Stadium"},
  {city:"Dallas",stadium:"AT&T Stadium",cap:"80,000",country:"USA",flag:"🇺🇸",surface:"Bermuda grass",opened:2009,wiki:"AT%26T_Stadium",maps:"https://maps.google.com/?q=AT%26T+Stadium+Arlington"},
  {city:"San Francisco Bay Area",stadium:"Levi's Stadium",cap:"68,500",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2014,wiki:"Levi%27s_Stadium",maps:"https://maps.google.com/?q=Levis+Stadium+Santa+Clara"},
  {city:"Miami",stadium:"Hard Rock Stadium",cap:"65,326",country:"USA",flag:"🇺🇸",surface:"Grass",opened:1987,wiki:"Hard_Rock_Stadium",maps:"https://maps.google.com/?q=Hard+Rock+Stadium"},
  {city:"Seattle",stadium:"Lumen Field",cap:"72,000",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2002,wiki:"Lumen_Field",maps:"https://maps.google.com/?q=Lumen+Field+Seattle"},
  {city:"Boston",stadium:"Gillette Stadium",cap:"65,878",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2002,wiki:"Gillette_Stadium",maps:"https://maps.google.com/?q=Gillette+Stadium"},
  {city:"Houston",stadium:"NRG Stadium",cap:"72,220",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2002,wiki:"NRG_Stadium",maps:"https://maps.google.com/?q=NRG+Stadium+Houston"},
  {city:"Kansas City",stadium:"Arrowhead Stadium",cap:"76,416",country:"USA",flag:"🇺🇸",surface:"Grass",opened:1972,wiki:"Arrowhead_Stadium",maps:"https://maps.google.com/?q=Arrowhead+Stadium"},
  {city:"Atlanta",stadium:"Mercedes-Benz Stadium",cap:"75,000",country:"USA",flag:"🇺🇸",surface:"FieldTurf",opened:2017,wiki:"Mercedes-Benz_Stadium",maps:"https://maps.google.com/?q=Mercedes-Benz+Stadium+Atlanta"},
  {city:"Philadelphia",stadium:"Lincoln Financial Field",cap:"69,796",country:"USA",flag:"🇺🇸",surface:"Grass",opened:2003,wiki:"Lincoln_Financial_Field",maps:"https://maps.google.com/?q=Lincoln+Financial+Field"},
  {city:"Vancouver",stadium:"BC Place",cap:"54,500",country:"Canada",flag:"🇨🇦",surface:"FieldTurf",opened:1983,wiki:"BC_Place",maps:"https://maps.google.com/?q=BC+Place+Vancouver"},
  {city:"Toronto",stadium:"BMO Field",cap:"30,990",country:"Canada",flag:"🇨🇦",surface:"Grass",opened:2007,wiki:"BMO_Field",maps:"https://maps.google.com/?q=BMO+Field+Toronto"},
  {city:"Guadalajara",stadium:"Estadio Akron",cap:"49,850",country:"Mexico",flag:"🇲🇽",surface:"Grass",opened:2010,wiki:"Estadio_Akron",maps:"https://maps.google.com/?q=Estadio+Akron+Guadalajara"},
  {city:"Mexico City",stadium:"Estadio Azteca",cap:"87,523",country:"Mexico",flag:"🇲🇽",surface:"Grass",opened:1966,wiki:"Estadio_Azteca",maps:"https://maps.google.com/?q=Estadio+Azteca+Mexico+City"},
  {city:"Monterrey",stadium:"Estadio BBVA",cap:"53,500",country:"Mexico",flag:"🇲🇽",surface:"Grass",opened:2015,wiki:"Estadio_BBVA",maps:"https://maps.google.com/?q=Estadio+BBVA+Monterrey"},
];

// ── SIMULATION ENGINE ─────────────────────────────────────────────────────────
function mulberry32(seed){
  return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}
function poisson(λ,rng){const L=Math.exp(-λ);let p=1,k=0;do{k++;p*=rng();}while(p>L);return k-1;}
function eloWin(a,b,adj={}){return 1/(1+Math.pow(10,-((a.elo+(adj[a.name]||0))-(b.elo+(adj[b.name]||0)))/400));}
function simGroup(group,rng,adj){
  const st=group.map(t=>({team:t,pts:0,gf:0,ga:0,gd:0}));
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
    const p1=eloWin(group[i],group[j],adj);
    const eq=Math.max(0,1-Math.abs((group[i].elo+(adj[group[i].name]||0))-(group[j].elo+(adj[group[j].name]||0)))/900);
    const pD=0.10+0.20*eq,pW=(1-pD)*p1,r=rng();
    const g1=poisson(2.5*p1,rng),g2=poisson(2.5*(1-p1),rng);
    if(r<pW){st[i].gf+=Math.max(g1,g2+1);st[i].ga+=g2;st[j].gf+=g2;st[j].ga+=Math.max(g1,g2+1);st[i].pts+=3;}
    else if(r<pW+pD){const g=Math.round((g1+g2)/2);st[i].gf+=g;st[i].ga+=g;st[j].gf+=g;st[j].ga+=g;st[i].pts+=1;st[j].pts+=1;}
    else{st[i].gf+=g1;st[i].ga+=Math.max(g2,g1+1);st[j].gf+=Math.max(g2,g1+1);st[j].ga+=g1;st[j].pts+=3;}
  }
  return st.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||rng()-0.5);
}
function simKO(a,b,rng,adj){return rng()<(0.5+(eloWin(a,b,adj)-0.5)*0.72)?a:b;}
function shuffleR(arr,rng){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function runSim(stats,rng,adj={}){
  const sorted=[...TEAMS].sort((a,b)=>(b.elo+(adj[b.name]||0))-(a.elo+(adj[a.name]||0)));
  const pots=[shuffleR(sorted.slice(0,12),rng),shuffleR(sorted.slice(12,24),rng),shuffleR(sorted.slice(24,36),rng),shuffleR(sorted.slice(36,48),rng)];
  const groups=Array.from({length:12},(_,i)=>[pots[0][i],pots[1][i],pots[2][i],pots[3][i]]);
  const gRes=groups.map(g=>simGroup(g,rng,adj));
  const q=gRes.flatMap(g=>[g[0].team,g[1].team]);
  const thirds=gRes.map(g=>g[2]).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
  let round=shuffleR([...q,...thirds.slice(0,8).map(t=>t.team)],rng);
  round.forEach(t=>stats[t.name].r32++);
  function runRound(r){const n=[];for(let i=0;i<r.length;i+=2){const w=simKO(r[i],r[i+1],rng,adj);const key=["r16","qf","sf","f"][Math.log2(r.length)-2];stats[w.name][key]++;n.push(w);}return n;}
  round=runRound(round);round=runRound(round);round=runRound(round);
  const[f1,f2]=[round[0],round[1]];
  stats[f1.name].fn++;stats[f2.name].fn++;
  const w=simKO(f1,f2,rng,adj);stats[w.name].w++;
}
function mkStats(){const s={};TEAMS.forEach(t=>{s[t.name]={w:0,fn:0,sf:0,qf:0,r16:0,r32:0};});return s;}

// ── API ───────────────────────────────────────────────────────────────────────
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
async function callClaude(prompt,sys="",search=false){
  if(!ANTHROPIC_KEY)throw new Error("API key not configured.");
  const body={model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]};
  if(sys)body.system=sys;
  if(search)body.tools=[{type:"web_search_20250305",name:"web_search"}];
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(body)});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message);
  return d.content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
}

// ── TEAM & QUALIFYING LINKS ───────────────────────────────────────────────────
// FIFA national team pages — authoritative, uses official 3-letter codes
const FIFA_TEAM_URLS = {
  "France":"FRA","England":"ENG","Spain":"ESP","Germany":"GER","Portugal":"POR",
  "Netherlands":"NED","Belgium":"BEL","Croatia":"CRO","Austria":"AUT","Switzerland":"SUI",
  "Norway":"NOR","Türkiye":"TUR","Sweden":"SWE","Scotland":"SCO",
  "Bosnia and Herzegovina":"BIH","Czechia":"CZE",
  "Argentina":"ARG","Brazil":"BRA","Uruguay":"URU","Colombia":"COL",
  "Ecuador":"ECU","Paraguay":"PAR",
  "Morocco":"MAR","Senegal":"SEN","Egypt":"EGY","Ivory Coast":"CIV","Tunisia":"TUN",
  "South Africa":"RSA","Algeria":"ALG","Ghana":"GHA","DR Congo":"COD","Cape Verde":"CPV",
  "Japan":"JPN","South Korea":"KOR","Iran":"IRN","Saudi Arabia":"KSA","Australia":"AUS",
  "Uzbekistan":"UZB","Qatar":"QAT","Jordan":"JOR","Iraq":"IRQ",
  "USA":"USA","Mexico":"MEX","Canada":"CAN","Panama":"PAN","Haiti":"HAI",
  "Curaçao":"CUW","New Zealand":"NZL",
};
function fifaTeamUrl(name){
  const code=FIFA_TEAM_URLS[name];
  return code?`https://www.fifa.com/en/associations/association/${code}/national-team/men`:null;
}

// Wikipedia qualifying pages — stable, complete, confederation-level
const QUAL_URLS = {
  "UEFA":     "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(UEFA)",
  "CONMEBOL": "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(CONMEBOL)",
  "CAF":      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(CAF)",
  "AFC":      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(AFC)",
  "CONCACAF": "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(CONCACAF)",
  "OFC":      "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(OFC)",
};






// ── UI PRIMITIVES ─────────────────────────────────────────────────────────────
function Flag({code,size=32}){
  return <img src={`https://flagcdn.com/w${size*2}/${code}.png`} alt={code} style={{width:size,height:"auto",borderRadius:2,display:"block",flexShrink:0}} onError={e=>e.target.style.display="none"} />;
}
function Tag({children,color}){
  return <span style={{...B,fontSize:10,fontWeight:600,letterSpacing:.8,padding:"2px 7px",borderRadius:4,background:color+"18",color,textTransform:"uppercase",display:"inline-block"}}>{children}</span>;
}
function Card({children,style={},onClick}){
  return <div onClick={onClick} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px",...style}}>{children}</div>;
}
function OutlineBtn({children,onClick,active}){
  return <button onClick={onClick} style={{...B,fontSize:12,fontWeight:500,padding:"5px 13px",borderRadius:6,border:`1px solid ${active?T.red:T.border}`,background:active?T.redLight:"transparent",color:active?T.red:T.muted,cursor:"pointer",transition:"all .15s"}}>{children}</button>;
}
function Divider(){return <div style={{height:1,background:T.border,margin:"16px 0"}} />;}
function Page({children}){return <div style={{maxWidth:1060,margin:"0 auto",padding:"32px 20px 80px"}}>{children}</div>;}
function Tooltip({children,text}){
  const [show,setShow]=useState(false);
  return(
    <span style={{position:"relative",display:"inline-block"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <span style={{...B,borderBottom:`1px dashed ${T.faint}`,cursor:"help"}}>{children}</span>
      {show&&(
        <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:T.ink,color:"#fff",borderRadius:8,padding:"10px 14px",width:240,zIndex:200,pointerEvents:"none",...B,fontSize:12,lineHeight:1.6,boxShadow:"0 4px 20px rgba(0,0,0,0.18)"}}>
          {text}
          <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:`6px solid ${T.ink}`}} />
        </div>
      )}
    </span>
  );
}

// ── ELO MODAL ─────────────────────────────────────────────────────────────────
function EloModal({team,onClose}){
  const bd=ELO_BD[team.name];
  const rank=[...TEAMS].sort((a,b)=>b.elo-a.elo).findIndex(t=>t.name===team.name)+1;
  const [hovered,setHovered]=useState(null);
  if(!bd)return null;

  const espnUrl = fifaTeamUrl(team.name);
  const qualUrl = QUAL_URLS[team.conf];

  const rows=[
    {key:"base",label:"International baseline",  desc:"Starting point for established FIFA member nations",val:bd.b,hover:null},
    {key:"form",label:"Recent form",              desc:"Based on results in the 18 months prior to the tournament",val:bd.f,hover:"form"},
    {key:"qual",label:"Qualifying campaign",      desc:"Performance in official 2026 World Cup qualifying matches",val:bd.q,hover:"qual"},
    {key:"pedi",label:"Tournament pedigree",      desc:"Historical World Cup performance, titles, and deep runs",val:bd.p,hover:null},
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(17,17,17,0.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:16,width:"100%",maxWidth:480,boxShadow:"0 24px 64px rgba(0,0,0,0.22)",overflow:"hidden",maxHeight:"90vh",overflowY:"auto"}}>
        {/* Header */}
        <div style={{background:T.redLight,padding:"18px 24px",borderBottom:`1px solid ${T.redMid}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Flag code={team.code} size={36}/>
            <div>
              <div style={{...H,fontSize:18,fontWeight:800,color:T.ink}}>{team.name}</div>
              <div style={{...B,fontSize:12,color:T.muted}}>Elo rank #{rank} · FIFA #{team.rank} (April 2026)</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{...H,fontSize:28,fontWeight:800,color:T.red,lineHeight:1}}>{team.elo}</div>
            <div style={{...B,fontSize:10,color:T.faint}}>Elo rating</div>
          </div>
        </div>
        {/* Context note */}
        <div style={{padding:"14px 24px 0",...B,fontSize:13,color:T.muted,lineHeight:1.6}}>{bd.note}</div>
        {/* Breakdown */}
        <div style={{padding:"12px 24px 0"}}>
          <div style={{...B,fontSize:10,fontWeight:600,letterSpacing:1.5,color:T.faint,textTransform:"uppercase",marginBottom:8}}>Rating breakdown</div>
          {rows.map((r,i)=>(
            <div key={r.key}
              onMouseEnter={()=>r.hover&&setHovered(r.key)}
              onMouseLeave={()=>setHovered(null)}
              style={{borderBottom:i<rows.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <div style={{...B,fontSize:13,fontWeight:500,color:T.ink}}>{r.label}</div>
                    {r.hover&&<span style={{...B,fontSize:9,color:T.faint,border:`1px solid ${T.border}`,borderRadius:3,padding:"1px 5px"}}>hover</span>}
                  </div>
                  <div style={{...B,fontSize:11,color:T.faint}}>{r.desc}</div>
                </div>
                <div style={{...H,fontSize:15,fontWeight:700,color:r.val>0?T.red:r.val<0?"#2563EB":T.ink,minWidth:48,textAlign:"right",flexShrink:0}}>
                  {r.val>0?"+":""}{r.val.toLocaleString()}
                </div>
              </div>
              {/* Recent form hover — ESPN link */}
              {r.key==="form"&&hovered==="form"&&(
                <div style={{paddingBottom:14}}>
                  <div style={{...B,fontSize:12,color:T.muted,lineHeight:1.6,marginBottom:10}}>
                    FIFA.com has {team.name}'s full match history including recent results and fixtures.
                  </div>
                  {espnUrl?(
                    <a href={espnUrl} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:8,background:"#026cb6",color:"#fff",textDecoration:"none",...B,fontSize:13,fontWeight:600}}>
                      <span>📊</span> View {team.name} on FIFA.com →
                    </a>
                  ):(
                    <div style={{...B,fontSize:12,color:T.faint}}>ESPN link not available for this team.</div>
                  )}
                </div>
              )}
              {/* Qualifying campaign hover — FIFA link */}
              {r.key==="qual"&&hovered==="qual"&&(
                <div style={{paddingBottom:14}}>
                  <div style={{...B,fontSize:12,color:T.muted,lineHeight:1.6,marginBottom:10}}>
                    Full 2026 World Cup qualifying results and tables for {team.conf} are on FIFA.com.
                  </div>
                  {qualUrl?(
                    <a href={qualUrl} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:8,background:"#1a56db",color:"#fff",textDecoration:"none",...B,fontSize:13,fontWeight:600}}>
                      <span>🏆</span> View {team.conf} qualifying on FIFA.com →
                    </a>
                  ):(
                    <div style={{...B,fontSize:12,color:T.faint}}>FIFA qualifying link not available.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Total */}
        <div style={{padding:"0 24px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:T.redLight,borderRadius:8,border:`1px solid ${T.redMid}`}}>
            <div style={{...H,fontSize:14,fontWeight:700,color:T.ink}}>Total Elo Rating</div>
            <div style={{...H,fontSize:22,fontWeight:800,color:T.red}}>{team.elo}</div>
          </div>
          <div style={{...B,fontSize:11,color:T.faint,marginTop:8,lineHeight:1.5}}>
            A 200-point Elo gap equals approx. 76% win probability for the stronger side.
          </div>
        </div>
        <div style={{padding:"0 24px 18px"}}>
          <button onClick={onClose} style={{...B,width:"100%",padding:"9px",borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,color:T.muted,fontSize:13,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── VENUE MODAL ───────────────────────────────────────────────────────────────
function VenueModal({venue,onClose}){
  const [imgUrl,setImgUrl]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    setImgUrl(null);setLoading(true);
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${venue.wiki}&prop=pageimages&format=json&pithumbsize=800&origin=*`)
      .then(r=>r.json()).then(d=>{const p=Object.values(d.query.pages)[0];if(p.thumbnail?.source)setImgUrl(p.thumbnail.source);setLoading(false);})
      .catch(()=>setLoading(false));
  },[venue.wiki]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(17,17,17,0.6)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surface,borderRadius:16,width:"100%",maxWidth:520,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.22)"}}>
        <div style={{height:220,background:T.border,position:"relative",overflow:"hidden"}}>
          {loading&&<div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",...B,fontSize:13,color:T.faint}}>Loading…</div>}
          {!loading&&imgUrl&&<img src={imgUrl} alt={venue.stadium} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
          {!loading&&!imgUrl&&<div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}><div style={{fontSize:40}}>🏟️</div><div style={{...B,fontSize:13,color:T.faint}}>{venue.stadium}</div></div>}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.5)",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
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

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomeSection({setTab}){
  const [results,setResults]=useState(null);
  const [venue,setVenue]=useState(null);
  useEffect(()=>{
    const stats=mkStats();let done=0;
    const rng=mulberry32(20260611);
    function batch(){const end=Math.min(done+600,5000);while(done<end){runSim(stats,rng,{});done++;}
      if(done<5000)setTimeout(batch,10);
      else{const r=TEAMS.map(t=>({...t,...stats[t.name],winPct:stats[t.name].w/50,finalPct:stats[t.name].fn/50})).sort((a,b)=>b.w-a.w);setResults(r);}
    }
    setTimeout(batch,50);
  },[]);

  return(
    <Page>
      {venue&&<VenueModal venue={venue} onClose={()=>setVenue(null)} />}
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
          Win probabilities derived from <Tooltip text="The Elo rating system measures relative team strength on a numerical scale. A higher number means a stronger team. It updates after every international match based on the result versus what the model predicted — similar to chess rankings.">Elo ratings</Tooltip> and a <Tooltip text="A Monte Carlo simulation runs the full tournament thousands of times, each with randomly generated match outcomes weighted by team strength. The win percentage shown is how often a team won across all simulated runs — a statistical estimate, not a prediction.">Monte Carlo simulation</Tooltip>. Results are consistent across page loads.
        </p>
        {!results?(
          <div style={{...B,fontSize:13,color:T.faint,padding:"32px 0",textAlign:"center"}}>Calculating…</div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:12}}>
            {results.slice(0,8).map((t,i)=>(
              <Card key={t.name} onClick={()=>setTab("sim")} style={{cursor:"pointer",borderColor:i===0?T.redMid:T.border}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <Flag code={t.code} size={32}/>
                  <span style={{...B,fontSize:11,fontWeight:600,color:i===0?T.red:T.faint}}>#{i+1}</span>
                </div>
                <div style={{...H,fontSize:15,fontWeight:700,color:T.ink,marginBottom:4,lineHeight:1.2}}>{t.name}</div>
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
            {id:"sim",label:"Monte Carlo Simulator",desc:"25,000 full tournament simulations with customisable inputs"},
            {id:"predictor",label:"Match Predictor",desc:"AI head-to-head tactical analysis — coming soon"},
            {id:"lineups",label:"Lineup Predictor",desc:"Predicted XIs with live injury data — coming soon"},
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
          <span style={{...B,fontSize:12,color:T.faint}}>Click any for details</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
          {VENUES.map(v=>(
            <div key={v.city} onClick={()=>setVenue(v)}
              style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"border-color .15s"}}
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
const POS_ORDER=["GK","RB","CB","LB","DM","CM","CAM","AM","RW","LW","ST","CF"];
const POS_COLOR={"GK":"#D97706","CB":"#2563EB","RB":"#2563EB","LB":"#2563EB","DM":"#16A34A","CM":"#16A34A","CAM":"#C84B31","AM":"#C84B31","RW":"#7C3AED","LW":"#7C3AED","ST":"#C84B31","CF":"#C84B31"};

function TeamsSection(){
  const [search,setSearch]=useState("");
  const [conf,setConf]=useState("ALL");
  const [selected,setSelected]=useState(null);
  const [eloTeam,setEloTeam]=useState(null);
  const filtered=[...TEAMS].filter(t=>(conf==="ALL"||t.conf===conf)&&t.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name));

  function SquadPanel({team}){
    const squad=SQUADS[team.name];
    return(
      <div style={{gridColumn:"1 / -1",background:T.surface,border:`1px solid ${T.redMid}`,borderRadius:12,padding:"20px 24px",marginTop:-4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Flag code={team.code} size={40}/>
            <div>
              <div style={{...H,fontSize:20,fontWeight:800,color:T.ink}}>{team.name}</div>
              <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center"}}>
                <Tag color={CC[team.conf]||T.muted}>{team.conf}</Tag>
                <button onClick={()=>setEloTeam(team)} style={{...B,fontSize:11,color:T.red,background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:600,textDecoration:"underline dotted",textUnderlineOffset:2}}>
                  Elo: {team.elo}
                </button>
              </div>
            </div>
          </div>
          <OutlineBtn onClick={()=>setSelected(null)}>Close ✕</OutlineBtn>
        </div>
        {!squad?(
          <div style={{...B,color:T.faint,fontSize:14,padding:"12px 0"}}>Detailed squad data not available for {team.name}.</div>
        ):(
          <>
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
                  {[...squad].sort((a,b)=>POS_ORDER.indexOf(a.pos)-POS_ORDER.indexOf(b.pos)).map((p,i)=>(
                    <tr key={p.name} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?T.surface:"#FAFAF8"}}>
                      <td style={{padding:"9px 10px"}}><Tag color={POS_COLOR[p.pos]||T.muted}>{p.pos}</Tag></td>
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
            <div style={{...B,fontSize:11,color:T.faint,marginTop:10,borderTop:`1px solid ${T.border}`,paddingTop:10}}>
              Player ratings are approximate consensus values sourced from EA Sports FC, WhoScored, and Sofascore. They are not an official rating system.
            </div>
          </>
        )}
      </div>
    );
  }

  const items=[];
  filtered.forEach(t=>{
    items.push(
      <div key={t.name} onClick={()=>setSelected(selected?.name===t.name?null:t)}
        style={{background:selected?.name===t.name?T.redLight:T.surface,border:`1px solid ${selected?.name===t.name?T.red:T.border}`,borderRadius:12,padding:"14px 14px",cursor:"pointer",transition:"all .15s",position:"relative"}}>
        {/* Flag — top right */}
        <div style={{position:"absolute",top:12,right:12}}>
          <Flag code={t.code} size={28}/>
        </div>
        {/* Content */}
        <div style={{...H,fontSize:13,fontWeight:700,color:T.ink,marginBottom:5,lineHeight:1.2,paddingRight:36}}>{t.name}</div>
        <Tag color={CC[t.conf]||T.muted}>{t.conf}</Tag>
        <div style={{display:"flex",gap:12,alignItems:"center",marginTop:8,flexWrap:"wrap"}}>
          <button onClick={e=>{e.stopPropagation();setEloTeam(t);}} style={{...B,fontSize:10,color:T.red,background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:600,textDecoration:"underline dotted",textUnderlineOffset:2}}>
            Elo: {t.elo}
          </button>
          <span style={{...B,fontSize:10,color:T.faint}}>FIFA #{t.rank}</span>
        </div>
        {SQUADS[t.name]&&<div style={{...B,fontSize:10,color:T.red,fontWeight:500,marginTop:6}}>Squad available ↓</div>}
      </div>
    );
    if(selected?.name===t.name){
      items.push(<SquadPanel key="__squad__" team={t}/>);
    }
  });

  return(
    <Page>
      {eloTeam&&<EloModal team={eloTeam} onClose={()=>setEloTeam(null)}/>}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams…"
          style={{...B,padding:"8px 14px",borderRadius:7,border:`1px solid ${T.border}`,background:T.surface,color:T.ink,fontSize:14,flex:"1 1 200px",outline:"none"}}/>
        {["ALL","UEFA","CONMEBOL","CAF","AFC","CONCACAF","OFC"].map(c=>(
          <OutlineBtn key={c} active={conf===c} onClick={()=>setConf(c)}>{c}</OutlineBtn>
        ))}
      </div>
      <div style={{...B,fontSize:11,fontWeight:600,letterSpacing:1,color:T.faint,textTransform:"uppercase",marginBottom:14}}>
        {filtered.length} teams · click any to expand squad · click Elo for rating breakdown
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
        {items}
      </div>
    </Page>
  );
}

// ── SIMULATOR ─────────────────────────────────────────────────────────────────
const N_SIMS=25000;
function SimulatorSection(){
  const [progress,setProgress]=useState(0);
  const [results,setResults]=useState(null);
  const [running,setRunning]=useState(false);
  const [conf,setConf]=useState("ALL");
  const [adj,setAdj]=useState({});
  const [simCount,setSimCount]=useState(25000);
  const [showAdj,setShowAdj]=useState(false);
  const [adjSearch,setAdjSearch]=useState("");
  const [eloTeam,setEloTeam]=useState(null);
  const abortRef=useRef(false);

  function startSim(adjMap,n){
    setResults(null);setProgress(0);setRunning(true);abortRef.current=false;
    const stats=mkStats();let done=0;
    function batch(){
      if(abortRef.current)return;
      const end=Math.min(done+500,n);
      while(done<end){runSim(stats,Math.random,adjMap);done++;}
      setProgress(done);
      if(done<n)setTimeout(batch,8);
      else{
        const r=TEAMS.map(t=>({...t,...stats[t.name],winPct:stats[t.name].w/n*100,finalPct:stats[t.name].fn/n*100,sfPct:stats[t.name].sf/n*100,qfPct:stats[t.name].qf/n*100,r16Pct:stats[t.name].r16/n*100})).sort((a,b)=>b.w-a.w);
        setResults(r);setRunning(false);
      }
    }
    setTimeout(batch,60);
  }

  useEffect(()=>{startSim({},simCount);},[]);

  const hasAdj=Object.values(adj).some(v=>v!==0);
  const pct=Math.round(progress/simCount*100);
  const filtered=results?(conf==="ALL"?results:results.filter(t=>t.conf===conf)):[];
  const maxWin=results?results[0].winPct:1;

  return(
    <Page>
      {eloTeam&&<EloModal team={eloTeam} onClose={()=>setEloTeam(null)}/>}
      <div style={{marginBottom:20}}>
        <h2 style={{...H,fontSize:28,fontWeight:800,color:T.ink,letterSpacing:-.5,marginBottom:8}}>
          <Tooltip text="A Monte Carlo simulation runs the entire tournament thousands of times, each time generating match outcomes based on team strength probabilities. The win % shown is how often each team came out on top across all runs.">Monte Carlo</Tooltip> Simulator
        </h2>
        <p style={{...B,fontSize:13,color:T.muted}}>
          Based on <Tooltip text="Elo measures team strength on a numerical scale. The difference between two teams' Elo values determines the win probability for each simulated match.">Elo ratings</Tooltip> and a Poisson goal model. Use the adjustments panel to model injuries, form, or hypothetical scenarios.
        </p>
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:20,padding:"12px 16px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10}}>
        <div style={{...B,fontSize:12,fontWeight:600,color:T.muted}}>Scenarios:</div>
        {[5000,10000,25000].map(n=>(
          <OutlineBtn key={n} active={simCount===n} onClick={()=>setSimCount(n)}>{n.toLocaleString()}</OutlineBtn>
        ))}
        <div style={{flex:1}}/>
        <OutlineBtn active={showAdj} onClick={()=>setShowAdj(!showAdj)}>
          {showAdj?"Hide":"⚙ Adjust"} strength{hasAdj?` (${Object.values(adj).filter(v=>v!==0).length} modified)`:""}
        </OutlineBtn>
        {hasAdj&&<OutlineBtn onClick={()=>{setAdj({});startSim({},simCount);}}>Reset</OutlineBtn>}
        <button onClick={()=>startSim(adj,simCount)} disabled={running} style={{...H,fontWeight:700,fontSize:13,padding:"6px 18px",borderRadius:7,border:"none",background:running?T.border:T.red,color:running?T.faint:"#fff",cursor:running?"not-allowed":"pointer"}}>
          {running?"Running…":"▶ Re-run"}
        </button>
      </div>

      {/* Adjustments panel */}
      {showAdj&&(
        <Card style={{marginBottom:20}}>
          <div style={{...H,fontSize:15,fontWeight:700,color:T.ink,marginBottom:4}}>Team strength adjustments</div>
          <div style={{...B,fontSize:12,color:T.faint,marginBottom:14}}>Drag slider to boost or reduce a team's Elo. Positive = stronger, negative = weaker. Click Re-run to apply.</div>
          <input value={adjSearch} onChange={e=>setAdjSearch(e.target.value)} placeholder="Search teams…"
            style={{...B,padding:"7px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:T.bg,color:T.ink,fontSize:13,width:"100%",outline:"none",marginBottom:14}}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10,maxHeight:300,overflowY:"auto"}}>
            {TEAMS.filter(t=>t.name.toLowerCase().includes(adjSearch.toLowerCase())).map(t=>{
              const val=adj[t.name]||0;
              return(
                <div key={t.name} style={{background:val!==0?T.redLight:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${val!==0?T.redMid:T.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <Flag code={t.code} size={18}/>
                      <span style={{...B,fontSize:13,fontWeight:600,color:T.ink}}>{t.name}</span>
                    </div>
                    <span style={{...B,fontSize:11,color:val>0?T.red:val<0?"#2563EB":T.faint}}>
                      {t.elo+val}{val!==0&&<span style={{marginLeft:3}}>({val>0?"+":""}{val})</span>}
                    </span>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input type="range" min="-200" max="200" step="10" value={val}
                      onChange={e=>setAdj(p=>({...p,[t.name]:Number(e.target.value)}))}
                      style={{flex:1,accentColor:T.red}}/>
                    <input type="number" min="-200" max="200" step="10" value={val}
                      onChange={e=>setAdj(p=>({...p,[t.name]:Number(e.target.value)}))}
                      style={{...B,width:52,padding:"3px 6px",borderRadius:5,border:`1px solid ${T.border}`,background:T.surface,color:T.ink,fontSize:12,textAlign:"center",outline:"none"}}/>
                    {val!==0&&<button onClick={()=>setAdj(p=>({...p,[t.name]:0}))} style={{...B,fontSize:11,padding:"3px 8px",borderRadius:5,border:`1px solid ${T.border}`,background:T.surface,color:T.muted,cursor:"pointer"}}>✕</button>}
                  </div>
                </div>
              );
            })}
          </div>
          {hasAdj&&(
            <div style={{marginTop:14,padding:"10px 14px",background:T.redLight,borderRadius:8,border:`1px solid ${T.redMid}`,...B,fontSize:12,color:T.red}}>
              {Object.entries(adj).filter(([,v])=>v!==0).map(([n,v])=>`${n} ${v>0?"+":""}${v}`).join(" · ")} — click Re-run to apply
            </div>
          )}
        </Card>
      )}

      {/* Loading */}
      {!results?(
        <Card style={{textAlign:"center",padding:"60px 32px"}}>
          <div style={{...H,fontSize:24,fontWeight:800,color:T.ink,marginBottom:8}}>Running simulations…</div>
          <div style={{...B,fontSize:14,color:T.muted,marginBottom:28}}>{progress.toLocaleString()} of {simCount.toLocaleString()}</div>
          <div style={{height:6,background:T.border,borderRadius:3,maxWidth:400,margin:"0 auto",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:T.red,borderRadius:3,transition:"width .3s"}}/>
          </div>
          <div style={{...B,fontSize:12,color:T.faint,marginTop:10}}>{pct}%</div>
        </Card>
      ):(
        <>
          {/* Podium */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
            {[{label:"Champion",medal:"🥇",idx:0},{label:"Finalist",medal:"🥈",idx:1},{label:"Semi-finalist",medal:"🥉",idx:2}].map(({label,medal,idx})=>{
              const t=results[idx];
              return(
                <Card key={label} style={{textAlign:"center",borderColor:idx===0?T.redMid:T.border,background:idx===0?T.redLight:T.surface,transform:idx===0?"scale(1.03)":"scale(1)"}}>
                  <div style={{...B,fontSize:10,fontWeight:600,letterSpacing:1.5,color:T.faint,textTransform:"uppercase",marginBottom:8}}>{medal} {label}</div>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Flag code={t.code} size={40}/></div>
                  <div style={{...H,fontSize:17,fontWeight:800,color:T.ink,marginBottom:10,lineHeight:1.2}}>{t.name}</div>
                  <div style={{...H,fontSize:30,fontWeight:800,color:idx===0?T.red:T.ink,lineHeight:1}}>{t.winPct.toFixed(1)}<span style={{fontSize:14,color:T.faint}}>%</span></div>
                  <Divider />
                  <div style={{...B,fontSize:11,color:T.muted,lineHeight:2}}>
                    <div>Final · {t.finalPct.toFixed(1)}%</div>
                    <div>Semi · {t.sfPct.toFixed(1)}%</div>
                    <div>QF · {t.qfPct.toFixed(1)}%</div>
                  </div>
                  <button onClick={()=>setEloTeam(t)} style={{...B,fontSize:10,color:T.red,background:"none",border:"none",cursor:"pointer",marginTop:8,padding:0,fontWeight:600,textDecoration:"underline dotted",textUnderlineOffset:2}}>
                    Elo: {t.elo}
                  </button>
                </Card>
              );
            })}
          </div>

          {/* Filter + table */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {["ALL","UEFA","CONMEBOL","CAF","AFC","CONCACAF","OFC"].map(c=>(
              <OutlineBtn key={c} active={conf===c} onClick={()=>setConf(c)}>{c}</OutlineBtn>
            ))}
          </div>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"36px 36px 1fr 90px 60px 60px 60px 60px",gap:8,padding:"10px 14px",borderBottom:`1px solid ${T.border}`,background:"#FAFAF8"}}>
              {["#","","Team","Win %","Final","SF","QF","R16"].map(h=>(
                <div key={h} style={{...B,fontSize:10,fontWeight:600,letterSpacing:1,color:T.faint,textTransform:"uppercase",textAlign:h==="Team"?"left":"center"}}>{h}</div>
              ))}
            </div>
            {filtered.map(t=>{
              const rank=results.indexOf(t)+1;
              return(
                <div key={t.name} style={{display:"grid",gridTemplateColumns:"36px 36px 1fr 90px 60px 60px 60px 60px",gap:8,alignItems:"center",padding:"9px 14px",borderBottom:`1px solid ${T.border}`,background:rank<=3?T.redLight:T.surface,borderLeft:rank<=3?`3px solid ${T.red}`:"3px solid transparent"}}>
                  <div style={{...B,fontSize:11,fontWeight:600,color:rank<=3?T.red:T.faint,textAlign:"right"}}>{rank}</div>
                  <div style={{display:"flex",justifyContent:"center"}}><Flag code={t.code} size={22}/></div>
                  <div>
                    <div style={{...B,fontSize:13,fontWeight:600,color:T.ink}}>{t.name}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center",marginTop:2}}>
                      <Tag color={CC[t.conf]||T.muted}>{t.conf}</Tag>
                      <button onClick={()=>setEloTeam(t)} style={{...B,fontSize:9,color:T.faint,background:"none",border:"none",cursor:"pointer",padding:0,textDecoration:"underline dotted",textUnderlineOffset:2}}>Elo: {t.elo}</button>
                    </div>
                  </div>
                  <div style={{position:"relative",height:20,background:T.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min(100,(t.winPct/maxWin)*100)}%`,background:T.red,opacity:.8}}/>
                    <span style={{position:"absolute",right:4,top:2,...B,fontSize:10,fontWeight:600,color:T.ink}}>{t.winPct.toFixed(1)}%</span>
                  </div>
                  {[t.finalPct,t.sfPct,t.qfPct,t.r16Pct].map((v,j)=>(
                    <div key={j} style={{...B,fontSize:11,color:[T.red,T.muted,T.faint,T.faint][j],textAlign:"center",fontWeight:j===0?600:400}}>{v.toFixed(1)}%</div>
                  ))}
                </div>
              );
            })}
          </Card>
          <div style={{...B,fontSize:11,color:T.faint,textAlign:"center",marginTop:12}}>{simCount.toLocaleString()} simulations · Elo-Poisson model · 48 teams · 12 groups</div>
        </>
      )}
    </Page>
  );
}

// ── COMING SOON ───────────────────────────────────────────────────────────────
function ComingSoon({title,desc}){
  return(
    <Page>
      <div style={{maxWidth:500,margin:"60px auto",textAlign:"center"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:T.redLight,border:`1px solid ${T.redMid}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:26}}>⏳</div>
        <h2 style={{...H,fontSize:30,fontWeight:800,color:T.ink,letterSpacing:-1,marginBottom:12}}>{title}</h2>
        <p style={{...B,fontSize:15,color:T.muted,lineHeight:1.7,marginBottom:24}}>{desc}</p>
        <div style={{...B,fontSize:12,color:T.faint,padding:"10px 20px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,display:"inline-block"}}>Powered by Claude AI · Available soon</div>
      </div>
    </Page>
  );
}
function PredictorSection(){return <ComingSoon title="Match Predictor" desc="Pick any two teams for a full AI tactical breakdown — win probabilities, key individual battles, score prediction, and wild card factors."/>;}
function LineupsSection(){return <ComingSoon title="Lineup Predictor" desc="Select any team and get a predicted starting XI based on current injuries, suspensions, and form — sourced from live news via Claude AI."/>;}
function NewsSection(){return <ComingSoon title="Live News Feed" desc="Real-time World Cup 2026 news synthesised by Claude AI with web search. Covering transfers, qualifications, squad updates, and tournament news."/>;}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("home");
  return(
    <div style={{...B,background:T.bg,minHeight:"100vh",color:T.ink}}>
      <style>{`${FONTS}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:5px;background:${T.bg};}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}button{cursor:pointer;font-family:inherit;}`}</style>
      <Nav tab={tab} setTab={setTab}/>
      {tab==="home"     &&<HomeSection setTab={setTab}/>}
      {tab==="teams"    &&<TeamsSection/>}
      {tab==="sim"      &&<SimulatorSection/>}
      {tab==="predictor"&&<PredictorSection/>}
      {tab==="lineups"  &&<LineupsSection/>}
      {tab==="news"     &&<NewsSection/>}
    </div>
  );
}
