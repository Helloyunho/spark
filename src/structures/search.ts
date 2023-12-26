/* eslint-disable @typescript-eslint/indent */
import type { Client } from '../client/index.ts'
import { Video } from './video.ts'
import { Live } from './live.ts'
import { Channel } from './channel.ts'
import type { VideoPayload } from '../types/video.ts'
import type { LivePayload } from '../types/live.ts'
import type { ChannelPayload } from '../types/channel.ts'
import type { SearchResultCleaned } from '../types/search.ts'

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

interface SearchTypeToPayloadMap {
  videos: VideoPayload
  lives: LivePayload
  channels: ChannelPayload
}

export class SearchResult<
  Payload extends SearchResultCleaned<SearchTypeToPayloadMap[Type]>,
  Result extends SearchTypeToClassMap[Type],
  Type extends SearchType
> {
  client: Client
  type: Type
  size: number
  offset: number = 0
  nextOffset?: number
  keyword?: string
  results: Result[]

  constructor(client: Client, payload: Payload, type: Type, keyword?: string) {
    this.client = client
    this.results = payload.result.map((result) => {
      switch (type) {
        case SearchType.VIDEO:
          return new Video(client, result as VideoPayload) as Result // since we already handle partial videos
        case SearchType.LIVE:
          return new Live(client, result as LivePayload) as Result
        case SearchType.CHANNEL:
          return new Channel(client, result as ChannelPayload) as Result
        default:
          throw new Error('Invalid search type')
      }
    })
    this.type = type
    this.size = payload.size
    this.nextOffset = payload.nextOffset
    this.offset = payload.nextOffset ? payload.nextOffset - payload.size : 0
    this.keyword = keyword
  }

  get length(): number {
    return this.results.length
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
    const size = this.offset > this.size ? this.size : this.offset
    const offset = this.offset > this.size ? this.offset - this.size : 0
    switch (this.type) {
      case SearchType.VIDEO:
        return (await this.client.searchVideo(this.keyword, {
          size,
          offset
        })) as SearchResult<Payload, Result, Type>
      case SearchType.LIVE:
        return (await this.client.searchLive(this.keyword, {
          size,
          offset
        })) as SearchResult<Payload, Result, Type>
      case SearchType.CHANNEL:
        return (await this.client.searchChannel(this.keyword, {
          size,
          offset
        })) as SearchResult<Payload, Result, Type>
      default:
        throw new Error('Invalid search type')
    }
  }

  first(): Result | undefined {
    return this.results[0]
  }

  last(): Result | undefined {
    return this.results[this.results.length - 1]
  }

  // array methods
  concat(...items: Result[][]): Result[] {
    return this.results.concat(...items)
  }

  every(
    predicate: (value: Result, index: number, array: Result[]) => unknown,
    thisArg?: unknown
  ): boolean {
    return this.results.every(predicate, thisArg)
  }

  filter(
    predicate: (value: Result, index: number, array: Result[]) => unknown,
    thisArg?: unknown
  ): Result[] {
    return this.results.filter(predicate, thisArg)
  }

  find(
    predicate: (value: Result, index: number, obj: Result[]) => unknown,
    thisArg?: unknown
  ): Result | undefined {
    return this.results.find(predicate, thisArg)
  }

  findIndex(
    predicate: (value: Result, index: number, obj: Result[]) => unknown,
    thisArg?: unknown
  ): number {
    return this.results.findIndex(predicate, thisArg)
  }

  flat<D extends number = 1>(depth?: D): Array<FlatArray<Result[], D>> {
    return this.results.flat(depth)
  }

  flatMap<U>(
    callback: (value: Result, index: number, array: Result[]) => U,
    thisArg?: unknown
  ): U[] {
    return this.results.flatMap(callback, thisArg)
  }

  forEach(
    callbackfn: (value: Result, index: number, array: Result[]) => void,
    thisArg?: unknown
  ): void {
    this.results.forEach(callbackfn, thisArg)
  }

  includes(searchElement: Result, fromIndex?: number): boolean {
    return this.results.includes(searchElement, fromIndex)
  }

  indexOf(searchElement: Result, fromIndex?: number): number {
    return this.results.indexOf(searchElement, fromIndex)
  }

  lastIndexOf(searchElement: Result, fromIndex?: number): number {
    return this.results.lastIndexOf(searchElement, fromIndex)
  }

  join(separator?: string): string {
    return this.results.join(separator)
  }

  map<U>(
    callbackfn: (value: Result, index: number, array: Result[]) => U,
    thisArg?: unknown
  ): U[] {
    return this.results.map(callbackfn, thisArg)
  }

  reduce(
    callbackfn: (
      previousValue: Result,
      currentValue: Result,
      currentIndex: number,
      array: Result[]
    ) => Result
  ): Result
  reduce(
    callbackfn: (
      previousValue: Result,
      currentValue: Result,
      currentIndex: number,
      array: Result[]
    ) => Result,
    initialValue: Result
  ): Result
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: Result,
      currentIndex: number,
      array: Result[]
    ) => U,
    initialValue: U
  ): U
  reduce<U>(
    callbackfn: (
      previousValue: U | Result,
      currentValue: Result,
      currentIndex: number,
      array: Result[]
    ) => U | Result,
    initialValue?: U | Result
  ): U | Result {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.results.reduce<any>(callbackfn, initialValue)
  }

  some(
    predicate: (value: Result, index: number, array: Result[]) => unknown,
    thisArg?: unknown
  ): boolean {
    return this.results.some(predicate, thisArg)
  }
}
