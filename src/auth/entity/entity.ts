export interface Person{
    id?: number
    name: string
    password: string
    access_token?: string | null
    refresh_token?: string | null
  }