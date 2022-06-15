"use strict";
//VANNO AGGIUNTI GLI ALTRi
exports.__esModule = true;
exports.getMsg = exports.MsgEnum = void 0;
var ErrNoAuth = /** @class */ (function () {
    function ErrNoAuth() {
    }
    ErrNoAuth.prototype.getMsgObj = function () {
        return {
            stato: 400,
            msg: "Richiesta Errata - Nessuna autenticazione"
        };
    };
    return ErrNoAuth;
}());
var ErrNoPayload = /** @class */ (function () {
    function ErrNoPayload() {
    }
    ErrNoPayload.prototype.getMsgObj = function () {
        return {
            stato: 400,
            msg: "Richiesta Errata - Non è presente il JSON di payload nell'header"
        };
    };
    return ErrNoPayload;
}());
var ErrTokenMancante = /** @class */ (function () {
    function ErrTokenMancante() {
    }
    ErrTokenMancante.prototype.getMsgObj = function () {
        return {
            stato: 400,
            msg: "Richiesta Errata - Token JWT mancante"
        };
    };
    return ErrTokenMancante;
}());
var ErrTokenInvalido = /** @class */ (function () {
    function ErrTokenInvalido() {
    }
    ErrTokenInvalido.prototype.getMsgObj = function () {
        return {
            stato: 403,
            msg: "Proibito - Token JWT invalido"
        };
    };
    return ErrTokenInvalido;
}());
var ErrPaylodMalformato = /** @class */ (function () {
    function ErrPaylodMalformato() {
    }
    ErrPaylodMalformato.prototype.getMsgObj = function () {
        return {
            stato: 400,
            msg: "Richiesta Errata - Payload non formato in maniera corretta"
        };
    };
    return ErrPaylodMalformato;
}());
var ErrRottaNonTrovata = /** @class */ (function () {
    function ErrRottaNonTrovata() {
    }
    ErrRottaNonTrovata.prototype.getMsgObj = function () {
        return {
            stato: 404,
            msg: "Non Trovato - Rotta non trovata"
        };
    };
    return ErrRottaNonTrovata;
}());
var ErrNonAutorizzato = /** @class */ (function () {
    function ErrNonAutorizzato() {
    }
    ErrNonAutorizzato.prototype.getMsgObj = function () {
        return {
            stato: 401,
            msg: "ERRORE - Non autorizzato"
        };
    };
    return ErrNonAutorizzato;
}());
var ErrProibito = /** @class */ (function () {
    function ErrProibito() {
    }
    ErrProibito.prototype.getMsgObj = function () {
        return {
            stato: 403,
            msg: "ERRORE - Proibito"
        };
    };
    return ErrProibito;
}());
var ErrNonTrovato = /** @class */ (function () {
    function ErrNonTrovato() {
    }
    ErrNonTrovato.prototype.getMsgObj = function () {
        return {
            stato: 404,
            msg: "ERRORE - Non trovato"
        };
    };
    return ErrNonTrovato;
}());
var ErrServer = /** @class */ (function () {
    function ErrServer() {
    }
    ErrServer.prototype.getMsgObj = function () {
        return {
            stato: 500,
            msg: "ERRORE - Errore interno al server"
        };
    };
    return ErrServer;
}());
var ErrServizioNonDisp = /** @class */ (function () {
    function ErrServizioNonDisp() {
    }
    ErrServizioNonDisp.prototype.getMsgObj = function () {
        return {
            stato: 503,
            msg: "ERRORE - Servizio non disponibile"
        };
    };
    return ErrServizioNonDisp;
}());
var ErrRichiestaErrata = /** @class */ (function () {
    function ErrRichiestaErrata() {
    }
    ErrRichiestaErrata.prototype.getMsgObj = function () {
        return {
            stato: 400,
            msg: "ERRORE - Richiesta errata"
        };
    };
    return ErrRichiestaErrata;
}());
var ListaBeni = /** @class */ (function () {
    function ListaBeni() {
    }
    ListaBeni.prototype.getMsgObj = function () {
        return {
            stato: 200,
            msg: "SUCCESSO - La lista è stata visualizzata correttamente"
        };
    };
    return ListaBeni;
}());
var ScaricaBene = /** @class */ (function () {
    function ScaricaBene() {
    }
    ScaricaBene.prototype.getMsgObj = function () {
        return {
            stato: 201,
            msg: "SUCCESSO - Il link del tuo acquisto è pronto"
        };
    };
    return ScaricaBene;
}());
var MsgEnum;
(function (MsgEnum) {
    MsgEnum[MsgEnum["ErrNoAuth"] = 0] = "ErrNoAuth";
    MsgEnum[MsgEnum["ErrNoPayload"] = 1] = "ErrNoPayload";
    MsgEnum[MsgEnum["ErrTokenMancante"] = 2] = "ErrTokenMancante";
    MsgEnum[MsgEnum["ErrTokenInvalido"] = 3] = "ErrTokenInvalido";
    MsgEnum[MsgEnum["ErrPaylodMalformato"] = 4] = "ErrPaylodMalformato";
    MsgEnum[MsgEnum["ErrRottaNonTrovata"] = 5] = "ErrRottaNonTrovata";
    MsgEnum[MsgEnum["ErrNonAutorizzato"] = 6] = "ErrNonAutorizzato";
    MsgEnum[MsgEnum["ErrProibito"] = 7] = "ErrProibito";
    MsgEnum[MsgEnum["ErrNonTrovato"] = 8] = "ErrNonTrovato";
    MsgEnum[MsgEnum["ErrServer"] = 9] = "ErrServer";
    MsgEnum[MsgEnum["ErrServizioNonDisp"] = 10] = "ErrServizioNonDisp";
    MsgEnum[MsgEnum["ErrRichiestaErrata"] = 11] = "ErrRichiestaErrata";
    MsgEnum[MsgEnum["ListaBeni"] = 12] = "ListaBeni";
    MsgEnum[MsgEnum["ScaricaBene"] = 13] = "ScaricaBene";
})(MsgEnum = exports.MsgEnum || (exports.MsgEnum = {}));
function getMsg(tipoErrore) {
    var val;
    switch (tipoErrore) {
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
        case MsgEnum.ScaricaBene:
            val = new ScaricaBene();
            break;
    }
    return val;
}
exports.getMsg = getMsg;
