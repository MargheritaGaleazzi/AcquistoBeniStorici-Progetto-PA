//VANNO AGGIUNTI GLI ALTRi

interface ErrObj {
    getErroreObj():{stato: number, msg: string};
}

class ErrNoAuth implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "Richiesta Errata - Nessuna autenticazione"
        }
    }
}

class ErrNoPayload implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "Richiesta Errata - Non è presente il JSON di payload nell'header"
        }
    }
}

class ErrTokenMancante implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return{
            stato: 400,
            msg: "Richiesta Errata - Token JWT mancante"
        }
    }
}

class ErrTokenInvalido implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato:403,
            msg: "Proibito - Token JWT invalido"
        }
    }
}

class ErrPaylodMalformato implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "Richiesta Errata - Payload non formato in maniera corretta"
        }
    }
}

class ErrRottaNonTrovata implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 404,
            msg: "Non Trovato - Rotta non trovata"
        }
    }
}

class ErrNonAutorizzato implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 401,
            msg: "ERRORE - Non autorizzato"
        }
    }
}

class ErrProibito implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 403,
            msg: "ERRORE - Proibito"
        }
    }
}

class ErrNonTrovato implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 404,
            msg: "ERRORE - Non trovato"
        }
    }
}

class ErrServer implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 500,
            msg: "ERRORE - Errore interno al server"
        }
    }
}

class ErrServizioNonDisp implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 503,
            msg: "ERRORE - Servizio non disponibile"
        }
    }
}

class ErrRichiestaErrata implements ErrObj {
    getErroreObj(): { stato: number; msg: string; } {
        return {
            stato: 400,
            msg: "ERRORE - Richiesta errata"
        }
    }
}

export enum EnumErr {
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
    ErrRichiestaErrata
}

export function getErrore (tipoErrore: EnumErr): ErrObj{
    let val: ErrObj;
    switch (tipoErrore){
        case EnumErr.ErrNoAuth:
            val = new ErrNoAuth();
            break;
        case EnumErr.ErrNoPayload:
            val = new ErrNoPayload();
            break;
        case EnumErr.ErrNonAutorizzato:
            val = new ErrNonAutorizzato();
            break;
        case EnumErr.ErrNonTrovato:
            val = new ErrNonTrovato();
            break;
        case EnumErr.ErrPaylodMalformato:
            val = new ErrPaylodMalformato();
            break;
        case EnumErr.ErrProibito:
            val = new ErrProibito();
            break;
        case EnumErr.ErrRichiestaErrata:
            val = new ErrRichiestaErrata();
            break;
        case EnumErr.ErrRottaNonTrovata:
            val = new ErrRottaNonTrovata();
            break;
        case EnumErr.ErrServer:
            val = new ErrServer();
            break;
        case EnumErr.ErrServizioNonDisp:
            val = new ErrServizioNonDisp();
            break;
        case EnumErr.ErrTokenInvalido:
            val = new ErrTokenInvalido();
            break;
        case EnumErr.ErrTokenMancante:
            val = new ErrTokenMancante();
            break;
    }
    return val;
}

    

