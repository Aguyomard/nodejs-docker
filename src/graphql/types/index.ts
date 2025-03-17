import { userTypeDefs } from './user.type.js'
import { postTypeDefs } from './post.type.js'
import { commentTypeDefs } from './comment.type.js'
import { materialTypeDefs } from './material.type.js'
import { participantTypeDefs } from './participant.type.js'

export const typeDefs = `
  ${userTypeDefs}
  ${postTypeDefs}
  ${commentTypeDefs}
  ${materialTypeDefs}
  ${participantTypeDefs}
`
