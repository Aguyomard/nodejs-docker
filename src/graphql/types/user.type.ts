export const userTypeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  input UserInput {
    name: String!
    email: String!
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

  type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
  }

  type Subscription {
    userCreated: User!
  }
`
