import type { ExtrasPayload } from './extras.ts'
import type { EventMessageType } from './payload.ts'

export interface BaseMessagePayload {
  svcid: 'game' | string
  cid: string
  mbrCnt: number
  uid: string
  profile: string // JSON string, need to parse as ProfilePayload
  msg: string
  msgTypeCode: EventMessageType
  msgStatusType: 'NORMAL' | string
  extras: string // JSON string, need to parse as MessageExtrasPayload
  ctime: number
  utime: number
  msgTid: number | null // number ig
  msgTime: number
}

export interface MessagePayload extends BaseMessagePayload {
  msgTypeCode: EventMessageType.MESSAGE
}

export interface MessageExtrasPayload extends ExtrasPayload {
  extraToken: string
}

export interface SendMessagePayload {
  msg: string
  msgTypeCode: EventMessageType.MESSAGE
  extras: string // JSON string, need to stringify from ExtrasPayload(not MessageExtrasPayload)
  msgTime: number
}

export interface SendMessageOptions {
  emojis?: Record<string, string>
}

export interface SendMessageSuccessPayload {
  ctime: number
  msgTime: number
  extras: string // JSON string, need to parse as MessageExtrasPayload
}
