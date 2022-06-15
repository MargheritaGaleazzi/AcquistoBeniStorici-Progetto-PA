import {Sequelize } from "sequelize";
import { Utente,Bene,Acquisto } from "./models/models";
import { MsgEnum, getMsg } from "./factory/messaggi";


var fs = require('fs'),
    gm = require('gm');

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
    var url = "www.codinggirl.com/"+ id_acquisto.toString +"OrigDwld"+risultato.formato
    
    var pathToImg="../img/"+risultato.Bene.nome+risultato.formato

    gm(request(url))
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