// ═══════════════════════════════════════════════
//  logic.js — Utils, Firebase, Auth, Voti
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function fmtName(s){return s.split(" ").map(w=>w.charAt(0)+w.slice(1).toLowerCase()).join(" ");}
function gradeColor(v){if(!v)return"#94A3B8";const sv=String(v).trim().toUpperCase();if(sv==="NC")return"#EF4444";const n=parseFloat(sv.replace(",","."));if(isNaN(n))return"#3B82F6";if(n<6)return"#EF4444";if(n<7)return"#CA8A04";if(n<9)return"#D97706";return"#059669";}
function gradeBg(v){if(!v)return null;const sv=String(v).trim().toUpperCase();if(sv==="NC")return"#FEF2F2";const n=parseFloat(sv.replace(",","."));if(isNaN(n))return"#EFF6FF";if(n<6)return"#FEF2F2";if(n<7)return"#FEFCE8";if(n<9)return"#FFFBEB";return"#ECFDF5";}
// ─── Helpers docente per materia (con override admin via Firebase) ──────────
function docOf(sid){const ov=App.docenteMaterie[sid];return ov?ov.id:(SUBJECTS.find(s=>s.id===sid)?.doc||"");}
function docNameOf(sid){const ov=App.docenteMaterie[sid];if(ov)return ov.name;const d=SUBJECTS.find(s=>s.id===sid)?.doc||"";return d?(TN[d]||d):"";}
function docFullOf(sid){const ov=App.docenteMaterie[sid];if(ov)return ov.full;const d=SUBJECTS.find(s=>s.id===sid)?.doc||"";return d?(TE[d]||d):"";}
// ─── Conversione date GG-MM-AAAA ↔ YYYY-MM-DD ──────────────────────────────
// Usata per input type="date" (vuole ISO) vs storage/display (vuole GG-MM-AAAA)
function toDmy(s){
  // Accetta YYYY-MM-DD → DD-MM-YYYY; se già DD-MM-YYYY la restituisce tale quale
  if(!s)return"";
  if(/^\d{2}-\d{2}-\d{4}$/.test(s))return s; // già GG-MM-AAAA
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){const[y,m,d]=s.split("-");return`${d}-${m}-${y}`;}
  return s;
}
function toIso(s){
  // Accetta DD-MM-YYYY → YYYY-MM-DD; se già YYYY-MM-DD la restituisce tale quale
  if(!s)return"";
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s; // già ISO
  if(/^\d{2}-\d{2}-\d{4}$/.test(s)){const[d,m,y]=s.split("-");return`${y}-${m}-${d}`;}
  return s;
}

// ─── Data di ammissione ─────────────────────────────────────────────────────
function getAmmDate(i){
  const amm=App.ammissioni||{};
  return toDmy(amm.overrides?.[i]||amm.defaultDate||"");
}
async function saveAmmDefault(date){
  if(!App.ammissioni)App.ammissioni={defaultDate:"",overrides:{}};
  const dmy=toDmy(date);
  App.ammissioni.defaultDate=dmy;
  await fbSet("ammissioni/defaultDate",dmy||null);
  toast("📅 Data ammissione predefinita salvata","ok");
}
async function saveAmmOverride(i,date){
  if(!App.ammissioni)App.ammissioni={defaultDate:"",overrides:{}};
  if(!App.ammissioni.overrides)App.ammissioni.overrides={};
  const dmy=toDmy(date);
  if(dmy){App.ammissioni.overrides[i]=dmy;await fbSet("ammissioni/overrides/"+i,dmy);}
  else{delete App.ammissioni.overrides[i];await fbSet("ammissioni/overrides/"+i,null);}
}

// ─── Seed una-tantum delle date di ammissione predefinite (da AMMISSIONI_DEFAULTS) ──
// Scrive su Firebase le date hardcoded nei file data_*.js SOLO la prima volta per
// ciascuna classe (marcatore "ammissioni/_seeded"). Dopo il primo seed, qualsiasi
// modifica fatta dall'Admin prevale e non viene mai sovrascritta.
async function seedAmmissioniDefaults(){
  if(!DB)return;
  const defs=AMMISSIONI_DEFAULTS||{};
  const keys=Object.keys(defs);
  if(!keys.length)return;
  try{
    const flag=await fbRef("ammissioni/_seeded").get();
    if(flag.exists())return; // già seedato una volta per questa classe
    if(!App.ammissioni)App.ammissioni={defaultDate:"",overrides:{}};
    if(!App.ammissioni.overrides)App.ammissioni.overrides={};
    for(const k of keys){
      const cur=await fbRef("ammissioni/overrides/"+k).get();
      if(!cur.exists()){
        const dmy=toDmy(defs[k]);
        App.ammissioni.overrides[k]=dmy;
        await fbRef("ammissioni/overrides/"+k).set(dmy);
      }
    }
    await fbRef("ammissioni/_seeded").set(new Date().toISOString());
  }catch(e){console.warn("Seed ammissioni non riuscito:",e);}
}

// ─── Data di dimissione ─────────────────────────────────────────────────────
function getDimDate(i){return toDmy(App.dimissioni?.[i]||"");}
async function saveDimDate(i,date){
  if(!App.dimissioni)App.dimissioni={};
  const dmy=toDmy(date);
  if(dmy){App.dimissioni[i]=dmy;await fbSet("dimissioni_date/"+i,dmy);}
  else{delete App.dimissioni[i];await fbSet("dimissioni_date/"+i,null);}
}

// ─── Data di trasferimento ──────────────────────────────────────────────────
function getTrasDate(i){return toDmy(App.trasferiti_date?.[i]||"");}
async function saveTrasDate(i,date){
  if(!App.trasferiti_date)App.trasferiti_date={};
  const dmy=toDmy(date);
  if(dmy){App.trasferiti_date[i]=dmy;await fbSet("trasferiti_date/"+i,dmy);}
  else{delete App.trasferiti_date[i];await fbSet("trasferiti_date/"+i,null);}
}
async function toggleTrasferito(idx){
  const was=!!App.trasferiti[idx];
  if(was){
    delete App.trasferiti[idx];
    await fbSet("trasferiti/"+idx,null);
    toast("✅ "+fmtName(STUDENTS[idx].name)+" riattivato","ok");
  } else {
    // Rimuove eventuale stato dimesso prima di impostare trasferito
    if(App.dimessi[idx]){delete App.dimessi[idx];await fbSet("dimessi/"+idx,null);}
    App.trasferiti[idx]=true;
    await fbSet("trasferiti/"+idx,true);
    toast("🔄 "+fmtName(STUDENTS[idx].name)+" TRASFERITO","ok");
  }
  renderAdminAlunni();
}

// ─── Esito finale: AMMESSO / NON AMMESSO (Admin e Tutor) ─────────────────────
// App.esiti[idx] = "ammesso" | "non_ammesso". Se assente → trattato come AMMESSO
// nella pagella finale (retrocompatibile col comportamento originale).
function esitoOf(i){return App.esiti?.[i]==="non_ammesso"?"non_ammesso":"ammesso";}
async function toggleEsito(idx){
  if(!(App.teacher&&(App.teacher.isAdmin||App.teacher.isTutor||App.teacher.isSegreteria))){toast("⛔ Solo Admin, Tutor e Segreteria","err");return;}
  if(!App.esiti)App.esiti={};
  const nuovo=esitoOf(idx)==="ammesso"?"non_ammesso":"ammesso";
  App.esiti[idx]=nuovo;
  await fbSet("esiti/"+idx,nuovo);
  toast((nuovo==="non_ammesso"?"⛔ ":"✅ ")+fmtName(STUDENTS[idx].name)+" — "+(nuovo==="non_ammesso"?"NON AMMESSO":"AMMESSO"),"ok");
  // Ridisegna il tab attualmente aperto (Alunni o Griglia Finale)
  if(App.adminTab==="finale"&&typeof renderAdminFinale==="function")renderAdminFinale();
  else renderAdminAlunni();
}


async function saveDocenteMateria(sid,id,name,full){
  // Se è un docente completamente nuovo (custom), crea il suo account
  const isNuovo=id.startsWith("custom_")&&!App.customTeachers[id];
  if(isNuovo){
    const initials=name.split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"DC";
    const newTeacher={id,label:name,full,initials,isAdmin:false,isTutor:false,isSegreteria:false};
    App.customTeachers[id]=newTeacher;
    await fbSet("customTeachers/"+id,newTeacher);
    await fbSet("pins/"+id,DEFAULT_PIN);
    App.pins[id]=DEFAULT_PIN;
  }
  App.docenteMaterie[sid]={id,name,full};
  await fbSet("docenteMaterie/"+sid,{id,name,full});
  toast(isNuovo?("🆕 Docente creato e assegnato: "+name+" (PIN: "+DEFAULT_PIN+")"):("✅ Docente assegnato: "+name),isNuovo?"info":"ok");
  closeAssignTeacherModal();
  if(App.page==="grades")renderGrades();
  else renderAdminMaterie();
}
async function removeDocenteMateria(sid){
  delete App.docenteMaterie[sid];
  await fbSet("docenteMaterie/"+sid,null);
  toast("🗑 Assegnazione rimossa — ripristinato docente di default","ok");
  renderAdminMaterie();
}

// ─── Modale assegnazione docente ────────────────────────────────────────────
function openAssignTeacherModal(sid){
  const subj=SUBJECTS.find(s=>s.id===sid);
  const curDocId=docOf(sid),curDocName=docNameOf(sid);
  const isOverride=!!App.docenteMaterie[sid];
  const defaultDocId=subj.doc||"",defaultDocName=defaultDocId?(TN[defaultDocId]||defaultDocId):"";

  const existing=document.getElementById("assign-teacher-modal");
  if(existing)existing.remove();

  const overlay=document.createElement("div");
  overlay.id="assign-teacher-modal";
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:400;display:flex;align-items:flex-end;justify-content:center";
  overlay.innerHTML=`
  <div style="background:white;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px 20px calc(20px + env(safe-area-inset-bottom));max-height:88vh;overflow-y:auto">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:16px;font-weight:800;color:#0F172A">👤 Assegna Docente</div>
        <div style="font-size:12px;color:#64748B;margin-top:2px">${subj.emoji} ${subj.label}</div>
      </div>
      <button id="asgn-close" style="width:32px;height:32px;border:1px solid #E2E8F0;background:#F8FAFC;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
    ${defaultDocId?`<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#1E40AF">
      ℹ️ Docente di default (hardcoded): <strong>${defaultDocName}</strong>${isOverride?` — attualmente sovrascritto da <strong>${curDocName}</strong>`:""}
    </div>`:`<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#92400E">
      ⚠️ Nessun docente assegnato — selezionane uno.${curDocId?` Attualmente assegnato: <strong>${curDocName}</strong>`:""}
    </div>`}

    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#64748B;margin-bottom:8px">📋 Docenti esistenti</div>
    <div style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:14px">
      ${(()=>{
        const seen={},lista=[];
        Object.keys(TN).forEach(tid=>{
          if(seen[tid])return;seen[tid]=1;
          const inTeam=TEACHERS.find(t=>t.id===tid);
          lista.push(inTeam||{id:tid,label:TN[tid]||tid,initials:(tid.slice(0,2)||"--").toUpperCase(),subjects:[],full:TE[tid]||""});
        });
        Object.values(App.customTeachers||{}).forEach(ct=>{
          if(seen[ct.id])return;seen[ct.id]=1;
          lista.push({id:ct.id,label:ct.label,initials:ct.initials||(ct.label.slice(0,2).toUpperCase()),subjects:[],full:ct.full||ct.label.toUpperCase(),isCustom:true});
        });
        return lista.map(t=>{
          const isSelected=t.id===curDocId;
          const sub=(t.subjects||[]).map(sid2=>{const s2=SUBJECTS.find(s3=>s3.id===sid2);return s2?s2.short:""}).filter(Boolean).join(", ");
          const subLabel=t.isCustom?"👤 Docente aggiunto":(sub||"Nessuna materia assegnata");
          return`<button class="asgn-existing-btn" data-tid="${t.id}" data-tname="${t.label}" data-tfull="${t.full||TE[t.id]||t.label.toUpperCase()}" style="display:flex;align-items:center;gap:10px;width:100%;padding:11px 14px;border:none;border-bottom:1px solid #F1F5F9;background:${isSelected?"#EFF6FF":"white"};cursor:pointer;text-align:left">
            <div style="width:34px;height:34px;border-radius:10px;background:${isSelected?"#2563EB":(t.isCustom?"#7C3AED":"#F1F5F9")};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${isSelected||t.isCustom?"white":"#64748B"};flex-shrink:0">${t.initials}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:700;color:#0F172A">${t.label}</div>
              <div style="font-size:10px;color:#94A3B8">${subLabel}</div>
            </div>
            ${isSelected?`<span style="font-size:18px">✅</span>`:""}
          </button>`;
        }).join("");
      })()}
    </div>

    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#64748B;margin-bottom:8px">➕ Nuovo docente</div>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:14px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <div>
          <label style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Cognome</label>
          <input id="asgn-cognome" class="inp" placeholder="es. Rossi" style="font-size:13px;padding:9px 10px">
        </div>
        <div>
          <label style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Nome</label>
          <input id="asgn-nome" class="inp" placeholder="es. Mario" style="font-size:13px;padding:9px 10px">
        </div>
      </div>
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:11px;color:#1E40AF">
        ℹ️ Verrà creata una nuova scheda di accesso con PIN predefinito <strong>${DEFAULT_PIN}</strong>. Il docente apparirà nel dropdown del login.
      </div>
      <button id="asgn-new-btn" style="width:100%;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:white;border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;cursor:pointer">➕ Crea account e assegna</button>
    </div>

    ${(curDocId||isOverride)?`<button id="asgn-remove-btn" style="width:100%;background:#FEF2F2;color:#EF4444;border:1.5px solid #FECACA;border-radius:10px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:8px">🗑 Rimuovi assegnazione override</button>`:""}
    <button id="asgn-cancel-btn" style="width:100%;background:#F1F5F9;color:#64748B;border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;cursor:pointer">Annulla</button>
  </div>`;

  document.body.appendChild(overlay);

  document.getElementById("asgn-close").addEventListener("click",closeAssignTeacherModal);
  document.getElementById("asgn-cancel-btn").addEventListener("click",closeAssignTeacherModal);
  overlay.addEventListener("click",e=>{if(e.target===overlay)closeAssignTeacherModal();});

  overlay.querySelectorAll(".asgn-existing-btn").forEach(btn=>{
    btn.addEventListener("click",function(){
      saveDocenteMateria(sid,this.dataset.tid,this.dataset.tname,this.dataset.tfull);
    });
  });

  document.getElementById("asgn-new-btn").addEventListener("click",()=>{
    const cog=(document.getElementById("asgn-cognome").value||"").trim();
    const nom=(document.getElementById("asgn-nome").value||"").trim();
    if(!cog||!nom){toast("⚠️ Inserisci cognome e nome","err");return;}
    const id="custom_"+(cog+nom).toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,20)+"_"+Date.now().toString(36);
    const name=cog.toUpperCase()+" "+nom.charAt(0).toUpperCase()+nom.slice(1).toLowerCase();
    const full=cog.toUpperCase()+" "+nom.toUpperCase();
    saveDocenteMateria(sid,id,name,full);
  });

  const removeBtn=document.getElementById("asgn-remove-btn");
  if(removeBtn)removeBtn.addEventListener("click",()=>removeDocenteMateria(sid));
}
function closeAssignTeacherModal(){
  const m=document.getElementById("assign-teacher-modal");
  if(m)m.remove();
}

// Calcola voto finale: MP arrotondata con regola condotta
function calcVotoFinale(idx,mCols){
  const mp=calcMP(idx,mCols);
  if(mp===null)return null;
  const condE=App.grades["condotta"]?.[idx];
  const cond=condE?parseFloat(String(condE.value).replace(",",".")):null;
  if(cond!==null&&!isNaN(cond)&&cond<=8){
    return Math.floor(mp); // arrotonda sempre per difetto
  }
  return Math.round(mp); // arrotondamento standard
}

// Corso effettivo di una materia
function corsM(sid){return App.corsiMaterie[sid]||DEFAULT_CORSO_MATERIA[sid]||"comune";}
// Corso effettivo di uno studente
function corsS(idx){return App.corsiStudenti[idx]||"";}
// Lo studente può fare questa materia? (ignorando dimessi qui)
function studentHasSubject(idx,sid){
  const mc=corsM(sid),sc=corsS(idx);
  if(mc==="comune")return true;
  return sc===mc;
}
// Studenti visibili per una materia (in vista docente: escludi dimessi/trasferiti, filtra per corso)
function studentsForSubject(sid){
  const subj=SUBJECTS.find(s=>s.id===sid);
  if(subj&&subj.conductaOnly) return STUDENTS.filter((_,i)=>!App.dimessi[i]&&!App.trasferiti[i]);
  return STUDENTS.filter((_,i)=>!App.dimessi[i]&&!App.trasferiti[i]&&studentHasSubject(i,sid));
}
// Tutti gli studenti non dimessi e non trasferiti
function activeStudents(){return STUDENTS.filter((_,i)=>!App.dimessi[i]&&!App.trasferiti[i]);}
function dimN(){return STUDENTS.filter((_,i)=>!!App.dimessi[i]).length;}
function trasN(){return STUDENTS.filter((_,i)=>!!App.trasferiti[i]).length;}
// Utenti con accesso privilegiato (condotta + viste complete)
function isPrivileged(){const t=App.teacher;return !!(t&&(t.isAdmin||t.isTutor||t.isSegreteria));}

// Conteggio voti per materia (solo studenti del corso giusto, non dimessi)
function cntG(sid){
  return studentsForSubject(sid).filter(st=>!!App.grades[sid]?.[STUDENTS.indexOf(st)]).length;
}
function totalG(){return SUBJECTS.reduce((a,s)=>a+cntG(s.id),0);}
function myTotal(){return mySubjects().reduce((a,s)=>a+cntG(s),0);}

function calcMedia(idx,cols){
  const v=[];
  (cols||SUBJECTS).forEach(s=>{const e=App.grades[s.id]?.[idx];if(e){const sv=String(e.value).trim().toUpperCase();const n=sv==="NC"?4:parseFloat(sv.replace(",","."));if(!isNaN(n))v.push(n);}});
  return v.length?v.reduce((a,b)=>a+b)/v.length:null;
}
function calcMP(idx,cols){
  let sv=0,sw=0;
  (cols||SUBJECTS).forEach(s=>{const e=App.grades[s.id]?.[idx];if(e){const str=String(e.value).trim().toUpperCase();const n=str==="NC"?4:parseFloat(str.replace(",","."));if(!isNaN(n)){sv+=n*s.ore;sw+=s.ore;}}});
  return sw>0?sv/sw:null;
}

// ═══════════════════════════════════════════════
//  GRIGLIA FINALE (solo Classe 3F, solo Admin) ─────────────────────────────
//  Colonne: Media 1°Anno e 2°Anno (0-10, inserite dall'Admin) · Media 3°Anno
//  (calcolata in automatico come media PONDERATA per ore dei moduli 3F già
//  inseriti quest'anno, esclusa condotta) · Media Triennale in centesimi
//  (media aritmetica delle tre, ×10) · Prova Multidisciplinare (0-100,
//  inserita dall'Admin) · Voto Finale in centesimi (80% Media Triennale +
//  20% Prova Multidisciplinare).
// ═══════════════════════════════════════════════
function isClasseFinale(){return CLASSE==="3F";} // classe/i abilitate alla Griglia Finale

// Media 3° anno: automatica, media PONDERATA per ore (calcMP) dei moduli con voto (esclusa condotta)
function media3AnnoOf(idx){return calcMP(idx,SUBJECTS.filter(s=>!s.conductaOnly));}

// Valori grezzi inseriti dall'Admin per l'alunno (stringhe, come digitate)
function finaleRawOf(idx){return App.finale?.[idx]||{};}
function finaleNumOf(idx,field){
  const raw=finaleRawOf(idx)[field];
  if(raw===undefined||raw===null||raw==="")return null;
  const n=parseFloat(String(raw).trim().replace(",","."));
  return isNaN(n)?null:n;
}

// Media Voto Triennale in centesimi: media aritmetica di (1°,2°,3° anno) ×10,
// ARROTONDATA all'intero (centesimi senza decimali).
// null se anche solo uno dei tre termini manca.
function calcMediaTriennale(idx){
  const m1=finaleNumOf(idx,"m1"), m2=finaleNumOf(idx,"m2"), m3=media3AnnoOf(idx);
  if(m1===null||m2===null||m3===null)return null;
  return Math.round((m1+m2+m3)/3*10);
}
// Voto Finale Griglia (centesimi, ARROTONDATO all'intero): 80% Media
// Triennale + 20% Prova Multidisciplinare. null se manca un termine.
// NB: nome distinto da calcVotoFinale(idx,mCols) — quella esistente è la Media
// Ponderata/Condotta (0-10) usata da pagelle/riepiloghi; questa è specifica
// della Griglia Finale 3F (centesimi) e non deve sovrascriverla.
function calcVotoFinaleGriglia(idx){
  const mt=calcMediaTriennale(idx), pr=finaleNumOf(idx,"prova");
  if(mt===null||pr===null)return null;
  return Math.round(mt*0.8+pr*0.2);
}

// Salva un valore della Griglia Finale (solo Admin). field: "m1"|"m2"|"prova".
async function saveFinaleValue(idx,field,rawVal){
  if(!(App.teacher&&App.teacher.isAdmin)){toast("⛔ Solo l'Admin può modificare la Griglia Finale","err");return;}
  const val=String(rawVal||"").trim().replace(",",".");
  if(val!==""){
    const n=parseFloat(val);
    if(isNaN(n)){toast("⚠️ Valore non valido","err");return;}
    if((field==="m1"||field==="m2")&&(n<0||n>10)){toast("⚠️ La media deve essere tra 0 e 10","err");return;}
    if(field==="prova"&&(n<0||n>100)){toast("⚠️ La prova deve essere tra 0 e 100","err");return;}
  }
  if(!App.finale)App.finale={};
  if(!App.finale[idx])App.finale[idx]={};
  if(val===""){delete App.finale[idx][field];}else{App.finale[idx][field]=val;}
  await fbSet("finale/"+idx+"/"+field,val===""?null:val);
  toast("✅ Griglia Finale aggiornata","ok");
  if(App.adminTab==="finale"&&typeof renderAdminFinale==="function")renderAdminFinale();
}

let _tt;
function toast(msg,type="ok"){
  const t=$("#toast");t.textContent=msg;t.className="toast show t-"+type;
  clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove("show"),3000);
}

// ═══════════════════════════════════════════════
//  FIREBASE
// ═══════════════════════════════════════════════
let DB=null;
function loadFB(){
  const s=document.createElement("script");
  s.src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
  s.onload=()=>{const s2=document.createElement("script");s2.src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";s2.onload=initFB;document.head.appendChild(s2);};
  document.head.appendChild(s);
}
function initFB(){
  firebase.initializeApp({
    apiKey:"AIzaSyAxQwPa45iVpfJbrTvdUyFK67wgAMpyDwQ",
    authDomain:"registro-1e-v1.firebaseapp.com",
    databaseURL:"https://registro-1e-v1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:"registro-1e-v1",storageBucket:"registro-1e-v1.firebasestorage.app",
    messagingSenderId:"603566737851",appId:"1:603566737851:web:c6bfbce7c5d71335f9dc9e"
  });
  DB=firebase.database();
  // Carica customTeachers — listener gestito in startSync dopo la scelta classe
  // (il listener globale pre-login qui è rimosso; customTeachers vengono caricati in startSync)
}
// Preload one-time dei docenti (custom + assegnati via override) per popolare il dropdown di login
// prima dell'autenticazione. Usa il prefisso Firebase della classe già selezionata.
function preloadLoginTeachers(){
  if(!DB){setTimeout(preloadLoginTeachers,300);return;}
  try{
    fbRef("customTeachers").once("value").then(snap=>{
      App.customTeachers=snap.exists()?snap.val():{};
      if(App.page==="login"&&typeof updateLoginDropdown==="function")updateLoginDropdown();
    }).catch(()=>{});
    fbRef("docenteMaterie").once("value").then(snap=>{
      App.docenteMaterie=snap.exists()?snap.val():{};
      if(App.page==="login"&&typeof updateLoginDropdown==="function")updateLoginDropdown();
    }).catch(()=>{});
  }catch(e){}
}
function startSync(){
  if(!DB){setTimeout(startSync,300);return;}
  // Write pending login log entry now that DB is ready
  if(App._pendingLogUid){
    const uid=App._pendingLogUid;App._pendingLogUid=null;
    const now=new Date();
    const key=now.toISOString().replace(/[:.]/g,"-");
    fbRef("accessLog/"+uid+"/"+key).set({ts:now.toISOString(),uid});
  }
  if(App.fbL){try{fbRef("grades").off();}catch(e){}}
  App.fbL=fbRef("grades").on("value",snap=>{App.grades=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  // Sync realtime per dimessi, corsiStudenti, corsiMaterie, docenteMaterie
  fbRef("dimessi").on("value",snap=>{App.dimessi=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  fbRef("corsiStudenti").on("value",snap=>{App.corsiStudenti=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  fbRef("corsiMaterie").on("value",snap=>{App.corsiMaterie=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  fbRef("docenteMaterie").on("value",snap=>{App.docenteMaterie=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  // Sync ammissioni (date di ammissione)
  fbRef("ammissioni").on("value",snap=>{
    const v=snap.exists()?snap.val():{};
    App.ammissioni={defaultDate:v.defaultDate||"",overrides:v.overrides||{}};
  });
  // Sync date di dimissione
  fbRef("dimissioni_date").on("value",snap=>{App.dimissioni=snap.exists()?snap.val():{};});
  // Sync trasferiti (solo Admin può impostare)
  fbRef("trasferiti").on("value",snap=>{App.trasferiti=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  fbRef("trasferiti_date").on("value",snap=>{App.trasferiti_date=snap.exists()?snap.val():{};});
  // Log accessi — aggiornamento live per admin
  fbRef("accessLog").on("value",snap=>{App.accessLog=snap.exists()?snap.val():{};});
  // customTeachers — per classe
  fbRef("customTeachers").on("value",snap=>{
    App.customTeachers=snap.exists()?snap.val():{};
    if(App.page==="login")updateLoginCustomTeachers();
    else renderPage();
  });
  // Sync pins
  fbRef("pins").on("value",snap=>{const v=snap.exists()?snap.val():{};Object.assign(App.pins,v);});
  // Sync voti condotta parziali (uno per docente)
  fbRef("condotta_parziale").on("value",snap=>{App.condottaParziale=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  // Sync blocco per singola materia
  fbRef("subjectsLocked").on("value",snap=>{App.subjectsLocked=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  // Sync esiti finali AMMESSO/NON AMMESSO (Admin e Tutor)
  fbRef("esiti").on("value",snap=>{App.esiti=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  // Sync Griglia Finale (solo Classe 3F, solo Admin può modificare)
  fbRef("finale").on("value",snap=>{App.finale=snap.exists()?snap.val():{};if(App.page!=="login")renderPage();});
  // Seed una-tantum delle date di ammissione predefinite della classe attiva
  seedAmmissioniDefaults();
}
function stopSync(){if(DB){try{fbRef("grades").off();fbRef("dimessi").off();fbRef("corsiStudenti").off();fbRef("corsiMaterie").off();fbRef("docenteMaterie").off();fbRef("accessLog").off();fbRef("ammissioni").off();fbRef("dimissioni_date").off();fbRef("trasferiti").off();fbRef("trasferiti_date").off();fbRef("customTeachers").off();fbRef("pins").off();fbRef("condotta_parziale").off();fbRef("subjectsLocked").off();fbRef("esiti").off();fbRef("finale").off();}catch(e){}} App.fbL=null;}
// ─── Helper Firebase con prefisso classe ────────────────────────────────────
// Tutti i nodi Firebase classe-specifici passano per fbRef.
// 1E: prefisso "" → nodi a radice (compatibilità totale)
// 1D: prefisso "1D/" → nodi isolati, non tocca mai quelli della 1E
function fbRef(p){return DB.ref((App.fbPrefix||"")+p);}
async function fbSet(p,v){if(DB)await fbRef(p).set(v);}

// ═══════════════════════════════════════════════
//  AUTH & PIN
// ═══════════════════════════════════════════════
async function getPin(tid){
  if(App.pins[tid])return App.pins[tid];
  if(tid==="admin"){App.pins[tid]=ADMIN_PIN;return ADMIN_PIN;}
  if(tid==="tutor"){App.pins[tid]=TUTOR_PIN;return TUTOR_PIN;}
  if(tid==="segreteria"){App.pins[tid]=SEGRETERIA_PIN;return SEGRETERIA_PIN;}
  if(!DB){App.pins[tid]=DEFAULT_PIN;return DEFAULT_PIN;}
  const s=await fbRef("pins/"+tid).get();
  App.pins[tid]=s.exists()?s.val():DEFAULT_PIN;
  return App.pins[tid];
}
async function setPin(tid,p){if(tid==="admin"||tid==="tutor"||tid==="segreteria"){App.pins[tid]=p;return;}App.pins[tid]=p;if(DB)await fbRef("pins/"+tid).set(p);}

async function doLogin(){
  const sel=$("#teacher-sel"),pinEl=$("#pin-in"),errEl=$("#login-err");
  const tid=sel.value,pin=(pinEl.value||"").trim();
  errEl.style.display="none";
  if(!tid){errEl.textContent="Seleziona il tuo nome.";errEl.style.display="block";return;}
  if(!pin){errEl.textContent="Inserisci il PIN.";errEl.style.display="block";return;}
  const btn=$("#login-btn");btn.textContent="Verifica...";btn.disabled=true;
  const saved=await getPin(tid);
  btn.textContent="Accedi →";btn.disabled=false;
  if(pin!==saved){errEl.textContent="PIN errato.";errEl.style.display="block";pinEl.value="";return;}
  App.teacher=allUsers().find(u=>u.id===tid);
  App.page=(App.teacher.isAdmin||App.teacher.isTutor||App.teacher.isSegreteria)?"admin":"home";
  App.tab="home";App.adminTab="materie";App.edits={};
  App._pendingLogUid=tid; // scritto in startSync quando DB è pronto
  startSync();renderPage();
}
function doLogout(){
  stopSync();
  App.teacher=null;App.page="login";App.subjId=null;App.edits={};
  App.grades={};App.dimessi={};App.corsiStudenti={};App.corsiMaterie={};
  App.docenteMaterie={};App.customTeachers={};App.accessLog={};
  App.ammissioni={defaultDate:"",overrides:{}};App.dimissioni={};App.pins={};
  App.trasferiti={};App.trasferiti_date={};App.condottaParziale={};App.subjectsLocked={};App.esiti={};App.finale={};
  renderClassSelect();
}

// ═══════════════════════════════════════════════
//  VOTI
// ═══════════════════════════════════════════════
async function confirmGrade(idx){
  const val=(App.edits[idx]??App.grades[App.subjId]?.[idx]?.value??"").trim();
  if(!val){toast("⚠️ Inserisci un voto","err");return;}
  const entry={value:val,docente:App.teacher.id,ts:new Date().toISOString()};
  if(!App.grades[App.subjId])App.grades[App.subjId]={};
  App.grades[App.subjId][idx]=entry;
  delete App.edits[idx];
  await fbSet("grades/"+App.subjId+"/"+idx,entry);
  toast("✅ "+fmtName(STUDENTS[idx].name)+" registrato","ok");
  renderGrades();
}
async function deleteGrade(subjId,idx){
  if(!confirm("Eliminare il voto di "+fmtName(STUDENTS[idx].name)+"?"))return;
  if(App.grades[subjId])delete App.grades[subjId][idx];
  await fbSet("grades/"+subjId+"/"+idx,null);
  toast("🗑️ Voto eliminato","ok");renderGrades();
}

// ─── Condotta parziale (voto del singolo docente) ────────────────────────────
// Ogni docente salva il suo voto in condotta_parziale/{teacherId}/{idx}.
// Dopo ogni salvataggio viene ricalcolata la media e scritta in grades/condotta.
// Admin e Tutor scrivono direttamente in grades/condotta (override diretto).
async function recalcCondottaMedia(idx){
  const votes=[];
  Object.values(App.condottaParziale||{}).forEach(tv=>{
    const e=tv[idx];
    if(e&&e.value){const n=parseFloat(String(e.value).replace(",","."));if(!isNaN(n)&&n>=1&&n<=10)votes.push(n);}
  });
  if(votes.length===0){
    // nessun voto parziale → rimuovi solo se era calcolato dal sistema
    const ex=App.grades["condotta"]?.[idx];
    if(ex&&ex.docente==="sistema"){
      if(!App.grades["condotta"])App.grades["condotta"]={};
      delete App.grades["condotta"][idx];
      await fbSet("grades/condotta/"+idx,null);
    }
    return;
  }
  const avg=Math.round(votes.reduce((a,b)=>a+b,0)/votes.length);
  const entry={value:String(avg),docente:"sistema",ts:new Date().toISOString()};
  if(!App.grades["condotta"])App.grades["condotta"]={};
  App.grades["condotta"][idx]=entry;
  await fbSet("grades/condotta/"+idx,entry);
}
async function confirmCondottaParziale(idx){
  const val=(App.edits[idx]??"").trim();
  if(!val){toast("⚠️ Inserisci un voto (1–10)","err");return;}
  const n=parseFloat(val.replace(",","."));
  if(isNaN(n)||n<1||n>10){toast("⚠️ Voto condotta: 1–10","err");return;}
  const tid=App.teacher.id;
  if(!App.condottaParziale[tid])App.condottaParziale[tid]={};
  const entry={value:String(Math.round(n)),docente:tid,ts:new Date().toISOString()};
  App.condottaParziale[tid][idx]=entry;
  delete App.edits[idx];
  await fbSet("condotta_parziale/"+tid+"/"+idx,entry);
  await recalcCondottaMedia(idx);
  toast("✅ Condotta "+fmtName(STUDENTS[idx].name)+" registrata","ok");
  renderGrades();
}
async function deleteCondottaParziale(idx){
  if(!confirm("Eliminare il voto condotta di "+fmtName(STUDENTS[idx].name)+"?"))return;
  const tid=App.teacher.id;
  if(App.condottaParziale[tid])delete App.condottaParziale[tid][idx];
  await fbSet("condotta_parziale/"+tid+"/"+idx,null);
  await recalcCondottaMedia(idx);
  toast("🗑️ Voto condotta eliminato","ok");renderGrades();
}
async function toggleSubjectLock(sid){
  const newVal=!App.subjectsLocked[sid];
  if(newVal)App.subjectsLocked[sid]=true;
  else delete App.subjectsLocked[sid];
  await fbSet("subjectsLocked/"+sid,newVal||null);
  const s=SUBJECTS.find(x=>x.id===sid);
  toast(newVal?"🔒 "+s.label+" — bloccata":"🔓 "+s.label+" — aperta","ok");
  renderAdminMaterie();
}
async function toggleDimesso(idx){
  const was=!!App.dimessi[idx];
  if(was){delete App.dimessi[idx];await fbSet("dimessi/"+idx,null);toast("✅ "+fmtName(STUDENTS[idx].name)+" riattivato","ok");}
  else{App.dimessi[idx]=true;await fbSet("dimessi/"+idx,true);toast("🚫 "+fmtName(STUDENTS[idx].name)+" DIMESSO","ok");}
  renderAdminAlunni();
}
async function setCorsStudente(idx,val){
  App.corsiStudenti[idx]=val;
  await fbSet("corsiStudenti/"+idx,val||null);
  toast("💾 Salvato","ok");renderAdminAlunni();
}
async function setCorsMateria(sid,val){
  App.corsiMaterie[sid]=val;
  await fbSet("corsiMaterie/"+sid,val);
  toast("💾 Corso materia aggiornato","ok");renderAdminMaterie();
}
async function savePinFn(){
  const old=$("#old-pin").value,nw=$("#new-pin").value,cf=$("#cf-pin").value;
  const errEl=$("#pin-err");errEl.textContent="";
  const cur=await getPin(App.teacher.id);
  if(old!==cur){errEl.textContent="PIN attuale errato.";return;}
  if(!/^\d{4}$/.test(nw)){errEl.textContent="Il nuovo PIN deve essere 4 cifre.";return;}
  if(nw!==cf){errEl.textContent="I PIN non coincidono.";return;}
  await setPin(App.teacher.id,nw);toast("🔑 PIN aggiornato!","ok");goBack();
}

