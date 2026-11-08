# Criteri di sicurezza

## Versioni supportate

| Versione | Supportata |
|----------|------------|
| Ultima release (`main`) | ✅ Sì |
| Versioni precedenti | ❌ No |

Questa web app è un'applicazione statica (solo HTML, CSS e JavaScript lato client) e non ha versioni multiple attive. Si consiglia di utilizzare sempre l'ultima versione disponibile nel repository.

---

## Segnalazione di una vulnerabilità

Se scopri una vulnerabilità di sicurezza in UnSecret, segnalacela privatamente prima di renderla pubblica.

### Come segnalare

Invia un'email a: **security@unsecret.it** (o apri una issue privata su GitHub se disponibile).

Nella segnalazione includi:
1. Una descrizione chiara del problema
2. I passi per riprodurre la vulnerabilità
3. L'impatto potenziale
4. Eventuali suggerimenti per la risoluzione

### Cosa aspettarti

- Riceverai una conferma di ricezione entro **7 giorni lavorativi**
- Ti informeremo sullo stato dell'indagine e sulle tempistiche di risoluzione
- Ti chiederemo di non divulgare pubblicamente la vulnerabilità fino alla risoluzione e al coordinamento con noi

---

## Note di sicurezza specifiche dell'applicazione

UnSecret è un'applicazione **statica e lato client**:

- Non invia a server esterni i dati inseriti nel modulo: tutti i calcoli avvengono nel browser dell'utente
- Non memorizza dati personali su server remoti
- Le risposte dell'utente possono essere salvate nel browser tramite `localStorage` (solo sul dispositivo locale)
- Non raccoglie, non trasmette e non condivide indirizzi email né altri dati personali (l'email richiesta prima della stampa/PDF è usata solo localmente e non inviata ad alcun server)
- Non utilizza cookie di tracciamento, strumenti di analisi o pubblicità
- Unica risorsa di terze parti: i font (Fraunces e Inter) sono caricati da Google Fonts, quindi il browser contatta i server di Google, che possono vedere l'indirizzo IP del visitatore

### Raccomandazioni per l'uso

- Non inserire dati sensibili o riservati nei campi del modulo (descrizione, budget, prezzo, ecc.)
- Se utilizzi un computer condiviso, cancella i dati di navigazione o usa la navigazione in incognito
- L'email richiesta per la stampa/PDF è memorizzata solo nel `localStorage` del tuo browser e non viene trasmessa a nessuno

---

## Ringraziamenti

Ringraziamo chiunque contribuisca a rendere UnSecret più sicuro con segnalazioni responsabili.
