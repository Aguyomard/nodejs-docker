export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  published: boolean
}

export interface PostArgs {
  id: string
}
