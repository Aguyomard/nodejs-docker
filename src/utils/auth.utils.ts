import { Context } from '../graphql/types/context.types.js'

export const getAuthenticatedUserId = (
  context: Context,
  necessary: boolean = true
): string | undefined => {
  if (!context.currentUser || !context.currentUser.id) {
    if (necessary) {
      throw new Error('Unauthorized')
    } else {
      return undefined
    }
  }

  return context.currentUser.id
}
