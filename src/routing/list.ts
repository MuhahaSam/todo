import Router from 'koa-router'

import JwtService from '../auth/service/jwt';
import ListService from '../domain/list/service/list';
import PermissionProcessService from '../domain/permission/service/permissionProcess'

import settings from '../settings';

import validator from "koa-yup-validator"
import { listTitleVal, listPermission } from './validators/list';
import { listRoute } from './routes';



const jwtService = new JwtService()
const listService = new ListService()
const permissionProcessService = new PermissionProcessService()

const listRouting = new Router()

export const permissionRoute: string = '/permission';

listRouting.post(listRoute, validator({body: listTitleVal}), async(ctx, next) => {
    // try{
        const { token, body : { title } } = ctx.request;

        if(jwtService.isValidToken(settings.access, token)){
            const personName = jwtService.decodeJwt(token!, settings.access)
            const newList = await listService.create(personName.personName, title)
            ctx.response.body = newList
            ctx.response.status = 200
        } else {
            ctx.response.body = 'non valid token'
            ctx.response.status = 403
        }

    /// TODO: Посмотреть как делать throw ошибок, чтобы избавиться от ручной установки status'а response
    /// https://www.digitalocean.com/community/tutorials/how-to-build-a-hello-world-application-with-koa

    // } catch (error){
    //     if(error instanceof Error){
    //         ctx.response.body = error.message
    //         ctx.response.status = 403
    //     } else {
    //         ctx.response.body = 'unexpested Error'
    //         ctx.response.status = 403
    //     }
    // }
    await next
})

listRouting.delete(listRoute, validator({query: listTitleVal}), async(ctx, next)=>{
    try{
        if(jwtService.isValidToken(settings.access, ctx.request.token)){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access)
            await listService.delete(personName.personName, ctx.request.query.title as string)
            ctx.response.status = 200

        } else {
            ctx.response.body = 'non valid token'
            ctx.response.status = 403
        }

    } catch (error){
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


listRouting.put(listRoute + permissionRoute, validator({body: listPermission}), async(ctx, next)=>{
    try{
        // jwtService.isValidToken(settings.access, ctx.request.token)
        if(true){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access).personName
            await permissionProcessService.manage( 
                ctx.request.body.action,
                personName,
                ctx.request.body.personName, 
                ctx.request.body.listTitle, 
                ctx.request.body.permission
                )
            ctx.response.status = 200

        } else {
            ctx.response.body = 'non valid token'
            ctx.response.status = 403
        }

    } catch (error){
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

export default listRouting