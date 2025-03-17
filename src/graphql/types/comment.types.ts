export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
}

export interface CommentArgs {
  id: string
}
