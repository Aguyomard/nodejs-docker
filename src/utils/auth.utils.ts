import { Context } from '../graphql/types/context.types.js'

export const getAuthenticatedUserId = (context: Context): string => {
  if (!context.currentUser || !context.currentUser.id) {
    throw new Error('Unauthorized')
  }

  return context.currentUser.id
}
