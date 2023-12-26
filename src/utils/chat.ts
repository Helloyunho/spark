/* eslint-disable @typescript-eslint/indent */
import type { BaseMessagePayload } from '../types/chat/message.ts'
import type {
  EventMessagePayload,
  EventMessageType
} from '../types/chat/payload.ts'

export const eventMessagePayloadToBaseMessagePayload = <
  Code extends EventMessageType
>(
  payload: EventMessagePayload
): BaseMessagePayload & {
  msgTypeCode: Code
} => ({
  ...payload,
  msgTypeCode: payload.messageTypeCode as Code,
  svcid: payload.serviceId,
  cid: payload.channelId,
  msgTime: payload.messageTime,
  uid: payload.userId,
  msg: payload.content,
  mbrCnt: payload.memberCount,
  msgStatusType: payload.messageStatusType,
  ctime: payload.createTime,
  utime: payload.updateTime
})
