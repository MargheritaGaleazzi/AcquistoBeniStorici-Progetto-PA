import express,{Application} from 'express';
import * as Controller from './controller';
import { getMsg,MsgEnum } from './Messaggi/messaggi';
import * as Middleware from './Middleware/middlewareChain';
import * as path from 'path';

const applicazione:Application = express();
applicazione.use(express.json());
applicazione.use((err: Error, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError) {
        const new_err = getMsg(MsgEnum.ErrPaylodMalformato).getMsg();
        res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg});
    }
    next();
});
const PORT = 8080;


applicazione.get('/', function (req:any,res:any) {
    res.send('L\'applicazione è stata avviata correttamente')
});

/*
 * Rotta per la visualizzazione della lista dei beni
 */

applicazione.get('/ListaBeni', Middleware.NONJWT, function (req: any, res: any) {    
    req.body.constructor === Object;
    if (Object.keys(req.body).includes('tipo') && !Object.keys(req.body).includes('anno')){
        req.body.anno=null;
    } else if (!Object.keys(req.body).includes('tipo') && Object.keys(req.body).includes('anno')){
        req.body.tipo=null;
    }
    Controller.listaBeni(req.body.tipo,req.body.anno, res);
});

applicazione.get('/Lista', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.lista(res);
});

/*
 * Rotta per acquistare un bene
 */

applicazione.post('/AcquistaBene', /*aggiungi middleware,*/  function (req: any, res: any) {    
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

applicazione.get('/VisualizzaCredito/:email', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.visualizzaCredito(req.params.email, res);
});

/*
 * Rotta per la ricaricare i crediti
 */

applicazione.post('/Ricarica/', /*aggiungi middleware,*/ function (req: any, res: any) {    
    Controller.ricarica(req.body.email,req.body.ricarica, res);
});

/*
 * Se si richiamano rotte non esistenti:
 */
applicazione.get('*',);
applicazione.post('*',);

applicazione.listen(PORT,()=>{
    console.log('Il server è in ascolto sulla porta'+PORT.toString())
});
