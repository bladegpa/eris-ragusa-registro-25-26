// ═══════════════════════════════════════════════
//  data_1d.js — Dati fissi Classe 1D
//  ⚠️ Questo file NON tocca nulla della 1E.
//     I dati vengono attivati solo quando l'utente
//     seleziona "Classe 1D" nella schermata iniziale.
// ═══════════════════════════════════════════════

const ANNO_1D   = "2025/2026";
const CLASSE_1D = "1D";
const TUTOR_NAME_1D = "Gabriella Savarino";

// ── Alunni classe 1D (da registro ufficiale) ────────────────────────────────
const STUDENTS_1D = [
  {num:1,  name:"CERAMI LUANA"},
  {num:2,  name:"CILIA SCALONE SALVATORE"},
  {num:3,  name:"CRISCIONE ALESSANDRO"},
  {num:4,  name:"DI MARTINO GIOVANNI"},
  {num:5,  name:"DRARENI ABOUBAKR"},
  {num:6,  name:"HAMOUDA ADEM"},
  {num:7,  name:"KOVACI LEONEL"},
  {num:8,  name:"LA ROCCA ANGELO"},
  {num:9,  name:"LEONARDI GIOVANNI"},
  {num:10, name:"LUCIFORA GIOVANNI"},
  {num:11, name:"MANGIONE GIUSEPPE"},       // ⚠️ TRASFERITO — da segnare in Admin
  {num:12, name:"MICIELI MONIA"},            // ⚠️ TRASFERITA — da segnare in Admin
  {num:13, name:"OBOROCEANU ANGELO GABRIELE"}, // ⚠️ TRASFERITO — da segnare in Admin
  {num:14, name:"RESTIVO PINA"},
  {num:15, name:"RRUSHI MUHAMED"},
  {num:16, name:"SIERAKOWSKI DORIAN"},
  {num:17, name:"SIGONA GIORGIO"},
  {num:18, name:"SOLARINO BENEDETTO FRANCESCO"},
  {num:19, name:"SOLARINO GIACOS"},
  {num:20, name:"VIRZI FILIPPO"},
  {num:21, name:"YAZIDI AHMED RAYEN"},
  {num:22, name:"ROSELLA ALESSANDRO"},
  {num:23, name:"GAGLIANO GIUSEPPE"},
  {num:24, name:"D'IZZIA CHRISTIAN"},        // ← invertito con ISMAILI
  {num:25, name:"ISMAILI ALBIN"},             // ← invertito con D'IZZIA
  {num:26, name:"RADSI NOUR"},
  {num:27, name:"BEZHDILI FLAVIO"},
  {num:28, name:"HAMMOUDA RADHOUANE"},
  {num:29, name:"INVERNINO SAMUEL"},
  {num:30, name:"KORRESHI ANHEL"},
];

// ── Nomi brevi e completi docenti 1D ────────────────────────────────────────
// TN_1D = short label (Cognome N.), TE_1D = full name uppercase
const TN_1D = {
  ciacera:     "Ciacera Macauda G.",
  dammone:     "Dammone Sessa N.",
  iabichella:  "Iabichella O.",
  azzarelli:   "Azzarelli G.",
  colombo:     "Colombo P.",
  scire:       "Scire\' Ingastone V.",
  scollo:      "Scollo G.",
  cervello:    "Cervello M.",
  pluchino:    "Pluchino G.",
  umana:       "Umana G.",
  pizzo:       "Pizzo E.",
  belluardo_d: "Belluardo D.",
  sammito:     "Sammito M.",
  savarino:    "Savarino G.",
};
const TE_1D = {
  ciacera:     "CIACERA MACAUDA GIUSY",
  dammone:     "DAMMONE SESSA NICOLETTA",
  iabichella:  "IABICHELLA ORIANA",
  azzarelli:   "AZZARELLI GIAMPIERO",
  colombo:     "COLOMBO PIERSANTO",
  scire:       "SCIRE\' INGASTONE VALENTINA",
  scollo:      "SCOLLO GIOVANNI",
  cervello:    "CERVELLO MARIO",
  pluchino:    "PLUCHINO GIADA",
  umana:       "UMANA GIORGIA",
  pizzo:       "PIZZO ELENA",
  belluardo_d: "BELLUARDO DESIRE\'",
  sammito:     "SAMMITO MANUELA",
  savarino:    "SAVARINO GABRIELLA",
};

// ── Materie classe 1D ────────────────────────────────────────────────────────
// Indirizzo meccanico: M25–M29
// Indirizzo ristorazione: M30–M32
// M01–M24, M25 (accoglienza), MAS1: comuni
const SUBJECTS_1D = [
  {id:"condotta", label:"Condotta",                                       short:"COND",  ore:0,   doc:"",           emoji:"⭐", color:"#7C3AED", conductaOnly:true},
  {id:"m01",  label:"M01 - Italiano",                                     short:"M01",   ore:60,  doc:"ciacera",    emoji:"📝", color:"#3B82F6"},
  {id:"m02",  label:"M02 - Comunicazione",                                short:"M02",   ore:22,  doc:"dammone",    emoji:"💬", color:"#8B5CF6"},
  {id:"m03",  label:"M03 - Inglese",                                      short:"M03",   ore:50,  doc:"iabichella", emoji:"🌐", color:"#EC4899"},
  {id:"m04",  label:"M04 - Matematica I",                                 short:"M04",   ore:46,  doc:"azzarelli",  emoji:"📐", color:"#059669"},
  {id:"m05",  label:"M05 - Geometria",                                    short:"M05",   ore:10,  doc:"azzarelli",  emoji:"📏", color:"#10B981"},
  {id:"m06",  label:"M06 - Statistica",                                   short:"M06",   ore:10,  doc:"colombo",    emoji:"📊", color:"#0EA5E9"},
  {id:"m07",  label:"M07 - Scienze Integrate",                            short:"M07",   ore:42,  doc:"scire",      emoji:"🔬", color:"#F59E0B"},
  {id:"m08",  label:"M08 - Trasform. Energetica",                         short:"M08",   ore:40,  doc:"scollo",     emoji:"⚡", color:"#EF4444"},
  {id:"m09",  label:"M09 - Svil. Sost. Amb.",                             short:"M09",   ore:10,  doc:"cervello",   emoji:"🌱", color:"#84CC16"},
  {id:"m10",  label:"M10 - Scienze Motorie",                              short:"M10",   ore:10,  doc:"colombo",    emoji:"⚽", color:"#F97316"},
  {id:"m11",  label:"M11 - Informatica",                                  short:"M11",   ore:30,  doc:"azzarelli",  emoji:"💻", color:"#6366F1"},
  {id:"m12",  label:"M12 - Economia I",                                   short:"M12",   ore:30,  doc:"pluchino",   emoji:"💰", color:"#D97706"},
  {id:"m13",  label:"M13 - Cultura Impresa",                              short:"M13",   ore:25,  doc:"pluchino",   emoji:"🏢", color:"#64748B"},
  {id:"m14",  label:"M14 - Orientamento I",                               short:"M14",   ore:10,  doc:"umana",      emoji:"🧭", color:"#0F766E"},
  {id:"m15",  label:"M15 - Storia I",                                     short:"M15",   ore:20,  doc:"pizzo",      emoji:"🏛", color:"#B45309"},
  {id:"m16",  label:"M16 - Geografia Economica",                          short:"M16",   ore:10,  doc:"ciacera",    emoji:"🌍", color:"#2563EB"},
  {id:"m17",  label:"M17 - Religione/Alt.",                               short:"M17",   ore:10,  doc:"",           emoji:"✝",  color:"#7C3AED"},
  {id:"m18",  label:"M18 - Diritto",                                      short:"M18",   ore:30,  doc:"belluardo_d",emoji:"⚖",  color:"#DC2626"},
  {id:"m19",  label:"M19 - Diritti UE",                                   short:"M19",   ore:10,  doc:"sammito",    emoji:"🇪🇺", color:"#1D4ED8"},
  {id:"m20",  label:"M20 - Pari Opportunita\'",                          short:"M20",   ore:10,  doc:"sammito",    emoji:"🤝", color:"#BE185D"},
  {id:"m21",  label:"M21 - Svil. Sost. Sociale",                          short:"M21",   ore:10,  doc:"sammito",    emoji:"♻",  color:"#16A34A"},
  {id:"m22",  label:"M22 - Pianif. Fasi Lavoro",                          short:"M22",   ore:60,  doc:"",           emoji:"📋", color:"#7C3AED"},
  {id:"m23",  label:"M23 - Strum. e Attrezz. I",                          short:"M23",   ore:30,  doc:"",           emoji:"🔧", color:"#9A3412"},
  {id:"m24",  label:"M24 - Sicurezza",                                    short:"M24",   ore:16,  doc:"",           emoji:"🦺", color:"#B45309"},
  // ─── Indirizzo MECCANICO ───────────────────────────────────────────────────
  {id:"m25",  label:"M25 - Accoglienza Cliente",                          short:"M25",   ore:100, doc:"",           emoji:"👋", color:"#0F766E"},
  {id:"m26",  label:"M26 - Individuazione Interventi",                    short:"M26",   ore:50,  doc:"",           emoji:"🔍", color:"#6D28D9"},
  {id:"m27",  label:"M27 - Interventi Motopropulsivo",                    short:"M27",   ore:50,  doc:"",           emoji:"⚙️",  color:"#0369A1"},
  {id:"m28",  label:"M28 - Manutenzione Trazione I",                      short:"M28",   ore:57,  doc:"",           emoji:"🚗", color:"#1D4ED8"},
  {id:"m29",  label:"M29 - Interventi Manutenzione",                      short:"M29",   ore:70,  doc:"",           emoji:"🔩", color:"#0369A1"},
  // ─── Indirizzo RISTORAZIONE ───────────────────────────────────────────────
  {id:"m30",  label:"M30 - Normativa HACCP",                              short:"M30",   ore:120, doc:"",           emoji:"🍽",  color:"#059669"},
  {id:"m31",  label:"M31 - Tecniche Allestimento Piatti",                 short:"M31",   ore:120, doc:"",           emoji:"👨‍🍳", color:"#047857"},
  {id:"m32",  label:"M32 - Lavorazione Materie Prime",                    short:"M32",   ore:107, doc:"",           emoji:"🥗",  color:"#15803D"},
  // ─── Alternanza Simulata ──────────────────────────────────────────────────
  {id:"mas1", label:"MAS1 - Alternanza Simulata",                         short:"MAS1",  ore:158, doc:"pluchino",   emoji:"🏫", color:"#64748B"},
];

// ── Default corso per materia (meccanico/ristorazione split) ─────────────────
const DEFAULT_CORSO_MATERIA_1D = {
  // M25 è comune (accoglienza cliente condivisa da entrambi gli indirizzi)
  m26:"meccanico", m27:"meccanico", m28:"meccanico", m29:"meccanico",
  m30:"ristorazione", m31:"ristorazione", m32:"ristorazione",
};

// ── Configurazione corsi per classe 1D ──────────────────────────────────────
const COURSE_TRACKS_1D = {
  track1: {id:"meccanico",    label:"Meccanico",    short:"Mecc.",      emoji:"🔧", badge:"cb-mec", sup:"M", supColor:"#0369A1"},
  track2: {id:"ristorazione", label:"Ristorazione", short:"Ristora.",   emoji:"🍽",  badge:"cb-ris", sup:"R", supColor:"#15803D"},
  courseLabel:"Operatore meccanico / Operatore della ristorazione",
  courseCode:"Classe 1D &mdash; n. ore: 1056",
};
