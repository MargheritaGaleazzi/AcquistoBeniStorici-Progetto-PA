import * as Middleware from './middlewareRichieste';

export const FiltroTipoAnno = [
    Middleware.verificaContentType,
    Middleware.controlloValoriFiltro
];

export const AcquistoBene = [
    Middleware.controlloPresenzaUtente,
    Middleware.ControlloTokenNullo,
    Middleware.controlloAcquistoBene,
    Middleware.ControlloCredito,
    Middleware.controlloFormatoImmagine,
    Middleware.controlloDownload   
]

export const Regalo = [
    Middleware.controlloDownloadRegalo
]

export const JWT = [
    Middleware.controlloPresenzaToken,
    Middleware.ControlloChiaveSegreta
]

export const RottaSbagliata = [
    Middleware.RottaNonTrovata
]