import * as Middleware from './middlewareRichieste';

export const FiltroTipoAnno = [
    Middleware.verificaContentType,
    Middleware.controlloValoriFiltro
];

export const AcquistoBene = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriAcquistoBene,
    Middleware.ControlloCredito,
    Middleware.controlloFormatoImmagine   
]

export const ControlloDownload = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriAcquistoBene,
    Middleware.controlloFormatoImmagine,
    Middleware.controlloDownload
]

export const JWT = [
    Middleware.controlloPresenzaToken,
    Middleware.ControlloChiaveSegreta
]

export const AdminRicarica = [
    Middleware.controlloValoriRicarica,
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloPresenzaAdmin,
    Middleware.ControlloAdmin
]

export const RottaSbagliata = [
    Middleware.RottaNonTrovata
]