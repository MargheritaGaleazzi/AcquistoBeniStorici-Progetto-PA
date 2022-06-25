import * as path from 'path';

const gm = require('gm'),
      fs = require('fs'),
      fs_extra = require('fs-extra')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
    const curr_path=__dirname

/**
 * Funzione che controlla se la variabile passata è un URL oppure no
 * 
 * @param urlDaVerificare -> variabile di cui si vuole eseguire la verifica
 * @returns -> false se non è un URL altrimenti il protocollo
 */
export function ValidHttpUrl(urlDaVerificare:string) {
    let url;
    
    try {
      url = new URL(urlDaVerificare);
    } catch (_) {
      return false;  
    }
    if (urlDaVerificare.match(/\.(jpeg|jpg|gif|png)$/) != null){
        if(checkImage(url)){
            return url.protocol === "http:" || url.protocol === "https:"
        }
    }
    
    return false;
  }

function checkImage(url:any):boolean {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function() {
      if (request.status == 200) //if(statusText == OK)
      {
        return true;
      } else {
        return false;
      }
    }
    return true
  }

  
/**
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

/**
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

/**
 * Funzione utilizzata per selezionare il formato dell'immagine richiesto dall'utente
 * 
 * @param formato prende in ingresso il formato richiesto
 * @returns la stringa contentente il formato richiesto
 */
 export function selFormato(formato:string):string{
    var tipo:string='';
    switch(formato){
        case 'png':
            tipo='PNG';
            break;
        case 'jpg':
            tipo='JPG';
            break;
        case 'tiff':
            tipo='TIFF';
            break;
    }
    return tipo;
}

export function filigrana(immagine:string):any{
    return gm()
    .command("composite") 
    .in("-gravity", "center")
    .in("-dissolve",78)
    .in(path.join(curr_path,'img_doc/filigrana.png'))
    .in(immagine)
}