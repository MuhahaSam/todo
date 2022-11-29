export type PermissionRole = 'owner' | 'contributor'
export interface PersonList{
    id?: number
    person_id: number
    list_id: number
    role: PermissionRole

}