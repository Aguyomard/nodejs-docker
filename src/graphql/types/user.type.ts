export const userTypeDefs = `
  type User {
    id: ID!
    name: String!
    email: String
    password: String!
    age: Int
    posts: [Post!]!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type UserEdge {
    node: User!
    cursor: String!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
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
    allUsers(first: Int = 10, after: String): UserConnection!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Mutation {
    createUser(input: UserInput!): AuthPayload
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    deleteMe: Boolean!
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
