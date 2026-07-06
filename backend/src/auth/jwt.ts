import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from './keys';

export interface TokenPayload {
    userId: string;
    organizationId: string;
}

export const signToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
    });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as TokenPayload;
};