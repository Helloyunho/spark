import type { EventMap } from 'typed-emitter'
import type { Message } from '../../structures/message'
import type { Donation } from '../../structures/donation'

export interface ChatEvents extends EventMap {
  error: (error: any) => void
  open: () => void
  ping: () => void
  pong: () => void
  authSuccess: (sid: string, uuid: string, tid: string) => void
  message: (message: Message) => void
  recentMessages: (messages: Array<Message | Donation>, tid: string) => void
  donation: (donation: Donation) => void
  // system: (system: unknown) => void
  sendMessageSuccess: (tid: string) => void
  raw: (data: any) => void
  debug: (message: string) => void
}
