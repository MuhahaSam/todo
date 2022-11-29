import { Task } from "../entity/task";
import prisma from "../../../db/prisma.client";
import { taskMapper } from "../mapper/rask.mapper";


export default class TaskRepository{
    async create(task: Task): Promise<Task>{
        return prisma.task.create({data: taskMapper(task)})
    }

    async updateCompleteness(taskTitle: string, listId: number, personId:number ,completeness: number): Promise<Task>{
        return prisma.task.update({
            data:{
                completeness: completeness,
                person_id: personId
            },
            where:{
                title_list_id:{
                    title: taskTitle,
                    list_id:listId
                }
        }})
    }

    async updatedescription(taskTitle: string, listId:number, description: string): Promise<Task>{
        return prisma.task.update({
            data:{
                description: description
            },
            where:{
                title_list_id:{
                    title: taskTitle,
                    list_id: listId
                }
            }
        })
    }

    async find(taskTitle: string, listId: number): Promise<Task | null>{
        return prisma.task.findUnique({
            where:{
                title_list_id:{
                    list_id: listId,
                    title: taskTitle
                }
            }
        })
    }

    async list(listId: number): Promise<Task[]>{
        return prisma.task.findMany({
            where:{
                list:{
                    id: listId
                }
            }
        })
    }

    async delete(taskTitle: string, listId:number): Promise<void>{
        await prisma.task.update({
            data:{
                deleted_at: new Date()
            },
            where:{
                title_list_id:{
                    list_id:listId,
                    title: taskTitle
                }
            }
        })
    }
}