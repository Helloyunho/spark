import type { UserPayload } from '../types/user.ts'

export class User {
  hasProfile: boolean
  loggedIn: boolean
  nick?: string
  noticeAgree: boolean
  noticeAgreeUpdatedAt?: Date
  penalties?: [] // unknown
  imageURL?: string
  id?: string
  verified: boolean

  constructor(data: UserPayload) {
    this.hasProfile = data.hasProfile
    this.loggedIn = data.loggedIn
    this.nick = data.nickname ?? undefined
    this.noticeAgree = data.officialNotiAgree
    this.noticeAgreeUpdatedAt = data.officialNotiAgreeUpdateDate
      ? new Date(data.officialNotiAgreeUpdateDate)
      : undefined
    this.penalties = data.penalties ?? undefined
    this.imageURL = data.profileImageUrl ?? undefined
    this.id = data.userIdHash ?? undefined
    this.verified = data.verifiedMark
  }
}
