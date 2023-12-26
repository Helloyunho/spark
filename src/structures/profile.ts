import type { Client } from '../client/index.ts'
import type {
  ActivityBadgePayload,
  ProfilePayload
} from '../types/chat/profile.ts'
import type { Channel } from './channel.ts'

export class ActivityBadge {
  num: number
  id: string
  imageURL?: string
  title: string
  description: string
  activated: boolean

  constructor(data: ActivityBadgePayload) {
    this.num = data.badgeNo
    this.id = data.badgeId
    this.imageURL = data.imageUrl ?? undefined
    this.title = data.title
    this.description = data.description
    this.activated = data.activated
  }
}

export class ChatProfile {
  client: Client
  id: string
  nick: string
  imageURL?: string
  role?: string
  badge?: string
  title?: string
  verified: boolean
  activityBadges?: ActivityBadge[]
  streamingProperty?: unknown

  constructor(client: Client, data: ProfilePayload) {
    this.client = client
    this.id = data.userIdHash
    this.nick = data.nickname
    this.imageURL = data.profileImageUrl ?? undefined
    this.role = data.userRoleCode
    this.badge = data.badge ?? undefined
    this.title = data.title ?? undefined
    this.verified = data.verifiedMark
    this.activityBadges = data.activityBadges
      ? data.activityBadges.map((badge) => new ActivityBadge(badge))
      : undefined
    this.streamingProperty = data.streamingProperty
  }

  async getChannel(): Promise<Channel> {
    return await this.client.getChannel(this.id)
  }
}
