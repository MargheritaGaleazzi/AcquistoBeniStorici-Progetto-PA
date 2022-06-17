require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { MsgEnum } from '../Messaggi/messaggi';

export function verificaJSONPayload(req: any, res: any, next: any): void{
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) { 
        next(MsgEnum.ErrPaylodMalformato);
    }
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
        var risultato: string | jwt.JwtPayload = jwt.verify(req.token, process.env.key);
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