import type { Client } from '../client/index.ts'
import type {
  MessagePayload,
  MessageExtrasPayload,
  BaseMessagePayload
} from '../types/chat/message.ts'
import { EventMessageType } from '../types/chat/payload.ts'
import type { ProfilePayload } from '../types/chat/profile.ts'
import type { Channel } from './channel.ts'
import { Extras } from './extras.ts'
import { ChatProfile } from './profile.ts'

export class MessageExtras extends Extras {
  extraToken: string

  constructor(data: MessageExtrasPayload) {
    super(data)
    this.extraToken = data.extraToken
  }
}

export class BaseMessage<T extends EventMessageType> {
  client: Client
  type: T
  chatID: string
  authorID: string
  profile: ChatProfile
  content: string
  status: MessagePayload['msgStatusType']
  extras: MessageExtras
  createdAt: Date
  updatedAt: Date

  constructor(client: Client, data: BaseMessagePayload) {
    this.client = client
    this.type = data.msgTypeCode as T
    this.chatID = data.cid
    this.authorID = data.uid
    this.profile = new ChatProfile(
      client,
      JSON.parse(data.profile) as ProfilePayload
    )
    this.content = data.msg
    this.status = data.msgStatusType
    this.extras = new MessageExtras(
      JSON.parse(data.extras) as MessageExtrasPayload
    )
    this.createdAt = new Date(data.ctime)
    this.updatedAt = new Date(data.utime)
  }

  async getAuthorChannel(): Promise<Channel> {
    return await this.client.getChannel(this.authorID)
  }

  async getStreamerChannel(): Promise<Channel> {
    return await this.client.getChannel(this.extras.streamerID)
  }
}

export class Message extends BaseMessage<EventMessageType.MESSAGE> {
  type: EventMessageType.MESSAGE

  constructor(client: Client, data: MessagePayload) {
    super(client, data)
    this.type = EventMessageType.MESSAGE
  }
}
