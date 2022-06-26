"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.controlloValoriNuovoUtente = exports.EmailUnivoca = exports.RottaNonTrovata = exports.ControlloChiaveSegreta = exports.controlloPresenzaToken = exports.verificaContentType = exports.ValidazioneEmail = exports.ControlloUser = exports.ControlloAdmin = exports.ControlloTokenNullo = exports.controlloProprietarioAcquisto = exports.controlloDownload = exports.ControlloCredito = exports.valMailAmico = exports.valMailNuovoConsumatore = exports.ControlloPresenzaUtente = exports.ControlloPresenzaUser = exports.ControlloPresenzaAdmin = exports.controlloPresenza = exports.controlloFormatoImmagine = exports.controlloPositivita = exports.controlloValoriRicarica = exports.controlloPresenzaAcquisto = exports.controlloValoriNuovoLink = exports.controlloValoriDownload = exports.ControlloCreditoAcquistoMultiplo = exports.controlloPresenzaBeni = exports.controlloPresenzaBene = exports.controlloValoriAcquistoMultiplo = exports.controlloValoriAcquistoBene = exports.controlloTipoAnno = exports.controlloAnno = exports.controlloTipo = exports.controlloValoriFiltro = void 0;
require('dotenv').config();
var jwt = require("jsonwebtoken");
var messaggi_1 = require("../Factory/messaggi");
var models_1 = require("../models/models");
var resemble = require('resemblejs');
/**
 * Funzione utilizzata per il controllo dei valori che vengono inseriti quando
 * si effettua un filtro per tipo o anno
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriFiltro(req, res, next) {
    if ((typeof req.body.tipo == 'string' &&
        typeof req.body.anno == 'number') || (typeof req.body.tipo == 'string' &&
        req.body.anno == null) || (req.body.tipo == null &&
        typeof req.body.anno == 'number')) {
        next();
    }
    else if (!req.body.risultato) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoFiltriValori).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriFiltro = controlloValoriFiltro;
/**
 * Funzione che consente di controllare se il filtraggio relativo al tipo risulta essere presente
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloTipo(req, res, next) {
    var tipo = ["manoscritto", "cartografia storica"];
    var i = 0;
    while (req.body.tipo != tipo[i] && req.body.tipo != null) {
        if (i == tipo.length - 1 && req.body.formato != tipo[i]) {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonTrovato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
            break;
        }
        i++;
    }
    next();
}
exports.controlloTipo = controlloTipo;
/**
 * Funzione utilizzata per controllare se l'anno inserito per il filtro è presente nel database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloAnno(req, res, next) {
    models_1.Bene.findAll({ attributes: ['anno'], raw: true }).then(function (bene) {
        var json = JSON.parse(JSON.stringify(bene));
        var anno = [];
        for (var i = 0; i < json.length; i++) {
            anno.push(json[i]['anno']);
        }
        var j = 0;
        while (req.body.anno != anno[j] && req.body.anno != null) {
            if (j == anno.length - 1 && req.body.anno != anno[j]) {
                var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonTrovato).getMsg();
                next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
                break;
            }
            j++;
        }
        next();
    });
}
exports.controlloAnno = controlloAnno;
/**
 * Funzione utilizzata per controllare se l'anno inserito per il filtro è presente nel database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloTipoAnno(req, res, next) {
    if (req.body.anno != null && req.body.tipo != null) {
        models_1.Bene.findAll({ attributes: ['anno', 'tipo'], raw: true }).then(function (bene) {
            var json = JSON.parse(JSON.stringify(bene));
            var array_anni = [];
            var array_tipi = [];
            for (var i = 0; i < json.length; i++) {
                array_anni.push(json[i]['anno']);
                array_tipi.push(json[i]['tipo']);
            }
            var notFound = true;
            for (var j = 0; notFound && j < array_anni.length; j++) {
                if (req.body.anno == array_anni[j] && req.body.tipo == array_tipi[j]) {
                    notFound = false;
                }
            }
            if (notFound) {
                var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonTrovato).getMsg();
                next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
            }
            else
                next();
        });
    }
    else
        next();
}
exports.controlloTipoAnno = controlloTipoAnno;
/**
 * Funzione che controlla se i valori inseriti per l'acquisto del bene sono coerenti con i tipi richiesti
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriAcquistoBene(req, res, next) {
    if (typeof req.body.id_bene == "number" && typeof req.body.formato == "string" &&
        typeof req.body.consumatore == "string" && typeof req.body.ruolo == "string") {
        next();
    }
    else if (!req.body.risultato) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriAcquistoBene = controlloValoriAcquistoBene;
/**
 * Funzione che controlla se i valori inseriti per l'acquisto multiplo sono coerenti con i tipi richiesti
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriAcquistoMultiplo(req, res, next) {
    if (Array.isArray(req.body.ids)) {
        var bool = true;
        req.body.ids.forEach(function (item) {
            if (typeof item !== "number") {
                bool = false;
            }
        });
        if (bool) {
            if (typeof req.body.formato == "string" && typeof req.body.consumatore == "string"
                && typeof req.body.ruolo == "string") {
                next();
            }
            else if (!req.body.risultato) {
                var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoValori).getMsg();
                next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
            }
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErroreNoNumeri).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    }
    else {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErroreNoArray).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriAcquistoMultiplo = controlloValoriAcquistoMultiplo;
/**
 * Funzione che controlla se il bene esiste
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloPresenzaBene(req, res, next) {
    models_1.Bene.findAll({ attributes: ['id'], raw: true }).then(function (bene) {
        var json = JSON.parse(JSON.stringify(bene));
        var array = [];
        console.log(json.length);
        for (var i = 0; i < json.length; i++) {
            array.push(json[i]['id']);
        }
        if (array.find(function (element) { return element === req.body.id_bene; })) {
            next();
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonTrovato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    });
}
exports.controlloPresenzaBene = controlloPresenzaBene;
/**
 * Funzione che controlla se i beni inseriti nell'array sono presenti nel database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloPresenzaBeni(req, res, next) {
    models_1.Bene.findAll({ attributes: ['id'], raw: true }).then(function (bene) {
        var json = JSON.parse(JSON.stringify(bene));
        var array = [];
        console.log(json.length);
        for (var i = 0; i < json.length; i++) {
            array.push(json[i]['id']);
        }
        var containsAll = req.body.ids.every(function (element) {
            return array.includes(element);
        });
        if (containsAll) {
            next();
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonTrovato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    });
}
exports.controlloPresenzaBeni = controlloPresenzaBeni;
/**
* Funzione utilizzata per controllare se l'utente dispone di un numero
* sufficiente di token per l'acquisto dei beni
*
* @param req richiesta del client
* @param res risposta del server
* @param next riferimento al middleware successivo
*/
function ControlloCreditoAcquistoMultiplo(req, res, next) {
    models_1.Utente.findByPk(req.body.consumatore).then(function (utente) {
        var totale = 0;
        var i = 1;
        req.body.ids.forEach(function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("id: " + id);
                            return [4 /*yield*/, models_1.Bene.findByPk(id).then(function (bene) {
                                    console.log("prezzo: " + bene.prezzo);
                                    totale += bene.prezzo;
                                    if (i == req.body.ids.length) {
                                        console.log("totale: " + totale);
                                        console.log(utente.credito);
                                        if (totale <= utente.credito) {
                                            next();
                                        }
                                        else {
                                            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrTokenNonSufficienti).getMsg();
                                            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
                                        }
                                    }
                                    i++;
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
}
exports.ControlloCreditoAcquistoMultiplo = ControlloCreditoAcquistoMultiplo;
/**
 * Funzione che controlla se i valori inseriti per il download sono coerenti con i tipi richiesti
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriDownload(req, res, next) {
    if (typeof req.body.consumatore == "string" && typeof req.body.ruolo == "string") {
        next();
    }
    else if (!req.body.risultato) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriDownload = controlloValoriDownload;
/**
 * Funzione che controlla se i valori inseriti per il nuovo link sono coerenti con i tipi richiesti
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriNuovoLink(req, res, next) {
    if (typeof req.body.id_acquisto == "number" && typeof req.body.consumatore == "string"
        && typeof req.body.ruolo == "string") {
        next();
    }
    else if (!req.body.risultato) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriNuovoLink = controlloValoriNuovoLink;
/**
 * Funzione che controlla se è presente l'id dell'acquisto nel database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloPresenzaAcquisto(req, res, next) {
    models_1.Acquisto.findAll({ attributes: ['id'], raw: true }).then(function (acquisto) {
        var json = JSON.parse(JSON.stringify(acquisto));
        var array = [];
        console.log("parametro:" + req.params.idAcquisto);
        console.log("parametro 2:" + req.body.id_acquisto);
        var presenza = req.params.idAcquisto != null ? req.params.idAcquisto : req.body.id_acquisto;
        for (var i = 0; i < json.length; i++) {
            array.push(json[i]['id']);
        }
        var notFound = true;
        for (var i = 0; notFound && i < array.length; i++) {
            if (array[i] == presenza)
                notFound = false;
        }
        if (notFound) {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrAcquistoNonTrovato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
        else
            next();
    });
}
exports.controlloPresenzaAcquisto = controlloPresenzaAcquisto;
/**
 * Funzione utilizzata per controllare che i valori inseriti nel token siano del tipo richiesto
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriRicarica(req, res, next) {
    if (typeof req.body.consumatore == "string" && typeof req.body.ricarica == "number" &&
        typeof req.body.email_admin == "string" && typeof req.body.ruolo == "string") {
        next();
    }
    else if (!req.body.accredito) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriRicarica = controlloValoriRicarica;
/**
 * Funzione utilizzata per controllare che il valore inserito per l'accredito sia
 * un numero positivo e maggiore di zero
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloPositivita(req, res, next) {
    if (req.body.ricarica > 0) {
        next();
    }
    else {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrValoreNegativo).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloPositivita = controlloPositivita;
/**
 * Funzione che consente di controllare se il formato dell'immagine richiesto dall'utente
 * è contenuto nei formati messi a disposizionr
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloFormatoImmagine(req, res, next) {
    var formato = ["jpg", "png", "tiff"];
    var i = 0;
    while (req.body.formato != formato[i]) {
        if (i == formato.length - 1 && req.body.formato != formato[i]) {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrFormatoNonEsistente).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
            break;
        }
        i++;
    }
    next();
}
exports.controlloFormatoImmagine = controlloFormatoImmagine;
/**
 * Funzione utilizzata per controllare se la mail inserita dall'utente è presente nel database
 *
 * @param email email dell'utente
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloPresenza(email, res, next) {
    models_1.Utente.findAll({ attributes: ['email'], raw: true }).then(function (utente) {
        var json = JSON.parse(JSON.stringify(utente));
        var array = [];
        console.log(json.length);
        for (var i = 0; i < json.length; i++) {
            array.push(json[i]['email']);
        }
        var j = 0;
        while (email != array[j]) {
            if (j == array.length - 1 && email != array[j]) {
                var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrUtenteNonTrovato).getMsg();
                next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
                break;
            }
            j++;
        }
        next();
    });
}
exports.controlloPresenza = controlloPresenza;
/**
 * Viene richiamata la funzione per il controllo della presenza per verificare
 * se l'admin è presente del database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloPresenzaAdmin(req, res, next) {
    controlloPresenza(req.body.email_admin, res, next);
}
exports.ControlloPresenzaAdmin = ControlloPresenzaAdmin;
/**
 * Viene richiamata la funzione per il controllo della presenza per verificare
 * se l'utente è presente del database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloPresenzaUser(req, res, next) {
    controlloPresenza(req.body.consumatore, res, next);
}
exports.ControlloPresenzaUser = ControlloPresenzaUser;
/**
 * Viene richiamata la funzione per il controllo della presenza per verificare
 * se l'utente di cui si richiede il credito è presente nel database
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloPresenzaUtente(req, res, next) {
    controlloPresenza(req.body.email, res, next);
}
exports.ControlloPresenzaUtente = ControlloPresenzaUtente;
/**
 * Viene richiamata la funzione per il controllo del formato dell'email inserito
 * dall'admin per l'inserimento di un nuovo utente
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function valMailNuovoConsumatore(req, res, next) {
    ValidazioneEmail(req.body.email, res, next);
}
exports.valMailNuovoConsumatore = valMailNuovoConsumatore;
/**
 * Viene richiamata la funzione per il controllo del formato dell'email inserito
 * dall'utente per indicare la mail dell'amico per la richiesta del regalo
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function valMailAmico(req, res, next) {
    ValidazioneEmail(req.body.email_amico, res, next);
}
exports.valMailAmico = valMailAmico;
/**
 * Funzione utilizzata per controllare se l'utente dispone di un numero
 * sufficiente di token per l'acquisto del bene
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloCredito(req, res, next) {
    models_1.Utente.findByPk(req.body.consumatore).then(function (utente) {
        models_1.Bene.findByPk(req.body.id_bene).then(function (bene) {
            if (bene.prezzo <= utente.credito) {
                next();
            }
            else {
                var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrTokenNonSufficienti).getMsg();
                next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
            }
        });
    });
}
exports.ControlloCredito = ControlloCredito;
/**
 * Funzione utilizzata per il controllo del numero di download per ogni acquisto
 * effettuato da un dato utente
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloDownload(req, res, next) {
    console.log(req.params.idAcquisto);
    models_1.Acquisto.findByPk(req.params.idAcquisto).then(function (risultato) {
        console.log(risultato);
        console.log(risultato.nDownload);
        if (risultato.nDownload == 0) {
            next();
        }
        else if (risultato.nDownload == 1 && req.params.tipoDownload == "DownloadRegalo") {
            next();
        }
        else if (req.params.tipoDownload == "DownloadAggiuntivo") {
            next();
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrProibito).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    });
}
exports.controlloDownload = controlloDownload;
/**
 * Funzione utilizzata per il controllo del proprietario dell'acquisto
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloProprietarioAcquisto(req, res, next) {
    console.log(req.params.idAcquisto);
    var proprietario = req.params.idAcquisto != null ? req.params.idAcquisto : req.body.id_acquisto;
    console.log(proprietario);
    models_1.Acquisto.findByPk(proprietario).then(function (risultato) {
        console.log(risultato);
        console.log(risultato.nDownload);
        if (risultato.email_compr == req.body.consumatore) {
            next();
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrProprietaAcquisto).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    });
}
exports.controlloProprietarioAcquisto = controlloProprietarioAcquisto;
/**
 * Funzione utilizzata per controllare se il credito a disposizione dell'utente è nullo.
 * Se è nullo, tutte le richieste verranno rifiutate ritornando un errore di tipo "Non autorizzato"
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloTokenNullo(req, res, next) {
    models_1.Utente.findByPk(req.body.consumatore).then(function (utente) {
        if (utente.credito == 0) {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
        next();
    });
}
exports.ControlloTokenNullo = ControlloTokenNullo;
/**
 * Funzione utilizzata per controllare se il ruolo indicato dall'utente
 * è effettivamente quello dell'admin
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloAdmin(req, res, next) {
    models_1.Utente.findByPk(req.body.email_admin).then(function (utente) {
        if (utente.ruolo == req.body.ruolo) {
            next();
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    });
}
exports.ControlloAdmin = ControlloAdmin;
/**
 * Funzione utilizzata per controllare se il ruolo indicato dall'utente
 * è effettivamente quello dell'user
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloUser(req, res, next) {
    models_1.Utente.findByPk(req.body.consumatore).then(function (utente) {
        console.log(req.body.ruolo);
        if (utente.ruolo == req.body.ruolo) {
            next();
        }
        else {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNonAutorizzato).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
    });
}
exports.ControlloUser = ControlloUser;
/**
 * Funzione utilizzata per verificare se la mail indicata è scritta nel formato corretto
 *
 * @param email email da verificare
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ValidazioneEmail(email, res, next) {
    var regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regex.test(email)) {
        next();
    }
    else {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrEmailNonConforme).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.ValidazioneEmail = ValidazioneEmail;
/**
 * Funzione utilizzata per controllare se il content-type è effettivamente
 * del formato 'application/json'
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function verificaContentType(req, res, next) {
    if (req.headers["content-type"] == 'application/json')
        next();
    else {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrNoPayload).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.verificaContentType = verificaContentType;
/**
 * Funzione utilizzata per controllare se è presente il JWT
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloPresenzaToken(req, res, next) {
    var header = req.headers.authorization;
    if (typeof header !== 'undefined') {
        var token = header.split(' ')[1];
        req.token = token;
        next();
    }
    else {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrTokenMancante).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloPresenzaToken = controlloPresenzaToken;
/**
 * Funzione utilizzata per controllare se il token JWT è effettivamente valido,
 * richiamando anche la chiave segreta
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function ControlloChiaveSegreta(req, res, next) {
    try {
        var risultato = jwt.verify(req.token, process.env.KEY);
        if (risultato != null) {
            req.body = risultato;
            next();
        }
    }
    catch (error) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrTokenInvalido).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.ControlloChiaveSegreta = ControlloChiaveSegreta;
/**
 * Funzione che viene richiamata quando la rotta è inesistente
 *
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function RottaNonTrovata(req, res, next) {
    var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrRottaNonTrovata).getMsg();
    next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
}
exports.RottaNonTrovata = RottaNonTrovata;
/**
 * Funzione utilizzata per controllare che quando
 * si effettua l'inserimento di un nuovo utente si passi una mail
 * che non è già stata utilizzata da un altro utente
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function EmailUnivoca(req, res, next) {
    models_1.Utente.findAll({ attributes: ['email'], raw: true }).then(function (utente) {
        var json = JSON.parse(JSON.stringify(utente));
        var array = [];
        console.log(json.length);
        for (var i = 0; i < json.length; i++) {
            array.push(json[i]['email']);
        }
        if (array.find(function (element) { return element === req.body.email; })) {
            var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrEmailDuplicata).getMsg();
            next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
        }
        else {
            next();
        }
    });
}
exports.EmailUnivoca = EmailUnivoca;
/**
 * Funzione utilizzata per il controllo dei valori che vengono inseriti quando
 * si effettua l'inserimento di un nuovo utente
 * @param req richiesta del client
 * @param res risposta del server
 * @param next riferimento al middleware successivo
 */
function controlloValoriNuovoUtente(req, res, next) {
    if (typeof req.body.email == 'string' &&
        typeof req.body.nome == 'string' &&
        typeof req.body.cognome == 'string' &&
        typeof req.body.email_admin == 'string' &&
        typeof req.body.ruolo == 'string' &&
        typeof req.body.username == 'string') {
        next();
    }
    else if (!req.body.risultato) {
        var new_err = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ErrInserimentoValori).getMsg();
        next(res.status(new_err.codice).json({ errore: new_err.codice, descrizione: new_err.msg }));
    }
}
exports.controlloValoriNuovoUtente = controlloValoriNuovoUtente;
