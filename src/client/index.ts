/* eslint-disable @typescript-eslint/indent */
import { User } from '../structures/user.ts'
import { Channel } from '../structures/channel.ts'
import { Video } from '../structures/video.ts'
import {
  SearchResult,
  SearchType,
  type SearchOptions
} from '../structures/search.ts'
import type { Live } from '../structures/live.ts'
import { RESTClient } from '../utils/rest.ts'
import type { ResponsePayload } from '../types/etc.ts'
import type { UserPayload } from '../types/user.ts'
import {
  GET_CHANNEL,
  GET_USER_STATUS,
  GET_VIDEO,
  SEARCH_CHANNEL,
  SEARCH_LIVE,
  SEARCH_VIDEO
} from '../types/endpoints.ts'
import type { ChannelPayload } from '../types/channel.ts'
import type { VideoPayload } from '../types/video.ts'
import type {
  SearchResultCleaned,
  SearchResultPayload
} from '../types/search.ts'
import type { LivePayload } from '../types/live.ts'

export class Client {
  rest: RESTClient

  constructor({ auth, session }: { auth?: string; session?: string } = {}) {
    this.rest = new RESTClient({
      auth,
      session
    })
  }

  setCredentials({
    auth,
    session
  }: { auth?: string; session?: string } = {}): void {
    this.rest.auth = auth
    this.rest.session = session
  }

  async getUser(): Promise<User> {
    const data: ResponsePayload<UserPayload> = await this.rest.request({
      url: GET_USER_STATUS
    })
    return new User(data.content)
  }

  async getChannel(channelId: string): Promise<Channel> {
    const data: ResponsePayload<ChannelPayload> = await this.rest.request({
      url: GET_CHANNEL(channelId)
    })
    return new Channel(this, data.content)
  }

  async getVideo(videoId: string): Promise<Video> {
    const data: ResponsePayload<VideoPayload> = await this.rest.request({
      url: GET_VIDEO(videoId)
    })
    return new Video(this, data.content)
  }

  async searchVideo(
    keyword: string,
    options?: SearchOptions
  ): Promise<
    SearchResult<SearchResultCleaned<VideoPayload>, Video, SearchType.VIDEO>
  > {
    const data: ResponsePayload<
      SearchResultPayload<{ video: VideoPayload; channel: ChannelPayload }>
    > = await this.rest.request({
      url: SEARCH_VIDEO,
      query: {
        keyword,
        size: options?.size?.toString() ?? '12',
        offset: options?.offset?.toString() ?? '0'
      }
    })
    return new SearchResult(
      this,
      {
        size: data.content.size,
        nextOffset: data.content.page?.next.offset ?? undefined,
        result: data.content.data.map((result) => ({
          ...result.video,
          channel: result.channel
        }))
      },
      SearchType.VIDEO,
      keyword
    )
  }

  async *searchVideoIter(
    keyword: string,
    options?: SearchOptions
  ): AsyncGenerator<
    SearchResult<SearchResultCleaned<VideoPayload>, Video, SearchType.VIDEO>,
    any,
    unknown
  > {
    let r: SearchResult<
      SearchResultCleaned<VideoPayload>,
      Video,
      SearchType.VIDEO
    > = await this.searchVideo(keyword, options)
    while (r.length > 0) {
      yield r
      r = await r.next()
    }
  }

  async searchLive(
    keyword: string,
    options?: SearchOptions
  ): Promise<
    SearchResult<SearchResultCleaned<LivePayload>, Live, SearchType.LIVE>
  > {
    const data: ResponsePayload<
      SearchResultPayload<{ live: LivePayload; channel: ChannelPayload }>
    > = await this.rest.request({
      url: SEARCH_LIVE,
      query: {
        keyword,
        size: options?.size?.toString() ?? '12',
        offset: options?.offset?.toString() ?? '0'
      }
    })
    return new SearchResult(
      this,
      {
        size: data.content.size,
        nextOffset: data.content.page?.next.offset ?? undefined,
        result: data.content.data.map((result) => ({
          ...result.live,
          channel: result.channel
        }))
      },
      SearchType.LIVE,
      keyword
    )
  }

  async *searchLiveIter(
    keyword: string,
    options?: SearchOptions
  ): AsyncGenerator<
    SearchResult<SearchResultCleaned<LivePayload>, Live, SearchType.LIVE>,
    any,
    unknown
  > {
    let r: SearchResult<
      SearchResultCleaned<LivePayload>,
      Live,
      SearchType.LIVE
    > = await this.searchLive(keyword, options)
    while (r.length > 0) {
      yield r
      r = await r.next()
    }
  }

  async searchChannel(
    keyword: string,
    options?: SearchOptions
  ): Promise<
    SearchResult<
      SearchResultCleaned<ChannelPayload>,
      Channel,
      SearchType.CHANNEL
    >
  > {
    const data: ResponsePayload<
      SearchResultPayload<{ channel: ChannelPayload }>
    > = await this.rest.request({
      url: SEARCH_CHANNEL,
      query: {
        keyword,
        size: options?.size?.toString() ?? '12',
        offset: options?.offset?.toString() ?? '0'
      }
    })
    return new SearchResult(
      this,
      {
        size: data.content.size,
        nextOffset: data.content.page?.next.offset ?? undefined,
        result: data.content.data.map((result) => result.channel)
      },
      SearchType.CHANNEL,
      keyword
    )
  }

  async *searchChannelIter(
    keyword: string,
    options?: SearchOptions
  ): AsyncGenerator<
    SearchResult<
      SearchResultCleaned<ChannelPayload>,
      Channel,
      SearchType.CHANNEL
    >,
    any,
    unknown
  > {
    let r: SearchResult<
      SearchResultCleaned<ChannelPayload>,
      Channel,
      SearchType.CHANNEL
    > = await this.searchChannel(keyword, options)
    while (r.length > 0) {
      yield r
      r = await r.next()
    }
  }
}
