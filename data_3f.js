// ═══════════════════════════════════════════════
//  data_3f.js — Dati fissi Classe 3F
//  Indirizzo: Acconciatura + Estetica (3° anno)
// ═══════════════════════════════════════════════

const ANNO_3F    = "2025/2026";
const CLASSE_3F  = "3F";
const TUTOR_NAME_3F = "Gabriella Savarino";

const STUDENTS_3F = [
  {num:1,  name:"ANDOLINA JENNIFER"},
  {num:2,  name:"AVARINO ALICE"},
  {num:3,  name:"BACCOUCHE WISSEM"},
  {num:4,  name:"BALLATO SOFIA"},
  {num:5,  name:"BOUGHNIMI OMAR"},
  {num:6,  name:"CARUSO SHARON"},
  {num:7,  name:"KORRESHI ROBERTA"},
  {num:8,  name:"LA TERRA GIULIA"},
  {num:9,  name:"MEZIANE CHAYMAA RANYA"},
  {num:10, name:"NAIRI FADI"},
  {num:11, name:"PUCCIA SAMUELE"},
  {num:12, name:"SEFERI EMIRJONA"},
  {num:13, name:"SIGONA SERENA"},
  {num:14, name:"SPINA BENEDETTA"},
  {num:15, name:"STRAZZERI FRANCESCO"},
  {num:16, name:"TRIMI ERISA"},
  {num:17, name:"TROPEA CHANTAL"},
  {num:18, name:"XHAMETA SANTJAGO"},
  {num:19, name:"KOSHI ELBJON"},
  {num:20, name:"BANNI NOUR MARGHERITA"},
];

const TN_3F = {
  ciacera:     "Ciacera Macauda G.",
  iabichella:  "Iabichella O.",
  dammone:     "Dammone Sessa N.",
  zappulla:    "Zappulla C.",
  pluchino:    "Pluchino G.",
  cervello:    "Cervello M.",
  leone:       "Leone A.",
  colombo:     "Colombo P.",
  scire:       "Scire\' Ingastone V.",
  azzarelli:   "Azzarelli G.",
  umana:       "Umana G.",
  cafici:      "Cafici D.",
  buetta:      "Buetta M.",
  savasta:     "Savasta G.",
  belluardo_m: "Belluardo M.",
};
const TE_3F = {
  ciacera:     "CIACERA MACAUDA GIUSY",
  iabichella:  "IABICHELLA ORIANA",
  dammone:     "DAMMONE SESSA NICOLETTA",
  zappulla:    "ZAPPULLA CARMELO",
  pluchino:    "PLUCHINO GIADA",
  cervello:    "CERVELLO MARIO",
  leone:       "LEONE ANGELA",
  colombo:     "COLOMBO PIERSANTO",
  scire:       "SCIRE\' INGASTONE VALENTINA",
  azzarelli:   "AZZARELLI GIAMPIERO",
  umana:       "UMANA GIORGIA",
  cafici:      "CAFICI DANIELA",
  buetta:      "BUETTA MARGHERITA",
  savasta:     "SAVASTA GIOVANNI",
  belluardo_m: "BELLUARDO MARILENA",
};

const SUBJECTS_3F = [
  {id:"condotta",label:"Condotta",                                       short:"COND",  ore:0,   doc:"",           emoji:"⭐",color:"#7C3AED",conductaOnly:true},
  // ─── Materie comuni ────────────────────────────────────────────────────────
  {id:"m01",  label:"M01 - Italiano III",                                short:"M01",   ore:66,  doc:"ciacera",    emoji:"📝",color:"#3B82F6"},
  {id:"m02",  label:"M02 - Inglese III",                                 short:"M02",   ore:30,  doc:"iabichella", emoji:"🌐",color:"#EC4899"},
  {id:"m03",  label:"M03 - Tecniche di Comunicazione",                   short:"M03",   ore:36,  doc:"dammone",    emoji:"💬",color:"#8B5CF6"},
  {id:"m04",  label:"M04 - Matematica III",                              short:"M04",   ore:66,  doc:"zappulla",   emoji:"📐",color:"#059669"},
  {id:"m05",  label:"M05 - Storia III",                                  short:"M05",   ore:15,  doc:"ciacera",    emoji:"🏛",color:"#B45309"},
  {id:"m06",  label:"M06 - Cultura Impresa e Diritto III",               short:"M06",   ore:20,  doc:"pluchino",   emoji:"⚖", color:"#DC2626"},
  {id:"m07",  label:"M07 - Sostenibilit\u00e0 Ambientale",              short:"M07",   ore:20,  doc:"cervello",   emoji:"🌱",color:"#84CC16"},
  {id:"m08",  label:"M08 - Pari Opportunit\u00e0 e Cittadinanza",       short:"M08",   ore:39,  doc:"leone",      emoji:"🤝",color:"#BE185D"},
  {id:"m09",  label:"M09 - Religione/Alt.",                              short:"M09",   ore:5,   doc:"",           emoji:"✝", color:"#7C3AED"},
  {id:"m10",  label:"M10 - Scienze Motorie",                             short:"M10",   ore:10,  doc:"colombo",    emoji:"⚽",color:"#F97316"},
  {id:"m11",  label:"M11 - Scienze Integrate III",                       short:"M11",   ore:26,  doc:"scire",      emoji:"🔬",color:"#F59E0B"},
  {id:"m12",  label:"M12 - Informatica e ICT III",                       short:"M12",   ore:30,  doc:"azzarelli",  emoji:"💻",color:"#6366F1"},
  {id:"m13",  label:"M13 - Sicurezza e Igiene III",                      short:"M13",   ore:20,  doc:"azzarelli",  emoji:"🦺",color:"#B45309"},
  {id:"m14",  label:"M14 - Orientamento III",                            short:"M14",   ore:13,  doc:"umana",      emoji:"🧭",color:"#0F766E"},
  // ─── Comuni entrambi gli indirizzi ──────────────────────────────────────────
  {id:"m16",  label:"M16 - Accoglienza Cliente III",                     short:"M16",   ore:20,  doc:"savasta",    emoji:"👋",color:"#0F766E"},
  {id:"m17",  label:"M17 - Gest. Promozione III",                        short:"M17",   ore:15,  doc:"savasta",    emoji:"📣",color:"#6D28D9"},
  // ─── Indirizzo ACCONCIATORE ──────────────────────────────────────────────────
  {id:"m15",  label:"M15 - Pianif. Fasi Lavoro III",                     short:"M15",   ore:30,  doc:"cafici",     emoji:"📋",color:"#7C3AED"},
  {id:"m18",  label:"M18 - Dermatologia e Tricologia III",               short:"M18",   ore:23,  doc:"savasta",    emoji:"💆",color:"#0369A1"},
  {id:"m19",  label:"M19 - Taglio e Acconciatura III",                   short:"M19",   ore:54,  doc:"savasta",    emoji:"✂", color:"#1D4ED8"},
  // ─── Indirizzo ESTETICA ──────────────────────────────────────────────────────
  {id:"m15e", label:"M15E - Pianif. Fasi Lavoro III",                    short:"M15E",  ore:30,  doc:"buetta",     emoji:"📋",color:"#DB2777"},
  {id:"m18e", label:"M18E - Dermatologia e Trattamenti III",             short:"M18E",  ore:23,  doc:"cafici",     emoji:"💄",color:"#DB2777"},
  {id:"m20e", label:"M20E - Anatomia e Fisiologia III",                  short:"M20E",  ore:10,  doc:"buetta",     emoji:"🫀",color:"#DC2626"},
  {id:"m21e", label:"M21E - Trattamenti Viso Corpo III",                 short:"M21E",  ore:57,  doc:"belluardo_m",emoji:"✨",color:"#D97706"},
  {id:"m22e", label:"M22E - Total Look III",                             short:"M22E",  ore:10,  doc:"buetta",     emoji:"🧴",color:"#EC4899"},
];

const DEFAULT_CORSO_MATERIA_3F = {
  m16:"comune", m17:"comune",
  m15:"acconciatore", m18:"acconciatore", m19:"acconciatore",
  m15e:"estetica", m18e:"estetica", m20e:"estetica", m21e:"estetica", m22e:"estetica",
};

const COURSE_TRACKS_3F = {
  track1:{id:"acconciatore",label:"Acconciatore",short:"Acconc.",emoji:"✂",badge:"cb-acc",sup:"A",supColor:"#1D4ED8"},
  track2:{id:"estetica",    label:"Estetica",    short:"Estetica",emoji:"💄",badge:"cb-est",sup:"E",supColor:"#7C3AED"},
  courseLabel:"Operatore del benessere - Erogazione di trattamenti di acconciatura / Operatore del benessere - Erogazione dei servizi di trattamento estetico",
  courseCode:"Classe 3F &mdash; 3&deg; anno",
};
