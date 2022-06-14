import * as Controller from './controller';
import * as express from 'express';

const applicazione = express();

/*
 * Rotta per la creazione di un ordine
 */

applicazione.post('/CreaOrdine'), /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.creaOrdine(req.body, res);
});

/*
 * Rotta per verificare lo stato di un ordine
 */

applicazione.get('/VerificaStato'), /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.verificaStato(req.body.utente, res);
});

/*
 * Rotta per l'aggiornamento del magazzino
 */

applicazione.post('/AggiornaMagazzino'), /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.aggiornaMagazzino(req.body.alimento, res);
});

/*
 * Rotta per interrogare il magazzino
 */

applicazione.get('/InterrogaMagazzino'), /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.intertogaMagazzino(req.body, res);
});

/*
 * Rotta per la creazione di una ricetta
 */

applicazione.post('/CreaRicetta'), /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.creaRicetta(req.body, res);
});

/*
 * Se si richiamano rotte non esistenti:
 */
applicazione.get('*',);
applicazione.post('*',);

applicazione.listen(/*aggiungere numero porta*/);