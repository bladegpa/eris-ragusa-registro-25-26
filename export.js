// ═══════════════════════════════════════════════
//  export.js — Excel, Griglia, Importazione, Schede DOCX
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
//  EXPORT & SHARE
// ═══════════════════════════════════════════════
function buildWB(cols){
  const wb=XLSX.utils.book_new();
  const subjCols=(cols||SUBJECTS).filter(s=>!s.conductaOnly);
  const showCond=isPrivileged();
  const condS=SUBJECTS.find(s=>s.id==="condotta");
  const cleanName=s=>s.label.replace(/^[A-Za-z0-9]+[Eeb\d]* - /,"");
  const TB={top:{style:"thin",color:{rgb:"BFBFBF"}},bottom:{style:"thin",color:{rgb:"BFBFBF"}},left:{style:"thin",color:{rgb:"BFBFBF"}},right:{style:"thin",color:{rgb:"BFBFBF"}}};
  const MBL={top:{style:"medium",color:{rgb:"94A3B8"}},bottom:{style:"medium",color:{rgb:"94A3B8"}},left:{style:"medium",color:{rgb:"1B3F8B"}},right:{style:"thin",color:{rgb:"BFBFBF"}}};
  const gRGB=v=>{const n=parseFloat(String(v).replace(",","."));return isNaN(n)?"3B82F6":n<6?"EF4444":n<7?"CA8A04":n<9?"D97706":"059669";};
  const xlsVF=(i,sCols)=>{
    const mp=calcMP(i,sCols);if(mp===null)return null;
    const ce=App.grades["condotta"]?.[i];
    const cond=ce?parseFloat(String(ce.value).replace(",",".")):null;
    return(cond!==null&&!isNaN(cond)&&cond<=8)?Math.floor(mp):Math.round(mp);
  };
  const nc=2+subjCols.length+2+(showCond&&condS?1:0)+1;
  const col=n=>n<26?String.fromCharCode(65+n):"A"+String.fromCharCode(65+n-26);
  const vfIdx=nc-1;
  const titleStr=`${ISTITUTO} | Classe ${CLASSE} | A.S. ${ANNO} — Registro Voti`;
  const rows=[
    [null,titleStr,...Array(nc-2).fill(null)],
    ["N.","COGNOME NOME",...subjCols.map(s=>s.short+" - "+cleanName(s)),"Media Aritm.","Media Pond.",...(showCond&&condS?["CONDOTTA"]:[]),"VOTO FINALE"],
    [null,"ORE h",...subjCols.map(s=>s.ore||"\u2014"),null,null,...(showCond&&condS?["\u2014"]:[]),""],
  ];
  STUDENTS.forEach((st,i)=>{
    const dim=!!App.dimessi[i];
    if(dim){rows.push([st.num,st.name+" (DIMESSO)",...subjCols.map(()=>"\u2014"),"\u2014","\u2014",...(showCond&&condS?["\u2014"]:[]),"\u2014"]);return;}
    const r=[st.num,st.name];
    subjCols.forEach(s=>{
      if(!studentHasSubject(i,s.id)){r.push("N/A");return;}
      const e=App.grades[s.id]?.[i];
      if(e){const n=parseFloat(String(e.value).replace(",","."));r.push(isNaN(n)?e.value:n);}else r.push(null);
    });
    const ma=calcMedia(i,subjCols),mp=calcMP(i,subjCols);
    r.push(ma!==null?Math.round(ma*100)/100:null,mp!==null?Math.round(mp*100)/100:null);
    if(showCond&&condS){const ce=App.grades["condotta"]?.[i];r.push(ce?ce.value:null);}
    r.push(xlsVF(i,subjCols));
    rows.push(r);
  });
  rows.push([null,"DOCENTI",...subjCols.map(s=>docFullOf(s.id)),null,null,...(showCond&&condS?["ADMIN/TUTOR"]:[]),null]);
  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws["!merges"]=[{s:{r:0,c:1},e:{r:0,c:nc-1}}];
  ws["!cols"]=[{wch:6.9},{wch:27},...subjCols.map(()=>({wch:7.6})),{wch:13},{wch:13},...(showCond&&condS?[{wch:11}]:[]),{wch:11}];
  ws["!rows"]=[{hpt:32},{hpt:129},{hpt:16},...STUDENTS.map(()=>({hpt:20})),{hpt:122}];
  ws["!freeze"]={xSplit:2,ySplit:3};
  const hB={fill:{fgColor:{rgb:"1B3F8B"},patternType:"solid"},alignment:{horizontal:"center",vertical:"bottom",textRotation:90,wrapText:true},border:TB};
  ws["A2"]={v:"N.",t:"s",s:{...hB,font:{bold:true,sz:10,name:"Arial",color:{rgb:"FFFFFF"}},alignment:{horizontal:"center",vertical:"center"}}};
  ws["B2"]={v:"COGNOME NOME",t:"s",s:{...hB,font:{bold:true,sz:10,name:"Arial",color:{rgb:"FFFFFF"}},alignment:{horizontal:"left",vertical:"bottom",textRotation:0}}};
  subjCols.forEach((s,si)=>{ws[col(2+si)+"2"]={v:s.short+" - "+cleanName(s),t:"s",s:{...hB,font:{bold:true,sz:9,name:"Arial",color:{rgb:"FFFFFF"}}}};});
  ws[col(2+subjCols.length)+"2"]={v:"Media Aritm.",t:"s",s:{...hB,font:{bold:true,sz:9,name:"Arial",color:{rgb:"1D4ED8"}},fill:{fgColor:{rgb:"1E3A5F"},patternType:"solid"}}};
  ws[col(3+subjCols.length)+"2"]={v:"Media Pond.",t:"s",s:{...hB,font:{bold:true,sz:9,name:"Arial",color:{rgb:"FDE68A"}},fill:{fgColor:{rgb:"78350F"},patternType:"solid"}}};
  if(showCond&&condS) ws[col(4+subjCols.length)+"2"]={v:"CONDOTTA",t:"s",s:{...hB,font:{bold:true,sz:9,name:"Arial",color:{rgb:"DDD6FE"}},fill:{fgColor:{rgb:"4C1D95"},patternType:"solid"}}};
  ws[col(vfIdx)+"2"]={v:"VOTO FINALE",t:"s",s:{...hB,font:{bold:true,sz:10,name:"Arial",color:{rgb:"FDE68A"}},fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},border:{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}}};
  ws["A1"]={v:null,t:"z",s:{fill:{fgColor:{rgb:"EFF6FF"},patternType:"solid"},border:TB}};
  ws["B1"]={v:titleStr,t:"s",s:{font:{bold:true,sz:13,name:"Arial",color:{rgb:"1B3F8B"}},fill:{fgColor:{rgb:"EFF6FF"},patternType:"solid"},alignment:{horizontal:"left",vertical:"center"},border:TB}};
  for(let c=2;c<nc;c++) ws[col(c)+"1"]={v:null,t:"z",s:{fill:{fgColor:{rgb:"EFF6FF"},patternType:"solid"},border:TB}};
  const oB={fill:{fgColor:{rgb:"F1F5F9"},patternType:"solid"},alignment:{horizontal:"center",vertical:"center"},border:TB};
  ws["A3"]={v:null,t:"z",s:oB};
  ws["B3"]={v:"ORE h",t:"s",s:{...oB,font:{bold:true,italic:true,sz:9,name:"Arial",color:{rgb:"1B3F8B"}},alignment:{horizontal:"left",vertical:"center"}}};
  for(let c=2;c<nc;c++){const a=col(c)+"3";const cv=ws[a]?ws[a].v:null;ws[a]={v:cv,t:cv!=null?"n":"z",s:{...oB,font:{italic:true,sz:9,name:"Arial",color:{rgb:"64748B"}}}};}
  STUDENTS.forEach((st,i)=>{
    const row=4+i,dim=!!App.dimessi[i];
    const rowBg=i%2===0?"FFFFFF":"F8FAFC";
    const nF={fgColor:{rgb:dim?"FEF2F2":rowBg},patternType:"solid"};
    ws[col(0)+row]={v:st.num,t:"n",s:{font:{bold:true,sz:10,name:"Arial",color:{rgb:dim?"94A3B8":"475569"}},fill:nF,alignment:{horizontal:"center",vertical:"center"},border:MBL}};
    ws[col(1)+row]={v:dim?st.name+" (DIMESSO)":st.name,t:"s",s:{font:{bold:true,sz:10,name:"Arial",color:{rgb:dim?"94A3B8":"0F172A"}},fill:nF,alignment:{horizontal:"left",vertical:"center"},border:{...TB,left:{style:"medium",color:{rgb:"94A3B8"}}}}};
    for(let c=2;c<nc;c++){
      const a=col(c)+row;const ev=ws[a]?ws[a].v:null;
      const isNA=(ev==="N/A");
      const isMA=(c===2+subjCols.length),isMP=(c===3+subjCols.length);
      const isCond=(showCond&&condS&&c===4+subjCols.length);
      const isVF=(c===vfIdx);
      let s2;
      if(dim){
        s2={fill:{fgColor:{rgb:"FEF2F2"},patternType:"solid"},font:{sz:9,name:"Arial",color:{rgb:"CBD5E1"}},alignment:{horizontal:"center"},border:isVF?{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}:TB};
      } else if(isNA){
        s2={fill:{fgColor:{rgb:"E8EDF3"},patternType:"solid"},font:{sz:8,name:"Arial",color:{rgb:"94A3B8"}},alignment:{horizontal:"center"},border:TB};
      } else if(ev!=null){
        const rgb=gRGB(ev);
        if(isMA)        s2={fill:{fgColor:{rgb:"DBEAFE"},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb}},alignment:{horizontal:"center",vertical:"center"},border:{...TB,left:{style:"medium",color:{rgb:"93C5FD"}},right:{style:"medium",color:{rgb:"93C5FD"}}}};
        else if(isMP)   s2={fill:{fgColor:{rgb:"FEF9C3"},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb}},alignment:{horizontal:"center",vertical:"center"},border:{...TB,right:{style:"medium",color:{rgb:"FCD34D"}}}};
        else if(isCond) s2={fill:{fgColor:{rgb:"EDE9FE"},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb}},alignment:{horizontal:"center"},border:{...TB,left:{style:"medium",color:{rgb:"A78BFA"}},right:{style:"medium",color:{rgb:"A78BFA"}}}};
        else if(isVF)   s2={fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},font:{bold:true,sz:14,name:"Arial",color:{rgb:"FDE68A"}},alignment:{horizontal:"center",vertical:"center"},border:{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}};
        else            s2={fill:{fgColor:{rgb:rowBg},patternType:"solid"},font:{bold:true,sz:11,name:"Arial",color:{rgb}},alignment:{horizontal:"center",vertical:"center"},border:TB};
      } else {
        const fg=isMA?"DBEAFE":isMP?"FEF9C3":isCond?"EDE9FE":isVF?"1A2E5A":rowBg;
        s2={fill:{fgColor:{rgb:fg},patternType:"solid"},font:{sz:9,name:"Arial",color:{rgb:"CBD5E1"}},alignment:{horizontal:"center"},border:isVF?{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}:TB};
      }
      ws[a]={v:ev,t:ev!=null&&!isNA&&typeof ev==="number"?"n":ev!=null?"s":"z",s:s2};
    }
  });
  const dr=4+STUDENTS.length;
  const dB={fill:{fgColor:{rgb:"0F2557"},patternType:"solid"},font:{bold:true,sz:8,name:"Arial",color:{rgb:"FDE68A"}},alignment:{horizontal:"center",vertical:"bottom",textRotation:90},border:TB};
  for(let c=0;c<nc;c++){const a=col(c)+dr;const cv=ws[a]?ws[a].v:null;ws[a]={v:cv,t:cv?"s":"z",s:dB};}
  ws[col(0)+dr]={v:null,t:"z",s:dB};
  ws[col(1)+dr]={v:"DOCENTI",t:"s",s:{...dB,alignment:{horizontal:"left",vertical:"center",textRotation:0}}};
  ws[col(2+subjCols.length)+dr]={v:null,t:"z",s:{...dB,fill:{fgColor:{rgb:"1E3A5F"},patternType:"solid"}}};
  ws[col(3+subjCols.length)+dr]={v:null,t:"z",s:{...dB,fill:{fgColor:{rgb:"78350F"},patternType:"solid"}}};
  if(showCond&&condS) ws[col(4+subjCols.length)+dr]={v:"Admin/Tutor",t:"s",s:{...dB,fill:{fgColor:{rgb:"4C1D95"},patternType:"solid"}}};
  ws[col(vfIdx)+dr]={v:null,t:"z",s:{...dB,border:{...TB,left:{style:"medium",color:{rgb:"1B3F8B"}}}}};
  XLSX.utils.book_append_sheet(wb,ws,("Classe "+CLASSE+" "+App.teacher.label).slice(0,31));
  return wb;
}


function xlsBlob(cols){
  const wb=buildWB(cols);
  const out=XLSX.write(wb,{bookType:"xlsx",type:"array"});
  return new Blob([out],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}
function xlsFilename(){
  let who;
  if(App.teacher.isAdmin) who="ADMIN";
  else if(App.teacher.isTutor) who="TUTOR_"+TUTOR_NAME.replace(/\s+/g,"_").toUpperCase();
  else if(App.teacher.isSegreteria) who="SEGRETERIA";
  else who=App.teacher.label.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]/g,"").toUpperCase();
  return "Registro_"+CLASSE+"_"+who+"_"+ANNO.replace("/","-")+".xlsx";
}
function downloadBlob(blob,fname){
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=fname;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

async function shareFile(blob,fname,title,text){
  const file=new File([blob],fname,{type:blob.type});
  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title,text});return true;}
    catch(e){if(e.name==="AbortError")return false;}
  }
  downloadBlob(blob,fname);return false;
}

async function inviaEmail(cols){
  const blob=xlsBlob(cols),fname=xlsFilename();
  const teacher=App.teacher.isAdmin?"AMMINISTRATORE":"PROF. "+App.teacher.label.toUpperCase();
  const shared=await shareFile(blob,fname,"Registro 1E","Voti classe "+CLASSE+" — "+teacher);
  if(!shared){
    const subj=encodeURIComponent("Registro 1E — "+teacher+" — "+ANNO);
    const body=encodeURIComponent("Buongiorno,\n\nIn allegato i voti della classe "+CLASSE+" (A.S. "+ANNO+").\nDocente: "+teacher+"\n\nRegistro Elettronico ERIS Formazione ETS");
    setTimeout(()=>window.location.href="mailto:"+MAIL_DEST+"?subject="+subj+"&body="+body,600);
    toast("📎 File scaricato — allegalo all\'email","info");
  }else{toast("📧 File condiviso!","ok");}
}

async function inviaAlTutor(cols){
  const blob=xlsBlob(cols),fname=xlsFilename();
  const who=App.teacher.isAdmin?"AMMINISTRATORE":App.teacher.isTutor?"TUTOR":"PROF. "+App.teacher.label.toUpperCase();
  const msg=App.teacher.isTutor||App.teacher.isAdmin
    ?"Riepilogo completo voti classe "+CLASSE+" — "+who
    :"Sono "+App.teacher.label.toUpperCase()+", ho caricato tutti i voti, Buon Lavoro, W ERIS!";
  const shared=await shareFile(blob,fname,"Voti per il Tutor — "+CLASSE,msg);
  if(!shared){
    // Fallback: download file + apri mailto
    const subj=encodeURIComponent("Registro 1E — "+who+" — "+ANNO);
    const body=encodeURIComponent(msg+"\n\n(Il file Excel allegato è stato scaricato automaticamente — allegalo tu a questa email)\n\nRegistro Elettronico ERIS Formazione ETS");
    setTimeout(()=>window.location.href="mailto:"+MAIL_DEST+"?subject="+subj+"&body="+body,600);
    toast("📎 File scaricato — allegalo all'email per il Tutor","info");
  }else{toast("📧 Inviato al Tutor!","ok");}
}


// ═══════════════════════════════════════════════
//  SCHEDE DI VALUTAZIONE
// ═══════════════════════════════════════════════

// Template DOCX normalizzato (base64) — accesso lazy per evitare TDZ
function getTemplateB64(){
  if(typeof DOCX_TEMPLATE_B64==="undefined"||!DOCX_TEMPLATE_B64)
    throw new Error("Template DOCX non trovato. Assicurati che assets.js sia caricato correttamente.");
  return DOCX_TEMPLATE_B64;
}

function votoToValutazione(v){
  const n=parseFloat(String(v).replace(",","."));
  if(isNaN(n))return"—";
  if(n>=10)return"OTTIMO";
  if(n>=9)return"DISTINTO";
  if(n>=8)return"BUONO";
  if(n>=7)return"DISCRETO";
  if(n>=6)return"SUFFICIENTE";
  return"INSUFFICIENTE";
}

function votoToProfiloText(v){
  const map={
    OTTIMO:[
      "L\u2019allievo evidenzia una preparazione di base eccellente e capacit\u00e0 di apprendimento elevate. Dimostra sin dall\u2019inizio del percorso una solida padronanza dei prerequisiti disciplinari, una spiccata curiosit\u00e0 intellettuale e un metodo di studio autonomo ed efficace. La qualit\u00e0 delle risposte alle prime attivit\u00e0 e la rapidit\u00e0 di comprensione lasciano prevedere risultati di alto livello nel proseguimento del percorso formativo, configurando un profilo di partenza di assoluta eccellenza.",
      "Il profilo iniziale dell\u2019allievo evidenzia una preparazione di base di eccellente qualit\u00e0, con competenze pregresse complete, ben strutturate e facilmente mobilitabili nei contesti operativi proposti. L\u2019approccio alle attivit\u00e0 \u00e8 fin da subito caratterizzato da entusiasmo, prontezza di risposta e capacit\u00e0 di analisi superiori alla media. Questi elementi costituiscono una base ottimale per il raggiungimento dei massimi obiettivi formativi previsti dal percorso.",
      "L\u2019allievo si presenta al percorso formativo con un bagaglio di conoscenze e competenze di base di livello eccellente. La padronanza degli argomenti propedeutici, unita a spiccate capacit\u00e0 logiche e comunicative e a un atteggiamento fortemente motivato, delinea fin dalle prime attivit\u00e0 un profilo di partenza straordinario. Le potenzialit\u00e0 di crescita professionale evidenziate nel settore di riferimento sono elevatissime, e le aspettative per il completamento del percorso sono corrispondentemente alte."
    ,
      "L’allievo si distingue fin dalle prime attività per un profilo di partenza di livello eccellente, caratterizzato da conoscenze pregresse complete, ben organizzate e prontamente mobilizzabili. La capacità di ragionamento analitico, la velocità di comprensione e la qualità delle risposte alle attività introduttive indicano una base formativa di assoluto pregio. Il percorso si apre con aspettative altissime e con tutte le premesse per conseguire risultati formativi di eccellenza.",
      "Il profilo di ingresso dell’allievo si colloca al massimo livello previsto: la preparazione pregressa è eccellente per completezza, profondità e organizzazione delle conoscenze. L’approccio metodico, la motivazione spiccata e la capacità di interagire con i contenuti in modo critico e autonomo sono elementi che emergono chiaramente già nelle primissime fasi del percorso, tracciando una traiettoria formativa di altissimo potenziale.",
      "L’allievo accede al percorso formativo con una dotazione iniziale di conoscenze e competenze di livello eccellente, che lo pone in una posizione di vantaggio rispetto agli obiettivi del corso. La solidità delle basi disciplinari, unita a una spiccata capacità di apprendimento autonomo e a un evidente entusiasmo verso i contenuti proposti, costituisce un punto di partenza di straordinaria qualità, da cui ci si attende il conseguimento dei traguardi formativi più ambiziosi."],
    DISTINTO:[
      "L\u2019allievo evidenzia una preparazione di base solida e ottime capacit\u00e0 di apprendimento. Le conoscenze pregresse risultano ben strutturate e adeguatamente approfondite, e l\u2019approccio alle attivit\u00e0 formative \u00e8 caratterizzato da seriet\u00e0, metodo e buona autonomia operativa. Questi elementi, rilevati fin dalle prime fasi del percorso, lasciano prevedere risultati molto positivi e un avanzamento costante verso gli obiettivi formativi programmati.",
      "Il profilo iniziale dell\u2019allievo \u00e8 caratterizzato da una preparazione di base molto buona, con competenze pregresse solide e una buona capacit\u00e0 di orientamento nei contenuti proposti. Dimostra fin dall\u2019avvio una partecipazione attiva, un interesse genuino per le discipline affrontate e un metodo di lavoro gi\u00e0 sufficientemente strutturato, elementi che configurano un punto di partenza molto favorevole per il percorso formativo.",
      "L\u2019allievo accede al percorso formativo con una preparazione pregressa di livello distinto, evidenziando buone basi disciplinari e ottime capacit\u00e0 di apprendimento. Il metodo di lavoro gi\u00e0 sviluppato, la diligenza dimostrata e la propensione alla collaborazione rappresentano risorse significative per affrontare con successo le sfide del percorso e raggiungere traguardi formativi di sicuro rilievo nel settore."
    ,
      "L’allievo si presenta al percorso con un profilo iniziale molto positivo, caratterizzato da solide conoscenze pregresse e da una buona capacità di orientamento nelle tematiche del settore. La serietà mostrata nelle prime attività, unita a un metodo di studio già sufficientemente strutturato e a un genuino interesse per le discipline affrontate, rappresenta una base molto favorevole per il conseguimento di traguardi formativi di rilievo nel corso del percorso.",
      "Il profilo di ingresso dell’allievo evidenzia una preparazione di base distinta, con conoscenze pregresse ben radicate e una discreta padronanza degli strumenti operativi di base del settore. L’approccio alle prime attività è caratterizzato da prontezza, disponibilità al confronto e buona capacità di elaborazione delle informazioni, elementi che delineano un punto di partenza molto soddisfacente per lo sviluppo del percorso formativo.",
      "L’allievo accede al percorso con una preparazione pregressa di livello molto buono, mostrando fin dalle fasi iniziali spiccate capacità di comprensione e una buona attitudine all’apprendimento attivo. Le basi disciplinari risultano ben consolidate e adeguatamente strutturate, consentendo un avvio rapido ed efficace delle attività formative. Il profilo di partenza lascia prevedere un percorso di apprendimento regolare e soddisfacente."],
    BUONO:[
      "L\u2019allievo evidenzia una preparazione di base discreta e buone capacit\u00e0 di apprendimento. Le conoscenze di partenza risultano complessivamente adeguate rispetto agli obiettivi del percorso formativo e l\u2019atteggiamento dimostrato nelle prime attivit\u00e0 lascia intravedere una buona disponibilit\u00e0 all\u2019apprendimento. Le capacit\u00e0 mostrate e la volont\u00e0 di confrontarsi con i contenuti proposti costituiscono una base positiva per il raggiungimento degli obiettivi previsti.",
      "Il profilo iniziale dell\u2019allievo si caratterizza per una preparazione di base buona, con competenze pregresse sufficientemente strutturate da garantire un avvio proficuo del percorso formativo. Dimostra interesse per le attivit\u00e0 proposte e una partecipazione abbastanza regolare, che rappresentano elementi positivi su cui costruire un percorso di apprendimento soddisfacente e progressivo durante tutte le fasi del percorso.",
      "L\u2019allievo si presenta al percorso formativo con una preparazione pregressa nel complesso buona, pur con qualche lacuna su aspetti specifici che verr\u00e0 colmata nel corso delle attivit\u00e0. Le capacit\u00e0 di apprendimento mostrate nelle prime fasi, la volont\u00e0 di partecipare attivamente e un approccio aperto al confronto costituiscono una base adeguata per il raggiungimento degli obiettivi formativi previsti."
    ,
      "L’allievo si presenta al percorso formativo con una preparazione iniziale nel complesso buona, evidenziando basi disciplinari adeguate e una discreta familiarità con i contenuti del settore di riferimento. L’approccio alle prime attività è positivo e collaborativo, con una disponibilità all’impegno che lascia prevedere risultati soddisfacenti nel corso del percorso, a condizione che venga mantenuta una frequenza regolare e un’adeguata partecipazione alle attività proposte.",
      "Il profilo di ingresso dell’allievo si caratterizza per una preparazione di base complessivamente buona, con competenze pregresse adeguate e un atteggiamento positivo verso i contenuti proposti. Le prime interazioni con i materiali formativi e con il gruppo classe evidenziano una sufficiente autonomia e una disponibilità al lavoro che costituiscono un punto di partenza incoraggiante per il percorso.",
      "L’allievo accede al percorso formativo dimostrando un livello di preparazione iniziale buono, con basi disciplinari complessivamente adeguate e una motivazione di base sufficiente a supportare un apprendimento regolare e progressivo. Pur in presenza di qualche area da approfondire, il profilo di partenza è nel complesso favorevole per il raggiungimento degli obiettivi formativi previsti."],
    DISCRETO:[
      "L\u2019allievo evidenzia una preparazione di base soddisfacente, con alcune lacune su argomenti specifici che richiedono un consolidamento mirato nelle prime fasi del percorso. Le capacit\u00e0 di apprendimento dimostrate sono adeguate, anche se l\u2019approccio alle attivit\u00e0 non \u00e8 sempre caratterizzato dalla costanza e dall\u2019autonomia auspicate, necessitando di un accompagnamento strutturato da parte del formatore.",
      "Il profilo iniziale dell\u2019allievo mostra una preparazione pregressa discreta, con basi disciplinari parzialmente sviluppate e presenza di alcune incertezze nella gestione dei contenuti propedeutici. Queste caratteristiche rendono necessario un lavoro iniziale di rinforzo e consolidamento. La disponibilit\u00e0 mostrata a seguire le indicazioni del formatore \u00e8 tuttavia un elemento positivo su cui fare leva per favorire il progressivo miglioramento nel corso del percorso.",
      "L\u2019allievo accede al percorso con una preparazione di base discreta, sufficiente per la comprensione dei contenuti fondamentali ma con evidenti margini di miglioramento in alcune aree disciplinari. L\u2019impegno mostrato nelle prime attivit\u00e0 lascia spazio a un percorso di crescita, a condizione che vengano mantenute una partecipazione regolare e una disponibilit\u00e0 al confronto costruttivo con i formatori e il gruppo classe."
    ,
      "L’allievo accede al percorso con un profilo iniziale discreto, evidenziando conoscenze pregresse parzialmente adeguate con alcune lacune in specifiche aree tematiche. Il livello di partenza richiederà un accompagnamento attivo da parte del formatore nelle prime fasi, al fine di colmare le incertezze rilevate e costruire una base sufficientemente solida per affrontare i contenuti più avanzati del percorso formativo.",
      "Il profilo di ingresso dell’allievo mostra una preparazione di base discreta, con basi disciplinari presenti ma non sempre consolidate. L’approccio alle attività iniziali evidenzia qualche difficoltà nell’orientamento autonomo tra i contenuti proposti, rendendo necessario un supporto metodologico sistematico nelle prime fasi per favorire una partecipazione proficua al percorso.",
      "L’allievo si presenta al percorso formativo con una dotazione iniziale discreta di conoscenze e competenze di base, con margini di miglioramento evidenti in alcune aree disciplinari. La disponibilità a seguire le indicazioni del formatore rappresenta una risorsa positiva su cui fare leva per il graduale consolidamento delle basi, necessario per affrontare con sufficiente sicurezza i contenuti previsti dal percorso."],
    SUFFICIENTE:[
      "L\u2019allievo evidenzia una preparazione di base sufficiente, con conoscenze pregresse essenziali che richiedono un rafforzamento sistematico per affrontare adeguatamente i contenuti del percorso formativo. L\u2019approccio iniziale alle attivit\u00e0 \u00e8 accettabile ma non sempre costante, rendendo necessaria un\u2019attenzione particolare al mantenimento della motivazione e della regolarit\u00e0 nella frequenza e nella partecipazione.",
      "Il profilo iniziale dell\u2019allievo evidenzia una preparazione di partenza appena sufficiente, con lacune in alcune aree disciplinari fondamentali che richiederanno interventi di recupero e rinforzo nelle prime fasi del percorso. Le capacit\u00e0 di apprendimento esistono ma necessitano di essere stimolate e guidate per consentire il graduale raggiungimento degli obiettivi formativi minimi previsti dal percorso.",
      "L\u2019allievo si presenta con una preparazione pregressa di livello sufficiente, caratterizzata da basi disciplinari fragili in alcune aree e da un metodo di studio non ancora pienamente strutturato. \u00c8 necessario un lavoro iniziale di consolidamento dei prerequisiti e di sviluppo di abitudini di lavoro pi\u00f9 regolari, al fine di garantire un adeguato avanzamento verso gli obiettivi minimi del percorso formativo."
    ,
      "L’allievo accede al percorso formativo con una preparazione iniziale appena sufficiente, caratterizzata da basi disciplinari fragili e da alcune lacune nei contenuti propedeutici fondamentali. Il profilo di ingresso richiede un lavoro sistematico di consolidamento nelle prime fasi, unito a un maggiore investimento personale nella partecipazione alle attività, per consentire un avanzamento graduale verso gli obiettivi formativi minimi previsti dal percorso.",
      "Il profilo iniziale dell’allievo evidenzia una preparazione di base sufficiente ma fragile, con conoscenze pregresse essenziali e una limitata dimestichezza con i contenuti del settore. L’approccio alle prime attività mostra una partecipazione accettabile ma non ancora pienamente coinvolta, rendendo necessaria un’attenzione particolare da parte del formatore per stimolare la motivazione e garantire un avanzamento regolare nel percorso.",
      "L’allievo si presenta al percorso con un livello di preparazione di partenza sufficiente, con basi disciplinari presenti ma non ancora organicamente strutturate. Le capacità di apprendimento mostrate nelle prime interazioni con i contenuti sono adeguate per un avvio minimo del percorso, ma richiedono un supporto costante e una progressiva stimolazione per evitare l’accumulo di lacune nelle fasi più avanzate."],
    INSUFFICIENTE:[
      "L\u2019allievo evidenzia lacune nella preparazione di base che richiedono un intervento di recupero immediato e strutturato. Le conoscenze pregresse risultano frammentarie e insufficienti rispetto ai requisiti del percorso formativo, rendendo necessaria una programmazione individualizzata e un accompagnamento costante sin dalle prime attivit\u00e0, al fine di consentire un avanzamento progressivo verso gli obiettivi minimi previsti.",
      "Il profilo iniziale dell\u2019allievo evidenzia una preparazione pregressa insufficiente, con lacune rilevanti nei contenuti di base che rendono problematico l\u2019accesso ai contenuti disciplinari del percorso. L\u2019atteggiamento mostrato nelle prime attivit\u00e0 segnala inoltre difficolt\u00e0 di concentrazione e di organizzazione del lavoro, aspetti che richiedono un intervento pedagogico mirato, tempestivo e fortemente individualizzato.",
      "L\u2019allievo accede al percorso con una preparazione di base gravemente lacunosa, che non garantisce il possesso dei prerequisiti fondamentali richiesti per affrontare le unit\u00e0 formative previste. Le difficolt\u00e0 evidenziate nella comprensione dei contenuti propedeutici rendono indispensabile l\u2019attivazione di percorsi di recupero personalizzati, volti a fornire all\u2019allievo gli strumenti minimi necessari per partecipare proficuamente alle attivit\u00e0 formative."
    ,
      "L’allievo si presenta al percorso formativo con un profilo iniziale insufficiente, caratterizzato da lacune significative nelle conoscenze di base e da una scarsa familiarità con i prerequisiti disciplinari fondamentali. La situazione rilevata all’ingresso rende indispensabile un intervento di rinforzo immediato e la predisposizione di un piano didattico personalizzato, finalizzato a dotare l’allievo degli strumenti minimi necessari per partecipare proficuamente al percorso.",
      "Il profilo di ingresso dell’allievo denota una preparazione pregressa gravemente insufficiente, con conoscenze frammentarie e lacune diffuse nelle aree disciplinari fondamentali del settore. L’approccio alle prime attività evidenzia inoltre difficoltà di concentrazione e una limitata autonomia operativa, elementi che richiedono un’attenzione pedagogica prioritaria e la definizione di strategie di intervento personalizzate e tempestive.",
      "L’allievo accede al percorso formativo con una preparazione iniziale insufficiente, priva dei prerequisiti essenziali richiesti per un avvio proficuo delle attività. Le lacune rilevate nelle prime fasi di valutazione interessano più aree disciplinari fondamentali e rendono necessario un percorso di recupero preventivo, da attivare con urgenza, per mettere l’allievo nelle condizioni di seguire le attività formative in modo almeno minimamente produttivo."]
  };
  const variants=map[votoToValutazione(v)];
  if(!variants)return"Profilo in fase di valutazione.";
  return variants[Math.floor(Math.random()*variants.length)];
}

function votoToValIntermedia(v){
  const map={
    OTTIMO:[
      "Ha dimostrato progressi eccellenti durante il percorso formativo, superando le aspettative in tutte le aree disciplinari affrontate. L\u2019allievo ha mostrato una crescita costante e accelerata, assimilando i contenuti con grande rapidit\u00e0 e profondit\u00e0, e applicandoli con sicurezza e creativit\u00e0 nelle attivit\u00e0 pratiche proposte. I risultati delle verifiche intermedie collocano il suo percorso di apprendimento ai massimi livelli attesi.",
      "I progressi registrati nella fase intermedia del percorso sono stati eccellenti e superiori alle aspettative. L\u2019allievo ha consolidato con piena padronanza i contenuti affrontati nelle prime unit\u00e0 formative, dimostrando un\u2019ottima capacit\u00e0 di trasferimento delle competenze in contesti operativi diversificati. L\u2019impegno dimostrato, la qualit\u00e0 del lavoro prodotto e la partecipazione attiva e propositiva confermano un percorso di apprendimento di assoluta eccellenza.",
      "La valutazione intermedia evidenzia progressi di livello eccellente in tutte le aree del percorso formativo. L\u2019allievo ha raggiunto e superato ampiamente gli obiettivi intermedi programmati, dimostrando una maturazione rapida delle competenze e un\u2019ottima capacit\u00e0 di autovalutazione e autocorrezione. La traiettoria di apprendimento osservata lascia prevedere il conseguimento di risultati finali di massima eccellenza."
    ,
      "La valutazione relativa alla fase intermedia del percorso evidenzia risultati di eccellenza assoluta. L’allievo ha assimilato con rapida profondità tutti i contenuti affrontati, dimostrando una padronanza eccezionale degli strumenti teorici e pratici del settore. L’impegno, la qualità delle elaborazioni prodotte e la capacità di trasferire le competenze acquisite in contesti operativi nuovi e diversificati collocano il suo percorso ai vertici delle aspettative formative.",
      "A metà percorso, i progressi dell’allievo si attestano su livelli di eccellenza pienamente confermati dai risultati delle verifiche. Ha dimostrato una maturazione rapida e profonda delle competenze previste, unita a una spiccata capacità di analisi critica e di problem solving in situazioni complesse. La qualità della partecipazione, la puntualità nell’esecuzione dei compiti e l’entusiasmo dimostrato rafforzano la prospettiva di un risultato finale di assoluto livello.",
      "I progressi rilevati nella fase intermedia del percorso formativo si caratterizzano per un livello di eccellenza che supera ogni aspettativa. L’allievo ha sviluppato con sicurezza le competenze chiave del profilo professionale, mostrando una notevole capacità di rielaborazione autonoma dei contenuti e un approccio consapevole e riflessivo alle attività proposte. La traiettoria osservata indica con chiarezza il raggiungimento dei massimi obiettivi finali."],
    DISTINTO:[
      "Ha dimostrato progressi molto positivi durante il percorso formativo, con risultati costantemente soddisfacenti in tutte le aree disciplinari. L\u2019allievo ha consolidato con solidit\u00e0 le competenze acquisite nelle prime fasi, mostrando un\u2019apprezzabile capacit\u00e0 di applicazione autonoma e una crescita continua nella padronanza degli strumenti operativi richiesti dal profilo professionale del settore di riferimento.",
      "I progressi registrati nella fase intermedia del percorso formativo sono stati molto buoni. L\u2019allievo ha affrontato le diverse unit\u00e0 didattiche con seriet\u00e0 e impegno, raggiungendo con ampio margine gli obiettivi intermedi programmati e dimostrando una solida acquisizione delle competenze chiave previste. Le prestazioni pratiche rese evidenziano un buon livello di maturit\u00e0 operativa e una crescente autonomia esecutiva.",
      "La valutazione intermedia certifica progressi distinti in tutte le dimensioni del percorso formativo. L\u2019allievo ha saputo consolidare le basi acquisite nelle prime fasi e approfondire gradualmente i contenuti pi\u00f9 complessi, dimostrando costanza nell\u2019impegno e un\u2019apprezzabile capacit\u00e0 di autorganizzazione del lavoro. I risultati conseguiti a met\u00e0 percorso delineano una traiettoria formativa molto positiva e rassicurante."
    ,
      "La valutazione intermedia registra progressi molto positivi, con una crescita regolare e costante in tutte le aree del percorso. L’allievo ha consolidato con solidità le competenze teoriche e operative delle prime unità didattiche, mostrando una buona autonomia nell’applicazione delle conoscenze e una partecipazione propositiva e continua. I risultati raggiunti a metà percorso delineano una prospettiva molto favorevole per il conseguimento degli obiettivi finali.",
      "A metà percorso, l’allievo evidenzia progressi distinti, con una comprensione solida e organica dei contenuti affrontati e una crescente capacità di operare con autonomia nei contesti pratici del settore. L’impegno dimostrato è stato costante e la qualità del lavoro prodotto è risultata elevata. Gli obiettivi intermedi programmati sono stati pienamente raggiunti, confermando un percorso formativo in forte progressione verso i traguardi finali.",
      "I progressi intermedi registrati nell’allievo evidenziano un livello distinto di acquisizione delle competenze. Ha mostrato un approccio serio e metodico alle attività formative, raggiungendo con piena soddisfazione tutti gli obiettivi intermedi programmati. La capacità di collegare teoria e pratica è in costante miglioramento, e le prestazioni operative rese nella fase intermedia confermano una crescita formativa solida e affidabile."],
    BUONO:[
      "Ha dimostrato progressi soddisfacenti durante il percorso formativo, raggiungendo i principali obiettivi intermedi con buoni risultati complessivi. L\u2019allievo ha mostrato una crescita apprezzabile nelle competenze disciplinari, con una partecipazione regolare alle attivit\u00e0 e una sufficiente capacit\u00e0 di applicazione delle conoscenze acquisite nelle diverse situazioni pratiche proposte nel corso del percorso formativo.",
      "I progressi registrati nella fase intermedia del percorso sono stati buoni e nel complesso in linea con le aspettative. L\u2019allievo ha affrontato i contenuti formativi con impegno costante, dimostrando una buona assimilazione degli argomenti trattati e una discreta capacit\u00e0 di trasferimento delle competenze in ambito operativo. Gli obiettivi intermedi programmati sono stati raggiunti con piena soddisfazione.",
      "La valutazione intermedia evidenzia progressi buoni e regolari nel percorso di acquisizione delle competenze. L\u2019allievo ha risposto positivamente alle attivit\u00e0 formative proposte, consolidando gradualmente le proprie abilit\u00e0 teoriche e pratiche. Le prestazioni rese nella fase intermedia del percorso confermano un profilo in crescita costante, con ottime prospettive per il completamento degli obiettivi finali previsti dal percorso formativo."
    ,
      "La valutazione intermedia evidenzia progressi buoni e nel complesso soddisfacenti. L’allievo ha mostrato una partecipazione regolare e un impegno adeguato, raggiungendo con soddisfazione i principali obiettivi intermedi programmati. La comprensione dei contenuti trattati è buona e la capacità di applicazione pratica delle conoscenze è in crescita progressiva, delineando una prospettiva positiva per il raggiungimento degli obiettivi finali del percorso.",
      "A metà percorso, i progressi dell’allievo si attestano su un livello buono, con risultati soddisfacenti sia nelle verifiche teoriche che nelle attività operative. L’impegno è stato regolare e la disponibilità al confronto e all’apprendimento è apprezzabile. Gli obiettivi intermedi sono stati raggiunti, confermando una crescita costante e un percorso formativo in linea con le aspettative programmatiche.",
      "I progressi registrati nella fase intermedia del percorso sono buoni, evidenziando una crescita positiva nelle competenze disciplinari e operative. L’allievo ha risposto con impegno alle proposte formative, sviluppando una discreta autonomia nell’esecuzione delle attività pratiche e una comprensione sufficientemente approfondita degli argomenti trattati. Il quadro complessivo a metà percorso è incoraggiante e in linea con gli obiettivi programmati."],
    DISCRETO:[
      "Ha dimostrato progressi adeguati nel corso del percorso formativo, con un impegno regolare ma non sempre costante che ha consentito il raggiungimento degli obiettivi intermedi in modo sufficiente. Permangono alcune incertezze nella padronanza di specifici contenuti disciplinari che richiedono un ulteriore e mirato consolidamento nella fase conclusiva del percorso formativo, per garantire il raggiungimento degli obiettivi previsti.",
      "I progressi registrati nella fase intermedia del percorso sono stati discreti, evidenziando una crescita graduale ma ancora discontinua nelle competenze acquisite. L\u2019allievo ha mostrato momenti di buona partecipazione alternati a fasi di minore impegno, con il risultato di raggiungere solo parzialmente alcuni degli obiettivi intermedi programmati. Un maggiore investimento nella fase conclusiva del percorso \u00e8 indispensabile.",
      "La valutazione intermedia certifica progressi di livello discreto. L\u2019allievo ha assimilato i contenuti fondamentali delle prime unit\u00e0 formative, pur con qualche lacuna su argomenti specifici che richieder\u00e0 interventi di rinforzo mirati nella fase conclusiva. La capacit\u00e0 di applicazione pratica delle conoscenze \u00e8 ancora in fase di sviluppo e necessita di essere consolidata attraverso un impegno pi\u00f9 regolare, sistematico e una partecipazione pi\u00f9 attiva alle attivit\u00e0 proposte."
    ,
      "I progressi rilevati nella fase intermedia del percorso sono discreti, con una crescita visibile ma non sempre costante nelle competenze acquisite. L’allievo ha raggiunto solo parzialmente alcuni degli obiettivi intermedi programmati, mostrando incertezze su specifici contenuti che richiedono un lavoro mirato di consolidamento nella fase conclusiva. Un impegno più sistematico e continuo è necessario per garantire il pieno raggiungimento dei traguardi formativi finali.",
      "La valutazione intermedia certifica progressi discreti, con risultati adeguati nelle aree fondamentali ma con fragilità evidenti in alcune competenze chiave del profilo professionale. L’allievo ha mostrato momenti di buona risposta alle attività, alternati a fasi di minore coinvolgimento, rendendo il percorso di acquisizione delle competenze discontinuo. Un maggiore investimento nella fase finale è indispensabile per consolidare quanto appreso.",
      "A metà percorso, il livello dei progressi dell’allievo si colloca su un valore discreto. Ha affrontato le unità didattiche con impegno variabile, raggiungendo la comprensione dei contenuti fondamentali pur con alcune incertezze operative che necessitano di essere risolte. Gli obiettivi intermedi sono stati conseguiti in misura parziale e la prosecuzione del percorso richiederà un approccio più regolare e determinato."],
    SUFFICIENTE:[
      "Ha dimostrato progressi sufficienti nel corso del percorso formativo, con margini di miglioramento evidenti in diverse aree disciplinari ancora da colmare. L\u2019allievo ha raggiunto gli obiettivi intermedi minimi programmati, anche grazie agli interventi di supporto attivati, ma la padronanza delle competenze acquisite rimane ancora fragile e richiede un ulteriore e significativo consolidamento nella fase finale del percorso.",
      "I progressi registrati nella fase intermedia del percorso sono stati appena sufficienti. L\u2019allievo ha mostrato un impegno non sempre adeguato e una partecipazione discontinua alle attivit\u00e0 formative, che hanno limitato la piena acquisizione di alcune competenze chiave. Gli obiettivi intermedi sono stati raggiunti solo in parte, rendendo necessario un impegno nettamente maggiore nella fase conclusiva del percorso.",
      "La valutazione intermedia evidenzia progressi sufficienti, ma con significativi margini di miglioramento ancora da colmare. L\u2019allievo ha incontrato alcune difficolt\u00e0 nell\u2019assimilazione di specifici contenuti disciplinari, richiedendo interventi di recupero e rinforzo mirati durante il percorso. La situazione attuale richiede un impegno sostanzialmente maggiore nella fase conclusiva per garantire il raggiungimento degli obiettivi finali."
    ,
      "La valutazione intermedia evidenzia progressi appena sufficienti, con il raggiungimento degli obiettivi minimi programmati solo grazie agli interventi di supporto attivati. L’allievo ha mostrato una partecipazione irregolare e un impegno non adeguato alle richieste del percorso, con il risultato di acquisire le competenze in modo superficiale e non sempre stabile. La fase conclusiva del percorso richiede un netto cambiamento nell’approccio e un impegno molto più sostenuto.",
      "A metà percorso, i progressi si attestano su un livello sufficiente, ma con ampie aree di miglioramento ancora da colmare. L’allievo ha dimostrato alcune difficoltà nell’assimilazione dei contenuti più complessi, necessitando di interventi di recupero mirati. Il raggiungimento degli obiettivi minimi è stato possibile, ma la solidità delle competenze acquisite rimane fragile e richiede un consolidamento significativo nella fase finale.",
      "I progressi registrati nella fase intermedia del percorso sono sufficienti, ma evidenziano fragilità diffuse nelle competenze acquisite. L’allievo ha faticato a mantenere un ritmo di apprendimento regolare, con lacune che si sono rivelate in più fasi del percorso e che hanno richiesto interventi di rinforzo specifici. Il quadro attuale impone una significativa accelerazione dell’impegno nella fase conclusiva per garantire il raggiungimento degli obiettivi formativi finali."],
    INSUFFICIENTE:[
      "Ha mostrato progressi limitati nel percorso formativo, richiedendo interventi di recupero mirati e costanti. L\u2019allievo non ha ancora raggiunto gli obiettivi intermedi minimi programmati, evidenziando lacune significative nella comprensione dei contenuti e serie difficolt\u00e0 nell\u2019applicazione pratica delle competenze. La situazione richiede un cambio di atteggiamento sostanziale e un impegno molto pi\u00f9 intenso nella fase conclusiva del percorso.",
      "I progressi registrati nella fase intermedia del percorso formativo sono stati insufficienti. L\u2019allievo ha mostrato una partecipazione molto discontinua e un impegno inadeguato rispetto alle richieste del percorso, con il risultato di non aver acquisito le competenze fondamentali previste a questo stadio. Gli interventi di recupero attivati hanno avuto un impatto limitato e \u00e8 necessario un radicale cambiamento nell\u2019approccio alle attivit\u00e0 formative.",
      "La valutazione intermedia certifica progressi insufficienti in tutte le aree del percorso. L\u2019allievo non ha raggiunto gli obiettivi intermedi programmati, evidenziando lacune rilevanti sia nella dimensione teorica che in quella pratica. L\u2019impegno dimostrato \u00e8 risultato del tutto inadeguato rispetto alle aspettative del percorso formativo. Si rendono indispensabili interventi intensivi di recupero e un monitoraggio stretto dell\u2019allievo nella fase conclusiva."
    ,
      "I progressi registrati nella fase intermedia del percorso sono insufficienti, con lacune che interessano diverse aree disciplinari fondamentali. L’allievo ha mostrato una partecipazione molto discontinua e un impegno inadeguato, che non hanno consentito l’acquisizione delle competenze di base previste a questo stadio del percorso. Gli interventi di recupero attivati hanno prodotto risultati limitati e la situazione richiede misure urgenti e strutturate nella fase conclusiva.",
      "La valutazione intermedia certifica un avanzamento insufficiente rispetto agli obiettivi programmati. L’allievo non ha raggiunto i livelli minimi attesi in diverse competenze chiave, a causa di una partecipazione irregolare, di un impegno insufficiente e di serie difficoltà nella comprensione dei contenuti. L’attivazione di un piano di recupero personalizzato è necessaria per tentare di colmare le lacune rilevate prima della conclusione del percorso.",
      "A metà percorso, il quadro dei progressi dell’allievo è insufficiente in quasi tutte le aree del percorso formativo. Le difficoltà emerse nelle prime fasi non sono state superate e, in alcuni casi, si sono consolidate, rendendo il divario rispetto agli obiettivi minimi programmati ancora più marcato. Un intervento di recupero intensivo e un monitoraggio costante sono indispensabili per scongiurare l’insuccesso formativo."]
  };
  const variants=map[votoToValutazione(v)];
  if(!variants)return"Valutazione intermedia in fase di elaborazione.";
  return variants[Math.floor(Math.random()*variants.length)];
}

function votoToDescFinale(v){
  const map={
    OTTIMO:[
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 stata eccellente. L\u2019allievo ha manifestato un impegno costante, entusiasta e propositivo durante l\u2019intero percorso formativo, dimostrando una comprensione ottima e approfondita di tutti gli argomenti trattati. Ha pienamente raggiunto e superato gli obiettivi disciplinari programmati, evidenziando spiccate capacit\u00e0 di analisi, sintesi e rielaborazione critica. \u00c8 in grado di applicare le conoscenze acquisite in modo autonomo, flessibile e creativo, adattandole con sicurezza alle diverse situazioni operative incontrate durante le prestazioni professionali. La qualit\u00e0 del lavoro prodotto, la precisione nell\u2019esecuzione e la capacit\u00e0 di problem solving dimostrata collocano il profilo dell\u2019allievo al massimo livello di eccellenza per questo percorso formativo.",
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 avvenuta a un livello di eccellenza assoluta. L\u2019allievo ha partecipato alle attivit\u00e0 formative con dedizione esemplare, curiosit\u00e0 intellettuale e spirito di iniziativa, dimostrando una padronanza completa e sicura di tutti i contenuti disciplinari affrontati. Ha conseguito pienamente e con ampio margine tutti gli obiettivi programmati, distinguendosi per la capacit\u00e0 di affrontare situazioni complesse e non convenzionali con prontezza e originalit\u00e0. Le prestazioni professionali rese evidenziano un livello di maturit\u00e0 operativa e una cura della qualit\u00e0 del lavoro che superano le aspettative del percorso formativo, configurando un profilo di assoluta eccellenza.",
      "Il percorso di acquisizione delle competenze di base e delle capacit\u00e0 professionali si \u00e8 concluso con risultati eccezionali. L\u2019allievo ha dimostrato sin dalle prime fasi una motivazione elevata e un metodo di lavoro rigoroso e autonomo, che gli hanno consentito di padroneggiare con sicurezza l\u2019intera gamma degli argomenti trattati. Ha superato brillantemente tutti gli obiettivi disciplinari programmati, mostrando notevoli capacit\u00e0 di trasferimento delle conoscenze in contesti operativi reali e una spiccata attitudine alla rielaborazione personale dei contenuti appresi. La costanza dell\u2019impegno, l\u2019autonomia esecutiva e la qualit\u00e0 delle prestazioni professionali rese ne delineano un profilo formativo di eccellenza."
    ,
      "Il percorso di acquisizione delle competenze di base e delle capacità professionali si è concluso con esiti di assoluta eccellenza. L’allievo ha dimostrato nel corso dell’intero percorso una padronanza completa e sicura di tutti i contenuti disciplinari affrontati, unita a una spiccata capacità di rielaborazione critica e di trasferimento autonomo delle conoscenze in contesti operativi reali e diversificati. L’impegno costante, l’entusiasmo propositivo e la qualità straordinaria delle prestazioni professionali rese ne confermano il profilo di assoluta eccellenza, collocandolo ai vertici del gruppo classe e tra i profili più promettenti del settore.",
      "L’allievo ha concluso il percorso formativo con risultati eccezionali, dimostrando una maturazione professionale e personale di livello superiore rispetto alle aspettative. Ha padroneggiato con sicurezza e profondità tutti gli obiettivi disciplinari programmati, distinguendosi per capacità critica, creatività applicativa e autonomia decisionale. La qualità delle prestazioni professionali rese nel corso del percorso è stata costantemente eccellente, evidenziando una preparazione di assoluto valore e potenzialità di sviluppo professionale elevatissime.",
      "Le competenze di base e le capacità professionali acquisite dall’allievo al termine del percorso formativo si attestano su un livello di eccellenza non comune. L’allievo ha saputo integrare con maestria le conoscenze teoriche con le abilità pratiche, esprimendo prestazioni professionali di alto livello in tutte le situazioni operative affrontate. La motivazione, la disciplina e la continua ricerca della qualità che hanno contraddistinto il suo percorso lasciano prevedere un’attività professionale futura di grande successo."],
    DISTINTO:[
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 stata molto buona. L\u2019allievo ha manifestato un impegno costante e partecipe nel corso dell\u2019intero percorso formativo, dimostrando una comprensione approfondita e solida degli argomenti trattati nelle diverse unit\u00e0 didattiche. Ha pienamente raggiunto gli obiettivi disciplinari programmati, con risultati costantemente positivi sia nella parte teorica che in quella pratica. \u00c8 in grado di applicare le conoscenze acquisite con sicurezza e autonomia, rielaborandole in modo personale e appropriato nelle diverse situazioni professionali. Dimostra buone capacit\u00e0 organizzative, cura del dettaglio e attitudine alla collaborazione, elementi che concorrono a delineare un profilo formativo di alto livello.",
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 avvenuta con risultati molto positivi. L\u2019allievo ha affrontato il percorso formativo con seriet\u00e0 e continuity\u00e0 di impegno, dimostrando una comprensione solida e organica dei contenuti proposti. Ha raggiunto con piena soddisfazione tutti gli obiettivi disciplinari programmati, mettendo in evidenza una buona capacit\u00e0 di collegamento tra teoria e pratica e un\u2019apprezzabile autonomia nell\u2019esecuzione delle attivit\u00e0 operative. Le prestazioni professionali rese sono risultate accurate, puntuali e coerenti con le competenze attese, delineando un profilo formativo solido e affidabile, che si colloca ad un ottimo livello di preparazione complessiva.",
      "Il livello di acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 stato decisamente buono, attestandosi su risultati distinti in tutte le aree del percorso. L\u2019allievo ha mostrato durante le attivit\u00e0 formative una partecipazione attiva e propositiva, unita a una comprensione approfondita degli argomenti e a una valida capacit\u00e0 di rielaborazione personale. Ha conseguito pienamente gli obiettivi disciplinari programmati, dimostrando sicurezza operativa, precisione esecutiva e buona gestione delle situazioni professionali incontrate. L\u2019insieme delle competenze sviluppate e la qualit\u00e0 costante delle prestazioni delineano un profilo formativo di alto profilo."
    ,
      "Il percorso formativo si è concluso con un’acquisizione distinta delle competenze di base e delle capacità professionali. L’allievo ha dimostrato nel corso delle attività una comprensione solida e approfondita degli argomenti trattati, unita a una buona capacità di applicazione autonoma in contesti operativi reali. La costanza dell’impegno, la cura nella realizzazione delle prestazioni e la disponibilità alla collaborazione delineano un profilo formativo di sicuro valore, pienamente in grado di operare nel settore di riferimento con competenza e professionalità.",
      "L’allievo ha concluso il percorso formativo conseguendo un livello di acquisizione delle competenze decisamente buono. Ha affrontato tutte le unità didattiche con serietà e impegno, sviluppando una padronanza solida dei contenuti teorici e una buona abilità nelle applicazioni pratiche del settore. Le prestazioni professionali rese sono state accurate e di qualità, evidenziando un grado di maturità operativa molto apprezzabile e un profilo professionale affidabile e ben strutturato.",
      "Le competenze di base e le capacità professionali acquisite al termine del percorso si collocano su un livello distinto e soddisfacente. L’allievo ha saputo valorizzare le proprie risorse personali nel corso delle attività formative, raggiungendo pienamente gli obiettivi disciplinari programmati e sviluppando una buona autonomia esecutiva. Il profilo professionale delineato al termine del percorso è di buona qualità e presenta ottime prospettive di inserimento nel mondo del lavoro."],
    BUONO:[
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 stata buona. L\u2019allievo ha manifestato un impegno costante e partecipe durante il percorso formativo, dimostrando una comprensione buona degli argomenti affrontati nelle diverse unit\u00e0 didattiche. Ha pienamente raggiunto gli obiettivi disciplinari programmati ed \u00e8 in grado di applicare e rielaborare in maniera autonoma le conoscenze acquisite, applicandole correttamente e coerentemente durante le prestazioni professionali. L\u2019allievo ha dimostrato una soddisfacente capacit\u00e0 di operare in contesti diversificati, affrontando con adeguata sicurezza le situazioni pratiche proposte e contribuendo positivamente al clima di lavoro del gruppo.",
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 avvenuta con risultati buoni e soddisfacenti. L\u2019allievo ha partecipato con continuity\u00e0 e impegno alle attivit\u00e0 formative, dimostrando una comprensione chiara e ordinata dei contenuti disciplinari proposti. Ha raggiunto gli obiettivi programmati con buona padronanza e sa applicare le conoscenze acquisite in modo corretto nelle principali situazioni operative del settore. L\u2019esecuzione delle prestazioni professionali \u00e8 risultata precisa e coerente con le aspettative del percorso, evidenziando un profilo in crescita, capace di affrontare le sfide del mondo del lavoro con adeguata preparazione e spirito collaborativo.",
      "Il percorso di acquisizione delle competenze di base e delle capacit\u00e0 professionali si \u00e8 concluso con risultati buoni. L\u2019allievo ha mostrato un impegno regolare e una disponibilit\u00e0 positiva nei confronti delle attivit\u00e0 proposte, raggiungendo una comprensione soddisfacente degli argomenti affrontati e sviluppando le competenze operative richieste dal profilo professionale di riferimento. Ha conseguito pienamente gli obiettivi disciplinari programmati, dimostrando una discreta autonomia esecutiva e una buona capacit\u00e0 di adattamento alle diverse situazioni lavorative incontrate. Il livello di preparazione raggiunto costituisce una base solida per il proseguimento dell\u2019esperienza professionale."
    ,
      "Il percorso formativo si è concluso con una buona acquisizione delle competenze di base e delle capacità professionali. L’allievo ha partecipato con impegno regolare alle attività, raggiungendo gli obiettivi disciplinari programmati e sviluppando una sufficiente autonomia nell’esecuzione delle prestazioni operative. La qualità del lavoro prodotto è risultata nel complesso buona, con una crescita progressiva nelle abilità pratiche che delinea un profilo professionale adeguato e pronto per un primo inserimento nel settore.",
      "L’allievo ha concluso il percorso formativo con risultati buoni, evidenziando una comprensione adeguata degli argomenti affrontati e una discreta capacità di applicazione pratica delle conoscenze acquisite. Ha dimostrato volontà di partecipare attivamente e disponibilità a migliorarsi nel corso delle attività, elementi che hanno contribuito positivamente al suo percorso di crescita. Le competenze sviluppate rappresentano una base solida per il proseguimento dell’esperienza nel settore professionale.",
      "Le competenze di base e le capacità professionali acquisite al termine del percorso si attestano su un livello buono, con un profilo operativo adeguato alle richieste del mercato del lavoro di riferimento. L’allievo ha dimostrato serietà nell’approccio alle attività, ha raggiunto pienamente gli obiettivi formativi programmati e ha mostrato una progressiva crescita nelle abilità pratiche, che nel complesso delineano una preparazione soddisfacente per affrontare le sfide del settore professionale."],
    DISCRETO:[
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 stata discreta. L\u2019allievo ha manifestato un impegno abbastanza regolare durante il percorso formativo, dimostrando una comprensione adeguata degli argomenti trattati, pur con alcune incertezze su aspetti specifici che hanno richiesto un consolidamento mirato. Ha raggiunto gli obiettivi disciplinari programmati in modo soddisfacente, evidenziando una sufficiente capacit\u00e0 di applicazione delle conoscenze nelle situazioni operative standard. Si ritiene che, con un impegno pi\u00f9 costante e una maggiore autonomia operativa, l\u2019allievo possa consolidare ulteriormente il proprio profilo professionale e raggiungere risultati ancora pi\u00f9 soddisfacenti.",
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali si \u00e8 attestata su un livello discreto. L\u2019allievo ha partecipato alle attivit\u00e0 formative con impegno non sempre costante, raggiungendo tuttavia una comprensione sufficientemente adeguata dei principali contenuti disciplinari. Ha conseguito gli obiettivi minimi programmati, pur manifestando alcune difficolt\u00e0 nell\u2019applicazione autonoma delle conoscenze in situazioni operative pi\u00f9 articolate. Le prestazioni professionali rese sono risultate nel complesso accettabili, anche se con margini di miglioramento evidenti nella precisione esecutiva e nella gestione autonoma dei processi lavorativi. Un maggior investimento personale consentirebbe di valorizzare pienamente le potenzialit\u00e0 individuali.",
      "Il livello di acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 risultato discreto. L\u2019allievo ha affrontato il percorso formativo con un atteggiamento abbastanza collaborativo, raggiungendo una comprensione di base adeguata degli argomenti proposti, seppur con alcune lacune che hanno reso necessari interventi di rinforzo individualizzati. Ha conseguito gli obiettivi disciplinari essenziali, dimostrando una capacit\u00e0 applicativa sufficiente nelle situazioni operative pi\u00f9 semplici e strutturate. Si auspica che l\u2019allievo sappia consolidare nel tempo le competenze acquisite, sviluppando maggiore autonomia e sicurezza nelle prestazioni professionali."
    ,
      "Il percorso formativo si è concluso con un’acquisizione discreta delle competenze di base e delle capacità professionali. L’allievo ha raggiunto gli obiettivi minimi programmati, pur mostrando alcune incertezze su aspetti specifici del profilo professionale che richiedono un ulteriore consolidamento. La capacità operativa sviluppata è sufficiente per un primo approccio al mondo del lavoro, ma si raccomanda un impegno continuativo nell’aggiornamento e nel rafforzamento delle competenze acquisite.",
      "L’allievo ha concluso il percorso con risultati discreti, evidenziando un livello di acquisizione delle competenze sufficiente ma con aree di fragilità che permangono soprattutto nelle situazioni operative più articolate. L’impegno ha mostrato discontinuità nel corso del percorso, limitando la piena padronanza di alcuni contenuti disciplinari. Si ritiene che, con la necessaria perseveranza, l’allievo possa consolidare le competenze acquisite e migliorare il proprio profilo professionale.",
      "Le competenze di base e le capacità professionali sviluppate nel corso del percorso si collocano su un livello discreto. L’allievo ha raggiunto gli obiettivi formativi essenziali, pur con alcune lacune residue che emergono soprattutto in situazioni operative non standardizzate. Il profilo al termine del percorso è accettabile, ma richiede un ulteriore percorso di sviluppo e di pratica per raggiungere pienamente la maturità professionale attesa nel settore di riferimento."],
    SUFFICIENTE:[
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 stata sufficiente. L\u2019allievo ha manifestato un impegno non sempre costante durante il percorso formativo, dimostrando una comprensione essenziale degli argomenti, con alcune lacune che hanno reso necessari interventi di rinforzo e recupero mirati. Ha raggiunto gli obiettivi disciplinari minimi programmati, mostrando una capacit\u00e0 di applicazione delle conoscenze adeguata nelle situazioni pi\u00f9 semplici, ma con margini di miglioramento nelle situazioni che richiedono maggiore autonomia. Si raccomanda di proseguire con un impegno pi\u00f9 sistematico al fine di consolidare le competenze acquisite e sviluppare pienamente le potenzialit\u00e0 individuali.",
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali si \u00e8 conclusa con risultati appena sufficienti. L\u2019allievo ha mostrato nel corso del percorso formativo una partecipazione discontinua e un impegno non sempre adeguato, che hanno limitato la piena acquisizione dei contenuti disciplinari. Sono stati raggiunti gli obiettivi minimi previsti, grazie anche agli interventi di supporto e recupero attuati, ma permangono fragilit\u00e0 nell\u2019applicazione autonoma delle competenze in contesti operativi variabili. Si raccomanda vivamente all\u2019allievo di investire maggiori energie nel consolidamento delle basi teoriche e pratiche, indispensabili per operare in modo efficace nel settore professionale di riferimento.",
      "Il percorso di acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 risultato sufficiente. L\u2019allievo ha affrontato le attivit\u00e0 formative con motivazione altalenante, raggiungendo una preparazione di livello minimo sufficiente a soddisfare i requisiti essenziali del profilo professionale. La comprensione degli argomenti trattati \u00e8 risultata superficiale in alcune aree, richiedendo interventi di recupero specifici. L\u2019applicazione delle conoscenze in contesti operativi pratici si \u00e8 rivelata accettabile nelle situazioni pi\u00f9 guidate, con difficolt\u00e0 evidenti in quelle che richiedono autonomia decisionale. Si esorta l\u2019allievo a rafforzare l\u2019impegno per consolidare le competenze acquisite."
    ,
      "Il percorso formativo si è concluso con un’acquisizione appena sufficiente delle competenze di base e delle capacità professionali. L’allievo ha raggiunto con difficoltà gli obiettivi minimi programmati, nonostante gli interventi di recupero e di sostegno attivati nel corso delle attività. Permangono fragilità diffuse nella padronanza dei contenuti disciplinari e nell’applicazione pratica delle competenze in contesti operativi non guidati. Si raccomanda vivamente di proseguire con un impegno costante nel rafforzamento delle basi professionali.",
      "L’allievo ha concluso il percorso formativo con risultati sufficienti, raggiunti grazie a un impegno progressivamente più attivo nelle fasi finali e agli interventi di supporto predisposti. Le competenze acquisite sono essenziali e la loro applicazione pratica si rivela adeguata solo nelle situazioni più semplici e strutturate. Il livello di preparazione raggiunto soddisfa i requisiti minimi del profilo professionale, ma richiede un costante aggiornamento e approfondimento per poter operare con piena efficacia nel settore.",
      "L’acquisizione delle competenze di base e delle capacità professionali è risultata sufficiente al termine del percorso, con il raggiungimento degli obiettivi minimi grazie a un percorso non privo di difficoltà. L’allievo ha mostrato fragilità nella padronanza di alcune competenze chiave, necessitando di supporto continuo per la corretta esecuzione delle prestazioni operative. La preparazione complessiva è accettabile come punto di partenza per l’inserimento nel mondo del lavoro, a condizione di un impegno significativo nel proseguimento della propria formazione professionale."],
    INSUFFICIENTE:[
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali \u00e8 risultata insufficiente. L\u2019allievo ha manifestato un impegno non adeguato durante il percorso formativo, con presenze discontinue e una partecipazione limitata alle attivit\u00e0 proposte, evidenziando lacune significative nella comprensione degli argomenti trattati. Non ha pienamente raggiunto gli obiettivi disciplinari minimi programmati, mostrando difficolt\u00e0 nell\u2019applicazione delle conoscenze nelle situazioni operative e una limitata autonomia esecutiva. Si ritiene necessario un intervento di recupero strutturato e un maggiore coinvolgimento dell\u2019allievo nelle attivit\u00e0 formative, affinch\u00e9 possa colmare le lacune riscontrate e sviluppare le competenze professionali indispensabili per il settore di riferimento.",
      "L\u2019acquisizione delle competenze di base e delle capacit\u00e0 professionali si \u00e8 rivelata insufficiente. L\u2019allievo ha mostrato nel corso del percorso formativo scarsa regolarit\u00e0 nella partecipazione e un impegno inadeguato rispetto alle richieste del percorso, con il risultato di non aver acquisito in modo completo i contenuti disciplinari fondamentali. Gli obiettivi minimi programmati non sono stati pienamente raggiunti: permangono lacune rilevanti sia nella componente teorica sia in quella pratica, che compromettono la capacit\u00e0 di operare autonomamente nelle situazioni professionali di base. Si raccomanda un percorso di recupero mirato e un sostanziale cambiamento nell\u2019approccio alle attivit\u00e0 formative, indispensabile per acquisire le competenze necessarie.",
      "Il livello di acquisizione delle competenze di base e delle capacit\u00e0 professionali non ha raggiunto la soglia minima richiesta. L\u2019allievo ha affrontato il percorso formativo con discontinuit\u00e0 e scarso coinvolgimento, non riuscendo a sviluppare in modo adeguato le competenze previste dal profilo professionale. Le lacune riscontrate nella comprensione degli argomenti fondamentali e le difficolt\u00e0 operative evidenziate nel corso delle attivit\u00e0 pratiche hanno impedito il raggiungimento degli obiettivi minimi programmati. \u00c8 indispensabile attivare un piano di recupero personalizzato che consenta all\u2019allievo di colmare le carenze rilevate e di acquisire le basi necessarie per operare nel settore professionale di riferimento."
    ,
      "Il percorso formativo si è concluso con un’acquisizione insufficiente delle competenze di base e delle capacità professionali. L’allievo non ha raggiunto gli obiettivi minimi programmati, evidenziando lacune rilevanti in più aree disciplinari e serie difficoltà nell’esecuzione delle prestazioni operative fondamentali. Nonostante gli interventi di recupero attivati, il livello di preparazione raggiunto non soddisfa i requisiti essenziali del profilo professionale di riferimento. Si ritiene indispensabile attivare un piano di formazione individuale mirato prima di qualsiasi inserimento professionale.",
      "L’allievo ha concluso il percorso formativo con risultati insufficienti, non raggiungendo gli obiettivi minimi in diverse aree disciplinari fondamentali. L’impegno dimostrato non è stato adeguato alle richieste del percorso e la partecipazione alle attività è risultata molto discontinua, compromettendo la sistematica acquisizione delle competenze previste. La preparazione raggiunta non consente un inserimento professionale autonomo e richiede un percorso di recupero e di integrazione formativa strutturato e prolungato.",
      "Le competenze di base e le capacità professionali sviluppate nel corso del percorso si collocano al di sotto della soglia minima richiesta. L’allievo ha manifestato difficoltà persistenti sia nella comprensione dei contenuti teorici che nell’esecuzione delle attività pratiche, non riuscendo a raggiungere gli obiettivi formativi minimi nonostante gli interventi di supporto e recupero attuati. Il profilo professionale al termine del percorso richiede un intervento formativo integrativo urgente e strutturato per colmare le lacune riscontrate."]
  };
  const variants=map[votoToValutazione(v)];
  if(!variants)return"";
  return variants[Math.floor(Math.random()*variants.length)];
}

function escXml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

async function buildDocxForStudent(subj,st,gradeEntry){
  const val=gradeEntry.value;
  const valutazione=votoToValutazione(val);
  const alunnoName=fmtName(st.name);
  const docenteName=docFullOf(subj.id)||"";
  const materiaText=subj.label+(subj.ore>0?" — "+subj.ore+"h":"");
  const zip=await JSZip.loadAsync(getTemplateB64(),{base64:true});
  let xml=await zip.file("word/document.xml").async("string");
  const r=(tag,val)=>{xml=xml.split(tag).join(val);};
  r("{{ALUNNO}}",escXml(alunnoName));
  r("{{DOCENTE}}",escXml(docenteName));
  r("{{MATERIA}}",escXml(materiaText));
  r("{{VALUTAZIONE}}",escXml(valutazione));
  r("{{VOTO}}",escXml(String(val)));
  r("{{PROFILOINIZIALE}}",escXml(votoToProfiloText(val)));
  r("{{VALUTAZIONEINTERMEDIA}}",escXml(votoToValIntermedia(val)));
  r("{{VALUTAZIONEFINALE}}",escXml(votoToDescFinale(val)));
  zip.file("word/document.xml",xml);
  return zip.generateAsync({type:"uint8array"});
}

function buildHtmlCard(subj,st,gradeEntry){
  const val=gradeEntry.value;
  const ev=votoToValutazione(val);
  const alunno=fmtName(st.name);
  const docente=docFullOf(subj.id)||"\u2014";
  const materia=subj.label+(subj.ore>0?" \u2014 "+subj.ore+"h":"");
  const descF=votoToDescFinale(val);
  const profilo=votoToProfiloText(val);
  const intermed=votoToValIntermedia(val);

  const gr=(ind,desc)=>`<tr>
<td class="gi">${ind}</td><td class="gd">${desc}</td></tr>
<tr><td colspan="2" class="gj">Giudizio:&nbsp;<strong>${ev}</strong></td></tr>`;
  return`<div class="wrap">
<div class="pg">
<div class="ph"><img src="${IMG_ASSET_0}" alt="ERIS intestazione logos"></div><div class="pb">
<p class="h1c">ASSOCIAZIONE ERIS DI RAGUSA &ndash; IEFP &ndash; ANNO ${ANNO}</p>
<p class="h2c">Corso: ${COURSE_TRACKS.courseLabel} &nbsp;&nbsp; ${CLASSE} &nbsp;&nbsp; ${COURSE_TRACKS.courseCode}</p>
<p class="h3c" style="color:#000">${materia}</p>
<table class="tb"><tr><td style="padding:4px 8px">
<span class="lbl">ALLIEVO:</span>&nbsp;${alunno}&emsp;<span class="lbl">DOCENTE FORMATORE:</span>&nbsp;${docente}
</td></tr></table>
<p class="titolo">SCHEDA DI VALUTAZIONE</p>
<div class="tag">PROFILO INIZIALE</div>
<p class="txt">${profilo}</p>
<div class="tag">VALUTAZIONE INTERMEDIA DEI PROGRESSI CONSEGUITI</div>
<p class="txt">${intermed}</p>
<div class="tag">GRIGLIA DI MISURAZIONE FINALE</div>
<table class="tg">${gr("CONOSCENZE","Conoscenza degli argomenti.")}${gr("COMPETENZE","Uso appropriato della terminologia e degli strumenti della disciplina. Chiarezza di esposizione.")}${gr("CAPACIT\u00c0","Capacit\u00e0 di rielaborazione. Applicazione.")}</table>
</div><div class="pf"><img class="fi" src="${IMG_ASSET_1}" alt="ISO 9001"><div class="ft"><b>ERIS ENTE DEL TERZO SETTORE</b>Sede legale: via Salvatore Paola, 14/a &ndash; 95125 Catania | tel./fax: 095433940 | didattica.ct@erisformazione.it | amministrazione.ct@erisformazione.it<br>Associazione riconosciuta, iscrizione n&deg;&nbsp;293979 C.C.I.A.A. di Catania | CF: 97180200822 | info@pec.erisformazione.it | www.erisformazione.it</div><img class="fi" src="${IMG_ASSET_2}" alt="OHSAS 18001"></div></div>
<div class="pg">
<div class="ph"><img src="${IMG_ASSET_3}" alt="ERIS intestazione logos"></div><div class="pb">
<p class="h1c">ASSOCIAZIONE ERIS DI RAGUSA &ndash; IEFP &ndash; ANNO ${ANNO}</p>
<p class="h2c">Corso: ${COURSE_TRACKS.courseLabel} &nbsp;&nbsp; ${CLASSE} &nbsp;&nbsp; ${COURSE_TRACKS.courseCode}</p>
<table class="tb" style="margin-bottom:5px"><tr><td style="padding:3px 8px;font-size:11pt">
<span class="lbl">ALLIEVO:</span>&nbsp;${alunno}&emsp;<span class="lbl">MATERIA:</span>&nbsp;<span style="color:#000">${materia}</span>
</td></tr></table>
<table class="tg" style="margin-bottom:4px">${gr("CONOSCENZE","Conoscenza specifica dei contenuti richiesti e rispetto della consegna.")}${gr("COMPETENZE","Correttezza e propriet\u00e0 nell\u2019uso della lingua.")}</table>
<p class="sottotit">PROVE PRATICHE &ndash; area tecnico-professionale</p>
<table class="tg" style="margin-bottom:5px">${gr("CONOSCENZE","Conoscenza degli argomenti.")}${gr("COMPETENZE","Uso appropriato della terminologia e degli strumenti della disciplina. Chiarezza di esposizione.")}${gr("CAPACIT\u00c0","Capacit\u00e0 di rielaborazione. Applicazione.")}</table>
<div class="boxlbl">VALUTAZIONE FINALE SULLE COMPETENZE DI BASE E/O CAPACIT\u00c0 PROFESSIONALI RAGGIUNTE</div>
<p class="txt">${descF}</p>
<p class="giudizio"><strong>GIUDIZIO FINALE SINTETICO</strong>: ${ev}&emsp;Voto&nbsp;<span style="font-size:22pt;font-weight:900">${val}</span></p>
<div class="firme"><span><strong>Data</strong>: _______________</span><span><strong>FIRMA</strong>: &nbsp;${docente}&nbsp; ___________________________</span></div>
</div><div class="pf"><img class="fi" src="${IMG_ASSET_4}" alt="ISO 9001"><div class="ft"><b>ERIS ENTE DEL TERZO SETTORE</b>Sede legale: via Salvatore Paola, 14/a &ndash; 95125 Catania | tel./fax: 095433940 | didattica.ct@erisformazione.it | amministrazione.ct@erisformazione.it<br>Associazione riconosciuta, iscrizione n&deg;&nbsp;293979 C.C.I.A.A. di Catania | CF: 97180200822 | info@pec.erisformazione.it | www.erisformazione.it</div><img class="fi" src="${IMG_ASSET_5}" alt="OHSAS 18001"></div></div>
</div>`;
}

function buildPrintHtml(subj,cards){
  const materia=subj.label+(subj.ore>0?" \u2014 "+subj.ore+"h":"");
  return`<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Schede di Valutazione \u2014 ${materia}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:Arial,sans-serif;color:#000;background:#ccc}
@page{size:A4 portrait;margin:0}
@media print{
  html,body{background:white}
  .noprint{display:none!important}
  .pg{page-break-after:always;page-break-inside:avoid}
  .wrap:last-child .pg:last-child{page-break-after:avoid}
}
/* ── Toolbar (screen only) ── */
.bar{background:#1B3F8B;color:white;padding:10px 18px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:100}
.bar h1{font-size:13px;font-weight:700}
.bar p{font-size:10px;opacity:.8;margin-top:2px}
.btnp{background:#059669;color:white;border:none;border-radius:6px;padding:8px 16px;
  font-size:12px;font-weight:700;cursor:pointer}
/* ── A4 page shell ── */
.pg{
  width:210mm; height:297mm;
  background:white;
  display:flex; flex-direction:column;
  overflow:hidden;
  margin:14px auto;
  box-shadow:0 2px 10px rgba(0,0,0,.3);
}
@media print{.pg{margin:0;box-shadow:none}}
/* ── Header bar ── */
.ph{
  flex:0 0 30mm;
  border-bottom:2pt solid #003087;
  padding:3mm 8mm 2mm;
  display:flex; align-items:center;
}
.ph img{width:100%;height:100%;object-fit:contain;object-position:left center}
/* ── Body ── */
.pb{
  flex:1 1 0;
  overflow:hidden;
  padding:4mm 12mm 3mm;
}
/* ── Footer bar ── */
.pf{
  flex:0 0 22mm;
  border-top:2pt solid #003087;
  padding:2mm 8mm;
  display:flex; align-items:center; gap:8px;
}
.fi{height:16mm;width:auto;flex-shrink:0}
.ft{flex:1;text-align:center;font-size:8pt;line-height:1.55;color:#111}
.ft b{display:block;font-size:8pt;margin-bottom:1px}
/* ── Body typographic helpers ── */
.h1c{text-align:center;font-weight:700;font-size:11pt;margin:0 0 2px}
.h2c{text-align:center;font-size:11pt;line-height:1.3;margin:0 0 2px}
.h3c{text-align:center;font-size:11pt;margin:0 0 4px}
.tb{width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:4px}
.lbl{font-size:11pt;font-weight:700}
.titolo{text-align:center;font-size:13pt;font-weight:700;text-decoration:underline;margin:2px 0 4px}
.sottotit{text-align:center;font-weight:700;text-decoration:underline;font-size:11pt;margin:3px 0 3px}
.tag{text-align:center;margin:0 0 2px}
.tag span,.tag{display:inline-block}
.tag{border:1px solid #000;padding:2px 10px;font-weight:700;font-size:11pt;display:block;
  width:fit-content;margin:0 auto 2px}
.txt{font-size:11pt;line-height:1.38;margin:2px 0 4px;text-align:justify}
.tg{width:100%;border-collapse:collapse}
.gi{font-weight:700;width:28%;vertical-align:middle;padding:3px 6px;
  border:1px solid #000;font-size:11pt}
.gd{text-align:center;vertical-align:middle;padding:3px 6px;
  border:1px solid #000;font-size:11pt}
.gj{padding:3px 6px;border:1px solid #000;font-size:11pt}
.boxlbl{border:1px solid #000;padding:3px 8px;margin-bottom:3px;
  font-size:11pt;font-weight:700}
.giudizio{font-size:11pt;margin:4px 0 3px}
.firme{display:flex;justify-content:space-between;margin-top:10px;font-size:11pt}
</style>
</head>
<body>
<div class="bar noprint">
  <div><h1>&#128196; Schede di Valutazione &mdash; ${materia}</h1>
  <p>${cards.length} schede &middot; Classe ${CLASSE} &middot; A.S. ${ANNO}</p></div>
  <button class="btnp" onclick="window.print()">&#128438;&nbsp;Stampa / Salva PDF</button>
</div>
${cards.join('\n')}
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),900));<\/script>
</body>
</html>`;
}

// ── Riepilogo voti per materia (tabella riassuntiva con giudizi) ──────────────
function buildRiepilogoHtml(subj,gradedStudents){
  const materia=subj.label+(subj.ore>0?" \u2014 "+subj.ore+"h":"");
  const docente=docFullOf(subj.id)||"\u2014";
  const gjColor=v=>{const n=parseFloat(String(v).replace(",","."));
    if(isNaN(n))return"#64748B";if(n>=9)return"#059669";if(n>=7)return"#D97706";if(n>=6)return"#CA8A04";return"#DC2626";};
  const gjBg=v=>{const n=parseFloat(String(v).replace(",","."));
    if(isNaN(n))return"#F8FAFC";if(n>=9)return"#ECFDF5";if(n>=7)return"#FFFBEB";if(n>=6)return"#FEFCE8";return"#FEF2F2";};

  let tableRows="";
  gradedStudents.forEach((st,idx)=>{
    const i=STUDENTS.indexOf(st);
    const entry=App.grades[subj.id]?.[i];
    const val=entry?entry.value:"\u2014";
    const gj=entry?votoToValutazione(val):"\u2014";
    const bg=idx%2===0?"#FFFFFF":"#F8FAFC";
    const cTxt=gjColor(val);const cBg=gjBg(val);
    tableRows+=`<tr style="background:${bg}">
<td class="rc">${st.num}</td>
<td class="rn">${fmtName(st.name)}</td>
<td class="rv" style="color:${cTxt};font-weight:700">${val}</td>
<td class="rg" style="background:${cBg};color:${cTxt}">${gj}</td>
</tr>\n`;
  });

  return`<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Riepilogo Voti \u2014 ${materia}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:Arial,sans-serif;color:#000;background:#ccc}
@page{size:A4 portrait;margin:0}
@media print{
  html,body{background:white}
  .noprint{display:none!important}
  .pg{page-break-after:always;page-break-inside:avoid}
  .pg:last-child{page-break-after:avoid}
}
.bar{background:#1B3F8B;color:white;padding:10px 18px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:100}
.bar h1{font-size:13px;font-weight:700}
.bar p{font-size:10px;opacity:.8;margin-top:2px}
.btnp{background:#059669;color:white;border:none;border-radius:6px;padding:8px 16px;
  font-size:12px;font-weight:700;cursor:pointer}
.pg{
  width:210mm;min-height:297mm;
  background:white;
  display:flex;flex-direction:column;
  overflow:hidden;
  margin:14px auto;
  box-shadow:0 2px 10px rgba(0,0,0,.3);
}
@media print{.pg{margin:0;box-shadow:none;min-height:297mm}}
.ph{
  flex:0 0 30mm;
  border-bottom:2pt solid #003087;
  padding:3mm 8mm 2mm;
  display:flex;align-items:center;
}
.ph img{width:100%;height:100%;object-fit:contain;object-position:left center}
.pb{
  flex:1 1 0;
  overflow:hidden;
  padding:4mm 12mm 3mm;
}
.pf{
  flex:0 0 22mm;
  border-top:2pt solid #003087;
  padding:2mm 8mm;
  display:flex;align-items:center;gap:8px;
}
.fi{height:16mm;width:auto;flex-shrink:0}
.ft{flex:1;text-align:center;font-size:8pt;line-height:1.55;color:#111}
.ft b{display:block;font-size:8pt;margin-bottom:1px}
.h1c{text-align:center;font-weight:700;font-size:11pt;margin:0 0 2px}
.h2c{text-align:center;font-size:11pt;line-height:1.3;margin:0 0 2px}
.h3c{text-align:center;font-size:11pt;margin:0 0 4px}
.tb{width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:4px}
.lbl{font-size:11pt;font-weight:700}
.titolo{text-align:center;font-size:13pt;font-weight:700;text-decoration:underline;margin:4px 0 8px}
/* ── Tabella riepilogo ── */
.rt{width:100%;border-collapse:collapse;margin-top:6px}
.rt th{background:#1B3F8B;color:white;font-size:10pt;font-weight:700;padding:6px 8px;
  border:1px solid #94A3B8;text-align:center}
.rt th.thl{text-align:left}
.rc{text-align:center;padding:5px 6px;border:1px solid #CBD5E1;font-size:10pt;width:8%;font-weight:600;color:#475569}
.rn{padding:5px 8px;border:1px solid #CBD5E1;font-size:10pt;font-weight:600}
.rv{text-align:center;padding:5px 6px;border:1px solid #CBD5E1;font-size:12pt;width:10%}
.rg{text-align:center;padding:5px 8px;border:1px solid #CBD5E1;font-size:10pt;font-weight:600;width:18%;
  text-transform:uppercase;letter-spacing:.3px}
.firme{display:flex;justify-content:space-between;margin-top:14px;font-size:11pt}
.stats{margin-top:10px;font-size:10pt;color:#475569;text-align:right}
</style>
</head>
<body>
<div class="bar noprint">
  <div><h1>&#128202; Riepilogo Voti &mdash; ${materia}</h1>
  <p>${gradedStudents.length} alunni valutati &middot; Classe ${CLASSE} &middot; A.S. ${ANNO}</p></div>
  <button class="btnp" onclick="window.print()">&#128438;&nbsp;Stampa / Salva PDF</button>
</div>
<div class="pg">
<div class="ph"><img src="${IMG_ASSET_0}" alt="ERIS intestazione logos"></div>
<div class="pb">
<p class="h1c">ASSOCIAZIONE ERIS DI RAGUSA &ndash; IEFP &ndash; ANNO ${ANNO}</p>
<p class="h2c">Corso: ${COURSE_TRACKS.courseLabel} &nbsp;&nbsp; ${CLASSE} &nbsp;&nbsp; ${COURSE_TRACKS.courseCode}</p>
<p class="h3c" style="color:#000">${materia}</p>
<table class="tb"><tr><td style="padding:4px 8px">
<span class="lbl">DOCENTE FORMATORE:</span>&nbsp;${docente}
</td></tr></table>
<p class="titolo">RIEPILOGO VOTI E GIUDIZI</p>
<table class="rt">
<thead><tr><th>N.</th><th class="thl">Cognome e Nome</th><th>Voto</th><th>Giudizio</th></tr></thead>
<tbody>
${tableRows}</tbody>
</table>
<div class="firme"><span><strong>Data</strong>: _______________</span><span><strong>FIRMA</strong>: &nbsp;${docente}&nbsp; ___________________________</span></div>
</div>
<div class="pf"><img class="fi" src="${IMG_ASSET_1}" alt="ISO 9001"><div class="ft"><b>ERIS ENTE DEL TERZO SETTORE</b>Sede legale: via Salvatore Paola, 14/a &ndash; 95125 Catania | tel./fax: 095433940 | didattica.ct@erisformazione.it | amministrazione.ct@erisformazione.it<br>Associazione riconosciuta, iscrizione n&deg;&nbsp;293979 C.C.I.A.A. di Catania | CF: 97180200822 | info@pec.erisformazione.it | www.erisformazione.it</div><img class="fi" src="${IMG_ASSET_2}" alt="OHSAS 18001"></div>
</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),900));<\/script>
</body>
</html>`;
}

async function exportSchedeZip(sid){
  if(typeof JSZip==="undefined"){toast("❌ Libreria JSZip non caricata. Controlla la connessione.","err");return;}
  const subj=SUBJECTS.find(s=>s.id===sid);
  if(!subj){toast("❌ Materia non trovata","err");return;}
  const graded=studentsForSubject(sid).filter(st=>!!App.grades[sid]?.[STUDENTS.indexOf(st)]);
  if(!graded.length){toast("⚠️ Nessun voto inserito per "+subj.short,"err");return;}
  toast("⏳ Generazione schede in corso...","info");
  try{
    const outerZip=new JSZip();
    const htmlCards=[];
    for(const st of graded){
      const i=STUDENTS.indexOf(st);
      const entry=App.grades[sid][i];
      const bytes=await buildDocxForStudent(subj,st,entry);
      const safeName=st.name.replace(/[^A-Za-z0-9\s]/g,"").replace(/\s+/g,"_");
      outerZip.file("Scheda_"+safeName+"_"+subj.short+".docx",bytes);
      htmlCards.push(buildHtmlCard(subj,st,entry));
    }
    outerZip.file("Stampa_Schede.html",buildPrintHtml(subj,htmlCards));
    outerZip.file("Riepilogo_Voti_"+subj.short+".html",buildRiepilogoHtml(subj,graded));
    const blob=await outerZip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}});
    downloadBlob(blob,"Schede_"+subj.short+"_"+CLASSE+"_"+ANNO.replace("/","-")+".zip");
    toast("✅ "+graded.length+" schede + riepilogo esportati!","ok");
  }catch(e){console.error(e);toast("❌ Errore: "+e.message,"err");}
}

// ═══════════════════════════════════════════════
//  PAGELLA SCOLASTICA
// ═══════════════════════════════════════════════

// Template PAGELLA base64 — lazy access
function getPagellaB64(){
  if(typeof DOCX_PAGELLA_B64==="undefined"||!DOCX_PAGELLA_B64)
    throw new Error("Template Pagella non trovato. Assicurati che assets.js sia caricato correttamente.");
  return DOCX_PAGELLA_B64;
}

// Giudizio sintetico dalla media ponderata (scala 0-10)
function mpToGiudizioSintetico(mp){
  if(mp===null||mp===undefined)return"NON CLASSIFICABILE";
  if(mp>=9)return"OTTIMO";
  if(mp>=8)return"DISTINTO";
  if(mp>=7)return"BUONO";
  if(mp>=6)return"SUFFICIENTE";
  return"INSUFFICIENTE";
}

// Genera un singolo DOCX pagella per un alunno
async function buildDocxPagella(st,idx){
  // ── Calcoli ────────────────────────────────────────────────────────────────
  // Materie dello studente (solo quelle pertinenti al suo corso, esclusa condotta)
  const subjCols=SUBJECTS.filter(s=>!s.conductaOnly&&studentHasSubject(idx,s.id));
  const mp=calcMP(idx,subjCols);
  const mpx10=mp!==null?Math.round(mp*10):null;
  const giudizio=mpToGiudizioSintetico(mp);

  // Voto condotta
  const condEntry=App.grades["condotta"]?.[idx];
  const votoCond=condEntry?condEntry.value:"—";

  // Riga "CLASSE: X  ANNO SCOLASTICO: 2025/2026"
  const classeAnno="CLASSE: "+CLASSE+"     ANNO SCOLASTICO: "+ANNO;

  // Corso dell'alunno
  const cs=App.corsiStudenti[idx]||"";
  const courseLabel=COURSE_TRACKS.courseLabel||"";

  // ── Costruzione righe tabella materie ───────────────────────────────────
  // Ogni riga: MODULO (label), ORE, VOTO
  // Template originale ha righe fisse — le sostituiamo con {{RIGHE_MATERIE}}
  // che sarà un blocco XML di righe della tabella.
  // Usiamo il medesimo schema del template per replicare l'impaginazione:
  // la 4a colonna usa vMerge (già precompilata nel template).
  // Generiamo solo le righe MODULO|ORE|VOTO che sostituiranno il placeholder.

  const righeXml=subjCols.map((s,ri)=>{
    const e=App.grades[s.id]?.[idx];
    const voto=e?e.value:"—";
    const isFirst=ri===0;
    const nomeModulo=escXml(s.label.replace(/^[A-Za-z0-9]+[Eeb]* - /,"").toUpperCase());
    const oreStr=s.ore>0?String(s.ore):"—";
    // 4a colonna: solo la prima riga ha contenuto (vMerge restart), le altre vMerge vuoto
    const col4=isFirst?`
        <w:tc>
          <w:tcPr><w:tcW w:w="1550" w:type="pct"/><w:vMerge w:val="restart"/>
            <w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>
          </w:tcPr>
          <w:p><w:pPr><w:spacing w:line="360" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr></w:p>
          <w:p><w:pPr><w:spacing w:line="360" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>SI ATTESTA</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="360" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>CHE</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="480" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">L&#x2019;allievo </w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="480" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>{{ALUNNO}}</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="480" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">&#xe8; stato </w:t></w:r><w:r><w:rPr><w:b/><w:u w:val="single"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>AMMESSO</w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> alla </w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="480" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">{{ANNUALITA}} con il seguente giudizio finale:</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="480" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>{{VALUTAZIONE MEDIA PONDERATA}}</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>Condotta:</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>{{VOTO CONDOTTA}}</w:t></w:r></w:p>
          <w:p><w:pPr><w:spacing w:line="480" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr></w:p>
        </w:tc>`:`
        <w:tc>
          <w:tcPr><w:tcW w:w="1550" w:type="pct"/><w:vMerge/>
            <w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="nil"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>
            <w:vAlign w:val="center"/><w:hideMark/>
          </w:tcPr>
          <w:p><w:pPr></w:pPr></w:p>
        </w:tc>`;

    return`
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="2813" w:type="pct"/><w:vAlign w:val="center"/>
            <w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>
          </w:tcPr>
          <w:p><w:pPr><w:rPr><w:sz w:val="16"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr></w:pPr>
            <w:r><w:rPr><w:sz w:val="16"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>${nomeModulo}</w:t></w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="265" w:type="pct"/><w:vAlign w:val="center"/>
            <w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="22"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>${escXml(oreStr)}</w:t></w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="372" w:type="pct"/><w:vAlign w:val="center"/>
            <w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tcBorders>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:sz w:val="16"/><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr><w:t>${escXml(voto)}</w:t></w:r>
          </w:p>
        </w:tc>${col4}
      </w:tr>`;
  }).join("");

  // ── Annualità dinamica dal numero classe ────────────────────────────────
  const annoN=parseInt(String(CLASSE).replace(/\D/g,""))||1;
  const annoLabel=annoN===1?"II annualit\u00e0":annoN===2?"III annualit\u00e0":annoN===3?"IV annualit\u00e0":"V annualit\u00e0";

  // ── Carica e processa template pagella ─────────────────────────────────
  const zip=await JSZip.loadAsync(getPagellaB64(),{base64:true});
  let xml=await zip.file("word/document.xml").async("string");
  const r=(tag,val)=>{xml=xml.split(tag).join(val);};

  // Sostituisce i tag nel template originale
  r("{{ALUNNO}}",escXml(fmtName(st.name)));
  r("{{VALUTAZIONE MEDIA PONDERATA}}",escXml(giudizio));
  r("{{VOTO CONDOTTA}}",escXml(votoCond));
  r("{{MEDIA PONDERATA X 10}}",mpx10!==null?escXml(String(mpx10)):"—");
  r("{{ANNUALITA}}",escXml(annoLabel));

  // Sostituisce la riga "id" e "2024/2025" nel campo CLASSE / ANNO SCOLASTICO
  xml=xml.replace(/CLASSE: id(\s*)ANNO SCOLASTICO: [0-9/]+/,"CLASSE: "+escXml(CLASSE)+"$1ANNO SCOLASTICO: "+escXml(ANNO));
  // Sostituisce la courseLabel fissa nel template con quella corrente
  xml=xml.replace(/OPERATORE DEL BENESSERE - EROGAZIONE DI TRATTAMENTI DI ACCONCIATURA\/OPERATORE DEL BENESSERE - EROGAZIONE DEI SERVIZI DI TRATTAMENTO ESTETICO/gi,
    escXml(courseLabel.toUpperCase()));
  // Aggiorna la data alla data odierna
  xml=xml.replace(/Ragusa, \d{2}\/\d{2}\/\d{4}/,"Ragusa, "+new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric"}));

  // Sostituisce le righe della tabella materie
  xml=xml.replace(/(<w:tblGrid>[\s\S]*?<\/w:tblGrid>)([\s\S]*)(<w:bookmarkEnd)/,
    (match,tblGrid,body,bookmark)=>{
      const firstRowEnd=body.indexOf("</w:tr>");
      const headerRow=body.slice(0,firstRowEnd+7);
      return tblGrid+headerRow+righeXml+bookmark;
    });

  zip.file("word/document.xml",xml);

  // ── Copia intestazione e piè di pagina dal template schede ───────────────
  // Usa rId6=header, rId7=footer (non conflitto con i rId1-rId5 del template pagella)
  const HDR_RID="rId6", FTR_RID="rId7";
  try{
    const schedaZip=await JSZip.loadAsync(getTemplateB64(),{base64:true});
    // header1.xml + footer1.xml
    const hdrXml=await schedaZip.file("word/header1.xml").async("string");
    const ftrXml=await schedaZip.file("word/footer1.xml").async("string");
    zip.file("word/header1.xml",hdrXml);
    zip.file("word/footer1.xml",ftrXml);
    // .rels di header e footer
    const hdrRels=await schedaZip.file("word/_rels/header1.xml.rels").async("string");
    const ftrRels=await schedaZip.file("word/_rels/footer1.xml.rels").async("string");
    zip.file("word/_rels/header1.xml.rels",hdrRels);
    zip.file("word/_rels/footer1.xml.rels",ftrRels);
    // immagini usate da header/footer (logo, ISO, OHSAS)
    for(const img of["media/image1.png","media/image2.jpeg","media/image3.jpeg"]){
      const f=schedaZip.file("word/"+img);
      if(f){const bytes=await f.async("uint8array");zip.file("word/"+img,bytes);}
    }
    // document.xml.rels: aggiunge header e footer
    let docRels=await zip.file("word/_rels/document.xml.rels").async("string");
    const relHdr=`<Relationship Id="${HDR_RID}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>`;
    const relFtr=`<Relationship Id="${FTR_RID}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>`;
    docRels=docRels.replace("</Relationships>",relHdr+relFtr+"</Relationships>");
    zip.file("word/_rels/document.xml.rels",docRels);
    // [Content_Types].xml: aggiunge voci png/jpeg/header/footer se mancanti
    let ct=await zip.file("[Content_Types].xml").async("string");
    if(!ct.includes('Extension="png"'))  ct=ct.replace(/(<Types[^>]*>)/,"$1<Default Extension=\"png\" ContentType=\"image/png\"/>");
    if(!ct.includes('Extension="jpeg"')) ct=ct.replace(/(<Types[^>]*>)/,"$1<Default Extension=\"jpeg\" ContentType=\"image/jpeg\"/>");
    if(!ct.includes("header1.xml"))  ct=ct.replace("</Types>",`<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/></Types>`);
    if(!ct.includes("footer1.xml"))  ct=ct.replace("</Types>",`<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`);
    zip.file("[Content_Types].xml",ct);
    // sectPr in document.xml: aggiunge headerReference/footerReference e allinea margini alle schede
    let docXml=await zip.file("word/document.xml").async("string");
    docXml=docXml.replace(/(<w:sectPr[^>]*>)([\s\S]*?)(<\/w:sectPr>)/,
      (m,open,body,close)=>{
        const cleaned=body
          .replace(/<w:headerReference[^/]*\/>/g,"")
          .replace(/<w:footerReference[^/]*\/>/g,"")
          .replace(/<w:pgMar[^/]*\/>/,'<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="426" w:footer="0" w:gutter="0"/>');
        return open+
          `<w:headerReference w:type="default" r:id="${HDR_RID}"/>`+
          `<w:footerReference w:type="default" r:id="${FTR_RID}"/>`+
          cleaned+close;
      });
    zip.file("word/document.xml",docXml);
  }catch(hfErr){console.warn("Header/footer pagella non aggiunto:",hfErr);}

  return zip.generateAsync({type:"uint8array"});
}

// HTML preview pagella — struttura .ph/.pb/.pf identica a buildHtmlCard
function buildHtmlPagella(st,idx){
  const subjCols=SUBJECTS.filter(s=>!s.conductaOnly&&studentHasSubject(idx,s.id));
  const mp=calcMP(idx,subjCols);
  const mpx10=mp!==null?Math.round(mp*10):null;
  const giudizio=mpToGiudizioSintetico(mp);
  const condEntry=App.grades["condotta"]?.[idx];
  const votoCond=condEntry?condEntry.value:"—";
  const alunno=fmtName(st.name);
  const annoN=parseInt(String(CLASSE).replace(/\D/g,""))||1;
  const annoLabel=annoN===1?"II Annualità":annoN===2?"III Annualità":annoN===3?"IV Annualità":"V Annualità";
  const giudizioColor=v=>{
    if(v==="OTTIMO")return"#059669";if(v==="DISTINTO")return"#0369A1";
    if(v==="BUONO")return"#D97706";if(v==="SUFFICIENTE")return"#CA8A04";return"#DC2626";
  };
  const mpColor=mpx10===null?"#94A3B8":mpx10>=60?"#059669":mpx10>=50?"#D97706":"#DC2626";
  const today=new Date().toLocaleDateString("it-IT");

  const righeHtml=subjCols.map(s=>{
    const e=App.grades[s.id]?.[idx];
    const voto=e?e.value:"—";
    const nomeModulo=s.label; // nome completo senza abbreviazioni
    const docente=docNameOf(s.id)||"—";
    const vn=String(voto).trim().toUpperCase();
    const vNum=vn==="NC"?2:parseFloat(vn.replace(",","."));
    const vColor=isNaN(vNum)?"#475569":vNum<6?"#DC2626":vNum<7?"#CA8A04":vNum<9?"#D97706":"#059669";
    const vBg=isNaN(vNum)?"#EFF6FF":vNum<6?"#FEF2F2":vNum<7?"#FEFCE8":vNum<9?"#FFFBEB":"#ECFDF5";
    return`<tr>
      <td style="padding:1.5px 5px;font-size:7.5pt;border:0.5pt solid #CBD5E1;vertical-align:middle">${nomeModulo}</td>
      <td style="padding:1.5px 3px;font-size:6.5pt;border:0.5pt solid #CBD5E1;vertical-align:middle;color:#475569">${docente}</td>
      <td style="padding:1.5px 3px;font-size:7.5pt;border:0.5pt solid #CBD5E1;text-align:center;color:#475569;vertical-align:middle;white-space:nowrap">${s.ore>0?s.ore:"—"}</td>
      <td style="padding:1.5px 3px;font-size:9pt;font-weight:800;border:0.5pt solid #CBD5E1;text-align:center;color:${vColor};background:${vBg};vertical-align:middle;white-space:nowrap">${voto}</td>
    </tr>`;
  }).join("");

  return`<div class="wrap">
<div class="pg">
<div class="ph"><img src="${IMG_ASSET_0}" alt="ERIS intestazione logos"></div>
<div class="pb" style="display:flex;flex-direction:column">
  <p class="h1c">ASSOCIAZIONE ERIS DI RAGUSA &ndash; IEFP &ndash; ANNO ${ANNO}</p>
  <p class="h2c">Corso: ${COURSE_TRACKS.courseLabel} &nbsp;&nbsp; ${CLASSE} &nbsp;&nbsp; ${COURSE_TRACKS.courseCode}</p>
  <p class="titolo">PAGELLA SCOLASTICA</p>
  <table class="tb" style="margin-bottom:4px"><tr><td style="padding:3px 8px">
    <span class="lbl">ALLIEVO:</span>&nbsp;${alunno}
  </td></tr></table>
  <div style="display:flex;gap:8px;align-items:flex-start;flex:1;min-height:0">
    <table style="width:60%;border-collapse:collapse;font-family:Arial,sans-serif">
      <tr style="background:#0F2557;color:white">
        <th style="padding:3px 5px;font-size:7.5pt;text-align:left;border:0.5pt solid #0F2040">MODULO DI FORMAZIONE</th>
        <th style="padding:3px 4px;font-size:7.5pt;text-align:left;border:0.5pt solid #0F2040">DOCENTE</th>
        <th style="padding:3px 4px;font-size:7.5pt;text-align:center;border:0.5pt solid #0F2040;width:30px">ORE</th>
        <th style="padding:3px 4px;font-size:7.5pt;text-align:center;border:0.5pt solid #0F2040;width:36px">VOTO</th>
      </tr>
      ${righeHtml}
    </table>
    <div style="flex:1;border:1pt solid #CBD5E1;padding:10px 12px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#FAFAFA;align-self:stretch">
      <div style="font-size:10pt;font-weight:800;letter-spacing:1px">SI ATTESTA CHE</div>
      <div style="font-size:9pt">L&apos;allievo</div>
      <div style="font-size:11pt;font-weight:900;color:#0F2557">${alunno}</div>
      <div style="font-size:9pt">è stato <strong><u>AMMESSO</u></strong> alla</div>
      <div style="font-size:10pt;font-weight:800">${annoLabel}</div>
      <div style="font-size:8pt">con il seguente giudizio finale:</div>
      <div style="font-size:18pt;font-weight:900;color:${giudizioColor(giudizio)};margin:4px 0">${giudizio}</div>
      <div style="font-size:8pt;color:#64748B;margin-top:4px">Voto di condotta:</div>
      <div style="font-size:18pt;font-weight:900;color:${gradeColor(votoCond)}">${votoCond}</div>
      <hr style="width:80%;border:none;border-top:1px solid #CBD5E1;margin:4px 0">
      <div style="font-size:8pt;color:#64748B">Votazione finale:</div>
      <div style="font-size:20pt;font-weight:900;color:${mpColor}">${mpx10!==null?mpx10+" / 100":"—"}</div>
    </div>
  </div>
  <div class="firme" style="margin-top:8px">
    <span><strong>Ragusa,</strong> ${today}</span>
    <span><strong>La Segreteria</strong>: ___________________________</span>
  </div>
</div>
<div class="pf"><img class="fi" src="${IMG_ASSET_1}" alt="ISO 9001"><div class="ft"><b>ERIS ENTE DEL TERZO SETTORE</b>Sede legale: via Salvatore Paola, 14/a &ndash; 95125 Catania | tel./fax: 095433940 | didattica.ct@erisformazione.it | amministrazione.ct@erisformazione.it<br>Associazione riconosciuta, iscrizione n&deg;&nbsp;293979 C.C.I.A.A. di Catania | CF: 97180200822 | info@pec.erisformazione.it | www.erisformazione.it</div><img class="fi" src="${IMG_ASSET_2}" alt="OHSAS 18001"></div>
</div>
</div>`;
}

// HTML di stampa per tutte le pagelle — CSS identico a buildPrintHtml
function buildPrintHtmlPagelle(cards){
  return`<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Pagelle Scolastiche &mdash; Classe ${CLASSE} &mdash; A.S. ${ANNO}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:Arial,sans-serif;color:#000;background:#ccc}
@page{size:A4 portrait;margin:0}
@media print{
  html,body{background:white}
  .noprint{display:none!important}
  .pg{page-break-after:always;page-break-inside:avoid}
  .wrap:last-child .pg:last-child{page-break-after:avoid}
}
/* ── Toolbar (screen only) ── */
.bar{background:#1B3F8B;color:white;padding:10px 18px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:100}
.bar h1{font-size:13px;font-weight:700}
.bar p{font-size:10px;opacity:.8;margin-top:2px}
.btnp{background:#059669;color:white;border:none;border-radius:6px;padding:8px 16px;
  font-size:12px;font-weight:700;cursor:pointer}
/* ── A4 page shell ── */
.pg{
  width:210mm; height:297mm;
  background:white;
  display:flex; flex-direction:column;
  overflow:hidden;
  margin:14px auto;
  box-shadow:0 2px 10px rgba(0,0,0,.3);
}
@media print{.pg{margin:0;box-shadow:none}}
/* ── Header bar ── */
.ph{
  flex:0 0 30mm;
  border-bottom:2pt solid #003087;
  padding:3mm 8mm 2mm;
  display:flex; align-items:center;
}
.ph img{width:100%;height:100%;object-fit:contain;object-position:left center}
/* ── Body ── */
.pb{
  flex:1 1 0;
  min-height:0;
  padding:3mm 12mm 2mm;
  display:flex;
  flex-direction:column;
}
/* ── Footer bar ── */
.pf{
  flex:0 0 22mm;
  border-top:2pt solid #003087;
  padding:2mm 8mm;
  display:flex; align-items:center; gap:8px;
}
.fi{height:16mm;width:auto;flex-shrink:0}
.ft{flex:1;text-align:center;font-size:8pt;line-height:1.55;color:#111}
.ft b{display:block;font-size:8pt;margin-bottom:1px}
/* ── Body typographic helpers ── */
.h1c{text-align:center;font-weight:700;font-size:11pt;margin:0 0 2px}
.h2c{text-align:center;font-size:11pt;line-height:1.3;margin:0 0 2px}
.tb{width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:4px}
.lbl{font-size:11pt;font-weight:700}
.titolo{text-align:center;font-size:13pt;font-weight:700;text-decoration:underline;margin:2px 0 4px}
.tg{width:100%;border-collapse:collapse}
.gi{font-weight:700;width:28%;vertical-align:middle;padding:3px 6px;
  border:1px solid #000;font-size:11pt}
.gj{padding:3px 6px;border:1px solid #000;font-size:11pt}
.giudizio{font-size:11pt;margin:4px 0 3px}
.firme{display:flex;justify-content:space-between;margin-top:10px;font-size:11pt}
</style>
</head>
<body>
<div class="bar noprint">
  <div><h1>&#128196; Pagelle Scolastiche &mdash; Classe ${CLASSE}</h1>
  <p>${cards.length} pagelle &middot; A.S. ${ANNO}</p></div>
  <button class="btnp" onclick="window.print()">&#128438;&nbsp;Stampa / Salva PDF</button>
</div>
${cards.join("\n")}
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),900));<\/script>
</body>
</html>`;
}

// Funzione principale — esporta pagelle per tutti gli alunni attivi in uno ZIP
async function exportPagelleZip(){
  if(typeof JSZip==="undefined"){toast("❌ Libreria JSZip non caricata.","err");return;}
  const attivi=activeStudents(); // solo alunni non dimessi/trasferiti
  if(!attivi.length){toast("⚠️ Nessun alunno attivo","err");return;}
  toast("⏳ Generazione pagelle in corso...","info");
  try{
    const outerZip=new JSZip();
    const htmlCards=[];
    for(const st of attivi){
      const i=STUDENTS.indexOf(st);
      const bytes=await buildDocxPagella(st,i);
      const safeName=st.name.replace(/[^A-Za-z0-9\s]/g,"").replace(/\s+/g,"_");
      outerZip.file("Pagella_"+safeName+".docx",bytes);
      htmlCards.push(buildHtmlPagella(st,i));
    }
    outerZip.file("Stampa_Pagelle.html",buildPrintHtmlPagelle(htmlCards));
    const blob=await outerZip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}});
    downloadBlob(blob,"Pagelle_"+CLASSE+"_"+ANNO.replace("/","-")+".zip");
    toast("✅ "+attivi.length+" pagelle esportate!","ok");
  }catch(e){console.error(e);toast("❌ Errore pagelle: "+e.message,"err");}
}
