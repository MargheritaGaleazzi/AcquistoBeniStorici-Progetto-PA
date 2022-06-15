"use strict";
exports.__esModule = true;
exports.scaricaBene = exports.listaBeni = void 0;
var models_1 = require("./models/models");
var messaggi_1 = require("./factory/messaggi");
var os = require("os");
var fs = require('fs'), gm = require('gm'), imageMagick = gm.subClass({ imageMagick: true });
/*
 * Funzione che viene richiamata dalle altr funzioni del Controller in caso di errori.
 * Richiama i metodi della Factory per costruire oggetti da ritornare al client nella risposta.
 *
 * @param enumError -> Il tipo di errore da costruire
 * @param err -> l'errore a cui si va in contro
 * @param risp -> Risposta del server
 */
function controllerErrori(enumError, err, risp) {
    var nuovoErr = (0, messaggi_1.getMsg)(enumError).getMsgObj();
    console.log(err);
    risp.status(nuovoErr.stato).json(nuovoErr.msg);
}
/*
 * Funzione che permette di visualizzare tutti i beni che sono presenti.
 *
 * @param tipo -> il tipo dei beni che si vogliono visualizzare nella risposta
 * @param anno -> l'anno dei beni che si vogliono visualizzare nella risposta
 * @param risp -> la risposta che darà il server
 */
function listaBeni(tipo, anno, risp) {
    models_1.Bene.findAll({
        where: { tipo: tipo, anno: anno },
        raw: true
    }).then(function (risultato) {
        var new_res = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ListaBeni).getMsgObj();
        risp.status(new_res.stato).json({ message: new_res.msg, risultato: risultato });
    })["catch"](function (error) {
        controllerErrori(messaggi_1.MsgEnum.ErrServer, error, risp);
    });
}
exports.listaBeni = listaBeni;
/***
 * Funzione per verificare la presenza delle immagini
 *
 * export function PresenzaImmagini(path: string, url: string) {}
 */
/***
 * Funzione per estrarre le immagini dallo zip
 *
 * export function EstrazioneImmagini() {}
 */
/*
 * Funzione che permette di acquistare un bene
 */
//export function acquistaBene(id:number)
/*
 * Funzione che permette di scaricare un bene precedentemente acquistato
 */
function scaricaBene(id_acquisto, risp) {
    models_1.Acquisto.findOne({
        where: { id: id_acquisto },
        raw: true
    }).then(function (risultato) {
        risultato.tipo_acq = "download originale";
        // passing a downloadable image by url 
        var request = require('request');
        var url = "www.codinggirl.com/" + id_acquisto.toString + "OrigDwld." + risultato.formato;
        var path = os.homedir();
        process.chdir(path);
        console.log(path);
        var pathToImg = "../img/" + risultato.Bene.nome + risultato.formato;
        gm(request(url)).write(pathToImg, function (err) {
            if (!err)
                console.log('Il link è stato creato correttamente, puoi scaricare l\'immagine');
        });
        var new_res = (0, messaggi_1.getMsg)(messaggi_1.MsgEnum.ScaricaBene).getMsgObj();
        var link = { bene: risultato.Bene.nome, formato: risultato.formato, link: url };
        risp.status(new_res.stato).json({ message: new_res.msg, risultato: link });
    })["catch"](function (error) {
        controllerErrori(messaggi_1.MsgEnum.ErrServer, error, risp);
    });
}
exports.scaricaBene = scaricaBene;
var path = __dirname;
process.chdir(path);
console.log(path);
