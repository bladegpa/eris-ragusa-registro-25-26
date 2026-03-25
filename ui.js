// ═══════════════════════════════════════════════
//  ui.js — Login, Render, Admin, PIN
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
//  RENDER ENGINE
// ═══════════════════════════════════════════════
function renderPage(){
  const p=App.page;
  if(p==="login")renderLogin();
  else if(p==="grades")renderGrades();
  else if(p==="pin")renderPin();
  else if(p==="admin")renderAdmin();
  else if(App.tab==="summary")renderSummary();
  else renderHome();
}
function goBack(){
  App.edits={};
  if(App.tab==="summary"&&App.page!=="grades"&&App.page!=="pin"){App.tab="home";renderPage();return;}
  if(App.page==="grades"){App.page=isPrivileged()?"admin":"home";App.subjId=null;}
  else if(App.page==="pin"){App.page=isPrivileged()?"admin":"home";}
  renderPage();
}

// ── Blocchi HTML ────────────────────────────────
function headerHTML(title,showBack){
  return `<div class="app-header"><div class="header-inner">
    <div class="hdr-left">
      ${showBack?`<button class="btn-back" id="H-back">← Indietro</button>`:`<img src="${LOGO}" class="hdr-logo" alt="" onerror="this.style.display=\'none\'">`}
      <div><div class="hdr-title">${title}</div><div class="hdr-sub">Classe ${CLASSE} · A.S. ${ANNO}</div></div>
    </div>
    <div class="hdr-right">
      <button class="btn-hdr" id="H-pin">🔑 PIN</button>
      <button class="btn-logout" id="H-out">🚪 Esci</button>
    </div>
  </div></div>`;
}

function bannerHTML(){
  const t=App.teacher,isA=t.isAdmin,isT=!!t.isTutor,isS=!!t.isSegreteria;
  const av=isA?"linear-gradient(135deg,#DC2626,#9A3412)":isT?"linear-gradient(135deg,#059669,#0F766E)":isS?"linear-gradient(135deg,#0369A1,#0284C7)":"linear-gradient(135deg,#2563EB,#1D4ED8)";
  let badge;
  if(isA) badge={bg:"rgba(254,243,199,.9)",col:"#92400E",txt:"👑 Admin"};
  else if(isT) badge={bg:"rgba(209,250,229,.9)",col:"#065F46",txt:"👁 Tutor"};
  else if(isS) badge={bg:"rgba(224,242,254,.9)",col:"#0369A1",txt:"🗂 Segret."};
  else badge={bg:"rgba(209,250,229,.9)",col:"#059669",txt:"🔄 Live"};
  const sub=isPrivileged()?"Accesso completo — tutte le materie":SUBJECTS.filter(s=>mySubjects().includes(s.id)&&!s.conductaOnly).map(s=>s.short).join(" ");
  const nameLabel=isA?"AMMINISTRATORE":isT?"TUTOR — "+t.label.toUpperCase():isS?"SEGRETERIA":"PROF. "+t.label.toUpperCase();
  return `<div class="teacher-banner">
    <div class="t-avatar" style="background:${av}">${t.initials}</div>
    <div class="t-info">
      <div class="t-name">${nameLabel}</div>
      <div class="t-subj">${sub}</div>
    </div>
    <div class="sync-badge" style="background:${badge.bg};color:${badge.col}">${badge.txt}</div>
  </div>`;
}

function corsoBadge(c){
  const t1=COURSE_TRACKS.track1,t2=COURSE_TRACKS.track2;
  if(c===t1.id)return`<span class="corso-badge ${t1.badge}">${t1.emoji} ${t1.short}</span>`;
  if(t2.id&&c===t2.id)return`<span class="corso-badge ${t2.badge}">${t2.emoji} ${t2.short}</span>`;
  if(c==="comune")return`<span class="corso-badge cb-com">⭐ Comune</span>`;
  return`<span class="corso-badge cb-none">— Non assegnato</span>`;
}

function attachHeader(showBack){
  if(showBack){const b=$("#H-back");if(b)b.addEventListener("click",goBack);}
  const bp=$("#H-pin");if(bp)bp.addEventListener("click",()=>{App.page="pin";renderPin();});
  const bl=$("#H-out");if(bl)bl.addEventListener("click",doLogout);
}
function attachNav(){
  const h=$("#N-home"),s=$("#N-summ");
  if(h)h.addEventListener("click",()=>{App.tab="home";renderHome();});
  if(s)s.addEventListener("click",()=>{App.tab="summary";renderSummary();});
}

function bottomNavHTML(active){
  return `<nav class="bottom-nav">
    <button class="nav-btn${active==="home"?" on":""}" id="N-home"><span class="nav-ico">✏️</span><span>I miei voti</span></button>
    <button class="nav-btn${active==="summary"?" on":""}" id="N-summ"><span class="nav-ico">📊</span><span>Riepilogo</span></button>
  </nav>`;
}

function makeSummaryTable(cols,studentsToShow,showCond,mediaCols){
  const sts=studentsToShow||activeStudents();
  const showCondotta=showCond!==undefined?showCond:isPrivileged();
  const subjCols=cols.filter(s=>!s.conductaOnly);
  const mCols=mediaCols?mediaCols.filter(s=>!s.conductaOnly):subjCols;
  const condS=SUBJECTS.find(s=>s.id==="condotta");
  return `<div class="tbl-wrap"><table class="sum-tbl">
    <thead>
      <tr>
        <th class="th-name">Alunno</th>
        ${subjCols.map(s=>{
          const dn=docNameOf(s.id);
          return`<th style="color:${s.color}" title="${s.label}${dn?" — "+dn:""}">
          <span class="th-short">${s.short}</span>
          <span class="th-full">${s.label.replace(/^[A-Za-z0-9]+ - /,"")}</span>
          ${dn?`<span style="display:block;font-size:8px;color:#94A3B8;font-weight:500;margin-top:1px;white-space:normal;line-height:1.2">${dn}</span>`:""}
        </th>`;}).join("")}
        <th class="th-ma">📊<br><span style="font-size:9px;font-weight:700">M.A.</span></th>
        <th class="th-mp">⚖️<br><span style="font-size:9px;font-weight:700">M.P.</span></th>
        ${showCondotta&&condS?`<th class="th-cond">${condS.emoji}<br><span style="font-size:9px;font-weight:700">Cond.</span></th>`:""}
        <th class="th-vf" title="Media Ponderata arrotondata secondo voto di condotta">🏆<br><span style="font-size:9px;font-weight:700">Voto<br>Finale</span></th>
      </tr>
    </thead>
    <tbody>
      ${sts.map(st=>{
        const i=STUDENTS.indexOf(st);
        const ma=calcMedia(i,mCols),mp=calcMP(i,mCols);
        const maS=ma!==null?ma.toFixed(1):"—",mpS=mp!==null?mp.toFixed(1):"—";
        const maC=ma!==null?gradeColor(ma):"#CBD5E1",mpC=mp!==null?gradeColor(mp):"#CBD5E1";
        const condE=condS?App.grades["condotta"]?.[i]:null;
        const vf=calcVotoFinale(i,mCols);
        const vfC=vf!==null?gradeColor(vf):"#CBD5E1";
        const vfBg=vf!==null?gradeBg(vf):"transparent";
        return`<tr>
          <td class="td-name">${fmtName(st.name)}<br><span style="font-size:9px;color:#94A3B8">${corsoBadge(corsS(i)).replace(/<[^>]+>/g,"").trim()}</span></td>
          ${subjCols.map(s=>{
            if(!studentHasSubject(i,s.id))return`<td class="td-na">N/A</td>`;
            const e=App.grades[s.id]?.[i];
            return e?`<td style="font-weight:800;color:${gradeColor(e.value)};background:${gradeBg(e.value)}33">${e.value}</td>`:`<td style="color:#CBD5E1">—</td>`;
          }).join("")}
          <td class="td-ma" style="color:${maC}">${maS}</td>
          <td class="td-mp" style="color:${mpC}">${mpS}</td>
          ${showCondotta&&condS?(condE?`<td class="td-cond" style="color:${gradeColor(condE.value)};background:${gradeBg(condE.value)}33;font-weight:800">${condE.value}</td>`:`<td class="td-cond" style="color:#CBD5E1">—</td>`):""}
          ${vf!==null?`<td class="td-vf" style="color:${vfC};background:${vfBg}55">${vf}</td>`:`<td class="td-vf" style="color:#CBD5E1">—</td>`}
        </tr>`;
      }).join("")}
    </tbody>
  </table></div>`;
}

// ═══════════════════════════════════════════════
//  GRIGLIA DI VALUTAZIONE — STAMPA A4 LANDSCAPE
// ═══════════════════════════════════════════════
function exportGridHtml(){
  toast("⏳ Generazione griglia in corso...","info");
  try{
    const html=buildGridHtml();
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const win=window.open(url,"_blank");
    if(!win){
      downloadBlob(blob,"Griglia_"+CLASSE+"_"+ANNO.replace("/","-")+".html");
      toast("📥 File scaricato — aprilo nel browser per stampare","info");
    }else{
      setTimeout(()=>URL.revokeObjectURL(url),8000);
    }
  }catch(e){console.error(e);toast("❌ Errore: "+e.message,"err");}
}

function exportGridHtmlCols(cols){
  toast("⏳ Generazione griglia in corso...","info");
  try{
    const html=buildGridHtml(cols);
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const win=window.open(url,"_blank");
    if(!win){
      downloadBlob(blob,"Griglia_"+CLASSE+"_"+ANNO.replace("/","-")+".html");
      toast("📥 File scaricato — aprilo nel browser per stampare","info");
    }else{
      setTimeout(()=>URL.revokeObjectURL(url),8000);
    }
  }catch(e){console.error(e);toast("❌ Errore: "+e.message,"err");}
}

function buildGridHtml(colsOverride){
  const isPartial=!!(colsOverride&&colsOverride.length>0);
  const showAmmDim=!isPartial;
  const gradeFs="8pt";
  const subjCols=(isPartial?colsOverride:SUBJECTS).filter(s=>!s.conductaOnly);
  const condS=SUBJECTS.find(s=>s.id==="condotta");
  const allCols=[...subjCols,condS].filter(Boolean);

  // ── helpers ──────────────────────────────────────────────────────────────
  const gColor=v=>{if(!v)return"#94A3B8";const n=parseFloat(String(v).replace(",","."));if(isNaN(n))return"#3B82F6";if(n<6)return"#DC2626";if(n<7)return"#B45309";if(n<9)return"#D97706";return"#059669";};
  const gBg=v=>{if(!v)return"transparent";const n=parseFloat(String(v).replace(",","."));if(isNaN(n))return"#EFF6FF";if(n<6)return"#FEF2F2";if(n<7)return"#FEFCE8";if(n<9)return"#FFFBEB";return"#ECFDF5";};
  const fmtN=s=>s.split(" ").map(w=>w.charAt(0)+w.slice(1).toLowerCase()).join(" ");
  const cleanLabel=l=>l.replace(/^[A-Za-z0-9]+[Eeb\d]* - /,"");
  // "AZZARELLI GIAMPIERO" → "AZZARELLI G."  |  "CIACERA MACAUDA GIUSY" → "CIACERA MACAUDA G."
  const fmtDocShort=full=>{
    if(!full)return"";
    const parts=full.trim().split(/\s+/);
    if(parts.length===1)return parts[0].charAt(0)+".";
    const surname=parts.slice(0,-1).join(" ");
    const nameInit=parts[parts.length-1].charAt(0)+".";
    return surname+" "+nameInit;
  };

  // ── Snapshot dati correnti (calcolati nel contesto app) ───────────────────
  const rowsData=STUDENTS.map((st,i)=>{
    const dim=!!App.dimessi[i];
    const tr=!!App.trasferiti[i];
    const cs=corsS(i);
    const grades={};
    allCols.forEach(s=>{const e=App.grades[s.id]?.[i];if(e)grades[s.id]=e.value;});

    let ma=null,mp=null,vf=null;
    if(!dim&&!tr){
      const sv=subjCols.map(s=>{
        if(!studentHasSubject(i,s.id))return null;
        const e=App.grades[s.id]?.[i];if(!e)return null;
        const n=parseFloat(String(e.value).replace(",","."));
        return isNaN(n)?null:{n,ore:s.ore};
      }).filter(Boolean);
      if(sv.length){
        ma=sv.reduce((a,b)=>a+b.n,0)/sv.length;
        const sw=sv.reduce((a,b)=>a+b.ore,0);
        if(sw>0)mp=sv.reduce((a,b)=>a+b.n*b.ore,0)/sw;
      }
      if(mp!==null){
        const ce=App.grades["condotta"]?.[i];
        const cond=ce?parseFloat(String(ce.value).replace(",",".")):null;
        vf=(cond!==null&&!isNaN(cond)&&cond<=8)?Math.floor(mp):Math.round(mp);
      }
    }
    return{st,i,dim,tr,cs,grades,ma,mp,vf};
  });

  // ── Teacher snapshot ───────────────────────────────────────────────────────
  const teacherOf=sid=>docFullOf(sid)||"";
  const dimCount=rowsData.filter(r=>r.dim).length;
  const trasCount=rowsData.filter(r=>r.tr).length;
  const activeCount=rowsData.length-dimCount-trasCount;

  // ── Build table header ─────────────────────────────────────────────────────
  const thSubj=allCols.map(s=>{
    const isCond=!!s.conductaOnly;
    const bg=isCond?"#F5F3FF":"#FFFFFF";
    const borderCol=isCond?"#C4B5FD":"#CBD5E1";
    const textCol=isCond?"#5B21B6":"#0F172A";
    return`<th style="background:${bg};border:0.4pt solid ${borderCol};padding:0;width:5.5mm;height:26mm;vertical-align:bottom">
      <div style="writing-mode:vertical-rl;transform:rotate(180deg);display:flex;flex-direction:column;align-items:flex-start;padding:1mm 1.5mm 1mm 0.5mm;height:25mm;gap:0.5px">
        <span style="font-size:5.5pt;font-weight:900;color:${textCol};white-space:nowrap">${s.short}</span>
        <span style="font-size:5.5pt;font-weight:600;color:${textCol};white-space:nowrap;overflow:hidden;max-height:18mm">${cleanLabel(s.label)}</span>
      </div>
    </th>`;
  }).join("");

  const thMA=`<th style="background:#1E3A5F;border:0.4pt solid #0F2040;padding:0;width:9mm;height:26mm;vertical-align:bottom"><div style="writing-mode:vertical-rl;transform:rotate(180deg);display:flex;flex-direction:column;align-items:flex-start;padding:1mm 1.5mm 1mm 0.5mm;height:25mm"><span style="font-size:5.5pt;font-weight:800;color:#93C5FD;white-space:nowrap">M.A.</span><span style="font-size:4.5pt;color:rgba(255,255,255,.82);white-space:nowrap">Media Aritmetica</span></div></th>`;
  const thMP=`<th style="background:#78350F;border:0.4pt solid #0F2040;padding:0;width:9mm;height:26mm;vertical-align:bottom"><div style="writing-mode:vertical-rl;transform:rotate(180deg);display:flex;flex-direction:column;align-items:flex-start;padding:1mm 1.5mm 1mm 0.5mm;height:25mm"><span style="font-size:5.5pt;font-weight:800;color:#FCD34D;white-space:nowrap">M.P.</span><span style="font-size:4.5pt;color:rgba(255,255,255,.82);white-space:nowrap">Media Ponderata</span></div></th>`;
  const thVF=`<th style="background:#0F2557;border:0.4pt solid #0F2040;border-left:1.5pt solid #3B82F6;padding:0;width:9mm;height:26mm;vertical-align:bottom"><div style="writing-mode:vertical-rl;transform:rotate(180deg);display:flex;flex-direction:column;align-items:flex-start;padding:1mm 1.5mm 1mm 0.5mm;height:25mm"><span style="font-size:6pt;font-weight:800;color:#FDE68A;white-space:nowrap">V.F.</span><span style="font-size:4.5pt;color:rgba(255,255,255,.9);white-space:nowrap">Voto Finale</span></div></th>`;

  // ── ORE row ────────────────────────────────────────────────────────────────
  const oreRow=`<tr style="background:#E8EDF5">
    <td style="border:0.4pt solid #CBD5E1;font-size:4.5pt;font-style:italic;color:#475569;text-align:center"></td>
    <td style="border:0.4pt solid #CBD5E1;font-size:5pt;font-weight:700;font-style:italic;color:#1B3F8B;padding-left:1.5mm">ORE h</td>
    ${showAmmDim?`<td style="border:0.4pt solid #CBD5E1"></td><td style="border:0.4pt solid #CBD5E1"></td>`:""}
    ${allCols.map(s=>`<td style="border:0.4pt solid #CBD5E1;font-size:4.5pt;color:#64748B;text-align:center;font-style:italic">${s.ore>0?s.ore:"—"}</td>`).join("")}
    ${showAmmDim?`<td style="border:0.4pt solid #CBD5E1;background:#DBEAFE"></td>
    <td style="border:0.4pt solid #CBD5E1;background:#FEF9C3"></td>
    <td style="border:0.4pt solid #CBD5E1;border-left:1.5pt solid #3B82F6;background:#EEF2FF"></td>`:""}
  </tr>`;

  // ── Student rows ──────────────────────────────────────────────────────────
  const studentRows=rowsData.map(({st,i,dim,tr,cs,grades,ma,mp,vf},ri)=>{
    const inactive=dim||tr;
    const rowBg=dim?"#F1F5F9":tr?"#FFF7ED":ri%2===0?"#FFFFFF":"#F8FAFC";
    const nameSt=dim?`text-decoration:line-through;color:#94A3B8`:tr?`font-weight:600;color:#C2410C`:`font-weight:600;color:#0F172A`;
    const csBadge=!inactive?(cs===COURSE_TRACKS.track1.id?`<sup style="font-size:4pt;color:${COURSE_TRACKS.track1.supColor};font-weight:700"> ${COURSE_TRACKS.track1.sup}</sup>`:(COURSE_TRACKS.track2.id&&cs===COURSE_TRACKS.track2.id)?`<sup style="font-size:4pt;color:${COURSE_TRACKS.track2.supColor};font-weight:700"> ${COURSE_TRACKS.track2.sup}</sup>`:""):"";

    const gradeCells=allCols.map(s=>{
      if(dim)return`<td style="border:0.4pt solid #D4D8E2;background:#FEF2F2;text-align:center;font-weight:700;font-size:5.5pt;color:#EF4444">DIM.</td>`;
      if(tr)return`<td style="border:0.4pt solid #FED7AA;background:#FFF7ED;text-align:center;font-weight:700;font-size:4.5pt;color:#EA580C">TRANSF.</td>`;
      if(!studentHasSubject(i,s.id))return`<td style="border:0.4pt solid #D4D8E2;background:#E4EAF2;text-align:center;font-size:4.5pt;color:#94A3B8">N/A</td>`;
      const v=grades[s.id];
      if(!v)return`<td style="border:0.4pt solid #D4D8E2;background:${rowBg};text-align:center;color:#CBD5E1;font-size:5.5pt">—</td>`;
      return`<td style="border:0.4pt solid #D4D8E2;background:${gBg(v)};text-align:center;font-weight:700;font-size:${gradeFs};color:#0F172A">${v}</td>`;
    }).join("");

    const dimD=getDimDate(i);
    const trasD=getTrasDate(i);
    const ammD=getAmmDate(i);

    const maS=ma!==null?(Math.round(ma*10)/10).toFixed(1):"—";
    const mpS=mp!==null?(Math.round(mp*10)/10).toFixed(1):"—";
    const maC=ma!==null?gColor(ma):"#CBD5E1";
    const mpC=mp!==null?gColor(mp):"#CBD5E1";
    const vfC=vf!==null?gColor(vf):"#CBD5E1";
    const vfBg=vf!==null?gBg(vf):"transparent";

    return`<tr style="background:${rowBg}">
      <td style="border:0.4pt solid #D4D8E2;text-align:center;font-weight:700;font-size:5.5pt;color:${dim?"#94A3B8":tr?"#EA580C":"#475569"};background:${dim?"#F1F5F9":tr?"#FFF7ED":"#EEF2F7"}">${st.num}</td>
      <td style="border:0.4pt solid #D4D8E2;font-size:5.5pt;${nameSt};background:${dim?"#F1F5F9":tr?"#FFF7ED":"#EEF2F7"};padding:0.3mm 1mm">${fmtN(st.name)}${csBadge}</td>
      ${showAmmDim?`<td style="border:0.4pt solid #D4D8E2;font-size:4.5pt;text-align:center;color:#0F172A;font-weight:600">${ammD}</td><td style="border:0.4pt solid #D4D8E2;font-size:4.5pt;text-align:center;font-weight:700;color:${tr?"#EA580C":"#EF4444"};line-height:1.2">${dim?(dimD||"DIM."):tr?(trasD||"TRANSF."):""}</td>`:""}
      ${gradeCells}
      ${showAmmDim?`<td style="border:0.4pt solid #CBD5E1;text-align:center;font-weight:700;font-size:5.5pt;color:#0F172A;background:#DBEAFE">${maS}</td>
      <td style="border:0.4pt solid #CBD5E1;text-align:center;font-weight:700;font-size:5.5pt;color:#0F172A;background:#FEF9C3">${mpS}</td>
      <td style="border:0.4pt solid #CBD5E1;border-left:1.5pt solid #3B82F6;text-align:center;font-weight:800;font-size:8pt;color:#0F172A;background:${vfBg}">${vf!==null?vf:"—"}</td>`:""}
    </tr>`;
  }).join("");

  // ── Teacher row ───────────────────────────────────────────────────────────
  const teacherCells=allCols.map(s=>{
    const tf=fmtDocShort(teacherOf(s.id));
    return`<td style="background:#E8EDF5;border:0.4pt solid #CBD5E1;padding:0;height:18mm;vertical-align:bottom">
      <div style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:5.5pt;font-weight:700;color:#0F172A;white-space:nowrap;overflow:hidden;max-height:17mm;padding:0.5mm 1.5mm 0.5mm 0.5mm;display:block">${tf}</div>
    </td>`;
  }).join("");

  // ── Course info (from COURSE_TRACKS per-class config) ─────────────────────
  const COURSE_LABEL=COURSE_TRACKS.courseLabel;
  const COURSE_CODE=COURSE_TRACKS.courseCode;

  // ── Build final HTML ────────────────────────────────────────────────────────
  return`<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Griglia di Valutazione — Classe ${CLASSE} — A.S. ${ANNO}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 landscape;margin:4mm 5mm}
html,body{font-family:Arial,sans-serif;font-size:6pt;color:#000;background:#ccc}
@media print{html,body{background:white}.bar{display:none!important}.pg{margin:0!important;box-shadow:none!important}}
.bar{background:#1B3F8B;color:white;padding:8px 18px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.bar h1{font-size:12px;font-weight:700}
.bar p{font-size:10px;opacity:.8;margin-top:2px}
.btnp{background:#059669;color:white;border:none;border-radius:6px;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer}
.pg{width:287mm;margin:10px auto;background:white;box-shadow:0 2px 12px rgba(0,0,0,.3)}
table{width:100%;border-collapse:collapse;table-layout:fixed}
</style>
</head>
<body>
<div class="bar">
  <div><h1>📊 Griglia di Valutazione — Classe ${CLASSE} — A.S. ${ANNO}</h1>
  <p>${ISTITUTO} &middot; ${activeCount} allievi attivi &middot; ${dimCount} dimessi &middot; ${trasCount} trasferiti &middot; ${allCols.length} materie</p></div>
  <button class="btnp" onclick="window.print()">🖨️&nbsp;Stampa / Salva PDF</button>
</div>
<div class="pg" id="pg">

<!-- ═══ HEADER ════════════════════════════════════ -->
<div style="display:flex;align-items:center;border-bottom:2pt solid #003087;padding:2mm 3mm;gap:4mm">
  <img src="${LOGO}" alt="Logo" style="height:11mm;width:auto;object-fit:contain;object-position:left">
  <div style="flex:1">
    <div style="font-size:8pt;font-weight:700;color:#003087">${ISTITUTO}</div>
    <div style="font-size:5pt;color:#333;margin-top:1px;line-height:1.5">${COURSE_LABEL} &nbsp;|&nbsp; ${COURSE_CODE}</div>
  </div>
  <div style="text-align:right;flex-shrink:0">
    <div style="font-size:8.5pt;font-weight:800;color:#003087">Classe ${CLASSE} &mdash; A.S. ${ANNO}</div>
    <div style="font-size:5.5pt;color:#475569;margin-top:1px">GRIGLIA DI VALUTAZIONE</div>
  </div>
</div>

<!-- ═══ TABLE ════════════════════════════════════ -->
<div style="overflow:hidden">
<table>
<thead>
<tr>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 0.5mm;font-size:5pt;text-align:center;width:6mm;vertical-align:bottom">N.</th>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 1.5mm;font-size:5.5pt;text-align:left;width:28mm;vertical-align:bottom">NOMINATIVO ALLIEVI</th>
  ${showAmmDim?`<th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 0.5mm;font-size:4.5pt;text-align:center;width:8mm;vertical-align:bottom">AMM.</th>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 0.5mm;font-size:4.5pt;text-align:center;width:8mm;vertical-align:bottom">DIM.</th>`:""}
  ${thSubj}
  ${showAmmDim?`${thMA}${thMP}${thVF}`:""}
</tr>
</thead>
<tbody>
  ${oreRow}
  ${studentRows}
  <tr>
    <td colspan="2" style="background:#0F2557;border:0.4pt solid #1E3A5F;font-size:5pt;font-weight:700;color:#FDE68A;text-align:center;padding:1mm">DOCENTI</td>
    ${showAmmDim?`<td style="background:#0F2557;border:0.4pt solid #1E3A5F"></td><td style="background:#0F2557;border:0.4pt solid #1E3A5F"></td>`:""}
    ${teacherCells}
    ${showAmmDim?`<td style="background:#1E3A5F;border:0.4pt solid #1E3A5F"></td>
    <td style="background:#78350F;border:0.4pt solid #1E3A5F"></td>
    <td style="background:#0F2557;border:0.4pt solid #1E3A5F;border-left:1.5pt solid #3B82F6"></td>`:""}
  </tr>
</tbody>
</table>
</div>

<!-- ═══ LEGEND + FOOTER ════════════════════════════════════ -->
<div style="display:flex;align-items:center;justify-content:space-between;padding:1mm 3mm;border-top:0.5pt solid #E2E8F0">
  <div style="display:flex;gap:4mm;align-items:center;font-size:4.5pt">
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#DC2626;border-radius:1px;display:inline-block"></span>&lt; 6</span>
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#B45309;border-radius:1px;display:inline-block"></span>6</span>
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#D97706;border-radius:1px;display:inline-block"></span>7&ndash;8</span>
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#059669;border-radius:1px;display:inline-block"></span>9&ndash;10</span>
    <span style="color:#94A3B8">N/A = materia non del corso &nbsp;|&nbsp; <sup>${COURSE_TRACKS.track1.sup}</sup> = ${COURSE_TRACKS.track1.label}${COURSE_TRACKS.track2.id?` &nbsp;|&nbsp; <sup>${COURSE_TRACKS.track2.sup}</sup> = ${COURSE_TRACKS.track2.label}`:""}</span>
  </div>
</div>
<div style="border-top:1.5pt solid #003087;padding:1.5mm 3mm;display:flex;align-items:center;gap:3mm">
  <div style="flex:1;text-align:center;font-size:3.5pt;line-height:1.4;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
    <b>ERIS ENTE DEL TERZO SETTORE</b> &nbsp;&mdash;&nbsp; Sede legale: via Salvatore Paola, 14/a &ndash; 95125 Catania | tel./fax: 095433940 | didattica.ct@erisformazione.it | amministrazione.ct@erisformazione.it | Associazione riconosciuta, iscrizione n&deg;&nbsp;293979 C.C.I.A.A. di Catania | CF: 97180200822 | info@pec.erisformazione.it | www.erisformazione.it
  </div>
</div>

</div><!-- /pg -->

${(!isPartial?(()=>{
  // ── GRIGLIA DIVISA SU 2 PAGINE (solo griglia completa, non docenti) ───────
  const half=Math.ceil(subjCols.length/2);
  const colsA=subjCols.slice(0,half);
  const colsB=subjCols.slice(half);

  // showSummary=true solo sulla pagina 2 (seconda metà materie)
  const buildSplitPage=(pageCols,pageNum,showSummary)=>{
    const pageLabel=`Pagina ${pageNum}/2 — Materie ${pageCols[0].short}…${pageCols[pageCols.length-1].short}`;

    const thS=pageCols.map(s=>{
      const isCond=!!s.conductaOnly;
      const bg=isCond?"#F5F3FF":"#FFFFFF";
      const borderCol=isCond?"#C4B5FD":"#CBD5E1";
      const textCol=isCond?"#5B21B6":"#0F172A";
      return`<th style="background:${bg};border:0.4pt solid ${borderCol};padding:0;width:5.5mm;height:26mm;vertical-align:bottom">
        <div style="writing-mode:vertical-rl;transform:rotate(180deg);display:flex;flex-direction:column;align-items:flex-start;padding:1mm 1.5mm 1mm 0.5mm;height:25mm;gap:0.5px">
          <span style="font-size:5.5pt;font-weight:900;color:${textCol};white-space:nowrap">${s.short}</span>
          <span style="font-size:5.5pt;font-weight:600;color:${textCol};white-space:nowrap;overflow:hidden;max-height:18mm">${cleanLabel(s.label)}</span>
        </div>
      </th>`;
    }).join("");

    const oreS=`<tr style="background:#E8EDF5">
      <td style="border:0.4pt solid #CBD5E1;font-size:4.5pt;font-style:italic;color:#475569;text-align:center"></td>
      <td style="border:0.4pt solid #CBD5E1;font-size:5pt;font-weight:700;font-style:italic;color:#1B3F8B;padding-left:1.5mm">ORE h</td>
      <td style="border:0.4pt solid #CBD5E1"></td>
      <td style="border:0.4pt solid #CBD5E1"></td>
      ${pageCols.map(s=>`<td style="border:0.4pt solid #CBD5E1;font-size:4.5pt;color:#64748B;text-align:center;font-style:italic">${s.ore>0?s.ore:"—"}</td>`).join("")}
      ${showSummary?`
      <td style="border:0.4pt solid #CBD5E1;background:#DBEAFE"></td>
      <td style="border:0.4pt solid #CBD5E1;background:#FEF9C3"></td>
      <td style="border:0.4pt solid #CBD5E1;border-left:1.5pt solid #3B82F6;background:#EEF2FF"></td>`:""}
    </tr>`;

    const rowsS=rowsData.map(({st,i,dim,tr,cs,grades,ma,mp,vf},ri)=>{
      const inactive=dim||tr;
      const rowBg=dim?"#F1F5F9":tr?"#FFF7ED":ri%2===0?"#FFFFFF":"#F8FAFC";
      const nameSt=dim?`text-decoration:line-through;color:#94A3B8`:tr?`font-weight:600;color:#C2410C`:`font-weight:600;color:#0F172A`;
      const csBadge=!inactive?(cs===COURSE_TRACKS.track1.id?`<sup style="font-size:4pt;color:${COURSE_TRACKS.track1.supColor};font-weight:700"> ${COURSE_TRACKS.track1.sup}</sup>`:(COURSE_TRACKS.track2.id&&cs===COURSE_TRACKS.track2.id)?`<sup style="font-size:4pt;color:${COURSE_TRACKS.track2.supColor};font-weight:700"> ${COURSE_TRACKS.track2.sup}</sup>`:""):"";
      const cells=pageCols.map(s=>{
        if(dim)return`<td style="border:0.4pt solid #D4D8E2;background:#FEF2F2;text-align:center;font-weight:700;font-size:5.5pt;color:#EF4444">DIM.</td>`;
        if(tr)return`<td style="border:0.4pt solid #FED7AA;background:#FFF7ED;text-align:center;font-weight:700;font-size:4.5pt;color:#EA580C">TRANSF.</td>`;
        if(!studentHasSubject(i,s.id))return`<td style="border:0.4pt solid #D4D8E2;background:#E4EAF2;text-align:center;font-size:4.5pt;color:#94A3B8">N/A</td>`;
        const v=grades[s.id];
        if(!v)return`<td style="border:0.4pt solid #D4D8E2;background:${rowBg};text-align:center;color:#CBD5E1;font-size:5.5pt">—</td>`;
        return`<td style="border:0.4pt solid #D4D8E2;background:${gBg(v)};text-align:center;font-weight:700;font-size:${gradeFs};color:#0F172A">${v}</td>`;
      }).join("");
      const dimD=getDimDate(i);
      const trasD=getTrasDate(i);
      const ammD=getAmmDate(i);
      const summaryCells=showSummary?(()=>{
        const maS=ma!==null?(Math.round(ma*10)/10).toFixed(1):"—";
        const mpS=mp!==null?(Math.round(mp*10)/10).toFixed(1):"—";
        const maC=ma!==null?gColor(ma):"#CBD5E1";
        const mpC=mp!==null?gColor(mp):"#CBD5E1";
        const vfC=vf!==null?gColor(vf):"#CBD5E1";
        const vfBg=vf!==null?gBg(vf):"transparent";
        return`<td style="border:0.4pt solid #CBD5E1;text-align:center;font-weight:700;font-size:5.5pt;color:#0F172A;background:#DBEAFE">${maS}</td>
        <td style="border:0.4pt solid #CBD5E1;text-align:center;font-weight:700;font-size:5.5pt;color:#0F172A;background:#FEF9C3">${mpS}</td>
        <td style="border:0.4pt solid #CBD5E1;border-left:1.5pt solid #3B82F6;text-align:center;font-weight:800;font-size:8pt;color:#0F172A;background:${vfBg}">${vf!==null?vf:"—"}</td>`;
      })():"";
      return`<tr style="background:${rowBg}">
        <td style="border:0.4pt solid #D4D8E2;text-align:center;font-weight:700;font-size:5.5pt;color:${dim?"#94A3B8":tr?"#EA580C":"#475569"};background:${dim?"#F1F5F9":tr?"#FFF7ED":"#EEF2F7"}">${st.num}</td>
        <td style="border:0.4pt solid #D4D8E2;font-size:5.5pt;${nameSt};background:${dim?"#F1F5F9":tr?"#FFF7ED":"#EEF2F7"};padding:0.3mm 1mm">${fmtN(st.name)}${csBadge}</td>
        <td style="border:0.4pt solid #D4D8E2;font-size:4.5pt;text-align:center;color:#0F172A;font-weight:600">${ammD}</td>
        <td style="border:0.4pt solid #D4D8E2;font-size:4.5pt;text-align:center;font-weight:700;color:${tr?"#EA580C":"#EF4444"};line-height:1.2">${dim?(dimD||"DIM."):tr?(trasD||"TRANSF."):""}</td>
        ${cells}
        ${summaryCells}
      </tr>`;
    }).join("");

    const teacherS=pageCols.map(s=>{
      const tf=fmtDocShort(teacherOf(s.id));
      return`<td style="background:#E8EDF5;border:0.4pt solid #CBD5E1;padding:0;height:18mm;vertical-align:bottom">
        <div style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:5.5pt;font-weight:700;color:#0F172A;white-space:nowrap;overflow:hidden;max-height:17mm;padding:0.5mm 1.5mm 0.5mm 0.5mm;display:block">${tf}</div>
      </td>`;
    }).join("");

    const legendNote=showSummary
      ?`N/A = materia non del corso &nbsp;|&nbsp; <sup>${COURSE_TRACKS.track1.sup}</sup> = ${COURSE_TRACKS.track1.label}${COURSE_TRACKS.track2.id?` &nbsp;|&nbsp; <sup>${COURSE_TRACKS.track2.sup}</sup> = ${COURSE_TRACKS.track2.label}`:""} &nbsp;|&nbsp; M.A. = Media Aritm. &nbsp;|&nbsp; M.P. = Media Pond. &nbsp;|&nbsp; V.F. = Voto Finale`
      :`N/A = materia non del corso &nbsp;|&nbsp; <sup>${COURSE_TRACKS.track1.sup}</sup> = ${COURSE_TRACKS.track1.label}${COURSE_TRACKS.track2.id?` &nbsp;|&nbsp; <sup>${COURSE_TRACKS.track2.sup}</sup> = ${COURSE_TRACKS.track2.label}`:""}`;

    return`<div class="pg pg-split" id="pg-split-${pageNum}" style="page-break-before:always">
<div style="display:flex;align-items:center;border-bottom:2pt solid #003087;padding:2mm 3mm;gap:4mm">
  <img src="${LOGO}" alt="Logo" style="height:11mm;width:auto;object-fit:contain;object-position:left">
  <div style="flex:1">
    <div style="font-size:8pt;font-weight:700;color:#003087">${ISTITUTO}</div>
    <div style="font-size:5pt;color:#333;margin-top:1px;line-height:1.5">${COURSE_LABEL} &nbsp;|&nbsp; ${COURSE_CODE}</div>
  </div>
  <div style="text-align:right;flex-shrink:0">
    <div style="font-size:8.5pt;font-weight:800;color:#003087">Classe ${CLASSE} &mdash; A.S. ${ANNO}</div>
    <div style="font-size:5.5pt;color:#475569;margin-top:1px">GRIGLIA DIVISA &mdash; ${pageLabel}</div>
  </div>
</div>
<div style="overflow:hidden">
<table>
<thead>
<tr>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 0.5mm;font-size:5pt;text-align:center;width:6mm;vertical-align:bottom">N.</th>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 1.5mm;font-size:5.5pt;text-align:left;width:28mm;vertical-align:bottom">NOMINATIVO ALLIEVI</th>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 0.5mm;font-size:4.5pt;text-align:center;width:8mm;vertical-align:bottom">AMM.</th>
  <th style="background:#0F2557;color:white;border:0.4pt solid #0F2040;padding:1mm 0.5mm;font-size:4.5pt;text-align:center;width:8mm;vertical-align:bottom">DIM.</th>
  ${thS}
  ${showSummary?`${thMA}${thMP}${thVF}`:""}
</tr>
</thead>
<tbody>
  ${oreS}
  ${rowsS}
  <tr>
    <td colspan="2" style="background:#0F2557;border:0.4pt solid #1E3A5F;font-size:5pt;font-weight:700;color:#FDE68A;text-align:center;padding:1mm">DOCENTI</td>
    <td style="background:#0F2557;border:0.4pt solid #1E3A5F"></td>
    <td style="background:#0F2557;border:0.4pt solid #1E3A5F"></td>
    ${teacherS}
    ${showSummary?`
    <td style="background:#1E3A5F;border:0.4pt solid #1E3A5F"></td>
    <td style="background:#78350F;border:0.4pt solid #1E3A5F"></td>
    <td style="background:#0F2557;border:0.4pt solid #1E3A5F;border-left:1.5pt solid #3B82F6"></td>`:""}
  </tr>
</tbody>
</table>
</div>
<div style="display:flex;align-items:center;justify-content:space-between;padding:1mm 3mm;border-top:0.5pt solid #E2E8F0">
  <div style="display:flex;gap:4mm;align-items:center;font-size:4.5pt">
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#DC2626;border-radius:1px;display:inline-block"></span>&lt; 6</span>
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#B45309;border-radius:1px;display:inline-block"></span>6</span>
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#D97706;border-radius:1px;display:inline-block"></span>7&ndash;8</span>
    <span style="display:inline-flex;align-items:center;gap:1mm"><span style="width:5px;height:5px;background:#059669;border-radius:1px;display:inline-block"></span>9&ndash;10</span>
    <span style="color:#94A3B8">${legendNote}</span>
  </div>
</div>
<div style="border-top:1.5pt solid #003087;padding:1.5mm 3mm;display:flex;align-items:center;gap:3mm">
  <div style="flex:1;text-align:center;font-size:3.5pt;line-height:1.4;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
    <b>ERIS ENTE DEL TERZO SETTORE</b> &nbsp;&mdash;&nbsp; Sede legale: via Salvatore Paola, 14/a &ndash; 95125 Catania | tel./fax: 095433940 | didattica.ct@erisformazione.it | amministrazione.ct@erisformazione.it | Associazione riconosciuta, iscrizione n&deg;&nbsp;293979 C.C.I.A.A. di Catania | CF: 97180200822 | info@pec.erisformazione.it | www.erisformazione.it
  </div>
</div>
</div>`;
  };

  return buildSplitPage(colsA,1,false)+buildSplitPage(colsB,2,true);
})():"")}

<script>
window.addEventListener('load',function(){
  // Scale griglia completa
  var pg=document.getElementById('pg');
  if(pg){
    var vw=document.documentElement.clientWidth;
    var pw=pg.offsetWidth;
    if(pw>vw-20){
      var sc=(vw-20)/pw;
      pg.style.transformOrigin='top center';
      pg.style.transform='scale('+sc+')';
    }
  }
  // Scale griglie divise
  [1,2].forEach(function(n){
    var sp=document.getElementById('pg-split-'+n);
    if(!sp)return;
    var vw2=document.documentElement.clientWidth;
    var pw2=sp.offsetWidth;
    if(pw2>vw2-20){
      var sc2=(vw2-20)/pw2;
      sp.style.transformOrigin='top center';
      sp.style.transform='scale('+sc2+')';
    }
  });
  setTimeout(function(){window.print();},950);
});
<\/script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════
//  IMPORTAZIONE VOTI (solo Admin)
// ═══════════════════════════════════════════════
function openImportModal(){
  const existing=document.getElementById("import-modal");
  if(existing)existing.remove();
  const overlay=document.createElement("div");
  overlay.id="import-modal";
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:400;display:flex;align-items:flex-end;justify-content:center";
  overlay.innerHTML=`
  <div style="background:white;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px 20px calc(20px + env(safe-area-inset-bottom));max-height:92vh;overflow-y:auto">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:16px;font-weight:800;color:#0F172A">📤 Importa Voti da File</div>
        <div style="font-size:12px;color:#64748B;margin-top:2px">Excel (.xlsx / .xls) o CSV esportato dal registro</div>
      </div>
      <button id="imp-close" style="width:32px;height:32px;border:1px solid #E2E8F0;background:#F8FAFC;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#1E40AF;line-height:1.6">
      ℹ️ Il file deve avere una riga di intestazione con i codici materia (<strong>M01, M02…</strong>) e una colonna <strong>N.</strong> o <strong>COGNOME NOME</strong>. Funziona con i file esportati da questo registro.
    </div>
    <div id="imp-drop" style="border:2px dashed #CBD5E1;border-radius:12px;padding:28px 20px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;margin-bottom:14px">
      <div style="font-size:40px;margin-bottom:8px">📂</div>
      <div style="font-size:14px;font-weight:700;color:#374151;margin-bottom:4px">Trascina il file qui</div>
      <div style="font-size:12px;color:#94A3B8;margin-bottom:14px">oppure clicca per selezionarlo</div>
      <input id="imp-file" type="file" accept=".xlsx,.xls,.csv" style="display:none">
      <button id="imp-filebtn" style="background:#7C3AED;color:white;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer">Seleziona file</button>
    </div>
    <div id="imp-preview"></div>
    <div id="imp-actions" style="display:none;flex-direction:column;gap:10px">
      <button id="imp-confirm" style="width:100%;background:linear-gradient(135deg,#065F46,#059669);color:white;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:700;cursor:pointer">✅ Applica importazione</button>
      <button id="imp-cancel" style="width:100%;background:#F1F5F9;color:#64748B;border:none;border-radius:10px;padding:13px;font-size:13px;font-weight:700;cursor:pointer">Annulla</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  document.getElementById("imp-close").addEventListener("click",closeImportModal);
  document.getElementById("imp-cancel")?.addEventListener("click",closeImportModal);
  overlay.addEventListener("click",e=>{if(e.target===overlay)closeImportModal();});

  const fileInput=document.getElementById("imp-file");
  document.getElementById("imp-filebtn").addEventListener("click",()=>fileInput.click());
  fileInput.addEventListener("change",e=>{if(e.target.files[0])parseImportFile(e.target.files[0]);});

  const drop=document.getElementById("imp-drop");
  drop.addEventListener("dragover",e=>{e.preventDefault();drop.style.borderColor="#7C3AED";drop.style.background="#F5F3FF";});
  drop.addEventListener("dragleave",()=>{drop.style.borderColor="#CBD5E1";drop.style.background="";});
  drop.addEventListener("drop",e=>{
    e.preventDefault();drop.style.borderColor="#CBD5E1";drop.style.background="";
    if(e.dataTransfer.files[0])parseImportFile(e.dataTransfer.files[0]);
  });
}

function closeImportModal(){
  const m=document.getElementById("import-modal");
  if(m)m.remove();
}

async function parseImportFile(file){
  const preview=document.getElementById("imp-preview");
  const actions=document.getElementById("imp-actions");
  preview.innerHTML=`<div style="text-align:center;padding:20px;color:#64748B;font-size:13px;font-weight:600">⏳ Lettura file in corso...</div>`;
  actions.style.display="none";

  try{
    const buf=await file.arrayBuffer();
    const wb=XLSX.read(buf,{type:"array",cellText:false,cellDates:false,raw:true});
    const ws=wb.Sheets[wb.SheetNames[0]];
    const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:null,raw:true});

    // ── Trova riga header (contiene "N." e/o un codice materia) ──────────────
    let hIdx=-1,hRow=null;
    for(let r=0;r<Math.min(6,rows.length);r++){
      const row=rows[r];if(!row)continue;
      const hasNum=row.some(c=>String(c||"").trim()==="N."||String(c||"").trim()==="N");
      const hasSubj=row.some(c=>SUBJECTS.some(s=>String(c||"").trim().toUpperCase()===s.short.toUpperCase()));
      if(hasNum||hasSubj){hIdx=r;hRow=row;break;}
    }
    if(hIdx<0)throw new Error("Riga intestazione non trovata. Assicurati che il file contenga le colonne N. e i codici materia (M01, M02…).");

    // ── Mappa colonne → materia ───────────────────────────────────────────────
    const colSubj={};   // colIdx → Subject object
    const skipCols=new Set();
    hRow.forEach((cell,ci)=>{
      const cs=String(cell||"").trim().toUpperCase();
      // Colonne calcolate da ignorare
      if(["MEDIA ARITM.","MEDIA POND.","MEDIAH","MEDIA","M.A.","M.P.","VOTO FINALE","CONDOTTA"].some(k=>cs.includes(k)))
        {skipCols.add(ci);return;}
      SUBJECTS.forEach(s=>{
        const sh=s.short.toUpperCase();
        if(cs===sh||cs.startsWith(sh+" ")||cs.startsWith(sh+"-"))
          colSubj[ci]=s;
      });
    });

    const recognizedSubjs=[...new Set(Object.values(colSubj).map(s=>s.short))];
    if(!recognizedSubjs.length)
      throw new Error("Nessun codice materia riconosciuto nelle intestazioni. Trova le colonne M01, M02… nel file.");

    // ── Trova colonne N. e nome ───────────────────────────────────────────────
    let numCol=-1,nameCol=-1;
    hRow.forEach((cell,ci)=>{
      const cs=String(cell||"").trim();
      if(cs==="N."||cs==="N")numCol=ci;
      if(cs.toUpperCase().includes("COGNOME"))nameCol=ci;
    });

    // ── Leggi righe dati ─────────────────────────────────────────────────────
    const changes=[];   // {student,stIdx,subj,sid,oldVal,newVal}
    const skipped=[];
    for(let r=hIdx+1;r<rows.length;r++){
      const row=rows[r];
      if(!row||!row.some(c=>c!=null&&String(c).trim()!==""))continue;

      // Salta righe speciali (ORE h, DOCENTI)
      const firstNonEmpty=String(row.find(c=>c!=null&&String(c).trim()!=="")||"").trim().toUpperCase();
      if(["ORE","DOCENTI","DOCENTE"].some(k=>firstNonEmpty.includes(k)))continue;

      // ── Identificazione alunno ────────────────────────────────────────────
      let stIdx=-1;

      // 1. Per numero di registro
      if(numCol>=0&&row[numCol]!=null){
        const n=parseInt(String(row[numCol]).trim());
        if(!isNaN(n))stIdx=STUDENTS.findIndex(s=>s.num===n);
      }

      // 2. Per nome (fallback)
      if(stIdx<0&&nameCol>=0&&row[nameCol]){
        const raw=String(row[nameCol]).trim().toUpperCase()
          .replace(/\s*\(dimesso\)/i,"").replace(/\s*\(trasferito\)/i,"").replace(/\s+/g," ").trim();
        stIdx=STUDENTS.findIndex(st=>{
          const sn=st.name.toUpperCase().replace(/\s+/g," ");
          return sn===raw||raw.includes(sn)||sn.includes(raw);
        });
      }

      if(stIdx<0){
        const label=nameCol>=0&&row[nameCol]?String(row[nameCol]).trim()
          :(numCol>=0&&row[numCol]?String(row[numCol]).trim():"riga "+(r+1));
        if(label&&label.length>0&&label!=="null")skipped.push(label);
        continue;
      }

      const st=STUDENTS[stIdx];

      // ── Leggi voti per ogni colonna materia ───────────────────────────────
      for(const [ci,subj] of Object.entries(colSubj)){
        const raw=row[parseInt(ci)];
        if(raw===null||raw===undefined)continue;
        const sv=String(raw).trim();
        if(!sv||sv==="—"||sv==="-"||sv==="N/A"||sv==="null")continue;

        // Normalizza: se è numero float con troppi decimali, arrotonda a 2
        let newVal=sv;
        const numV=parseFloat(sv.replace(",","."));
        if(!isNaN(numV)&&String(numV).length===sv.length)
          newVal=Number.isInteger(numV)?String(numV):(Math.round(numV*100)/100).toString().replace(".",",");

        const oldEntry=App.grades[subj.id]?.[stIdx];
        const oldVal=oldEntry?.value??null;
        if(String(newVal)!==String(oldVal??"")){
          // Evita duplicati (stessa materia-alunno da più colonne)
          if(!changes.find(c=>c.stIdx===stIdx&&c.sid===subj.id))
            changes.push({student:st,stIdx,subj,sid:subj.id,oldVal,newVal});
        }
      }
    }

    // ── Render preview ────────────────────────────────────────────────────────
    if(!changes.length&&!skipped.length){
      preview.innerHTML=`<div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:14px;text-align:center;font-size:13px;color:#065F46;font-weight:700;margin-bottom:12px">✅ Nessuna modifica — i voti sono già aggiornati.</div>`;
      return;
    }

    let html="";

    // Riepilogo materie riconosciute
    html+=`<div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:11px;color:#065F46">
      ✅ Materie riconosciute: <strong>${recognizedSubjs.join(", ")}</strong>
    </div>`;

    if(changes.length){
      const newC=changes.filter(c=>c.oldVal===null).length;
      const updC=changes.length-newC;
      html+=`<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#64748B;margin-bottom:6px">
        ${changes.length} modifiche — <span style="color:#059669">${newC} nuove</span>${updC>0?` · <span style="color:#D97706">${updC} aggiornate</span>`:""}
      </div>`;
      html+=`<div style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:12px;max-height:42vh;overflow-y:auto">`;
      changes.forEach(ch=>{
        const isNew=ch.oldVal===null;
        const badge=isNew
          ?`<span style="font-size:9px;background:#ECFDF5;color:#065F46;border-radius:4px;padding:1px 5px;font-weight:700;display:inline-block;margin-bottom:2px">NUOVO</span>`
          :`<span style="font-size:9px;background:#FEF3C7;color:#92400E;border-radius:4px;padding:1px 5px;font-weight:700;display:inline-block;margin-bottom:2px">AGGIORNA</span>`;
        const oldPart=isNew?"":`<span style="color:#94A3B8;text-decoration:line-through;font-size:11px;margin-right:4px">${ch.oldVal}</span>`;
        html+=`<div style="display:flex;align-items:center;padding:9px 12px;border-bottom:1px solid #F1F5F9;gap:8px;background:${isNew?"white":"#FFFBEB88"}">
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:700;color:#0F172A">${fmtName(ch.student.name)}</div>
            <div style="font-size:10px;color:#94A3B8">${ch.subj.short} — ${ch.subj.label.replace(/^[A-Za-z0-9]+ - /,"")}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            ${badge}<br>
            ${oldPart}<strong style="font-size:15px;color:${gradeColor(ch.newVal)}">${ch.newVal}</strong>
          </div>
        </div>`;
      });
      html+=`</div>`;
    }

    if(skipped.length){
      html+=`<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:11px;color:#92400E">
        ⚠️ ${skipped.length} riga/righe non abbinate a nessun alunno: <em>${skipped.slice(0,6).join(", ")}${skipped.length>6?" …":""}</em>
      </div>`;
    }

    preview.innerHTML=html;

    if(changes.length){
      actions.style.display="flex";
      // Re-bind confirm (innerHTML resetta i listener del preview ma non quelli di actions)
      document.getElementById("imp-confirm").onclick=()=>applyImport(changes);
    }

  }catch(e){
    preview.innerHTML=`<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px;font-size:13px;color:#991B1B;line-height:1.6">
      ❌ <strong>Errore nella lettura del file</strong><br>${e.message}
    </div>`;
  }
}

async function applyImport(changes){
  const btn=document.getElementById("imp-confirm");
  if(btn){btn.textContent="⏳ Salvataggio in corso...";btn.disabled=true;}
  try{
    const updates={};
    const now=new Date().toISOString();
    for(const ch of changes){
      const entry={value:ch.newVal,docente:App.teacher.id,ts:now,importedFrom:"file"};
      if(!App.grades[ch.sid])App.grades[ch.sid]={};
      App.grades[ch.sid][ch.stIdx]=entry;
      updates["grades/"+ch.sid+"/"+ch.stIdx]=entry;
    }
    if(DB)await fbRef("").update(updates);
    toast("✅ "+changes.length+" voti importati con successo!","ok");
    closeImportModal();
    renderAdminMaterie();
  }catch(e){
    toast("❌ Errore durante l'importazione: "+e.message,"err");
    if(btn){btn.textContent="✅ Applica importazione";btn.disabled=false;}
  }
}

// ═══════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════
// Aggiorna dropdown login con docenti custom (chiamato da Firebase listener)
function updateLoginCustomTeachers(){
  const sel=$("#teacher-sel");if(!sel)return;
  let og=document.getElementById("custom-teachers-og");
  if(og)og.remove();
  const customs=Object.values(App.customTeachers||{});
  if(!customs.length)return;
  og=document.createElement("optgroup");
  og.id="custom-teachers-og";og.label="👤 Nuovi docenti";
  customs.forEach(t=>{const o=document.createElement("option");o.value=t.id;o.textContent=t.label;og.appendChild(o);});
  const groups=sel.querySelectorAll("optgroup");
  if(groups.length>=2)sel.insertBefore(og,groups[1]);else sel.appendChild(og);
}

function renderLogin(){
  document.body.innerHTML=`
<div class="login-bg">
  <div class="credits-banner"><div class="credits-inner">
    <span class="credits-icon">🏫</span>
    <div><div class="credits-title">${ISTITUTO}</div>
    <div class="credits-sub">Web app realizzata da <strong>${AUTORE}</strong></div></div>
  </div></div>
  <div class="login-brand">
    <img src="${LOGO}" class="login-logo" alt="" onerror="this.style.display=\'none\'">
    <h1 class="login-title">Registro Elettronico</h1>
    <div class="class-badge"><span>Classe ${CLASSE}</span><span class="sep">|</span><span>A.S. ${ANNO}</span></div>
  </div>
  <div class="login-card">
    <div class="card-heading">Accedi al Registro ${CLASSE}</div>
    <div class="card-sub">${COURSE_TRACKS.courseLabel} &nbsp;&nbsp; ${CLASSE} &nbsp;&nbsp; n.&nbsp;ore: ${COURSE_TRACKS.courseCode}</div>
    <div style="text-align:center;margin-bottom:16px;font-size:12px;color:#64748B;font-weight:600">Tutor: <strong style="color:#059669">${TUTOR_NAME}</strong></div>
    <div id="login-err" class="err-box"></div>
    <div class="field"><label class="lbl">Utente</label>
      <div class="sel-wrap">
        <select id="teacher-sel" class="inp">
          <option value="">— Seleziona —</option>
          <optgroup label="👨‍🏫 Docenti">${TEACHERS.map(t=>`<option value="${t.id}">${t.label}</option>`).join("")}</optgroup>
          <optgroup label="👁 Tutor / Segreteria">
            <option value="tutor">${TUTOR_NAME} (Tutor)</option>
            <option value="segreteria">Segreteria</option>
          </optgroup>
          <optgroup label="⚙️ Amministrazione"><option value="admin">Amministratore</option></optgroup>
        </select><span class="sel-arrow">▾</span>
      </div>
    </div>
    <div class="field"><label class="lbl">PIN (4 cifre)</label>
      <input id="pin-in" class="inp pin-f" type="password" inputmode="numeric" maxlength="4" placeholder="• • • •" autocomplete="off">
    </div>
    <button id="login-btn" class="btn-primary">Accedi →</button>
    <p class="login-hint">PIN predefinito docenti: <strong>1234</strong></p>
    <button id="btn-credits" style="margin-top:12px;width:100%;background:#FEF9C3;border:1.5px solid #FDE047;border-radius:10px;padding:10px 14px;font-size:12px;color:#854D0E;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">ℹ️ Guida e informazioni sul registro</button>
    <button id="btn-back-class" style="margin-top:8px;width:100%;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:10px;padding:10px 14px;font-size:12px;color:#475569;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">🏫 Torna alla scelta classe</button>
  </div>
</div>
<div id="toast" class="toast"></div>`;
  $("#login-btn").addEventListener("click",doLogin);
  $("#pin-in").addEventListener("keydown",e=>{if(e.key==="Enter")doLogin();});
  $("#btn-credits").addEventListener("click",renderCredits);
  $("#btn-back-class").addEventListener("click",renderClassSelect);
}

// ═══════════════════════════════════════════════
//  CREDITS & GUIDA DOCENTI
// ═══════════════════════════════════════════════
function renderCredits(){
  document.body.innerHTML=`
<div style="min-height:100vh;background:#0F172A;padding-bottom:40px">
  <div style="background:rgba(255,255,255,.05);padding:14px 16px;display:flex;align-items:center;gap:10px">
    <button id="back-credits" style="background:rgba(255,255,255,.1);border:none;border-radius:8px;color:white;font-size:18px;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center">←</button>
    <span style="font-size:16px;font-weight:800;color:white">Guida al Registro Elettronico</span>
  </div>
  <div style="max-width:500px;margin:0 auto;padding:16px">

    <!-- Intestazione -->
    <div style="background:linear-gradient(135deg,#1B3F8B,#1D4ED8);border-radius:16px;padding:20px;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:16px">
        <img src="https://i.postimg.cc/Dwk5d6Ry/PROFESSORE_NEMICO.png" alt="Mascotte" style="width:80px;height:80px;object-fit:contain;border-radius:12px;flex-shrink:0">
        <div>
          <div style="font-size:18px;font-weight:800;color:white">Registro Elettronico</div>
          <div style="font-size:13px;color:rgba(255,255,255,.8);margin-top:3px">${ISTITUTO}</div>
          <div style="font-size:12px;color:#FDE68A;margin-top:3px">Classe ${CLASSE} — A.S. ${ANNO}</div>
          <div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,.6)">Sviluppato da <strong style="color:white">${AUTORE}</strong></div>
        </div>
      </div>
    </div>

    <!-- PIN docenti -->
    <div style="background:#1E293B;border-radius:14px;padding:16px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:#FDE68A;margin-bottom:10px">🔐 Accesso Docenti</div>
      <div style="background:#0F172A;border-radius:10px;padding:14px;border-left:4px solid #3B82F6">
        <div style="font-size:12px;color:#94A3B8;line-height:1.9">
          <div>Il PIN predefinito per tutti i docenti è <strong style="color:#FDE68A;font-size:16px"> 1234</strong></div>
          <div style="margin-top:8px">Dopo il primo accesso puoi cambiare il tuo PIN personale dalla sezione <strong style="color:#E2E8F0">⚙️ Impostazioni</strong> nel pannello.</div>

        </div>
      </div>
    </div>

    <!-- Guida voti -->
    <div style="background:#1E293B;border-radius:14px;padding:16px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:#FDE68A;margin-bottom:10px">✏️ Come inserire i voti</div>
      <div style="font-size:12px;color:#94A3B8;line-height:1.9">
        <div>1️⃣ Accedi con il tuo utente e PIN</div>
        <div>2️⃣ Nella schermata principale vedi le tue materie</div>
        <div>3️⃣ Tocca una materia per aprire l'elenco alunni</div>
        <div>4️⃣ Inserisci il voto nel campo accanto al nome</div>
        <div>5️⃣ Tocca <strong style="color:#059669">✔ Salva voto</strong> per confermare</div>
        <div>6️⃣ I voti vengono salvati automaticamente nel cloud</div>
        <div style="margin-top:8px;background:#0F172A;border-radius:8px;padding:10px;font-size:11px">
          💡 Voti accettati: numeri interi (6, 8), decimali (7.5), lettere (NC, Esente) e combinazioni (6+, 7½)
        </div>
      </div>
    </div>

    <!-- Scala colori -->
    <div style="background:#1E293B;border-radius:14px;padding:16px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:#FDE68A;margin-bottom:10px">🎨 Scala colori voti</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${[
          {c:"#EF4444",label:"< 6 — Insufficiente"},
          {c:"#CA8A04",label:"6 — Sufficiente"},
          {c:"#D97706",label:"7–8 — Buono"},
          {c:"#059669",label:"9–10 — Ottimo"},
        ].map(r=>`<div style="background:#0F172A;border-radius:8px;padding:8px;border-left:3px solid ${r.c}"><span style="font-size:11px;color:${r.c};font-weight:700">${r.label}</span></div>`).join("")}
      </div>
    </div>

    <!-- Voto finale -->
    <div style="background:#1E293B;border-radius:14px;padding:16px;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:#FDE68A;margin-bottom:10px">🏆 Calcolo Voto Finale</div>
      <div style="font-size:12px;color:#94A3B8;line-height:1.8">
        <div>Il Voto Finale viene calcolato dalla <strong style="color:#E2E8F0">Media Ponderata</strong> (pesata sulle ore di lezione) e arrotondata in base al voto di condotta:</div>
        <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
          <div style="background:#0F172A;border-radius:8px;padding:10px;border-left:3px solid #7C3AED">
            <div style="font-size:12px;font-weight:700;color:#A78BFA">Condotta ≤ 8</div>
            <div style="font-size:11px;color:#94A3B8;margin-top:2px">Arrotondamento <strong style="color:#EF4444">sempre per difetto</strong> (es. 6.9 → 6)</div>
          </div>
          <div style="background:#0F172A;border-radius:8px;padding:10px;border-left:3px solid #059669">
            <div style="font-size:12px;font-weight:700;color:#34D399">Condotta ≥ 9</div>
            <div style="font-size:11px;color:#94A3B8;margin-top:2px">Arrotondamento <strong style="color:#059669">normale</strong> (es. 6.5 → 7, 6.4 → 6)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invio dati -->
    <div style="background:#1E293B;border-radius:14px;padding:16px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;color:#FDE68A;margin-bottom:10px">📧 Invio dati al Tutor</div>
      <div style="font-size:12px;color:#94A3B8;line-height:1.8">
        <div>Dal tab <strong style="color:#E2E8F0">Riepilogo</strong> puoi inviare al Tutor un file Excel con i tuoi voti tramite il pulsante <strong style="color:#059669">📩 Invia al Tutor</strong>.</div>
        <div style="margin-top:6px">Destinatario: <strong style="color:#FDE68A">${MAIL_DEST}</strong></div>
      </div>
    </div>

  </div>
</div>
<div id="toast" class="toast"></div>`;
  $("#back-credits").addEventListener("click",()=>{App.teacher?renderLogin():renderClassSelect();});
}


// ═══════════════════════════════════════════════
//  HOME DOCENTE
// ═══════════════════════════════════════════════
async function inviaGrigliaWA(cols){
  try{
    const docName=App.teacher.label?App.teacher.label:"";
    const waMsg="🎓✨ Ciao Tutor! Il Prof. "+docName+" di ERIS ha terminato di inserire i voti! 📝\n\nLa griglia è allegata qui sotto, pronta per la tua revisione 👆\n\nW ERIS! 🏫💪 Grazie e buon lavoro! 🚀";
    const html=buildGridHtml(cols);
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const docente=App.teacher.label?App.teacher.label.toUpperCase():"DOCENTE";
    const fname="Griglia_"+docente+"_"+CLASSE+"_"+ANNO.replace("/","-")+".html";
    const file=new File([blob],fname,{type:"text/html"});
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
      try{
        await navigator.share({files:[file],title:"Griglia Voti — "+CLASSE,text:waMsg});
        toast("💬 Griglia condivisa con il Tutor!","ok");
        return;
      }catch(e){if(e.name==="AbortError")return;}
    }
    const waUrl="https://wa.me/"+WA_TUTOR+"?text="+encodeURIComponent(waMsg+"\n\n(Allega il file HTML che viene scaricato in automatico)");
    window.open(waUrl,"_blank");
    setTimeout(()=>downloadBlob(blob,fname),800);
    toast("📎 WhatsApp aperto — allega la griglia HTML scaricata","info");
  }catch(e){console.error(e);toast("❌ Errore: "+e.message,"err");}
}

function renderHome(){
  const myS=SUBJECTS.filter(s=>mySubjects().includes(s.id)&&!s.conductaOnly);
  const condS=SUBJECTS.find(s=>s.id==="condotta");
  // Voti condotta già inseriti da questo docente
  const myCondotta=App.condottaParziale[App.teacher.id]||{};
  const condDone=activeStudents().filter(st=>!!myCondotta[STUDENTS.indexOf(st)]).length;
  const condTotal=activeStudents().length;
  const condPct=condTotal>0?Math.round(condDone/condTotal*100):0;
  const condCol=condPct===100?"#7C3AED":condDone>0?"#A78BFA":"#CBD5E1";
  const condBg=condPct===100?"#F5F3FF":condDone>0?"#FAF5FF":"#F8FAFC";
  document.body.innerHTML=`
${headerHTML("Le mie materie",false)}
${bannerHTML()}
<div class="page-wrap">
  <div class="stats-row">
    <div class="stat-box"><div class="stat-n">${activeStudents().length}</div><div class="stat-l">Attivi</div></div>
    <div class="stat-box"><div class="stat-n">${myS.length}</div><div class="stat-l">Materie</div></div>
    <div class="stat-box"><div class="stat-n">${myTotal()}</div><div class="stat-l">Voti</div></div>
  </div>
  <div class="card">
    <div class="card-head"><span class="sec-lbl">📖 Tocca una materia per inserire i voti</span></div>
    ${Object.keys(App.subjectsLocked||{}).length>0?`<div style="margin:0 0 10px;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:10px 12px;font-size:12px;color:#991B1B;font-weight:600">🔒 Alcune materie sono chiuse — puoi consultarle ma non modificare i voti</div>`:""}
    ${myS.map(s=>{
      const sts=studentsForSubject(s.id);
      const done=sts.filter(_=>!!App.grades[s.id]?.[STUDENTS.indexOf(_)]).length;
      const pct=sts.length>0?Math.round(done/sts.length*100):0;
      const locked=!!App.subjectsLocked[s.id];
      const col=locked?"#991B1B":pct===100?"#059669":pct>0?"#3B82F6":"#CBD5E1";
      const bg=locked?"#FEF2F2":pct===100?"#ECFDF5":pct>0?"#EFF6FF":"#F8FAFC";
      const mc=corsM(s.id);
      return`<button class="row-btn" data-sid="${s.id}" style="${locked?"background:#FFF5F5;border-left:3px solid #DC2626;opacity:.85":""}">
        <div class="row-icon" style="position:relative">${s.emoji}${locked?`<span style="position:absolute;top:-4px;right:-6px;font-size:11px">🔒</span>`:""}
        </div>
        <div class="row-body">
          <div class="row-name" style="${locked?"color:#991B1B;text-decoration:line-through;opacity:.7":""}">${s.label}</div>
          <div class="row-meta">${locked?`<span style="color:#DC2626;font-weight:700">🔒 Chiusa — sola lettura</span>`:`${corsoBadge(mc)} · 🕐 ${s.ore}h · ${sts.length} alunni`}</div>
        </div>
        <div class="prog-col">
          <span class="prog-pill" style="background:${bg};color:${col}">${locked?"🔒":done+"/"+sts.length}</span>
          <div class="prog-bar"><div class="prog-fill" style="width:${locked?100:pct}%;background:${locked?"#FCA5A5":col}"></div></div>
        </div>
      </button>`;
    }).join("")}
  </div>
  ${condS?`<div class="card" style="border-left:3px solid #7C3AED">
    <div class="card-head"><span class="sec-lbl" style="color:#7C3AED">⭐ Voto di Condotta</span></div>
    <button class="row-btn" id="btn-condotta-home" style="border-left:none">
      <div class="row-icon" style="font-size:22px">⭐</div>
      <div class="row-body">
        <div class="row-name" style="color:#7C3AED">Condotta — il tuo contributo</div>
        <div class="row-meta" style="color:#9333EA">Il voto finale è la media di tutti i docenti</div>
      </div>
      <div class="prog-col">
        <span class="prog-pill" style="background:${condBg};color:${condCol}">${condDone}/${condTotal}</span>
        <div class="prog-bar"><div class="prog-fill" style="width:${condPct}%;background:${condCol}"></div></div>
      </div>
    </button>
  </div>`:""}
  ${dimN()>0?`<div class="info-box info-red">⚠️ ${dimN()} alunno/i dimesso/i — non visibili in questa app</div>`:""}
  <button class="btn-print-grid" id="btn-home-grid-print"><span style="font-size:22px">📊</span><div><div class="btn-lbl-big">SCARICA RIEPILOGO GRIGLIA VOTI</div><div class="btn-lbl-small">Le mie materie · solo 1 pagina</div></div></button>
  <button class="btn-green" id="btn-home-invia"><span style="font-size:22px">💬</span><div><div class="btn-lbl-big">Invia al Tutor</div><div class="btn-lbl-small">Griglia + messaggio WhatsApp</div></div></button>
</div>
${bottomNavHTML("home")}
<div id="toast" class="toast"></div>`;
  attachHeader(false);attachNav();
  $$(".row-btn[data-sid]").forEach(btn=>{
    btn.addEventListener("click",function(){App.subjId=this.dataset.sid;App.edits={};App.page="grades";renderGrades();});
  });
  const btnCH=$("#btn-condotta-home");if(btnCH)btnCH.addEventListener("click",()=>{App.subjId="condotta";App.edits={};App.page="grades";renderGrades();});
  const btnHGP=$("#btn-home-grid-print");if(btnHGP)btnHGP.addEventListener("click",()=>exportGridHtmlCols(myS));
  const btnHI=$("#btn-home-invia");if(btnHI)btnHI.addEventListener("click",async()=>inviaGrigliaWA(myS));
}

// ═══════════════════════════════════════════════
//  RIEPILOGO DOCENTE
// ═══════════════════════════════════════════════
function renderSummary(){
  const cols=SUBJECTS.filter(s=>mySubjects().includes(s.id)&&!s.conductaOnly);
  const allCols=SUBJECTS.filter(s=>!s.conductaOnly);
  const sts=activeStudents().filter(st=>{
    const i=STUDENTS.indexOf(st);
    return cols.some(s=>studentHasSubject(i,s.id));
  });
  document.body.innerHTML=`
${headerHTML("Riepilogo — mie materie",true)}
${bannerHTML()}
<div class="page-wrap page-wrap-wide">
  <div class="card">
    <div class="card-head"><span class="sec-lbl">📊 Le mie materie — Classe ${CLASSE}</span><span style="font-size:10px;color:#CBD5E1">← scorri →</span><span style="font-size:9px;color:#94A3B8;margin-left:4px">MA/MP su tutte le materie</span></div>
    ${makeSummaryTable(cols,sts,false,allCols)}
  </div>
  <div class="legend">
    <div class="leg"><span class="leg-dot" style="background:#EF4444"></span>&lt; 6</div>
    <div class="leg"><span class="leg-dot" style="background:#CA8A04"></span>6</div>
    <div class="leg"><span class="leg-dot" style="background:#D97706"></span>7–8</div>
    <div class="leg"><span class="leg-dot" style="background:#059669"></span>9–10</div>
    <div class="leg"><span class="leg-dot" style="background:#1D4ED8"></span>Media Aritm.</div>
    <div class="leg"><span class="leg-dot" style="background:#92400E"></span>Media Pond.</div>
  </div>
  <button class="btn-green" id="btn-summ-invia"><span style="font-size:22px">💬</span><div><div class="btn-lbl-big">Invia al Tutor</div><div class="btn-lbl-small">Apri WhatsApp con messaggio</div></div></button>
  <button class="btn-print-grid" id="btn-summ-grid-print"><span style="font-size:22px">📊</span><div><div class="btn-lbl-big">SCARICA RIEPILOGO GRIGLIA VOTI</div><div class="btn-lbl-small">Le mie materie · solo 1 pagina</div></div></button>
</div>
${bottomNavHTML("summary")}
<div id="toast" class="toast"></div>`;
  attachHeader(true);attachNav();
  const btnInvia=$("#btn-summ-invia");if(btnInvia)btnInvia.addEventListener("click",async()=>inviaGrigliaWA(cols));
  const btnSGP=$("#btn-summ-grid-print");if(btnSGP)btnSGP.addEventListener("click",()=>exportGridHtmlCols(cols));
}

// ═══════════════════════════════════════════════
//  INSERIMENTO VOTI
// ═══════════════════════════════════════════════
function renderGrades(){
  const s=SUBJECTS.find(x=>x.id===App.subjId);
  const sts=studentsForSubject(s.id);
  const isReadOnly=!!App.teacher.isSegreteria;
  const isCondotta=s.conductaOnly===true;
  const isAdminOrTutor=App.teacher.isAdmin||App.teacher.isTutor;
  // Blocco per singola materia: i docenti normali non possono modificare
  const isLocked=!!App.subjectsLocked[App.subjId]&&!isAdminOrTutor&&!App.teacher.isSegreteria;
  // Per condotta: admin/tutor override diretto; docente normale → parziale
  const isCondottaParziale=isCondotta&&!isAdminOrTutor&&!isReadOnly&&!isLocked;
  const canEditCondotta=isAdminOrTutor;
  const effectiveReadOnly=isReadOnly||isLocked||(isCondotta&&!canEditCondotta&&!isCondottaParziale);

  // Helper per ottenere il dato corretto da mostrare nella riga
  const getDisplayEntry=(i)=>{
    if(isCondottaParziale){
      // Mostra il voto che ha inserito questo docente (non la media)
      return App.condottaParziale[App.teacher.id]?.[i]||null;
    }
    return App.grades[App.subjId]?.[i]||null;
  };
  // Nota informativa per condotta parziale
  const mediaCondottaInfo=(i)=>{
    const mediaEntry=App.grades["condotta"]?.[i];
    const partials=Object.entries(App.condottaParziale||{})
      .filter(([,tv])=>tv[i]&&tv[i].value)
      .map(([tid,tv])=>`${TN[tid]||tid}: <strong>${tv[i].value}</strong>`);
    if(!partials.length)return"";
    return`<span style="font-size:9px;color:#7C3AED;display:block;margin-top:1px">Media (${partials.length} doc.): ${mediaEntry?mediaEntry.value:"—"}</span>`;
  };

  document.body.innerHTML=`
${headerHTML(s.short+" — "+s.label.replace(/^M\d+[Eeb\d]* - /,""),true)}
${bannerHTML()}
${effectiveReadOnly&&isLocked?`<div class="info-box" style="margin:8px 14px;border-radius:10px;background:#FEF2F2;border:1px solid #FECACA;color:#991B1B">🔒 <strong>Registro chiuso</strong> — Admin o Tutor hanno disabilitato l'inserimento voti. Puoi consultare i voti ma non modificarli.</div>`:""}
${effectiveReadOnly&&!isLocked?`<div class="info-box info-blue" style="margin:8px 14px;border-radius:10px">${isCondotta?"⭐ Condotta — sola lettura":"👁 Modalità sola lettura"}</div>`:""}
${isCondottaParziale?`<div class="info-box" style="margin:8px 14px;border-radius:10px;background:#FAF5FF;border:1px solid #DDD6FE;color:#6D28D9">⭐ <strong>Il tuo voto di Condotta</strong> — verrà mediato con quello degli altri docenti. Admin e Tutor possono sempre sovrascrivere il risultato finale.</div>
<div style="margin:0 14px 8px;background:#FEFEFE;border:1px solid #E9D5FF;border-radius:12px;padding:12px 14px;font-size:11px;color:#374151;line-height:1.6">
  <div style="font-weight:800;color:#6D28D9;font-size:12px;margin-bottom:8px">📋 Guida al voto di Condotta — Legge 150/2024</div>
  <div style="font-size:10px;color:#6B7280;margin-bottom:8px">Espresso in decimi (5–10). Ha effetti diretti su promozione e crediti.</div>
  <div style="display:flex;flex-direction:column;gap:5px">
    <div style="display:flex;gap:8px;align-items:flex-start">
      <span style="min-width:26px;height:22px;background:#059669;color:white;border-radius:6px;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">10</span>
      <span><strong>Eccellente</strong> — Comportamento esemplare, piena responsabilità, partecipazione attiva e costruttiva, rispetto totale delle regole e della comunità scolastica.</span>
    </div>
    <div style="display:flex;gap:8px;align-items:flex-start">
      <span style="min-width:26px;height:22px;background:#16A34A;color:white;border-radius:6px;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">9</span>
      <span><strong>Ottimo</strong> — Comportamento maturo e responsabile, partecipazione corretta e costante, autonomia e rispetto delle regole, contributo positivo al clima di classe.</span>
    </div>
    <div style="display:flex;gap:8px;align-items:flex-start">
      <span style="min-width:26px;height:22px;background:#D97706;color:white;border-radius:6px;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">8</span>
      <span><strong>Buono</strong> — Comportamento corretto e responsabile, buona partecipazione, con margini di crescita nella maturazione personale o nello spirito di iniziativa.</span>
    </div>
    <div style="display:flex;gap:8px;align-items:flex-start">
      <span style="min-width:26px;height:22px;background:#B45309;color:white;border-radius:6px;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">7</span>
      <span><strong>Discreto</strong> — Comportamento sostanzialmente corretto ma discontinuo. Autonomia parziale, necessità di maggiore attenzione ai doveri e alle regole di convivenza.</span>
    </div>
    <div style="display:flex;gap:8px;align-items:flex-start">
      <span style="min-width:26px;height:22px;background:#DC2626;color:white;border-radius:6px;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">6</span>
      <span><strong>Sufficiente</strong> — Rispetto delle regole solo formale o parziale. ⚠️ Secondo Legge 150/2024: comporta sospensione del giudizio con obbligo di elaborato su cittadinanza e convivenza civile.</span>
    </div>
    <div style="display:flex;gap:8px;align-items:flex-start">
      <span style="min-width:26px;height:22px;background:#7F1D1D;color:white;border-radius:6px;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">5</span>
      <span><strong>Insufficiente</strong> — Comportamento gravemente scorretto, atti di violenza, bullismo o sospensioni lunghe. 🚫 Comporta la non ammissione alla classe successiva o agli esami.</span>
    </div>
  </div>
</div>`:""}
${isCondotta&&isAdminOrTutor?(()=>{
  // Costruisce la lista di tutti i docenti con le loro materie (escluso admin/tutor/segreteria)
  const allT=TEACHERS.filter(t=>t.id!=="admin"&&t.id!=="tutor"&&t.id!=="segreteria");
  const cp=App.condottaParziale||{};
  // Per ogni docente conta quanti alunni ha votato
  const withVotes=allT.filter(t=>cp[t.id]&&Object.keys(cp[t.id]).length>0);
  const missing=allT.filter(t=>!cp[t.id]||Object.keys(cp[t.id]).length===0);
  const partial=withVotes.filter(t=>{
    const keys=Object.keys(cp[t.id]||{});
    return keys.length<activeStudents().length;
  });
  const complete=withVotes.filter(t=>{
    const keys=Object.keys(cp[t.id]||{});
    return keys.length>=activeStudents().length;
  });
  return`<div style="margin:0 14px 8px;background:#FEFEFE;border:1px solid #FDE68A;border-radius:12px;padding:12px 14px;font-size:11px">
  <div style="font-weight:800;color:#92400E;font-size:12px;margin-bottom:10px">👥 Stato voti condotta — ${allT.length} docenti</div>
  ${complete.length>0?`<div style="margin-bottom:8px">
    <div style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">✅ Completati (${complete.length})</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${complete.map(t=>{
        const n=Object.keys(cp[t.id]).length;
        return`<span style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:3px 8px;font-size:10px;color:#065F46"><strong>${TN[t.id]||t.label}</strong> <span style="opacity:.7">${n}/${activeStudents().length}</span></span>`;
      }).join("")}
    </div>
  </div>`:""}
  ${partial.length>0?`<div style="margin-bottom:8px">
    <div style="font-size:10px;font-weight:700;color:#D97706;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">⚠️ Parziali (${partial.length})</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${partial.map(t=>{
        const n=Object.keys(cp[t.id]).length;
        return`<span style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:8px;padding:3px 8px;font-size:10px;color:#92400E"><strong>${TN[t.id]||t.label}</strong> <span style="opacity:.7">${n}/${activeStudents().length}</span></span>`;
      }).join("")}
    </div>
  </div>`:""}
  ${missing.length>0?`<div>
    <div style="font-size:10px;font-weight:700;color:#DC2626;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">❌ Non inserito (${missing.length})</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${missing.map(t=>`<span style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:3px 8px;font-size:10px;color:#991B1B"><strong>${TN[t.id]||t.label}</strong></span>`).join("")}
    </div>
  </div>`:""}
  ${allT.length===0?`<div style="color:#94A3B8;font-style:italic">Nessun docente registrato per questa classe.</div>`:""}
</div>`;
})():""}
${isCondotta&&isAdminOrTutor?`<div class="info-box info-yellow" style="margin:8px 14px;border-radius:10px">⭐ <strong>Override Condotta</strong> — stai sovrascrivendo il voto finale di condotta (Admin/Tutor). I voti parziali dei docenti restano salvati.</div>`:""}
<div class="page-wrap">
  <div class="grade-hero" style="background:linear-gradient(135deg,${s.color}cc,${s.color})">
    <div style="font-size:24px;margin-bottom:4px">${s.emoji}</div>
    <div style="font-size:17px;font-weight:800;margin-bottom:8px">${s.label}</div>
    ${s.ore>0?`<span class="hbadge">🕐 ${s.ore}h</span>`:""}
    ${docOf(s.id)?`<span class="hbadge">👤 ${docNameOf(s.id)}</span>`:""}
    ${!isCondotta?`<span class="hbadge">${corsoBadge(corsM(s.id)).replace(/<[^>]+>/g,"").trim()}</span>`:""}
    <span class="hbadge">✅ ${sts.filter(_=>{const i=STUDENTS.indexOf(_);return !!(isCondottaParziale?App.condottaParziale[App.teacher.id]?.[i]:App.grades[s.id]?.[i]);}).length}/${sts.length}</span>
  </div>
  ${sts.length===0?`<div class="info-box info-yellow">⚠️ Nessun alunno assegnato.</div>`:""}
  <div class="grade-list">
    ${sts.map(st=>{
      const i=STUDENTS.indexOf(st);
      const saved=getDisplayEntry(i);
      const ev=App.edits[i];
      const val=ev!==undefined?ev:(saved?.value||"");
      const isEd=ev!==undefined&&ev!==(saved?.value||"");
      const isSav=!isEd&&!!saved?.value;
      const rowBg=isSav?gradeBg(saved.value)+"44":"white";
      if(effectiveReadOnly){
        return`<div class="st-row" style="background:${rowBg}">
          <div class="s-num">${st.num}</div>
          <div class="s-name">${fmtName(st.name)}${isCondotta?mediaCondottaInfo(i):""}</div>
          <div style="font-size:20px;font-weight:800;min-width:50px;text-align:center;color:${isSav?gradeColor(saved.value):"#CBD5E1"}">${isSav?saved.value:"—"}</div>
        </div>`;
      }
      return`<div class="st-row" style="background:${rowBg}">
        <div class="s-num">${st.num}</div>
        <div class="s-name">${fmtName(st.name)}${isCondottaParziale?mediaCondottaInfo(i):""}</div>
        <div class="grade-ctrl">
          <input class="g-inp${isEd?" edit":""}" data-i="${i}"
            style="${isSav&&!isEd?"color:"+gradeColor(saved.value)+";border-color:"+gradeColor(saved.value)+"55":""}"
            type="text" inputmode="decimal" value="${val}" placeholder="—" autocomplete="off">
          ${!isCondotta?`<button class="btn-nc" data-nc="${i}">N.C.</button>`:""}
          ${isSav&&!isEd
            ?`<button class="btn-del" data-del="${i}">✕</button>`
            :`<button class="btn-ok${isSav?" saved":""}" data-ok="${i}">${isSav?"✓":"→"}</button>`}
        </div>
      </div>`;
    }).join("")}
  </div>
</div>
<div id="toast" class="toast"></div>`;
  attachHeader(true);
  if(!effectiveReadOnly){
    $$(".g-inp[data-i]").forEach(inp=>{
      const i=parseInt(inp.dataset.i);
      inp.addEventListener("input",function(){App.edits[i]=this.value.trim();this.classList.toggle("edit",!!this.value.trim());});
      inp.addEventListener("keydown",function(e){
        if(e.key==="Enter"){
          isCondottaParziale?confirmCondottaParziale(i):confirmGrade(i);
          setTimeout(()=>{
            const cur=sts.indexOf(sts.find(s=>STUDENTS.indexOf(s)===i));
            const next=sts[cur+1];
            if(next){const nx=$(`.g-inp[data-i="${STUDENTS.indexOf(next)}"]`);if(nx)nx.focus();}
          },80);
        }
      });
    });
    if(isCondottaParziale){
      $$(".btn-ok[data-ok]").forEach(btn=>{btn.addEventListener("click",function(){confirmCondottaParziale(parseInt(this.dataset.ok));});});
      $$(".btn-del[data-del]").forEach(btn=>{btn.addEventListener("click",function(){deleteCondottaParziale(parseInt(this.dataset.del));});});
    } else {
      $$(".btn-ok[data-ok]").forEach(btn=>{btn.addEventListener("click",function(){confirmGrade(parseInt(this.dataset.ok));});});
      $$(".btn-del[data-del]").forEach(btn=>{btn.addEventListener("click",function(){deleteGrade(App.subjId,parseInt(this.dataset.del));});});
      $$(".btn-nc[data-nc]").forEach(btn=>{btn.addEventListener("click",function(){const i=parseInt(this.dataset.nc);App.edits[i]="NC";confirmGrade(i);});});
    }
  }
}

// ═══════════════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════════════
function renderAdmin(){
  const nD=dimN(),nA=STUDENTS.length-nD;
  const tot=totalG(),pct=nA>0?Math.round(tot/(nA*SUBJECTS.length)*100):0;
  const isT=!!App.teacher.isTutor,isS=!!App.teacher.isSegreteria;
  const isRO=isS; // tutor can edit; only segreteria is read-only
  const panelTitle=isT?"Pannello Tutor":isS?"Pannello Segreteria":"Pannello Admin";
  document.body.innerHTML=`
${headerHTML(panelTitle,false)}
${bannerHTML()}
${isRO?`<div class="info-box info-blue" style="margin:8px 14px;border-radius:10px">👁 Modalità <strong>Segreteria</strong> — solo visualizzazione.</div>`:""}
<div class="stats-4" style="padding:10px 14px 0;max-width:480px;margin:0 auto">
  <div class="stat-box"><div class="stat-n">${nA}</div><div class="stat-l">Attivi</div></div>
  <div class="stat-box"><div class="stat-n" style="color:${nD>0?"#EF4444":"#94A3B8"}">${nD}</div><div class="stat-l">Dimessi</div></div>
  <div class="stat-box"><div class="stat-n">${tot}</div><div class="stat-l">Voti</div></div>
  <div class="stat-box"><div class="stat-n" style="font-size:20px">${pct}%</div><div class="stat-l">Compl.</div></div>
</div>
<div class="tab-bar">
  <button class="tab-btn${App.adminTab==="materie"?" active":""}" data-tab="materie">📖 Materie</button>
  <button class="tab-btn${App.adminTab==="alunni"?" active":""}" data-tab="alunni">👥 Alunni</button>
  <button class="tab-btn${App.adminTab==="riepilogo"?" active":""}" data-tab="riepilogo">📊 Riepilogo</button>
  ${App.teacher.isAdmin?`<button class="tab-btn${App.adminTab==="impostazioni"?" active":""}" data-tab="impostazioni">⚙️ PIN</button><button class="tab-btn${App.adminTab==="log"?" active":""}" data-tab="log">📋 Log</button>`:""}
</div>
<div id="admin-body" class="page-wrap"></div>
<div id="toast" class="toast"></div>`;
  attachHeader(false);
  $$(".tab-btn[data-tab]").forEach(btn=>{
    btn.addEventListener("click",function(){App.adminTab=this.dataset.tab;$$(".tab-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===App.adminTab));renderAdminBody();});
  });
  renderAdminBody();
}

function renderAdminBody(){
  const ab=$("#admin-body");
  ab.classList.toggle("page-wrap-wide", App.adminTab==="riepilogo");
  if(App.adminTab==="materie")renderAdminMaterie();
  else if(App.adminTab==="alunni")renderAdminAlunni();
  else if(App.adminTab==="impostazioni")renderAdminImpostazioni();
  else if(App.adminTab==="log")renderAdminLog();
  else renderAdminRiepilogo();
}

function renderAdminMaterie(){
  const el=$("#admin-body");
  const isT=!!App.teacher.isTutor;
  const isRO=!!App.teacher.isSegreteria; // tutor can edit grades but NOT category
  const canEditCond=App.teacher.isAdmin||App.teacher.isTutor;
  el.innerHTML=`
    ${isPrivileged()?`<button class="btn-green" id="btn-xls"><span style="font-size:22px">📥</span><div><div class="btn-lbl-big">Esporta Excel Completo</div><div class="btn-lbl-small">Tutte le materie · medie · colori</div></div></button>`:""}
    <button class="btn-print-grid" id="btn-mat-print"><span style="font-size:22px">🖨️</span><div><div class="btn-lbl-big">Stampa Griglia A4</div><div class="btn-lbl-small">HTML stampabile · 1 pagina landscape</div></div></button>
    ${App.teacher.isAdmin?`<button class="btn-print-grid" id="btn-pagelle" style="background:linear-gradient(135deg,#7C3AED,#5B21B6)"><span style="font-size:22px">📋</span><div><div class="btn-lbl-big">Genera Pagelle</div><div class="btn-lbl-small">DOCX + HTML · tutti gli alunni attivi</div></div></button>`:""}
    ${App.teacher.isAdmin?`<button class="btn-print-grid" id="btn-pagelle-interm" style="background:linear-gradient(135deg,#0369A1,#0F2557)"><span style="font-size:22px">📄</span><div><div class="btn-lbl-big">Pagellino Intermedio</div><div class="btn-lbl-small">Solo HTML · senza DOCX · 50% del percorso</div></div></button>`:""}
    ${App.teacher.isAdmin?`<button class="btn-import" id="btn-import"><span style="font-size:22px">📤</span><div><div class="btn-lbl-big">Importa Voti da File</div><div class="btn-lbl-small">CSV o Excel — aggiorna i voti dal file</div></div></button>`:""}
    ${isT?`<div class="info-box info-green">✏️ <strong>Tutor</strong> — Tocca una materia per inserire o modificare i voti di tutti gli alunni della classe.</div>`:!isRO?`<div class="info-box info-blue">Assegna ogni materia al corso giusto. Le materie <strong>Comuni</strong> sono visibili per tutti gli alunni; le esclusive solo per il corso assegnato.</div>`:""}
    ${App.teacher.isAdmin?(()=>{const noDoc=SUBJECTS.filter(s=>!s.conductaOnly&&!docNameOf(s.id));return noDoc.length>0?`<div class="info-box info-yellow">⚠️ <strong>${noDoc.length} materie senza docente assegnato:</strong> ${noDoc.map(s=>s.short).join(", ")} — usa il pulsante <strong>👤 Assegna docente</strong> su ciascuna.</div>`:"";})():""}
    <div class="card">
      <div class="card-head"><span class="sec-lbl">📖 Materie e corso</span></div>
      ${SUBJECTS.map(s=>{
        const mc=corsM(s.id);
        const sts=studentsForSubject(s.id);
        const done=sts.filter(_=>!!App.grades[s.id]?.[STUDENTS.indexOf(_)]).length;
        const pct=sts.length>0?Math.round(done/sts.length*100):0;
        const col=pct===100?"#059669":pct>0?"#3B82F6":"#CBD5E1";
        const bg=pct===100?"#ECFDF5":pct>0?"#EFF6FF":"#F8FAFC";
        const isCond=!!s.conductaOnly;
        // Tutor: can enter and edit all subjects. Segreteria: can enter and view (read-only handled in renderGrades)
        const clickable=App.teacher.isAdmin||App.teacher.isTutor||App.teacher.isSegreteria||(!isCond);
        return`<div class="st-mgmt" ${isCond?`style="background:#F5F3FF11;border-left:3px solid #7C3AED"`:""}>
          <div class="row-btn" style="flex:1;padding:10px 0;gap:8px;display:flex;align-items:center;cursor:${clickable?"pointer":"default"}" ${clickable?`data-sid="${s.id}"`:""}>
            <div class="row-icon" style="width:32px;height:32px;font-size:15px">${s.emoji}</div>
            <div class="row-body">
              <div class="row-name" style="font-size:12px;color:${isCond?"#7C3AED":"inherit"}">${s.label}${isCond?` <span style="font-size:10px;background:#F5F3FF;color:#7C3AED;border-radius:4px;padding:1px 5px">Media dei docenti</span>`:""}</div>
              <div class="row-meta">
                ${isCond?"Voto di condotta":docNameOf(s.id)?`👤 ${docNameOf(s.id)}${App.docenteMaterie[s.id]?` <span style="font-size:9px;background:#FEF3C7;color:#92400E;border-radius:3px;padding:1px 4px">override</span>`:""}`:`<span style="color:#EF4444;font-weight:700">⚠️ Nessun docente</span>`}
                &nbsp;· ${done}/${sts.length}
              </div>
            </div>
            <div class="prog-col">
              <span class="prog-pill" style="background:${bg};color:${col};font-size:10px">${pct}%</span>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;align-items:flex-end">
            ${(App.teacher.isAdmin||App.teacher.isTutor)?(()=>{const locked=!!App.subjectsLocked[s.id];return`<button class="btn-subj-lock" data-lock="${s.id}" style="height:26px;padding:0 10px;background:${locked?"#7F1D1D":"#F0FDF4"};border:1px solid ${locked?"#DC2626":"#A7F3D0"};border-radius:7px;font-size:11px;font-weight:800;color:${locked?"white":"#065F46"};cursor:pointer;white-space:nowrap;transition:all .15s">${locked?"🔒 Chiusa":"🔓 Aperta"}</button>`;})():""}
            ${(!isRO&&!isT&&!isCond)?`<select class="cors-sel" data-cors-m="${s.id}">
              <option value="comune"${mc==="comune"?" selected":""}>⭐ Comune</option>
              <option value="${COURSE_TRACKS.track1.id}"${mc===COURSE_TRACKS.track1.id?" selected":""}>${COURSE_TRACKS.track1.emoji} ${COURSE_TRACKS.track1.label}</option>
              ${COURSE_TRACKS.track2.id?`<option value="${COURSE_TRACKS.track2.id}"${mc===COURSE_TRACKS.track2.id?" selected":""}>${COURSE_TRACKS.track2.emoji} ${COURSE_TRACKS.track2.label}</option>`:""}
            </select>`:(!isCond?corsoBadge(mc):"")}
            ${App.teacher.isAdmin&&!isCond?`<button class="btn-assign-doc" data-assign="${s.id}" style="height:26px;padding:0 8px;background:${docNameOf(s.id)?"#F1F5F9":"#FEF3C7"};border:1px solid ${docNameOf(s.id)?"#E2E8F0":"#FDE68A"};border-radius:7px;font-size:10px;font-weight:700;color:${docNameOf(s.id)?"#64748B":"#92400E"};cursor:pointer;white-space:nowrap">👤 ${docNameOf(s.id)?"Cambia":"Assegna docente"}</button>`:""}
            ${App.teacher.isAdmin&&!isCond?`<button class="btn-schede" data-schede="${s.id}" style="height:26px;padding:0 8px;background:${done>0?"#065F46":"#F0FDF4"};border:1px solid ${done>0?"#059669":"#A7F3D0"};border-radius:7px;font-size:10px;font-weight:700;color:${done>0?"white":"#059669"};cursor:pointer;white-space:nowrap">📄 ${done>0?"Schede ("+done+")":"Schede"}</button>`:""}
          </div>
        </div>`;
      }).join("")}
    </div>`;
  const bxls=$("#btn-xls");if(bxls)bxls.addEventListener("click",()=>{const wb=buildWB(null);XLSX.writeFile(wb,xlsFilename());toast("✅ Excel esportato!","ok");});
  const bmp=$("#btn-mat-print");if(bmp)bmp.addEventListener("click",exportGridHtml);
  if(App.teacher.isAdmin){
    const bpg=$("#btn-pagelle");if(bpg)bpg.addEventListener("click",exportPagelleZip);
    const bpi=$("#btn-pagelle-interm");if(bpi)bpi.addEventListener("click",exportPagellineIntermHtml);
    const bi=$("#btn-import");if(bi)bi.addEventListener("click",openImportModal);
  }
  $$(".btn-subj-lock[data-lock]").forEach(btn=>{btn.addEventListener("click",function(e){e.stopPropagation();toggleSubjectLock(this.dataset.lock);});});
  if(!isRO){
    $$(".cors-sel[data-cors-m]").forEach(sel=>{sel.addEventListener("change",function(){setCorsMateria(this.dataset.corsM,this.value);});});
  }
  if(App.teacher.isAdmin){
    $$(".btn-assign-doc[data-assign]").forEach(btn=>{btn.addEventListener("click",function(e){e.stopPropagation();openAssignTeacherModal(this.dataset.assign);});});
    $$(".btn-schede[data-schede]").forEach(btn=>{btn.addEventListener("click",function(e){e.stopPropagation();openSchedeTipoModal(this.dataset.schede);});});
  }
  $$("#admin-body [data-sid]").forEach(btn=>{btn.addEventListener("click",function(){App.subjId=this.dataset.sid;App.edits={};App.page="grades";renderGrades();});});
}

// ── Modal selezione tipo scheda (Teorica / Pratica) ──────────────────────────
function openSchedeTipoModal(sid){
  const subj=SUBJECTS.find(s=>s.id===sid);
  if(!subj)return;
  const existing=document.getElementById("modal-schede-tipo");
  if(existing)existing.remove();
  const modal=document.createElement("div");
  modal.id="modal-schede-tipo";
  modal.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px";
  modal.innerHTML=`
<div style="background:white;border-radius:18px;padding:24px 22px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.35)">
  <div style="font-size:20px;font-weight:900;color:#0F172A;margin-bottom:6px">📄 Tipo di Materia</div>
  <div style="font-size:13px;color:#475569;margin-bottom:20px">Seleziona il tipo per <strong>${subj.label}</strong>. La scheda cambia la sezione <em>Prove Pratiche</em>.</div>
  <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
    <button id="btn-tipo-teorica" style="display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#1E3A5F,#2563EB);border:none;border-radius:12px;padding:14px 16px;color:white;cursor:pointer;text-align:left">
      <span style="font-size:26px">📝</span>
      <div>
        <div style="font-size:14px;font-weight:800">Materia TEORICA</div>
        <div style="font-size:11px;opacity:.8;margin-top:2px">Solo Prove Scritte — senza sezione Prove Pratiche</div>
      </div>
    </button>
    <button id="btn-tipo-pratica" style="display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,#065F46,#059669);border:none;border-radius:12px;padding:14px 16px;color:white;cursor:pointer;text-align:left">
      <span style="font-size:26px">🔧</span>
      <div>
        <div style="font-size:14px;font-weight:800">Materia PRATICA</div>
        <div style="font-size:11px;opacity:.8;margin-top:2px">Prove Scritte + Prove Pratiche (area tecnico-professionale)</div>
      </div>
    </button>
  </div>
  <button id="btn-tipo-annulla" style="width:100%;background:#F1F5F9;border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:700;color:#64748B;cursor:pointer">Annulla</button>
</div>`;
  document.body.appendChild(modal);
  document.getElementById("btn-tipo-teorica").addEventListener("click",()=>{modal.remove();exportSchedeZip(sid,false);});
  document.getElementById("btn-tipo-pratica").addEventListener("click",()=>{modal.remove();exportSchedeZip(sid,true);});
  document.getElementById("btn-tipo-annulla").addEventListener("click",()=>modal.remove());
  modal.addEventListener("click",e=>{if(e.target===modal)modal.remove();});
}
function renderAdminAlunni(){
  const el=$("#admin-body");
  const isT=!!App.teacher.isTutor;
  const isAdm=!!App.teacher.isAdmin;
  const isRO=!!App.teacher.isSegreteria;
  const accN=STUDENTS.filter((_,i)=>corsS(i)===COURSE_TRACKS.track1.id&&!App.dimessi[i]&&!App.trasferiti[i]).length;
  const estN=STUDENTS.filter((_,i)=>corsS(i)===COURSE_TRACKS.track2.id&&!App.dimessi[i]&&!App.trasferiti[i]).length;
  const unN=STUDENTS.filter((_,i)=>!corsS(i)&&!App.dimessi[i]&&!App.trasferiti[i]).length;
  const nDim=dimN(),nTras=trasN();
  const isMonopercorso=!COURSE_TRACKS.track2||!COURSE_TRACKS.track2.id;
  const amm=App.ammissioni||{};

  // Helper: input data GG-MM-AAAA con picker (usa type=date internamente, mostra DD-MM-YYYY)
  const dateInp=(id,val,cls,dataAttr,placeholder)=>{
    const isoVal=toIso(val||"");
    return`<input id="${id||""}" type="date" class="${cls||"inp"}" ${dataAttr||""} style="font-size:11px;padding:4px 6px;border:1px solid #E2E8F0;border-radius:6px;color:#0F172A;min-width:110px" value="${isoVal}" title="${placeholder||"GG-MM-AAAA"}">`;
  };

  el.innerHTML=`
    <div style="display:grid;grid-template-columns:${isMonopercorso?'repeat(3,1fr)':`repeat(${isAdm?'5':'4'},1fr)`};gap:8px">
      ${isMonopercorso?'':`<div class="stat-box"><div class="stat-n" style="font-size:18px;color:#1D4ED8">${accN}</div><div class="stat-l" style="font-size:10px">${COURSE_TRACKS.track1.short}</div></div>`}
      ${isMonopercorso?'':`<div class="stat-box"><div class="stat-n" style="font-size:18px;color:#7C3AED">${estN}</div><div class="stat-l" style="font-size:10px">${COURSE_TRACKS.track2.short}</div></div>`}
      ${isMonopercorso?`<div class="stat-box"><div class="stat-n" style="font-size:18px;color:#0F172A">${activeStudents().length}</div><div class="stat-l">Attivi</div></div>`:''} 
      <div class="stat-box"><div class="stat-n" style="font-size:18px;color:${nDim>0?'#EF4444':'#94A3B8'}">${nDim}</div><div class="stat-l">Dimessi</div></div>
      <div class="stat-box"><div class="stat-n" style="font-size:18px;color:${nTras>0?'#EA580C':'#94A3B8'}">${nTras}</div><div class="stat-l">Trasfr.</div></div>
      ${isAdm?`<div class="stat-box"><div class="stat-n" style="font-size:18px;color:#94A3B8">${unN}</div><div class="stat-l">Da assegn.</div></div>`:''}
    </div>
    ${!isT?`<div class="info-box info-yellow">⚠️ Assegna ogni alunno al corso. I <strong>DIMESSI</strong> e i <strong>TRASFERITI</strong> non sono visibili ai docenti.</div>`
           :`<div class="info-box info-green">✅ Tutor — puoi visualizzare lo stato degli alunni della classe.</div>`}

    ${(!isRO&&!isT)?`<div class="card" style="margin-bottom:10px">
      <div class="card-head"><span class="sec-lbl">📅 Date di Ammissione</span></div>
      <div style="padding:10px 14px">
        <div style="font-size:12px;color:#64748B;margin-bottom:10px">Imposta la data predefinita uguale per tutti, poi sovrascrivila per singolo alunno. Formato: <strong>GG-MM-AAAA</strong>.</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <label style="font-size:12px;font-weight:700;color:#0F172A;white-space:nowrap">Data predefinita:</label>
          ${dateInp("amm-default-inp", amm.defaultDate||"", "inp", "", "GG-MM-AAAA")}
          <button id="btn-amm-default" style="background:linear-gradient(135deg,#1B3F8B,#2563EB);color:white;border:none;border-radius:9px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">💾 Applica a tutti</button>
        </div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#64748B;margin-bottom:6px">🔧 Override per singolo alunno</div>
        <div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;max-height:220px;overflow-y:auto">
          ${STUDENTS.map((st,i)=>{
            const ov=amm.overrides?.[i]||"";
            const dim=!!App.dimessi[i];
            return`<div style="display:flex;align-items:center;padding:7px 12px;border-bottom:1px solid #F1F5F9;gap:8px;background:${dim?"#FEF2F255":"white"}">
              <span style="font-size:11px;font-weight:700;color:${dim?"#94A3B8":"#0F172A"};flex:1;min-width:0">${fmtName(st.name)}${dim?` <em style="color:#EF4444;font-size:9px">(dim.)</em>`:""}</span>
              ${dateInp("", ov, "amm-ov-inp", `data-amm-i="${i}"`, toDmy(amm.defaultDate)||"GG-MM-AAAA")}
              ${ov?`<button class="amm-ov-clear" data-amm-clear="${i}" style="font-size:10px;background:#FEF2F2;color:#EF4444;border:1px solid #FECACA;border-radius:6px;padding:3px 7px;cursor:pointer;white-space:nowrap">✕</button>`:""}
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`:""}

    ${isAdm&&Object.keys(App.dimessi||{}).length>0?`<div class="card" style="margin-bottom:10px">
      <div class="card-head"><span class="sec-lbl">🚫 Date di Dimissione</span><span style="font-size:10px;color:#EF4444">${Object.keys(App.dimessi).length} dimess${Object.keys(App.dimessi).length===1?"o":"i"}</span></div>
      <div style="padding:10px 14px">
        <div style="font-size:12px;color:#64748B;margin-bottom:8px">Inserisci la data di dimissione per gli alunni ritirati. Formato: <strong>GG-MM-AAAA</strong>.</div>
        <div style="border:1px solid #FECACA;border-radius:10px;overflow:hidden">
          ${STUDENTS.map((st,i)=>{
            const dim=!!App.dimessi[i];
            if(!dim)return"";
            const dv=getDimDate(i)||"";
            return`<div style="display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid #FEF2F2;gap:8px;background:#FFF5F5">
              <div style="width:28px;height:28px;border-radius:8px;background:#FEF2F2;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#EF4444;flex-shrink:0">${st.num}</div>
              <span style="font-size:12px;font-weight:700;color:#991B1B;flex:1;min-width:0">${fmtName(st.name)}</span>
              <label style="font-size:10px;color:#64748B;white-space:nowrap">Data dim.:</label>
              ${dateInp("", dv, "dim-date-inp", `data-dim-i="${i}"`, "GG-MM-AAAA")}
              ${dv?`<button class="dim-date-clear" data-dim-clear="${i}" style="font-size:10px;background:#FEF2F2;color:#EF4444;border:1px solid #FECACA;border-radius:6px;padding:3px 7px;cursor:pointer;white-space:nowrap">✕</button>`:""}
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`:""}

    ${isAdm&&Object.keys(App.trasferiti||{}).length>0?`<div class="card" style="margin-bottom:10px">
      <div class="card-head"><span class="sec-lbl">🔄 Date di Trasferimento</span><span style="font-size:10px;color:#EA580C">${Object.keys(App.trasferiti).length} trasferit${Object.keys(App.trasferiti).length===1?"o":"i"}</span></div>
      <div style="padding:10px 14px">
        <div style="font-size:12px;color:#64748B;margin-bottom:8px">Inserisci la data di trasferimento per gli alunni trasferiti. Formato: <strong>GG-MM-AAAA</strong>.</div>
        <div style="border:1px solid #FED7AA;border-radius:10px;overflow:hidden">
          ${STUDENTS.map((st,i)=>{
            const tr=!!App.trasferiti[i];
            if(!tr)return"";
            const tv=getTrasDate(i)||"";
            return`<div style="display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid #FFF7ED;gap:8px;background:#FFF7ED">
              <div style="width:28px;height:28px;border-radius:8px;background:#FFF7ED;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#EA580C;flex-shrink:0">${st.num}</div>
              <span style="font-size:12px;font-weight:700;color:#9A3412;flex:1;min-width:0">${fmtName(st.name)}</span>
              <label style="font-size:10px;color:#64748B;white-space:nowrap">Data trasfr.:</label>
              ${dateInp("", tv, "tras-date-inp", `data-tras-i="${i}"`, "GG-MM-AAAA")}
              ${tv?`<button class="tras-date-clear" data-tras-clear="${i}" style="font-size:10px;background:#FFF7ED;color:#EA580C;border:1px solid #FED7AA;border-radius:6px;padding:3px 7px;cursor:pointer;white-space:nowrap">✕</button>`:""}
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`:""}

    <div class="card">
      <div class="card-head"><span class="sec-lbl">👥 Gestione alunni — ${STUDENTS.length} iscritti</span></div>
      ${STUDENTS.map((st,i)=>{
        const dim=!!App.dimessi[i],tr=!!App.trasferiti[i];
        const cs=corsS(i);
        const inactive=dim||tr;
        const ma=inactive?null:calcMedia(i,SUBJECTS),mp=inactive?null:calcMP(i,SUBJECTS);
        const maS=ma!==null?ma.toFixed(1):"—",mpS=mp!==null?mp.toFixed(1):"—";
        const maC=ma!==null?gradeColor(ma):"#94A3B8";
        const mpC=mp!==null?gradeColor(mp):"#94A3B8";
        const dd=getDimDate(i),td=getTrasDate(i);
        const rowStyle=dim?"opacity:.6;background:#FEF2F255":tr?"opacity:.75;background:#FFF7ED88":"";
        const numStyle=dim?"background:#FEF2F2;color:#EF4444":tr?"background:#FFF7ED;color:#EA580C":"";
        return`<div class="st-mgmt" style="${rowStyle}">
          <div class="s-num" style="${numStyle}">${st.num}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:${dim?"#94A3B8":tr?"#C2410C":"#0F172A"}">${fmtName(st.name)}</div>
            ${dim
              ?`<div style="font-size:10px;color:#EF4444;font-weight:700">🚫 DIMESSO${dd?` — <span style="color:#DC2626">dal ${dd}</span>`:""}</div>`
              :tr
              ?`<div style="font-size:10px;color:#EA580C;font-weight:700">🔄 TRASFERITO${td?` — <span style="color:#C2410C">dal ${td}</span>`:""}</div>`
              :`<div style="font-size:10px;color:#64748B">M.A.: <span style="color:${maC};font-weight:700">${maS}</span> &nbsp;M.P.: <span style="color:${mpC};font-weight:700">${mpS}</span></div>`}
          </div>
          ${(!isRO&&!isT&&!inactive)?`<select class="cors-sel" data-cors-s="${i}">
            <option value=""${!cs?" selected":""}>— Nessuno</option>
            <option value="${COURSE_TRACKS.track1.id}"${cs===COURSE_TRACKS.track1.id?" selected":""}>${COURSE_TRACKS.track1.emoji} ${COURSE_TRACKS.track1.short}</option>
            ${COURSE_TRACKS.track2.id?`<option value="${COURSE_TRACKS.track2.id}"${cs===COURSE_TRACKS.track2.id?" selected":""}>${COURSE_TRACKS.track2.emoji} ${COURSE_TRACKS.track2.short}</option>`:""}
          </select>`:(!inactive?corsoBadge(cs):"")}          ${(!isRO&&!isT)?`<button class="btn-dim${dim?" on":""}" data-dim="${i}" style="${tr?"opacity:.35;pointer-events:none":""}">${dim?"✅ Riattiva":"🚫 Dimetti"}</button>`:""}          ${isAdm?`<button class="btn-tras${tr?" on":""}" data-tras="${i}" style="font-size:11px;padding:5px 9px;background:${tr?"#EA580C":"#FFF7ED"};color:${tr?"white":"#EA580C"};border:1.5px solid ${tr?"#EA580C":"#FED7AA"};border-radius:8px;cursor:pointer;font-weight:700;white-space:nowrap">${tr?"↩ Riattiva":"🔄 Trasferito"}</button>`:""}        </div>`;
      }).join("")}
    </div>`;

  if(!isRO&&!isT){
    // Data ammissione default
    const btnDef=$("#btn-amm-default");
    if(btnDef)btnDef.addEventListener("click",()=>{
      const val=toIso($("#amm-default-inp").value);
      saveAmmDefault(toDmy(val)).then(()=>renderAdminAlunni());
    });
    // Override ammissione per singolo alunno
    $$(".amm-ov-inp[data-amm-i]").forEach(inp=>{
      inp.addEventListener("change",function(){
        const i=parseInt(this.dataset.ammI);
        saveAmmOverride(i,toDmy(this.value)).then(()=>renderAdminAlunni());
      });
    });
    $$(".amm-ov-clear[data-amm-clear]").forEach(btn=>{
      btn.addEventListener("click",function(){
        const i=parseInt(this.dataset.ammClear);
        saveAmmOverride(i,"").then(()=>renderAdminAlunni());
      });
    });
    // Data dimissione per alunni dimessi (solo admin)
    if(isAdm){
      $$(".dim-date-inp[data-dim-i]").forEach(inp=>{
        inp.addEventListener("change",function(){
          const i=parseInt(this.dataset.dimI);
          saveDimDate(i,toDmy(this.value)).then(()=>renderAdminAlunni());
        });
      });
      $$(".dim-date-clear[data-dim-clear]").forEach(btn=>{
        btn.addEventListener("click",function(){
          const i=parseInt(this.dataset.dimClear);
          saveDimDate(i,"").then(()=>renderAdminAlunni());
        });
      });
    }
    $$(".cors-sel[data-cors-s]").forEach(sel=>{sel.addEventListener("change",function(){setCorsStudente(parseInt(this.dataset.corsS),this.value);});});
    $$(".btn-dim[data-dim]").forEach(btn=>{btn.addEventListener("click",function(){toggleDimesso(parseInt(this.dataset.dim));});});
    // Trasferiti — solo admin
    if(isAdm){
      $$(".btn-tras[data-tras]").forEach(btn=>{btn.addEventListener("click",function(){toggleTrasferito(parseInt(this.dataset.tras));});});
      $$(".tras-date-inp[data-tras-i]").forEach(inp=>{
        inp.addEventListener("change",function(){
          const i=parseInt(this.dataset.trasI);
          saveTrasDate(i,toDmy(this.value)).then(()=>renderAdminAlunni());
        });
      });
      $$(".tras-date-clear[data-tras-clear]").forEach(btn=>{
        btn.addEventListener("click",function(){
          const i=parseInt(this.dataset.trasClear);
          saveTrasDate(i,"").then(()=>renderAdminAlunni());
        });
      });
    }
  }
}

function renderAdminRiepilogo(){
  const el=$("#admin-body");
  const sts=activeStudents();
  el.innerHTML=`
    <div class="card" style="max-width:100%"><div class="card-head"><span class="sec-lbl">📊 Griglia completa — Classe ${CLASSE}</span><span style="font-size:10px;color:#CBD5E1">← scorri →</span></div>
    ${makeSummaryTable(SUBJECTS.filter(s=>!s.conductaOnly),sts,isPrivileged())}</div>
    <div class="legend">
      <div class="leg"><span class="leg-dot" style="background:#EF4444"></span>&lt; 6</div>
      <div class="leg"><span class="leg-dot" style="background:#CA8A04"></span>6</div>
      <div class="leg"><span class="leg-dot" style="background:#D97706"></span>7–8</div>
      <div class="leg"><span class="leg-dot" style="background:#059669"></span>9–10</div>
      <div class="leg"><span class="leg-dot" style="background:#1D4ED8"></span>Media Aritm.</div>
      <div class="leg"><span class="leg-dot" style="background:#92400E"></span>Media Pond.</div>
      ${isPrivileged()?`<div class="leg"><span class="leg-dot" style="background:#7C3AED"></span>Condotta</div>`:""}
      <div class="leg" style="color:#94A3B8"><em>N/A = materia non del corso</em></div>
    </div>
    <button class="btn-green" id="btn-xls2"><span style="font-size:20px">📥</span><div><div class="btn-lbl-big">Esporta Excel Completo</div><div class="btn-lbl-small">Tutti i voti · medie · voto finale</div></div></button>
    <button class="btn-print-grid" id="btn-grid-print"><span style="font-size:20px">🖨️</span><div><div class="btn-lbl-big">Stampa Griglia A4</div><div class="btn-lbl-small">HTML stampabile · 1 pagina landscape</div></div></button>
    ${App.teacher.isSegreteria?`<button class="btn-green" id="btn-backup-seg" style="background:linear-gradient(135deg,#0F172A,#1E3A5F)"><span style="font-size:20px">💾</span><div><div class="btn-lbl-big">BACKUP GENERALE</div><div class="btn-lbl-small">Esporta tutte le 5 classi in un unico Excel</div></div></button>`:""}`;
  const b=$("#btn-xls2");if(b)b.addEventListener("click",()=>{const wb=buildWB(null);XLSX.writeFile(wb,xlsFilename());toast("✅ Excel esportato!","ok");});
  const gp=$("#btn-grid-print");if(gp)gp.addEventListener("click",exportGridHtml);
  const bbs=$("#btn-backup-seg");if(bbs)bbs.addEventListener("click",buildBackupAllClasses);
}

async function resetAllPins(){
  if(!confirm("⚠️ Resettare i PIN?\n• Tutti i docenti → 1234\n• Tutor → "+TUTOR_PIN+"\n• Segreteria → "+SEGRETERIA_PIN+"\n\nIl PIN Admin non viene toccato."))return;
  const btn=$("#btn-reset-pin");btn.textContent="⏳ Reset in corso...";btn.disabled=true;
  try{
    const updates={};
    TEACHERS.forEach(t=>{updates["pins/"+t.id]=DEFAULT_PIN;App.pins[t.id]=DEFAULT_PIN;});
    Object.keys(App.customTeachers||{}).forEach(tid=>{updates["pins/"+tid]=DEFAULT_PIN;App.pins[tid]=DEFAULT_PIN;});
    if(DB)await fbRef("").update(updates);
    // Reset tutor e segreteria in memoria (non su Firebase)
    App.pins["tutor"]=TUTOR_PIN;
    App.pins["segreteria"]=SEGRETERIA_PIN;
    toast("✅ Tutti i PIN resettati ai valori predefiniti","ok");
    renderAdminImpostazioni();
  }catch(e){toast("❌ Errore durante il reset","err");}
  if(btn){btn.textContent="🔄 Reset tutti i PIN";btn.disabled=false;}
}

function renderAdminImpostazioni(){
  const el=$("#admin-body");
  el.innerHTML=`
    <div class="info-box info-yellow">⚠️ Il reset riporta i PIN di tutti i docenti, Tutor e Segreteria ai valori predefiniti. Il PIN Admin non viene modificato.</div>
    <div class="pin-card">
      <div style="font-size:16px;font-weight:800;margin-bottom:16px">🔐 PIN Accessi Speciali</div>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:12px;margin-bottom:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F1F5F9">
          <span style="font-size:13px;font-weight:700">👑 Amministratore</span>
          <span class="corso-badge" style="background:#FEF3C7;color:#92400E;font-size:11px">PIN: ${ADMIN_PIN} (fisso)</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F1F5F9">
          <span style="font-size:13px;font-weight:700">👁 Tutor — ${TUTOR_NAME}</span>
          <span class="corso-badge cb-com" style="font-size:11px">PIN: ${App.pins["tutor"]||TUTOR_PIN}</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F1F5F9">
          <span style="font-size:13px;font-weight:700">🗂 Segreteria</span>
          <span class="corso-badge" style="background:#E0F2FE;color:#0369A1;font-size:11px">PIN: ${App.pins["segreteria"]||SEGRETERIA_PIN}</span>
        </div>
      </div>
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#64748B">📖 PIN Docenti</div>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:12px;margin-bottom:16px;max-height:220px;overflow-y:auto">
        ${TEACHERS.map(t=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #F1F5F9">
          <span style="font-size:12px;font-weight:600">${t.label}</span>
          <span class="corso-badge cb-com" style="font-size:10px">PIN: ${App.pins[t.id]||DEFAULT_PIN}</span>
        </div>`).join("")}
        ${Object.values(App.customTeachers||{}).map(t=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #F1F5F9">
          <span style="font-size:12px;font-weight:600">${t.label} <span style="font-size:9px;background:#FEF3C7;color:#92400E;border-radius:3px;padding:1px 4px">nuovo</span></span>
          <span class="corso-badge" style="background:#FEF3C7;color:#92400E;font-size:10px">PIN: ${App.pins[t.id]||DEFAULT_PIN}</span>
        </div>`).join("")}
      </div>
      <button class="btn-primary" id="btn-reset-pin" style="background:linear-gradient(135deg,#DC2626,#B91C1C);box-shadow:0 4px 14px #DC262644">
        🔄 Reset tutti i PIN ai valori predefiniti
      </button>
      <p style="font-size:11px;color:#94A3B8;text-align:center;margin-top:10px">
        Docenti → <strong>1234</strong> &nbsp;|&nbsp; Tutor → <strong>${TUTOR_PIN}</strong> &nbsp;|&nbsp; Segreteria → <strong>${SEGRETERIA_PIN}</strong>
      </p>
    </div>`;
  $("#btn-reset-pin").addEventListener("click",resetAllPins);
}

// ═══════════════════════════════════════════════
//  LOG ACCESSI (solo Admin)
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
//  BACKUP GENERALE — tutte le 5 classi in un unico Excel (solo Admin)
// ═══════════════════════════════════════════════
async function buildBackupAllClasses(){
  if(!DB){toast("❌ Connessione Firebase non disponibile","err");return;}
  toast("⏳ Backup in corso — lettura dati da tutte le classi...","info");
  try{
    // Configurazioni per classe (usa i dati già caricati in memoria dai data_*.js)
    const cfgs=[
      {classe:"1E",prefix:"",  students:STUDENTS_1E_ORIG,subjects:SUBJECTS_1E_ORIG},
      {classe:"1D",prefix:"1D/",students:STUDENTS_1D,   subjects:SUBJECTS_1D},
      {classe:"1G",prefix:"1G/",students:STUDENTS_1G,   subjects:SUBJECTS_1G},
      {classe:"2C",prefix:"2C/",students:STUDENTS_2C,   subjects:SUBJECTS_2C},
      {classe:"2D",prefix:"2D/",students:STUDENTS_2D,   subjects:SUBJECTS_2D},
    ];
    const wb=XLSX.utils.book_new();
    const gRGB=v=>{const n=parseFloat(String(v).replace(",","."));return isNaN(n)?"3B82F6":n<6?"EF4444":n<7?"CA8A04":n<9?"D97706":"059669";};
    const TB={top:{style:"thin",color:{rgb:"BFBFBF"}},bottom:{style:"thin",color:{rgb:"BFBFBF"}},left:{style:"thin",color:{rgb:"BFBFBF"}},right:{style:"thin",color:{rgb:"BFBFBF"}}};

    for(const cfg of cfgs){
      const [gSnap,dSnap,tSnap]= await Promise.all([
        DB.ref(cfg.prefix+"grades").get(),
        DB.ref(cfg.prefix+"dimessi").get(),
        DB.ref(cfg.prefix+"trasferiti").get(),
      ]);
      const grades  = gSnap.exists() ? gSnap.val()  : {};
      const dimessi = dSnap.exists() ? dSnap.val()  : {};
      const tras    = tSnap.exists() ? tSnap.val()  : {};

      const subjCols=cfg.subjects.filter(s=>!s.conductaOnly);
      const condS=cfg.subjects.find(s=>s.id==="condotta");
      const cleanName=s=>s.label.replace(/^[A-Za-z0-9]+[Eeb\d]* - /,"");

      // Righe dati
      const rows=[
        [null,"BACKUP REGISTRO — Classe "+cfg.classe+" — A.S. "+ANNO,...Array(subjCols.length+2).fill(null)],
        ["N.","COGNOME NOME",...subjCols.map(s=>s.short+" - "+cleanName(s)),"Media Pond.","VOTO FINALE"],
        [null,"ORE h",...subjCols.map(s=>s.ore||"—"),null,""],
      ];

      cfg.students.forEach((st,i)=>{
        const dim=!!dimessi[i], tr=!!tras[i];
        const suffix=dim?" (DIMESSO)":tr?" (TRASFERITO)":"";
        const row=[st.num, st.name+suffix];
        let sv=0,sw=0;
        subjCols.forEach(s=>{
          const e=grades[s.id]?.[i];
          if(e){const n=parseFloat(String(e.value).replace(",","."));if(!isNaN(n)){sv+=n*s.ore;sw+=s.ore;}row.push(isNaN(n)?e.value:n);}
          else row.push(null);
        });
        const mp=sw>0?sv/sw:null;
        row.push(mp!==null?Math.round(mp*100)/100:null);
        let vf=null;
        if(mp!==null){const ce=condS?grades["condotta"]?.[i]:null;const cond=ce?parseFloat(String(ce.value).replace(",",".")):null;vf=(cond!==null&&!isNaN(cond)&&cond<=8)?Math.floor(mp):Math.round(mp);}
        row.push(vf);
        rows.push(row);
      });

      const ws=XLSX.utils.aoa_to_sheet(rows);
      const nc=2+subjCols.length+2;
      ws["!merges"]=[{s:{r:0,c:1},e:{r:0,c:nc-1}}];
      ws["!cols"]=[{wch:6},{wch:28},...subjCols.map(()=>({wch:7.5})),{wch:12},{wch:11}];
      ws["!rows"]=[{hpt:24},{hpt:100},{hpt:14},...cfg.students.map(()=>({hpt:18}))];
      ws["!freeze"]={xSplit:2,ySplit:3};

      // Stile header titolo
      const col=n=>n<26?String.fromCharCode(65+n):"A"+String.fromCharCode(65+n-26);
      const hdrStyle={fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb:"FDE68A"}},alignment:{horizontal:"left",vertical:"center"},border:TB};
      ws["A1"]={v:null,t:"z",s:{fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},border:TB}};
      ws["B1"]={v:"BACKUP REGISTRO — Classe "+cfg.classe+" — A.S. "+ANNO,t:"s",s:hdrStyle};
      for(let ci=2;ci<nc;ci++) ws[col(ci)+"1"]={v:null,t:"z",s:{fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},border:TB}};

      const hB={fill:{fgColor:{rgb:"1B3F8B"},patternType:"solid"},alignment:{horizontal:"center",vertical:"bottom",textRotation:90,wrapText:true},border:TB};
      ws["A2"]={v:"N.",t:"s",s:{...hB,font:{bold:true,sz:10,name:"Arial",color:{rgb:"FFFFFF"}},alignment:{horizontal:"center",vertical:"center"}}};
      ws["B2"]={v:"COGNOME NOME",t:"s",s:{...hB,font:{bold:true,sz:10,name:"Arial",color:{rgb:"FFFFFF"}},alignment:{horizontal:"left",vertical:"bottom",textRotation:0}}};
      subjCols.forEach((s,si)=>{ws[col(2+si)+"2"]={v:s.short,t:"s",s:{...hB,font:{bold:true,sz:9,name:"Arial",color:{rgb:"FFFFFF"}}}};});
      ws[col(2+subjCols.length)+"2"]={v:"Media Pond.",t:"s",s:{...hB,font:{bold:true,sz:9,name:"Arial",color:{rgb:"FDE68A"}},fill:{fgColor:{rgb:"78350F"},patternType:"solid"}}};
      ws[col(3+subjCols.length)+"2"]={v:"VOTO FINALE",t:"s",s:{...hB,font:{bold:true,sz:10,name:"Arial",color:{rgb:"FDE68A"}},fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},border:{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}}};

      // Stile righe alunni
      cfg.students.forEach((st,i)=>{
        const row=4+i,dim=!!dimessi[i],tr=!!tras[i];
        const rowBg=dim?"FEF2F2":tr?"FFF7ED":i%2===0?"FFFFFF":"F8FAFC";
        const nameColor=dim?"EF4444":tr?"EA580C":"0F172A";
        ws[col(0)+row]={v:st.num,t:"n",s:{font:{bold:true,sz:10,name:"Arial",color:{rgb:dim?"94A3B8":"475569"}},fill:{fgColor:{rgb:rowBg},patternType:"solid"},alignment:{horizontal:"center",vertical:"center"},border:TB}};
        ws[col(1)+row]={v:dim?st.name+" (DIMESSO)":tr?st.name+" (TRASFERITO)":st.name,t:"s",s:{font:{bold:true,sz:10,name:"Arial",color:{rgb:nameColor}},fill:{fgColor:{rgb:rowBg},patternType:"solid"},alignment:{horizontal:"left",vertical:"center"},border:TB}};
        for(let ci=2;ci<nc;ci++){
          const a=col(ci)+row;const ev=ws[a]?ws[a].v:null;
          const isMP=(ci===2+subjCols.length),isVF=(ci===3+subjCols.length);
          let s2;
          if(dim||tr){
            s2={fill:{fgColor:{rgb:rowBg},patternType:"solid"},font:{sz:9,name:"Arial",color:{rgb:"CBD5E1"}},alignment:{horizontal:"center"},border:TB};
          } else if(ev!=null){
            const rgb=gRGB(ev);
            if(isMP) s2={fill:{fgColor:{rgb:"FEF9C3"},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb}},alignment:{horizontal:"center",vertical:"center"},border:TB};
            else if(isVF) s2={fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},font:{bold:true,sz:13,name:"Arial",color:{rgb:"FDE68A"}},alignment:{horizontal:"center",vertical:"center"},border:{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}};
            else s2={fill:{fgColor:{rgb:rowBg},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb}},alignment:{horizontal:"center",vertical:"center"},border:TB};
          } else {
            const fg=isMP?"FEF9C3":isVF?"1A2E5A":rowBg;
            s2={fill:{fgColor:{rgb:fg},patternType:"solid"},font:{sz:9,name:"Arial",color:{rgb:"CBD5E1"}},alignment:{horizontal:"center"},border:isVF?{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}:TB};
          }
          ws[a]={v:ev,t:ev!=null&&typeof ev==="number"?"n":ev!=null?"s":"z",s:s2};
        }
      });

      XLSX.utils.book_append_sheet(wb,ws,("Cl."+cfg.classe+" "+ANNO.slice(0,4)).slice(0,31));
    }
    const today=new Date().toISOString().slice(0,10);
    const fname="BACKUP_Registro_ERIS_Ragusa_"+ANNO.replace("/","-")+"_"+today+".xlsx";
    XLSX.writeFile(wb,fname);
    toast("✅ Backup completato — 5 classi esportate in "+fname,"ok");
  }catch(e){console.error(e);toast("❌ Errore backup: "+e.message,"err");}
}

function renderAdminLog(){
  const el=$("#admin-body");
  const log=App.accessLog||{};
  // Build label map for all users
  const labelOf=uid=>{
    if(uid==="admin")return{icon:"👑",label:"Amministratore"};
    if(uid==="tutor")return{icon:"👁",label:"Tutor — "+TUTOR_NAME};
    if(uid==="segreteria")return{icon:"🗂",label:"Segreteria"};
    const t=TEACHERS.find(x=>x.id===uid)||(App.customTeachers||{})[uid];
    return t?{icon:"👨‍🏫",label:t.label}:{icon:"❓",label:uid};
  };
  // Flatten all events into array
  const events=[];
  Object.entries(log).forEach(([uid,entries])=>{
    Object.values(entries||{}).forEach(e=>{
      events.push({uid,ts:e.ts});
    });
  });
  // Sort newest first
  events.sort((a,b)=>b.ts.localeCompare(a.ts));

  // Per-user summary
  const summary={};
  events.forEach(e=>{
    if(!summary[e.uid])summary[e.uid]={count:0,last:e.ts};
    summary[e.uid].count++;
  });
  const summaryRows=Object.entries(summary).sort((a,b)=>b[1].count-a[1].count);

  // Format date helper
  const fmt=iso=>{
    try{
      const d=new Date(iso);
      return d.toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});
    }catch{return iso;}
  };

  el.innerHTML=`
    <button class="btn-green" id="btn-backup-all" style="background:linear-gradient(135deg,#0F172A,#1E3A5F);margin-bottom:12px"><span style="font-size:22px">💾</span><div><div class="btn-lbl-big">BACKUP GENERALE</div><div class="btn-lbl-small">Esporta tutte le 5 classi in un unico Excel</div></div></button>
    <div class="card" style="margin-bottom:10px">
      <div class="card-head"><span class="sec-lbl">📊 Riepilogo accessi</span><span style="font-size:10px;color:#94A3B8">${events.length} accessi totali</span></div>
      ${summaryRows.length===0?`<div style="padding:16px;text-align:center;font-size:13px;color:#94A3B8">Nessun accesso registrato</div>`:`
      <div style="padding:8px 0">
        ${summaryRows.map(([uid,d])=>{
          const u=labelOf(uid);
          const last=fmt(d.last);
          return`<div style="display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid #F1F5F9;gap:10px">
            <span style="font-size:20px">${u.icon}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:700;color:#0F172A">${u.label}</div>
              <div style="font-size:11px;color:#64748B">Ultimo: ${last}</div>
            </div>
            <div style="text-align:center;background:#EFF6FF;border-radius:10px;padding:6px 12px;min-width:44px">
              <div style="font-size:18px;font-weight:900;color:#1D4ED8;line-height:1">${d.count}</div>
              <div style="font-size:9px;color:#94A3B8;font-weight:600">accessi</div>
            </div>
          </div>`;
        }).join("")}
      </div>`}
    </div>
    <div class="card">
      <div class="card-head"><span class="sec-lbl">🕐 Cronologia completa</span>
        <button id="btn-clear-log" style="font-size:10px;background:#FEF2F2;color:#EF4444;border:1px solid #FECACA;border-radius:6px;padding:3px 8px;cursor:pointer;font-weight:700">🗑 Cancella log</button>
      </div>
      ${events.length===0?`<div style="padding:16px;text-align:center;font-size:13px;color:#94A3B8">Nessun accesso registrato</div>`:`
      <div style="max-height:52vh;overflow-y:auto">
        ${events.map((e,idx)=>{
          const u=labelOf(e.uid);
          const dt=fmt(e.ts);
          return`<div style="display:flex;align-items:center;padding:8px 14px;border-bottom:1px solid #F8FAFC;gap:8px;background:${idx%2===0?"white":"#FAFAFA"}">
            <span style="font-size:16px">${u.icon}</span>
            <div style="flex:1;min-width:0">
              <span style="font-size:12px;font-weight:700;color:#0F172A">${u.label}</span>
            </div>
            <span style="font-size:11px;color:#64748B;white-space:nowrap">${dt}</span>
          </div>`;
        }).join("")}
      </div>`}
    </div>`;
  $("#btn-backup-all").addEventListener("click",buildBackupAllClasses);
  $("#btn-clear-log").addEventListener("click",()=>{
    if(!confirm("Cancellare tutto il log degli accessi? L'operazione non è reversibile."))return;
    if(DB)fbRef("accessLog").remove().then(()=>{App.accessLog={};renderAdminLog();toast("🗑 Log cancellato","ok");});
  });
}


function renderPin(){
  const isTutor=!!App.teacher.isTutor;
  document.body.innerHTML=`
${headerHTML("Cambia PIN",true)}
<div class="page-wrap">
  <div class="pin-card">
    <p style="font-size:13px;color:#64748B;margin-bottom:18px;line-height:1.6">Modifica il PIN per <strong>${App.teacher.isAdmin?"Amministratore":isTutor?"Tutor":"Prof. "+App.teacher.label}</strong>.</p>
    ${isTutor?`<div class="info-box info-blue" style="margin-bottom:14px">ℹ️ Il PIN Tutor viene aggiornato solo per la sessione corrente.</div>`:""}
    <div class="pin-err" id="pin-err"></div>
    ${[["old-pin","PIN attuale"],["new-pin","Nuovo PIN (4 cifre)"],["cf-pin","Conferma nuovo PIN"]].map(([id,lbl])=>`
    <div class="field"><label class="lbl">${lbl}</label>
    <input id="${id}" class="inp pin-f" type="password" inputmode="numeric" maxlength="4" placeholder="• • • •" autocomplete="off">
    </div>`).join("")}
    <button class="btn-primary" id="btn-sav-pin">Salva nuovo PIN</button>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #F1F5F9">
      <button id="btn-change-class" style="width:100%;background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:10px;padding:11px 14px;font-size:13px;font-weight:700;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
        🏫 Cambia classe / Torna alla selezione
      </button>
    </div>
  </div>
</div>
<div id="toast" class="toast"></div>`;
  attachHeader(true);
  $("#btn-sav-pin").addEventListener("click",savePinFn);
  $("#btn-change-class").addEventListener("click",doLogout);
}


