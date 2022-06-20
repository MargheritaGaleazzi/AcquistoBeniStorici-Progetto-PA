import * as Middleware from './middlewareRichieste';


export const Richieste = [
    
];

export const FiltroTipoAnno = [
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
