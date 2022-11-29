import PermissionRepositoryCollection from '../repository/repostiroy.collection'

import { PermissionType } from "../entity/permission";

import { exceptionName } from "../../../exception/exceptions";

import * as _ from 'lodash'

export default class PermissionCheckService{
    private readonly repositories = new PermissionRepositoryCollection()

    async isOwner(ownerName: string, listTitle: string): Promise<boolean>{
        const personList = await this.repositories.personListRepository.find(ownerName, listTitle)
        if (!personList) return false
        return personList!.role === 'owner'
    }

    async isValidableAction(personName: string, listTitle: string, perm: PermissionType ):Promise<boolean>{
        const existedPermissions = await this.repositories.permissionRepository.find(personName, listTitle)
        return existedPermissions.includes(perm)
    }
}