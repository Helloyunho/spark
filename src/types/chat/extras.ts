export enum OSType {
  ANDROID = 'AOS',
  IOS = 'IOS',
  PC = 'PC'
}

export interface ExtrasPayload {
  osType: OSType | string
  emojis: string | Record<string, string>
  streamingChannelId: string
  chatType: 'STREAMING' | string
}
