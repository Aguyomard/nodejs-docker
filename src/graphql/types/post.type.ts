export const postTypeDefs = `
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    published: Boolean!
  }

  type Query {
    post(id: ID!): Post
    allPosts: [Post!]!
  }

  type Subscription {
    post: Post!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    allPosts: [Post!]!
  }
`
