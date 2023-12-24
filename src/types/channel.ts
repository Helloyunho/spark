export enum ChannelType {
  STREAMING = 'STREAMING'
}

export interface ChannelPayload {
  channelId: string
  channelName: string
  channelImageUrl: string | null
  verifiedMark: boolean
  channelType?: ChannelType | string
  personalData?: {
    privateUserBlock?: boolean
    following?: {
      following?: boolean
      notification?: boolean
      followDate?: string
    }
  }
  channelDescription?: string
  followerCount?: number
  openLive?: boolean
}
