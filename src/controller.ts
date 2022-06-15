import {Sequelize} from "sequelize";
import { Utente,Bene,Acquisto, Modo } from "./models/models";
import { MsgEnum, getMsg } from "./factory/messaggi";
import * as path from 'path';
import { saveAs } from 'file-saver';


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

/*
 * Funzione che permette di ottenere un nuovo link per il bene
 * acquistato
 */
export function nuovoLink(id:number,risp:any){}

/*
 * Funzione che permette di vedere gli acquisti
 * di un dato utente
 */
export function vediAcquisti(id:number,risp:any){}

/*
 * Funzione che permette di acquistare più beni in
 * una volta
 */
export function acquistaMultiplo(id:number,risp:any){}

/*
 * Funzione che permette di fare un regalo ad un amico
 */
export function regalo(id:number,risp:any){}

/*
 * Funzione che permette di visualizzare il credito
 * residuo di un dato utente
 */
export function visualizzaCredito(id:number,risp:any){}

/*
 * Funzione che permette all'amministratore di ricaricare
 * il credito di un dato utente
 */
export function ricarica(id:number,risp:any){}
















/***
 * Funzione per verificare la presenza delle immagini
 */ 

export function PresenzaImmagini(curr_path: string, url:string) {
    
    console.log("pippo2");
    console.log(url);
    fs.stat(path.join(curr_path, "/ImmaginiPA.zip"), (exists) => {
        if (exists == null) {
        } else if (exists.code === 'ENOENT') {
            console.log("Download delle immagini in corso...");
        
            const http = require('https');
            const file = fs.createWriteStream(path.join(curr_path, "/ImmaginiPA.zip"));
            const request = http.get(url, function(response) {
              response.pipe(file);
            });
        }
    });

        }
            
 

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
export function acquistaBene(id_bene:number,formato_bene:string,compr:string, risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr}).then((acquisto:any)=>{
    Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download originale"});
    Bene.findByPk(id_bene).then((bene:any)=>{
        Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
        bene.nDownload+=1;
        bene.save();
        scarica(bene,"DownloadOriginale",acquisto)
    })
    });
}


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
console.log("print1")
console.log(e);
console.log("print2")
var curr_path = e.slice(0,-4);
console.log(curr_path)
console.log("print3")
// File .zip contenente le immagini, salvato su DropBox
var url ="https://drive.google.com/uc?export=download&id=1xKG7DAtBxb6w_viuiC5cyAsbY385tI76";


PresenzaImmagini(curr_path,url);
//EstrazioneImmagini(curr_path);

/*
 * Funzione per creare il link ed aggiungere la filigrana
 *
 */
function scarica(bene:any, tipo:string,acquisto:any):void{
    var request = require('request');
    var url = "www.codinggirl.com/"+tipo+bene.nome+bene.nDownload.toString()+"."+acquisto.formato
    
    var pathToImg="../img/"+bene.nome
    var nomeBene=bene.nome.split(".")[0]
    gm(request(url))
    .command('composite')
    .gravity('Center')
    .in('../img_doc/filigrana.png')
    .command('covert')
    .in(bene.nome)
    .out(nomeBene+"."+acquisto.formato)
    .write(pathToImg, function (err) {
    if (!err) console.log('Il link è stato creato correttamente, puoi scaricare l\'immagine');
    });
}
