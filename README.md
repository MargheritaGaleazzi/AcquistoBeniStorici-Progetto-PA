# Alimentazione Animali :paw_prints:  (Progetto PA)
## Descrizione del progetto
Il progetto consiste in un sistema che consenta di gestire il processo di alimentazione di animali all’interno di una stalla.

 In particolare si vuole gestire un workflow  secondo il quale l’operatore effettui delle operazioni nella giusta sequenza caricando le quantità desiderate di alcuni alimenti, come se seguisse una "ricetta".
 
## Funzioni del sistema
<p align="center">
<table>
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
</p>

Ogni funzione è associata ad una diversa richiesta HTTP (POST o GET), per le quali è prevista un'autenticazione tramite token JWT.

## Rotte
La seguente tabella mostra le richieste possibili:










## Diagrammi UML
### Use case
<p align="center">
  <img width="1020" src="https://github.com/MargheritaGaleazzi/Alimentazione-Animali--Progetto-PA/blob/main/img/UseCase.jpg">
</p>

## Pattern utilizzati
### Middleware

## Come avviare il progetto

## Testing

## Autori
:woman_technologist: [Chiara Amalia Caporusso](https://github.com/ChiaraAmalia) 

:woman_technologist: [Margherita Galeazzi](https://github.com/MargheritaGaleazzi)
