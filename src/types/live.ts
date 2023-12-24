import type { Category } from './category.ts'
import type { ChannelPayload } from './channel.ts'

export interface LivePayload {
  liveId: number
  liveTitle: string
  liveImageUrl: string
  defaultThumbnailImageUrl: string | null
  concurrentUserCount: number
  accumulateCount: number
  openDate: string
  chatChannelId: string
  categoryType: Category['type'] | null
  liveCategory: string | null
  liveCategoryValue: string
  channel?: ChannelPayload
}
export interface LiveStatusPayload {
  liveTitle: string
  status: string
  concurrentUserCount: number
  accumulateCount: number
  paidPromotion: boolean
  adult: boolean
  chatChannelId: string
  categoryType: Category['type'] | null
  liveCategory: string | null
  liveCategoryValue: string
  livePollingStatus: string // JSON string, need to parse as LivePollingStatus
  faultStatus: string | null
}
export enum LivePlayableStatus {
  PLAYABLE = 'PLAYABLE'
}
export interface LivePollingStatusPayload {
  status: string
  isPublishing: boolean
  playableStatus: LivePlayableStatus | string
  trafficThrottling: -1 | number
  callPeriodMilliSecond: number
}
export enum LiveChatAvailableGroup {
  ALL = 'ALL'
}
export enum LiveChatAvailableCondition {
  NONE = 'NONE'
}
export interface ChannelLiveDetailPayload extends LivePayload {
  status: string
  closeDate: string | null
  chatActive: boolean
  chatAvailableGroup: LiveChatAvailableGroup | string
  paidPromotion: boolean
  chatAvailableCondition: LiveChatAvailableCondition | string
  minFollowerMinute: number
  livePollingStatus: string // JSON string, need to parse as LivePollingStatus
}
