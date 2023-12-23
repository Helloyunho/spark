import type { Channel as ChzzkChannel } from 'chzzk'
import type { Client } from '../client/index.ts'
import { Live, LiveStatus } from './live.ts'

export class Channel {
  client: Client
  id: string
  name: string
  imageURL?: string
  verified: boolean
  blocked?: boolean
  description?: string
  follower?: number
  live?: boolean
  following?: boolean
  allowNotification?: boolean
  followedAt?: Date

  constructor(
    client: Client,
    data: ChzzkChannel & {
      personalData?: {
        following?: boolean
        notification?: boolean
        followDate?: string
      }
    }
  ) {
    this.client = client
    this.id = data.channelId
    this.name = data.channelName
    this.imageURL = data.channelImageUrl
    this.verified = data.verifiedMark
    this.blocked = data.personalData?.privateUserBlock
    this.description = data.channelDescription
    this.follower = data.followerCount
    this.live = data.openLive
    this.following = data.personalData?.following
    this.allowNotification = data.personalData?.notification
    this.followedAt = data.personalData?.followDate
      ? new Date(data.personalData.followDate + '+09:00')
      : undefined
  }

  async getStatus(): Promise<LiveStatus> {
    return new LiveStatus(await this.client.chzzkClient.live.status(this.id))
  }

  async getLiveDetail(): Promise<Live> {
    return new Live(
      this.client,
      await this.client.chzzkClient.live.detail(this.id)
    )
  }
}
