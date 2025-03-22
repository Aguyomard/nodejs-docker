export const userTypeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    age: Int
    posts: [Post!]!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    age: Int
  }

  input UpdateUserInput {
    name: String
    email: String
    age: Int
  }

  type Query {
    me: User
    user(id: ID!): User
    allUsers: [User!]!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Mutation {
    createUser(input: UserInput!): AuthPayload
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
  }

  type Subscription {
    userCreated: User!
  }

  input LoginInput {
  email: String!
  password: String!
}

  extend type Mutation {
    loginUser(input: LoginInput!): AuthPayload
  }

`
