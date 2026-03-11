// ═══════════════════════════════════════════════
//  data_1g.js — Dati fissi Classe 1G
//  Indirizzo: Meccanico + Estetica
// ═══════════════════════════════════════════════

const ANNO_1G    = "2025/2026";
const CLASSE_1G  = "1G";
const TUTOR_NAME_1G = "Giulia Barone";

const STUDENTS_1G = [
  {num:1,  name:"AMATO SOFIA"},
  {num:2,  name:"BARONE FLAVIO"},
  {num:3,  name:"BEZHDILI FLAVIO"},
  {num:4,  name:"BLANCO NOEMI"},
  {num:5,  name:"BOSCO ASIA MARIA"},
  {num:6,  name:"CARVANA CLAUDIO"},
  {num:7,  name:"CATALANO GIANMARCO"},
  {num:8,  name:"CONDE\' ABOUBACAR"},
  {num:9,  name:"ENTI SALVATORE"},
  {num:10, name:"DI NOTO GIUSEPPE"},
  {num:11, name:"FIRRIOLO SYRIA"},
  {num:12, name:"HAMOUDA ALA"},
  {num:13, name:"IDOUDI JAOUAHR"},
  {num:14, name:"LOREFICE SIMONE ANDRE\'"},
  {num:15, name:"MATARAZZO ALESSANDRO"},
  {num:16, name:"PALAZZOLO MICHELE"},
  {num:17, name:"SAAFET AYHAM"},
  {num:18, name:"SALAH ISKANDER"},
  {num:19, name:"SALIFOU ABDOL BAISSOU"},
  {num:20, name:"SANDU BEKKA LOREDANA"},
  {num:21, name:"SCARDINO ROSSANA"},
  {num:22, name:"SICILIANO AURORA"},
  {num:23, name:"MICIELI MONIA"},
  {num:24, name:"GAGLIANO VITTORIA MARIA"},
  {num:25, name:"BIUNDO VANESSA"},
  {num:26, name:"NICITA MARISTELLA"},
  {num:27, name:"GAGLIANO GIUSEPPE"},
  {num:28, name:"MILAZZO GABRIELE"},
  {num:29, name:"SOKMANI MOHAMED AMINE"},
];

const TN_1G = {
  fidilio:"Fidilio R.",    iabichella:"Iabichella O.", ciurciullo:"Ciurciullo L.",
  azzarelli:"Azzarelli G.",pluchino:"Pluchino G.",     scire:"Scire\' Ingastone V.",
  cervello:"Cervello M.",  scamporino:"Scamporino E.", sammito:"Sammito M.",
  umana:"Umana G.",        leone:"Leone A.",            zappulla:"Zappulla C.",
  buetta:"Buetta M.",      perna:"Perna V.",
};
const TE_1G = {
  fidilio:"FIDILIO ROBERTA",        iabichella:"IABICHELLA ORIANA",
  ciurciullo:"CIURCIULLO LUCA",     azzarelli:"AZZARELLI GIAMPIERO",
  pluchino:"PLUCHINO GIADA",        scire:"SCIRE\' INGASTONE VALENTINA",
  cervello:"CERVELLO MARIO",        scamporino:"SCAMPORINO EGIDIO",
  sammito:"SAMMITO MANUELA",        umana:"UMANA GIORGIA",
  leone:"LEONE ANGELA",             zappulla:"ZAPPULLA CARMELO",
  buetta:"BUETTA MARGHERITA",       perna:"PERNA VIRNA",
};

const SUBJECTS_1G = [
  {id:"condotta",label:"Condotta",                   short:"COND",  ore:0,   doc:"",           emoji:"⭐",color:"#7C3AED",conductaOnly:true},
  {id:"m01", label:"M01 - Italiano",                 short:"M01",   ore:60,  doc:"fidilio",    emoji:"📝",color:"#3B82F6"},
  {id:"m02", label:"M02 - Comunicazione",            short:"M02",   ore:22,  doc:"",           emoji:"💬",color:"#8B5CF6"},
  {id:"m03", label:"M03 - Inglese",                  short:"M03",   ore:50,  doc:"iabichella", emoji:"🌐",color:"#EC4899"},
  {id:"m04", label:"M04 - Matematica I",             short:"M04",   ore:46,  doc:"ciurciullo", emoji:"📐",color:"#059669"},
  {id:"m05", label:"M05 - Geometria",                short:"M05",   ore:10,  doc:"azzarelli",  emoji:"📏",color:"#10B981"},
  {id:"m06", label:"M06 - Statistica",               short:"M06",   ore:10,  doc:"pluchino",   emoji:"📊",color:"#0EA5E9"},
  {id:"m07", label:"M07 - Scienze Integrate",        short:"M07",   ore:42,  doc:"scire",      emoji:"🔬",color:"#F59E0B"},
  {id:"m08", label:"M08 - Trasform. Energetica",     short:"M08",   ore:40,  doc:"",           emoji:"⚡",color:"#EF4444"},
  {id:"m09", label:"M09 - Svil. Sost. Amb.",         short:"M09",   ore:10,  doc:"cervello",   emoji:"🌱",color:"#84CC16"},
  {id:"m10", label:"M10 - Scienze Motorie",          short:"M10",   ore:10,  doc:"scamporino", emoji:"⚽",color:"#F97316"},
  {id:"m11", label:"M11 - Informatica",              short:"M11",   ore:30,  doc:"azzarelli",  emoji:"💻",color:"#6366F1"},
  {id:"m12", label:"M12 - Economia I",               short:"M12",   ore:30,  doc:"scamporino", emoji:"💰",color:"#D97706"},
  {id:"m13", label:"M13 - Cultura Impresa",          short:"M13",   ore:25,  doc:"sammito",    emoji:"🏢",color:"#64748B"},
  {id:"m14", label:"M14 - Orientamento I",           short:"M14",   ore:10,  doc:"umana",      emoji:"🧭",color:"#0F766E"},
  {id:"m15", label:"M15 - Storia I",                 short:"M15",   ore:20,  doc:"umana",      emoji:"🏛",color:"#B45309"},
  {id:"m16", label:"M16 - Geografia Economica",      short:"M16",   ore:10,  doc:"fidilio",    emoji:"🌍",color:"#2563EB"},
  {id:"m17", label:"M17 - Religione/Alt.",           short:"M17",   ore:10,  doc:"",           emoji:"✝", color:"#7C3AED"},
  {id:"m18", label:"M18 - Diritto",                  short:"M18",   ore:30,  doc:"sammito",    emoji:"⚖", color:"#DC2626"},
  {id:"m19", label:"M19 - Diritti UE",               short:"M19",   ore:10,  doc:"leone",      emoji:"🇪🇺",color:"#1D4ED8"},
  {id:"m20", label:"M20 - Pari Opportunita\'",       short:"M20",   ore:10,  doc:"leone",      emoji:"🤝",color:"#BE185D"},
  {id:"m21", label:"M21 - Svil. Sost. Sociale",      short:"M21",   ore:10,  doc:"leone",      emoji:"♻", color:"#16A34A"},
  {id:"m22", label:"M22 - Pianif. Fasi Lavoro",      short:"M22",   ore:30,  doc:"zappulla",   emoji:"📋",color:"#7C3AED"},
  {id:"m23", label:"M23 - Strum. e Attrezz. I",      short:"M23",   ore:30,  doc:"zappulla",   emoji:"🔧",color:"#9A3412"},
  {id:"m24", label:"M24 - Sicurezza",                short:"M24",   ore:16,  doc:"zappulla",   emoji:"🦺",color:"#B45309"},
  // ─── Comune ───────────────────────────────────────────────────────────────
  {id:"m25", label:"M25 - Accoglienza Cliente",      short:"M25",   ore:100, doc:"",           emoji:"👋",color:"#0F766E"},
  // ─── Meccanico ─────────────────────────────────────────────────────────────
  {id:"m26", label:"M26 - Individuazione Interventi",short:"M26",   ore:50,  doc:"ciurciullo", emoji:"🔍",color:"#6D28D9"},
  {id:"m27", label:"M27 - Interventi Motopropulsivo",short:"M27",   ore:50,  doc:"ciurciullo", emoji:"⚙️", color:"#0369A1"},
  {id:"m28", label:"M28 - Manutenzione Trazione I",  short:"M28",   ore:57,  doc:"ciurciullo", emoji:"🚗",color:"#1D4ED8"},
  {id:"m29", label:"M29 - Interventi Manutenzione",  short:"M29",   ore:70,  doc:"ciurciullo", emoji:"🔩",color:"#0369A1"},
  // ─── Estetica ──────────────────────────────────────────────────────────────
  {id:"m30", label:"M30 - Accoglienza Estetica",     short:"M30",   ore:50,  doc:"buetta",     emoji:"💄",color:"#DB2777"},
  {id:"m31", label:"M31 - Gest. Promozione Est.",    short:"M31",   ore:50,  doc:"buetta",     emoji:"💅",color:"#7C3AED"},
  {id:"m32", label:"M32 - Anatomia e Fisiologia",    short:"M32",   ore:70,  doc:"",           emoji:"🫀",color:"#DC2626"},
  {id:"m33", label:"M33 - Trattamenti Total Look I", short:"M33",   ore:70,  doc:"perna",      emoji:"✨",color:"#D97706"},
  {id:"m34", label:"M34 - Trattamenti Viso Corpo I", short:"M34",   ore:87,  doc:"perna",      emoji:"🧴",color:"#EC4899"},
  // ─── Alternanza ────────────────────────────────────────────────────────────
  {id:"mas1",label:"MAS1 - Alternanza Simulata",     short:"MAS1",  ore:158, doc:"pluchino",   emoji:"🏫",color:"#64748B"},
];

const DEFAULT_CORSO_MATERIA_1G = {
  m25:"comune",
  m26:"meccanico",m27:"meccanico",m28:"meccanico",m29:"meccanico",
  m30:"estetica", m31:"estetica", m32:"estetica", m33:"estetica", m34:"estetica",
};

const COURSE_TRACKS_1G = {
  track1:{id:"meccanico",label:"Meccanico", short:"Mecc.",   emoji:"🔧",badge:"cb-mec",sup:"M",supColor:"#0369A1"},
  track2:{id:"estetica", label:"Estetica",  short:"Estetica",emoji:"💄",badge:"cb-est",sup:"E",supColor:"#7C3AED"},
  courseLabel:"Operatore alla riparazione dei veicoli a motore - Manutenzione e riparazione delle parti e dei sistemi meccanici ed elettromeccanici / Operatore del benessere - Erogazione dei servizi di trattamento estetico",
  courseCode:"Classe 1G &mdash; n. ore: 1056",
};
