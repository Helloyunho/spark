import type { Client } from '../client/index.ts'
import { Live, LiveStatus } from './live.ts'
import type { ChannelPayload, ChannelType } from '../types/channel.ts'
import type { ResponsePayload } from '../types/etc.ts'
import type {
  ChannelLiveDetailPayload,
  LiveStatusPayload
} from '../types/live.ts'
import {
  GET_CHANNEL_LIVE_DETAIL,
  GET_CHANNEL_LIVE_STATUS
} from '../types/endpoints.ts'

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
  type?: ChannelType | string

  constructor(client: Client, data: ChannelPayload) {
    this.client = client
    this.id = data.channelId
    this.name = data.channelName
    this.imageURL = data.channelImageUrl ?? undefined
    this.verified = data.verifiedMark
    this.blocked = data.personalData?.privateUserBlock
    this.description = data.channelDescription
    this.follower = data.followerCount
    this.live = data.openLive
    this.following = data.personalData?.following?.following
    this.allowNotification = data.personalData?.following?.notification
    this.followedAt = data.personalData?.following?.followDate
      ? new Date(data.personalData.following?.followDate + '+09:00')
      : undefined
    this.type = data.channelType
  }

  async getStatus(): Promise<LiveStatus> {
    const data: ResponsePayload<LiveStatusPayload> =
      await this.client.rest.request({
        url: GET_CHANNEL_LIVE_STATUS(this.id)
      })
    return new LiveStatus(data.content)
  }

  async getLiveDetail(): Promise<Live> {
    const data: ResponsePayload<ChannelLiveDetailPayload> =
      await this.client.rest.request({
        url: GET_CHANNEL_LIVE_DETAIL(this.id)
      })
    return new Live(this.client, data.content)
  }
}
