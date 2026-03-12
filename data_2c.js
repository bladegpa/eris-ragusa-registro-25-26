// ═══════════════════════════════════════════════
//  data_2c.js — Dati fissi Classe 2C
//  Indirizzo: Acconciatura + Estetica (2° anno)
// ═══════════════════════════════════════════════

const ANNO_2C    = "2025/2026";
const CLASSE_2C  = "2C";
const TUTOR_NAME_2C = "Aninta Causapruno";

const STUDENTS_2C = [
  {num:1,  name:"BARTOLOTTI MARIALUISA"},
  {num:2,  name:"BOUGHNIMI NOUR"},
  {num:3,  name:"BURROMETO NUNZIO"},
  {num:4,  name:"BRAHJA ERALDA"},
  {num:5,  name:"CALVO LEANDRO"},
  {num:6,  name:"CANNELLA BENEDETTA GIULIA"},
  {num:7,  name:"CAPPELLO NICOLO\'"},
  {num:8,  name:"CRISCIONE GIULIA"},
  {num:9,  name:"CUTELLO CLAUDIA"},
  {num:10, name:"DALIPAJ ARLIND"},
  {num:11, name:"DIMARTINO MATTIA"},
  {num:12, name:"ELEZAJ ANDJOLA"},
  {num:13, name:"GALVANO FEDERICA MARIA"},
  {num:14, name:"HOXHA SILVIJA"},
  {num:15, name:"IOZZIA CAROL"},
  {num:16, name:"LA ROCCA SIMONE"},
  {num:17, name:"LALAJ PANAJOTIS"},
  {num:18, name:"MAZZA EMILIANA"},
  {num:19, name:"RUSSELLO ANGELO"},
  {num:20, name:"SOLARINO AURORA"},
  {num:21, name:"ANDOLINA DESIRE\'"},
  {num:22, name:"CONTI FRANCESCO"},
  {num:23, name:"BONFANTI NOEMI"},
];

const TN_2C = {
  ciacera:"Ciacera Macauda G.",  iabichella:"Iabichella O.",
  azzarelli:"Azzarelli G.",       colombo:"Colombo P.",
  scire:"Scire\' Ingastone V.",   pizzo:"Pizzo E.",
  scollo:"Scollo G.",             leone:"Leone A.",
  umana:"Umana G.",               chiove:"Chiove\' A.",
  savasta:"Savasta G.",            buetta:"Buetta M.",
  belluardo_m:"Belluardo M.",
};
const TE_2C = {
  ciacera:"CIACERA MACAUDA GIUSY",      iabichella:"IABICHELLA ORIANA",
  azzarelli:"AZZARELLI GIAMPIERO",       colombo:"COLOMBO PIERSANTO",
  scire:"SCIRE\' INGASTONE VALENTINA",   pizzo:"PIZZO ELENA",
  scollo:"SCOLLO GIOVANNI",              leone:"LEONE ANGELA",
  umana:"UMANA GIORGIA",                 chiove:"CHIOVE\' ALISEA",
  savasta:"SAVASTA GIOVANNI",            buetta:"BUETTA MARGHERITA",
  belluardo_m:"BELLUARDO MARILENA",
};

const SUBJECTS_2C = [
  {id:"condotta",label:"Condotta",                          short:"COND",  ore:0,   doc:"",           emoji:"⭐",color:"#7C3AED",conductaOnly:true},
  // ─── Materie comuni ────────────────────────────────────────────────────────
  {id:"m01",  label:"M01 - Italiano",                       short:"M01",   ore:82,  doc:"ciacera",    emoji:"📝",color:"#3B82F6"},
  {id:"m02",  label:"M02 - Inglese II",                     short:"M02",   ore:50,  doc:"iabichella", emoji:"🌐",color:"#EC4899"},
  {id:"m03",  label:"M03 - Matematica II",                  short:"M03",   ore:46,  doc:"azzarelli",  emoji:"📐",color:"#059669"},
  {id:"m04",  label:"M04 - Scienze Motorie",                short:"M04",   ore:20,  doc:"colombo",    emoji:"⚽",color:"#F97316"},
  {id:"m05",  label:"M05 - Scienze della Terra",            short:"M05",   ore:40,  doc:"scire",      emoji:"🌍",color:"#10B981"},
  {id:"m06",  label:"M06 - Scienze Integrate",              short:"M06",   ore:40,  doc:"scire",      emoji:"🔬",color:"#F59E0B"},
  {id:"m07",  label:"M07 - Informatica",                    short:"M07",   ore:32,  doc:"",           emoji:"💻",color:"#6366F1"},
  {id:"m08",  label:"M08 - Storia II",                      short:"M08",   ore:28,  doc:"ciacera",      emoji:"🏛",color:"#B45309"},
  {id:"m09",  label:"M09 - Svil. Sost. Ambientale II",      short:"M09",   ore:20,  doc:"scollo",     emoji:"🌱",color:"#84CC16"},
  {id:"m10",  label:"M10 - Pari Opportunita\' II",          short:"M10",   ore:30,  doc:"leone",      emoji:"🤝",color:"#BE185D"},
  {id:"m11",  label:"M11 - Cura Impresa e Diritto",         short:"M11",   ore:28,  doc:"leone",      emoji:"⚖", color:"#DC2626"},
  {id:"m12",  label:"M12 - Religione/Alt.",                 short:"M12",   ore:10,  doc:"",           emoji:"✝", color:"#7C3AED"},
  {id:"m13",  label:"M13 - Orientamento II",                short:"M13",   ore:16,  doc:"umana",      emoji:"🧭",color:"#0F766E"},
  {id:"m14",  label:"M14 - Sicurezza II",                   short:"M14",   ore:33,  doc:"azzarelli",  emoji:"🦺",color:"#B45309"},
  {id:"m15",  label:"M15 - Pianif. Fasi Lavoro II",         short:"M15",   ore:33,  doc:"chiove",     emoji:"📋",color:"#7C3AED"},
  // ─── Comuni entrambi gli indirizzi ──────────────────────────────────────────
  {id:"m16",  label:"M16 - Accoglienza Cliente II",         short:"M16",   ore:10,  doc:"chiove",     emoji:"👋",color:"#0F766E"},
  {id:"m17",  label:"M17 - Gest. Promozione II",            short:"M17",   ore:10,  doc:"savasta",    emoji:"📣",color:"#6D28D9"},
  // ─── Indirizzo ACCONCIATORE ──────────────────────────────────────────────────
  {id:"m18",  label:"M18 - Dermatologia e Trattamenti",     short:"M18",   ore:25,  doc:"savasta",    emoji:"💆",color:"#0369A1"},
  {id:"m19",  label:"M19 - Taglio e Acconciatura",          short:"M19",   ore:33,  doc:"savasta",    emoji:"✂", color:"#1D4ED8"},
  // ─── Indirizzo ESTETICA ──────────────────────────────────────────────────────
  {id:"m18e", label:"M18E - Dermatologia Estetica",         short:"M18E",  ore:10,  doc:"buetta",     emoji:"💄",color:"#DB2777"},
  {id:"m19e", label:"M19E - Trattamenti Viso Corpo II",     short:"M19E",  ore:38,  doc:"belluardo_m",emoji:"✨",color:"#D97706"},
  {id:"m20e", label:"M20E - Trattamenti Total Look II",     short:"M20E",  ore:10,  doc:"belluardo_m",emoji:"🧴",color:"#EC4899"},
];

const DEFAULT_CORSO_MATERIA_2C = {
  m16:"comune", m17:"comune",
  m18:"acconciatore", m19:"acconciatore",
  m18e:"estetica", m19e:"estetica", m20e:"estetica",
};

const COURSE_TRACKS_2C = {
  track1:{id:"acconciatore",label:"Acconciatore",short:"Acconc.",emoji:"✂",badge:"cb-acc",sup:"A",supColor:"#1D4ED8"},
  track2:{id:"estetica",    label:"Estetica",    short:"Estetica",emoji:"💄",badge:"cb-est",sup:"E",supColor:"#7C3AED"},
  courseLabel:"Operatore del benessere - Erogazione di trattamenti di acconciatura / Operatore del benessere - Erogazione dei servizi di trattamento estetico",
  courseCode:"Classe 2C &mdash; n. ore: 1056",
};
