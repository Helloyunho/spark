import type { ExtrasPayload } from './extras.ts'
import type { BaseMessagePayload } from './message.ts'
import type { EventMessageType } from './payload.ts'

export interface DonationPayload extends BaseMessagePayload {
  msgTypeCode: EventMessageType.DONATION
}

export interface DonationWeeklyRankPayload {
  userIdHash: string
  nickName: string
  verifiedMark: boolean
  donationAmount: number
  ranking: number
}

export interface DonationExtrasPayload extends ExtrasPayload {
  payType: 'CURRENCY' | string
  payAmount: number
  nickname: string
  donationType: 'CHAT' | string
  weeklyRankList: DonationWeeklyRankPayload[]
  donationUserWeeklyRank: DonationWeeklyRankPayload
}
