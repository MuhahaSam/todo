import Router from 'koa-router'

import JwtService from '../auth/service/jwt';
import PersonService  from '../auth/service/person';

import settings from '../settings';

import validator from "koa-yup-validator"
import { 
    personVal,  
    personNameVal
} from './validators/person';


const personService = new PersonService()
const jwtService = new JwtService()
const personRouter = new Router()


personRouter.post('/api/v1/person',validator({ body:personVal }),async(ctx , next )=>{
    try{
        const tokens = await personService.register(ctx.request.body.personName, ctx.request.body.password)
        ctx.response.status = 200;
        ctx.response.body = tokens
    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = 403
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 403
        }
    }
    await next
})

personRouter.post('/api/v1/person/sigin', validator({ body:personVal }), async(ctx , next )=>{
try{
    const tokens = await personService.sigin(ctx.request.body.personName, ctx.request.body.password)
    ctx.response.body = tokens
    ctx.response.status = 200
} catch(error){
    if(error instanceof Error){
        ctx.response.body = error.message
        ctx.response.status = 403
    } else {
        ctx.response.body = 'unexpested Error'
        ctx.response.status = 403
    }
}
    await next
})

personRouter.post('/api/v1/person/sigout',validator({ body:personNameVal }),  async(ctx , next )=>{
    try{
        await personService.sigout(ctx.request.body.personName)
        ctx.response.status = 200
    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = 403
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 403
        }
    }
        await next
    })

personRouter.post('/api/v1/person/refresh', async(ctx , next )=>{
    try{
        if(jwtService.isValidToken(settings.refresh, ctx.request.token)){
            const newTokens = await personService.refreshJwt(ctx.request.token!)
            ctx.response.body = newTokens
            ctx.response.status = 200
        } else {
            ctx.response.body = 'invalid token'
            ctx.response.status = 403
        }
    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = 403
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 403
        }
    }
        await next
    })


export default personRouter