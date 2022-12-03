export interface UnsavedPerson {
  name: string
  password: string
}

export interface SavedPerson extends UnsavedPerson {
  id: number
  access_token: string | null
  refresh_token: string | null
}
