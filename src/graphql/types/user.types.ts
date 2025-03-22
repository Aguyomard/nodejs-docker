export interface User {
  id: string
  name: string
  email: string
  age?: number | null
}

export interface UserWithPassword extends User {
  password: string
}

export interface AuthPayload {
  user: User
  token: string
}

export interface UserInput {
  name: string
  email: string
  age?: number
  password: string
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

export interface LoginInput {
  email: string
  password: string
}

export interface LoginUserArgs {
  input: LoginInput
}
