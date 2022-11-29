
import jwt from 'jsonwebtoken'
import { TokenData } from '../entity/token.data';
import settings from '../../settings';

export default class JwtService{
    isValidToken(key: string, token?: string, ): boolean {
        if (!token) return false
        try {
            jwt.verify(token, key);
        } catch(err) {
            return false
        }
        return true
    }
    decodeJwt(token: string, key: string): TokenData{
        const decodeToken = jwt.verify(token, key, { complete: true }).payload as string
        return  JSON.parse(JSON.stringify(decodeToken)).data as TokenData
    }
}