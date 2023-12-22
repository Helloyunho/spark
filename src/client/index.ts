import { ChzzkClient } from 'chzzk'
import { User } from '../structures/user.ts'
import { Channel } from '../structures/channel.ts'
import { Video } from '../structures/video.ts'

export class Client {
  chzzkClient: ChzzkClient

  constructor() {
    this.chzzkClient = new ChzzkClient()
  }

  async getUser(): Promise<User> {
    return new User(await this.chzzkClient.user())
  }

  async getChannel(channelId: string): Promise<Channel> {
    return new Channel(await this.chzzkClient.channel(channelId))
  }

  async getVideo(videoId: string): Promise<Video> {
    return new Video(await this.chzzkClient.video(videoId))
  }
}
