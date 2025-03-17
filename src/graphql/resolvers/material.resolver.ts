import { db } from '../data.js'

export const materialResolvers = {
  Query: {
    allMaterials: (
      _parent: unknown,
      _args: unknown,
      context: { db: typeof db }
    ) => {
      return context.db.materials
    },
  },
}
