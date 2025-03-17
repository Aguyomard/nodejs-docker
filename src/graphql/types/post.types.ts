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

export type EditPostArgs = {
  id: string
  input: {
    title?: string
    content?: string
    published?: boolean
  }
}
