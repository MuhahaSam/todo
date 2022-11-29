import { Task } from '../entity/task'
export function taskMapper(task: Task){
    const mappingTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        person_id: task.person_id,
        list_id: task.list_id,
        completeness: task.completeness ? task.completeness : 0,
        start_date: new Date(),
        updated_at: new Date(),
        end_date: task.end_date ? task.end_date : null,
        deleted_at: task.deleted_at ? task.deleted_at : null
    }
    return mappingTask
}