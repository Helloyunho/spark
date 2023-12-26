import { Client } from '../src/client/index.ts'

const client = new Client()

const channels = await client.searchChannel('CHANNEL_NAME')
console.log(channels)

for await (const channel of client.searchChannelIter('CHANNEL_NAME')) {
  console.log(channel)
}

const videos = await client.searchVideo('VIDEO_NAME')
console.log(videos)

for await (const video of client.searchVideoIter('VIDEO_NAME')) {
  console.log(video)
}

const lives = await client.searchLive('LIVE_NAME')
console.log(lives)

for await (const live of client.searchLiveIter('LIVE_NAME')) {
  console.log(live)
}
