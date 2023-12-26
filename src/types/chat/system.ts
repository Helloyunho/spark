import type { ExtrasPayload } from './extras.ts'
import type { BaseMessagePayload } from './message.ts'
import type { EventMessageType } from './payload.ts'
import type { ProfilePayload } from './profile.ts'

export interface SystemMessagePayload extends BaseMessagePayload {
  msgTypeCode: EventMessageType.SYSTEM_MESSAGE
}

export interface SystemMessageExtrasPayload extends ExtrasPayload {
  description: string
  styleType: number
  visibleRoles: string[]
  params: {
    registerNickname: string
    targetNickname: string
    registerChatProfile: ProfilePayload
    targetProfile: ProfilePayload
  }
}
