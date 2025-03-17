import { materials } from '../data.js'

export const materialResolvers = {
  Query: {
    allMaterials: () => materials,
  },
}
