export const postTypeDefs = `
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
  }

  type Query {
    post(id: ID!): Post
    allPosts: [Post!]!
  }
`
