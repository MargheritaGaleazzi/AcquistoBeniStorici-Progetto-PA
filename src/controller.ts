import { Utente,Bene,Acquisto, Modo } from "./models/models";
import { MsgEnum, getMsg } from "./Messaggi/messaggi";
import * as path from 'path';
const admzip = require('adm-zip')
var zip = new admzip();
const curr_path=__dirname.slice(0,-4);
var outputFilePath = path.join(curr_path,"output.zip");

const fs_extra = require('fs-extra'); 
const fs = require('fs'),
    gm = require('gm')
 
//a me funziona
    
/*
 * Funzione che viene richiamata dalle altr funzioni del Controller in caso di errori. 
 * Richiama i metodi della Factory per costruire oggetti da ritornare al client nella risposta.
 * 
 * @param enumError -> Il tipo di errore da costruire
 * @param err -> l'errore a cui si va in contro
 * @param risp -> Risposta del server
 */
function controllerErrori(enumError: MsgEnum, err: Error, risp: any) {
    const nuovoErr = getMsg(enumError).getMsg();
    console.log(err);
    risp.status(nuovoErr.codice).json({errore:nuovoErr.codice, descrizione:nuovoErr.msg});
}

/*
 * Funzione che permette di visualizzare tutti i beni che sono presenti.
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


export function lista(risp: any): void{
    Bene.findAll().then((risultato: object[]) => {
        const new_res = getMsg(MsgEnum.ListaBeni).getMsg();
        risp.status(new_res.codice).json({message:new_res.msg, risultato:risultato});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/*
 * Funzione che permette di ottenere un nuovo link per il bene
 * acquistato
 */
export function nuovoLink(id_bene:number,formato_bene:string,compr:string, risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr}).then((acquisto:any)=>{
        Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download aggiuntivo"});
        Bene.findByPk(id_bene).then((bene:any)=>{
            Utente.decrement("credito",{by:1,where: { email: compr }});
            bene.nDownload+=1;
            bene.save();
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadAggiuntivo/"+bene.nDownload
        const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
        var link={bene:bene.nome, formato:acquisto.formato, link:urLink}
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
        });
}

/*
 * Funzione che permette di vedere gli acquisti
 * di un dato utente
 */
export function vediAcquisti(risp:any):void{
    Acquisto.findAll({include:Utente,order:[[Utente,'email','ASC']]}).then((acquisti:any)=>{
    const nuova_risp = getMsg(MsgEnum.VediAcquisti).getMsg();
            risp.status(nuova_risp.codice).json({message:nuova_risp.msg, risultato:acquisti});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
}

/*
 * Funzione che permette di acquistare più beni in
 * una volta
 */
export function acquistaMultiplo(ids:number[],formato_bene:string,compr:string,risp:any):void{
    risp.set({'Content-Disposition':'attachment'});
    risp.set({'Content-Type':'application/zip'})
    var i=1
    console.log(i)
ids.forEach(async id => {
    risp.headersSet=false
    var images:string[]=[]
    await Acquisto.create({formato:formato_bene,email_compr:compr}).then(async (acquisto:any)=>{
        await Modo.create({id_acquisto:acquisto.id,id_bene:id,tipo_acq:"download originale"});
        await Bene.findByPk(id).then(async (bene:any)=>{
            await Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
            bene.nDownload+=1;
            bene.save();
            const image=__dirname.slice(0,-4)+"\\img\\"+bene.nome
            zip.addLocalFile(image)
            //zip.toBuffer()
            console.log(image)

        },);
    
});
        if (i==ids.length){
            console.log('siamo già al download!!!!!!!!!!!!')
            console.log(i)
            console.log(ids.length)
            risp.send(zip.toBuffer());
        }
        i++
}
)
}

/*
 * Funzione che permette di fare un regalo ad un amico
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
 */
export function visualizzaCredito(email:string,risp:any):void{
    Utente.findByPk(email).then((utente:any)=>{
        var risposta={email_utente:utente.email, username:utente.username,credito:utente.credito}
        const nuova_risp = getMsg(MsgEnum.VediCredito).getMsg();
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:risposta});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
    })
}

/*
 * Funzione che permette all'amministratore di ricaricare
 * il credito di un dato utente
 */
export function ricarica(email:string,ricarica:number,risp:any){
    Utente.increment("credito",{by:ricarica,where: { email: email }}).then((utente:any)=>{
        const nuova_risp = getMsg(MsgEnum.RicaricaEffettuata).getMsg();
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg,utente:email ,ricarica:ricarica});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/***
 * Funzione per verificare la presenza delle immagini
 */ 

export function PresenzaImmagini(curr_path: string, url:any) {
    
    console.log("pippo2");
    console.log(url);
    fs.stat(path.join(curr_path, "/ImmaginiPA.zip"), (exists:any) => {
        if (exists == null) {
            EstrazioneImmagini(curr_path);
        } else if (exists.code === 'ENOENT') {
            console.log("Download delle immagini in corso...");
            const request = require('request');
            request({url: url, encoding: null}, function(err:any, resp:any, body:any) {
                if(err) throw err;
                fs.writeFile(path.join(curr_path, "/ImmaginiPA.zip"), body, function(err:any) {
                  console.log("file written!");
                  PresenzaImmagini(curr_path,url);
                });
            });
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
export function acquistaBene(id_bene:number,formato_bene:string,compr:string, risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr}).then((acquisto:any)=>{
    Modo.create({id_acquisto:acquisto.id,id_bene:id_bene,tipo_acq:"download originale"});
    Bene.findByPk(id_bene).then((bene:any)=>{
        Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
        bene.nDownload+=1;
        bene.save();
        const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadOriginale/"+bene.nDownload
        const nome="/img/"+bene.nome.toString();
        const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
        var link={bene:bene.nome, formato:acquisto.formato, link:urLink}
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
    });
    }
    
export function download(nome:string,formato:string,risp:any):void{
    risp.set({'Content-Disposition':'attachment'});
    risp.set({'ContentType':'image/png'});
    const pathImg=path.join(curr_path,"img/"+nome)
    const pathFil=path.join(curr_path,"img_doc/filigrana.png")
    const image = gm(pathImg).gravity('Center').fill('#ffffff')
    .font('Arial', 27) // I didn't wanted to play with fonts, so used normal default thing (:
            .drawText(0, 0, "CodinGirl").toBuffer('PNG',function (err:any, buffer:any) {
                if (err) return console.log('err');
                risp.send(buffer);
                console.log('done!');
              })
      
    
        
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
    const nuova_risp = getMsg(MsgEnum.ScaricaBene).getMsg();
    var link={bene:risultato.Bene.nome, formato:risultato.formato, link:url}
        risp.status(nuova_risp.codice).json({message:nuova_risp.msg, risultato:link});
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
    if (!err) console.log('Il link è codice creato correttamente, puoi scaricare l\'immagine');
    });
    const new_res = getMsg(MsgEnum.ScaricaBene).getMsg();
    var link={bene:risultato.Bene.nome, formato:risultato.formato, link:url}
        risp.status(new_res.codice).json({message:new_res.msg, risultato:link});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    })
}*/


// File .zip contenente le immagini, salvato su DropBox
var url ="https://www.dropbox.com/s/ozqwsscg7o026oq/ImmaginiPA.zip?dl=1";


PresenzaImmagini(curr_path,url);

/*
 * Funzione per creare il link ed aggiungere la filigrana
 *
 */
function scarica(bene:any, tipo:string,acquisto:any):string{
    var request = require('request');
    var nomeBene=bene.nome.split(".")[0]
    var url = "/download/"+nomeBene+"/"+tipo+"/"+acquisto.formato
    
    var pathToImg=path.join(curr_path,"/img/"+bene.nome)
    
    console.log(pathToImg)
    gm(pathToImg).command("display",function (err:any) {
    if (!err) console.log('Il link è codice creato correttamente, puoi scaricare l\'immagine');
    });
    return url;
}
/*
  .command('composite')
    .gravity('Center')
    .in('../img_doc/filigrana.png')
    .command('covert')
    .in(bene.nome)
    .out(nomeBene+"."+acquisto.formato)
    .toBuffer()
    */