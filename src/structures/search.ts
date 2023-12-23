/* eslint-disable @typescript-eslint/indent */
import type {
  SearchResultVideo as ChzzkSearchResultVideo,
  Video as ChzzkVideo,
  Live as ChzzkLive,
  Channel as ChzzkChannel
} from 'chzzk'
import type { Client } from '../client/index.ts'
import { Video } from './video.ts'
import { Live } from './live.ts'
import { Channel } from './channel.ts'

interface ChzzkSearchResult {
  size: number
  nextOffset: number
}

export interface SearchOptions {
  size?: number
  offset?: number
}

export enum SearchType {
  VIDEO = 'videos',
  LIVE = 'lives',
  CHANNEL = 'channels'
}

interface SearchTypeToClassMap {
  videos: Video
  lives: Live
  channels: Channel
}

interface SearchTypeToChzzkPayloadMap {
  videos: ChzzkSearchResultVideo
  lives: ChzzkLive
  channels: ChzzkChannel
}

export class SearchResult<
  Payload extends ChzzkSearchResult &
    Record<Type, Array<SearchTypeToChzzkPayloadMap[Type]>>,
  Result extends SearchTypeToClassMap[Type],
  Type extends SearchType
> extends Array<Result> {
  client: Client
  type: Type
  size: number
  offset: number = 0
  nextOffset: number
  keyword?: string

  constructor(client: Client, payload: Payload, type: Type, keyword?: string) {
    super()
    this.client = client
    this.concat(
      payload[type].map((result) => {
        switch (type) {
          case SearchType.VIDEO:
            return new Video(client, result as unknown as ChzzkVideo) as Result // since we already handle partial videos
          case SearchType.LIVE:
            return new Live(client, result as ChzzkLive) as Result
          case SearchType.CHANNEL:
            return new Channel(client, result as ChzzkChannel) as Result
          default:
            throw new Error('Invalid search type')
        }
      })
    )
    this.type = type
    this.size = payload.size
    this.nextOffset = payload.nextOffset
    this.offset = payload.nextOffset - payload.size
    this.keyword = keyword
  }

  async next(): Promise<SearchResult<Payload, Result, Type>> {
    if (this.keyword === undefined) {
      throw new Error('Cannot get next page without keyword')
    }
    switch (this.type) {
      case SearchType.VIDEO:
        return (await this.client.searchVideo(this.keyword, {
          size: this.size,
          offset: this.nextOffset
        })) as SearchResult<Payload, Result, Type>
      case SearchType.LIVE:
        return (await this.client.searchLive(this.keyword, {
          size: this.size,
          offset: this.nextOffset
        })) as SearchResult<Payload, Result, Type>
      case SearchType.CHANNEL:
        return (await this.client.searchChannel(this.keyword, {
          size: this.size,
          offset: this.nextOffset
        })) as SearchResult<Payload, Result, Type>
      default:
        throw new Error('Invalid search type')
    }
  }

  async prev(): Promise<SearchResult<Payload, Result, Type>> {
    if (this.keyword === undefined) {
      throw new Error('Cannot get previous page without keyword')
    }
    switch (this.type) {
      case SearchType.VIDEO:
        return (await this.client.searchVideo(this.keyword, {
          size: this.size,
          offset: this.offset - this.size
        })) as SearchResult<Payload, Result, Type>
      case SearchType.LIVE:
        return (await this.client.searchLive(this.keyword, {
          size: this.size,
          offset: this.offset - this.size
        })) as SearchResult<Payload, Result, Type>
      case SearchType.CHANNEL:
        return (await this.client.searchChannel(this.keyword, {
          size: this.size,
          offset: this.offset - this.size
        })) as SearchResult<Payload, Result, Type>
      default:
        throw new Error('Invalid search type')
    }
  }

  first(): Result {
    return this[0]
  }

  last(): Result {
    return this[this.length - 1]
  }
}
