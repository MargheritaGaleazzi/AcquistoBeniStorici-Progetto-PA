import * as MiddlewareJWT from './middlewareJWT';


export const NONJWT = [
    MiddlewareJWT.checkJSONPayload,
    MiddlewareJWT.checkPayloadHeader,
    MiddlewareJWT.errorHandler
];