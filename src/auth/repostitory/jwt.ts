
import jwt from 'jsonwebtoken'
import { TokenData } from '../entity/token.data';
import settings from '../../settings';

export default class JwtRepository {
    async createJwt(data: TokenData): Promise<{ access: string; refresh: string; }> {
        const [accessToken , refreshToken]= await Promise.all([jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 5),
            data: data
          }, settings.access),
        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 *24 * 7),
            data: data
          }, settings.refresh)])
        return {
            access: accessToken,
            refresh: refreshToken
        }
    }

}