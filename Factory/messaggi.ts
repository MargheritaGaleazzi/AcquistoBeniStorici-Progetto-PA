import { download } from "../controller";

/*
 * Interfaccia che definisce come deve essere fatto il messaggio
 * (sia di errore che di successo) che il server restituisce al client
 */
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

//errore che viene lanciato quando non è presente il token per l'autenticazione
class ErrTokenMancante implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return{
            codice: 400,
            msg: "Richiesta Errata - Token JWT non presente"
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

//errore che viene lanciato quando si dispone di token sufficienti per l'acquisto del bene
class ErrTokenNonSufficienti implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 400,
            msg: "ERRORE - Non sono sufficienti abbastanza token per l'acquisto del bene"
        }
    }
}

//errore che viene lanciato in caso non inserimento di un array di immagini per l'acquisto multiplo
class ErroreNoArray implements Msg {
    getMsg(): { codice: number,  msg: string } {
        return {
            codice: 400,
            msg: "ERRORE - Non hai inserito un array per indicare gli id dei beni che si vogliono acquistare"
        }
    }
}

//errore che viene lanciato in caso in cui non sono presenti id sottoforma di numero per indicare l'id delle immagini
class ErroreNoNumeri implements Msg {
    getMsg(): { codice: number,  msg: string } {
        return {
            codice: 400,
            msg: "ERRORE - Non hai inserito gli id delle immagini in modo corretto"
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
class ErrTokenInvalido implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:403,
            msg: "Accesso negato - Token JWT invalido"
        }
    }
}

/* errore che viene lanciato in caso di accesso negato
 * quando si prova ad utilizzare lo stesso link di download due volte
 * nel caso di acquisto per se stessi o comunque alla terza volta
 * se incluso l'acquisto per un amico
 */
class ErrProibito implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 403,
            msg: "ERRORE - Accesso negato"
        }
    }
}

/* errore che viene lanciato se un utente che non è il proprietario del bene
 * prova a farne il download
 */
class ErrProprietaAcquisto implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 403,
            msg: "ERRORE - Non risulti essere il proprietario di questo acquisto"
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

//errore che viene lanciato quando si inseriscono valori non conformi
class ErrNonTrovato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Non sono stati trovati beni relativamente ai valori inseriti"
        }
    }
}

//errore che viene lanciato quando si inseriscono valori non conformi
class ErrAcquistoNonTrovato implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Non sono stati trovati acquisti relativamente all ID inserito"
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

//errore che viene lanciato quando i filtri e/o i valori inseriti non risultano essere corretti
class ErrInserimentoFiltriValori implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - I filtri e/o i valori inseriti non risultato essere corretti."
        }
    }
}

//errore che viene lanciato quando i valori inseriti non risultano essere corretti
class ErrInserimentoValori implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Le chiavi e/o valori inseriti non risultato essere corretti."
        }
    }
}

//errore che viene lanciato quando il valore dell'accredito risulta essere negativo
class ErrValoreNegativo implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Il valore relativo all'accredito deve essere un numero positivo maggiore di zero."
        }
    }
}

//errore che viene lanciato nel caso in cui si inserisce un formato non esistente
class ErrFormatoNonEsistente implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Hai inserito un formato non esistente"
        }
    }
}

//errore che viene lanciato se si hanno problemi nel caricamento di un'immagine
class ErrImg implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 404,
            msg: "ERRORE - Errore nel caricamento dell'immagine"
        }
    }
}

//errore che viene lanciato nel caso di email inserita non conforme agli standard
class ErrEmailNonConforme implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 406,
            msg: "ERRORE - Hai inserito un formato email non conforme agli standard"
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

/* errore che viene lanciato se si prova a creare un nuovo utente con una mail 
 * che è già presente nel database
 */
class ErrEmailDuplicata implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 409,
            msg: "ERRORE - Errore esiste già un utente con questa email"
        }
    }
}

// messaggio di successo se si è visualizzata correttamente la lista
class ListaBeni implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice: 200,
            msg: "SUCCESSO - La lista è stata visualizzata correttamente"
        }
    }
}

// messaggio di successo se l'acquisto è andato a buon fine
class AcquistaBene implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:201,
            msg: "SUCCESSO - Il link del tuo acquisto è pronto"
        }
    }
}

// messaggio di successo se lo storico degli acquisti è visualizzato correttamente
class VediAcquisti implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:200,
            msg: "SUCCESSO - Ora è possibile visualizzare la lista degli acquisti"
        }
    }
}

// messaggio di successo se il credito dell'utente è visualizzato con successo
class VediCredito implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:200,
            msg: "SUCCESSO - Puoi vedere il credito dell'utente"
        }
    }
}

// messaggio di successo se la ricarica ad un utente è andata a buon fine 
class RicaricaEffettuata implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:201,
            msg: "SUCCESSO - La ricarica è andata a buon fine"
        }
    }
}

// messaggio di successo se l'utente è stato creato correttamente
class NuovoUtente implements Msg {
    getMsg(): { codice: number; msg: string; } {
        return {
            codice:201,
            msg: "SUCCESSO - Il nuovo utente è stato correttamente creato"
        }
    }
}


export enum MsgEnum {
    ErrNoAuth,
    ErrNoPayload,
    ErrTokenMancante,
    ErrTokenInvalido, 
    ErrPaylodMalformato,
    ErrTokenNonSufficienti,
    ErrRottaNonTrovata,
    ErrNonAutorizzato,
    ErrProibito,
    ErrProprietaAcquisto,
    ErrNonTrovato,
    ErrAcquistoNonTrovato,
    ErrUtenteNonTrovato,
    ErrInserimentoFiltriValori,
    ErrInserimentoValori,
    ErrValoreNegativo,
    ErrFormatoNonEsistente,
    ErrEmailNonConforme,
    ErrServer,
    ErrServizioNonDisp,
    ErrRichiestaErrata,
    ErrImg,
    ErrEmailDuplicata,
    ErroreNoArray,
    ErroreNoNumeri,
    BadRequest,
    ListaBeni,
    AcquistaBene,
    VediAcquisti,
    VediCredito,
    RicaricaEffettuata,
    NuovoUtente,
}

/**
 * Funzione che prende costruisce l'oggetto messagio relativo all'evento che accade
 * @param tipoEvento -> evento che accade
 * @returns l'oggetto di errore o successo relativo all'evento accaduto
 */
export function getMsg (tipoEvento: MsgEnum): Msg{
    let val: Msg;
    switch (tipoEvento){
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
        case MsgEnum.ErrAcquistoNonTrovato:
            val = new ErrAcquistoNonTrovato();
            break;
        case MsgEnum.ErrUtenteNonTrovato:
            val = new ErrUtenteNonTrovato();
            break;
        case MsgEnum.ErrValoreNegativo:
            val = new ErrValoreNegativo();
            break;
        case MsgEnum.ErrFormatoNonEsistente:
            val = new ErrFormatoNonEsistente();
            break; 
        case MsgEnum.ErrPaylodMalformato:
            val = new ErrPaylodMalformato();
            break;
        case MsgEnum.ErrInserimentoFiltriValori:
            val = new ErrInserimentoFiltriValori();
            break;
        case MsgEnum.ErrInserimentoValori:
            val = new ErrInserimentoValori();
            break;
        case MsgEnum.ErrTokenNonSufficienti:
            val = new ErrTokenNonSufficienti();
            break;
        case MsgEnum.ErrProibito:
            val = new ErrProibito();
            break;
        case MsgEnum.ErrProprietaAcquisto:
            val = new ErrProprietaAcquisto();
            break;
        case MsgEnum.ErrRichiestaErrata:
            val = new ErrRichiestaErrata();
            break;
        case MsgEnum.ErrRottaNonTrovata:
            val = new ErrRottaNonTrovata();
            break;
        case MsgEnum.ErrEmailNonConforme:
            val = new ErrEmailNonConforme();
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
        case MsgEnum.ErroreNoArray:
            val = new ErroreNoArray();
            break;
        case MsgEnum.ErroreNoNumeri:
            val = new ErroreNoNumeri();
            break;
        case MsgEnum.BadRequest:
            val = new BadRequest();
            break;
        case MsgEnum.ErrImg:
            val = new ErrImg();
            break;
        case MsgEnum.ErrEmailDuplicata:
            val = new ErrEmailDuplicata();
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
        case MsgEnum.VediCredito:
            val = new VediCredito();
            break;       
        case MsgEnum.RicaricaEffettuata:
            val = new RicaricaEffettuata();
            break; 
        case MsgEnum.NuovoUtente:
            val = new NuovoUtente();
            break;
    }
    return val;
}

    

