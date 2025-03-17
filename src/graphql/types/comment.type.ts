export const commentTypeDefs = `
  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
  }

  type Query {
    comment(id: ID!): Comment
    allComments: [Comment!]!
  }
`
