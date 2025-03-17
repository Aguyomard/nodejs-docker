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

  type Subscription {
    commentAdded(postId: ID!): Comment!
  }

  input CreateCommentInput {
    text: String!
    postId: ID!
    authorId: ID!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
  }
`
