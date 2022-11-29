export interface List {
    id?:number
    title: string
    updated_at: Date
    deleted_at?: Date | null
}