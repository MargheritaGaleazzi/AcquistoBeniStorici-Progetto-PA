require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { Identifier, where } from 'sequelize/types';
import { isNullishCoalesce, JsonObjectExpression } from 'typescript';
import { getMsg,MsgEnum } from '../Factory/messaggi';
import { Utente, Bene, Acquisto} from "../models/models";

const resemble = require('resemblejs')
/**
 * Funzione utilizzata per il controllo dei valori che vengono inseriti quando
 * si effettua un filtro per tipo o anno
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloValoriFiltro(req: any, res: any, next: any) : void {
    if ((typeof req.body.tipo == 'string' && 
        typeof req.body.anno == 'number') || (typeof req.body.tipo == 'string' && 
        req.body.anno == null) || (req.body.tipo == null && 
        typeof req.body.anno == 'number')) {
        next();
        }
    else if (!req.body.risultato) {
        const new_err = getMsg(MsgEnum.ErrInserimentoFiltriValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che consente di controllare se il filtraggio relativo al tipo risulta essere presente
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloTipo(req: any, res: any, next: any) : void {
    var tipo: string[] = ["manoscritto","cartografia storica"];
    var i=0;
    while(req.body.tipo != tipo[i] && req.body.tipo != null){
        if(i==tipo.length-1 && req.body.formato != tipo[i]){
            const new_err = getMsg(MsgEnum.ErrNonTrovato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
            break;
        }
        i++;
    }
    next();
}

/**
 * Funzione utilizzata per controllare se l'anno inserito per il filtro è presente nel database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloAnno(req: any, res: any, next: any) : void {
    Bene.findAll({attributes: ['anno'], raw: true}).then((bene: object[]) => {
        var json = JSON.parse(JSON.stringify(bene));
        var anno: number[] = [];
        for(var i=0; i<json.length; i++){
            anno.push(json[i]['anno']);
        }
        var j=0;
        while(req.body.anno != anno[j] && req.body.anno != null){
            if(j==anno.length-1 && req.body.anno != anno[j]){
                const new_err = getMsg(MsgEnum.ErrNonTrovato).getMsg();
                next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
                break;
            }
            j++;
        }
        next();
    });
}

/**
 * Funzione utilizzata per controllare se l'anno inserito per il filtro è presente nel database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloTipoAnno(req: any, res: any, next: any) : void {
    if(req.body.anno != null && req.body.tipo != null){
        Bene.findAll({attributes: ['anno','tipo'], raw: true}).then((bene: object[]) => {
            var json = JSON.parse(JSON.stringify(bene));
            var array_anni: number[] = [];
            var array_tipi: string[] = [];
            for(var i=0; i<json.length; i++){
                array_anni.push(json[i]['anno']);
                array_tipi.push(json[i]['tipo'])
            }

            var notFound=true;
                for(var j=0; notFound && j<array_anni.length; j++){
                    if(req.body.anno == array_anni[j] && req.body.tipo == array_tipi[j]){
                        notFound=false;
                    }
                }

                if(notFound) {
                    const new_err = getMsg(MsgEnum.ErrNonTrovato).getMsg();
                    next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
                }
                else 
                    next();             
        });
    }
    else 
        next(); 
}

/**
 * Funzione che controlla se i valori inseriti per l'acquisto del bene sono coerenti con i tipi richiesti
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloValoriAcquistoBene(req: any, res: any, next: any) : void {
    if(typeof req.body.id_bene == "number" && typeof req.body.formato == "string" && 
        typeof req.body.consumatore == "string" && typeof req.body.ruolo == "string"){
        next();
    }
    else if (!req.body.risultato) {
        const new_err = getMsg(MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che controlla se i valori inseriti per l'acquisto multiplo sono coerenti con i tipi richiesti
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloValoriAcquistoMultiplo(req: any, res: any, next: any) : void {
    if(Array.isArray(req.body.ids)){
        var bool = true;
        req.body.ids.forEach(function(item:any) {
            if(typeof item !== "number"){
                bool=false;
            }
        })
        if(bool) {
            if(typeof req.body.formato == "string" && typeof req.body.consumatore == "string" 
            && typeof req.body.ruolo == "string"){
            next();
            }
            else if (!req.body.risultato) {
                const new_err = getMsg(MsgEnum.ErrInserimentoValori).getMsg();
                next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
            }
        }
        else {
            const new_err = getMsg(MsgEnum.ErroreNoNumeri).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }    
    }
    else {
        const new_err = getMsg(MsgEnum.ErroreNoArray).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che controlla se il bene esiste
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloPresenzaBene(req: any, res: any, next: any) : void {
    Bene.findAll({attributes: ['id'], raw: true}).then((bene: object[]) => {
        var json = JSON.parse(JSON.stringify(bene));
        var array: number[] = [];
        console.log(json.length)
        for(var i=0; i<json.length; i++){
            array.push(json[i]['id']);
        }
        if(array.find(element => element === req.body.id_bene)){
            next();
        } else {
            const new_err = getMsg(MsgEnum.ErrNonTrovato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }
        
    });
}



/**
 * Funzione che controlla se i beni inseriti nell'array sono presenti nel database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloPresenzaBeni(req: any, res: any, next: any) : void {
    Bene.findAll({attributes: ['id'], raw: true}).then((bene: object[]) => {
        var json = JSON.parse(JSON.stringify(bene));
        var array: number[] = [];
        console.log(json.length)
        for(var i=0; i<json.length; i++){
            array.push(json[i]['id']);
        }
        const containsAll = req.body.ids.every((element: number) => {
            return array.includes(element);
          });
        if(containsAll){
            next();
        }
        else {
            const new_err = getMsg(MsgEnum.ErrNonTrovato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }  
    });
 }

 /**
 * Funzione utilizzata per controllare se l'utente dispone di un numero
 * sufficiente di token per l'acquisto dei beni
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloCreditoAcquistoMultiplo(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.consumatore).then((utente:any) => {
        var totale = 0;
        var i = 1;
        req.body.ids.forEach( async function(id:any){            
            console.log("id: "+id);
            await Bene.findByPk(id).then((bene:any) => {
                console.log("prezzo: " + bene.prezzo);
                totale+= bene.prezzo;
                if (i==req.body.ids.length){
                    console.log("totale: " + totale);
                    console.log(utente.credito);
                    if(totale <= utente.credito){
                        next();
                    }
                    else {
                        const new_err = getMsg(MsgEnum.ErrTokenNonSufficienti).getMsg();
                        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
                    }
                }
                i++;
            });
        }); 
    });
}

/**
 * Funzione che controlla se i valori inseriti per il download sono coerenti con i tipi richiesti
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloValoriDownload(req: any, res: any, next: any) : void {
    if(typeof req.body.consumatore == "string" && typeof req.body.ruolo == "string"){
        next();
    }
    else if (!req.body.risultato) {
        const new_err = getMsg(MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che controlla se i valori inseriti per il nuovo link sono coerenti con i tipi richiesti
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloValoriNuovoLink(req: any, res: any, next: any) : void {
    if(typeof req.body.id_acquisto == "number" && typeof req.body.consumatore == "string" 
        && typeof req.body.ruolo == "string"){
        next();
    }
    else if (!req.body.risultato) {
        const new_err = getMsg(MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che controlla se è presente l'id dell'acquisto nel database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloPresenzaAcquisto(req: any, res: any, next: any) : void {
    Acquisto.findAll({attributes: ['id'], raw: true}).then((acquisto: object[]) => {
        var json = JSON.parse(JSON.stringify(acquisto));
        var array: number[] = [];
        console.log("parametro:" + req.params.idAcquisto);
        console.log("parametro 2:" +req.body.id_acquisto);
        var presenza = req.params.idAcquisto != null ? req.params.idAcquisto: req.body.id_acquisto;
        for(var i=0; i<json.length; i++){
            array.push(json[i]['id']);
        }

        var notFound = true;
        for(var i =0; notFound && i<array.length; i++){
            if(array[i] == presenza)
                notFound = false;
        }

        if(notFound){
            const new_err = getMsg(MsgEnum.ErrAcquistoNonTrovato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        } else
            next();    
    });
}

/**
 * Funzione utilizzata per controllare che i valori inseriti nel token siano del tipo richiesto
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloValoriRicarica(req: any, res: any, next: any) : void {
    if(typeof req.body.consumatore == "string" && typeof req.body.ricarica == "number" && 
        typeof req.body.email_admin == "string" && typeof req.body.ruolo == "string"){
        next();
    }
    else if (!req.body.accredito) {
        const new_err = getMsg(MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione utilizzata per controllare che il valore inserito per l'accredito sia
 * un numero positivo e maggiore di zero
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloPositivita(req: any, res: any, next: any) : void {
    if(req.body.ricarica > 0) {
        next();
    }
    else {
        const new_err = getMsg(MsgEnum.ErrValoreNegativo).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che consente di controllare se il formato dell'immagine richiesto dall'utente 
 * è contenuto nei formati messi a disposizionr
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloFormatoImmagine(req: any, res: any, next: any) : void {
    var formato: string[] = ["jpg","png","tiff"];
    var i=0;
    while(req.body.formato != formato[i]){
        if(i==formato.length-1 && req.body.formato != formato[i]){
            const new_err = getMsg(MsgEnum.ErrFormatoNonEsistente).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
            break;
        }
        i++;
    }
    next();
}

/**
 * Funzione utilizzata per controllare se la mail inserita dall'utente è presente nel database
 * 
 * @param email email dell'utente
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloPresenza(email: string, res: any, next: any) : void {
    Utente.findAll({attributes: ['email'], raw: true}).then((utente: object[]) => {
        var json = JSON.parse(JSON.stringify(utente));
        var array: string[] = [];
        console.log(json.length)
        for(var i=0; i<json.length; i++){
            array.push(json[i]['email']);
        }
        var j=0;
        while(email != array[j]){
            if(j==array.length-1 && email != array[j]){
                const new_err = getMsg(MsgEnum.ErrUtenteNonTrovato).getMsg();
                next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
                break;
            }
            j++;
        }
        next();
    });
}

/**
 * Viene richiamata la funzione per il controllo della presenza per verificare
 * se l'admin è presente del database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloPresenzaAdmin(req: any, res: any, next: any) : void {
    controlloPresenza(req.body.email_admin,res,next);
}

/**
 * Viene richiamata la funzione per il controllo della presenza per verificare
 * se l'utente è presente del database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloPresenzaUser(req: any, res: any, next: any) : void {
    controlloPresenza(req.body.consumatore,res,next);
}

/**
 * Viene richiamata la funzione per il controllo della presenza per verificare
 * se l'utente di cui si richiede il credito è presente nel database
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function ControlloPresenzaUtente(req: any, res: any, next: any) : void {
    controlloPresenza(req.body.email,res,next);
}

/**
 * Viene richiamata la funzione per il controllo del formato dell'email inserito
 * dall'admin per l'inserimento di un nuovo utente
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function valMailNuovoConsumatore(req: any, res: any, next: any) : void {
    ValidazioneEmail(req.body.email,res,next);
}

/**
 * Viene richiamata la funzione per il controllo del formato dell'email inserito
 * dall'utente per indicare la mail dell'amico per la richiesta del regalo
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function valMailAmico(req: any, res: any, next: any) : void {
    ValidazioneEmail(req.body.email_amico,res,next);
}

/**
 * Funzione utilizzata per controllare se l'utente dispone di un numero
 * sufficiente di token per l'acquisto del bene
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloCredito(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.consumatore).then((utente:any) => {
        Bene.findByPk(req.body.id_bene).then((bene:any) => {
            if(bene.prezzo <= utente.credito){
                next();
            }
            else {
                const new_err = getMsg(MsgEnum.ErrTokenNonSufficienti).getMsg();
                next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
            }
        });
    });
}

/**
 * Funzione utilizzata per il controllo del numero di download per ogni acquisto
 * effettuato da un dato utente
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function controlloDownload(req: any, res: any, next: any) : void {
    console.log(req.params.idAcquisto);
    Acquisto.findByPk(req.params.idAcquisto).then((risultato: any) => {
        console.log(risultato);
        console.log(risultato.nDownload);
        if (risultato.nDownload == 0){
            next();
        }
        else if (risultato.nDownload == 1 && req.params.tipoDownload == "DownloadRegalo") {
            next();
        }
        else if (req.params.tipoDownload == "DownloadAggiuntivo") {
            next();
        }
        else {
            const new_err = getMsg(MsgEnum.ErrProibito).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }

    });
}

/**
 * Funzione utilizzata per il controllo del proprietario dell'acquisto
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloProprietarioAcquisto(req: any, res: any, next: any) : void {
    console.log(req.params.idAcquisto);
    var proprietario = req.params.idAcquisto != null ? req.params.idAcquisto : req.body.id_acquisto
    console.log(proprietario);
    Acquisto.findByPk(proprietario).then((risultato: any) => {
        console.log(risultato);
        console.log(risultato.nDownload);
        if (risultato.email_compr == req.body.consumatore){
            next();
        }
        else {
            const new_err = getMsg(MsgEnum.ErrProprietaAcquisto).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }
    });
}

/**
 * Funzione utilizzata per controllare se il credito a disposizione dell'utente è nullo.
 * Se è nullo, tutte le richieste verranno rifiutate ritornando un errore di tipo "Non autorizzato"
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloTokenNullo(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.consumatore).then((utente:any) => {
        if(utente.credito == 0) {
            const new_err = getMsg(MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }
        next();
    });
}

/**
 * Funzione utilizzata per controllare se il ruolo indicato dall'utente
 * è effettivamente quello dell'admin
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloAdmin(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.email_admin).then((utente:any) => {
        if(utente.ruolo == req.body.ruolo){
            next();
        }
        else {
            const new_err = getMsg(MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg})); 
        }
    });
}

/**
 * Funzione utilizzata per controllare se il ruolo indicato dall'utente
 * è effettivamente quello dell'user
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ControlloUser(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.consumatore).then((utente:any) => {
        console.log(req.body.ruolo)
        if(utente.ruolo == req.body.ruolo){
            next();
        }
        else {
            const new_err = getMsg(MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg})); 
        }
    });
}

/**
 * Funzione utilizzata per verificare se la mail indicata è scritta nel formato corretto
 * 
 * @param email email da verificare
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function ValidazioneEmail(email: string, res: any, next: any): void{
    let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regex.test(email)) {
        next();
    }
    else {
        const new_err = getMsg(MsgEnum.ErrEmailNonConforme).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg})); 
    }
}

/**
 * Funzione utilizzata per controllare se il content-type è effettivamente
 * del formato 'application/json'
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
export function verificaContentType(req: any, res: any, next: any): void{
    if (req.headers["content-type"] == 'application/json') next();
    else {
        const new_err = getMsg(MsgEnum.ErrNoPayload).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione utilizzata per controllare se è presente il JWT
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo 
 */
export function controlloPresenzaToken(req: any, res: any, next: any): void{
    var header: string = req.headers.authorization;
    if (typeof header !== 'undefined'){
        const token: string = header.split(' ')[1];
        req.token = token;
        next();
    } else {
        const new_err = getMsg(MsgEnum.ErrTokenMancante).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione utilizzata per controllare se il token JWT è effettivamente valido,
 * richiamando anche la chiave segreta
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo 
 */
export function ControlloChiaveSegreta(req: any, res: any, next: any): void{
    try {
        var risultato: string | jwt.JwtPayload = jwt.verify(req.token, process.env.KEY!);
        if (risultato != null) {
            req.body = risultato;
            next();
        }
    } catch (error) { 
        const new_err = getMsg(MsgEnum.ErrTokenInvalido).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

/**
 * Funzione che viene richiamata quando la rotta è inesistente
 * 
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo 
 */
export function RottaNonTrovata(req: any, res: any, next: any) {
    const new_err = getMsg(MsgEnum.ErrRottaNonTrovata).getMsg();
    next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
}

/**
 * Funzione utilizzata per controllare che quando
 * si effettua l'inserimento di un nuovo utente si passi una mail
 * che non è già stata utilizzata da un altro utente
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo 
 */
 export function EmailUnivoca(req:any, res:any, next:any) {
    Utente.findAll({attributes: ['email'], raw: true}).then((utente: object[]) => {
        var json = JSON.parse(JSON.stringify(utente));
        var array: string[] = [];
        console.log(json.length)
        for(var i=0; i<json.length; i++){
            array.push(json[i]['email']);
        }
        if(array.find(element => element === req.body.email)){
            const new_err = getMsg(MsgEnum.ErrEmailDuplicata).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        } else {
            next();
        }
        
    });
}

/**
 * Funzione utilizzata per il controllo dei valori che vengono inseriti quando
 * si effettua l'inserimento di un nuovo utente
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
 export function controlloValoriNuovoUtente(req: any, res: any, next: any) : void {
    if (typeof req.body.email == 'string' && 
        typeof req.body.nome == 'string' &&
        typeof req.body.cognome == 'string' &&
        typeof req.body.email_admin == 'string' &&
        typeof req.body.ruolo == 'string' &&
        typeof req.body.username == 'string'){
        next();
        }
    else if (!req.body.risultato) {
        const new_err = getMsg(MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}
