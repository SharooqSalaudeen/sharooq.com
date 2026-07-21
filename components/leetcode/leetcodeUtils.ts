import { GhostPostsOrPages, OptimizedPosts } from '@lib/ghost'

// ── Types ──────────────────────────────────────────────────────────────────

export interface PracticeDay {
  date: string
  count: number
  level: number
}

export interface MonthLabel {
  name: string
  colStart: number
  colEnd: number
}

export interface PatternCount {
  name: string
  slug: string
  url?: string
  count: number
  latestPublishedAt: number
}

export interface PracticeTracker {
  activeDays: number
  totalWriteUps: number
  weeks: PracticeDay[][]
}

type TrackablePosts = GhostPostsOrPages | OptimizedPosts

// ── Constants ──────────────────────────────────────────────────────────────

export const dayInMs = 24 * 60 * 60 * 1000
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const excludedPatternTags = ['leetcode', 'leetcodes']

// ── Helpers ────────────────────────────────────────────────────────────────

export const getDateKey = (date: Date) => date.toISOString().slice(0, 10)

export const startOfUtcDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * dayInMs)

export const getPracticeCountLevel = (count: number) => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count < 5) return 3
  return 4
}

export const getMonthLabels = (weeks: PracticeDay[][]): MonthLabel[] => {
  const labels: MonthLabel[] = []
  let currentMonth = -1

  weeks.forEach((week, index) => {
    if (!week[0]) return
    const month = new Date(week[0].date).getUTCMonth()
    if (month !== currentMonth) {
      if (labels.length > 0) labels[labels.length - 1].colEnd = index + 1
      labels.push({ name: MONTH_NAMES[month], colStart: index + 1, colEnd: weeks.length + 1 })
      currentMonth = month
    }
  })

  // Skip the first label if the month occupies fewer than 2 columns (partial month at range start)
  if (labels.length > 0 && labels[0].colEnd - labels[0].colStart < 2) labels.shift()

  return labels
}

export const getPracticeTracker = (posts: TrackablePosts): PracticeTracker => {
  const today = startOfUtcDay(new Date())
  const rangeStart = addDays(today, -364)
  const calendarStart = addDays(rangeStart, -rangeStart.getUTCDay())
  const countByDate = new Map<string, number>()

  posts.forEach((post) => {
    if (!post.published_at) return
    const postDate = startOfUtcDay(new Date(post.published_at))
    if (postDate < rangeStart || postDate > today) return
    const dateKey = getDateKey(postDate)
    countByDate.set(dateKey, (countByDate.get(dateKey) || 0) + 1)
  })

  const weeks: PracticeDay[][] = []

  for (let date = calendarStart; date <= today; date = addDays(date, 1)) {
    const dateKey = getDateKey(date)
    const count = date < rangeStart ? 0 : countByDate.get(dateKey) || 0
    const weekIndex = Math.floor((date.getTime() - calendarStart.getTime()) / (dayInMs * 7))

    if (!weeks[weekIndex]) weeks[weekIndex] = []
    weeks[weekIndex].push({ date: dateKey, count, level: getPracticeCountLevel(count) })
  }

  const activeDays = Array.from(countByDate.values()).filter((count) => count > 0).length
  const totalWriteUps = Array.from(countByDate.values()).reduce((total, count) => total + count, 0)

  return { activeDays, totalWriteUps, weeks }
}

export const getPatternCounts = (posts: TrackablePosts): PatternCount[] => {
  const patternMap = new Map<string, PatternCount>()

  posts.forEach((post) => {
    const publishedAt = post.published_at ? new Date(post.published_at).getTime() : 0

    post.tags?.forEach((tag) => {
      if (!tag.slug || !tag.name) return
      if (tag.name.startsWith('#')) return
      if (excludedPatternTags.includes(tag.slug.toLowerCase())) return

      const current = patternMap.get(tag.slug)
      patternMap.set(tag.slug, {
        name: tag.name,
        slug: tag.slug,
        url: tag.url || undefined,
        count: current ? current.count + 1 : 1,
        latestPublishedAt: Math.max(current?.latestPublishedAt || 0, publishedAt),
      })
    })
  })

  return Array.from(patternMap.values()).sort((a, b) => b.latestPublishedAt - a.latestPublishedAt || b.count - a.count || a.name.localeCompare(b.name))
}
