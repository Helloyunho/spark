export interface UserPayload {
  hasProfile: boolean
  userIdHash: string | null
  nickname: string | null
  profileImageUrl: string | null
  penalties: [] | null
  officialNotiAgree: boolean
  officialNotiAgreeUpdateDate: string | null
  verifiedMark: boolean
  loggedIn: boolean
}
