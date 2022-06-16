//VANNO AGGIUNTI GLI ALTRi

interface Msg {
    getMsg():{codice: number, msg: string};
}

class ErrNoAuth implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "Richiesta Errata - Nessuna autenticazione"
        }
    }
}

class ErrNoPayload implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "Richiesta Errata - Non è presente il JSON di payload nell'header"
        }
    }
}

class ErrTokenMancante implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return{
            codice: 400,
            msg: "Richiesta Errata - Token JWT mancante"
        }
    }
}

class ErrPaylodMalformato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "Richiesta Errata - Payload non formato in maniera corretta"
        }
    }
}

class ErrRichiestaErrata implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "ERRORE - Richiesta errata"
        }
    }
}

class BadRequest implements Msg {
    getMsg(): { codice: number,  msg: string } {
        return {
            codice: 400,
            msg: "ERRORE - Impossibile elaborare la richiesta"
        }
    }
}

class ErrNonAutorizzato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 401,
            msg: "ERRORE - Non autorizzato"
        }
    }
}

class ErrTokenInvalido implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:403,
            msg: "Accesso negato - Token JWT invalido"
        }
    }
}

class ErrProibito implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 403,
            msg: "ERRORE - Accesso negato"
        }
    }
}

class ErrRottaNonTrovata implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "Non Trovato - Rotta non trovata"
        }
    }
}

class ErrNonTrovato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Non trovato"
        }
    }
}

class ErrServer implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 500,
            msg: "ERRORE - Errore interno al server"
        }
    }
}

class ErrServizioNonDisp implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 503,
            msg: "ERRORE - Servizio non disponibile"
        }
    }
}

class ListaBeni implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 200,
            msg: "SUCCESSO - La lista è stata visualizzata correttamente"
        }
    }
}

class AcquistaBene implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:201,
            msg: "SUCCESSO - Il link del tuo acquisto è pronto"
        }
    }
}

class VediAcquisti implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:201,
            msg: "SUCCESSO - Ora è possibile visualizzare la lista degli acquisti"
        }
    }
}

export enum MsgEnum {
    ErrNoAuth,
    ErrNoPayload,
    ErrTokenMancante,
    ErrTokenInvalido, 
    ErrPaylodMalformato,
    ErrRottaNonTrovata,
    ErrNonAutorizzato,
    ErrProibito,
    ErrNonTrovato,
    ErrServer,
    ErrServizioNonDisp,
    ErrRichiestaErrata,
    BadRequest,
    ListaBeni,
    AcquistaBene,
    VediAcquisti
}

export function getMsg (tipoErrore: MsgEnum): Msg{
    let val: Msg;
    switch (tipoErrore){
        case MsgEnum.ErrNoAuth:
            val = new ErrNoAuth();
            break;
        case MsgEnum.ErrNoPayload:
            val = new ErrNoPayload();
            break;
        case MsgEnum.ErrNonAutorizzato:
            val = new ErrNonAutorizzato();
            break;
        case MsgEnum.ErrNonTrovato:
            val = new ErrNonTrovato();
            break;
        case MsgEnum.ErrPaylodMalformato:
            val = new ErrPaylodMalformato();
            break;
        case MsgEnum.ErrProibito:
            val = new ErrProibito();
            break;
        case MsgEnum.ErrRichiestaErrata:
            val = new ErrRichiestaErrata();
            break;
        case MsgEnum.ErrRottaNonTrovata:
            val = new ErrRottaNonTrovata();
            break;
        case MsgEnum.ErrServer:
            val = new ErrServer();
            break;
        case MsgEnum.ErrServizioNonDisp:
            val = new ErrServizioNonDisp();
            break;
        case MsgEnum.ErrTokenInvalido:
            val = new ErrTokenInvalido();
            break;
        case MsgEnum.ErrTokenMancante:
            val = new ErrTokenMancante();
            break;
        case MsgEnum.BadRequest:
            val = new BadRequest();
            break;
        case MsgEnum.ListaBeni:
            val = new ListaBeni();
            break;
        case MsgEnum.AcquistaBene:
            val = new AcquistaBene();
            break;
        case MsgEnum.VediAcquisti:
            val = new VediAcquisti();
            break;    
    }
    return val;
}

    

