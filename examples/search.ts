import { Client } from '../src/client/index.ts'

const client = new Client()

const channels = await client.searchChannel('CHANNEL_NAME')
console.log(channels)

for await (const channel of client.searchChannelIter('CHANNEL_NAME')) {
  console.log(channel)
}
