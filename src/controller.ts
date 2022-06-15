import {Sequelize} from "sequelize";
import { Utente,Bene,Acquisto } from "./models/models";
import { MsgEnum, getMsg } from "./factory/messaggi";
import * as path from 'path';
import { saveAs } from 'file-saver';

const request = require('superagent');
var fs_extra = require('fs-extra'); 
var fs = require('fs'),
    gm = require('gm'),
    imageMagick = gm.subClass({imageMagick: true});

/*
 * Funzione che viene richiamata dalle altr funzioni del Controller in caso di errori. 
 * Richiama i metodi della Factory per costruire oggetti da ritornare al client nella risposta.
 * 
 * @param enumError -> Il tipo di errore da costruire
 * @param err -> l'errore a cui si va in contro
 * @param risp -> Risposta del server
 */
function controllerErrori(enumError: MsgEnum, err: Error, risp: any) {
    const nuovoErr = getMsg(enumError).getMsgObj();
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
 export function listaBeni(tipo: string, anno:number ,risp: any): void{
    Bene.findAll({
        where: { tipo : tipo, anno:anno}, 
        raw: true
    }).then((risultato: object[]) => {
        const new_res = getMsg(MsgEnum.ListaBeni).getMsgObj();
        risp.status(new_res.stato).json({message:new_res.msg, risultato:risultato});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/***
 * Funzione per verificare la presenza delle immagini
 */ 
export function PresenzaImmagini(curr_path: string, url) {
    
    //var exist_zip = path.join(curr_path, "/ImmaginiPA.zip")
    console.log("pippo2");
    fs.open(path.join(curr_path, "/ImmaginiPA.zip"),'r',function(err,fd){
        if (err && err.code=='ENOENT') { 
            console.log("Download delle immagini in corso...");
        
            var XMLHttpRequest = require('xhr2');
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";

            xhr.onload = function () {
                saveAs(this.response, 'ImmaginiPA.zip'); // saveAs is a part of FileSaver.js
            };
            xhr.send();


        }
            
            
    });
}
 

/***
 * Funzione per estrarre le immagini dallo zip
*/  
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
 

/*
 * Funzione che permette di acquistare un bene
 */
//export function acquistaBene(id:number)


/*
 * Funzione che permette di scaricare un bene precedentemente acquistato
 */
export function scaricaBene(id_acquisto:number, risp:any): void{
    Acquisto.findOne({
        where:{id:id_acquisto},
        raw:true
    }).then((risultato:any)=>{
        risultato.tipo_acq="download originale";
        
    // passing a downloadable image by url 
    var request = require('request');
    var url = "www.codinggirl.com/"+ id_acquisto.toString +"OrigDwld."+risultato.formato

    
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
}

process.chdir(__dirname);
var e = __dirname;
console.log("print1")
console.log(e);
console.log("print2")
var curr_path = e.slice(0,-4);
console.log(curr_path)
console.log("print3")
// File .zip contenente le immagini, salvato su DropBox
var url ="https://www.dropbox.com/s/ozqwsscg7o026oq/ImmaginiPA.zip?dl=1";

PresenzaImmagini(curr_path,url);

EstrazioneImmagini(curr_path);