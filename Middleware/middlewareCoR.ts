import * as Middleware from './middlewareRichieste';

export const FiltroTipoAnno = [
    Middleware.verificaContentType,
    Middleware.controlloValoriFiltro,
    Middleware.controlloTipoAnno,
    Middleware.controlloTipo,
    Middleware.controlloAnno
];

export const AcquistoBene = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriAcquistoBene,
    Middleware.controlloPresenzaBene,
    Middleware.ControlloCredito,
    Middleware.controlloFormatoImmagine   
]

export const ControlloDownload = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriDownload,
    Middleware.controlloPresenzaAcquisto,
    Middleware.controlloDownload,
    Middleware.controlloProprietarioAcquisto
]

export const NuovoLink = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriNuovoLink,
    Middleware.controlloPresenzaAcquisto,
    Middleware.controlloProprietarioAcquisto
]

export const VediAcquisti = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo
]

export const JWT = [
    Middleware.controlloPresenzaToken,
    Middleware.ControlloChiaveSegreta
]

export const VediCredito = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.ControlloPresenzaUtente
]

export const AdminRicarica = [
    Middleware.controlloValoriRicarica,
    Middleware.controlloPositivita,
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloPresenzaAdmin,
    Middleware.ControlloAdmin
]

export const NuovoUtente = [
    Middleware.ControlloPresenzaAdmin,
    Middleware.ControlloAdmin,
    Middleware.controlloValoriNuovoUtente,
    Middleware.valMailNuovoConsumatore,
    Middleware.EmailUnivoca
]

export const Multiplo = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriAcquistoMultiplo,
    Middleware.controlloPresenzaBeni,
    Middleware.ControlloCreditoAcquistoMultiplo,
    Middleware.controlloFormatoImmagine
]

export const Regalo = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriAcquistoBene,
    Middleware.controlloPresenzaBene,
    Middleware.ControlloCredito,
    Middleware.controlloFormatoImmagine,
    Middleware.valMailAmico
]

export const RottaSbagliata = [
    Middleware.RottaNonTrovata
]