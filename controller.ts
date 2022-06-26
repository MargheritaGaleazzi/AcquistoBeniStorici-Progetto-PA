import { Utente,Bene,Acquisto} from "./models/models";
import { MsgEnum, getMsg } from "./Factory/messaggi";
import * as path from 'path';
import { filigrana, PresenzaImmagini,selFormato} from "./utility";

const gm = require('gm'),
    admzip = require('adm-zip'),
    request = require('request')

const curr_path=__dirname
var zip = new admzip();

// File .zip contenente le immagini, salvato su DropBox
var url ="https://www.dropbox.com/s/viova118s4e0mu0/ImmaginiPA.zip?dl=1";
//chiamata alla funzione che verifica la presenza delle immagini e le scarica se necessario
PresenzaImmagini(curr_path,url);

/**
 * Funzione che viene richiamata dalle altre funzioni del Controller in caso di errori. 
 * 
 * @param enumMsg -> Il tipo di messaggio da costruire
 * @param msg -> la situazione che si verifica
 * @param risp -> Risposta del server
 */
function controllerErrori(enumMsg: MsgEnum, msg: Error, risp: any) {
    const nuovoMsg = getMsg(enumMsg).getMsg();
    risp.status(nuovoMsg.codice).json({errore:nuovoMsg.codice, descrizione:nuovoMsg.msg});
}

/**
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

/**
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

/**
 * Funzione che permette di ottenere un nuovo link per il bene
 * acquistato, di cui si era già quindi avuto un altro link
 * 
 * @param id_acquisto -> numero identificativo dell'acquisto di cui si vuole ottenere un secondo link
 * @param risp -> la risposta che darà il server
 */
export function nuovoLink(id_acquisto:number, risp:any):void{
    Acquisto.findByPk(id_acquisto).then((acquisto:any)=>{
        acquisto.tipo_acq='download aggiuntivo';
        acquisto.save();
        Bene.findByPk(acquisto.beneId).then((bene:any)=>{
            Utente.decrement("credito",{by:bene.prezzo,where: { email: acquisto.email_compr }});
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+acquisto.formato+"/DownloadAggiuntivo/"+acquisto.id;
            const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
            var link={bene:bene.nome, formato:acquisto.formato, link:urLink};
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    });
}

/**
 * Funzione che permette di vedere gli acquisti che sono stati effettuati e
 * l'utente che li ha fatti
 * 
 * @param risp -> la risposta che darà il server
 */
export function vediAcquisti(risp:any):void{
    Acquisto.findAll({
        where:{},
        include:[
        {
            model:Utente,
            attributes:{ exclude: ['ruolo','credito'] },
            order:[[Utente,'email','ASC']]
        },{
            model:Bene,
        }],attributes: { exclude: ['email_compr','utenteEmail']}}).then((acquisti:any)=>{
        const nuova_risp = getMsg(MsgEnum.VediAcquisti).getMsg();
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:acquisti});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/**
 * Funzione che permette di acquistare più beni in
 * una volta e restituisce uno zip contenente tutti i beni
 * 
 * @param ids -> array contenente gli id di tutti i beni da acquistare
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param risp -> la risposta che darà il server
 */
export async function acquistaMultiplo(ids:number[],formato_bene:string,compr:string,risp:any):Promise<void>{
    risp.set({'Content-Disposition':'attachment'});
    risp.set({'Content-Type':'application/zip'});
    var i:number=1;
    ids.forEach(async id => {
        risp.headersSet=false
    await Acquisto.create({formato:formato_bene,email_compr:compr,beneId:id,tipo_acq:'download originale',nDownload:0}).then(async (acquisto:any)=>{
    await Bene.findByPk(id).then(async (bene:any)=>{
        await Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
                const image=path.join(curr_path,"img/"+bene.nome);
                const nomebene=bene.nome.split(".")[0]+"."+formato_bene;
                var tipo=selFormato(formato_bene);
                filigrana(image).toBuffer(tipo, function (err:any, buffer:any) {
                    if (err) return console.log(err);
                    zip.addFile(nomebene,buffer);
                    if (i==ids.length){
                        risp.send(zip.toBuffer());
                    }
                    i++
                    })
        });
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    });
}

/**
 * Funzione che permette di fare un regalo ad un amico
 *
 * @param email_amico -> email dell'utente al quale si vuole fare un regalo
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param id_bene -> id del bene che si vuole regalare
 * @param risp -> la risposta che darà il server
 */
export async function regalo(email_amico:string,formato_bene:string,compr:string,id_bene:number,risp:any):Promise<void>{
    await Acquisto.create({formato:formato_bene,email_compr:compr,beneId:id_bene,tipo_acq:"download originale",nDownload:0}).then((acquisto:any)=>{
         Bene.findByPk(id_bene).then((bene:any)=>{
             Utente.decrement("credito",{by:bene.prezzo+0.5,where: { email: compr }});
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadRegalo/"+acquisto.id
            const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
            var link={bene:bene.nome, regalato_a:email_amico,formato:acquisto.formato, link:urLink}
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    });
}

/**
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

/**
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
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg,utente:email,accredito:ricarica});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}

/**
 * Funzione che permette di acquistare un bene
 *
 * @param id_bene -> numero che identifica il bene da acquistare
 * @param formato_bene -> stringa che identifica il formato richiesto dall'acquirente
 * @param compr -> email dell'utente che vuole acquistare il bene
 * @param risp -> la risposta che darà il server
 */
export function acquistaBene(id_bene:number,formato_bene:string,compr:string, risp:any):void{
    Acquisto.create({formato:formato_bene,email_compr:compr,beneId:id_bene,tipo_acq:"download originale",nDownload:0}).then((acquisto:any)=>{
        Bene.findByPk(id_bene).then((bene:any)=>{
            Utente.decrement("credito",{by:bene.prezzo,where: { email: compr }});
            const urLink="http://localhost:8080/download/"+bene.nome+"/"+formato_bene+"/DownloadOriginale/"+acquisto.id
            const nuova_risp = getMsg(MsgEnum.AcquistaBene).getMsg();
            var link={bene:bene.nome, formato:acquisto.formato, link:urLink};
            risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, risultato:link});
        }).catch((error) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    });
}

/**
 * Funzione che permette eseguire il download di un bene acquistato
 *
 * @param nome -> nome del bene acquistato
 * @param formato -> stringa che identifica il formato richiesto dall'acquirente
 * @param risp -> la risposta che darà il server
 */
export function download(nome:string,formato:string,id_acquisto:number,risp:any):void{
    const pathImg=path.join(curr_path,"img/"+nome);
    var tipo:string=selFormato(formato);
    try {filigrana(pathImg).toBuffer(tipo,function (err:any, buffer:any) {
            if (err) return console.log('err');
            risp.set('Content-Disposition','attachment')
            risp.end(buffer);
            Acquisto.findByPk(id_acquisto).then((acquisto:any)=>{
                acquisto.nDownload+=1;
                acquisto.save()
            })

            })
    } catch {
        ((error:any) => {
            controllerErrori(MsgEnum.ErrServer, error, risp);
        });
    }
}

/**
 * Funzione che permette la registrazione nel database di un nuovo utente
 * che avrà il ruolo di 'user' e come credito 0
 * 
 * @param email -> email dell'utente da aggiungere
 * @param username -> username dell'utente
 * @param nome -> nome dell'utente da aggiungere
 * @param cognome -> Cognome dell'utente da aggiungere
 * @param risp -> la risposta che darà il server
 */
 export function aggiungiUtente(email:string, username:string, nome:string, cognome:string, risp: any): void{
    Utente.create({email:email,username:username, nome:nome,cognome:cognome,ruolo:'user',credito:0}).then((nuovoUtente:any)=>{
        const nuova_risp = getMsg(MsgEnum.NuovoUtente).getMsg();
        var ut={email:nuovoUtente.email, username:nuovoUtente.username, nome:nuovoUtente.nome, cognome:nuovoUtente.cognome,
        credito:nuovoUtente.credito};
        risp.status(nuova_risp.codice).json({stato:nuova_risp.msg, nuovo_utente:ut});
    }).catch((error) => {
        controllerErrori(MsgEnum.ErrServer, error, risp);
    });
}