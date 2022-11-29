import PersonRepository from '../repostitory/person'
import JwtRepository from "../repostitory/jwt";

import JwtService from './jwt';
import settings from "../../settings";
import jwt from 'jsonwebtoken'
import * as argon from 'argon2'

import { exceptionName } from '../../exception/exceptions'

export default class PersonService{
    private readonly personRepository = new  PersonRepository()
    private readonly jwtRepository = new JwtRepository()
    private readonly jwtService = new JwtService()


    async register(personName: string, password: string): Promise<{ access: string; refresh: string; }> {
        const person = await this.personRepository.findByName(personName)
        if (person) throw new Error(exceptionName.alreadyExist)
        const tokens = await this.jwtRepository.createJwt({personName: personName})
        await this.personRepository.create({
            name: personName,
            password: await argon.hash(password),
            access_token: tokens.access,
            refresh_token: tokens.refresh
        })
        return tokens
    }

    async sigin(personName: string, password: string): Promise<{access: string, refresh: string}> {
        const person = await this.personRepository.findByName(personName)
        if (!person) throw new Error(exceptionName.noData)
        if (!(await argon.verify(person.password, password))) throw new Error(exceptionName.permissionDenited)
        const tokens =await this.setJwt(personName)
        return tokens
    }

    async sigout(personName: string): Promise<void> {
        await this.personRepository.deleteJwt(personName)
    }

    async refreshJwt(refreskToken: string): Promise<{ access: string; refresh: string; }> {
        const name = this.jwtService.decodeJwt(refreskToken, settings.refresh).personName
        let person = await this.personRepository.findByName(name)

        if(!person) throw new Error('no such person') 
        if(person.refresh_token !== refreskToken) throw new Error(exceptionName.permissionDenited)
        const newTokens = await this.setJwt(name)
        return newTokens
    }

    private async setJwt(personName: string): Promise<{ access: string; refresh: string; }> {
        const newTokens = await this.jwtRepository.createJwt({personName: personName})
        await this.personRepository.updateJWT(personName, newTokens)
        return newTokens
    }
}