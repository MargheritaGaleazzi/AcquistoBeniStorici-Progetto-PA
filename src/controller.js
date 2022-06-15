"use strict";
exports.__esModule = true;
exports.acquistaBene = exports.PresenzaImmagini = exports.ricarica = exports.visualizzaCredito = exports.regalo = exports.acquistaMultiplo = exports.vediAcquisti = exports.nuovoLink = exports.listaBeni = void 0;
var models_1 = require("./models/models");
var messaggi_1 = require("./factory/messaggi");
var path = require("path");
var request = require('superagent');
var fs_extra = require('fs-extra');
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
/*
 * Funzione che permette di ottenere un nuovo link per il bene
 * acquistato
 */
function nuovoLink(id, risp) { }
exports.nuovoLink = nuovoLink;
/*
 * Funzione che permette di vedere gli acquisti
 * di un dato utente
 */
function vediAcquisti(id, risp) { }
exports.vediAcquisti = vediAcquisti;
/*
 * Funzione che permette di acquistare più beni in
 * una volta
 */
function acquistaMultiplo(id, risp) { }
exports.acquistaMultiplo = acquistaMultiplo;
/*
 * Funzione che permette di fare un regalo ad un amico
 */
function regalo(id, risp) { }
exports.regalo = regalo;
/*
 * Funzione che permette di visualizzare il credito
 * residuo di un dato utente
 */
function visualizzaCredito(id, risp) { }
exports.visualizzaCredito = visualizzaCredito;
/*
 * Funzione che permette all'amministratore di ricaricare
 * il credito di un dato utente
 */
function ricarica(id, risp) { }
exports.ricarica = ricarica;
/***
 * Funzione per verificare la presenza delle immagini
 */
function PresenzaImmagini(curr_path, url) {
    console.log("pippo2");
    fs.stat(path.join(curr_path, "/ImmaginiPA.zip"), function (exists) {
        if (exists == null) {
        }
        else if (exists.code === 'ENOENT') {
            console.log("Download delle immagini in corso...");
            var http = require('https');
            var file_1 = fs.createWriteStream(path.join(curr_path, "/ImmaginiPA.zip"));
            var req = http.get(url, function (response) {
                response.pipe(file_1);
            });
        }
    });
}
exports.PresenzaImmagini = PresenzaImmagini;
/***
 * Funzione per estrarre le immagini dallo zip
*/
/*
export function EstrazioneImmagini(curr_path: string) {

    var unzip = require('unzip-stream');
    console.log("print6")
    var zip = path.join(curr_path, "/ImmaginiPA.zip")
    console.log(zip)
    var dir_path = path.join(curr_path, "/img");
    console.log(dir_path);
    try {
        fs_extra.createReadStream(zip).pipe(unzip.Extract({ path: dir_path }));
        console.log("Immagini estratte correttamente");
    }
    catch{
        console.log("zip non trovato");
    }
}
*/
/*
 * Funzione che permette di acquistare un bene
 */
function acquistaBene(id_bene, formato_bene, compr, risp) {
    models_1.Acquisto.create({ formato: formato_bene, email_compr: compr }).then(function (acquisto) {
        models_1.Modo.create({ id_acquisto: acquisto.id, id_bene: id_bene, tipo_acq: "download originale" });
        models_1.Bene.findByPk(id_bene).then(function (bene) {
            models_1.Utente.decrement("credito", { by: bene.prezzo, where: { email: compr } });
            bene.nDownload += 1;
            bene.save();
            scarica(bene, "DownloadOriginale", acquisto);
        });
    });
}
exports.acquistaBene = acquistaBene;
/*
 * Funzione che permette di scaricare un bene precedentemente acquistato
 */
/*
export function scaricaBene(id_acquisto:number, risp:any): void{
    Acquisto.findOne({
        where:{id:id_acquisto},
        raw:true
    }).then((risultato:any)=>{
        risultato.tipo_acq="download originale";
        
    // creazione dell'url per scaricare l'immagine
    scarica(id_acquisto,risultato,"DownloadOriginale")
    const nuova_risp = getMsg(MsgEnum.ScaricaBene).getMsgObj();
    var link={bene:risultato.Bene.nome, formato:risultato.formato, link:url}
        risp.status(nuova_risp.stato).json({message:nuova_risp.msg, risultato:link});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    })
}

    
    var pathToImg="../img/"+risultato.Bene.nome
    var nomeBene=risultato.Bene.nome.split(".")[0]
    gm(request(url))
    .command('composite')
    .gravity('Center')
    .in('../img_doc/filigrana.png')
    .command('covert')
    .in(risultato.Bene.nome)
    .out(nomeBene+risultato.formato)
    .write(pathToImg, function (err) {
    if (!err) console.log('Il link è stato creato correttamente, puoi scaricare l\'immagine');
    });
    const new_res = getMsg(MsgEnum.ScaricaBene).getMsgObj();
    var link={bene:risultato.Bene.nome, formato:risultato.formato, link:url}
        risp.status(new_res.stato).json({message:new_res.msg, risultato:link});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    })
}*/
process.chdir(__dirname);
var e = __dirname;
console.log("print1");
console.log(e);
console.log("print2");
var curr_path = e.slice(0, -4);
console.log(curr_path);
console.log("print3");
// File .zip contenente le immagini, salvato su DropBox
var url = "https://drive.google.com/uc?export=download&id=1xKG7DAtBxb6w_viuiC5cyAsbY385tI76";
PresenzaImmagini(curr_path, url);
//EstrazioneImmagini(curr_path);
/*
 * Funzione per creare il link ed aggiungere la filigrana
 *
 */
function scarica(bene, tipo, acquisto) {
    var request = require('request');
    var url = "www.codinggirl.com/" + tipo + bene.nome + bene.nDownload.toString() + "." + acquisto.formato;
    var pathToImg = "../img/" + bene.nome;
    var nomeBene = bene.nome.split(".")[0];
    gm(request(url))
        .command('composite')
        .gravity('Center')["in"]('../img_doc/filigrana.png')
        .command('covert')["in"](bene.nome)
        .out(nomeBene + "." + acquisto.formato)
        .write(pathToImg, function (err) {
        if (!err)
            console.log('Il link è stato creato correttamente, puoi scaricare l\'immagine');
    });
}
