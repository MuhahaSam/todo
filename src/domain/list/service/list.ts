import ListRepostiory from "../repository.ts/list";
import PersonRepository from "../../../auth/repostitory/person";
import PermissionCheckService from "../../permission/service/permissionCheck";
import { List } from "../entity/list";

import { exceptionName } from "../../../exception/exceptions";
export default class ListService{
    private readonly listrepository = new ListRepostiory()
    private readonly personRepository = new PersonRepository()
    
    private readonly permissioncheckService = new PermissionCheckService()

    async create(personName: string, title: string){
        const person = await this.personRepository.findByName(personName)
        if (!person) throw new Error(exceptionName.noData)
        return this.listrepository.create(person, title)
    }

    async delete(personName:string, title:string){
        if(!(await this.permissioncheckService.isOwner(personName, title)))
        throw new Error(exceptionName.permissionDenited)
        const existedList = await this.listrepository.findByTitle(title)
        if (!existedList) throw new Error(exceptionName.noData)
        await this.listrepository.delete(title)
    }

    async getPeronsAllList(personName: string): Promise<List[]>{
        return this.listrepository.list(personName)
    }
}