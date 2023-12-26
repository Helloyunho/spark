export interface ActivityBadgePayload {
  badgeNo: number
  badgeId: string
  imageUrl: string
  title: string
  description: string
  activated: boolean
}

export interface ProfilePayload {
  userIdHash: string
  nickname: string
  profileImageUrl: string | null
  userRoleCode: string
  badge: string | null
  title: string | null
  verifiedMark: boolean
  activityBadges: ActivityBadgePayload[]
  streamingProperty: unknown
  /* imma keep it like this cuz it looks like it's not finished yet
  streamingProperty?: {
    realTimeDonationRanking?: {
      badge?: {
        imageUrl: string
        title: string
        description: string
      }
    }
  }
  */
}
