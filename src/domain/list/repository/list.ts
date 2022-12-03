
import prisma from "../../../db/prisma.client";

import { SavedPerson } from "../../../auth/entity/entity";
import { List} from "../entity/list";

import PermissionRepository from "../../permission/repository/permission";
import PeronListRepository from "./person_list";

import { exceptionName } from "../../../exception/exceptions";

export default class ListRepostiory {
    private readonly permissionRepository = new PermissionRepository()
    private readonly personListRepository = new PeronListRepository()

    async create(personId: SavedPerson['id'], title: string): Promise<List> {
        const savedList = await this.findByTitle(title);

        if (savedList) throw new Error(exceptionName.alreadyExist);

        const newList = await prisma.list.create({ data: {
            title: title, 
            updated_at: new Date()
        }});
        const newPeronsList = await this.personListRepository.create({
            person_id: personId,
            list_id: newList.id,
            role: 'owner'
        });
        await this.permissionRepository.init(newPeronsList.id!);
        return newList;
    }

    async findByTitle(title: string): Promise<List| null>{
        return prisma.list.findUnique({where:{
            title: title
        }})
    }

    async findByTasktitle(tasktitle: string): Promise<List| null>{
        return prisma.list.findFirst({
            where:{
                task:{
                    every:{
                        title: tasktitle
                    }
                }
            }
        })
    }

    async list(personName: string):Promise<List[]>{
        return prisma.list.findMany({
            where:{
                person_list:{
                    every:{
                        person:{
                            name: personName
                        }
                    }
                }
            }
        })
    }

    async delete(title:string){
        await prisma.list.update({data:{
            deleted_at: new Date()
        },
        where:{
            title: title
        }})
    }
}