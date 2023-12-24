import { Channel } from './channel.ts'
import type { Client } from '../index.ts'
import type { Category } from '../types/category.ts'
import type { VideoPayload, VideoType } from '../types/video.ts'

export class Video {
  client: Client
  num: number
  id: string
  title: string
  type: VideoType | string
  publishedAt: Date
  thumbnailURL: string
  duration: number
  viewCount: number
  category: Category
  channel?: Channel
  trailerURL?: string
  exposed?: boolean
  promoted?: boolean
  inKey?: string
  liveAt?: Date
  vodStatus?: string
  prev?: Video
  next?: Video

  constructor(client: Client, data: VideoPayload) {
    this.client = client
    this.num = data.videoNo
    this.id = data.videoId
    this.title = data.videoTitle
    this.type = data.videoType
    this.publishedAt = new Date(data.publishDateAt)
    this.thumbnailURL = data.thumbnailImageUrl
    this.duration = data.duration
    this.viewCount = data.readCount
    this.category = {
      type: data.categoryType ?? undefined,
      id: data.videoCategory ?? undefined,
      text: data.videoCategoryValue
    }
    this.channel = data.channel ? new Channel(client, data.channel) : undefined
    this.trailerURL = data.trailerUrl ?? undefined
    this.exposed = data.exposure
    this.promoted = data.paidPromotion
    this.inKey = data.inKey
    this.liveAt = data.liveOpenDate
      ? new Date(data.liveOpenDate + '+09:00')
      : undefined
    this.vodStatus = data.vodStatus
    this.prev = data.prevVideo ? new Video(client, data.prevVideo) : undefined // again, partial videos
    this.next = data.nextVideo ? new Video(client, data.nextVideo) : undefined
  }
}
