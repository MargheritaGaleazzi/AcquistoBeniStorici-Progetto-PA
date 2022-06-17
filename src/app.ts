import express,{Application} from 'express';
import * as Controller from './controller';


const applicazione:Application = express();
const PORT = 8080;

applicazione.get('/', function (req:any,res:any) {
    res.send('L\'applicazione è stata avviata correttamente')
});

/*
 * Rotta per la visualizzazione della lista dei beni
 */

applicazione.get('/ListaBeni', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.listaBeni(req.body.tipo,req.body.anno, res);
});

applicazione.get('/Lista', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.lista(res);
});

/*
 * Rotta per acquistare un bene
 */

applicazione.post('/AcquistaBene', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.acquistaBene(req.body.id_bene,req.body.formato,req.body.cons, res);
});

/*
 * Rotta per scaricare un bene acquistato
 */
/*
applicazione.get('/ScaricaBene', /*aggiungi middleware, function (req: any, res: any) {    
    Controller.scaricaBene(req.body, res);
});*/

/*
 * Rotta per richiedere un nuovo link per un bene già scaricato
 */

applicazione.post('/NuovoLink', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.nuovoLink(req.body.id,req.body.formato,req.body.cons, res);
});

/*
 * Rotta per la visualizzazione di tutti gli acquisti
 */

applicazione.get('/VediAcquisti', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.vediAcquisti(req.body, res);
});

/*
 * Rotta per effettuare acquisti multipli
 */

applicazione.post('/AcquistaMultiplo', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.acquistaMultiplo(req.body, res);
});

/*
 * Rotta per la effettuare un regalo ad un amico
 */

applicazione.post('/Regalo', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.regalo(req.body, res);
});

/*
 * Rotta per la visualizzazione dei crediti rimasti
 */

applicazione.get('/VisualizzaCredito', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.visualizzaCredito(req.body, res);
});

/*
 * Rotta per la ricaricare i crediti
 */

applicazione.post('/Ricarica', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.ricarica(req.body, res);
});

/*
 * Se si richiamano rotte non esistenti:
 */
applicazione.get('*',);
applicazione.post('*',);

applicazione.listen(PORT,()=>{
    console.log('Il server è in ascolto sulla porta'+PORT.toString())
});
