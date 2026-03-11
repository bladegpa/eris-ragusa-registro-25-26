// ═══════════════════════════════════════════════
//  data_2d.js — Dati fissi Classe 2D
//  Indirizzo: Meccanico (2° anno)
// ═══════════════════════════════════════════════

const ANNO_2D    = "2025/2026";
const CLASSE_2D  = "2D";
const TUTOR_NAME_2D = "Valentina Nonni";

const STUDENTS_2D = [
  {num:1,  name:"ACHOURI AHMED"},
  {num:2,  name:"ALLIBRIO SALVATORE"},
  {num:3,  name:"CALVO GIUSEPPE"},
  {num:4,  name:"CAMPANELLA GIOVANNI"},
  {num:5,  name:"CASCHETTO FRANCESCO"},
  {num:6,  name:"CELA ORGITO"},
  {num:7,  name:"CHIRILLO MARIO"},
  {num:8,  name:"GUERRIERI VINCENZO"},
  {num:9,  name:"ISMAIL OMAR"},
  {num:10, name:"JABRI SABRI"},
  {num:11, name:"KHEMIRI ABDELAZIZ"},
  {num:12, name:"MALLO SALVATORE"},
  {num:13, name:"MANCIAGLI ANTONINO"},
  {num:14, name:"MANGIARATTI LUCA"},
  {num:15, name:"NADER NAZIAR"},
  {num:16, name:"PARAVIZZINI LUCA"},
  {num:17, name:"SADUSHI ARBI"},
  {num:18, name:"SCIUME\' GIOVANNI ANDREA"},
  {num:19, name:"VARACALLI NICOLO\'"},
  {num:20, name:"VITALE GAETANO NICOLAS"},
  {num:21, name:"CHATTI SALAH"},
  {num:22, name:"RAGUSA GIOELE"},
  {num:23, name:"SALAH SADOK"},
];

const TN_2D = {
  ciacera:"Ciacera Macauda G.",  pizzo:"Pizzo E.",
  iabichella:"Iabichella O.",    azzarelli:"Azzarelli G.",
  colombo:"Colombo P.",           scire:"Scire\' Ingastone V.",
  scollo:"Scollo G.",             leone:"Leone A.",
  umana:"Umana G.",               zappulla:"Zappulla C.",
  ciurciullo:"Ciurciullo L.",
};
const TE_2D = {
  ciacera:"CIACERA MACAUDA GIUSY",      pizzo:"PIZZO ELENA",
  iabichella:"IABICHELLA ORIANA",        azzarelli:"AZZARELLI GIAMPIERO",
  colombo:"COLOMBO PIERSANTO",           scire:"SCIRE\' INGASTONE VALENTINA",
  scollo:"SCOLLO GIOVANNI",              leone:"LEONE ANGELA",
  umana:"UMANA GIORGIA",                 zappulla:"ZAPPULLA CARMELO",
  ciurciullo:"CIURCIULLO LUCA",
};

const SUBJECTS_2D = [
  {id:"condotta",label:"Condotta",                        short:"COND",  ore:0,   doc:"",           emoji:"⭐",color:"#7C3AED",conductaOnly:true},
  {id:"m01",  label:"M01 - Italiano II",                  short:"M01",   ore:82,  doc:"ciacera",    emoji:"📝",color:"#3B82F6"},
  {id:"m02",  label:"M02 - Inglese II",                   short:"M02",   ore:50,  doc:"iabichella", emoji:"🌐",color:"#EC4899"},
  {id:"m03",  label:"M03 - Matematica II",                short:"M03",   ore:66,  doc:"azzarelli",  emoji:"📐",color:"#059669"},
  {id:"m04",  label:"M04 - Scienze Motorie",              short:"M04",   ore:20,  doc:"colombo",    emoji:"⚽",color:"#F97316"},
  {id:"m05",  label:"M05 - Scienze della Terra",          short:"M05",   ore:40,  doc:"scire",      emoji:"🌍",color:"#10B981"},
  {id:"m06",  label:"M06 - Scienze Integrate",            short:"M06",   ore:40,  doc:"scire",      emoji:"🔬",color:"#F59E0B"},
  {id:"m07",  label:"M07 - Informatica",                  short:"M07",   ore:32,  doc:"azzarelli",  emoji:"💻",color:"#6366F1"},
  {id:"m08",  label:"M08 - Storia II",                    short:"M08",   ore:28,  doc:"ciacera",    emoji:"🏛",color:"#B45309"},
  {id:"m09",  label:"M09 - Elementi per la Sostenibilità ambientale e la transizione energetica II",    short:"M09",   ore:20,  doc:"scollo",     emoji:"🌱",color:"#84CC16"},
  {id:"m10",  label:"M10 - Pari Opportunita\' II",        short:"M10",   ore:30,  doc:"leone",      emoji:"🤝",color:"#BE185D"},
  {id:"m11",  label:"M11 - Cura Impresa e Diritto",       short:"M11",   ore:28,  doc:"leone",      emoji:"⚖", color:"#DC2626"},
  {id:"m12",  label:"M12 - Religione/Alt.",               short:"M12",   ore:10,  doc:"",           emoji:"✝", color:"#7C3AED"},
  {id:"m13",  label:"M13 - Orientamento II",              short:"M13",   ore:16,  doc:"umana",      emoji:"🧭",color:"#0F766E"},
  {id:"m14",  label:"M14 - Sicurezza II",                 short:"M14",   ore:33,  doc:"azzarelli",  emoji:"🦺",color:"#B45309"},
  {id:"m15",  label:"M15 - Pianif. Fasi Lavoro II",       short:"M15",   ore:33,  doc:"zappulla",   emoji:"📋",color:"#7C3AED"},
  {id:"m16",  label:"M16 - Accoglienza Cliente II",       short:"M16",   ore:20,  doc:"",           emoji:"👋",color:"#0F766E"},
  {id:"m17",  label:"M17 - Elettrotecnica e Circuiti",    short:"M17",   ore:23,  doc:"ciurciullo", emoji:"⚡",color:"#EF4444"},
  {id:"m18",  label:"M18 - Manutenzione Motopropulsore",  short:"M18",   ore:35,  doc:"",           emoji:"🔩",color:"#0369A1"},
];

// Classe monopercorso: nessun track split
const DEFAULT_CORSO_MATERIA_2D = {};

const COURSE_TRACKS_2D = {
  track1:{id:"meccanico",label:"Meccanico",short:"Mecc.",emoji:"🔧",badge:"cb-mec",sup:"M",supColor:"#0369A1"},
  track2:{id:"",         label:"",         short:"",     emoji:"",  badge:"cb-none",sup:"", supColor:"#94A3B8"},
  courseLabel:"Operatore alla riparazione dei veicoli a motore - Manutenzione e riparazione delle parti e dei sistemi meccanici ed elettromeccanici",
  courseCode:"Classe 2D &mdash; n. ore: 1056",
};
