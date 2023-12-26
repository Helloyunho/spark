import { Client } from '../src/client/index.ts'

const client = new Client({
  auth: 'NID_AUT',
  session: 'NID_SES'
})

/*
Or you can set the auth and session later:
client.setCredentials({
  auth: 'NID_AUT',
  session: 'NID_SES'
})
*/

const channels = await client.searchChannel('CHANNEL')
const firstChannel = channels.first()

if (!firstChannel) {
  throw new Error('No channel found')
}

console.log(firstChannel.name)

const live = await firstChannel.getLiveDetail()
console.log(live.title)

live.chat.on('message', (msg) => {
  console.log(msg.content)
})
live.chat.on('debug', (msg) => {
  console.log(msg)
})
await live.chat.connect()

console.log(await live.chat.ping())

setTimeout(async () => {
  console.log(await live.chat.getRecentMessages(10))
  await live.chat.sendMessage('CONTENT')
}, 1000)
