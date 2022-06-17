import * as Middleware from './middlewareRichieste';


export const Richieste = [
    Middleware.verificaJSONPayload
];

export const FiltroTipoAnno = [
    Middleware.controlloValoriFiltro
];
