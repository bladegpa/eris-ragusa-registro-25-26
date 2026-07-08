═══════════════════════════════════════════════════════════════════════
  REGISTRO ELETTRONICO ERIS — GUIDA ALLA MANUTENZIONE DEI DATI
  Ing. Giampiero AZZARELLI — A.S. 2025/2026
═══════════════════════════════════════════════════════════════════════

  Questo documento spiega come modificare alunni e docenti direttamente
  sui file .js senza dover coinvolgere Claude o altri strumenti.

  REGOLA FONDAMENTALE
  ───────────────────
  Ogni classe ha il proprio file dati:
    • Classe 1E → data.js
    • Classe 1D → data_1d.js
    • Classe 1G → data_1g.js
    • Classe 2C → data_2c.js
    • Classe 2D → data_2d.js
    • Classe 3F → data_3f.js

  Modifica SEMPRE il file della classe interessata.
  NON toccare: assets.js, logic.js, ui.js, export.js, class_select.js,
               app.js, index.html, styles.css


═══════════════════════════════════════════════════════════════════════
  SEZIONE 1 — AGGIUNGERE UN NUOVO ALUNNO
═══════════════════════════════════════════════════════════════════════

  1. Apri il file della classe (es. data_1d.js) con un editor di testo
     (Notepad, Notepad++, VS Code, ecc.)

  2. Trova l'array STUDENTS_NomeClasse (es. STUDENTS_1D = [ ... ])

  3. Aggiungi una riga rispettando il formato:
       {num: 31, name: "COGNOME NOME"},

     ⚠️  REGOLE IMPORTANTI:
     • Il campo "num" è solo il numero d'ordine visualizzato a schermo.
       NON influisce sulla posizione reale nell'array né sui voti in Firebase.
     • Il campo che conta davvero per i voti è la POSIZIONE nell'array
       (indice 0, 1, 2... dal primo all'ultimo elemento).
     • Il nome va scritto tutto in MAIUSCOLO (convenzione ERIS).
     • Lascia la virgola dopo ogni riga tranne l'ultima prima della ].

  ESEMPIO — Aggiungere ROSSI MARIO alla classe 1D in fondo:

    Prima:
      {num:29, name:"INVERNINO SAMUEL"},
      {num:30, name:"KORRESHI ANHEL"},
    ];

    Dopo:
      {num:29, name:"INVERNINO SAMUEL"},
      {num:30, name:"KORRESHI ANHEL"},
      {num:31, name:"ROSSI MARIO"},
    ];

  4. Salva il file e ricarica l'app nel browser (F5).
     Il nuovo alunno appare subito nell'elenco.

  5. Per segnare l'alunno come DIMESSO o TRASFERITO:
     Accedi come Admin → sezione Alunni → usa i tasti appositi.
     Lo stato dimesso/trasferito NON si scrive nel file .js,
     viene salvato automaticamente su Firebase.


═══════════════════════════════════════════════════════════════════════
  SEZIONE 2 — INSERIRE UN ALUNNO IN MEZZO ALL'ELENCO (con rinumerazione)
═══════════════════════════════════════════════════════════════════════

  ⚠️  ATTENZIONE — OPERAZIONE CRITICA
  Inserire un alunno a metà lista sposta gli indici di tutti quelli
  successivi. I voti su Firebase sono salvati per indice, non per nome.
  Se la classe ha già voti inseriti, segui questa procedura completa:

  PROCEDURA SICURA:

  PASSO 1 — Prima dell'inserimento, esporta il registro Excel completo
            (Admin → Esporta Excel) per avere una copia di backup.

  PASSO 2 — Apri il file .js e inserisci il nuovo alunno nella posizione
            voluta. Rinumera i "num" di tutti i successivi (+1 per ognuno).

  PASSO 3 — Dopo aver salvato e ricaricato l'app, vai su Firebase Console
            (https://console.firebase.google.com) → il tuo progetto →
            Realtime Database.

  PASSO 4 — Nel database trovi i nodi:
              1D/grades/{materiaId}/{indice}: voto
            Gli indici sono 0-based (primo alunno = 0, secondo = 1, ecc.)
            Sposta manualmente i voti degli alunni spostati al nuovo indice.

  PASSO 5 — Fai lo stesso per i nodi:
              1D/dimessi/{indice}
              1D/trasferiti/{indice}
              1D/trasferiti_date/{indice}
              1D/corsiStudenti/{indice}

  NOTA: Se la classe è NUOVA e non ha ancora voti, puoi fare l'inserimento
        liberamente senza doverti preoccupare di Firebase.


═══════════════════════════════════════════════════════════════════════
  SEZIONE 3 — INVERTIRE L'ORDINE DI DUE ALUNNI (con migrazione voti)
═══════════════════════════════════════════════════════════════════════

  Invertire due studenti che hanno già voti richiede di spostare i loro
  dati su Firebase. Procedura:

  ESEMPIO: Scambiare ROSSI (indice 20) con BIANCHI (indice 21)

  PASSO 1 — Nel file .js: scambia fisicamente le due righe nell'array.
            Aggiorna i loro campi "num" di conseguenza.

  PASSO 2 — Su Firebase Console, per ogni materia che ha voti,
            fai lo scambio manuale dei due valori:

    a) Leggi il valore a 1D/grades/m01/20  (es. "7")
    b) Leggi il valore a 1D/grades/m01/21  (es. "8")
    c) Scrivi "8" in 1D/grades/m01/20
    d) Scrivi "7" in 1D/grades/m01/21
    e) Ripeti per m02, m03... per ogni materia con voto.

  Stesso swap anche per condotta, corsiStudenti, dimessi, trasferiti.

  ALTERNATIVA RAPIDA: se i due alunni non hanno ancora voti inseriti,
  basta scambiare le righe nel file .js e il gioco è fatto.


═══════════════════════════════════════════════════════════════════════
  SEZIONE 4 — AGGIUNGERE UN NUOVO DOCENTE
═══════════════════════════════════════════════════════════════════════

  Ogni file classe ha due dizionari per i docenti:
    • TN_NomeClasse  — nome breve (es. "Rossi M.")
    • TE_NomeClasse  — nome completo maiuscolo (es. "ROSSI MARIO")

  E l'array SUBJECTS_NomeClasse dove ogni materia ha il campo "doc"
  che punta alla chiave del docente.

  PASSO 1 — Scegli una chiave identificativa per il docente
            (convenzione: cognome in minuscolo, es. "rossi")

  PASSO 2 — Aggiungi la chiave a TN_NomeClasse:
              rossi: "Rossi M.",

  PASSO 3 — Aggiungi la chiave a TE_NomeClasse:
              rossi: "ROSSI MARIO",

  PASSO 4 — Nelle materie interessate, imposta doc:"rossi"
              {id:"m05", label:"M05 - Geometria", ..., doc:"rossi", ...},

  PASSO 5 — Salva e ricarica. Il docente appare nell'elenco accessi
            e il suo PIN di default è 1234 (cambiabile dall'Admin).

  ESEMPIO COMPLETO:
  
    /* Prima */
    const TN_1D = {
      ciacera: "Ciacera Macauda G.",
      ...
    };
    const TE_1D = {
      ciacera: "CIACERA MACAUDA GIUSY",
      ...
    };
    {id:"m16", label:"M16 - Accoglienza Cliente II", ..., doc:"",    ...},

    /* Dopo — aggiunto docente "verdi" */
    const TN_1D = {
      ciacera: "Ciacera Macauda G.",
      verdi:   "Verdi A.",             ← aggiunto
      ...
    };
    const TE_1D = {
      ciacera: "CIACERA MACAUDA GIUSY",
      verdi:   "VERDI ANTONELLA",      ← aggiunto
      ...
    };
    {id:"m16", label:"M16 - Accoglienza Cliente II", ..., doc:"verdi", ...},


═══════════════════════════════════════════════════════════════════════
  SEZIONE 5 — CAMBIARE IL DOCENTE DI UNA MATERIA
═══════════════════════════════════════════════════════════════════════

  Trova la materia nell'array SUBJECTS e cambia solo il campo doc:"...".

  ESEMPIO — M08 Storia II da "pizzo" a "ciacera":

    Prima:  {id:"m08", label:"M08 - Storia II", ..., doc:"pizzo",   ...},
    Dopo:   {id:"m08", label:"M08 - Storia II", ..., doc:"ciacera", ...},

  Se il docente non esiste ancora in TN/TE, aggiungilo prima (vedi Sez.4).
  Se il campo doc rimane "", la materia risulta "senza docente assegnato"
  e sarà accessibile solo da Admin, Tutor e Segreteria.


═══════════════════════════════════════════════════════════════════════
  SEZIONE 6 — MODIFICARE ORE O NOME DI UNA MATERIA
═══════════════════════════════════════════════════════════════════════

  Ogni materia nell'array SUBJECTS ha questi campi:
    id:     identificatore interno — NON cambiarlo mai (rompe i voti)
    label:  nome completo visualizzato (es. "M01 - Italiano")
    short:  nome breve per Excel (es. "M01")
    ore:    ore totali del modulo (usate per la media ponderata)
    doc:    chiave docente (vedi Sezione 4)
    emoji:  icona decorativa (facoltativa)
    color:  colore esadecimale badge (facoltativo)

  ⚠️  NON modificare mai il campo "id" di una materia esistente.
      Tutti i voti su Firebase sono indicizzati per id materia.
      Cambiare l'id equivale a perdere tutti i voti di quella materia.

  Puoi modificare liberamente: label, short, ore, doc, emoji, color.


═══════════════════════════════════════════════════════════════════════
  SEZIONE 7 — AGGIUNGERE UNA NUOVA CLASSE
═══════════════════════════════════════════════════════════════════════

  1. Crea un nuovo file, es. data_2e.js, copiando la struttura di un
     file esistente e adattando: CLASSE, STUDENTS, SUBJECTS, TN, TE,
     TUTOR_NAME, COURSE_TRACKS, DEFAULT_CORSO_MATERIA.

  2. Includi il file in index.html:
       <script src="data_2e.js"></script>

  3. In class_select.js aggiungi:
     a) La funzione getClassConfig2E() sul modello delle altre
     b) Un elemento nell'array classes[] in renderClassSelect()

  4. Il prefisso Firebase per la nuova classe sarà es. "2E/"
     (impostato nel campo fbPrefix di getClassConfig2E).
     Tutti i dati restano separati automaticamente.


═══════════════════════════════════════════════════════════════════════
  NOTE SULLO STATO DIMESSO / TRASFERITO
═══════════════════════════════════════════════════════════════════════

  Lo stato "dimesso" e "trasferito" di un alunno NON si scrive nei file
  .js — viene gestito da Firebase in tempo reale.

  Per attivarlo:
    • Accedi come Admin nell'app
    • Vai su Alunni
    • Clicca sul nome dell'alunno → usa i pulsanti Dimetti / Trasferisci

  Gli alunni dimessi/trasferiti sono visibili con indicatore visivo
  ma esclusi dai calcoli di media e dalle esportazioni principali.

  ⚠️  CASO SPECIALE — 1D: MANGIONE, MICIELI, OBOROCEANU
  Questi tre alunni (num 11-13) sono stati aggiunti al file data_1d.js
  con nota "// TRASFERITO". Alla prima apertura del registro 1D come
  Admin, vai su Alunni e segnali manualmente come "Trasferiti".


═══════════════════════════════════════════════════════════════════════
  SCHEMA INDICI FIREBASE — CLASSE 1D (stato attuale)
═══════════════════════════════════════════════════════════════════════

  Prefisso Firebase: "1D/"
  I voti sono in: 1D/grades/{materiaId}/{indice}

  Indice │ Alunno
  ───────┼──────────────────────────────────
    0    │ CERAMI LUANA
    1    │ CILIA SCALONE SALVATORE
    2    │ CRISCIONE ALESSANDRO
    3    │ DI MARTINO GIOVANNI
    4    │ DRARENI ABOUBAKR
    5    │ HAMOUDA ADEM
    6    │ KOVACI LEONEL
    7    │ LA ROCCA ANGELO
    8    │ LEONARDI GIOVANNI
    9    │ LUCIFORA GIOVANNI
   10    │ MANGIONE GIUSEPPE       ← nuovo / trasferito
   11    │ MICIELI MONIA           ← nuovo / trasferita
   12    │ OBOROCEANU ANGELO GABRIELE ← nuovo / trasferito
   13    │ RESTIVO PINA
   14    │ RRUSHI MUHAMED
   15    │ SIERAKOWSKI DORIAN
   16    │ SIGONA GIORGIO
   17    │ SOLARINO BENEDETTO FRANCESCO
   18    │ SOLARINO GIACOS
   19    │ VIRZI FILIPPO
   20    │ YAZIDI AHMED RAYEN
   21    │ ROSELLA ALESSANDRO
   22    │ GAGLIANO GIUSEPPE
   23    │ D'IZZIA CHRISTIAN       ← invertito con ISMAILI
   24    │ ISMAILI ALBIN           ← invertito con D'IZZIA
   25    │ RADSI NOUR
   26    │ BEZHDILI FLAVIO
   27    │ HAMMOUDA RADHOUANE
   28    │ INVERNINO SAMUEL
   29    │ KORRESHI ANHEL

  ⚠️  Se D'IZZIA e ISMAILI avevano voti inseriti prima di questo
      aggiornamento (quando erano rispettivamente agli indici 21 e 20),
      quei voti su Firebase vanno spostati manualmente:
        - I voti al vecchio indice 20 (ISMAILI) → spostali all'indice 24
        - I voti al vecchio indice 21 (D'IZZIA) → spostali all'indice 23
      Usa Firebase Console → Realtime Database → nodo 1D/grades.


═══════════════════════════════════════════════════════════════════════
  FILE DA MODIFICARE — RIEPILOGO RAPIDO
═══════════════════════════════════════════════════════════════════════

  Operazione                          │ File da modificare
  ────────────────────────────────────┼──────────────────────────
  Aggiungere/rinominare alunno        │ data_NomeClasse.js
  Aggiungere/cambiare docente         │ data_NomeClasse.js
  Cambiare ore di una materia         │ data_NomeClasse.js
  Cambiare nome visualizzato materia  │ data_NomeClasse.js
  Segnare alunno dimesso/trasferito   │ Admin UI (Firebase auto)
  Aggiungere nuova classe             │ data_NuovaClasse.js
                                      │ + class_select.js
                                      │ + index.html
  Modificare PIN Admin/Tutor/Seg.     │ data.js (righe ADMIN_PIN ecc.)
  Cambiare anno scolastico            │ data.js (riga var ANNO=...)

═══════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════
  AGGIORNAMENTO — DATE DI AMMISSIONE PREDEFINITE + SCHEDE TUTTE LE CLASSI
═══════════════════════════════════════════════════════════════════════

  DATE DI AMMISSIONE PREDEFINITE (per classe)
  ───────────────────────────────────────────
  Ogni file classe può definire una costante AMMISSIONI_<CLASSE> con le
  date di ammissione predefinite, indicizzate per POSIZIONE 0-based:

      const AMMISSIONI_1G = { 29: "30-03-2026" };  // 30° alunno

  Queste date vengono scritte UNA SOLA VOLTA su Firebase al primo avvio
  della classe (seed idempotente, marcatore "ammissioni/_seeded").
  L'Admin può poi modificarle da "Alunni": la modifica manuale prevale e
  non viene mai sovrascritta dal seed.
  • Classe 1G: aggiunto BKHAIRIA AHMED (num 30) con ammissione 30/03/2026.

  SCHEDE DI VALUTAZIONE — TUTTE LE CLASSI (Admin)
  ───────────────────────────────────────────────
  Pannello Admin → Materie → "📚 Schede Valutazione — Tutte le Classi".
  Genera un unico .zip con, per OGNI classe e OGNI modulo:
    • Stampa_Schede_<M>.html   → schede pronte per la stampa (tutte)
    • Riepilogo_<M>.html       → tabella voti/giudizi del modulo
    • DOCX_<M>_<Classe>.zip    → un file .docx per ogni alunno valutato
  I moduli d'indirizzo (corso ≠ "Comune") possono essere trattati come
  "pratici" (modalità automatica) oppure tutti come "teorici".

  CORREZIONE
  ──────────
  Il "BACKUP GENERALE" Excel ora include anche la classe 3F (prima
  mancante): esporta tutte e 6 le classi.

═══════════════════════════════════════════════════════════════════════
  AGGIORNAMENTO — SCHEDA "PROFESSORI" PER CLASSE + BARRA DI AVANZAMENTO
═══════════════════════════════════════════════════════════════════════

  SCHEDA PROFESSORI (Pannello Admin → tab "👨‍🏫 Prof")
  ───────────────────────────────────────────────────
  Per la CLASSE attualmente aperta, elenca tutti i docenti con i moduli
  che insegnano e il numero di schede disponibili. Per ciascun docente:
    • "⬇️ Schede" → scarica un .zip con TUTTE le sue schede (tutti i moduli
      con voti). Struttura: una cartella per modulo contenente i .docx
      (uno per alunno), l'HTML stampabile e il riepilogo voti.
    • "📦 Scarica TUTTI i professori" → un unico .zip con una cartella per
      ogni docente.
  Ogni file riporta sempre il riferimento a PROFESSORE · CLASSE · MODULO
  (es. Scheda_Savasta_G_1G_M27_ROSSI_MARIO.docx).
  I moduli d'indirizzo (corso ≠ "Comune") sono trattati come pratici.

  BARRA DI AVANZAMENTO
  ────────────────────
  Tutte le generazioni lunghe (schede per materia, per docente, per tutti
  i docenti, schede di tutte le classi e pagelle) mostrano ora una barra
  di avanzamento con percentuale e dettaglio (classe/modulo/alunno).

═══════════════════════════════════════════════════════════════════════
  AGGIORNAMENTO — PAGELLE NEL TAB PROF (TUTOR) + ESITO AMMESSO/NON AMMESSO
═══════════════════════════════════════════════════════════════════════

  PAGELLE NEL TAB "👨‍🏫 Prof" (Admin e Tutor)
  ────────────────────────────────────────────
  Nel tab Prof, oltre alle schede docente, sono disponibili per Admin e
  Tutor due pulsanti: "🧾 Pagelle Finali" (DOCX + HTML stampabile) e
  "📄 Pagellino Intermedio" (HTML stampabile). La Segreteria vede solo la
  sezione schede docente.

  ESITO FINALE: AMMESSO / NON AMMESSO (Admin e Tutor)
  ───────────────────────────────────────────────────
  Nel tab "👥 Alunni", sotto ogni alunno attivo, un pulsante permette di
  commutare tra ✅ AMMESSO e ⛔ NON AMMESSO (solo Admin e Tutor; la
  Segreteria non lo vede). Lo stato è salvato su Firebase (nodo "esiti",
  separato per classe) e si riflette automaticamente nella PAGELLA FINALE:
    • AMMESSO      → «è stato AMMESSO alla …»
    • NON AMMESSO  → «non è stato AMMESSO alla …»
  Se non impostato, l'alunno è considerato AMMESSO (comportamento invariato
  rispetto a prima). In alto è mostrato il riepilogo Ammessi / Non ammessi.

  TAB PROF PER SEGRETERIA
  ───────────────────────
  Il tab "👨‍🏫 Prof" (download schede) è disponibile per Admin, Tutor e
  Segreteria.

═══════════════════════════════════════════════════════════════════════
  AGGIORNAMENTO — GRIGLIA FINALE (solo Classe 3F)
═══════════════════════════════════════════════════════════════════════

  Nel pannello Admin, quando la classe attiva è la 3F, compare il tab
  "🎓 Finale" con una tabella dedicata per ogni alunno attivo:

    • Media 1° Anno   — inserita dall'Admin, scala 0-10, 1 decimale.
    • Media 2° Anno   — inserita dall'Admin, scala 0-10, 1 decimale.
    • Media 3° Anno   — CALCOLATA IN AUTOMATICO: media aritmetica di tutti
      i voti dei moduli 3F già inseriti quest'anno (condotta esclusa).
    • Media Voto Triennale (in centesimi) = media aritmetica di
      (1°+2°+3° anno) moltiplicata ×10. Vuota finché non sono presenti
      tutti e tre i termini.
    • Prova Multidisciplinare — inserita dall'Admin, scala 0-100.
    • Voto Finale (in centesimi) = Media Triennale×80% + Prova×20%.

  Solo l'ADMIN può inserire/modificare i valori (Media 1°/2° anno e Prova
  Multidisciplinare); Tutor e Segreteria vedono la griglia in sola lettura.
  I valori sono validati (0-10 per le medie annuali, 0-100 per la prova) e
  salvati su Firebase nel nodo "finale" (isolato per classe, come tutti gli
  altri dati). La Griglia Finale è visibile e utilizzabile SOLO per la 3F.
