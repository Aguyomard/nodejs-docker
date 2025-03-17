import { Context } from '../types/context.types.js'

export const materialResolvers = {
  Query: {
    allMaterials: (_parent: unknown, _args: unknown, { db }: Context) =>
      db.materials,
  },
}
