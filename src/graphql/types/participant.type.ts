export const participantTypeDefs = `
  type Participant {
    id: ID!
    name: String
    friends: [Participant!]!
    materials: [Material!]!
    invitedBy: Participant
  }

  type Query {
    participant(id: ID!): Participant
    allParticipants: [Participant!]!
  }
`
