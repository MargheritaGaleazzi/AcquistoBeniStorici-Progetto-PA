# Alimentazione Animali :paw_prints:  (Progetto PA)
## Descrizione del progetto
Il progetto consiste in un sistema che consenta di gestire il processo di alimentazione di animali all’interno di una stalla.

 In particolare si vuole gestire un workflow  secondo il quale l’operatore effettui delle operazioni nella giusta sequenza caricando le quantità desiderate di alcuni alimenti, come se seguisse una "ricetta".
 
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

### Verifica dello stato di un ordine (VerificaStato)
Mediante l'utilizzo di questa rotta si può verificare lo stato di un ordine. Questa rotta può essere richiamata sia dall'utente admin che dagli utenti user.

### Aggiorna le disponibilità di magazzino (AggiornaMagazzino)
Mediante l'utilizzo di questa rotta si può aggiornare la quantità disponibile di un dato prodotto. Questa rotta può essere richiamata solamente dagli utenti con ruolo user.

### Interroga le disponibilità di magazzino (InterrogaMagazzino)
Mediante l'utilizzo di questa rotta si può interrogare la quantità disponibile in magazzino, filtrando per alimento (tutti, uno, alcuni). Questa rotta può essere richiamata solamente dagli utenti con ruolo user.

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
