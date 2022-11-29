import TaskRepositoiewCollection from "../repository/repository.collection";

import PermissionCheckService from "../../permission/service/permissionCheck";

import { Task } from "../entity/task";

import { exceptionName } from "../../../exception/exceptions";
import { PermissionType } from "../../permission/entity/permission";
import {taskMapper} from '../mapper/rask.mapper'
export default class TaskService{
    private readonly taskRepColl = new TaskRepositoiewCollection
    private readonly permissionCheckService = new PermissionCheckService()
    
    async add(personName: string, listTitle: string, taskTitle: string, description: string, duration?: number): Promise<Task>{

        await this.throwExceptIfNoPerms(personName, listTitle, 'create')

        const list = await this.taskRepColl.listRep.findByTitle(listTitle)
        const person = await this.taskRepColl.personRep.findByName(personName)
        if(!person || !list) throw new Error('person or list not exist')
        let date = new Date()

        if (await this.taskRepColl.taskRep.find(taskTitle, list.id!)) throw new Error(exceptionName.alreadyExist)
        return this.taskRepColl.taskRep.create(taskMapper({
            title: taskTitle,
            description: description,
            person_id: person.id!,
            list_id: list.id!,
            end_date: duration ? new Date(date.setDate(date.getDate() + duration)) : null
        }))
    }
    async updateCompleteness(personName: string, listTitle: string, taskTitle:string, completeness: number){
        const list = await this.taskRepColl.listRep.findByTitle(listTitle)
        const person = await this.taskRepColl.personRep.findByName(personName)

        if(!person || !list) throw new Error(exceptionName.noData)
        await this.throwExceptIfNoPerms(personName, list!.title, 'update')
        
        if (!person || !list) throw new Error(exceptionName.noData)
        await this.taskRepColl.taskRep.updateCompleteness(taskTitle,list.id!, person.id!, completeness)
    }

    async updateDescription(personName:string,listTitle: string ,taskTitle: string, description: string ){
        const list = await this.taskRepColl.listRep.findByTitle(listTitle)
        if(!list) throw new Error(exceptionName.noData)
        await this.throwExceptIfNoPerms(personName, list.title, 'update')
        await this.taskRepColl.taskRep.updatedescription(taskTitle, list.id!, description)
    }

    async closeTask(personName:string, taskTitle: string){
        const list = (await this.taskRepColl.listRep.findByTasktitle(taskTitle))
        if(!list) throw new Error(exceptionName.noData)
        await this.throwExceptIfNoPerms(personName, list.title, 'delete')
        await this.taskRepColl.taskRep.delete(taskTitle, list.id!)
    }

    async getTaskFromList(personName: string, listTitle: string, taskTitle:string): Promise<Task | null>{
        const list = await this.taskRepColl.listRep.findByTitle(listTitle)
        if(!list) throw new Error(exceptionName.noData)
        await this.throwExceptIfNoPerms(personName, listTitle, 'read')
        return this.taskRepColl.taskRep.find(taskTitle, list.id!)
    }

    async getAllTasksFromList(personName: string, listTitle: string): Promise<Task[]>{
        const list = await this.taskRepColl.listRep.findByTitle(listTitle)
        if(!list) throw new Error(exceptionName.noData)
        await this.throwExceptIfNoPerms(personName, list.title, 'read')
        return this.taskRepColl.taskRep.list(list.id!)
    }

    private async throwExceptIfNoPerms(personName: string, listTitle: string, action: PermissionType){
        if (!(await this.permissionCheckService.isValidableAction(personName, listTitle, action)))
        throw new Error(exceptionName.permissionDenited)
    }
}