require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { JsonObjectExpression } from 'typescript';
import { getMsg,MsgEnum } from '../Messaggi/messaggi';
import { Utente} from "../models/models";

export function controlloValoriFiltro(req: any, res: any, next: any) : void {
    if ((typeof req.body.tipo == 'string' && 
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