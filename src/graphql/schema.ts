import { createSchema } from 'graphql-yoga'
import { users, materials, participants } from './data.js'

export const schema = createSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Material {
      id: ID!
      name: String
      quantity: Int
    }

    type Participant {
      id: ID!
      name: String
      friends: [Participant!]!
      materials: [Material!]!
      invitedBy: Participant
    }

    type Query {
      me: User
      user(id: ID!): User
      allUsers: [User!]!
      hello(name: String): String
      participant(id: ID!): Participant
      allParticipants: [Participant!]!
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

    type Mutation {
      createUser(input: UserInput!): User
      updateUser(id: ID!, input: UpdateUserInput!): User
      deleteUser(id: ID!): Boolean
    }
  `,
  resolvers: {
    Query: {
      me: () => {
        if (!users.length) throw new Error('No users found')
        return users[0]
      },

      user: (_parent, args) => {
        const user = users.find((user) => user.id === args.id)
        if (!user) throw new Error(`User with ID ${args.id} not found`)
        return user
      },

      allUsers: () => {
        if (!users.length) throw new Error('No users available')
        return users
      },

      hello: (_parent, args) => `Hello ${args.name || 'world'}!`,

      participant: (_parent, args) => {
        const participant = participants.find((p) => p.id === args.id)
        if (!participant)
          throw new Error(`Participant with ID ${args.id} not found`)
        return participant
      },

      allParticipants: () => {
        if (!participants.length) throw new Error('No participants available')
        return participants
      },
    },

    Mutation: {
      createUser: (_parent, args) => {
        if (!args.input.name || !args.input.email) {
          throw new Error('Name and Email are required fields')
        }

        const emailExists = users.some(
          (user) => user.email === args.input.email
        )
        if (emailExists) {
          throw new Error(`User with email ${args.input.email} already exists`)
        }

        const newUser = {
          id: String(users.length + 1),
          ...args.input,
        }

        users.push(newUser)
        return newUser
      },

      updateUser: (_parent, args) => {
        const user = users.find((u) => u.id === args.id)
        if (!user) {
          throw new Error(`User with ID ${args.id} not found`)
        }

        Object.assign(user, args.input)
        return user
      },

      deleteUser: (_parent, args) => {
        const userIndex = users.findIndex((u) => u.id === args.id)
        if (userIndex === -1) {
          throw new Error(`User with ID ${args.id} not found`)
        }

        users.splice(userIndex, 1)
        return true
      },
    },

    Participant: {
      friends: (parent) => {
        if (!parent.friends) return []
        return participants.filter((p) => parent.friends.includes(p.id))
      },

      materials: (parent) => {
        if (!parent.materials) return []
        return materials.filter((m) => parent.materials.includes(m.id))
      },

      invitedBy: (parent) => {
        if (!parent.invitedBy) return null
        return participants.find((p) => p.id === parent.invitedBy) || null
      },
    },
  },
})
