import type { OSType, ExtrasPayload } from '../types/chat/extras.ts'

export class Extras {
  os: OSType | string
  emojis: Record<string, string>
  streamerID: string
  type: ExtrasPayload['chatType']

  constructor(data: ExtrasPayload) {
    this.os = data.osType
    this.emojis = typeof data.emojis === 'object' ? data.emojis : {}
    this.streamerID = data.streamingChannelId
    this.type = data.chatType
  }
}
