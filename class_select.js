// ═══════════════════════════════════════════════
//  class_select.js — Selezione classe e attivazione configurazione
//
//  GARANZIA DI ISOLAMENTO DATI:
//  • La classe 1E usa App.fbPrefix = "" → tutti i nodi Firebase rimangono
//    alla radice (grades/, dimessi/, pins/, ecc.) INVARIATI rispetto alla
//    versione originale. Nessun dato 1E viene mai toccato da operazioni 1D.
//  • La classe 1D usa App.fbPrefix = "1D/" → tutti i nodi diventano
//    1D/grades/, 1D/dimessi/, 1D/pins/, ecc. → completamente separati.
//  • Le costanti globali (STUDENTS, SUBJECTS, TEACHERS, TN, TE, ecc.) vengono
//    riassegnate a runtime. Poiché data.js le dichiara come var, questo è
//    legale in JavaScript e non rompe alcuna funzione esistente che le legge
//    dinamicamente.
// ═══════════════════════════════════════════════

// ── Attivazione classe ───────────────────────────────────────────────────────
function activateClass(cfg){
  // Riassegna costanti globali swappabili (dichiarate var in data.js)
  CLASSE              = cfg.classe;
  STUDENTS            = cfg.students;
  SUBJECTS            = cfg.subjects;
  TN                  = cfg.tn;
  TE                  = cfg.te;
  DEFAULT_CORSO_MATERIA = cfg.defaultCorsoMateria;
  TUTOR_NAME          = cfg.tutorName;
  COURSE_TRACKS       = cfg.courseTracks;

  // Ricostruisce TEACHERS (array dinamico dipendente da SUBJECTS e TN)
  const m={};
  SUBJECTS.forEach(s=>{
    if(!s.doc)return;
    if(!m[s.doc])m[s.doc]={id:s.doc,label:TN[s.doc]||s.doc,initials:s.doc.slice(0,2).toUpperCase(),isAdmin:false,subjects:[]};
    m[s.doc].subjects.push(s.id);
  });
  TEACHERS = Object.values(m);

  // Aggiorna subject list degli utenti privilegiati (mutazione oggetti)
  const allSids = SUBJECTS.map(s=>s.id);
  ADMIN.subjects      = allSids;
  TUTOR.subjects      = allSids;
  TUTOR.label         = cfg.tutorName;
  SEGRETERIA.subjects = allSids;

  // Imposta prefisso Firebase e classe corrente
  App.fbPrefix      = cfg.fbPrefix || "";
  App.currentClass  = cfg.classe;
}

// ── Configurazioni delle classi ──────────────────────────────────────────────
function getClassConfig1E(){
  return {
    classe:               "1E",
    students:             STUDENTS_1E_ORIG,
    subjects:             SUBJECTS_1E_ORIG,
    tn:                   TN_1E_ORIG,
    te:                   TE_1E_ORIG,
    defaultCorsoMateria:  DEFAULT_CORSO_MATERIA_1E_ORIG,
    tutorName:            TUTOR_NAME_1E_ORIG,
    courseTracks:         COURSE_TRACKS_1E_ORIG,
    fbPrefix:             "",        // 1E: radice Firebase — INVARIATO
  };
}
function getClassConfig1D(){
  return {
    classe:               "1D",
    students:             STUDENTS_1D,
    subjects:             SUBJECTS_1D,
    tn:                   TN_1D,
    te:                   TE_1D,
    defaultCorsoMateria:  DEFAULT_CORSO_MATERIA_1D,
    tutorName:            TUTOR_NAME_1D,
    courseTracks:         COURSE_TRACKS_1D,
    fbPrefix:             "1D/",
  };
}
function getClassConfig1G(){
  return {
    classe:               "1G",
    students:             STUDENTS_1G,
    subjects:             SUBJECTS_1G,
    tn:                   TN_1G,
    te:                   TE_1G,
    defaultCorsoMateria:  DEFAULT_CORSO_MATERIA_1G,
    tutorName:            TUTOR_NAME_1G,
    courseTracks:         COURSE_TRACKS_1G,
    fbPrefix:             "1G/",
  };
}
function getClassConfig2C(){
  return {
    classe:               "2C",
    students:             STUDENTS_2C,
    subjects:             SUBJECTS_2C,
    tn:                   TN_2C,
    te:                   TE_2C,
    defaultCorsoMateria:  DEFAULT_CORSO_MATERIA_2C,
    tutorName:            TUTOR_NAME_2C,
    courseTracks:         COURSE_TRACKS_2C,
    fbPrefix:             "2C/",
  };
}
function getClassConfig2D(){
  return {
    classe:               "2D",
    students:             STUDENTS_2D,
    subjects:             SUBJECTS_2D,
    tn:                   TN_2D,
    te:                   TE_2D,
    defaultCorsoMateria:  DEFAULT_CORSO_MATERIA_2D,
    tutorName:            TUTOR_NAME_2D,
    courseTracks:         COURSE_TRACKS_2D,
    fbPrefix:             "2D/",
  };
}
function getClassConfig3F(){
  return {
    classe:               "3F",
    students:             STUDENTS_3F,
    subjects:             SUBJECTS_3F,
    tn:                   TN_3F,
    te:                   TE_3F,
    defaultCorsoMateria:  DEFAULT_CORSO_MATERIA_3F,
    tutorName:            TUTOR_NAME_3F,
    courseTracks:         COURSE_TRACKS_3F,
    fbPrefix:             "3F/",
  };
}

// ── Salva snapshot dei dati originali 1E appena data.js è caricato ──────────
// Questa funzione è chiamata IMMEDIATAMENTE dopo il caricamento di data.js
// (vedi index.html). Crea copie "congelate" dei dati 1E così che, anche dopo
// il switch a 1D, si possa sempre tornare ai dati originali 1E invariati.
function snapshotClass1E(){
  window.STUDENTS_1E_ORIG             = STUDENTS;
  window.SUBJECTS_1E_ORIG             = SUBJECTS;
  window.TN_1E_ORIG                   = TN;
  window.TE_1E_ORIG                   = TE;
  window.DEFAULT_CORSO_MATERIA_1E_ORIG = DEFAULT_CORSO_MATERIA;
  window.TUTOR_NAME_1E_ORIG           = TUTOR_NAME;
  window.COURSE_TRACKS_1E_ORIG        = COURSE_TRACKS;
}

// ── Schermata di selezione classe ────────────────────────────────────────────
function renderClassSelect(){
  // Reset stato App
  App.teacher=null; App.page="classSelect"; App.subjId=null; App.edits={};

  const classes=[
    {
      id:"1e", cfg:getClassConfig1E,
      gradient:"linear-gradient(135deg,#1B3F8B,#2563EB)",
      shadow:"rgba(37,99,235,.4)",
      emoji:"✂", anno:"1° anno",
      desc:"Estetica &amp; Acconciature",
      count:STUDENTS_1E_ORIG.length,
    },
    {
      id:"1d", cfg:getClassConfig1D,
      gradient:"linear-gradient(135deg,#0F766E,#0369A1)",
      shadow:"rgba(3,105,161,.4)",
      emoji:"🔧", anno:"1° anno",
      desc:"Meccanico &amp; Ristorazione",
      count:STUDENTS_1D.length,
    },
    {
      id:"1g", cfg:getClassConfig1G,
      gradient:"linear-gradient(135deg,#065F46,#0369A1)",
      shadow:"rgba(6,95,70,.4)",
      emoji:"⚙️", anno:"1° anno",
      desc:"Meccanico &amp; Estetica",
      count:STUDENTS_1G.length,
    },
    {
      id:"2c", cfg:getClassConfig2C,
      gradient:"linear-gradient(135deg,#7C3AED,#DB2777)",
      shadow:"rgba(124,58,237,.4)",
      emoji:"💄", anno:"2° anno",
      desc:"Acconciatura &amp; Estetica",
      count:STUDENTS_2C.length,
    },
    {
      id:"2d", cfg:getClassConfig2D,
      gradient:"linear-gradient(135deg,#9A3412,#C2410C)",
      shadow:"rgba(154,52,18,.4)",
      emoji:"🚗", anno:"2° anno",
      desc:"Meccanico",
      count:STUDENTS_2D.length,
    },
    {
      id:"3f", cfg:getClassConfig3F,
      gradient:"linear-gradient(135deg,#9D174D,#BE185D)",
      shadow:"rgba(157,23,77,.4)",
      emoji:"💇", anno:"3° anno",
      desc:"Acconciatura &amp; Estetica",
      count:STUDENTS_3F.length,
    },
  ];

  document.body.innerHTML=`
<div class="login-bg" style="min-height:100vh">
  <!-- Banner istituto -->
  <div class="credits-banner"><div class="credits-inner">
    <span class="credits-icon">🏫</span>
    <div>
      <div class="credits-title">${ISTITUTO}</div>
      <div class="credits-sub">Web app realizzata da <strong>${AUTORE}</strong></div>
    </div>
  </div></div>

  <!-- Branding -->
  <div class="login-brand">
    <img src="${LOGO}" class="login-logo" alt="" onerror="this.style.display='none'">
    <h1 class="login-title">Registro Elettronico</h1>
    <div class="class-badge" style="font-size:11px;line-height:1.5"><span>A.S. 2025/2026</span><span class="sep"> | </span><span>ERIS Formazione ETS Sede di RAGUSA Via Pier delle Vigne 17</span></div>
  <button id="btn-guida-select" style="margin-top:10px;background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.4);border-radius:10px;padding:8px 22px;font-size:12px;font-weight:700;color:white;cursor:pointer;display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(4px)">ℹ️ Guida al Registro</button>
  </div>

  <!-- Selettore classe -->
  <div class="login-card" style="max-width:440px">
    <div class="card-heading" style="text-align:center;margin-bottom:6px">📚 Seleziona la Classe</div>
    <div class="card-sub" style="text-align:center;margin-bottom:20px">Scegli il registro da aprire</div>

    <!-- Griglia classi -->
    <div style="display:flex;flex-direction:column;gap:10px">
    ${classes.map(c=>`
    <button id="btn-class-${c.id}" style="
      width:100%;display:flex;align-items:center;gap:14px;
      background:${c.gradient};
      border:none;border-radius:14px;padding:14px 18px;
      color:white;cursor:pointer;
      box-shadow:0 5px 16px ${c.shadow};
      transition:transform .15s,box-shadow .15s">
      <div style="width:46px;height:46px;background:rgba(255,255,255,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${c.emoji}</div>
      <div style="text-align:left;flex:1">
        <div style="font-size:18px;font-weight:900;letter-spacing:-.5px">Classe ${c.id.toUpperCase()}</div>
        <div style="font-size:11px;opacity:.85;margin-top:2px;line-height:1.4">${c.desc}<br>
          <span style="opacity:.7">${c.anno} · ${c.count} alunni · A.S. 2025/2026</span>
        </div>
      </div>
      <div style="font-size:20px;opacity:.8">→</div>
    </button>`).join("")}
    </div>

    <p style="text-align:center;font-size:11px;color:#94A3B8;margin-top:12px">
      I dati delle classi sono completamente separati
    </p>
  </div>
</div>
<div id="toast" class="toast"></div>`;

  const btnGuida=document.getElementById("btn-guida-select");
  if(btnGuida)btnGuida.addEventListener("click",()=>renderCredits());
  classes.forEach(c=>{
    const btn=document.getElementById("btn-class-"+c.id);
    btn.addEventListener("click",()=>{
      activateClass(c.cfg());
      renderLogin();
    });
    btn.addEventListener("mouseenter",()=>{btn.style.transform="translateY(-2px)";});
    btn.addEventListener("mouseleave",()=>{btn.style.transform="";});
  });
}
