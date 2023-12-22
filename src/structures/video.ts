import type { Video as ChzzkVideo, Channel as ChzzkChannel } from 'chzzk'
import { Channel } from './channel.ts'

export interface VideoCategory {
  type: string
  name: string
  value: string
}

export class Video {
  num: number
  id: string
  title: string
  type: string
  publishedAt: Date
  thumbnailURL: string
  duration: number
  viewCount: number
  category: VideoCategory
  channel: Channel
  trailerURL?: string
  exposed?: boolean
  promoted?: boolean
  inKey?: string
  liveAt?: Date
  vodStatus?: string
  prev?: Video
  next?: Video

  constructor(data: ChzzkVideo) {
    this.num = data.videoNo
    this.id = data.videoId
    this.title = data.videoTitle
    this.type = data.videoType
    this.publishedAt = new Date(data.publishDateAt)
    this.thumbnailURL = data.thumbnailImageUrl
    this.duration = data.duration
    this.viewCount = data.readCount
    this.category = {
      type: data.categoryType,
      name: data.videoCategory,
      value: data.videoCategoryValue
    }
    this.channel = new Channel(data.channel as ChzzkChannel) // since we already handle partial channels
    this.trailerURL = data.trailerUrl
    this.exposed = data.exposure
    this.promoted = data.paidPromotion
    this.inKey = data.inKey
    this.liveAt = data.liveOpenDate ? new Date(data.liveOpenDate) : undefined
    this.vodStatus = data.vodStatus
    this.prev = data.prevVideo
      ? new Video(data.prevVideo as ChzzkVideo)
      : undefined // again, partial videos
    this.next = data.nextVideo
      ? new Video(data.nextVideo as ChzzkVideo)
      : undefined
  }
}
