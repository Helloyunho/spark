import type { User as ChzzkUser } from 'chzzk/dist/api/user.js'

export class User {
  hasProfile: boolean
  loggedIn: boolean
  nick: string
  noticeAgree: boolean
  noticeAgreeUpdatedAt?: Date
  penalties: [] // unknown
  imageURL: string
  id: string
  verified: boolean

  constructor(data: ChzzkUser) {
    this.hasProfile = data.hasProfile
    this.loggedIn = data.loggedIn
    this.nick = data.nickname
    this.noticeAgree = data.officialNotiAgree
    this.noticeAgreeUpdatedAt = data.officialNotiAgreeUpdateDate
      ? new Date(data.officialNotiAgreeUpdateDate)
      : undefined
    this.penalties = data.penalties
    this.imageURL = data.profileImageUrl
    this.id = data.userIdHash
    this.verified = data.verifiedMark
  }
}
