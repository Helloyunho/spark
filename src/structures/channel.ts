import type { Channel as ChzzkChannel } from 'chzzk'

export class Channel {
  id: string
  name: string
  imageURL?: string
  verified: boolean
  blocked?: boolean
  description?: string
  follower?: number
  live?: boolean

  constructor(data: ChzzkChannel) {
    this.id = data.channelId
    this.name = data.channelName
    this.imageURL = data.channelImageUrl
    this.verified = data.verifiedMark
    this.blocked = data.personalData?.privateUserBlock
    this.description = data.channelDescription
    this.follower = data.followerCount
    this.live = data.openLive
  }
}
