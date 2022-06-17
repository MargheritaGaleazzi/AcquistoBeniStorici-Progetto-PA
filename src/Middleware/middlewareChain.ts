import * as MiddlewareJWT from './middlewareJWT';


export const NONJWT = [
    MiddlewareJWT.checkJSONPayload
];