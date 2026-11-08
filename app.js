/* =========================================================
   UnSecret — feasibility studio
   Logica dell'analisi: dati, calcolo, form e risultati.
   ========================================================= */

"use strict";

/* ---------- Dati di mercato (stime indicative) ---------- */

const PRODUCTS = {
  tshirt:     { label: "T-shirt",     hint: "Basic o grafica",       labor: 6.5,  fabric: 4.5,  moq: 50 },
  camicia:    { label: "Camicia",     hint: "Classica o oversize",   labor: 13,   fabric: 8,    moq: 50 },
  felpa:      { label: "Felpa",       hint: "Hoodie o crewneck",     labor: 12,   fabric: 9,    moq: 50 },
  pantalone:  { label: "Pantalone",   hint: "Chino, jeans, sartoriale", labor: 16, fabric: 10,  moq: 50 },
  abito:      { label: "Abito",       hint: "Daywear o sera",        labor: 20,   fabric: 13,   moq: 40 },
  giacca:     { label: "Giacca",      hint: "Blazer o outerwear",    labor: 32,   fabric: 18,   moq: 40 },
  maglieria:  { label: "Maglieria",   hint: "Knitwear e jersey",     labor: 18,   fabric: 12,   moq: 40 },
  intimo:     { label: "Intimo",      hint: "Basic o lingerie",      labor: 6,    fabric: 3,    moq: 100 },
  accessorio: { label: "Accessorio",  hint: "Borsa, cappello, ecc.", labor: 3.5,  fabric: 2.5,  moq: 100 }
};

const MATERIALS = {
  cotone:  { label: "Cotone",  hint: "Il più versatile",    factor: 1 },
  lino:    { label: "Lino",    hint: "Naturale, stagionale", factor: 1.2 },
  lana:    { label: "Lana",    hint: "Caldo, premium",       factor: 1.5 },
  seta:    { label: "Seta",    hint: "Delicato, luxury",     factor: 1.9 },
  jersey:  { label: "Jersey",  hint: "Elastico, comodo",     factor: 0.85 },
  denim:   { label: "Denim",   hint: "Robusto, iconico",     factor: 1.1 },
  tecnico: { label: "Tecnico", hint: "Performance",          factor: 1.4 },
  pelle:   { label: "Pelle",   hint: "Concia e finitura",    factor: 1.8 },
  misto:   { label: "Misto",   hint: "Fibre blend",          factor: 1.05 }
};

const COMPLEXITIES = {
  semplice:  { label: "Semplice",  factor: 0.8,  setup: 0.85, risk: 10 },
  media:     { label: "Media",     factor: 1,    setup: 1,    risk: 7 },
  complessa: { label: "Complessa", factor: 1.35, setup: 1.25, risk: 4 }
};

const STAGES = [
  { value: "idea",       label: "Ho solo un'idea",          dev: 900, readiness: 0.2,  weeks: [4, 6] },
  { value: "disegno",    label: "Ho un disegno tecnico",    dev: 650, readiness: 0.4,  weeks: [3, 4] },
  { value: "prototipo",  label: "Ho un prototipo",          dev: 400, readiness: 0.65, weeks: [2, 3] },
  { value: "campione",   label: "Ho un campione approvato", dev: 200, readiness: 0.85, weeks: [1, 2] },
  { value: "produzione", label: "Produzione già avviata",   dev: 0,   readiness: 1,    weeks: [0, 1] }
];

const AUDIENCES = {
  donna: "Donna",
  uomo: "Uomo",
  unisex: "Unisex",
  bambino: "Bambino"
};

const LOCATION_LIST = [
  {
    key: "italia",
    label: "Italia",
    sub: "Made in Italy, piccoli lotti",
    labor: 1,
    material: 1,
    trims: 1,
    packaging: 1,
    logistics: 1.1,
    duty: 0,
    moqFactor: 1,
    lead: [3, 5],
    logisticsWeeks: [0, 1],
    quality: "Alta e tracciabile"
  },
  {
    key: "extra",
    label: "Extra Europa",
    sub: "Turchia, Marocco, Est Europa",
    labor: 0.55,
    material: 0.95,
    trims: 0.9,
    packaging: 0.8,
    logistics: 1.8,
    duty: 0.04,
    moqFactor: 3,
    lead: [6, 9],
    logisticsWeeks: [1, 2],
    quality: "Buona, da verificare"
  },
  {
    key: "asia",
    label: "Asia",
    sub: "Cina, India, Vietnam",
    labor: 0.32,
    material: 0.85,
    trims: 0.7,
    packaging: 0.65,
    logistics: 3.1,
    duty: 0.12,
    moqFactor: 8,
    lead: [10, 16],
    logisticsWeeks: [4, 6],
    quality: "Variabile, serve QC"
  }
];

/* ---------- Traduzioni (it, en, fr, zh, es) ---------- */

const LANGUAGES = {
  it: { label: "Italiano", code: "it-IT", currency: "€" },
  en: { label: "English", code: "en-IE", currency: "€" },
  fr: { label: "Français", code: "fr-FR", currency: "€" },
  zh: { label: "中文（简体）", code: "zh-CN", currency: "€" },
  es: { label: "Español", code: "es-ES", currency: "€" }
};

const DEFAULT_LANG = "it";
let currentLang = DEFAULT_LANG;

const T = {
  it: {
    brand: { tag: "feasibility studio" },
    header: { meta: "Stima indicativa · Italia / Extra Europa / Asia" },
    lang: { label: "Scegli la lingua", it: "Italiano", en: "English", fr: "Français", zh: "中文（简体）", es: "Español" },
    intro: {
      eyebrow: "Analisi di fattibilità per il tuo capo",
      title1: "Il tuo capo",
      title2: "si può fare?",
      lede: "Rispondi a poche domande sulla tua idea: ricevi una stima di costi, fattibilità e tempi per produrla in Italia, in extra Europa o in Asia.",
      cta: "Inizia l'analisi",
      note: "Nessun preventivo richiesto",
      fact1: "passaggi",
      fact2: "per completarla",
      fact3: "per iniziare"
    },
    wizard: {
      side: { eyebrow: "La tua analisi", note: "Le stime si basano su range di mercato indicativi. Servono a capire se l'idea sta in piedi, non a sostituire un preventivo." }
    },
    step1: { kicker: "01 — La tua idea", heading: "Che cosa vuoi realizzare?", desc: "Partiamo dal capo. Queste informazioni cambiano molto il costo di produzione.", title: "La tua idea", sub: "Prodotto e destinatario" },
    step2: { kicker: "02 — Materiali", heading: "Il materiale incide molto sul costo.", desc: "Scegli il tessuto principale e il livello di lavorazione del modello.", title: "Materiali", sub: "Tessuto e complessità" },
    step3: { kicker: "03 — Numeri", heading: "Quantità, budget e prezzo.", desc: "Anche numeri approssimativi vanno bene: servono a capire la scala del progetto.", title: "Numeri", sub: "Quantità, budget, prezzo" },
    field: {
      product: { legend: "Tipo di prodotto" },
      audience: { legend: "Per chi" },
      stage: { label: "A che punto sei", placeholder: "Scegli una fase", idea: "Ho solo un'idea", disegno: "Ho un disegno tecnico", prototipo: "Ho un prototipo", campione: "Ho un campione approvato", produzione: "Produzione già avviata" },
      description: { label: "Descrivi l'idea", optional: "facoltativo", placeholder: "Es. una camicia oversize in lino, con tasche applicate e bottoni in corozo…" },
      material: { legend: "Tipo di materiale" },
      recycled: { title: "Usi elementi riciclati?", hint: "Tessuti rigenerati, deadstock o certificati GRS." },
      complexity: { legend: "Complessità del modello" },
      quantity: { label: "Pezzi da produrre", unit: "pezzi", rangeAria: "Pezzi da produrre", rangeMin: "1", rangeMax: "5.000+" },
      budget: { label: "Budget disponibile" },
      retail: { label: "Prezzo di vendita al pubblico", placeholder: "IVA inclusa", noRetail: "Non ho ancora deciso il prezzo" }
    },
    product: {
      tshirt: { title: "T-shirt", hint: "Basic o grafica" },
      camicia: { title: "Camicia", hint: "Classica o oversize" },
      felpa: { title: "Felpa", hint: "Hoodie o crewneck" },
      pantalone: { title: "Pantalone", hint: "Chino, jeans, sartoriale" },
      abito: { title: "Abito", hint: "Daywear o sera" },
      giacca: { title: "Giacca", hint: "Blazer o outerwear" },
      maglieria: { title: "Maglieria", hint: "Knitwear e jersey" },
      intimo: { title: "Intimo", hint: "Basic o lingerie" },
      accessorio: { title: "Accessorio", hint: "Borsa, cappello, ecc." }
    },
    audience: { donna: "Donna", uomo: "Uomo", unisex: "Unisex", bambino: "Bambino" },
    material: {
      cotone: { title: "Cotone", hint: "Il più versatile" },
      lino: { title: "Lino", hint: "Naturale, stagionale" },
      lana: { title: "Lana", hint: "Caldo, premium" },
      seta: { title: "Seta", hint: "Delicato, luxury" },
      jersey: { title: "Jersey", hint: "Elastico, comodo" },
      denim: { title: "Denim", hint: "Robusto, iconico" },
      tecnico: { title: "Tecnico", hint: "Performance" },
      pelle: { title: "Pelle", hint: "Concia e finitura" },
      misto: { title: "Misto", hint: "Fibre blend" }
    },
    complexity: {
      semplice: { title: "Semplice", hint: "Pochi pezzi, linee pulite, finiture basiche." },
      media: { title: "Media", hint: "Volumi, tasche, dettagli e finiture curate." },
      complessa: { title: "Complessa", hint: "Molti pezzi, fodere, strutture, lavorazioni speciali." }
    },
    currency: { symbol: "€" },
    form: { note: "Le stime si basano su range di mercato indicativi e non sostituiscono un preventivo. I prezzi reali dipendono dal fornitore, dal tessuto scelto e dal momento." },
    nav: { back: "← Indietro", continue: "Continua", calculate: "Calcola la stima", calculating: "Calcolo in corso…", stepCounter: "Passo {step} di 3" },
    validate: { product: "Scegli un tipo di prodotto.", audience: "Indica per chi è il capo.", stage: "Seleziona a che punto sei.", material: "Scegli il materiale principale.", complexity: "Scegli la complessità del modello.", quantity: "Inserisci una quantità maggiore di zero.", budget: "Inserisci un budget maggiore di zero.", retail: "Inserisci un prezzo o seleziona “Non ho ancora deciso il prezzo”." },
    locations: { italia: { label: "Italia", sub: "Made in Italy, piccoli lotti", quality: "Alta e tracciabile" }, extra: { label: "Extra Europa", sub: "Turchia, Marocco, Est Europa", quality: "Buona, da verificare" }, asia: { label: "Asia", sub: "Cina, India, Vietnam", quality: "Variabile, serve QC" } },
    results: {
      eyebrow: "La tua analisi",
      heading: "Ecco cosa abbiamo stimato.",
      edit: "Modifica risposte",
      print: "Stampa / PDF",
      where: { title: "Dove produrlo", desc: "Tre scenari a confronto. Seleziona una destinazione per vedere il dettaglio dei costi." },
      disclaimer: "<strong>Le stime si basano su range di mercato indicativi</strong> e non sostituiscono un preventivo. I prezzi reali dipendono dal fornitore, dal tessuto scelto e dal momento.",
      restart: "Ricomincia",
      editBottom: "Modifica le risposte"
    },
    footer: { brand: "UnSecret — studio di fattibilità per l'abbigliamento", made: "Made with care · Italia" },
    email: {
      label: "Indirizzo email",
      placeholder: "nome@esempio.com",
      modal: {
        title: "Indirizzo email",
        desc: "Per stampare o salvare il PDF dell'analisi, inserisci un indirizzo email valido. Non verrà pubblicato né condiviso."
      },
      invalid: "Inserisci un indirizzo email valido.",
      confirm: "Conferma e stampa",
      cancel: "Annulla"
    },
    noscript: "Questa analisi ha bisogno di JavaScript per funzionare. Attivalo nel browser e ricarica la pagina.",
    summary: { capo: "Capo", per: "Per", materiale: "Materiale", riciclato: "riciclato", complessita: "Complessità", quantita: "Quantità", pezzi: "pezzi", budget: "Budget", fase: "Fase" },
    verdict: {
      label: "Fattibilità stimata",
      goodTitle: "Sì, il tuo capo si può fare.",
      goodText: "I numeri stanno in piedi: budget e margine reggono per {quantity} pezzi in {location}. Il prossimo passo è mettere a fuoco fornitore e campionatura.",
      midTitle: "Si può fare, con qualche aggiustamento.",
      midText: "L'idea è realizzabile, ma c'è almeno un numero da sistemare: budget, quantità minima o margine. In {location} la stima è di {unit} per pezzo.",
      lowTitle: "Meglio rivedere qualche numero.",
      lowText: "Con i numeri indicati il progetto è fragile. Prima di partire, rivedi budget, prezzo di vendita o quantità minima: la produzione in {location} non è ancora sostenibile.",
      gap: "Ti mancano circa {amount} per coprire produzione e sviluppo.",
      stats: { destination: "Destinazione", unitCost: "Costo per pezzo", unitSmall: "stima indicativa", times: "Tempi stimati", timesSmall: "sviluppo + produzione", recommended: "scenario consigliato" }
    },
    loc: { badge: "Consigliata", perPezzo: "/ pezzo", totale: "Totale progetto", minimo: "Minimo", produzione: "Produzione", qualita: "Qualità", warn: "Sotto il minimo: servono almeno {moq} pezzi." },
    breakdown: {
      kicker: "Dettaglio costi",
      tag: "{quantity} pezzi",
      rows: [
        { label: "Tessuto e materiali" },
        { label: "Manodopera e confezione" },
        { label: "Finiture e accessori" },
        { label: "Packaging" },
        { label: "Logistica e dazi" }
      ],
      costoPezzo: "Costo per pezzo",
      produzione: "Produzione",
      investimento: "Investimento stimato",
      sviluppo: "produzione + sviluppo"
    },
    economics: {
      kicker: "Economia del capo",
      heading: "Prezzo e margine",
      tag: "IVA incl.",
      target: "Target 55%",
      prezzoConsigliato: "Prezzo consigliato",
      prezzoSmall: "Stima a 4,2× il costo per pezzo · IVA inclusa",
      margineTuo: "Margine lordo al tuo prezzo ({retail})",
      margineStimato: "Margine lordo stimato",
      margineNoteTuo: "Target indicativo: 55%.",
      margineNoteStimato: "Al prezzo consigliato. Target indicativo: 55%.",
      investimento: "Investimento iniziale",
      sviluppo: "di cui {setup} di sviluppo",
      breakEven: "Break-even",
      rientrare: "per rientrare dell'investimento",
      nonCopre: "il prezzo non copre il costo",
      budget: "Budget",
      disponibili: "disponibili",
      mancano: "mancano",
      ricavoNetto: "Ricavo netto / pezzo",
      iva: "dopo IVA 22%"
    },
    timeline: {
      kicker: "Percorso",
      heading: "Tempi di realizzazione",
      totale: "Tempo stimato totale",
      settimaneSing: "settimana",
      settimanePlur: "settimane",
      weeksShort: "sett.",
      rangeTotal: "Da {min} a {max} {unit}",
      produzioneDesc: "Confezione del lotto da {quantity} pezzi.",
      phases: [
        { name: "Sviluppo e cartamodello", desc: "Disegno tecnico, cartamodello e piazzamento." },
        { name: "Campionatura", desc: "Primo campione, prove e correzioni." },
        { name: "Produzione", desc: null },
        { name: "Logistica", desc: "Trasporto, sdoganamento e consegna." }
      ]
    },
    notes: {
      kicker: "Da tenere d'occhio",
      heading: "Cosa considerare",
      tag: "note",
      budgetIntegrare: "Budget da integrare.",
      budgetIntegrareRest: "Con {budget} disponibili mancano circa {gap} per coprire produzione e sviluppo in {location}.",
      budgetCoperto: "Budget coperto.",
      budgetCopertoRest: "La stima rientra nel budget con circa {gap} di margine.",
      moq: "Minimo d'ordine.",
      moqRest: "{location} richiede almeno {moq} pezzi: con {quantity} serve una deroga o un fornitore più flessibile.",
      marginLow: "Margine sotto target.",
      marginLowRest: "Al prezzo di {retail} il margine lordo è del {margin}: sotto il 45% il modello è fragile.",
      marginSolid: "Margine solido.",
      marginSolidRest: "Al prezzo di {retail} il margine lordo è del {margin}, in linea con un buon direct-to-consumer.",
      campionatura: "Prima la campionatura.",
      campionaturaRest: "Completa disegno tecnico e prototipo prima di contattare i fornitori: riduce errori e costi.",
      recycled: "Materiali riciclati.",
      recycledRest: "Chiedi la certificazione GRS e considera tempi di approvvigionamento più lunghi.",
      complesso: "Modello complesso.",
      complessoRest: "Metti in conto almeno due giri di campioni e correzioni prima della produzione.",
      asia: "Produzione in Asia.",
      asiaRest: "Prevedi controlli qualità in loco e un margine per dazi, trasporto e resi.",
      italia: "Produzione in Italia.",
      italiaRest: "Il vantaggio è la flessibilità sui piccoli lotti: puoi testare il prodotto senza grandi giacenze.",
      prezzoDaDefinire: "Prezzo da definire.",
      prezzoDaDefinireRest: "Il prezzo consigliato è una stima a 4,2× il costo per pezzo: verificalo con il posizionamento del brand."
    }
  },
  en: {
    brand: { tag: "feasibility studio" },
    header: { meta: "Indicative estimate · Italy / Extra Europe / Asia" },
    lang: { label: "Choose language", it: "Italiano", en: "English", fr: "Français", zh: "中文（简体）", es: "Español" },
    intro: {
      eyebrow: "Feasibility analysis for your garment",
      title1: "Your garment",
      title2: "can it be made?",
      lede: "Answer a few questions about your idea: get cost, feasibility and timeline estimates for production in Italy, extra Europe or Asia.",
      cta: "Start analysis",
      note: "No quote required",
      fact1: "steps",
      fact2: "to complete",
      fact3: "to get started"
    },
    wizard: {
      side: { eyebrow: "Your analysis", note: "Estimates are based on indicative market ranges. They help you understand if the idea holds up, not to replace a quote." }
    },
    step1: { kicker: "01 — Your idea", heading: "What would you like to make?", desc: "We start with the garment. This information strongly affects production cost.", title: "Your idea", sub: "Product and recipient" },
    step2: { kicker: "02 — Materials", heading: "Material has a big impact on cost.", desc: "Choose the main fabric and the model's processing level.", title: "Materials", sub: "Fabric and complexity" },
    step3: { kicker: "03 — Numbers", heading: "Quantity, budget and price.", desc: "Approximate numbers are fine: they help understand the project scale.", title: "Numbers", sub: "Quantity, budget, price" },
    field: {
      product: { legend: "Product type" },
      audience: { legend: "For whom" },
      stage: { label: "What stage are you at", placeholder: "Choose a stage", idea: "I only have an idea", disegno: "I have a technical drawing", prototipo: "I have a prototype", campione: "I have an approved sample", produzione: "Production already started" },
      description: { label: "Describe the idea", optional: "optional", placeholder: "E.g. an oversize linen shirt, with patch pockets and corozo buttons…" },
      material: { legend: "Material type" },
      recycled: { title: "Do you use recycled elements?", hint: "Regenerated fabrics, deadstock or GRS certified." },
      complexity: { legend: "Model complexity" },
      quantity: { label: "Pieces to produce", unit: "pieces", rangeAria: "Pieces to produce", rangeMin: "1", rangeMax: "5,000+" },
      budget: { label: "Available budget" },
      retail: { label: "Public sale price", placeholder: "VAT included", noRetail: "I haven't decided the price yet" }
    },
    product: {
      tshirt: { title: "T-shirt", hint: "Basic or graphic" },
      camicia: { title: "Shirt", hint: "Classic or oversize" },
      felpa: { title: "Sweatshirt", hint: "Hoodie or crewneck" },
      pantalone: { title: "Trousers", hint: "Chino, jeans, tailored" },
      abito: { title: "Dress", hint: "Daywear or evening" },
      giacca: { title: "Jacket", hint: "Blazer or outerwear" },
      maglieria: { title: "Knitwear", hint: "Knitwear and jersey" },
      intimo: { title: "Underwear", hint: "Basic or lingerie" },
      accessorio: { title: "Accessory", hint: "Bag, hat, etc." }
    },
    audience: { donna: "Woman", uomo: "Man", unisex: "Unisex", bambino: "Child" },
    material: {
      cotone: { title: "Cotton", hint: "Most versatile" },
      lino: { title: "Linen", hint: "Natural, seasonal" },
      lana: { title: "Wool", hint: "Warm, premium" },
      seta: { title: "Silk", hint: "Delicate, luxury" },
      jersey: { title: "Jersey", hint: "Stretchy, comfortable" },
      denim: { title: "Denim", hint: "Sturdy, iconic" },
      tecnico: { title: "Technical", hint: "Performance" },
      pelle: { title: "Leather", hint: "Tanning and finishing" },
      misto: { title: "Blend", hint: "Fiber blend" }
    },
    complexity: {
      semplice: { title: "Simple", hint: "Few pieces, clean lines, basic finishes." },
      media: { title: "Medium", hint: "Volumes, pockets, details and careful finishes." },
      complessa: { title: "Complex", hint: "Many pieces, linings, structures, special processes." }
    },
    currency: { symbol: "€" },
    form: { note: "Estimates are based on indicative market ranges and do not replace a quote. Real prices depend on the supplier, the chosen fabric and the time." },
    nav: { back: "← Back", continue: "Continue", calculate: "Calculate estimate", calculating: "Calculating…", stepCounter: "Step {step} of 3" },
    validate: { product: "Choose a product type.", audience: "Indicate who the garment is for.", stage: "Select what stage you are at.", material: "Choose the main material.", complexity: "Choose the model complexity.", quantity: "Enter a quantity greater than zero.", budget: "Enter a budget greater than zero.", retail: "Enter a price or select “I haven't decided the price yet”." },
    locations: { italia: { label: "Italy", sub: "Made in Italy, small batches", quality: "High and traceable" }, extra: { label: "Extra Europe", sub: "Turkey, Morocco, Eastern Europe", quality: "Good, to verify" }, asia: { label: "Asia", sub: "China, India, Vietnam", quality: "Variable, QC needed" } },
    results: {
      eyebrow: "Your analysis",
      heading: "Here is what we estimated.",
      edit: "Edit answers",
      print: "Print / PDF",
      where: { title: "Where to produce", desc: "Three scenarios to compare. Select a destination to see the cost breakdown." },
      disclaimer: "<strong>Estimates are based on indicative market ranges</strong> and do not replace a quote. Real prices depend on the supplier, the chosen fabric and the time.",
      restart: "Start over",
      editBottom: "Edit answers"
    },
    footer: { brand: "UnSecret — garment feasibility studio", made: "Made with care · Italy" },
    email: {
      label: "Email address",
      placeholder: "name@example.com",
      modal: {
        title: "Email address",
        desc: "To print or save the PDF of the analysis, please enter a valid email address. It will not be published or shared."
      },
      invalid: "Please enter a valid email address.",
      confirm: "Confirm and print",
      cancel: "Cancel"
    },
    noscript: "This analysis needs JavaScript to work. Enable it in your browser and reload the page.",
    summary: { capo: "Garment", per: "For", materiale: "Material", riciclato: "recycled", complessita: "Complexity", quantita: "Quantity", pezzi: "pieces", budget: "Budget", fase: "Stage" },
    verdict: {
      label: "Estimated feasibility",
      goodTitle: "Yes, your garment can be made.",
      goodText: "The numbers add up: budget and margin hold for {quantity} pieces in {location}. Next step is to focus on supplier and sampling.",
      midTitle: "It can be done, with some adjustments.",
      midText: "The idea is feasible, but at least one number needs fixing: budget, minimum quantity or margin. In {location} the estimate is {unit} per piece.",
      lowTitle: "Better review some numbers.",
      lowText: "With the indicated numbers the project is fragile. Before starting, review budget, sale price or minimum quantity: production in {location} is not yet sustainable.",
      gap: "You are short about {amount} to cover production and development.",
      stats: { destination: "Destination", unitCost: "Cost per piece", unitSmall: "indicative estimate", times: "Estimated times", timesSmall: "development + production", recommended: "recommended scenario" }
    },
    loc: { badge: "Recommended", perPezzo: "/ piece", totale: "Total project", minimo: "Minimum", produzione: "Production", qualita: "Quality", warn: "Below minimum: at least {moq} pieces required." },
    breakdown: {
      kicker: "Cost breakdown",
      tag: "{quantity} pieces",
      rows: [
        { label: "Fabric and materials" },
        { label: "Labor and manufacturing" },
        { label: "Trims and accessories" },
        { label: "Packaging" },
        { label: "Logistics and duties" }
      ],
      costoPezzo: "Cost per piece",
      produzione: "Production",
      investimento: "Estimated investment",
      sviluppo: "production + development"
    },
    economics: {
      kicker: "Garment economics",
      heading: "Price and margin",
      tag: "VAT incl.",
      target: "Target 55%",
      prezzoConsigliato: "Suggested price",
      prezzoSmall: "Estimate at 4.2× cost per piece · VAT included",
      margineTuo: "Gross margin at your price ({retail})",
      margineStimato: "Estimated gross margin",
      margineNoteTuo: "Indicative target: 55%.",
      margineNoteStimato: "At suggested price. Indicative target: 55%.",
      investimento: "Initial investment",
      sviluppo: "of which {setup} for development",
      breakEven: "Break-even",
      rientrare: "to recover the investment",
      nonCopre: "the price does not cover the cost",
      budget: "Budget",
      disponibili: "available",
      mancano: "missing",
      ricavoNetto: "Net revenue / piece",
      iva: "after 22% VAT"
    },
    timeline: {
      kicker: "Process",
      heading: "Production times",
      totale: "Total estimated time",
      settimaneSing: "week",
      settimanePlur: "weeks",
      weeksShort: "wks",
      rangeTotal: "{min} to {max} {unit}",
      produzioneDesc: "Production of a batch of {quantity} pieces.",
      phases: [
        { name: "Development and pattern making", desc: "Technical drawing, pattern and layout." },
        { name: "Sampling", desc: "First sample, tests and corrections." },
        { name: "Production", desc: null },
        { name: "Logistics", desc: "Transport, customs and delivery." }
      ]
    },
    notes: {
      kicker: "Things to watch",
      heading: "Considerations",
      tag: "notes",
      budgetIntegrare: "Budget to integrate.",
      budgetIntegrareRest: "With {budget} available, about {gap} are missing to cover production and development in {location}.",
      budgetCoperto: "Budget covered.",
      budgetCopertoRest: "The estimate fits the budget with about {gap} of margin.",
      moq: "Minimum order.",
      moqRest: "{location} requires at least {moq} pieces: with {quantity} you need a waiver or a more flexible supplier.",
      marginLow: "Margin below target.",
      marginLowRest: "At the price of {retail} the gross margin is {margin}: below 45% the model is fragile.",
      marginSolid: "Solid margin.",
      marginSolidRest: "At the price of {retail} the gross margin is {margin}, in line with a good direct-to-consumer model.",
      campionatura: "Sampling first.",
      campionaturaRest: "Complete technical drawing and prototype before contacting suppliers: it reduces errors and costs.",
      recycled: "Recycled materials.",
      recycledRest: "Ask for GRS certification and consider longer procurement times.",
      complesso: "Complex model.",
      complessoRest: "Plan at least two sampling rounds and corrections before production.",
      asia: "Production in Asia.",
      asiaRest: "Plan on-site quality checks and a margin for duties, transport and returns.",
      italia: "Production in Italy.",
      italiaRest: "The advantage is flexibility on small lots: you can test the product without large stocks.",
      prezzoDaDefinire: "Price to define.",
      prezzoDaDefinireRest: "The suggested price is an estimate at 4.2× cost per piece: check it against your brand positioning."
    }
  },
  fr: {
    brand: { tag: "studio de faisabilité" },
    header: { meta: "Estimation indicative · Italie / Hors Europe / Asie" },
    lang: { label: "Choisir la langue", it: "Italiano", en: "English", fr: "Français", zh: "中文（简体）", es: "Español" },
    intro: {
      eyebrow: "Analyse de faisabilité pour votre vêtement",
      title1: "Votre vêtement",
      title2: "peut-il être fait ?",
      lede: "Répondez à quelques questions sur votre idée : obtenez une estimation des coûts, de la faisabilité et des délais pour la production en Italie, hors Europe ou en Asie.",
      cta: "Lancer l'analyse",
      note: "Aucun devis requis",
      fact1: "étapes",
      fact2: "pour terminer",
      fact3: "pour commencer"
    },
    wizard: {
      side: { eyebrow: "Votre analyse", note: "Les estimations sont basées sur des fourchettes de marché indicatives. Elles servent à voir si l'idée tient la route, pas à remplacer un devis." }
    },
    step1: { kicker: "01 — Votre idée", heading: "Que souhaitez-vous réaliser ?", desc: "Nous partons du vêtement. Ces informations influencent fortement le coût de production.", title: "Votre idée", sub: "Produit et destinataire" },
    step2: { kicker: "02 — Matériaux", heading: "Le matériau a un fort impact sur le coût.", desc: "Choisissez le tissu principal et le niveau de confection du modèle.", title: "Matériaux", sub: "Tissu et complexité" },
    step3: { kicker: "03 — Chiffres", heading: "Quantité, budget et prix.", desc: "Des chiffres approximatifs suffisent : ils aident à comprendre l'échelle du projet.", title: "Chiffres", sub: "Quantité, budget, prix" },
    field: {
      product: { legend: "Type de produit" },
      audience: { legend: "Pour qui" },
      stage: { label: "À quel stade en êtes-vous", placeholder: "Choisissez une étape", idea: "Je n'ai qu'une idée", disegno: "J'ai un dessin technique", prototipo: "J'ai un prototype", campione: "J'ai un échantillon approuvé", produzione: "Production déjà lancée" },
      description: { label: "Décrivez l'idée", optional: "optionnel", placeholder: "Ex. une chemise oversize en lin, avec poches appliquées et boutons en corozo…" },
      material: { legend: "Type de matériau" },
      recycled: { title: "Utilisez-vous des éléments recyclés ?", hint: "Tissus régénérés, fins de série ou certifiés GRS." },
      complexity: { legend: "Complexité du modèle" },
      quantity: { label: "Pièces à produire", unit: "pièces", rangeAria: "Pièces à produire", rangeMin: "1", rangeMax: "5 000+" },
      budget: { label: "Budget disponible" },
      retail: { label: "Prix de vente au public", placeholder: "TVA incluse", noRetail: "Je n'ai pas encore fixé le prix" }
    },
    product: {
      tshirt: { title: "T-shirt", hint: "Basique ou graphique" },
      camicia: { title: "Chemise", hint: "Classique ou oversize" },
      felpa: { title: "Sweat", hint: "À capuche ou col rond" },
      pantalone: { title: "Pantalon", hint: "Chino, jean, tailleur" },
      abito: { title: "Robe", hint: "Jour ou soir" },
      giacca: { title: "Veste", hint: "Blazer ou outerwear" },
      maglieria: { title: "Maille", hint: "Maille et jersey" },
      intimo: { title: "Sous-vêtements", hint: "Basique ou lingerie" },
      accessorio: { title: "Accessoire", hint: "Sac, chapeau, etc." }
    },
    audience: { donna: "Femme", uomo: "Homme", unisex: "Unisexe", bambino: "Enfant" },
    material: {
      cotone: { title: "Coton", hint: "Le plus polyvalent" },
      lino: { title: "Lin", hint: "Naturel, saisonnier" },
      lana: { title: "Laine", hint: "Chaud, premium" },
      seta: { title: "Soie", hint: "Délicat, luxe" },
      jersey: { title: "Jersey", hint: "Élastique, confortable" },
      denim: { title: "Denim", hint: "Solide, iconique" },
      tecnico: { title: "Technique", hint: "Performance" },
      pelle: { title: "Cuir", hint: "Tannage et finition" },
      misto: { title: "Mélange", hint: "Mélange de fibres" }
    },
    complexity: {
      semplice: { title: "Simple", hint: "Peu de pièces, lignes épurées, finitions basiques." },
      media: { title: "Moyenne", hint: "Volumes, poches, détails et finitions soignées." },
      complessa: { title: "Complexe", hint: "Plusieurs pièces, doublures, structures, traitements spéciaux." }
    },
    currency: { symbol: "€" },
    form: { note: "Les estimations sont basées sur des fourchettes de marché indicatives et ne remplacent pas un devis. Les prix réels dépendent du fournisseur, du tissu choisi et du moment." },
    nav: { back: "← Retour", continue: "Continuer", calculate: "Calculer l'estimation", calculating: "Calcul en cours…", stepCounter: "Étape {step} sur 3" },
    validate: { product: "Choisissez un type de produit.", audience: "Indiquez pour qui est le vêtement.", stage: "Sélectionnez le stade où vous en êtes.", material: "Choisissez le matériau principal.", complexity: "Choisissez la complexité du modèle.", quantity: "Entrez une quantité supérieure à zéro.", budget: "Entrez un budget supérieur à zéro.", retail: "Entrez un prix ou sélectionnez “Je n'ai pas encore fixé le prix”." },
    locations: { italia: { label: "Italie", sub: "Fabriqué en Italie, petites séries", quality: "Haute et traçable" }, extra: { label: "Hors Europe", sub: "Turquie, Maroc, Europe de l'Est", quality: "Bonne, à vérifier" }, asia: { label: "Asie", sub: "Chine, Inde, Vietnam", quality: "Variable, contrôle qualité nécessaire" } },
    results: {
      eyebrow: "Votre analyse",
      heading: "Voici ce que nous avons estimé.",
      edit: "Modifier les réponses",
      print: "Imprimer / PDF",
      where: { title: "Où produire", desc: "Trois scénarios à comparer. Sélectionnez une destination pour voir le détail des coûts." },
      disclaimer: "<strong>Les estimations sont basées sur des fourchettes de marché indicatives</strong> et ne remplacent pas un devis. Les prix réels dépendent du fournisseur, du tissu choisi et du moment.",
      restart: "Recommencer",
      editBottom: "Modifier les réponses"
    },
    footer: { brand: "UnSecret — studio de faisabilité pour l'habillement", made: "Fabriqué avec soin · Italie" },
    email: {
      label: "Adresse e-mail",
      placeholder: "nom@exemple.com",
      modal: {
        title: "Adresse e-mail",
        desc: "Pour imprimer ou enregistrer le PDF de l'analyse, saisissez une adresse e-mail valide. Elle ne sera ni publiée ni partagée."
      },
      invalid: "Saisissez une adresse e-mail valide.",
      confirm: "Confirmer et imprimer",
      cancel: "Annuler"
    },
    noscript: "Cette analyse a besoin de JavaScript pour fonctionner. Activez-le dans votre navigateur et rechargez la page.",
    summary: { capo: "Vêtement", per: "Pour", materiale: "Matériau", riciclato: "recyclé", complessita: "Complexité", quantita: "Quantité", pezzi: "pièces", budget: "Budget", fase: "Étape" },
    verdict: {
      label: "Faisabilité estimée",
      goodTitle: "Oui, votre vêtement peut être fait.",
      goodText: "Les chiffres tiennent : budget et marge tiennent pour {quantity} pièces en {location}. Prochaine étape : préciser fournisseur et échantillonnage.",
      midTitle: "C'est faisable, avec quelques ajustements.",
      midText: "L'idée est réalisable, mais au moins un chiffre doit être revu : budget, quantité minimum ou marge. En {location} l'estimation est de {unit} par pièce.",
      lowTitle: "Mieux vaut revoir quelques chiffres.",
      lowText: "Avec les chiffres indiqués, le projet est fragile. Avant de lancer, révisez budget, prix de vente ou quantité minimum : la production en {location} n'est pas encore viable.",
      gap: "Il vous manque environ {amount} pour couvrir production et développement.",
      stats: { destination: "Destination", unitCost: "Coût par pièce", unitSmall: "estimation indicative", times: "Délais estimés", timesSmall: "développement + production", recommended: "scénario recommandé" }
    },
    loc: { badge: "Recommandé", perPezzo: "/ pièce", totale: "Coût total projet", minimo: "Minimum", produzione: "Production", qualita: "Qualité", warn: "En dessous du minimum : au moins {moq} pièces requises." },
    breakdown: {
      kicker: "Détail des coûts",
      tag: "{quantity} pièces",
      rows: [
        { label: "Tissu et matériaux" },
        { label: "Main-d'œuvre et confection" },
        { label: "Fournitures et accessoires" },
        { label: "Emballage" },
        { label: "Logistique et droits de douane" }
      ],
      costoPezzo: "Coût par pièce",
      produzione: "Production",
      investimento: "Investissement estimé",
      sviluppo: "production + développement"
    },
    economics: {
      kicker: "Économie du vêtement",
      heading: "Prix et marge",
      tag: "TVA incl.",
      target: "Objectif 55%",
      prezzoConsigliato: "Prix conseillé",
      prezzoSmall: "Estimation à 4,2× le coût par pièce · TVA incluse",
      margineTuo: "Marge brute à votre prix ({retail})",
      margineStimato: "Marge brute estimée",
      margineNoteTuo: "Objectif indicatif : 55%.",
      margineNoteStimato: "Au prix conseillé. Objectif indicatif : 55%.",
      investimento: "Investissement initial",
      sviluppo: "dont {setup} pour le développement",
      breakEven: "Seuil de rentabilité",
      rientrare: "pour rentabiliser l'investissement",
      nonCopre: "le prix ne couvre pas le coût",
      budget: "Budget",
      disponibili: "disponibles",
      mancano: "manquent",
      ricavoNetto: "Chiffre d'affaires net / pièce",
      iva: "après TVA 22%"
    },
    timeline: {
      kicker: "Parcours",
      heading: "Délais de réalisation",
      totale: "Délai total estimé",
      settimaneSing: "semaine",
      settimanePlur: "semaines",
      weeksShort: "sem.",
      rangeTotal: "De {min} à {max} {unit}",
      produzioneDesc: "Confection du lot de {quantity} pièces.",
      phases: [
        { name: "Développement et patronage", desc: "Dessin technique, patron et placement." },
        { name: "Échantillonnage", desc: "Premier échantillon, tests et corrections." },
        { name: "Production", desc: null },
        { name: "Logistique", desc: "Transport, douane et livraison." }
      ]
    },
    notes: {
      kicker: "À surveiller",
      heading: "À considérer",
      tag: "notes",
      budgetIntegrare: "Budget à compléter.",
      budgetIntegrareRest: "Avec {budget} disponibles, il manque environ {gap} pour couvrir production et développement en {location}.",
      budgetCoperto: "Budget couvert.",
      budgetCopertoRest: "L'estimation rentre dans le budget avec environ {gap} de marge.",
      moq: "Quantité minimum.",
      moqRest: "{location} exige au moins {moq} pièces : avec {quantity} il faut une dérogation ou un fournisseur plus flexible.",
      marginLow: "Marge sous objectif.",
      marginLowRest: "Au prix de {retail} la marge brute est de {margin} : en dessous de 45% le modèle est fragile.",
      marginSolid: "Marge solide.",
      marginSolidRest: "Au prix de {retail} la marge brute est de {margin}, en ligne avec un bon modèle direct-to-consumer.",
      campionatura: "L'échantillon d'abord.",
      campionaturaRest: "Terminez le dessin technique et le prototype avant de contacter les fournisseurs : cela réduit les erreurs et les coûts.",
      recycled: "Matériaux recyclés.",
      recycledRest: "Demandez la certification GRS et prévoyez des délais d'approvisionnement plus longs.",
      complesso: "Modèle complexe.",
      complessoRest: "Prévoyez au moins deux séries d'échantillons et corrections avant la production.",
      asia: "Production en Asie.",
      asiaRest: "Prévoyez des contrôles qualité sur place et une marge pour droits, transport et retours.",
      italia: "Production en Italie.",
      italiaRest: "L'avantage est la souplesse sur les petites séries : vous pouvez tester le produit sans grands stocks.",
      prezzoDaDefinire: "Prix à définir.",
      prezzoDaDefinireRest: "Le prix conseillé est une estimation à 4,2× le coût par pièce : vérifiez-le selon le positionnement de votre marque."
    }
  },
  es: {
    brand: { tag: "estudio de factibilidad" },
    header: { meta: "Estimación indicativa · Italia / Extra Europa / Asia" },
    lang: { label: "Elegir idioma", it: "Italiano", en: "English", fr: "Français", zh: "中文（简体）", es: "Español" },
    intro: {
      eyebrow: "Análisis de factibilidad para tu prenda",
      title1: "Tu prenda",
      title2: "¿se puede hacer?",
      lede: "Responde unas preguntas sobre tu idea: obtén una estimación de costos, factibilidad y tiempos para producirla en Italia, extra Europa o Asia.",
      cta: "Iniciar análisis",
      note: "Sin presupuesto requerido",
      fact1: "pasos",
      fact2: "para completar",
      fact3: "para empezar"
    },
    wizard: {
      side: { eyebrow: "Tu análisis", note: "Las estimaciones se basan en rangos de mercado indicativos. Sirven para saber si la idea es viable, no para sustituir un presupuesto." }
    },
    step1: { kicker: "01 — Tu idea", heading: "¿Qué quieres confeccionar?", desc: "Partimos de la prenda. Esta información afecta mucho el costo de producción.", title: "Tu idea", sub: "Producto y destinatario" },
    step2: { kicker: "02 — Materiales", heading: "El material impacta mucho en el costo.", desc: "Elige la tela principal y el nivel de confección del modelo.", title: "Materiales", sub: "Tela y complejidad" },
    step3: { kicker: "03 — Números", heading: "Cantidad, presupuesto y precio.", desc: "También sirven números aproximados: ayudan a entender la escala del proyecto.", title: "Números", sub: "Cantidad, presupuesto, precio" },
    field: {
      product: { legend: "Tipo de producto" },
      audience: { legend: "¿Para quién?" },
      stage: { label: "¿En qué etapa estás?", placeholder: "Elige una etapa", idea: "Solo tengo una idea", disegno: "Tengo un dibujo técnico", prototipo: "Tengo un prototipo", campione: "Tengo una muestra aprobada", produzione: "Producción ya iniciada" },
      description: { label: "Describe la idea", optional: "opcional", placeholder: "Ej. una camisa oversize de lino, con bolsillos parchados y botones de corozo…" },
      material: { legend: "Tipo de material" },
      recycled: { title: "¿Usas elementos reciclados?", hint: "Telas regeneradas, deadstock o certificadas GRS." },
      complexity: { legend: "Complejidad del modelo" },
      quantity: { label: "Piezas a producir", unit: "piezas", rangeAria: "Piezas a producir", rangeMin: "1", rangeMax: "5.000+" },
      budget: { label: "Presupuesto disponible" },
      retail: { label: "Precio de venta al público", placeholder: "IVA incluida", noRetail: "Todavía no he decidido el precio" }
    },
    product: {
      tshirt: { title: "Camiseta", hint: "Básica o gráfica" },
      camicia: { title: "Camisa", hint: "Clásica o oversize" },
      felpa: { title: "Sudadera", hint: "Con capucha o cuello redondo" },
      pantalone: { title: "Pantalón", hint: "Chino, jean, sastrería" },
      abito: { title: "Vestido", hint: "Día o noche" },
      giacca: { title: "Chaqueta", hint: "Blazer o outerwear" },
      maglieria: { title: "Punto", hint: "Punto y jersey" },
      intimo: { title: "Ropa interior", hint: "Básica o lencería" },
      accessorio: { title: "Accesorio", hint: "Bolsos, sombrero, etc." }
    },
    audience: { donna: "Mujer", uomo: "Hombre", unisex: "Unisex", bambino: "Niño" },
    material: {
      cotone: { title: "Algodón", hint: "El más versátil" },
      lino: { title: "Lino", hint: "Natural, de temporada" },
      lana: { title: "Lana", hint: "Cálida, premium" },
      seta: { title: "Seda", hint: "Delicada, lujo" },
      jersey: { title: "Jersey", hint: "Elástico, cómodo" },
      denim: { title: "Denim", hint: "Robusto, icónico" },
      tecnico: { title: "Técnico", hint: "Rendimiento" },
      pelle: { title: "Cuero", hint: "Curtido y acabado" },
      misto: { title: "Mezcla", hint: "Mezcla de fibras" }
    },
    complexity: {
      semplice: { title: "Simple", hint: "Pocas piezas, líneas limpias, acabados básicos." },
      media: { title: "Media", hint: "Volúmenes, bolsillos, detalles y acabados cuidados." },
      complessa: { title: "Compleja", hint: "Muchas piezas, forros, estructuras, procesos especiales." }
    },
    currency: { symbol: "€" },
    form: { note: "Las estimaciones se basan en rangos de mercado indicativos y no sustituyen un presupuesto. Los precios reales dependen del proveedor, la tela elegida y el momento." },
    nav: { back: "← Atrás", continue: "Continuar", calculate: "Calcular estimación", calculating: "Calculando…", stepCounter: "Paso {step} de 3" },
    validate: { product: "Elige un tipo de producto.", audience: "Indica para quién es la prenda.", stage: "Selecciona en qué etapa estás.", material: "Elige el material principal.", complexity: "Elige la complejidad del modelo.", quantity: "Ingresa una cantidad mayor a cero.", budget: "Ingresa un presupuesto mayor a cero.", retail: "Ingresa un precio o selecciona “Todavía no he decidido el precio”." },
    locations: { italia: { label: "Italia", sub: "Hecho en Italia, lotes pequeños", quality: "Alta y trazable" }, extra: { label: "Extra Europa", sub: "Turquía, Marruecos, Europa del Este", quality: "Buena, por verificar" }, asia: { label: "Asia", sub: "China, India, Vietnam", quality: "Variable, control de calidad necesario" } },
    results: {
      eyebrow: "Tu análisis",
      heading: "Esto es lo que estimamos.",
      edit: "Editar respuestas",
      print: "Imprimir / PDF",
      where: { title: "Dónde producir", desc: "Tres escenarios para comparar. Selecciona un destino para ver el detalle de costos." },
      disclaimer: "<strong>Las estimaciones se basan en rangos de mercado indicativos</strong> y no sustituyen un presupuesto. Los precios reales dependen del proveedor, la tela elegida y el momento.",
      restart: "Empezar de nuevo",
      editBottom: "Editar respuestas"
    },
    footer: { brand: "UnSecret — estudio de factibilidad para la confección", made: "Hecho con cuidado · Italia" },
    email: {
      label: "Dirección de correo electrónico",
      placeholder: "nombre@ejemplo.com",
      modal: {
        title: "Correo electrónico",
        desc: "Para imprimir o guardar el PDF del análisis, introduce una dirección de correo válida. No se publicará ni compartirá."
      },
      invalid: "Introduce una dirección de correo válida.",
      confirm: "Confirmar e imprimir",
      cancel: "Cancelar"
    },
    noscript: "Este análisis necesita JavaScript para funcionar. Actívalo en el navegador y recarga la página.",
    summary: { capo: "Prenda", per: "Para", materiale: "Material", riciclato: "reciclado", complessita: "Complejidad", quantita: "Cantidad", pezzi: "piezas", budget: "Presupuesto", fase: "Etapa" },
    verdict: {
      label: "Factibilidad estimada",
      goodTitle: "Sí, tu prenda se puede hacer.",
      goodText: "Los números cuadran: presupuesto y margen se sostienen para {quantity} piezas en {location}. El siguiente paso es definir proveedor y muestra.",
      midTitle: "Se puede hacer, con algunos ajustes.",
      midText: "La idea es realizable, pero hay que revisar al menos un número: presupuesto, cantidad mínima o margen. En {location} la estimación es de {unit} por pieza.",
      lowTitle: "Mejor revisar algunos números.",
      lowText: "Con los números indicados el proyecto es frágil. Antes de empezar, revisa presupuesto, precio de venta o cantidad mínima: la producción en {location} no es aún sostenible.",
      gap: "Te faltan aproximadamente {amount} para cubrir producción y desarrollo.",
      stats: { destination: "Destino", unitCost: "Costo por pieza", unitSmall: "estimación indicativa", times: "Tiempos estimados", timesSmall: "desarrollo + producción", recommended: "escenario recomendado" }
    },
    loc: { badge: "Recomendado", perPezzo: "/ pieza", totale: "Costo total proyecto", minimo: "Mínimo", produzione: "Producción", qualita: "Calidad", warn: "Por debajo del mínimo: al menos {moq} piezas requeridas." },
    breakdown: {
      kicker: "Detalle de costos",
      tag: "{quantity} piezas",
      rows: [
        { label: "Tela y materiales" },
        { label: "Mano de obra y confección" },
        { label: "Remates y accesorios" },
        { label: "Embalaje" },
        { label: "Logística y aranceles" }
      ],
      costoPezzo: "Costo por pieza",
      produzione: "Producción",
      investimento: "Inversión estimada",
      sviluppo: "producción + desarrollo"
    },
    economics: {
      kicker: "Economía de la prenda",
      heading: "Precio y margen",
      tag: "IVA incl.",
      target: "Objetivo 55%",
      prezzoConsigliato: "Precio sugerido",
      prezzoSmall: "Estimación a 4,2× el costo por pieza · IVA incluida",
      margineTuo: "Margen bruto a tu precio ({retail})",
      margineStimato: "Margen bruto estimado",
      margineNoteTuo: "Objetivo indicativo: 55%.",
      margineNoteStimato: "Al precio sugerido. Objetivo indicativo: 55%.",
      investimento: "Inversión inicial",
      sviluppo: "de los cuales {setup} para desarrollo",
      breakEven: "Punto de equilibrio",
      rientrare: "para recuperar la inversión",
      nonCopre: "el precio no cubre el costo",
      budget: "Presupuesto",
      disponibili: "disponibles",
      mancano: "faltan",
      ricavoNetto: "Ingreso neto / pieza",
      iva: "tras IVA 22%"
    },
    timeline: {
      kicker: "Recorrido",
      heading: "Tiempos de realización",
      totale: "Tiempo total estimado",
      settimaneSing: "semana",
      settimanePlur: "semanas",
      weeksShort: "sem.",
      rangeTotal: "De {min} a {max} {unit}",
      produzioneDesc: "Producción del lote de {quantity} piezas.",
      phases: [
        { name: "Desarrollo y patronaje", desc: "Dibujo técnico, patrón y colocación." },
        { name: "Muestreo", desc: "Primera muestra, pruebas y correcciones." },
        { name: "Producción", desc: null },
        { name: "Logística", desc: "Transporte, aduana y entrega." }
      ]
    },
    notes: {
      kicker: "Aspectos a tener en cuenta",
      heading: "Consideraciones",
      tag: "notas",
      budgetIntegrare: "Presupuesto a completar.",
      budgetIntegrareRest: "Con {budget} disponibles, faltan aproximadamente {gap} para cubrir producción y desarrollo en {location}.",
      budgetCoperto: "Presupuesto cubierto.",
      budgetCopertoRest: "La estimación entra en el presupuesto con aproximadamente {gap} de margen.",
      moq: "Cantidad mínima.",
      moqRest: "{location} requiere al menos {moq} piezas: con {quantity} necesitas una exención o un proveedor más flexible.",
      marginLow: "Margen por debajo del objetivo.",
      marginLowRest: "Al precio de {retail} el margen bruto es del {margin}: por debajo del 45% el modelo es frágil.",
      marginSolid: "Margen sólido.",
      marginSolidRest: "Al precio de {retail} el margen bruto es del {margin}, en línea con un buen modelo directo al consumidor.",
      campionatura: "Primero el muestreo.",
      campionaturaRest: "Completa el dibujo técnico y el prototipo antes de contactar a los proveedores: reduce errores y costos.",
      recycled: "Materiales reciclados.",
      recycledRest: "Pide la certificación GRS y considera tiempos de aprovisionamiento más largos.",
      complesso: "Modelo complejo.",
      complessoRest: "Considera al menos dos rondas de muestras y correcciones antes de la producción.",
      asia: "Producción en Asia.",
      asiaRest: "Prevé controles de calidad in situ y un margen para aranceles, transporte y devoluciones.",
      italia: "Producción en Italia.",
      italiaRest: "La ventaja es la flexibilidad en lotes pequeños: puedes probar el producto sin grandes existencias.",
      prezzoDaDefinire: "Precio por definir.",
      prezzoDaDefinireRest: "El precio sugerido es una estimación a 4,2× el costo por pieza: verifícalo con el posicionamiento de tu marca."
    }
  },
  zh: {
    brand: { tag: "可行性研究室" },
    header: { meta: "预估报价 · 意大利 / 欧洲以外 / 亚洲" },
    lang: { label: "选择语言", it: "Italiano", en: "English", fr: "Français", zh: "中文（简体）", es: "Español" },
    intro: {
      eyebrow: "您的服装可行性分析",
      title1: "您的服装",
      title2: "能否制作？",
      lede: "回答几个关于您想法的问题：获取在意大利、欧洲以外或亚洲生产的成本、可行性和时间预估。",
      cta: "开始分析",
      note: "无需报价",
      fact1: "步骤",
      fact2: "即可完成",
      fact3: "开始使用"
    },
    wizard: {
      side: { eyebrow: "您的分析", note: "估算基于市场参考区间，用于判断想法是否可行，不替代正式报价。" }
    },
    step1: { kicker: "01 — 您的想法", heading: "您想制作什么？", desc: "从服装本身开始。这些信息对生产成本影响很大。", title: "您的想法", sub: "产品和受众" },
    step2: { kicker: "02 — 材料", heading: "材料对成本影响很大。", desc: "选择主面料和款式的工艺水平。", title: "材料", sub: "面料和复杂度" },
    step3: { kicker: "03 — 数字", heading: "数量、预算和价格。", desc: "大致数字即可：有助于了解项目规模。", title: "数字", sub: "数量、预算、价格" },
    field: {
      product: { legend: "产品类型" },
      audience: { legend: "适用人群" },
      stage: { label: "当前阶段", placeholder: "选择阶段", idea: "只有想法", disegno: "有技术图纸", prototipo: "有样衣", campione: "有已批准样衣", produzione: "生产已开始" },
      description: { label: "描述想法", optional: "可选", placeholder: "例如：一件亚麻宽松衬衫，带贴袋和 corozo 钮扣…" },
      material: { legend: "面料类型" },
      recycled: { title: "是否使用再生材料？", hint: "再生面料、尾货或 GRS 认证。" },
      complexity: { legend: "款式复杂度" },
      quantity: { label: "生产件数", unit: "件", rangeAria: "生产件数", rangeMin: "1", rangeMax: "5,000+" },
      budget: { label: "可用预算" },
      retail: { label: "建议零售价", placeholder: "含增值税", noRetail: "尚未确定价格" }
    },
    product: {
      tshirt: { title: "T恤", hint: "基础或印花" },
      camicia: { title: "衬衫", hint: "经典或宽松" },
      felpa: { title: "卫衣", hint: "连帽或圆领" },
      pantalone: { title: "裤子", hint: "卡其、牛仔、西装" },
      abito: { title: "连衣裙", hint: "日常或晚宴" },
      giacca: { title: "夹克", hint: "西装外套或户外外套" },
      maglieria: { title: "针织", hint: "毛衫与针织品" },
      intimo: { title: "内衣", hint: "基础款或蕾丝内衣" },
      accessorio: { title: "配饰", hint: "包包、帽子等" }
    },
    audience: { donna: "女士", uomo: "男士", unisex: "中性", bambino: "儿童" },
    material: {
      cotone: { title: "棉", hint: "最通用" },
      lino: { title: "亚麻", hint: "天然，时令" },
      lana: { title: "羊毛", hint: "保暖，高端" },
      seta: { title: "丝", hint: "精致，奢华" },
      jersey: { title: "汗布", hint: "有弹性，舒适" },
      denim: { title: "牛仔布", hint: "坚固，经典" },
      tecnico: { title: "功能性面料", hint: "运动" },
      pelle: { title: "皮革", hint: "鞣制和整理" },
      misto: { title: "混纺", hint: "混合纤维" }
    },
    complexity: {
      semplice: { title: "简单", hint: "部件少，线条简洁，基础做工。" },
      media: { title: "中等", hint: "有体量、口袋、细节和精细做工。" },
      complessa: { title: "复杂", hint: "部件多、有衬里、结构件和特殊工艺。" }
    },
    currency: { symbol: "€" },
    form: { note: "估算基于市场参考区间，不替代正式报价。实际价格取决于供应商、所选面料和时间。" },
    nav: { back: "← 返回", continue: "继续", calculate: "计算估算", calculating: "正在计算…", stepCounter: "第 {step} 步，共 3 步" },
    validate: { product: "选择产品类型。", audience: "说明服装适用人群。", stage: "选择当前阶段。", material: "选择主要面料。", complexity: "选择款式复杂度。", quantity: "输入大于零的数量。", budget: "输入大于零的预算。", retail: "输入价格或选择“尚未确定价格”。" },
    locations: { italia: { label: "意大利", sub: "意大利制造，小批量", quality: "高且可追溯" }, extra: { label: "欧洲以外", sub: "土耳其、摩洛哥、东欧", quality: "良好，待核实" }, asia: { label: "亚洲", sub: "中国、印度、越南", quality: "可变，需要质检" } },
    results: {
      eyebrow: "您的分析",
      heading: "以下是我们的预估。",
      edit: "修改回答",
      print: "打印 / PDF",
      where: { title: "在哪里生产", desc: "三个生产场景对比。选择目的地查看成本明细。" },
      disclaimer: "<strong>估算基于市场参考区间</strong>，不替代正式报价。实际价格取决于供应商、所选面料和时间。",
      restart: "重新开始",
      editBottom: "修改回答"
    },
    footer: { brand: "UnSecret — 服装可行性研究室", made: "精心制作 · 意大利" },
    email: {
      label: "电子邮箱",
      placeholder: "name@example.com",
      modal: {
        title: "电子邮箱",
        desc: "打印或保存 PDF 分析前，请输入有效的电子邮箱地址。该邮箱不会被公开或共享。"
      },
      invalid: "请输入有效的电子邮箱地址。",
      confirm: "确认并打印",
      cancel: "取消"
    },
    noscript: "此分析需要 JavaScript 才能运行。请在浏览器中启用并刷新页面。",
    summary: { capo: "服装", per: "适用", materiale: "面料", riciclato: "再生", complessita: "复杂度", quantita: "数量", pezzi: "件", budget: "预算", fase: "阶段" },
    verdict: {
      label: "预估可行性",
      goodTitle: "是的，您的服装可以制作。",
      goodText: "数据可行：预算和利润可支撑在 {location} 生产 {quantity} 件。下一步是确定供应商和打样。",
      midTitle: "可以制作，但需做一些调整。",
      midText: "想法可行，但至少有一个数字需要调整：预算、最小起订量或利润。在 {location} 的预估为每件 {unit}。",
      lowTitle: "建议重新核算几个数字。",
      lowText: "按所给数据，项目较为脆弱。启动前，请重新核算预算、零售价或最小起订量：在 {location} 生产尚不可持续。",
      gap: "您还差约 {amount} 才能覆盖生产和开发成本。",
      stats: { destination: "建议目的地", unitCost: "预估成本/件", unitSmall: "仅供参考", times: "预计时间", timesSmall: "开发 + 生产", recommended: "推荐场景" }
    },
    loc: { badge: "推荐", perPezzo: "/件", totale: "项目总预算", minimo: "最小起订量", produzione: "生产周期", qualita: "品质", warn: "低于最小起订量：至少需要 {moq} 件。" },
    breakdown: {
      kicker: "成本明细",
      tag: "{quantity} 件",
      rows: [
        { label: "面料与材料" },
        { label: "人工与制衣" },
        { label: "辅料与配件" },
        { label: "包装" },
        { label: "物流与关税" }
      ],
      costoPezzo: "成本/件",
      produzione: "生产",
      investimento: "预计总投入",
      sviluppo: "生产 + 开发"
    },
    economics: {
      kicker: "服装经济性",
      heading: "价格与利润",
      tag: "含增值税",
      target: "目标 55%",
      prezzoConsigliato: "建议零售价",
      prezzoSmall: "按成本的 4.2 倍预估 · 含增值税",
      margineTuo: "按您报价的毛利 ({retail})",
      margineStimato: "预估毛利",
      margineNoteTuo: "参考目标：55%。",
      margineNoteStimato: "按建议价。参考目标：55%。",
      investimento: "初始投入",
      sviluppo: "其中开发 {setup}",
      breakEven: "盈亏平衡点",
      rientrare: "收回投资",
      nonCopre: "单价未覆盖成本",
      budget: "预算",
      disponibili: "可用",
      mancano: "缺口",
      ricavoNetto: "每件净收入",
      iva: "扣除 22% 增值税后"
    },
    timeline: {
      kicker: "流程",
      heading: "生产周期",
      totale: "预计总工期",
      settimaneSing: "周",
      settimanePlur: "周",
      weeksShort: "周",
      rangeTotal: "{min}–{max} {unit}",
      produzioneDesc: "生产 {quantity} 件的批次。",
      phases: [
        { name: "开发与制版", desc: "技术图纸、制版与排版。" },
        { name: "打样", desc: "首样、试样与修改。" },
        { name: "生产", desc: null },
        { name: "物流", desc: "运输、报关与交付。" }
      ]
    },
    notes: {
      kicker: "注意事项",
      heading: "需考虑",
      tag: "条",
      budgetIntegrare: "预算不足。",
      budgetIntegrareRest: "可用预算 {budget}，还差约 {gap} 才能覆盖在 {location} 的生产与开发。",
      budgetCoperto: "预算充足。",
      budgetCopertoRest: "预估在预算内，结余约 {gap}。",
      moq: "最小起订量。",
      moqRest: "{location} 至少需要 {moq} 件：按 {quantity} 件需申请例外或找更灵活的供应商。",
      marginLow: "毛利低于目标。",
      marginLowRest: "按 {retail} 的毛利为 {margin}：低于 45% 模式较为脆弱。",
      marginSolid: "毛利充足。",
      marginSolidRest: "按 {retail} 的毛利为 {margin}，符合优秀直销品牌水平。",
      campionatura: "先打样再量产。",
      campionaturaRest: "先完成技术图纸和样衣再联系供应商：可减少错误和成本。",
      recycled: "再生材料。",
      recycledRest: "要求提供 GRS 认证，并预留更长采购时间。",
      complesso: "款式复杂。",
      complessoRest: "生产前预计至少两轮打样与修改。",
      asia: "亚洲生产。",
      asiaRest: "建议安排现场质量检查，并预留关税、运输和退货缓冲。",
      italia: "意大利生产。",
      italiaRest: "优势是小批量灵活：可在不积压大量库存的情况下测试产品。",
      prezzoDaDefinire: "价格待定。",
      prezzoDaDefinireRest: "建议价按成本 4.2 倍预估：请结合品牌定位核实。"
    }
  }
};

/* ---------- Formattazione ---------- */

function getFormatters(lang) {
  const code = (LANGUAGES[lang] || LANGUAGES[DEFAULT_LANG]).code;
  return {
    num0: new Intl.NumberFormat(code, { maximumFractionDigits: 0 }),
    num2: new Intl.NumberFormat(code, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  };
}

let fmt = getFormatters(currentLang);

function eur(value, decimals = false) {
  const symbol = (LANGUAGES[currentLang] || LANGUAGES[DEFAULT_LANG]).currency;
  return `${symbol} ${decimals ? fmt.num2.format(value) : fmt.num0.format(Math.round(value))}`;
}

function eurRange(low, high) {
  return `${(LANGUAGES[currentLang] || LANGUAGES[DEFAULT_LANG]).currency} ${fmt.num0.format(Math.round(low))}–${fmt.num0.format(Math.round(high))}`;
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function weekRange(range) {
  const abbr = t("timeline.weeksShort");
  return range[0] === range[1] ? `${range[0]} ${abbr}` : `${range[0]}–${range[1]} ${abbr}`;
}

function totalWeeks(min, max) {
  const sing = t("timeline.settimaneSing");
  const plur = t("timeline.settimanePlur");
  if (min === max) return `${min} ${min === 1 ? sing : plur}`;
  return t("timeline.rangeTotal")
    .replace("{min}", String(min))
    .replace("{max}", String(max))
    .replace("{unit}", plur);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

/* ---------- Traduzione ---------- */

function setLang(lang, persist = true) {
  if (!LANGUAGES[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
  fmt = getFormatters(lang);

  const select = document.getElementById("langSelect");
  if (select) select.value = lang;

  if (persist) {
    try { localStorage.setItem("unsecret-lang", lang); } catch (error) { /* ignora */ }
  }

  applyLang();
}

function t(path) {
  const parts = path.split(".");
  let node = T[currentLang] || T[DEFAULT_LANG];
  for (const part of parts) {
    if (!node || typeof node !== "object") return path;
    node = node[part];
  }
  return node === undefined || node === null ? path : node;
}

function applyLang() {
  // Titolo e meta
  document.title = t("intro.title1") + " " + t("intro.title2") + " — UnSecret";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = t("intro.lede");

  // Elementi con data-i18n (contenuto testuale)
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (value === key) return;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = value;
    } else {
      el.textContent = value;
    }
  });

  // Elementi con markup controllato (stringhe statiche di T, mai input utente)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    const value = t(key);
    if (value !== key) el.innerHTML = value;
  });

  // Opzioni select / option con data-i18n-opt
  document.querySelectorAll("[data-i18n-opt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-opt");
    const value = t(key);
    if (value === key) return;
    if (el.tagName === "OPTION") el.text = value;
  });

  // Attributi aria-label / placeholder via data-i18n-aria / data-i18n-placeholder
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });

  // Etichette di navigazione generate da JS
  updateNavLabels();

  // Ri-disegna i risultati solo se sono visibili (e conserva la destinazione scelta)
  if (currentCalc && !results.hidden) renderResults({ keepSelection: true });
}

function loadLang() {
  try {
    const saved = localStorage.getItem("unsecret-lang");
    if (saved && LANGUAGES[saved]) {
      setLang(saved, false);
      return;
    }
  } catch (error) { /* ignora */ }
  // Fallback alla lingua del browser se tra le supportate
  const navLang = (navigator.language || "").slice(0, 2);
  if (LANGUAGES[navLang]) setLang(navLang, false);
}

function locationLabel(key) {
  const loc = (T[currentLang] || T[DEFAULT_LANG]).locations;
  return loc && loc[key] ? loc[key].label : key;
}

function productLabel(key) {
  const p = (T[currentLang] || T[DEFAULT_LANG]).product;
  return p && p[key] ? p[key].title : key;
}

function audienceLabel(key) {
  const a = (T[currentLang] || T[DEFAULT_LANG]).audience;
  return a && a[key] ? a[key] : key;
}

function materialLabel(key) {
  const m = (T[currentLang] || T[DEFAULT_LANG]).material;
  return m && m[key] ? m[key].title : key;
}

function complexityLabel(key) {
  const c = (T[currentLang] || T[DEFAULT_LANG]).complexity;
  return c && c[key] ? c[key].title : key;
}

function stageLabel(value) {
  const s = (T[currentLang] || T[DEFAULT_LANG]).field.stage;
  return s && s[value] ? s[value] : value;
}

function suggestedRetail(unitCost) {
  const raw = unitCost * 4.2;
  if (raw < 40) return Math.max(19, Math.round(raw / 5) * 5 - 1);
  if (raw < 120) return Math.round(raw / 10) * 10 - 1;
  return Math.round(raw / 20) * 20 - 1;
}

/* ---------- Stato ---------- */

const STORAGE_KEY = "unsecret-analysis-v1";

const DEFAULT_STATE = {
  product: null,
  audience: null,
  stage: "",
  description: "",
  material: null,
  recycled: false,
  complexity: null,
  quantity: 200,
  budget: 3000,
  retail: null,
  noRetail: false,
  email: ""
};

let state = { ...DEFAULT_STATE };
let currentStep = 1;
let currentCalc = null;
let selectedLocationKey = null;

/* ---------- Riferimenti DOM ---------- */

const intro = document.getElementById("intro");
const wizard = document.getElementById("wizard");
const results = document.getElementById("results");
const wizardForm = document.getElementById("wizardForm");
const stepsList = document.getElementById("stepsList");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const stepCounter = document.getElementById("stepCounter");
const startBtn = document.getElementById("startBtn");
const brandLink = document.getElementById("brandLink");
const langSelect = document.getElementById("langSelect");
const editBtn = document.getElementById("editBtn");
const editBtnBottom = document.getElementById("editBtnBottom");
const printBtn = document.getElementById("printBtn");
const restartBtn = document.getElementById("restartBtn");

const emailModal = document.getElementById("emailModal");
const emailModalBackdrop = document.getElementById("emailModalBackdrop");
const emailInput = document.getElementById("emailInput");
const emailCancelBtn = document.getElementById("emailCancelBtn");
const emailConfirmBtn = document.getElementById("emailConfirmBtn");

const descriptionInput = document.getElementById("description");
const charCount = document.getElementById("charCount");
const stageSelect = document.getElementById("stage");
const recycledInput = document.getElementById("recycled");
const quantityInput = document.getElementById("quantity");
const quantityRange = document.getElementById("quantityRange");
const budgetInput = document.getElementById("budget");
const retailInput = document.getElementById("retail");
const noRetailInput = document.getElementById("noRetail");

const resultSummary = document.getElementById("resultSummary");
const verdictCard = document.getElementById("verdictCard");
const locGrid = document.getElementById("locGrid");
const breakdownPanel = document.getElementById("breakdownPanel");
const economicsPanel = document.getElementById("economicsPanel");
const timelinePanel = document.getElementById("timelinePanel");
const notesPanel = document.getElementById("notesPanel");

/* ---------- Persistenza ---------- */

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    Object.keys(DEFAULT_STATE).forEach((key) => {
      if (key in parsed) state[key] = parsed[key];
    });

    if (!PRODUCTS[state.product]) state.product = null;
    if (!MATERIALS[state.material]) state.material = null;
    if (!COMPLEXITIES[state.complexity]) state.complexity = null;
    if (!STAGES.some((stage) => stage.value === state.stage)) state.stage = "";
    if (!AUDIENCES[state.audience]) state.audience = null;
    state.quantity = Math.max(0, Number(state.quantity) || 0);
    state.budget = Math.max(0, Number(state.budget) || 0);
    state.retail = state.retail == null ? null : Math.max(0, Number(state.retail) || 0);
    state.description = typeof state.description === "string" ? state.description.slice(0, 280) : "";
    state.email = typeof state.email === "string" ? state.email.trim().slice(0, 254) : "";
  } catch (error) {
    /* localStorage non disponibile: si continua senza salvataggio */
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    /* ignora */
  }
}

/* ---------- Form <-> stato ---------- */

function syncFormFromState() {
  const setRadio = (name, value) => {
    const input = wizardForm.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  };

  wizardForm.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.checked = false;
  });

  if (state.product) setRadio("product", state.product);
  if (state.audience) setRadio("audience", state.audience);
  if (state.material) setRadio("material", state.material);
  if (state.complexity) setRadio("complexity", state.complexity);

  stageSelect.value = state.stage || "";
  descriptionInput.value = state.description || "";
  recycledInput.checked = Boolean(state.recycled);
  quantityInput.value = state.quantity || 200;
  budgetInput.value = state.budget || 3000;
  retailInput.value = state.retail == null ? "" : state.retail;
  noRetailInput.checked = Boolean(state.noRetail);

  quantityRange.value = clamp(Number(quantityInput.value) || 200, Number(quantityRange.min), Number(quantityRange.max));

  updateCharCount();
  updateRangeVisual();
  updateRetailDisabled();
  clearErrors();
}

function readStateFromForm() {
  const checkedValue = (name) => {
    const input = wizardForm.querySelector(`input[name="${name}"]:checked`);
    return input ? input.value : null;
  };

  state.product = checkedValue("product");
  state.audience = checkedValue("audience");
  state.material = checkedValue("material");
  state.complexity = checkedValue("complexity");
  state.stage = stageSelect.value;
  state.description = descriptionInput.value;
  state.recycled = recycledInput.checked;
  state.quantity = Math.max(0, Number(quantityInput.value) || 0);
  state.budget = Math.max(0, Number(budgetInput.value) || 0);
  state.retail = retailInput.value === "" ? null : Math.max(0, Number(retailInput.value) || 0);
  state.noRetail = noRetailInput.checked;
}

function updateCharCount() {
  charCount.textContent = String(descriptionInput.value.length);
}

function updateRangeVisual() {
  const min = Number(quantityRange.min);
  const max = Number(quantityRange.max);
  const value = clamp(Number(quantityRange.value) || min, min, max);
  const percent = ((value - min) / (max - min)) * 100;
  quantityRange.style.background = `linear-gradient(to right, var(--clay) 0%, var(--clay) ${percent}%, var(--paper-3) ${percent}%, var(--paper-3) 100%)`;
}

function updateRetailDisabled() {
  const disabled = noRetailInput.checked;
  retailInput.disabled = disabled;
  const field = retailInput.closest(".field");
  if (field) field.classList.toggle("is-disabled", disabled);
}

/* ---------- Validazione ---------- */

function setError(name, message) {
  const field = wizardForm.querySelector(`[data-field="${name}"]`);
  const error = wizardForm.querySelector(`[data-error="${name}"]`);
  if (field) field.classList.add("invalid");
  if (error) error.textContent = message;
}

function clearErrors() {
  wizardForm.querySelectorAll(".field.invalid").forEach((field) => field.classList.remove("invalid"));
  wizardForm.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
}

function validateStep(step) {
  clearErrors();
  let valid = true;

  if (step === 1) {
    if (!state.product) {
      setError("product", t("validate.product"));
      valid = false;
    }
    if (!state.audience) {
      setError("audience", t("validate.audience"));
      valid = false;
    }
    if (!state.stage) {
      setError("stage", t("validate.stage"));
      valid = false;
    }
  }

  if (step === 2) {
    if (!state.material) {
      setError("material", t("validate.material"));
      valid = false;
    }
    if (!state.complexity) {
      setError("complexity", t("validate.complexity"));
      valid = false;
    }
  }

  if (step === 3) {
    if (!state.quantity || state.quantity < 1) {
      setError("quantity", t("validate.quantity"));
      valid = false;
    }
    if (!state.budget || state.budget < 1) {
      setError("budget", t("validate.budget"));
      valid = false;
    }
    if (!state.noRetail && (!state.retail || state.retail < 1)) {
      setError("retail", t("validate.retail"));
      valid = false;
    }
  }

  if (!valid) {
    const firstInvalid = wizardForm.querySelector(".field.invalid");
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return valid;
}

/* ---------- Navigazione ---------- */

function updateNavLabels() {
  if (!nextBtn || !stepCounter || nextBtn.disabled) return;
  stepCounter.textContent = t("nav.stepCounter")
    .replace("{step}", String(currentStep))
    .replace("{total}", "3");
  const key = currentStep === 3 ? "nav.calculate" : "nav.continue";
  nextBtn.innerHTML = `<span data-i18n="${key}">${escapeHTML(t(key))}</span> <span class="btn-arrow" aria-hidden="true">→</span>`;
}

function goToStep(step) {
  currentStep = step;

  wizardForm.querySelectorAll(".step-panel").forEach((panel) => {
    panel.hidden = Number(panel.dataset.panel) !== step;
  });

  stepsList.querySelectorAll("li").forEach((item) => {
    const itemStep = Number(item.dataset.indicator);
    item.classList.toggle("active", itemStep === step);
    item.classList.toggle("done", itemStep < step);
  });

  backBtn.hidden = step === 1;
  nextBtn.disabled = false;
  updateNavLabels();

  clearErrors();
  wizard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showIntro() {
  intro.hidden = false;
  wizard.hidden = true;
  results.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openWizard() {
  intro.hidden = true;
  results.hidden = true;
  wizard.hidden = false;
  goToStep(1);
}

function resetAll() {
  state = { ...DEFAULT_STATE };
  currentCalc = null;
  selectedLocationKey = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    /* ignora */
  }
  wizardForm.reset();
  syncFormFromState();
  showIntro();
}

/* ---------- Email per stampa/PDF ---------- */

function isValidEmail(value) {
  if (!value || typeof value !== "string") return false;
  const email = value.trim();
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return email.length <= 254 && re.test(email);
}

function setEmailError(message) {
  const error = emailModal.querySelector("[data-error='email']");
  if (error) error.textContent = message;
  emailModal.querySelector(".field").classList.toggle("invalid", Boolean(message));
}

let lastFocusBeforeModal = null;

function openEmailModal() {
  if (!emailModal) return;
  lastFocusBeforeModal = document.activeElement;
  emailInput.value = state.email || "";
  setEmailError("");
  emailModal.hidden = false;
  emailModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  emailInput.focus(); // dopo aver mostrato la modale: su un elemento nascosto il focus non funziona
}

function closeEmailModal() {
  if (!emailModal) return;
  emailModal.hidden = true;
  emailModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === "function") {
    lastFocusBeforeModal.focus();
  }
  lastFocusBeforeModal = null;
}

function handlePrint() {
  if (isValidEmail(state.email)) {
    window.print();
    return;
  }
  openEmailModal();
}

/* ---------- Calcolo ---------- */

function calculate() {
  const product = PRODUCTS[state.product];
  const material = MATERIALS[state.material];
  const complexity = COMPLEXITIES[state.complexity];
  const stage = STAGES.find((item) => item.value === state.stage) || STAGES[0];

  const quantity = Math.max(1, Math.round(state.quantity || 1));
  const setup = stage.dev * complexity.setup;
  const materialBase = product.fabric * material.factor * (state.recycled ? 1.12 : 1);
  const retailKnown = !state.noRetail && state.retail != null && state.retail > 0;

  const locations = LOCATION_LIST.map((location) => {
    const moq = Math.max(10, Math.round(product.moq * location.moqFactor));
    let labor = product.labor * complexity.factor * location.labor;
    let trims = 1.8 * complexity.factor * location.trims;

    let quantityDiscount = 1;
    if (quantity < moq) quantityDiscount = 1.25;
    else if (quantity >= moq * 8) quantityDiscount = 0.86;
    else if (quantity >= moq * 4) quantityDiscount = 0.91;
    else if (quantity >= moq * 1.8) quantityDiscount = 0.95;

    labor *= quantityDiscount;
    trims *= quantityDiscount;

    const fabric = materialBase * location.material;
    const packaging = 0.9 * location.packaging;
    const logistics = location.logistics;
    const duty = (fabric + labor + trims) * location.duty;

    const unit = fabric + labor + trims + packaging + logistics + duty;
    const productionTotal = unit * quantity;
    const total = productionTotal + setup;

    return {
      ...location,
      moq,
      unit,
      productionTotal,
      total,
      setup,
      breakdown: { fabric, labor, trims, packaging, logistics, duty },
      belowMoq: quantity < moq
    };
  });

  const cheapestUnit = Math.min(...locations.map((location) => location.unit));

  locations.forEach((location) => {
    let fit = 50 * (cheapestUnit / location.unit);

    if (location.belowMoq) {
      fit -= 30 + 25 * (1 - quantity / location.moq);
    }

    fit += location.key === "italia" ? 6 : location.key === "extra" ? 3 : 0;

    if (quantity <= 100) {
      fit += location.key === "italia" ? 10 : location.key === "extra" ? 2 : 0;
    } else if (quantity <= 300) {
      fit += location.key === "italia" ? 5 : location.key === "extra" ? 2 : 0;
    }

    if (retailKnown) {
      if (state.retail >= 100) {
        fit += location.key === "italia" ? 8 : location.key === "extra" ? 4 : 1;
      } else if (state.retail <= 45) {
        fit += location.key === "asia" ? 8 : location.key === "extra" ? 5 : 1;
      } else {
        fit += location.key === "italia" ? 4 : location.key === "extra" ? 4 : 2;
      }
    } else {
      fit += location.key === "italia" ? 2 : location.key === "extra" ? 2 : 1;
    }

    if (complexity.factor > 1.2) {
      fit += location.key === "italia" ? 4 : location.key === "asia" ? -3 : 0;
    }
    if (state.recycled) {
      fit += location.key === "italia" ? 2 : location.key === "extra" ? 1 : 0;
    }
    if (state.stage === "idea" || state.stage === "disegno") {
      fit += location.key === "italia" ? 2 : 0;
    }

    if (location.total <= state.budget) {
      fit += 4;
    } else {
      fit -= 6 * Math.min(1, (location.total - state.budget) / location.total);
    }

    location.fit = fit;
  });

  const recommended = [...locations].sort((a, b) => b.fit - a.fit)[0];

  const budgetRatio = state.budget / recommended.total;
  let budgetScore = 30 * Math.min(1, budgetRatio);
  if (budgetRatio < 1) budgetScore -= 12 * (1 - budgetRatio);
  budgetScore = Math.max(0, budgetScore);

  const moqScore = 20 * Math.min(1, quantity / recommended.moq);

  const retail = retailKnown ? state.retail : suggestedRetail(recommended.unit);
  const netRevenue = retail / 1.22;
  const margin = (netRevenue - recommended.unit) / netRevenue;

  let marginScore = 18;
  if (retailKnown) {
    if (margin >= 0.65) marginScore = 25;
    else if (margin >= 0.55) marginScore = 22;
    else if (margin >= 0.45) marginScore = 17;
    else if (margin >= 0.3) marginScore = 10;
    else marginScore = 3;
  }

  const readinessScore = stage.readiness * 15;

  let riskScore = complexity.risk;
  if (state.recycled) riskScore -= 1;
  if (state.material === "pelle" || state.material === "seta") riskScore -= 2;
  riskScore = clamp(riskScore, 0, 10);

  const scoreBase = clamp(budgetScore + moqScore + marginScore + readinessScore + riskScore, 0, 100);
  let score = Math.round(scoreBase);

  if (retailKnown) {
    if (margin < 0) score = Math.min(score, 35);
    else if (margin < 0.2) score = Math.min(score, 50);
    else if (margin < 0.35) score = Math.min(score, 62);
  }
  if (quantity < recommended.moq) score = Math.min(score, 55);
  if (budgetRatio < 0.5) score = Math.min(score, 65);

  const tone = score >= 80 ? "good" : score >= 60 ? "mid" : "low";
  const budgetGap = state.budget - recommended.total;
  const timeline = buildTimeline(recommended);

  const locName = locationLabel(recommended.key);
  const qtyStr = fmt.num0.format(quantity);
  const unitStr = eur(recommended.unit, true);
  const gapStr = eur(-budgetGap);

  let title;
  let text;

  if (tone === "good") {
    title = t("verdict.goodTitle");
    text = t("verdict.goodText").replace("{quantity}", qtyStr).replace("{location}", locName);
  } else if (tone === "mid") {
    title = t("verdict.midTitle");
    text = t("verdict.midText").replace("{location}", locName).replace("{unit}", unitStr);
  } else {
    title = t("verdict.lowTitle");
    text = t("verdict.lowText").replace("{location}", locName);
  }

  if (budgetGap < 0) {
    text += " " + t("verdict.gap").replace("{amount}", gapStr);
  }

  return {
    product,
    material,
    complexity,
    stage,
    quantity,
    setup,
    locations,
    recommended,
    score,
    tone,
    title,
    text,
    retail,
    retailKnown,
    netRevenue,
    margin,
    suggested: suggestedRetail(recommended.unit),
    budgetGap,
    timeline
  };
}

function buildTimeline(location) {
  const stage = STAGES.find((item) => item.value === state.stage) || STAGES[0];

  let sampling;
  if (state.stage === "produzione") sampling = [0, 0];
  else if (state.stage === "campione") sampling = [0, 1];
  else sampling = [2, 3];

  const phaseDefs = (T[currentLang] || T[DEFAULT_LANG]).timeline.phases;
  const phases = [
    {
      name: phaseDefs[0].name,
      description: phaseDefs[0].desc,
      weeks: stage.weeks
    },
    {
      name: phaseDefs[1].name,
      description: phaseDefs[1].desc,
      weeks: sampling
    },
    {
      name: phaseDefs[2].name,
      description: t("timeline.produzioneDesc").replace("{quantity}", fmt.num0.format(Math.round(state.quantity))),
      weeks: location.lead
    },
    {
      name: phaseDefs[3].name,
      description: phaseDefs[3].desc,
      weeks: location.logisticsWeeks
    }
  ].filter((phase) => phase.weeks[1] > 0);

  const min = phases.reduce((sum, phase) => sum + phase.weeks[0], 0);
  const max = phases.reduce((sum, phase) => sum + phase.weeks[1], 0);

  return { phases, min, max };
}

/* ---------- Rendering risultati ---------- */

function renderResults({ keepSelection = false } = {}) {
  const calc = calculate();
  currentCalc = calc;
  const stillValid = keepSelection && calc.locations.some((item) => item.key === selectedLocationKey);
  if (!stillValid) selectedLocationKey = calc.recommended.key;

  renderSummary(calc);
  renderVerdict(calc);
  renderLocations(calc);
  renderPanels(calc);
  animateRing(calc.score);
}

function renderSummary(calc) {
  const chips = [
    [t("summary.capo"), productLabel(state.product)],
    [t("summary.per"), audienceLabel(state.audience) || "—"],
    [t("summary.materiale"), `${materialLabel(state.material)}${state.recycled ? " · " + t("summary.riciclato") : ""}`],
    [t("summary.complessita"), complexityLabel(state.complexity)],
    [t("summary.quantita"), `${fmt.num0.format(calc.quantity)} ${t("summary.pezzi")}`],
    [t("summary.budget"), eur(state.budget)],
    [t("summary.fase"), stageLabel(state.stage)]
  ];

  let html = chips
    .map(
      ([label, value], index) =>
        `<span class="chip" style="animation-delay:${index * 0.03}s"><em>${escapeHTML(label)}</em><strong>${escapeHTML(value)}</strong></span>`
    )
    .join("");

  if (String(state.description || "").trim()) {
    html += `<p class="idea-quote">“${escapeHTML(String(state.description).trim())}”</p>`;
  }

  resultSummary.innerHTML = html;
}

function renderVerdict(calc) {
  const location = calc.recommended;
  const locName = locationLabel(location.key);
  const unitLow = location.unit * 0.88;
  const unitHigh = location.unit * 1.12;

  const stats = [
    {
      label: t("verdict.stats.destination"),
      value: locName,
      small: t("verdict.stats.recommended")
    },
    {
      label: t("verdict.stats.unitCost"),
      value: eurRange(unitLow, unitHigh),
      small: t("verdict.stats.unitSmall")
    },
    {
      label: t("verdict.stats.times"),
      value: weekRange([calc.timeline.min, calc.timeline.max]),
      small: t("verdict.stats.timesSmall")
    }
  ];

  verdictCard.className = `verdict-card tone-${calc.tone}`;
  verdictCard.innerHTML = `
    <div class="score-wrap" role="img" aria-label="${t("verdict.label")}: ${calc.score} / 100">
      <svg class="score-ring" viewBox="0 0 160 160" aria-hidden="true">
        <circle class="ring-bg" cx="80" cy="80" r="70"></circle>
        <circle class="ring-fg" cx="80" cy="80" r="70"></circle>
      </svg>
      <div class="score-number"><strong>${calc.score}</strong><span>/ 100</span></div>
    </div>
    <div class="verdict-copy">
      <span class="verdict-label">${escapeHTML(t("verdict.label"))}</span>
      <h3>${escapeHTML(calc.title)}</h3>
      <p>${escapeHTML(calc.text)}</p>
    </div>
    <div class="verdict-stats">
      ${stats
        .map(
          (stat) =>
            `<div class="verdict-stat"><span>${escapeHTML(stat.label)}</span><strong>${escapeHTML(stat.value)}</strong><small>${escapeHTML(stat.small)}</small></div>`
        )
        .join("")}
    </div>
  `;
}

function renderLocations(calc) {
  locGrid.innerHTML = calc.locations
    .map((location) => {
      const locName = locationLabel(location.key);
      const locBlock = ((T[currentLang] || T[DEFAULT_LANG]).locations[location.key] || {});
      const locSub = locBlock.sub || location.sub;
      const locQuality = locBlock.quality || location.quality;
      const isRecommended = location.key === calc.recommended.key;
      const isSelected = location.key === selectedLocationKey;

      return `
        <button type="button" class="loc-card${isSelected ? " selected" : ""}" data-loc="${location.key}" aria-pressed="${isSelected}">
          <div class="loc-top">
            <span class="loc-name">${escapeHTML(locName)}</span>
            ${isRecommended ? `<span class="badge">${t("loc.badge")}</span>` : ""}
          </div>
          <p class="loc-sub">${escapeHTML(locSub)}</p>
          <div class="loc-price">${eurRange(location.unit * 0.88, location.unit * 1.12)} <span>${t("loc.perPezzo")}</span></div>
          <p class="loc-total">${t("loc.totale")} ${eur(location.total)}</p>
          <dl class="loc-meta">
            <div><dt>${t("loc.minimo")}</dt><dd>${fmt.num0.format(location.moq)} ${t("summary.pezzi")}</dd></div>
            <div><dt>${t("loc.produzione")}</dt><dd>${weekRange(location.lead)}</dd></div>
            <div><dt>${t("loc.qualita")}</dt><dd>${escapeHTML(locQuality)}</dd></div>
          </dl>
          ${
            location.belowMoq
              ? `<p class="loc-warn">${t("loc.warn").replace("{moq}", fmt.num0.format(location.moq))}</p>`
              : ""
          }
        </button>
      `;
    })
    .join("");
}

function renderPanels(calc) {
  const location = calc.locations.find((item) => item.key === selectedLocationKey) || calc.recommended;
  renderBreakdown(calc, location);
  renderEconomics(calc, location);
  renderTimeline(calc, location);
  renderNotes(calc, location);
}

function renderBreakdown(calc, location) {
  const breakdown = location.breakdown;
  const unit = location.unit;

  const breakdownRows = (T[currentLang] || T[DEFAULT_LANG]).breakdown.rows;
  const rows = breakdownRows.map((row, index) => ({
    label: row.label,
    value: [breakdown.fabric, breakdown.labor, breakdown.trims, breakdown.packaging, breakdown.logistics + breakdown.duty][index],
    color: ["var(--clay)", "var(--ink)", "var(--mustard)", "var(--sage)", "var(--taupe)"][index]
  }));

  breakdownPanel.innerHTML = `
    <div class="panel-head">
      <div>
        <span class="panel-kicker">${t("breakdown.kicker")}</span>
        <h3>${escapeHTML(locationLabel(location.key))}</h3>
      </div>
      <span class="panel-tag">${t("breakdown.tag").replace("{quantity}", fmt.num0.format(calc.quantity))}</span>
    </div>
    <div class="stack-bar" aria-hidden="true">
      ${rows
        .map(
          (row) =>
            `<span style="width:${(row.value / unit) * 100}%;background:${row.color}"></span>`
        )
        .join("")}
    </div>
    <div class="cost-list">
      ${rows
        .map(
          (row) => `
            <div class="cost-row">
              <div class="cost-row-top">
                <span class="cost-label"><i class="cost-dot" style="background:${row.color}"></i>${escapeHTML(row.label)}</span>
                <span class="cost-value">${eur(row.value, true)}</span>
              </div>
              <div class="cost-bar"><span style="width:${(row.value / unit) * 100}%;background:${row.color}"></span></div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="cost-foot">
      <div>
        <span>${t("breakdown.costoPezzo")}</span>
        <strong>${eur(unit, true)}</strong>
        <small>${t("breakdown.produzione")}: ${eur(location.productionTotal)}</small>
      </div>
      <div class="cost-foot-right">
        <span>${t("breakdown.investimento")}</span>
        <strong>${eur(location.total)}</strong>
        <small>${t("breakdown.sviluppo")}</small>
      </div>
    </div>
  `;
}

function renderEconomics(calc, location) {
  const retail = calc.retailKnown ? calc.retail : suggestedRetail(location.unit);
  const netRevenue = retail / 1.22;
  const margin = (netRevenue - location.unit) / netRevenue;
  const suggested = suggestedRetail(location.unit);

  const marginPercent = margin * 100;
  const marginClass = margin < 0.45 ? "low" : margin < 0.55 ? "mid" : "";

  // Pezzi da vendere perché i ricavi netti coprano l'investimento totale (produzione + sviluppo)
  const breakEven =
    netRevenue > location.unit
      ? `${fmt.num0.format(Math.ceil(location.total / netRevenue))} ${t("summary.pezzi")}`
      : "—";

  const budgetGap = state.budget - location.total;

  economicsPanel.innerHTML = `
    <div class="panel-head">
      <div>
        <span class="panel-kicker">${t("economics.kicker")}</span>
        <h3>${t("economics.heading")}</h3>
      </div>
      <span class="panel-tag">${t("economics.tag")}</span>
    </div>
    <div class="econ-hero">
      <span>${t("economics.prezzoConsigliato")}</span>
      <strong>${eur(suggested)}</strong>
      <small>${t("economics.prezzoSmall")}</small>
    </div>
    <div class="margin-block">
      <div class="margin-top">
        <span>${calc.retailKnown ? t("economics.margineTuo").replace("{retail}", eur(retail)) : t("economics.margineStimato")}</span>
        <strong>${pct(margin)}</strong>
      </div>
      <div class="margin-track">
        <span class="margin-fill ${marginClass}" style="width:${clamp(marginPercent, 0, 100)}%"></span>
        <span class="margin-target" title="${t("economics.target")}"></span>
      </div>
      <p class="margin-note">${calc.retailKnown ? t("economics.margineNoteTuo") : t("economics.margineNoteStimato")}</p>
    </div>
    <div class="econ-grid">
      <div class="econ-stat">
        <span>${t("economics.investimento")}</span>
        <strong>${eur(location.total)}</strong>
        <small>${t("economics.sviluppo").replace("{setup}", eur(location.setup))}</small>
      </div>
      <div class="econ-stat">
        <span>${t("economics.breakEven")}</span>
        <strong>${breakEven}</strong>
        <small>${netRevenue > location.unit ? t("economics.rientrare") : t("economics.nonCopre")}</small>
      </div>
      <div class="econ-stat">
        <span>${t("economics.budget")}</span>
        <strong>${eur(state.budget)}</strong>
        <small class="${budgetGap >= 0 ? "ok" : "warn"}">${budgetGap >= 0 ? `+ ${eur(budgetGap)} ${t("economics.disponibili")}` : `${t("economics.mancano")} ${eur(-budgetGap)}`}</small>
      </div>
      <div class="econ-stat">
        <span>${t("economics.ricavoNetto")}</span>
        <strong>${eur(netRevenue, true)}</strong>
        <small>${t("economics.iva")}</small>
      </div>
    </div>
  `;
}

function renderTimeline(calc, location) {
  const timeline = buildTimeline(location);

  timelinePanel.innerHTML = `
    <div class="panel-head">
      <div>
        <span class="panel-kicker">${t("timeline.kicker")}</span>
        <h3>${t("timeline.heading")}</h3>
      </div>
      <span class="panel-tag">${escapeHTML(locationLabel(location.key))}</span>
    </div>
    <ol class="timeline">
      ${timeline.phases
        .map(
          (phase, index) => `
            <li>
              <span class="timeline-dot" aria-hidden="true"></span>
              <span class="timeline-copy">
                <strong>${escapeHTML(phase.name)}</strong>
                <small>${escapeHTML(phase.description)}</small>
              </span>
              <span class="timeline-weeks">${weekRange(phase.weeks)}</span>
            </li>
          `
        )
        .join("")}
    </ol>
    <div class="timeline-total">
      <span>${t("timeline.totale")}</span>
      <strong>${totalWeeks(timeline.min, timeline.max)}</strong>
    </div>
  `;
}

function renderNotes(calc, location) {
  const locName = locationLabel(location.key);
  const notes = [];
  const gap = state.budget - location.total;
  const retail = calc.retailKnown ? calc.retail : suggestedRetail(location.unit);
  const netRevenue = retail / 1.22;
  const margin = (netRevenue - location.unit) / netRevenue;
  const qtyStr = fmt.num0.format(calc.quantity);
  const moqStr = fmt.num0.format(location.moq);
  const marginStr = pct(margin);
  const retailStr = eur(retail);
  const gapStr = eur(Math.abs(gap));
  const budgetStr = eur(state.budget);

  if (gap < 0) {
    notes.push(
      `<strong>${t("notes.budgetIntegrare")}</strong> ${t("notes.budgetIntegrareRest").replace("{budget}", budgetStr).replace("{gap}", gapStr).replace("{location}", locName)}`
    );
  } else {
    notes.push(
      `<strong>${t("notes.budgetCoperto")}</strong> ${t("notes.budgetCopertoRest").replace("{gap}", gapStr)}`
    );
  }

  if (location.belowMoq) {
    notes.push(
      `<strong>${t("notes.moq")}</strong> ${t("notes.moqRest").replace("{location}", locName).replace("{moq}", moqStr).replace("{quantity}", qtyStr)}`
    );
  }

  if (margin < 0.45) {
    notes.push(
      `<strong>${t("notes.marginLow")}</strong> ${t("notes.marginLowRest").replace("{retail}", retailStr).replace("{margin}", marginStr)}`
    );
  } else if (margin >= 0.6) {
    notes.push(
      `<strong>${t("notes.marginSolid")}</strong> ${t("notes.marginSolidRest").replace("{retail}", retailStr).replace("{margin}", marginStr)}`
    );
  }

  if (state.stage === "idea" || state.stage === "disegno") {
    notes.push(
      `<strong>${t("notes.campionatura")}</strong> ${t("notes.campionaturaRest")}`
    );
  }

  if (state.recycled) {
    notes.push(
      `<strong>${t("notes.recycled")}</strong> ${t("notes.recycledRest")}`
    );
  }

  if (calc.complexity.factor > 1.2) {
    notes.push(
      `<strong>${t("notes.complesso")}</strong> ${t("notes.complessoRest")}`
    );
  }

  if (location.key === "asia") {
    notes.push(
      `<strong>${t("notes.asia")}</strong> ${t("notes.asiaRest")}`
    );
  } else if (location.key === "italia" && !location.belowMoq) {
    notes.push(
      `<strong>${t("notes.italia")}</strong> ${t("notes.italiaRest")}`
    );
  }

  if (!calc.retailKnown) {
    notes.push(
      `<strong>${t("notes.prezzoDaDefinire")}</strong> ${t("notes.prezzoDaDefinireRest")}`
    );
  }

  notesPanel.innerHTML = `
    <div class="panel-head">
      <div>
        <span class="panel-kicker">${t("notes.kicker")}</span>
        <h3>${t("notes.heading")}</h3>
      </div>
      <span class="panel-tag">${Math.min(notes.length, 5)} ${t("notes.tag")}</span>
    </div>
    <ol class="notes">
      ${notes
        .slice(0, 5)
        .map(
          (note, index) => `
            <li>
              <span class="notes-index">${String(index + 1).padStart(2, "0")}</span>
              <p>${note}</p>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function animateRing(score) {
  const ring = verdictCard.querySelector(".ring-fg");
  if (!ring) return;

  const circumference = 2 * Math.PI * 70;
  ring.style.strokeDasharray = String(circumference);
  ring.style.strokeDashoffset = String(circumference);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = String(circumference * (1 - score / 100));
    });
  });
}

/* ---------- Eventi ---------- */

startBtn.addEventListener("click", openWizard);

brandLink.addEventListener("click", (event) => {
  event.preventDefault();
  showIntro();
});

wizardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  readStateFromForm();
  saveState();

  if (!validateStep(currentStep)) return;

  if (currentStep < 3) {
    goToStep(currentStep + 1);
    return;
  }

  nextBtn.disabled = true;
  nextBtn.textContent = t("nav.calculating");

  window.setTimeout(() => {
    try {
      renderResults();
      wizard.hidden = true;
      results.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    } finally {
      nextBtn.disabled = false;
      updateNavLabels();
    }
  }, 550);
});

backBtn.addEventListener("click", () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

stepsList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-indicator]");
  if (!item) return;
  const target = Number(item.dataset.indicator);
  if (target < currentStep) goToStep(target);
});

wizardForm.addEventListener("input", (event) => {
  if (event.target === quantityRange) {
    quantityInput.value = quantityRange.value;
  }

  readStateFromForm();

  if (event.target === quantityInput) {
    const value = Number(quantityInput.value);
    if (value >= Number(quantityRange.min) && value <= Number(quantityRange.max)) {
      quantityRange.value = value;
    }
  }

  updateCharCount();
  updateRangeVisual();
  updateRetailDisabled();

  if (event.target.closest(".field")) {
    const field = event.target.closest(".field");
    field.classList.remove("invalid");
    const error = field.querySelector(".field-error");
    if (error) error.textContent = "";
  }

  saveState();
});

wizardForm.addEventListener("change", () => {
  readStateFromForm();
  updateRetailDisabled();
  saveState();
});

editBtn.addEventListener("click", openWizard);
editBtnBottom.addEventListener("click", openWizard);
printBtn.addEventListener("click", handlePrint);
restartBtn.addEventListener("click", resetAll);

emailConfirmBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  if (!isValidEmail(email)) {
    setEmailError(t("email.invalid"));
    emailInput.focus();
    return;
  }
  state.email = email;
  saveState();
  closeEmailModal();
  window.print();
});

emailCancelBtn.addEventListener("click", closeEmailModal);
emailModalBackdrop.addEventListener("click", closeEmailModal);
emailInput.addEventListener("input", () => setEmailError(""));

emailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    emailConfirmBtn.click();
  }
});

document.addEventListener("keydown", (event) => {
  if (emailModal.hidden) return;

  if (event.key === "Escape") {
    closeEmailModal();
    return;
  }

  if (event.key === "Tab") {
    const focusable = emailModal.querySelectorAll("input, button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

langSelect.addEventListener("change", (event) => {
  setLang(event.target.value);
});

locGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-loc]");
  if (!card || !currentCalc) return;

  selectedLocationKey = card.dataset.loc;

  locGrid.querySelectorAll(".loc-card").forEach((item) => {
    const isSelected = item.dataset.loc === selectedLocationKey;
    item.classList.toggle("selected", isSelected);
    item.setAttribute("aria-pressed", String(isSelected));
  });

  renderPanels(currentCalc);
});

/* ---------- Avvio ---------- */

loadLang();
loadState();
syncFormFromState();
