export const API_URL = 'https://api.chzzk.naver.com'
export const API_VERSION = 'v1'
export const GAME_API_URL = 'https://comm-api.game.naver.com/nng_main'
export const GAME_API_VERSION = 'v1'
export const CHAT_SERVER_URL = (serverNo: string): string =>
  `wss://kr-ss${serverNo}.chat.naver.com/chat`

export const GET_USER_STATUS = `${GAME_API_URL}/${GAME_API_VERSION}/user/getUserStatus`
export const GET_CHANNEL = (channelID: string): string =>
  `${API_URL}/service/${API_VERSION}/channels/${channelID}`
export const GET_VIDEO = (videoNo: string): string =>
  `${API_URL}/service/${API_VERSION}/videos/${videoNo}`

export const GET_CHANNEL_LIVE_STATUS = (channelID: string): string =>
  `${API_URL}/polling/${API_VERSION}/channels/${channelID}/live-status`
export const GET_CHANNEL_LIVE_DETAIL = (channelID: string): string =>
  `${API_URL}/service/${API_VERSION}/channels/${channelID}/live-detail`

export const SEARCH_VIDEO = `${API_URL}/service/${API_VERSION}/search/videos`
export const SEARCH_LIVE = `${API_URL}/service/${API_VERSION}/search/lives`
export const SEARCH_CHANNEL = `${API_URL}/service/${API_VERSION}/search/channels`

export const GET_ACCESS_TOKEN = `${GAME_API_URL}/${GAME_API_VERSION}/chats/access-token`
export const GET_CHAT_PROFILE = (chatID: string, channelID: string): string =>
  `${GAME_API_URL}/${GAME_API_VERSION}/chats/${chatID}/users/${channelID}/profile`
export const GET_CHAT_PROFILE_CARD = (
  chatID: string,
  channelID: string
): string =>
  `${GAME_API_URL}/${GAME_API_VERSION}/chats/${chatID}/users/${channelID}/profile-card`
