import { participants, materials } from '../data.js'
import { Participant, ParticipantArgs } from '../types/participant.types.js'

export const participantResolvers = {
  Query: {
    participant: (_parent: unknown, { id }: ParticipantArgs): Participant => {
      const participant = participants.find((p) => p.id === id)
      if (!participant) throw new Error(`Participant with ID ${id} not found`)
      return participant
    },

    allParticipants: (): Participant[] => participants,
  },

  Participant: {
    friends: (parent: Participant) =>
      parent.friends
        ? participants.filter((p) => parent.friends?.includes(p.id))
        : [],

    materials: (parent: Participant) =>
      parent.materials
        ? materials.filter((m) => parent.materials?.includes(m.id))
        : [],

    invitedBy: (parent: Participant) =>
      parent.invitedBy
        ? participants.find((p) => p.id === parent.invitedBy) || null
        : null,
  },
}
