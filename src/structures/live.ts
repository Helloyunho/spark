import type { Category } from '../types/category.ts'
import { Channel } from './channel.ts'
import type { Client } from '../client/index.ts'
import type {
  ChannelLiveDetailPayload,
  LiveChatAvailableCondition,
  LiveChatAvailableGroup,
  LivePayload,
  LivePollingStatusPayload,
  LiveStatusPayload
} from '../types/live.ts'

export class LiveStatus {
  accumulatedUserCount: number
  adult: boolean
  chatID: string
  currentUserCount: number
  faultStatus?: string
  category: Category
  pollingStatus: LivePollingStatusPayload
  title: string
  promoted: boolean
  status: string

  constructor(data: LiveStatusPayload) {
    this.accumulatedUserCount = data.accumulateCount
    this.adult = data.adult
    this.chatID = data.chatChannelId
    this.currentUserCount = data.concurrentUserCount
    this.faultStatus = data.faultStatus ?? undefined
    this.category = {
      type: data.categoryType ?? undefined,
      id: data.liveCategory ?? undefined,
      text: data.liveCategoryValue
    }
    this.pollingStatus = JSON.parse(data.livePollingStatus)
    this.title = data.liveTitle
    this.promoted = data.paidPromotion
    this.status = data.status
  }
}

export class Live {
  client: Client
  title: string
  imageURL: string
  defaultThumbnailURL: string | null
  currentUserCount: number
  accumulatedUserCount: number
  startedAt: Date
  id: number
  chatID: string
  category: Category
  channel?: Channel
  // playbackInfo: ChzzkLivePlayback // maybe later we can make this a class

  constructor(client: Client, data: LivePayload) {
    this.client = client
    this.title = data.liveTitle
    this.imageURL = data.liveImageUrl
    this.defaultThumbnailURL = data.defaultThumbnailImageUrl
    this.currentUserCount = data.concurrentUserCount
    this.accumulatedUserCount = data.accumulateCount
    this.startedAt = new Date(data.openDate + '+09:00')
    this.id = data.liveId
    this.chatID = data.chatChannelId
    this.category = {
      type: data.categoryType ?? undefined,
      id: data.liveCategory ?? undefined,
      text: data.liveCategoryValue
    }
    this.channel = data.channel ? new Channel(client, data.channel) : undefined
    // this.playbackInfo = data.livePlayback
  }
}

export class ChannelLiveDetail extends Live {
  status: string
  endedAt?: Date
  chatActive: boolean
  chatAvailableGroup: LiveChatAvailableGroup | string
  promoted: boolean
  chatAvailableCondition: LiveChatAvailableCondition | string
  minFollowerMinute: number
  pollingStatus: LivePollingStatusPayload

  constructor(client: Client, data: ChannelLiveDetailPayload) {
    super(client, data)
    this.status = data.status
    this.endedAt = data.closeDate
      ? new Date(data.closeDate + '+09:00')
      : undefined
    this.chatActive = data.chatActive
    this.chatAvailableGroup = data.chatAvailableGroup
    this.promoted = data.paidPromotion
    this.chatAvailableCondition = data.chatAvailableCondition
    this.minFollowerMinute = data.minFollowerMinute
    this.pollingStatus = JSON.parse(data.livePollingStatus)
  }
}
