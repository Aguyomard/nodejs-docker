import { db } from '../data.js'

export const materialResolvers = {
  Query: {
    allMaterials: () => db.materials,
  },
}
