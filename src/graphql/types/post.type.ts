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
    post: PostSubscriptionPayload!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean!
  }

  input EditPostInput {
    title: String
    content: String
    published: Boolean
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    allPosts: [Post!]!
    deletePost(id: ID!): Post!
    editPost(id: ID!, input: EditPostInput!): Post!
  }

  enum MutationType {
    CREATED
    UPDATED
    DELETED
  }

  type PostSubscriptionPayload {
    mutation: MutationType!
    data: Post!
  }
`
