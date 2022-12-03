import ListRepostiory from "../repository/list";
import PersonRepository from "../../../auth/repostitory/person";
import PermissionCheckService from "../../permission/service/permissionCheck";
import { List } from "../entity/list";
import { exceptionName } from "../../../exception/exceptions";


export default class ListService {
    private readonly listRepository = new ListRepostiory();
    private readonly personRepository = new PersonRepository();
    private readonly permissionCheckService = new PermissionCheckService();

    async create(personName: string, title: string) {
        const person = await this.personRepository.findByName(personName)
        if (!person) throw new Error(exceptionName.noData)
        return this.listRepository.create(person, title)
    }

    async delete(personName: string, title: string) {
        const isOwner = await this.permissionCheckService.isOwner(personName, title);
        if (!isOwner) throw new Error(exceptionName.permissionDenited)
        const existedList = await this.listRepository.findByTitle(title)
        if (!existedList) throw new Error(exceptionName.noData)
        await this.listRepository.delete(title)
    }

    async getPeronsAllList(personName: string): Promise<List[]> {
        return this.listRepository.list(personName)
    }
}
