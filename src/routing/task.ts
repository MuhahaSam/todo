import Router from 'koa-router'

import JwtService from '../auth/service/jwt';
import TaskService from '../domain/task/service/task';

import settings from '../settings';

import { exceptionsCode } from '../exception/exceptions';

import validator from "koa-yup-validator"
import { 
    taskVal, 
    taskCompleteness, 
    taskDescription, 
    taskOne,
    taskAll } 
from './validators/task';

const jwtService = new JwtService()
const taskService = new TaskService()

const taskRouter = new Router()




taskRouter.post('/api/v1/task',validator({body: taskVal}), async(ctx, next)=>{
    try{
        if(jwtService.isValidToken(settings.access, ctx.request.token)){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access).personName
            const task = await taskService.add(
                personName, 
                ctx.request.body.listTitle,
                ctx.request.body.taskTitle,
                ctx.request.body.description,
                ctx.request.body.duration)
            ctx.response.body = task
            ctx.response.status = 200
        }

    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = exceptionsCode[error.message] ? exceptionsCode[error.message] : 500
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 500
        }
    }
    await next
})

taskRouter.put('/api/v1/task/completeness',validator({body: taskCompleteness}), async(ctx, next)=>{
    try{
        if(jwtService.isValidToken(settings.access, ctx.request.token)){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access).personName
            await taskService.updateCompleteness(personName, ctx.request.body.listTitle, ctx.request.body.taskTitle,  ctx.request.body.value)
            ctx.response.status = 200 
        }
    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = exceptionsCode[error.message] ? exceptionsCode[error.message] : 500
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 500
        }
    }
    await next})

taskRouter.put('/api/v1/task/description',validator({body: taskDescription}), async(ctx, next)=>{
    try{
        if(jwtService.isValidToken(settings.access, ctx.request.token)){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access).personName
            await taskService.updateDescription(personName, ctx.request.body.listTitle, ctx.request.body.taskTitle,  ctx.request.body.value)
            ctx.response.status = 200
        }

    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = exceptionsCode[error.message] ? exceptionsCode[error.message] : 500
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 500
        }
    }
    await next
})

taskRouter.get('/api/v1/task', validator({query: taskOne}),async(ctx, next)=>{
    try{
        if(jwtService.isValidToken(settings.access, ctx.request.token)){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access).personName
            ctx.response.body = await taskService.getTaskFromList(
                personName,
                ctx.request.query.listTitle as string,
                ctx.request.query.taskTitle as string
            )
            ctx.response.status = 200
        }

    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = exceptionsCode[error.message] ? exceptionsCode[error.message] : 500
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 500
        }
    }
    await next
})

taskRouter.get('/api/v1/task/all', validator({query: taskAll}),async(ctx, next)=>{
    try{
        if(jwtService.isValidToken(settings.access, ctx.request.token)){
            const personName = jwtService.decodeJwt(ctx.request.token!, settings.access).personName
            ctx.response.body = await taskService.getAllTasksFromList(
                personName,
                ctx.request.query.listTitle as string
            )
            ctx.response.status = 200
        }

    } catch(error){
        if(error instanceof Error){
            ctx.response.body = error.message
            ctx.response.status = exceptionsCode[error.message] ? exceptionsCode[error.message] : 500
        } else {
            ctx.response.body = 'unexpested Error'
            ctx.response.status = 500
        }
    }
    await next
})




export default taskRouter