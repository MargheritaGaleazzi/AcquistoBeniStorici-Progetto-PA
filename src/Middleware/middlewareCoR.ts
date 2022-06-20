import * as Middleware from './middlewareRichieste';


export const Richieste = [
    
];

export const FiltroTipoAnno = [
    Middleware.controlloValoriFiltro
];

export const AcquistoBene = [
    Middleware.controlloAcquistoBene,
    Middleware.controlloFormatoImmagine,
    Middleware.controlloPresenzaUtente
]
