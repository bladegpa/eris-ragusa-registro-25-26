// ═══════════════════════════════════════════════
//  data.js — Dati fissi, configurazione, stato
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
//  DATI FISSI
// ═══════════════════════════════════════════════
var ANNO="2025/2026",CLASSE="1E";
const ISTITUTO="ERIS Formazione ETS — Ragusa";
const AUTORE="Ing. Giampiero AZZARELLI";
const LOGO="https://i.postimg.cc/cHVS5XDM/logo.png";
const MAIL_DEST="didattica.rg@erisformazione.it";
const WA_TUTOR="393402436677";
const ADMIN_PIN="0123";
const TUTOR_PIN="1111";
const SEGRETERIA_PIN="2222";
const DEFAULT_PIN="1234";
var TUTOR_NAME="Valentina Nonni";

var STUDENTS=[
  {num:1,  name:"AGOSTA GIOELE"},
  {num:2,  name:"ALESSANDRELLO NOEMI"},
  {num:3,  name:"ARCERITO GIORGIA MARIA"},
  {num:4,  name:"BALLARO\' KASSANDRAS"},
  {num:5,  name:"BALLATO VITTORIO"},
  {num:6,  name:"BARONE LORIS"},
  {num:7,  name:"DENTI VALENTINA"},
  {num:8,  name:"GALVANO LUDOVICA MARIA"},
  {num:9,  name:"JAHAJ KEJDI"},
  {num:10, name:"KAMBERAJ MARINELA"},
  {num:11, name:"KARANXHIU MEGI"},
  {num:12, name:"KICA JOAN"},
  {num:13, name:"MANENTI MARTA"},
  {num:14, name:"MASI JENNIFER"},
  {num:15, name:"MUSKAJ ROSITA"},
  {num:16, name:"MUZHAQI ELGIS"},
  {num:17, name:"OCCHIPINTI MATTEO"},
  {num:18, name:"PEREZ ASIA"},
  {num:19, name:"SAHLI ABDA RANIA"},
  {num:20, name:"SCHININA\' ALESSIA"},
  {num:21, name:"SCHININA\' FLAVIA"},
  {num:22, name:"SELIMI KEJSI"},
  {num:23, name:"SICILIANO AURORA"},
  {num:24, name:"SIGONA GIOVANNI"},
  {num:25, name:"SPAGNA DANIELE"},
  {num:26, name:"SPAGNA CLARISSA"},
  {num:27, name:"ZHUPA ARDIT"},
  {num:28, name:"MUSTA GRISELDA"},
  {num:29, name:"KOKAJ POLIKSEN"},
  {num:30, name:"VIRZI\' FILIPPO"},
];

// Default corso per ogni materia (l\'admin può cambiarlo)
var DEFAULT_CORSO_MATERIA={
  m25:"acconciatore",m26:"acconciatore",m27:"acconciatore",m28:"acconciatore",
  m25e:"estetica",m26e:"estetica",m27b:"estetica",m28b:"estetica",m29:"estetica"
};

var TN={
  ciacera:"Ciacera Macauda G.",iabichella:"Iabichella O.",
  azzarelli:"Azzarelli G.",scire:"Scire\' Ingastone V.",
  scollo:"Scollo G.",colombo:"Colombo P.",
  pluchino:"Pluchino G.",pizzo:"Pizzo E.",
  belluardo_d:"Belluardo D.",sammito:"Sammito M.",
  savasta:"Savasta G.",chiove:"Chiove\' A.",
  cafici:"Cafici D.",belluardo_m:"Belluardo M.",
  buetta:"Buetta M.",umana:"Umana G.",
};
var TE={
  ciacera:"CIACERA MACAUDA GIUSY",iabichella:"ORIANA IABICHELLA",
  azzarelli:"AZZARELLI GIAMPIERO",scire:"SCIRE\' INGASTONE VALENTINA",
  scollo:"SCOLLO GIOVANNI",colombo:"COLOMBO PIERSANTO",
  pluchino:"GIADA PLUCHINO",pizzo:"ELENA PIZZO",
  belluardo_d:"BELLUARDO DESIRE\'",sammito:"SAMMITO MANUELA",
  savasta:"SAVASTA GIOVANNI",chiove:"CHIOVE\' ALISEA",
  cafici:"CAFICI DANIELA",belluardo_m:"BELLUARDO MARILENA",
  buetta:"BUETTA MARGHERITA",umana:"UMANA GIORGIA",
};

var SUBJECTS=[
  {id:"condotta",label:"Condotta",                  short:"COND", ore:0,   doc:"",           emoji:"⭐",color:"#7C3AED",conductaOnly:true},
  {id:"m01", label:"M01 - Italiano",              short:"M01",  ore:60,  doc:"ciacera",    emoji:"📝",color:"#3B82F6"},
  {id:"m02", label:"M02 - Comunicazione",          short:"M02",  ore:22,  doc:"",           emoji:"💬",color:"#8B5CF6"},
  {id:"m03", label:"M03 - Inglese",               short:"M03",  ore:50,  doc:"iabichella", emoji:"🌐",color:"#EC4899"},
  {id:"m04", label:"M04 - Matematica I",          short:"M04",  ore:46,  doc:"",           emoji:"📐",color:"#059669"},
  {id:"m05", label:"M05 - Geometria",             short:"M05",  ore:10,  doc:"azzarelli",  emoji:"📏",color:"#10B981"},
  {id:"m06", label:"M06 - Statistica",            short:"M06",  ore:10,  doc:"azzarelli",  emoji:"📊",color:"#0EA5E9"},
  {id:"m07", label:"M07 - Scienze Integrate",     short:"M07",  ore:42,  doc:"scire",      emoji:"🔬",color:"#F59E0B"},
  {id:"m08", label:"M08 - Trasformazione Energetica",  short:"M08",  ore:40,  doc:"scollo",     emoji:"⚡",color:"#EF4444"},
  {id:"m09", label:"M09 - Sviluppo Sostenibile Amb.",      short:"M09",  ore:10,  doc:"",           emoji:"🌱",color:"#84CC16"},
  {id:"m10", label:"M10 - Scienze Motorie",       short:"M10",  ore:10,  doc:"colombo",    emoji:"⚽",color:"#F97316"},
  {id:"m11", label:"M11 - Informatica",           short:"M11",  ore:30,  doc:"",           emoji:"💻",color:"#6366F1"},
  {id:"m12", label:"M12 - Economia I",            short:"M12",  ore:30,  doc:"pluchino",   emoji:"💰",color:"#D97706"},
  {id:"m13", label:"M13 - Cultura Impresa",       short:"M13",  ore:25,  doc:"",           emoji:"🏢",color:"#64748B"},
  {id:"m14", label:"M14 - Orientamento I",        short:"M14",  ore:10,  doc:"umana",      emoji:"🧭",color:"#0F766E"},
  {id:"m15", label:"M15 - Storia I",              short:"M15",  ore:20,  doc:"pizzo",      emoji:"🏛",color:"#B45309"},
  {id:"m16", label:"M16 - Geografia Economica",   short:"M16",  ore:10,  doc:"ciacera",    emoji:"🌍",color:"#2563EB"},
  {id:"m17", label:"M17 - Religione/Alter.",        short:"M17",  ore:10,  doc:"",           emoji:"✝",color:"#7C3AED"},
  {id:"m18", label:"M18 - Diritto",               short:"M18",  ore:30,  doc:"belluardo_d",emoji:"⚖",color:"#DC2626"},
  {id:"m19", label:"M19 - Diritti UE",            short:"M19",  ore:10,  doc:"sammito",    emoji:"🇪🇺",color:"#1D4ED8"},
  {id:"m20", label:"M20 - Pari Opportunita\'",   short:"M20",  ore:10,  doc:"sammito",    emoji:"🤝",color:"#BE185D"},
  {id:"m21", label:"M21 - Sviluppo Sostenibile Sociale",   short:"M21",  ore:10,  doc:"sammito",    emoji:"♻",color:"#16A34A"},
  {id:"m22", label:"M22 - Pianifificazione delle Fasi Lavoro",   short:"M22",  ore:60,  doc:"savasta",    emoji:"📋",color:"#7C3AED"},
  {id:"m23", label:"M23 - Strum. e Attrezz.",     short:"M23",  ore:30,  doc:"chiove",     emoji:"🔧",color:"#9A3412"},
  {id:"m24", label:"M24 - Sicurezza",             short:"M24",  ore:16,  doc:"azzarelli",  emoji:"🦺",color:"#B45309"},
  {id:"m25", label:"M25 - Accoglienza Cliente",   short:"M25",  ore:100, doc:"savasta",    emoji:"💈",color:"#0F766E"},
  {id:"m26", label:"M26 - Gestione e Promozione",      short:"M26",  ore:100, doc:"savasta",    emoji:"📣",color:"#6D28D9"},
  {id:"m27", label:"M27 - Dermatologia",          short:"M27",  ore:120, doc:"savasta",    emoji:"💆",color:"#BE185D"},
  {id:"m28", label:"M28 - Taglio e Acconciatura", short:"M28",  ore:107, doc:"cafici",     emoji:"✂",color:"#0369A1"},
  {id:"m25e",label:"M25E - Accoglienza E",        short:"M25E", ore:50,  doc:"belluardo_m",emoji:"💄",color:"#DB2777"},
  {id:"m26e",label:"M26E - Gest. Promo. E",       short:"M26E", ore:50,  doc:"buetta",     emoji:"💅",color:"#7C3AED"},
  {id:"m27b",label:"M27b - Anatomia e Fisiol.",   short:"M27b", ore:70,  doc:"belluardo_m",emoji:"🫀",color:"#DC2626"},
  {id:"m28b",label:"M28b - Tratt. Estetici",      short:"M28b", ore:70,  doc:"buetta",     emoji:"✨",color:"#D97706"},
  {id:"m29", label:"M29 - Tratt. Viso/Corpo",     short:"M29",  ore:87,  doc:"",           emoji:"🧴",color:"#EC4899"},
  {id:"mas1",label:"MAS1 - Alternanza Simulata",  short:"MAS1", ore:158, doc:"sammito",    emoji:"🏫",color:"#64748B"},
];

var TEACHERS=(()=>{
  const m={};
  SUBJECTS.forEach(s=>{
    if(!s.doc)return;
    if(!m[s.doc])m[s.doc]={id:s.doc,label:TN[s.doc]||s.doc,initials:s.doc.slice(0,2).toUpperCase(),isAdmin:false,subjects:[]};
    m[s.doc].subjects.push(s.id);
  });
  return Object.values(m);
})();

const ADMIN={id:"admin",label:"Amministratore",initials:"AD",isAdmin:true,isTutor:false,isSegreteria:false,subjects:SUBJECTS.map(s=>s.id)};
const TUTOR={id:"tutor",label:TUTOR_NAME,initials:"TU",isAdmin:false,isTutor:true,isSegreteria:false,subjects:SUBJECTS.map(s=>s.id)};
const SEGRETERIA={id:"segreteria",label:"Segreteria",initials:"SE",isAdmin:false,isTutor:false,isSegreteria:true,subjects:SUBJECTS.map(s=>s.id)};
// ── Configurazione corsi (track1 e track2 per classe, usata da corsoBadge e adminAlunni) ──
var COURSE_TRACKS={
  track1:{id:"acconciatore",label:"Acconciatore",short:"Acconc.",emoji:"✂",badge:"cb-acc",sup:"A",supColor:"#1D4ED8"},
  track2:{id:"estetica",label:"Estetica",short:"Estetica",emoji:"💄",badge:"cb-est",sup:"E",supColor:"#7C3AED"},
  courseLabel:"Operatore del benessere — Erogazione di trattamenti di acconciatura / Erogazione dei servizi di trattamento estetico",
  courseCode:"Id 116 — D26AE1E — n. ore: 1056"
};

// Dinamico: include eventuali docenti custom creati da Admin
function allUsers(){return[...TEACHERS,...Object.values(App.customTeachers||{}),TUTOR,SEGRETERIA,ADMIN];}
// Materie effettive del docente loggato — ricalcolate da docenteMaterie (realtime)
function mySubjects(){
  const t=App.teacher;if(!t)return[];
  if(t.isAdmin||t.isTutor||t.isSegreteria)return SUBJECTS.map(s=>s.id);
  return SUBJECTS.filter(s=>docOf(s.id)===t.id).map(s=>s.id);
}

// ═══════════════════════════════════════════════
//  STATO
// ═══════════════════════════════════════════════
const App={
  page:"login",teacher:null,subjId:null,tab:"home",adminTab:"materie",
  grades:{},pins:{},dimessi:{},
  corsiStudenti:{},   // {idx: "acconciatore"|"estetica"|""}
  corsiMaterie:{},    // {sid: "comune"|"acconciatore"|"estetica"}
  docenteMaterie:{},  // {sid: {id,name,full}} — override docente per materia
  customTeachers:{},  // {id: {id,label,full,initials}} — docenti creati da Admin
  edits:{},fbL:null,accessLog:{},
  ammissioni:{defaultDate:"",overrides:{}},  // date di ammissione per alunno
  dimissioni:{},  // {idx: "DD-MM-YYYY"} — date di dimissione per alunno
  trasferiti:{},  // {idx: true} — alunni trasferiti (solo Admin)
  trasferiti_date:{},  // {idx: "DD-MM-YYYY"} — date di trasferimento
  fbPrefix:"",    // "" per 1E, "1D/" per 1D — isola i nodi Firebase per classe
  currentClass:"1E",  // classe attualmente attiva
  condottaParziale:{}, // {teacherId: {studentIdx: {value,ts,docente}}} — voti condotta parziali
  subjectsLocked:{},   // {sid: true} — materie bloccate (docenti non possono modificare)
};

