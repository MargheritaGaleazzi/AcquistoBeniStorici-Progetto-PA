import * as Middleware from './middlewareRichieste';

export const FiltroTipoAnno = [
    Middleware.verificaContentType,
    Middleware.controlloValoriFiltro,
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
    Middleware.controlloDownload
]

export const NuovoLink = [
    Middleware.ControlloPresenzaUser,
    Middleware.ControlloUser,
    Middleware.ControlloTokenNullo,
    Middleware.controlloValoriNuovoLink,
    Middleware.controlloPresenzaAcquisto
]

export const JWT = [
    Middleware.controlloPresenzaToken,
    Middleware.ControlloChiaveSegreta
]

export const VediCredito = [
    Middleware.ValMailCredito,
    Middleware.ControlloPresenzaUser
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

export const NuovoBene = [
    Middleware.ControlloPresenzaAdmin,
    Middleware.ControlloAdmin,
    Middleware.controlloValoriBene,
    Middleware.controlloNomeBene,
    Middleware.controlloImgUnivoca
]


export const RottaSbagliata = [
    Middleware.RottaNonTrovata
]