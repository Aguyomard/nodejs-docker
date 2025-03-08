import { Schema, model, Document } from 'mongoose'

interface IUser extends Document {
  email: string
  password: string
  verified?: boolean
  verificationCode?: string
  verificationCodeValidationDate?: Date
  forgotPasswordCode?: string
  createdAt?: Date
  updatedAt?: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: [true, 'Email already exists'],
      minLength: [6, 'Email must be at least 6 characters'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidationDate: {
      type: Date,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)
export type { IUser }
