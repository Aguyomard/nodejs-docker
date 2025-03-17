import { createSchema } from 'graphql-yoga'
import { users, materials, participants, posts, comments } from './data.js'

export const schema = createSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
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

    type Post {
      id: ID!
      title: String!
      content: String!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      content: String!
      post: Post!
      author: User!
    }

    type Query {
      me: User
      user(id: ID!): User
      allUsers: [User!]!
      hello(name: String): String
      participant(id: ID!): Participant
      allParticipants: [Participant!]!
      post(id: ID!): Post
      allPosts: [Post!]!
      comment(id: ID!): Comment
      allComments: [Comment!]!
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

      post: (_parent, args) => {
        const post = posts.find((p) => p.id === args.id)
        if (!post) throw new Error(`Post with ID ${args.id} not found`)
        return post
      },

      allPosts: () => {
        if (!posts.length) throw new Error('No posts available')
        return posts
      },

      comment: (_parent, args) => {
        const comment = comments.find((c) => c.id === args.id)
        if (!comment) throw new Error(`Comment with ID ${args.id} not found`)
        return comment
      },

      allComments: () => {
        if (!comments.length) throw new Error('No comments available')
        return comments
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

        for (let i = comments.length - 1; i >= 0; i--) {
          if (comments[i].authorId === args.id) {
            comments.splice(i, 1)
          }
        }

        users.splice(userIndex, 1)
        return true
      },
    },

    User: {
      posts: (parent) => posts.filter((post) => post.authorId === parent.id),
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

    Post: {
      author: (parent) => users.find((user) => user.id === parent.authorId),
      comments: (parent) =>
        comments.filter((comment) => comment.postId === parent.id),
    },

    Comment: {
      post: (parent) => posts.find((post) => post.id === parent.postId),
      author: (parent) => users.find((user) => user.id === parent.authorId),
    },
  },
})
