export const materialTypeDefs = `
  type Material {
    id: ID!
    name: String
    quantity: Int
  }

  type Query {
    allMaterials: [Material!]!
  }
`
