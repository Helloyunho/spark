import type { Client } from '../client/index.ts'
import type {
  DonationExtrasPayload,
  DonationPayload,
  DonationWeeklyRankPayload
} from '../types/chat/donation.ts'
import { EventMessageType } from '../types/chat/payload.ts'
import type { Channel } from './channel.ts'
import { Extras } from './extras.ts'
import { BaseMessage } from './message.ts'

export class DonationWeeklyRank {
  client: Client
  userID: string
  nick: string
  verified: boolean
  cost: number
  ranking: number

  constructor(client: Client, data: DonationWeeklyRankPayload) {
    this.client = client
    this.userID = data.userIdHash
    this.nick = data.nickName
    this.verified = data.verifiedMark
    this.cost = data.donationAmount
    this.ranking = data.ranking
  }

  async getUserChannel(): Promise<Channel> {
    return await this.client.getChannel(this.userID)
  }
}

export class DonationExtras extends Extras {
  client: Client
  type: DonationExtrasPayload['payType']
  cost: number
  nick: string
  donationType: DonationExtrasPayload['donationType']
  rankList: DonationWeeklyRank[]
  authorUserRank: DonationWeeklyRank

  constructor(client: Client, data: DonationExtrasPayload) {
    super(data)
    this.client = client
    this.type = data.payType
    this.cost = data.payAmount
    this.nick = data.nickname
    this.donationType = data.donationType
    this.rankList = data.weeklyRankList.map(
      (p) => new DonationWeeklyRank(client, p)
    )
    this.authorUserRank = new DonationWeeklyRank(
      client,
      data.donationUserWeeklyRank
    )
  }

  async getAuthorChannel(): Promise<Channel> {
    return await this.client.getChannel(this.authorUserRank.userID)
  }
}

export class Donation extends BaseMessage<EventMessageType.DONATION> {
  type: EventMessageType.DONATION

  constructor(client: Client, data: DonationPayload) {
    super(client, data)
    this.type = EventMessageType.DONATION
  }
}
