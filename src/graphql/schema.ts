import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql'

const MaterialType = new GraphQLObjectType({
  name: 'Material',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    quantity: { type: GraphQLInt },
  }),
})

const ParticipantType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'Participant',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    friends: { type: new GraphQLList(new GraphQLNonNull(ParticipantType)) },
    materials: { type: new GraphQLList(new GraphQLNonNull(MaterialType)) },
    invitedBy: { type: ParticipantType },
  }),
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      args: { name: { type: GraphQLString } },
      resolve: (_parent, args) => `Hello ${args.name || 'world'}!`,
    },
    goodBye: {
      type: GraphQLString,
      args: { name: { type: GraphQLString } },
      resolve: (_parent, args) => `Goodbye ${args.name || 'world'}!`,
    },
    age: {
      type: GraphQLInt,
      resolve: () => 30,
    },
    weight: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: () => 70.5,
    },
    isOver18: {
      type: GraphQLBoolean,
      resolve: () => true,
    },
    hobbies: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve: () => ['reading', 'coding', 'swimming'],
    },
    participant: {
      type: ParticipantType,
      resolve: () => ({
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

export const schema = new GraphQLSchema({
  query: QueryType,
})
