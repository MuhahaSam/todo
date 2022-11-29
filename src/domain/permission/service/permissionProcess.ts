import PermissionRepositoryCollection from '../repository/repostiroy.collection'
import { PermissionType } from "../entity/permission";
import PermissionCheckService from './permissionCheck';
import { exceptionName } from '../../../exception/exceptions';

export default class PermissionProcessService{
    private readonly repositories = new PermissionRepositoryCollection()
    private readonly permissionCheckService = new PermissionCheckService()

    async manage(action:'give' | 'take',ownerName:string , contributorName: string, listTitle: string, perms: PermissionType[]){

        if (!(await this.permissionCheckService.isOwner(ownerName, listTitle)))
        throw new Error( exceptionName.permissionDenited)

        if (await this.permissionCheckService.isOwner(contributorName, listTitle)) 
        throw new Error(exceptionName.alreadyExist)

        let existedPersonList = await this.repositories.personListRepository.find(contributorName, listTitle)

        const [contributorPerson, list] = await Promise.all([
            this.repositories.personRepostiroy.findByName(contributorName), 
            this.repositories.listRepository.findByTitle(listTitle)
        ])

        let contributorPersonList
        if(existedPersonList) {
            contributorPersonList = existedPersonList

        } else{
            contributorPersonList = await this.repositories.personListRepository.create({
                person_id: contributorPerson!.id!,
                list_id: list!.id!,
                role: 'contributor'
            })
            await this.repositories.permissionRepository.init(contributorPersonList.id!, 'contributor')
        }
        await this.repositories.permissionRepository.manage(action, contributorPersonList.id!, perms)
    }

}