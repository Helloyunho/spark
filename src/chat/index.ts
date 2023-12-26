import EventEmitter from 'node:events'
import WebSocket from 'isomorphic-ws'
import type TypedEmitter from 'typed-emitter'
import type { ChatEvents } from '../types/chat/events.ts'
import { CHAT_SERVER_URL, GET_ACCESS_TOKEN } from '../types/endpoints.ts'
import type { ResponsePayload, AccessTokenPayload } from '../types/etc.ts'
import type { Client } from '../client/index.ts'
import { ChatCmd } from '../types/chat/cmd.ts'
import {
  EventMessageType,
  type ChatPayloadMap,
  type ChatRequestPayload
} from '../types/chat/payload.ts'
import { Message } from '../structures/message.ts'
import { Donation } from '../structures/donation.ts'
import { eventMessagePayloadToBaseMessagePayload } from '../utils/chat.ts'
import type { SendMessageOptions } from '../types/chat/message.ts'
import type { Channel } from '../structures/channel.ts'

export class Chat extends (EventEmitter as unknown as new () => TypedEmitter<ChatEvents>) {
  readonly client: Client
  chatID: string
  channelID?: string
  private ws?: WebSocket
  private connected = false
  private count = 0 // send message count
  private readonly svcid: string = 'game'
  private readonly ver = '2'
  private sid?: string
  private readonly pingInterval = 20 * 1000 // 20 seconds
  private readonly pingTimeout = 10 * 1000 // 10 seconds
  private pingTimer?: NodeJS.Timeout
  private retryCount = 0
  private willDisconnect = false
  private uid?: string
  private accessToken?: string
  private readonlyMode = false

  constructor(
    client: Client,
    chatID: string,
    options?: { svcid?: string; channelID?: string }
  ) {
    // eslint-disable-next-line constructor-super
    super()
    this.client = client
    this.channelID = options?.channelID
    this.chatID = chatID
    this.svcid = options?.svcid ?? 'game'
  }

  async waitFor<K extends keyof ChatEvents>(
    event: K,
    checkFunction: (...args: Parameters<ChatEvents[K]>) => boolean = () => true,
    timeout?: number
  ): Promise<Parameters<ChatEvents[K]> | []> {
    return await new Promise((resolve) => {
      let timeoutID: NodeJS.Timeout | undefined
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          this.off(event, eventFunc as ChatEvents[K])
          resolve([])
        }, timeout)
      }
      const eventFunc = (...args: Parameters<ChatEvents[K]>): void => {
        if (checkFunction(...args)) {
          this.off(event, eventFunc as ChatEvents[K])
          if (timeoutID !== undefined) clearTimeout(timeoutID)
          resolve(args)
        }
      }
      this.on(event, eventFunc as ChatEvents[K])
    })
  }

  async connect({
    uid,
    accessToken
  }: {
    uid?: string
    accessToken?: string
  } = {}): Promise<void> {
    if (this.connected) return
    if (
      (uid !== undefined && accessToken === undefined) ||
      (uid !== undefined && accessToken === undefined)
    ) {
      throw new Error('Both uid and access token must be provided.')
    } else if (uid === undefined && accessToken === undefined) {
      const data: ResponsePayload<AccessTokenPayload> =
        await this.client.rest.request({
          url: GET_ACCESS_TOKEN
        })
      this.uid = (await this.client.getUser()).id
      this.accessToken = data.content.accessToken
    } else {
      this.uid = uid
      this.accessToken = accessToken
    }

    const serverNo =
      (Math.abs(
        this.chatID
          .split('')
          .map((c) => c.charCodeAt(0))
          .reduce((a, b) => a + b)
      ) %
        9) +
      1
    this.ws = new WebSocket(CHAT_SERVER_URL(serverNo.toString()))
    this.ws.onopen = this.onopen({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      uid: this.uid!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      accessToken: this.accessToken!
    }) // ts is dumb
    this.ws.onmessage = this.onmessage.bind(this)
    this.ws.onclose = this.onclose.bind(this)
    this.ws.onerror = this.onerror.bind(this)

    await this.waitFor('open')
  }

  async disconnect(): Promise<void> {
    this.willDisconnect = true
    this.ws?.close()
  }

  private onopen({
    uid,
    accessToken
  }: {
    uid: string
    accessToken: string
  }): () => void {
    return () => {
      this.connected = true
      if (this.retryCount > 0 && !this.willDisconnect) {
        this.emit('debug', 'Reconnected.')
      }
      this.retryCount = 0
      this.willDisconnect = false
      this.count = 0
      this.startPingInterval()
      this.emit('open')
      this.emit('debug', 'Chat connected.')
      void this.auth({ uid, accessToken })
    }
  }

  private onmessage(event: WebSocket.MessageEvent): void {
    this.emit('raw', event.data)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const json = JSON.parse(event.data.toString()) // we know it's a string
      this.startPingInterval()

      switch (json.cmd) {
        case ChatCmd.AUTH_SUCC: {
          const { sid, uuid, auth } =
            json.bdy as ChatPayloadMap[ChatCmd.AUTH_SUCC]
          this.sid = sid
          this.readonlyMode = auth === 'READ'
          this.emit('authSuccess', sid, uuid, json.tid as string)
          break
        }
        case ChatCmd.PING: {
          this.send(ChatCmd.PONG)
          this.emit('ping')
          break
        }
        case ChatCmd.PONG: {
          this.emit('pong')
          break
        }
        case ChatCmd.MESSAGE: {
          const msgPayload = json.bdy as ChatPayloadMap[ChatCmd.MESSAGE]
          msgPayload.forEach((msgP) => {
            const msg = new Message(this.client, msgP)
            this.emit('message', msg)
          })
          break
        }
        case ChatCmd.DONATION: {
          const donationPayload = json.bdy as ChatPayloadMap[ChatCmd.DONATION]
          donationPayload.forEach((donationP) => {
            const donation = new Donation(this.client, donationP)
            this.emit('donation', donation)
          })
          break
        }
        case ChatCmd.RECENT_MESSAGES: {
          const messagesPayload =
            json.bdy as ChatPayloadMap[ChatCmd.RECENT_MESSAGES]
          const msgs = messagesPayload.messageList
            .map((msgPayload) => {
              switch (msgPayload.messageTypeCode) {
                case EventMessageType.MESSAGE: {
                  const msg = new Message(
                    this.client,
                    eventMessagePayloadToBaseMessagePayload<EventMessageType.MESSAGE>(
                      msgPayload
                    )
                  )
                  return msg
                }
                case EventMessageType.DONATION: {
                  const donation = new Donation(
                    this.client,
                    eventMessagePayloadToBaseMessagePayload<EventMessageType.DONATION>(
                      msgPayload
                    )
                  )
                  return donation
                }
                default:
                  this.emit(
                    'debug',
                    `Unknown message type ${msgPayload.messageTypeCode} in recent messages, ignoring.`
                  )
                  return null
              }
            })
            .filter((msg) => msg !== null)
          this.emit(
            'recentMessages',
            msgs as Array<Message | Donation>,
            json.tid as string
          ) // ts is dumb
          break
        }
        case ChatCmd.SEND_MESSAGE_SUCC: {
          this.emit('sendMessageSuccess', json.tid as string)
          break
        }
      }
    } catch (err) {
      this.emit('error', err)
      this.emit('debug', `Error while processing following data: ${event.data}`)
      throw err
    }
  }

  private async onclose(): Promise<void> {
    this.connected = false
    if (this.pingTimer !== undefined) clearTimeout(this.pingTimer)
    this.emit('debug', 'Chat disconnected.')
    if (this.retryCount >= 5 && !this.willDisconnect) {
      throw new Error('Chat disconnected.')
    } else if (!this.willDisconnect) {
      this.emit('debug', `Reconnecting... Retry count: ${this.retryCount}`)
      this.retryCount++
      await this.connect({
        uid: this.uid,
        accessToken: this.accessToken
      })
    }
  }

  private onerror(error: WebSocket.ErrorEvent): void {
    this.emit('error', error)
  }

  async ping(): Promise<number> {
    if (this.pingTimer !== undefined) clearTimeout(this.pingTimer)
    const startTime = Date.now()
    this.send(ChatCmd.PING)
    this.pingTimer = setTimeout(() => {
      this.ws?.close()
    }, this.pingTimeout)
    await this.waitFor('pong', () => true, this.pingTimeout)
    const endTime = Date.now()
    this.emit('debug', `Ping: ${endTime - startTime}ms`)
    return endTime - startTime
  }

  startPingInterval(): void {
    if (this.pingTimer !== undefined) clearTimeout(this.pingTimer)
    this.pingTimer = setTimeout(() => {
      void this.ping()
    }, this.pingInterval)
  }

  send<Cmd extends ChatCmd>(cmd: Cmd, data?: ChatPayloadMap[Cmd]): void {
    if (!this.connected) return
    const req: ChatRequestPayload<Cmd> = {
      cmd,
      ver: this.ver
    }
    if (cmd !== ChatCmd.PING || cmd !== ChatCmd.PING) {
      req.tid = ++this.count
      req.svcid = this.svcid
      req.sid = this.sid
      req.cid = this.chatID
      req.bdy = data
    }
    this.ws?.send(JSON.stringify(req))
  }

  async auth({
    uid,
    accessToken
  }: {
    uid?: string
    accessToken: string
  }): Promise<void> {
    this.send(ChatCmd.AUTH, {
      uid,
      devType: 2001,
      accTkn: accessToken,
      auth: uid === undefined ? 'READ' : 'SEND'
    })

    await this.waitFor('authSuccess')
  }

  async getRecentMessages(count = 50): Promise<Array<Message | Donation>> {
    this.send(ChatCmd.GET_RECENT_MESSAGES, {
      recentMessageCount: count
    })
    const tid = this.count.toString()

    const [messages] = await this.waitFor(
      'recentMessages',
      (_, t) => t === tid,
      30000
    )
    return messages ?? []
  }

  async sendMessage(
    content: string, // {:emoji:} is an emoji
    options?: SendMessageOptions
  ): Promise<void> {
    if (this.readonlyMode) {
      throw new Error('The chat is in read-only mode.')
    }
    if (this.channelID === undefined) {
      this.emit('debug', 'Channel ID is not available, using chat ID instead.')
    }
    this.send(ChatCmd.SEND_MESSAGE, {
      msg: content,
      msgTypeCode: EventMessageType.MESSAGE,
      extras: JSON.stringify({
        chatType: 'STREAMING',
        osType: 'PC',
        streamingChannelId: this.channelID ?? this.chatID,
        emojis: options?.emojis ?? ''
      }),
      msgTime: Date.now()
    })
    const tid = this.count.toString()

    await this.waitFor('sendMessageSuccess', (t) => t === tid, 30000)
  }

  async getChannel(): Promise<Channel> {
    if (this.channelID === undefined) {
      throw new Error('Channel ID is not available.')
    }
    return await this.client.getChannel(this.channelID)
  }
}
