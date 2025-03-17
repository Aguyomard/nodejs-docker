import { Context } from '../types/context.types.js'
import { Participant, ParticipantArgs } from '../types/participant.types.js'

export const participantResolvers = {
  Query: {
    participant: (
      _parent: unknown,
      { id }: ParticipantArgs,
      { db }: Context
    ): Participant => {
      const participant = db.participants.find((p) => p.id === id)
      if (!participant) throw new Error(`Participant with ID ${id} not found`)
      return participant
    },

    allParticipants: (
      _parent: unknown,
      _args: unknown,
      { db }: Context
    ): Participant[] => db.participants,
  },

  Participant: {
    friends: (parent: Participant, _args: unknown, { db }: Context) =>
      parent.friends
        ? db.participants.filter((p) => parent.friends?.includes(p.id))
        : [],

    materials: (parent: Participant, _args: unknown, { db }: Context) =>
      parent.materials
        ? db.materials.filter((m) => parent.materials?.includes(m.id))
        : [],

    invitedBy: (parent: Participant, _args: unknown, { db }: Context) =>
      parent.invitedBy
        ? db.participants.find((p) => p.id === parent.invitedBy) || null
        : null,
  },
}
