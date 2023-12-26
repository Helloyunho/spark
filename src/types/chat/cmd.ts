export enum ChatCmd {
  PING = 0, // request, response
  PONG = 10000, // response, response
  AUTH = 100, // request
  AUTH_SUCC = 10100, // response
  GET_RECENT_MESSAGES = 5101, // request
  RECENT_MESSAGES = 15101, // response
  EVENT = 93006, // response
  MESSAGE = 93101, // response
  DONATION = 93102, // response
  KICK = 94005, // response
  BLOCK = 94006, // response
  BLIND = 94008, // response
  NOTICE = 94010, // response
  PENALTY = 94015, // response
  SEND_MESSAGE = 3101, // request
  SEND_MESSAGE_SUCC = 13101 // response
}
