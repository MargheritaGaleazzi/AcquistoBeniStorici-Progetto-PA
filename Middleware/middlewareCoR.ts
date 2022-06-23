import * as Middleware from './middlewareRichieste';

export const FiltroTipoAnno = [
    Middleware.verificaContentType,
    Middleware.controlloValoriFiltro
];

export const AcquistoBene = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriAcquistoBene,
    Middleware.ControlloCredito,
    Middleware.controlloFormatoImmagine,   
]

export const ControlloDownload = [
    Middleware.controlloDownload
]

export const Regalo = [
    Middleware.controlloDownloadRegalo
]

export const JWT = [
    Middleware.controlloPresenzaToken,
    Middleware.ControlloChiaveSegreta
]

export const Admin = [
    Middleware.controlloValoriRicarica,
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloPresenzaAdmin,
    Middleware.ControlloAdmin
]

export const RottaSbagliata = [
    Middleware.RottaNonTrovata
]