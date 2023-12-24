import type { Category } from './category'
import type { ChannelPayload } from './channel.ts'

export enum VideoType {
  REPLAY = 'REPLAY',
  UPLOAD = 'UPLOAD'
}
export interface VideoPayload {
  videoNo: number
  videoId: string
  videoTitle: string
  videoType: VideoType | string
  publishDate: string
  thumbnailImageUrl: string
  trailerUrl?: string | null
  duration: number
  readCount: number
  publishDateAt: number
  categoryType: Category['type'] | null
  videoCategory: string | null
  videoCategoryValue: string
  paidPromotion?: boolean
  inKey?: string
  liveOpenDate?: string
  vodStatus?: string
  prevVideo?: VideoPayload
  nextVideo?: VideoPayload
  exposure?: boolean
  channel?: ChannelPayload
}
