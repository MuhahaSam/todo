import prisma from "../../../db/prisma.client";

import { PersonList } from "../entity/person_list";


export default class PeronListRepository{
    async create(personList: PersonList) : Promise<PersonList>{
        return prisma.person_list.create({data: personList})
    }

    async find(personName: string, listTitle: string): Promise<PersonList| null>{
        return prisma.person_list.findFirst({
            where:{ 
                person:{
                    name: personName
                },
                list:{
                    title: listTitle
                }
            }
        })
    }
}