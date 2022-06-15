"use strict";
exports.__esModule = true;
exports.scaricaBene = exports.EstrazioneImmagini = exports.PresenzaImmagini = exports.listaBeni = void 0;
var models_1 = require("./models/models");
var messaggi_1 = require("./factory/messaggi");
var path = require("path");
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
 */
function PresenzaImmagini(curr_path, url) {
    var zip = path.join(curr_path, "/ImmaginiPA.zip");
    fs.stat(zip, function (exists) {
        if (exists == null) {
            return console.log("esiste");
        }
        else if (exists.code === 'ENOENT') {
            return console.log("non esiste");
        }
    });
}
exports.PresenzaImmagini = PresenzaImmagini;
/***
 * Funzione per estrarre le immagini dallo zip
*/
function EstrazioneImmagini(curr_path) {
    var unzip = require('unzip-stream');
    var fs_extra = require('fs-extra');
    var zip = path.join(curr_path, "/ImmaginiPA.zip");
    console.log(zip);
    var dir_path = path.join(curr_path, "/img");
    console.log(dir_path);
    try {
        fs_extra.createReadStream(zip).pipe(unzip.Extract({ path: dir_path }));
        console.log("Immagini Scaricate");
    }
    catch (_a) {
        console.log("zip non trovato");
    }
}
exports.EstrazioneImmagini = EstrazioneImmagini;
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
        var pathToImg = "../img/" + risultato.Bene.nome;
        var nomeBene = risultato.Bene.nome.split(".")[0];
        gm(request(url))
            .command('composite')
            .gravity('Center')["in"]('../img_doc/filigrana.png')
            .command('covert')["in"](risultato.Bene.nome)
            .out(nomeBene + risultato.formato)
            .write(pathToImg, function (err) {
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
process.chdir(__dirname);
var e = __dirname;
console.log("print1");
console.log(e);
console.log("print2");
var curr_path = e.slice(0, -4);
console.log(curr_path);
console.log("print3");
// File .zip contenente le immagini, salvato su DropBox
var url = 'https://www.dropbox.com/s/z69a02qihjffndx/ImmaginiPA.zip?dl=0';
PresenzaImmagini(curr_path, url);
EstrazioneImmagini(curr_path);
