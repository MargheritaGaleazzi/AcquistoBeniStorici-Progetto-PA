require('dotenv').config();
//import * as jwt from 'jsonwebtoken';
import { getMsg, MsgEnum } from '../Messaggi/messaggi';

export function checkJSONPayload(req: any, res: any, next: any): void{
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        next();
    } catch (error) { 
        next(MsgEnum.ErrPaylodMalformato)
    }
}

export function checkPayloadHeader(req: any, res: any, next: any): void{
    if (req.headers["content-type"] == 'application/json') next();
    else next(MsgEnum.ErrNoPayload);
}

export function errorHandler(err: any, req: any, res: any, next: any): void { 
    res.status(err.status).json(err.msg);
}