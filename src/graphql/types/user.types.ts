export interface User {
  id: string
  name: string
  email: string
  age?: number | null
}

export interface UserInput {
  name: string
  email: string
  age?: number
}

export interface UpdateUserInput {
  name?: string
  email?: string
  age?: number
}

export interface UserArgs {
  id: string
}

export interface UpdateUserArgs {
  id: string
  input: UpdateUserInput
}

export interface CreateUserArgs {
  input: UserInput
}
