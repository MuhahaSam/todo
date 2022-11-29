import { PermissionType } from "../entity/permission";
import { Permission } from "../entity/permission";
import { PermissionRole } from "../../list/entity/person_list";
import { PersonList } from "../../list/entity/person_list"; 
import prisma from "../../../db/prisma.client";

import { exceptionName } from "../../../exception/exceptions";

export default class PermissionRepository{
    async init(personListId: number , role: PermissionRole='owner'):Promise<Permission[]>{
        const perms: PermissionType[] = ['create','read', 'update', 'delete']
        const existedPermissions: Permission[] = await prisma.permission.findMany({
            where:{
                person_list_id: personListId,
                perm: {in: perms}
            }
        })
        if (existedPermissions.length > 0) throw new Error(exceptionName.alreadyExist)
        const newPermissions = perms.map((perm:PermissionType)=>{
        return {
            person_list_id: personListId,
            perm: perm,
            deleted_at: role === 'owner' ? null : new Date()
        }})
        return JSON.parse(JSON.stringify((await prisma.permission.createMany({ data: newPermissions }))))
    }

    async manage(action: 'give' | 'take', personListId: number, perms: PermissionType[]){
        await prisma.permission.updateMany({
            data: {
                deleted_at: action === 'give' ? null : new Date()
            },
            where:{
                person_list_id: personListId,
                perm: {in: perms}
            }
        })
    }

    async find(personName: string, listTitle: string): Promise<PermissionType[]>{
        return (await prisma.permission.findMany({
            where:{
                person_list:{
                    person:{
                        name: personName
                    },
                    list:{
                        title: listTitle
                    },
                },
                deleted_at: null
            }
        })).map((permission: Permission)=>{return permission.perm})
    }
    
}