import  prisma  from '../../db/prisma.client'
import { Person } from "../entity/entity";

export default class PersonRepository{

    async create(person: Person): Promise<Person>{
        return await prisma.person.create({data:person})
    }

    async findByName(personName: string): Promise<Person | null> {
        return prisma.person.findUnique({
            where:{
                name: personName
            }
        })
    }
    async updateJWT(personName: string, toekns: { access: string; refresh: string; }): Promise<Person> {
        return await prisma.person.update({
            where: {
                name: personName
            },
            data:{
                access_token: toekns.access,
                refresh_token: toekns.refresh
            }
        })
    }
    async deleteJwt(personName: string){
        await prisma.person.update({
            where: {
                name: personName
            },
            data:{
                access_token: null,
                refresh_token: null
            }
        })
    }
}