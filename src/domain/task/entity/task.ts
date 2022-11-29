export interface Task{
    id?: number
    title: string
    description: string | null
    list_id: number
    person_id: number
    completeness?: number
    start_date?: Date
    end_date?: Date | null
    updated_at?: Date
    deleted_at?: Date | null
}