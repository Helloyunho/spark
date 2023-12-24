/* eslint-disable @typescript-eslint/indent */
import {
  ChzzkClient,
  type LiveSearchResult,
  type VideoSearchResult as ChzzkVideoSearchResult,
  type ChannelSearchResult as ChzzkChannelSearchResult
} from 'chzzk'
import { User } from '../structures/user.ts'
import { Channel } from '../structures/channel.ts'
import { Video } from '../structures/video.ts'
import {
  SearchResult,
  SearchType,
  type SearchOptions
} from '../structures/search.ts'
import type { Live } from '../structures/live.ts'

export class Client {
  chzzkClient: ChzzkClient

  constructor() {
    this.chzzkClient = new ChzzkClient()
  }

  async getUser(): Promise<User> {
    return new User(await this.chzzkClient.user())
  }

  async getChannel(channelId: string): Promise<Channel> {
    return new Channel(this, await this.chzzkClient.channel(channelId))
  }

  async getVideo(videoId: string): Promise<Video> {
    return new Video(this, await this.chzzkClient.video(videoId))
  }

  async searchVideo(
    keyword: string,
    options?: SearchOptions
  ): Promise<SearchResult<ChzzkVideoSearchResult, Video, SearchType.VIDEO>> {
    return new SearchResult(
      this,
      await this.chzzkClient.search.videos(keyword, {
        size: 12,
        offset: 0,
        ...options
      }),
      SearchType.VIDEO,
      keyword
    )
  }

  async *searchVideoIter(
    keyword: string,
    options?: SearchOptions
  ): AsyncGenerator<
    SearchResult<ChzzkVideoSearchResult, Video, SearchType.VIDEO>,
    any,
    unknown
  > {
    return {
      async *[Symbol.asyncIterator]() {
        let r: SearchResult<ChzzkVideoSearchResult, Video, SearchType.VIDEO> =
          await this.searchVideo(keyword, options)
        while (r.length > 0) {
          yield r
          r = await r.next()
        }
      }
    }
  }

  async searchLive(
    keyword: string,
    options?: SearchOptions
  ): Promise<SearchResult<LiveSearchResult, Live, SearchType.LIVE>> {
    return new SearchResult(
      this,
      await this.chzzkClient.search.lives(keyword, {
        size: 12,
        offset: 0,
        ...options
      }),
      SearchType.LIVE,
      keyword
    )
  }

  async *searchLiveIter(
    keyword: string,
    options?: SearchOptions
  ): AsyncGenerator<
    SearchResult<LiveSearchResult, Live, SearchType.LIVE>,
    any,
    unknown
  > {
    return {
      async *[Symbol.asyncIterator]() {
        let r: SearchResult<LiveSearchResult, Live, SearchType.LIVE> =
          await this.searchLive(keyword, options)
        while (r.length > 0) {
          yield r
          r = await r.next()
        }
      }
    }
  }

  async searchChannel(
    keyword: string,
    options?: SearchOptions
  ): Promise<
    SearchResult<ChzzkChannelSearchResult, Channel, SearchType.CHANNEL>
  > {
    return new SearchResult(
      this,
      await this.chzzkClient.search.channels(keyword, {
        size: 12,
        offset: 0,
        ...options
      }),
      SearchType.CHANNEL,
      keyword
    )
  }

  async *searchChannelIter(
    keyword: string,
    options?: SearchOptions
  ): AsyncGenerator<
    SearchResult<ChzzkChannelSearchResult, Channel, SearchType.CHANNEL>,
    any,
    unknown
  > {
    let r: SearchResult<ChzzkChannelSearchResult, Channel, SearchType.CHANNEL> =
      await this.searchChannel(keyword, options)
    while (r.length > 0) {
      yield r
      r = await r.next()
    }
  }
}
