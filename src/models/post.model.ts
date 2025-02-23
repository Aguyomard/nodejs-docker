import { Schema, model, Document } from 'mongoose'

interface IPost extends Document {
  message: string
  author: string
  likers: string[]
}

const PostSchema = new Schema<IPost>(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    likers: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export const PostModel = model<IPost>('Post', PostSchema)
