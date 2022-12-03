export interface Permission{
    id?: number
    perm: PermissionType
    person_list_id: number
    deleted_at: Date | null
}
export type PermissionType = 'create' | 'read' | 'update' | 'delete'