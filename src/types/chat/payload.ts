import type { ChatCmd } from './cmd.ts'
import type { DonationPayload } from './donation.ts'
import type {
  MessagePayload,
  SendMessagePayload,
  SendMessageSuccessPayload
} from './message.ts'

export interface ChatRequestPayload<Cmd extends ChatCmd> {
  cmd: Cmd
  ver: '2' | string
  bdy?: ChatPayloadMap[Cmd]
  tid?: number
  cid?: string
  svcid?: string
  sid?: string
}

export interface ChatResponsePayload<Cmd extends ChatCmd> {
  svcid: 'game' | string
  bdy: ChatPayloadMap[Cmd]
  cmd: Cmd
  retCode: number
  retMsg: string
  tid: string
  cid: string
}

export interface ChatPayloadMap {
  [ChatCmd.PING]: undefined
  [ChatCmd.PONG]: undefined
  [ChatCmd.AUTH]: AuthenticationPayload
  [ChatCmd.AUTH_SUCC]: AuthenticationSuccessPayload
  [ChatCmd.GET_RECENT_MESSAGES]: GetRecentMessagePayload
  [ChatCmd.RECENT_MESSAGES]: RecentMessagesPayload
  [ChatCmd.EVENT]: undefined
  [ChatCmd.MESSAGE]: MessagePayload[]
  [ChatCmd.DONATION]: DonationPayload[]
  [ChatCmd.KICK]: undefined
  [ChatCmd.BLOCK]: undefined
  [ChatCmd.BLIND]: undefined
  [ChatCmd.NOTICE]: undefined
  [ChatCmd.PENALTY]: undefined
  [ChatCmd.SEND_MESSAGE]: SendMessagePayload
  [ChatCmd.SEND_MESSAGE_SUCC]: SendMessageSuccessPayload
}

export interface AuthenticationPayload {
  uid?: string
  devType: 2001 | number
  accTkn: string
  auth: 'SEND' | 'READ' | string
}

export interface AuthenticationSuccessPayload {
  accTkn: string
  auth: 'SEND' | 'READ' | string
  uuid: string
  sid: string
}

export enum EventMessageType {
  MESSAGE = 1,
  IMAGE = 2,
  STICKER = 3,
  VIDEO = 4,
  RICH = 5,
  DONATION = 10,
  SYSTEM_MESSAGE = 30
}

export interface EventMessagePayload {
  serviceId: 'game' | string
  channelId: string
  messageTime: number
  userId: string
  profile: string // JSON string, need to parse as ProfilePayload
  content: string
  extras: string // JSON string, need to parse as ExtrasPayload
  memberCount: number
  messageTypeCode: EventMessageType
  messageStatusType: 'NORMAL' | string
  createTime: number
  updateTime: number
  msgTid: number | null // number ig
}

export interface RecentMessagesPayload {
  messageList: EventMessagePayload[]
  notice: string | null
  userCount: number
}

export interface GetRecentMessagePayload {
  recentMessageCount: number
}
