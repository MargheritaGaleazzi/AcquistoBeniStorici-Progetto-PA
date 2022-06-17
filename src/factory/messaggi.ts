interface Msg {
    getMsg():{codice: number, msg: string};
}

//errore che viene lanciato quando non è stata fatta l'autenticazione
class ErrNoAuth implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "Richiesta Errata - Nessuna autenticazione"
        }
    }
}

//errore che viene lanciato quando non è presente il payload
class ErrNoPayload implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "Richiesta Errata - Non è presente il JSON di payload nell'header"
        }
    }
}

//errore che viene lanciato quando non sono sufficienti abbastanza token per l'acquisto
class ErrTokenNonSufficienti implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return{
            codice: 400,
            msg: "Richiesta Errata - Token JWT non sufficiente"
        }
    }
}

//errore che viene lanciato quando il payload è malformato
class ErrPaylodMalformato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "Richiesta Errata - Payload non formato in maniera corretta"
        }
    }
}

//errore che viene lanciato quando si ha una richiesta errata
class ErrRichiestaErrata implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "ERRORE - Richiesta errata"
        }
    }
}

//errore che viene lanciato in caso di errore generico da parte del server
class BadRequest implements Msg {
    getMsg(): { codice: number,  msg: string } {
        return {
            codice: 400,
            msg: "ERRORE - Impossibile elaborare la richiesta"
        }
    }
}

// errore che viene lanciato quando l'utente termina i token a lui assegnati
class ErrNonAutorizzato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 401,
            msg: "ERRORE - Non autorizzato"
        }
    }
}

//errore che viene lanciato quando il token inserito non risulta essere valido 
//quando scade la sessione
class ErrTokenInvalido implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:403,
            msg: "Accesso negato - Token JWT invalido"
        }
    }
}

//errore che viene lanciato in caso di accesso negato
//quando si prova ad utilizzare lo stesso link di download due volte
//nel caso di acquisto per se stessi o comunque alla terza volta
//se incluso l'acquisto per un amico
class ErrProibito implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 403,
            msg: "ERRORE - Accesso negato"
        }
    }
}

//errore che viene lanciato quando non viene trovata la rotta cercata
class ErrRottaNonTrovata implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "Non Trovato - Rotta non trovata"
        }
    }
}

//errore che viene lanciato quando si inserisce l'id di un bene non presente
class ErrNonTrovato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - ID non trovato"
        }
    }
}

//errore che viene lanciato quando si inserisce l'id di un utente errato
class ErrUtenteNonTrovato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Utente non trovato"
        }
    }
}

//errore che viene lanciato nel caso in cui si vuole filtrare per una categoria inesistente
class ErrFiltroNonTrovato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Filtro non esistente"
        }
    }
}

//errore che viene lanciato nel caso in cui non vengono trovati beni
//ad esempio dopo aver filtrato
class ErrBeniNonTrovati implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Beni non trovati"
        }
    }
}

//errore che viene lanciato nel caso in cui non ci sono beni presenti
class ErrFormatoNonEsistente implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Hai inserito un formato non esistente"
        }
    }
}

// errore che viene lanciato in caso di errore interno al server
class ErrServer implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 500,
            msg: "ERRORE - Errore interno al server"
        }
    }
}

// errore che viene lanciato in caso di servizio non disponibile
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
    ErrTokenNonSufficienti,
    ErrTokenInvalido, 
    ErrPaylodMalformato,
    ErrRottaNonTrovata,
    ErrNonAutorizzato,
    ErrProibito,
    ErrNonTrovato,
    ErrUtenteNonTrovato,
    ErrFiltroNonTrovato,
    ErrBeniNonTrovati,
    ErrFormatoNonEsistente,
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
        case MsgEnum.ErrUtenteNonTrovato:
            val = new ErrUtenteNonTrovato();
            break; 
        case MsgEnum.ErrFiltroNonTrovato:
            val = new ErrFiltroNonTrovato();
            break;
        case MsgEnum.ErrBeniNonTrovati:
            val = new ErrBeniNonTrovati();
            break; 
        case MsgEnum.ErrFormatoNonEsistente:
            val = new ErrFormatoNonEsistente();
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
        case MsgEnum.ErrTokenNonSufficienti:
            val = new ErrTokenNonSufficienti();
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

    

