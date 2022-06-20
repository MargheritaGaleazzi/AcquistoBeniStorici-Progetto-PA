require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { where } from 'sequelize/types';
import { JsonObjectExpression } from 'typescript';
import { getMsg,MsgEnum } from '../Factory/messaggi';
import { Utente, Bene, Acquisto} from "../models/models";

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

export function controlloAcquistoBene(req: any, res: any, next: any) : void {
    if(typeof req.body.id_bene == "number" && 
        typeof req.body.formato == "string" && 
        typeof req.body.cons == "string"){
        next();
    }
    else if (!req.body.risultato) {
        const new_err = getMsg(MsgEnum.ErrInserimentoFiltriValori).getMsg();
        next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
    }
}

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


export function controlloPresenzaUtente(req: any, res: any, next: any) : void {
    Utente.findAll({attributes: ['email'], raw: true}).then((utente: object[]) => {
        var json = JSON.parse(JSON.stringify(utente));
        var array: string[] = [];
        console.log(json.length)
        for(var i=0; i<json.length; i++){
            array.push(json[i]['email']);
        }
        var j=0;
        while(req.body.cons != array[j]){
            if(j==array.length-1 && req.body.cons != array[j]){
                const new_err = getMsg(MsgEnum.ErrUtenteNonTrovato).getMsg();
                next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
                break;
            }
            j++;
        }
        next();
    });
}

export function ControlloCredito(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.cons).then((utente:any) => {
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

export function controlloDownload(req: any, res: any, next: any) : void {
    Acquisto.findOne({
        where: { email_compr : req.body.cons, beneId : req.body.id_bene}, 
        raw: true
    }).then((risultato: any) => {
        if (risultato == undefined){
            next();
        }
        else {
            console.log("pippo "+risultato)
            const new_err = getMsg(MsgEnum.ErrProibito).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }

    });
}

export function ControlloTokenNullo(req: any, res: any, next: any) : void {
    Utente.findByPk(req.body.cons).then((utente:any) => {
        if(utente.credito == 0) {
            const new_err = getMsg(MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({errore:new_err.codice, descrizione:new_err.msg}));
        }
        next();
    });
}

export function verificaAuthorization (req: any, res: any, next: any): void{
    if (req.headers.authorization) next();
    else next(MsgEnum.ErrNoAuth);
}

export function verificaContentType(req: any, res: any, next: any): void{
    if (req.headers["content-type"] == 'application/json') next();
    else next(MsgEnum.ErrNoPayload);
}

export function controlloPresenzaToken(req: any, res: any, next: any): void{
    var header: string = req.headers.authorization;
    if (typeof header !== 'undefined'){
        const token: string = header.split(' ')[1];
        req.token = token;
        next();
    } else next(MsgEnum.ErrTokenMancante);
}

export function ControlloChiaveSegreta(req: any, res: any, next: any): void{
    try {
        var risultato: string | jwt.JwtPayload = jwt.verify(req.token, process.env.key!);
        if (risultato != null) {
            req.body = risultato;
            next();
        }
    } catch (error) { 
        next(MsgEnum.ErrTokenInvalido); 
    }
}

export function RottaNonTrovata(req: any, res: any, next: any) {
    next(MsgEnum.ErrRottaNonTrovata);
}