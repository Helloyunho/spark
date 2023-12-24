export interface UserPayload {
  hasProfile: boolean
  userIdHash: string
  nickname: string
  profileImageUrl: string
  penalties: []
  officialNotiAgree: boolean
  officialNotiAgreeUpdateDate: string | null
  verifiedMark: boolean
  loggedIn: boolean
}
