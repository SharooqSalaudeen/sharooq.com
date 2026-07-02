import { useState } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { HeaderIndex } from '@components/HeaderIndex'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { BodyClass } from '@helpers/BodyClass'
import { getOptimizedAllLeetcodePosts, getOptimizedAllSettings, GhostPostsOrPages, GhostSettings, OptimizedPosts } from '@lib/ghost'
import { collections } from '@lib/collections'
import { processEnv } from '@lib/processEnv'
import { SEO } from '@meta/seo'
import { seoImage, ISeoImage } from '@meta/seoImage'
import { resolveUrl } from '@utils/routing'

interface CmsData {
  posts: GhostPostsOrPages
  settings: GhostSettings
  seoImage: ISeoImage
  bodyClass: string
}

interface LeetcodePageProps {
  cmsData: CmsData
}

const profileUrl = 'https://leetcode.com/'

const excludedPatternTags = ['leetcode', 'leetcodes']
const dayInMs = 24 * 60 * 60 * 1000

interface PracticeDay {
  date: string
  count: number
  level: number
}

interface PatternCount {
  name: string
  slug: string
  url?: string
  count: number
  latestPublishedAt: number
}

const getPatternCounts = (posts: GhostPostsOrPages) => {
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

const getDateKey = (date: Date) => date.toISOString().slice(0, 10)

const startOfUtcDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * dayInMs)

const getPracticeCountLevel = (count: number) => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count < 5) return 3
  return 4
}

const getPracticeTracker = (posts: GhostPostsOrPages) => {
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
    weeks[weekIndex].push({
      date: dateKey,
      count,
      level: getPracticeCountLevel(count),
    })
  }

  const activeDays = Array.from(countByDate.values()).filter((count) => count > 0).length
  const totalWriteUps = Array.from(countByDate.values()).reduce((total, count) => total + count, 0)

  return {
    activeDays,
    totalWriteUps,
    weeks,
  }
}

export default function LeetcodeJourney({ cmsData }: LeetcodePageProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { settings, posts, seoImage, bodyClass } = cmsData
  const { url: cmsUrl } = settings
  const patterns = getPatternCounts(posts)
  const quickLookupPosts = posts.filter((post) => post.featured)
  const [showAllPatterns, setShowAllPatterns] = useState(false)
  const visiblePatterns = showAllPatterns ? patterns : patterns.slice(0, 4)
  const practiceTracker = getPracticeTracker(posts)

  return (
    <>
      <SEO
        {...{
          settings,
          seoImage,
          title: 'LeetCode Journey',
          description: 'Sharooq Salaudeen records the practice, patterns, and consistency behind his LeetCode problem-solving journey. ',
        }}
      />
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <Layout
            {...{ bodyClass, sticky, settings, isHome: true }}
            header={
              <HeaderIndex
                {...{
                  settings,
                  pageTitle: 'LeetCode Journey',
                  pageDescription: 'Problems solved, patterns practiced, and notes from the process. Every post below is a problem I worked through and wrote about.',
                }}
              />
            }
          >
            <div className="inner leetcode-journey">
              <section className="leetcode-section">
                <div className="leetcode-section-heading leetcode-tracker-heading">
                  <div>
                    <p className="leetcode-kicker">Article tracker</p>
                    <h2>
                      {practiceTracker.totalWriteUps} {practiceTracker.totalWriteUps === 1 ? 'article' : 'articles'} in the last year
                    </h2>
                  </div>
                  <span>{practiceTracker.totalWriteUps} LeetCode articles</span>
                </div>
                <div className="leetcode-practice-tracker" aria-label="LeetCode articles over the last year">
                  <div className="leetcode-practice-grid" aria-hidden="true">
                    {practiceTracker.weeks.map((week, weekIndex) => (
                      <div className="leetcode-practice-week" key={weekIndex}>
                        {week.map((day) => (
                          <span
                            className={`leetcode-practice-day level-${day.level}`}
                            key={day.date}
                            title={`${day.date}: ${day.count} ${day.count === 1 ? 'article' : 'articles'}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="leetcode-practice-legend" aria-hidden="true">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <span className={`leetcode-practice-day level-${level}`} key={level} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </section>

              {quickLookupPosts.length > 0 && (
                <section className="leetcode-section">
                  <div className="leetcode-section-heading">
                    <p className="leetcode-kicker">Bookmarks</p>
                    <h2>Quick lookup notes</h2>
                  </div>
                  <div className="leetcode-quick-grid">
                    {quickLookupPosts.map((post) => (
                      <Link href={resolveUrl({ cmsUrl, collectionPath: collections.getCollectionByNode(post), slug: post.slug, url: post.url })} key={post.id}>
                        <a className="leetcode-quick-card">
                          <div>
                            <h3>{post.title}</h3>
                            {post.excerpt && <p>{post.excerpt}</p>}
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section className="leetcode-section">
                <div className="leetcode-section-heading">
                  <p className="leetcode-kicker">Patterns</p>
                  <h2>Problems solved by pattern</h2>
                </div>
                {patterns.length > 0 ? (
                  <>
                    <div className="leetcode-pattern-grid">
                      {visiblePatterns.map((pattern) => (
                        <Link href={resolveUrl({ cmsUrl, slug: pattern.slug, url: pattern.url })} key={pattern.slug}>
                          <a className="leetcode-pattern-card" aria-label={`View posts tagged ${pattern.name}`}>
                            <strong>{pattern.count}</strong>
                            <span>{pattern.name}</span>
                          </a>
                        </Link>
                      ))}
                    </div>
                    {patterns.length > 4 && (
                      <button className="leetcode-expand-button" type="button" onClick={() => setShowAllPatterns((current) => !current)}>
                        {showAllPatterns ? 'Show latest 4' : `Show all ${patterns.length} patterns`}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="leetcode-empty-state">Add pattern tags to your LeetCode posts to show counts here.</p>
                )}
              </section>

              <section className="leetcode-section leetcode-log-section" id="journey-log">
                <div className="leetcode-section-heading">
                  <p className="leetcode-kicker">Journey log</p>
                  <h2>LeetCode write-ups</h2>
                </div>
                {posts.length > 0 ? <PostView {...{ settings, posts, isHome: true }} /> : <p className="leetcode-empty-state">No LeetCode posts found yet.</p>}
              </section>
            </div>
          </Layout>
        )}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let settings
  let posts: OptimizedPosts | []

  try {
    settings = await getOptimizedAllSettings()
    posts = await getOptimizedAllLeetcodePosts()
  } catch (error) {
    throw new Error('LeetCode journey page creation failed.')
  }

  const cmsData = {
    posts,
    settings,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
    bodyClass: BodyClass({ isHome: true }),
  }

  return {
    props: {
      cmsData,
    },
    ...(processEnv.isr.enable && { revalidate: processEnv.isr.revalidate }),
  }
}
