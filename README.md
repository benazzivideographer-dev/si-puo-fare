# Il tuo capo si può fare?

Web app di analisi di fattibilità per un capo di abbigliamento. Rispondi a poche domande sulla tua idea e ricevi una stima di costi, tempi e sostenibilità economica per produrla in **Italia**, in **extra Europa** o in **Asia**.

## Come aprirla

Non servono build, dipendenze o installazioni.

**Opzione 1 — doppio clic**

Apri `index.html` nel browser.

**Opzione 2 — server locale**

```bash
cd UnSecret
python3 -m http.server 4173
```

Poi vai su <http://localhost:4173>.

## Cosa fa

- Wizard in 3 passaggi: idea, materiali, numeri.
- Interfaccia in 5 lingue: italiano, inglese, francese, spagnolo e cinese semplificato.
- Stima del costo per pezzo, con dettaglio delle voci (tessuto, manodopera, finiture, packaging, logistica e dazi).
- Confronto tra tre scenari produttivi: Italia, extra Europa, Asia.
- Destinazione consigliata in base a quantità, budget, prezzo e posizionamento.
- Punteggio di fattibilità da 0 a 100.
- Prezzo di vendita consigliato, margine lordo e break-even.
- Tempi stimati per sviluppo, campionatura, produzione e logistica.
- Note operative su MOQ, budget, materiali riciclati e rischi.
- Stampa / salvataggio in PDF (richiede un indirizzo email, conservato solo nel browser).
- Salvataggio automatico delle risposte nel browser (`localStorage`).

## Modello di calcolo

Le stime sono costruite su range indicativi di mercato:

- costo manodopera e tessuto per tipologia di capo;
- moltiplicatori per materiale, complessità e quantità;
- costi di sviluppo e campionatura in base alla fase in cui ti trovi;
- costi di logistica e dazi per destinazione;
- MOQ indicativi per scenario;
- prezzo consigliato a circa 4,2× il costo per pezzo, IVA inclusa;
- margine lordo calcolato sul ricavo netto (IVA 22% scorporata).

Il punteggio di fattibilità combina budget, rispetto del minimo d'ordine, margine, stato di avanzamento e rischio del modello. I casi critici (margine negativo, quantità sotto il minimo, budget molto distante) applicano un tetto al punteggio.

## File

- `index.html` — struttura e contenuti
- `styles.css` — layout, stile e stampa
- `app.js` — dati, calcoli, wizard e rendering dei risultati
- `favicon.svg` — icona

## Nota

Le stime si basano su range di mercato indicativi e **non sostituiscono un preventivo**. I prezzi reali dipendono dal fornitore, dal tessuto scelto e dal momento.
