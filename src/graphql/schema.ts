import { createSchema } from 'graphql-yoga'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Material {
      id: ID!
      name: String
      quantity: Int
    }

    type Participant {
      id: ID!
      name: String
      friends: [Participant!]
      materials: [Material!]
      invitedBy: Participant
    }

    type Query {
      hello(name: String): String
      goodBye(name: String): String
      age: Int
      weight: Float!
      isOver18: Boolean
      hobbies: [String!]!
      participant: Participant
    }
  `,
  resolvers: {
    Query: {
      hello: (_parent, args) => `Hello ${args.name || 'world'}!`,
      goodBye: (_parent, args) => `Goodbye ${args.name || 'world'}!`,
      age: () => 30,
      weight: () => 70.5,
      isOver18: () => true,
      hobbies: () => ['reading', 'coding', 'swimming'],
      participant: () => ({
        id: '123',
        name: 'John Doe',
        friends: [
          {
            id: '124',
            name: 'Jane Doe',
            friends: [],
            materials: [],
            invitedBy: null,
          },
        ],
        materials: [{ id: '1', name: 'Laptop', quantity: 1 }],
        invitedBy: null,
      }),
    },
  },
})
