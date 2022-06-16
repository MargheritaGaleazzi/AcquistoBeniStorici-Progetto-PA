//VANNO AGGIUNTI GLI ALTRi

interface MsgObj {
    getMsgObj():{stato: number, msg: string};
}

class ErrNoAuth implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "Richiesta Errata - Nessuna autenticazione"
        }
    }
}

class ErrNoPayload implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "Richiesta Errata - Non è presente il JSON di payload nell'header"
        }
    }
}

class ErrTokenMancante implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return{
            stato: 400,
            msg: "Richiesta Errata - Token JWT mancante"
        }
    }
}

class ErrTokenInvalido implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato:403,
            msg: "Proibito - Token JWT invalido"
        }
    }
}

class ErrPaylodMalformato implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "Richiesta Errata - Payload non formato in maniera corretta"
        }
    }
}

class ErrRottaNonTrovata implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 404,
            msg: "Non Trovato - Rotta non trovata"
        }
    }
}

class ErrNonAutorizzato implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 401,
            msg: "ERRORE - Non autorizzato"
        }
    }
}

class ErrProibito implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 403,
            msg: "ERRORE - Proibito"
        }
    }
}

class ErrNonTrovato implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 404,
            msg: "ERRORE - Non trovato"
        }
    }
}

class ErrServer implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 500,
            msg: "ERRORE - Errore interno al server"
        }
    }
}

class ErrServizioNonDisp implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 503,
            msg: "ERRORE - Servizio non disponibile"
        }
    }
}

class ErrRichiestaErrata implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "ERRORE - Richiesta errata"
        }
    }
}

class ListaBeni implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato: 200,
            msg: "SUCCESSO - La lista è stata visualizzata correttamente"
        }
    }
}

class AcquistaBene implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato:201,
            msg: "SUCCESSO - Il link del tuo acquisto è pronto"
        }
    }
}

class VediAcquisti implements MsgObj {
    getMsgObj(): { stato: number; msg: string; } {
        return {
            stato:201,
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
    ListaBeni,
    AcquistaBene,
    VediAcquisti
}

export function getMsg (tipoErrore: MsgEnum): MsgObj{
    let val: MsgObj;
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

    

