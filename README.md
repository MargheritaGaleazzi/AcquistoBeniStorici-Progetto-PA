# Acquisto beni di interesse storico :framed_picture:	⛲  (Progetto PA)
## Descrizione del progetto
Il progetto consiste in un sistema che consenta di gestire l’acquisto di un prodotto digitale sotto forma di immagine relativo ad acquisizioni di bene di interesse storico (es. manoscritto, cartografia storica; ogni documento è caratterizzato da un preciso anno).
 
Ogni bene ha associato un costo in termini di token.
 
## Funzioni del sistema
<table align="center">
    <thead>
        <tr>
            <th>Token</th>
            <th>Funzioni</th>
            <th>Ruolo</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>senza token</td>
            <td>Ottenere la lista dei beni disponibili (per tipologia o per anno)</td>
         <td>general</td>
        </tr>
        <tr>
            <td rowspan=7>con token</td>
            <td>Effettuare l’acquisto di uno specifico bene </td>
         <td>user</td>
        </tr>
        <tr>
            <td>Scaricare il bene acquistato</td>
         <td>user</td>
        </tr>
     <tr>
            <td>Visualizzare l’elenco degli acquisti effettuati</td>
      <td>user</td>
        </tr>
          <tr>
            <td>Effettuare acquisti multipli</td>
           <td>user</td>
        </tr>
          <tr>
            <td>Fare un regalo ad un amico</td>
           <td>user</td>
        </tr>
          <tr>
            <td>Visualizzare il credito</td>
           <td>user</td>
        </tr>
          <tr>
            <td>Ricaricare i crediti</td>
           <td>admin</td>
        </tr>
    </tbody>
</table>


Ogni funzione è associata ad una diversa richiesta HTTP (POST o GET), per aclcune delle quali è prevista un'autenticazione tramite token JWT.

## Rotte
La seguente tabella mostra le richieste possibili:

<table align="center">
    <thead>
        <tr>
            <th>Tipo</th>
            <th>Rotta</th>
        </tr>
    </thead>
    <tbody>
        <tr>
         <td> GET </td>
         <td> /ListaBeni </td>
        </tr>
         <tr>
         <td> POST </td>
         <td> /AcquistaBene </td>
        </tr>
         <tr>
         <td> GET </td>
         <td> /ScaricaBene </td>
        </tr>
        <tr>
         <td> POST </td>
         <td> /NuovoLink </td>
        </tr>
         <tr>
         <td> GET </td>
         <td> /VediAcquisti </td>
        </tr>
         <tr>
         <td> POST </td>
         <td> /AcquistaMultiplo </td>
        </tr>
        <tr>
         <td> POST </td>
         <td> /Regalo </td>
        </tr>
        <tr>
         <td> GET </td>
         <td> /VisualizzaCredito </td>
        </tr>
        <tr>
         <td> POST </td>
         <td> /Ricarica </td>
        </tr>
    </tbody>
 </table>
 
### Visualizzazione dei beni (ListaBeni)
Mediante l'utilizzo di questa rotta si può visualizzare la lista di tutti i beni presenti. Questa rotta può essere richiamata da chiunque.

I filtri possono andare in AND, e si può filtrare per:
 - tipologia (manoscritti, cartografie storiche);
 - anno (relativo al bene di interesse storico).

### Effettuare l'acquisto di uno specifico bene (AcquistaBene)
Mediante l'utilizzo di questa rotta si può acquistare un bene, specificandone l'id. Questa rotta può essere richiamata dall'utente autenticato, con il ruolo di user.

Se il credito è sufficiente viene restituito il bene sotto forma di immagine.

Nella richiesta deve essere specificato il formato di uscita, che può essere:
1. **Jpg**;
2. **Tiff**;
3. **Png**.

### Scaricare il bene acquistato (ScaricaBene)
Mediante l'utilizzo di questa rotta si può scaricare il bene acquistato se il pagamento è effettuato con successo. Questa rotta può essere richiamata solamente dagli utenti autenticati con ruolo user.

Nota che il bene acquistato può essere scaricato solamente 1 volta; le richieste successive verranno rifiutate.

### Richiedi nuovo link (NuovoLink)
Mediante l'utilizzo di questa rotta si può richiedere un nuovo link per un bene già scaricato. Il costo di questa operazione è di 1 token. Questa rotta può essere richiamata solamente dagli utenti autenticati, con ruolo user.

### Visualizzazione dei beni acquistati (VediAcquisti)
Mediante l'utilizzo di questa rotta si può visualizzare l’elenco degli acquisti effettuati per ogni utente. 
Gli acquisti saranno divisi per tipologia (download originale vs downloads aggiuntivi).

Questa rotta può essere richiamata solamente dall'utente autenticato.

### Effettuare un acquisto multiplo (AcquistaMultiplo)
Mediante l'utilizzo di questa rotta si possono effettuare acquisti multipli. L'output sarà in questo caso uno zip.
Questa rotta può essere richiamata solamente dagli utenti autenticati, con ruolo user.

### Fare un regalo ad un amico (Regalo)
Mediante l'utilizzo di questa rotta si ha a possibilità di effettuare un regalo ad un “amico”, fornendo il suo indirizzo mail.
Questa rotta può essere richiamata solamente dagli utenti autenticati, con ruolo user.

### Visualizzare il credito (VisualizzaCredito)
Mediante l'utilizzo di questa rotta si può visualizzare  il credito residuo di un utente.
Questa rotta può essere richiamata solamente dagli utenti autenticati, con ruolo user.

### Effettuare la ricarica dei crediti (Ricarica)
Mediante l'utilizzo di questa rotta si può ricaricare  il credito di un utente.
Questa rotta può essere richiamata solamente dagli utenti autenticati, con ruolo admin.

## Diagrammi UML
### Use case
<p align="center">
  <img width="1020" src="https://github.com/MargheritaGaleazzi/AcquistoBeniStorici-Progetto-PA/blob/main/img_doc/UseCase.jpg">
</p>

### Sequence Diagram

#### Visualizzazione dei beni (ListaBeni)

```mermaid
sequenceDiagram
autonumber
client ->> app: /ListaBeni
app ->>+ CoR: FiltroTipoAnno
CoR ->>+ middleware: verificaContentType()
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloValoriFiltro()
middleware ->>- CoR:  next()
CoR ->>- app : next()
app ->>+ controller: listaBeni()
controller ->>+ model : Bene.findAll()
model ->>- controller : result: bene
controller ->>+ factory : getMsg().getMsg()
factory ->>- controller: obj:ListaBeni
controller ->>- client:  risp.status().json()
```

#### Visualizzazione dei beni senza filtri (Lista)

```mermaid
sequenceDiagram
autonumber
client ->> app: /Lista
app ->>+ controller: lista()
controller ->>+ model : Bene.findAll()
model ->>- controller : result: bene
controller ->>+ factory : getMsg().getMsg()
factory ->>- controller: obj:ListaBeni
controller ->>- client:  risp.status().json()
```

#### Effettuare l'acquisto di uno specifico bene (AcquistaBene)

```mermaid
sequenceDiagram
autonumber
client ->> app: /AcquistaBene
app ->>+ CoR: JWT
CoR ->>+ middleware: controlloPresenzaToken()
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloChiaveSegreta()
middleware ->>- CoR:  next()
CoR ->>- app : next()
app ->>+ CoR: AcquistoBene
CoR ->>+ middleware: controlloPresenzaUser()
middleware ->> middleware: controlloPresenza()
middleware ->>+ model: Utente.findAll()
model ->>- middleware: result: utente
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloTokenNullo()
middleware ->>+ model: Utente.findByPk()
model ->>- middleware: result: utente
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloValoriAcquistoBene()
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloCredito()
middleware ->>+ model: Utente.findByPk()
model ->>- middleware: result: utente
middleware ->>+ model: Bene.findByPk()
model ->>- middleware: result: bene
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloFormatoImmagine()
middleware ->>- CoR:  next()
CoR ->>- app : next()
app ->>+ controller: acquistaBene()
controller ->>+ model : Acquisto.create()
model ->>- controller : result: acquisto
controller ->>+ model : Bene.findByPk()
model ->>- controller : result: bene
controller ->>+ model : Utente.decrement()
controller ->>+ factory : getMsg().getMsg()
factory ->>- controller: obj:AcquistaBene
controller ->>- client:  risp.status().json()
```

#### Effettuare il download di un bene acquistato (/download)

```mermaid
sequenceDiagram
autonumber
client ->> app: /download
app ->>+ CoR: ControlloDownload
CoR ->>+ middleware: controlloDownload()
middleware ->>+ model: Acquito.findByPk()
model ->>- middleware: result: risultato
middleware ->>- CoR:  next()
CoR ->>- app : next()
app ->>+ controller: download()
controller ->>+ utility: selFormato()
utility ->>- controller: result: formato
controller ->>+ utility: filigrana()
utility ->>- controller: result: immagine
controller ->>+ model : Acquisto.findByPk()
model ->>- controller : result: acquisto
controller ->>- client:  risp.end()
```

#### Effettuare la ricarica dei crediti (Ricarica)

```mermaid
sequenceDiagram
autonumber
client ->> app: /Ricarica
app ->>+ CoR: JWT
CoR ->>+ middleware: controlloPresenzaToken()
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloChiaveSegreta()
middleware ->>- CoR:  next()
CoR ->>- app : next()
app ->>+ CoR: Admin
CoR ->>+ middleware: controlloValoriRicarica()
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloPresenzaUser()
middleware ->> middleware: controlloPresenza()
middleware ->>+ model: Utente.findAll()
model ->>- middleware: result: utente
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloPresenzaAdmin()
middleware ->> middleware: controlloPresenza()
middleware ->>+ model: Utente.findAll()
model ->>- middleware: result: utente
middleware ->>- CoR:  next()
CoR ->>+ middleware: controlloAdmin()
middleware ->>+ model: Utente.findByPk()
model ->>- middleware: result: utente
middleware ->>- CoR:  next()
CoR ->>- app : next()
app ->>+ controller: ricarica()
controller ->>+ model : Utente.increment()
controller ->>- client:  risp.status().json()
```

## Pattern utilizzati

### Factory Method
Il factory method  è un pattern di progettazione creazionale che fornisce un’interfaccia per la creazione di og-getti in una superclasse, ma consente alle sottoclassi di modificare il tipo di oggetti che verranno creati.

**DA MODIFICARE** Nel nostro progetto utilizziamo questo pattern quando si creano ordini e/o ricette, in quanto se la creazione va a buon fine verrà segnalato un successo, altrimenti un errore.

### Singleton
Il singleton è un design pattern creazionale che ha lo scopo di garantire che di una determinata classe venga creata una e una sola istanza, e di fornire un punto di accesso globale a tale istanza. 

Nel nostro progetto lo utilizziamo per effettuare la conNesione al database, in maniera tale che di essa vi sia una sola istanza così da non consumare iutilmente risorse computazionali.

### Chain Of Responsability & Middleware
La **catena di responsabilità** è un pattern comportamentale che consente di passare le richie-ste lungo una catena di gestori.
Alla ricezione di una richiesta, ciascun handler decide di elaborare la richiesta o di passarla al successivo hand-ler della catena.

È molto simile ad un decoratore ma a differenza di quest’ultimo, la catena di responsabilità può essere inter-rotta.

La Catena di Responsabilità è formata da degli handler (funzioni o metodi), che hanno lo scopo di verificare se quello che gli viene passato soddisfa o meno dei criteri. Se il criterio è soddisfatto, non si ritorna, come avve-niva nel Proxy, ma si va avanti passando il controllo all’handler successivo.

Le funzioni **middleware** sono funzioni che hanno accesso all'oggetto richiesta (req), all'oggetto risposta (res) e alla successiva funzione middleware nel ciclo richiesta-risposta dell'applicazione.
La funzione middleware successiva è comunemente indicata da una variabile denominata next.

**DA MODIFICARE** Nel progetto utilizziamo la catena di responsabilità insieme al middleware nella creazione di una ricetta, di un ordine e nell'aggiornamento del magazzino, per verificare, prima di creare un nuovo oggetto o di aggiornarlo, che siano rispettati tutti i requisiti.

## Come avviare il progetto

Per eseguire il programma il computer su cui lo si vuole eseguire deve avere installato il programma [GraphicsMagick](http://www.graphicsmagick.org/)

## Testing

## Autori
:woman_technologist: [Chiara Amalia Caporusso](https://github.com/ChiaraAmalia) 

:woman_technologist: [Margherita Galeazzi](https://github.com/MargheritaGaleazzi)
