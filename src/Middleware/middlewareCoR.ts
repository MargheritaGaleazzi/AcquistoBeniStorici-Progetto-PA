import * as Middleware from './middlewareRichieste';

export const FiltroTipoAnno = [
    Middleware.verificaContentType,
    Middleware.controlloValoriFiltro
];

export const AcquistoBene = [
    Middleware.controlloPresenzaUtente,
    Middleware.ControlloTokenNullo,
    Middleware.ControlloCredito,
    Middleware.controlloAcquistoBene,
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