# Alimentazione Animali :paw_prints:  (Progetto PA)
## Descrizione del progetto
Il progetto consiste in un sistema che consenta di gestire il processo di alimentazione di animali all’interno di una stalla.

In particolare si vuole gestire un workflow  secondo il quale l’operatore effettui delle operazioni nella giusta sequenza caricando le quantità desiderate di alcuni alimenti, come se seguisse una "ricetta".
 
In sostanza il sistema deve dare la possibilità di creare un “ordine” con una precisa “ricetta” che poi verrà messo in esecuzione da un operatore che provvederà a prelevare nelle giuste quantità e nel giusto ordine i vari alimenti per soddisfare la ricetta richiesta.
 
## Funzioni del sistema
<table align="center">
    <thead>
        <tr>
            <th>Ruolo</th>
            <th>Funzioni</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=4>user</td>
            <td>Creazione ordine</td>
        </tr>
        <tr>
            <td>Verificare lo stato di un ordine</td>
        </tr>
        <tr>
            <td>Aggiornare la quantità disponibile in magazzino di un alimento</td>
        </tr>
                <tr>
            <td>Interrogare la disponibilità del magazzino </td>
        </tr>
        <tr>
            <td rowspan=2>admin</td>
            <td>Creazione ricetta</td>
        </tr>
        <tr>
            <td>Verificare lo stato di un ordine</td>
        </tr>
    </tbody>
</table>


Ogni funzione è associata ad una diversa richiesta HTTP (POST o GET), per le quali è prevista un'autenticazione tramite token JWT.

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
         <td> POST </td>
         <td> /CreaOrdine </td>
        </tr>
         <tr>
         <td> GET </td>
         <td> /VerificaStato </td>
        </tr>
         <tr>
         <td> POST </td>
         <td> /AggiornaMagazzino </td>
        </tr>
         <tr>
         <td> GET </td>
         <td> /InterrogaMagazzino </td>
        </tr>
         <tr>
         <td> POST </td>
         <td> /CreaRicetta </td>
        </tr>
    </tbody>
 </table>
 
### Creazione di un nuovo ordine (CreaOrdine)
Mediante l'utilizzo di questa rotta si può creare un nuovo ordine. Questa rotta può essere richiamata solamente dagli utenti con ruolo user.

Per creare un nuovo ordine si deve specificare, partendo da una ricetta, la massa totale.

Se la disponibilità degli alimenti è inferiore a quella richiesta per il soddisfacimento dell'ordine si incorre in un errore e l'ordine viene rifiutato.

### Verifica dello stato di un ordine (VerificaStato)
Mediante l'utilizzo di questa rotta si può verificare lo stato di un ordine. Questa rotta può essere richiamata sia dall'utente admin che dagli utenti user.

Lo stato dell'ordine può essere visualizzato solamente dallo user che lo ha effettuato a dall'admin.

I possibili stati sono 4:
1. CREATO;
2. FALLITO;
3. IN ESECUZIONE (L’ordine creato passa nello stato IN ESECUZIONE nel momento in cui si riceve l’evento “preso in carico ordine Z”);
4. COMPLETATO.

### Aggiorna le disponibilità di magazzino (AggiornaMagazzino)
Mediante l'utilizzo di questa rotta si può aggiornare la quantità disponibile di un dato prodotto. Questa rotta può essere richiamata solamente dagli utenti con ruolo user.

### Interroga le disponibilità di magazzino (InterrogaMagazzino)
Mediante l'utilizzo di questa rotta si può interrogare la quantità disponibile in magazzino, filtrando per alimento (tutti, uno, alcuni). Questa rotta può essere richiamata solamente dagli utenti con ruolo user.

### Creazione di una ricetta (CreaRicetta)
Mediante l'utilizzo di questa rotta si può creare una nuova ricetta. Questa rotta può essere richiamata solamente solamente dall'admin.

Per creare una nuova ricetta si deve specificare una lista di alimenti, l'ordine di esecuzione, e la quantità di ciascun alimento espressa in %.

Se gli alimenti non sono presenti nel DB, se la somma di essi non è pari al 100% o se un alimento è presente più volte si incorre in un errore.

## Diagrammi UML
### Use case
<p align="center">
  <img width="1020" src="https://github.com/MargheritaGaleazzi/Alimentazione-Animali--Progetto-PA/blob/main/img/UseCase.jpg">
</p>

## Pattern utilizzati
### Middleware

### Singleton
Il singleton è un design pattern creazionale che ha lo scopo di garantire che di una determinata classe venga creata una e una sola istanza, e di fornire un punto di accesso globale a tale istanza. Nel nostro progetto lo utilizziamo per effettuare la coneesione al database, in maniera tale che di essa vi sia una sola istanza così da non consumare iutilmente risorse computazionali.

### Observer
Il pattern Observer (noto anche col nome Publish-Subscribe) permette di definire una dipendenza uno a molti fra oggetti, in modo tale che se un oggetto cambia il suo stato interno, ciascuno degli oggetti dipendenti da esso viene notificato e aggiornato automaticamente. Ovvero l'Observer trova applicazione nei casi in cui diversi oggetti (**Observer**) devono conoscere lo stato di un oggetto (**Subject**).

## Come avviare il progetto

## Testing

## Autori
:woman_technologist: [Chiara Amalia Caporusso](https://github.com/ChiaraAmalia) 

:woman_technologist: [Margherita Galeazzi](https://github.com/MargheritaGaleazzi)
