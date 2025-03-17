import { db } from '../data.js'
import { Participant, ParticipantArgs } from '../types/participant.types.js'

export const participantResolvers = {
  Query: {
    participant: (
      _parent: unknown,
      { id }: ParticipantArgs,
      context: { db: typeof db }
    ): Participant => {
      const participant = context.db.participants.find((p) => p.id === id)
      if (!participant) throw new Error(`Participant with ID ${id} not found`)
      return participant
    },

    allParticipants: (
      _parent: unknown,
      _args: unknown,
      context: { db: typeof db }
    ): Participant[] => {
      return context.db.participants
    },
  },

  Participant: {
    friends: (
      parent: Participant,
      _args: unknown,
      context: { db: typeof db }
    ) =>
      parent.friends
        ? context.db.participants.filter((p) => parent.friends?.includes(p.id))
        : [],

    materials: (
      parent: Participant,
      _args: unknown,
      context: { db: typeof db }
    ) =>
      parent.materials
        ? context.db.materials.filter((m) => parent.materials?.includes(m.id))
        : [],

    invitedBy: (
      parent: Participant,
      _args: unknown,
      context: { db: typeof db }
    ) =>
      parent.invitedBy
        ? context.db.participants.find((p) => p.id === parent.invitedBy) || null
        : null,
  },
}
