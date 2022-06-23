require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { where } from 'sequelize/types';
import { JsonObjectExpression } from 'typescript';
import { getMsg,MsgEnum } from '../Factory/messaggi';
import { Utente, Bene, Acquisto} from "../models/models";

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
        if(i==2 && req.body.formato != formato[i]){
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
    ValidazioneEmail(req.body.consumatore,res,next);
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
        else {
            const new_err = getMsg(MsgEnum.ErrProibito).getMsg();
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
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
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
 * 
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
 * si effettua un filtro per tipo o anno
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