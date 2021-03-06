'use strict';
import express,{Application} from 'express';
import * as Controller from './controller';
import { getMsg,MsgEnum } from './Factory/messaggi';
import * as Middleware from './Middleware/middlewareCoR';
import * as path from 'path';
const bodyParser = require('body-parser');

const applicazione:Application = express();
applicazione.use(express.json());
//controlla se il payload risulta essere non formato in maniera corretta
applicazione.use((err: Error, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError) {
        const new_err = getMsg(MsgEnum.ErrPaylodMalformato).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
    next();
});
const PORT = 8080;
const HOST = '0.0.0.0';


/**
 * rotta utilizzata per verificare se l'applicazione è stata avviata in modo corretto
 */
applicazione.get('/', function (req:any,res:any) {
    res.send('L\'applicazione è stata avviata correttamente')
});

/**
 * Rotta per la visualizzazione della lista dei beni che possono essere filtrati per 
 * tipo o per anno
 */
applicazione.get('/ListaBeni', Middleware.FiltroTipoAnno, function (req: any, res: any) {    
    req.body.constructor === Object;
    if (Object.keys(req.body).includes('tipo') && !Object.keys(req.body).includes('anno')){
        req.body.anno=null;
    } else if (!Object.keys(req.body).includes('tipo') && Object.keys(req.body).includes('anno')){
        req.body.tipo=null;
    }
    Controller.listaBeni(req.body.tipo,req.body.anno, res);
});

/**
 * Rotta per la visualizzazione della lista di tutti i beni
 */
applicazione.get('/Lista', function (req: any, res: any) {    
    Controller.lista(res);
});

/*
 * Rotta per acquistare un bene
 */
applicazione.post('/AcquistaBene',Middleware.JWT, Middleware.AcquistoBene,  function (req: any, res: any) {    
    Controller.acquistaBene(req.body.id_bene,req.body.formato,req.body.consumatore, res);
});

/*
 * Rotta per scaricare un bene acquistato
 */
applicazione.get('/download/:bene/:formato/:tipoDownload/:idAcquisto', Middleware.JWT, Middleware.ControlloDownload, bodyParser.raw({ type: ['image/jpeg', 'image/png']}),function (req: any, res: any) {    
    Controller.download(req.params.bene,req.params.formato,req.params.idAcquisto, res);
});

/*
 * Rotta per richiedere un nuovo link per un acquisto già fatto e bene già scaricato
 */
applicazione.post('/NuovoLink', Middleware.JWT, Middleware.NuovoLink, function (req: any, res: any) {    
    Controller.nuovoLink(req.body.id_acquisto, res);
});

/*
 * Rotta per la visualizzazione di tutti gli acquisti
 */
applicazione.get('/VediAcquisti', Middleware.JWT, Middleware.VediAcquisti, function (req: any, res: any) {    
    Controller.vediAcquisti(res);
});

/*
 * Rotta per effettuare acquisti multipli
 */
applicazione.post('/AcquistaMultiplo', Middleware.JWT, Middleware.Multiplo, function (req: any, res: any) {    
    Controller.acquistaMultiplo(req.body.ids,req.body.formato, req.body.consumatore, res);
});

/*
 * Rotta per fare un regalo ad un amico
 */
applicazione.post('/Regalo', Middleware.JWT, Middleware.Regalo, function (req: any, res: any) {    
    Controller.regalo(req.body.email_amico,req.body.formato,req.body.consumatore,req.body.id_bene,res);
});

/*
 * Rotta per la visualizzazione dei crediti rimasti
 */
applicazione.get('/VisualizzaCredito', Middleware.JWT, Middleware.VediCredito, function (req: any, res: any) {    
    Controller.visualizzaCredito(req.body.email, res);
});


/*
 * Rotta per la ricaricare i crediti
 */
applicazione.post('/Ricarica/', Middleware.JWT, Middleware.AdminRicarica, function (req: any, res: any) {    
    Controller.ricarica(req.body.consumatore,req.body.ricarica, res);
});

/*
 * Rotta per aggiungere un nuovo utente
 */
applicazione.post('/AggiungiUtente', Middleware.JWT, Middleware.NuovoUtente, function (req: any, res: any) {    
    Controller.aggiungiUtente(req.body.email,req.body.username,req.body.nome,req.body.cognome, res);
});

/*
 * Se si richiamano rotte non esistenti:
 */
applicazione.get('*',Middleware.RottaSbagliata);
applicazione.post('*',Middleware.RottaSbagliata);

applicazione.listen(PORT, HOST) 
console.log('Il server è in ascolto sulla porta '+PORT.toString())
