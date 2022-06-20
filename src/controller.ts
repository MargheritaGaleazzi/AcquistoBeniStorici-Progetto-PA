import { Utente,Bene,Acquisto, Modo } from "./models/models";
import { MsgEnum, getMsg } from "./Messaggi/messaggi";
import * as path from 'path';

const fs = require('fs'),
    gm = require('gm'),
    fs_extra = require('fs-extra'),
    admzip = require('adm-zip');

const curr_path=__dirname.slice(0,-4);
var zip = new admzip();
 
/*
 * Funzione che viene richiamata dalle altre funzioni del Controller in caso di errori. 
 * 
 * @param enumMsg -> Il tipo di messaggio da costruire
 * @param msg -> la situazione che si verifica
 * @param risp -> Risposta del server
 */
function controllerErrori(enumMsg: MsgEnum, msg: Error, risp: any) {
    const nuovoMsg = getMsg(enumMsg).getMsg();
    console.log(msg);
    risp.status(nuovoMsg.codice).json({errore:nuovoMsg.codice, descrizione:nuovoMsg.msg});
}

/*
 * Funzione che permette di visualizzare tutti i beni che sono presenti. Applicando 
 * filtri in base al tipo o all'anno del bene
 * 
 * @param tipo -> il tipo dei beni che si vogliono visualizzare nella risposta
 * @param anno -> l'anno dei beni che si vogliono visualizzare nella risposta
 * @param risp -> la risposta che darà il server
 */
 export function listaBeni(tipo: string, anno:number ,risp: any): void{
    if (anno==null){
        Bene.findAll({
            where: { tipo : tipo}, 
            raw: true
        }).then((risultato: object[]) => {
            const new_res = getMsg(MsgEnum.ListaBeni).getMsg();
            risp.status(new_res.codice).json({stato:new_res.msg, risultato:risultato});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    } else if (tipo==null) {
        Bene.findAll({
            where: {anno:anno}, 
            raw: true
        }).then((risultato: object[]) => {
            const new_res = getMsg(MsgEnum.ListaBeni).getMsg();
            risp.status(new_res.codice).json({stato:new_res.msg, risultato:risultato});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    } else {
    Bene.findAll({
        where: { tipo : tipo, anno:anno}, 
        raw: true
    }).then((risultato: object[]) => {
        const new_res = getMsg(MsgEnum.ListaBeni).getMsg();
        risp.status(new_res.codice).json({stato:new_res.msg, risultato:risultato});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}
}

/*
 * Funzione che permette di visualizzare tutti i beni che sono presenti
 * 
 * @param risp -> la risposta che darà il server
 */
export function lista(risp: any): void{
    Bene.findAll().then((risultato: object[]) => {
        const new_res = getMsg(MsgEnum.ListaBeni).getMsg();
        risp.status(new_res.codice).json({stato:new_res.msg, risultato:risultato});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/*
 * Funzione che permette di ottenere un nuovo link per il bene
 * acquistato, di cui si era già quindi avuto un altro link
 * 
 * @param id_bene -> numero identificativo del bene di cui si vuole un secondo link
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param risp -> la risposta che darà il server
 */
export function nuovoLink(id_bene:number,formato_bene:string,compr:string, risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr}).then((acquisto:any)=>{
        Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download aggiuntivo"});
        Bene.findByPk(id_bene).then((bene:any)=>{
            Utente.decrement("credito",{by:1,where: { email: compr }});
            bene.nDownload+=1;
            bene.save();
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadAggiuntivo/"+bene.nDownload;
            const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
            var link={bene:bene.nome, formato:acquisto.formato, link:urLink};
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
        });
}

/*
 * Funzione che permette di vedere gli acquisti che sono stati effettuati e
 * l'utente che li ha fatti
 * 
 * @param risp -> la risposta che darà il server
 */
export function vediAcquisti(risp:any):void{
    Acquisto.findAll({include:Utente,order:[[Utente,'email','ASC']]}).then((acquisti:any)=>{
        const nuova_risp = getMsg(MsgEnum.VediAcquisti).getMsg();
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:acquisti});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/*
 * Funzione che permette di acquistare più beni in
 * una volta e restituisce uno zip contenente tutti i beni
 * 
 * @param ids -> array contenente gli id di tutti i beni da acquistare
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param risp -> la risposta che darà il server
 */
export function acquistaMultiplo(ids:number[],formato_bene:string,compr:string,risp:any):void{
    risp.set({'Content-Disposition':'attachment'});
    risp.set({'Content-Type':'application/zip'});
    var i:number=1;
    ids.forEach(async id => {
        risp.headersSet=false
        await Acquisto.create({formato:formato_bene,email_compr:compr}).then(async (acquisto:any)=>{
            await Modo.create({id_acquisto:acquisto.id,id_bene:id,tipo_acq:"download originale"});
            await Bene.findByPk(id).then(async (bene:any)=>{
                await Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
                bene.nDownload+=1;
                bene.save();
                const image=__dirname.slice(0,-4)+"\\img\\"+bene.nome;
                zip.addLocalFile(image);
        });
    
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
        if (i==ids.length){
            const nuova_risp = getMsg(MsgEnum.VediAcquisti).getMsg();
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg});
            risp.send(zip.toBuffer());
        }
        i++
    });
}

/*
 * Funzione che permette di fare un regalo ad un amico
 *
 * @param email_amico -> email dell'utente al quale si vuole fare un regalo
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param id_bene -> id del bene che si vuole regalare
 * @param risp -> la risposta che darà il server
 */
export function regalo(email_amico:string,formato_bene:string,compr:string,id_bene:number,risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr}).then((acquisto:any)=>{
        Bene.findByPk(id_bene).then((bene:any)=>{
            if (bene.nDownload==0){
                Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download originale"});
            } else{
                Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download aggiuntivo"});
            }
            Utente.decrement("credito",{by:bene.prezzo+0.5,where: { email: compr }});
            bene.nDownload+=1;
            bene.save();
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadRegalo/"+bene.nDownload
            const nome="/img/"+bene.nome.toString();
            const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
            var link={bene:bene.nome, formato:acquisto.formato, link:urLink}
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
        });
}

/*
 * Funzione che permette di visualizzare il credito
 * residuo di un dato utente
 * 
 * @param email -> email dell'utente del quale si vuole sapere il credito residuo
 * @param risp -> la risposta che darà il server
 */
export function visualizzaCredito(email:string,risp:any):void{
    Utente.findByPk(email).then((utente:any)=>{
        var risposta={email_utente:utente.email, username:utente.username,credito:utente.credito};
        const nuova_risp = getMsg(MsgEnum.VediCredito).getMsg();
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:risposta});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/*
 * Funzione che permette all'amministratore di ricaricare
 * il credito di un dato utente
 * 
 * @param email -> email dell'utente al quale si vuole ricaricare il credito
 * @param ricarica -> il numero di crediti che gli si vogliono dare
 * @param risp -> la risposta che darà il server
 */
export function ricarica(email:string,ricarica:number,risp:any):void{
    Utente.increment("credito",{by:ricarica,where: { email: email }}).then((utente:any)=>{
        const nuova_risp = getMsg(MsgEnum.RicaricaEffettuata).getMsg();
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg,utente:email ,ricarica:ricarica});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/*
 * Funzione per verificare la presenza delle immagini
 * 
 * @param curr_path -> percorso della cartella nella quale è contenuto il programma
 * @param url -> url dal quale scaricare lo zip contenente le immagini
 */ 
export function PresenzaImmagini(curr_path: string, url:any):void {
    fs.stat(path.join(curr_path, "/ImmaginiPA.zip"), (exists:any) => {
        if (exists == null) {
            EstrazioneImmagini(curr_path);
        } else if (exists.code === 'ENOENT') {
            console.log("Download delle immagini in corso...");
            const request = require('request');
            request({url: url, encoding: null}, function(err:any, resp:any, body:any) {
                if(err) throw err;
                fs.writeFile(path.join(curr_path, "/ImmaginiPA.zip"), body, function(err:any) {
                  console.log("Il file è stato scritto");
                  PresenzaImmagini(curr_path,url);
                });
            });
        }
    });
}

/*
 * Funzione per estrarre le immagini dallo zip
 * 
 * @param curr_path -> percorso della cartella nella quale è contenuto il programma
*/  
export function EstrazioneImmagini(curr_path: string) {
    var unzip = require('unzip-stream');
    var zip = path.join(curr_path, "/ImmaginiPA.zip");
    var dir_path = path.join(curr_path, "/img");
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
 *
 * @param id_bene -> numero che identifica il bene da acquistare
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param risp -> la risposta che darà il server
 */
export function acquistaBene(id_bene:number,formato_bene:string,compr:string, risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr}).then((acquisto:any)=>{
        Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download originale"});
        Bene.findByPk(id_bene).then((bene:any)=>{
            Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
            bene.nDownload+=1;
            bene.save();
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadOriginale/"+bene.nDownload
            const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
            var link={bene:bene.nome, formato:acquisto.formato, link:urLink};
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    });
}

/*
 * Funzione che permette eseguire il download di un bene acquistato
 *
 * @param nome -> nome del bene acquistato
 * @param formato -> stringa che identifica il formato richiesto dall'acquirente
 * @param risp -> la risposta che darà il server
 */
export function download(nome:string,formato:string,risp:any):void{
    const pathImg=path.join(curr_path,"img/"+nome);
    try {gm(pathImg).gravity('Center')
        .fill('#ff0080')
        .font(path.join(curr_path,'img/Black Ravens.ttf'), 40) 
        .drawText(0, 0, "CodinGirl")
        .toBuffer('PNG',function (err:any, buffer:any) {
            if (err) return console.log('err');
            risp.set('Content-Disposition','attachment')
            risp.end(buffer);
            
            console.log('done!');
            })
    } catch {
        ((error:any) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    }
}
  
// File .zip contenente le immagini, salvato su DropBox
var url ="https://www.dropbox.com/s/ozqwsscg7o026oq/ImmaginiPA.zip?dl=1";
//chiamata alla funzione che verifica la presenza delle immagini e le scarica se necessario
PresenzaImmagini(curr_path,url);