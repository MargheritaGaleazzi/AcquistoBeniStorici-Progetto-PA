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
