export interface Participant {
  id: string
  name: string
  friends?: string[]
  materials?: string[]
  invitedBy?: string | null
}

export interface ParticipantArgs {
  id: string
}
