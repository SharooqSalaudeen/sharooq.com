import { useState } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { HeaderIndex } from '@components/HeaderIndex'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { BodyClass } from '@helpers/BodyClass'
import { getAllLeetcodePosts, getOptimizedAllLeetcodePosts, getOptimizedAllSettings, GhostPostsOrPages, GhostSettings, OptimizedPosts } from '@lib/ghost'
import { collections } from '@lib/collections'
import { processEnv } from '@lib/processEnv'
import { SEO } from '@meta/seo'
import { seoImage, ISeoImage } from '@meta/seoImage'
import { resolveUrl } from '@utils/routing'
import { getPracticeTracker, getPatternCounts, PracticeTracker } from '@components/leetcode/leetcodeUtils'
import { LeetcodeTrackerGrid } from '@components/leetcode/LeetcodeTrackerGrid'
import { Search } from '@components/search/search'

interface CmsData {
  posts: GhostPostsOrPages
  practiceTracker: PracticeTracker
  settings: GhostSettings
  seoImage: ISeoImage
  bodyClass: string
}

interface LeetcodePageProps {
  cmsData: CmsData
}

const profileUrl = 'https://leetcode.com/'

export default function LeetcodeJourney({ cmsData }: LeetcodePageProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { settings, posts, practiceTracker, seoImage, bodyClass } = cmsData
  const { url: cmsUrl } = settings
  const [filteredPosts, setFilteredPosts] = useState<GhostPostsOrPages>(posts)
  const patterns = getPatternCounts(posts)
  const quickLookupPosts = posts.filter((post) => post.featured)
  const [showAllPatterns, setShowAllPatterns] = useState(false)
  const visiblePatterns = showAllPatterns ? patterns : patterns.slice(0, 4)

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
                  pageDescription: 'Problems solved, patterns practiced, and notes from the process.',
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
                      {practiceTracker.totalWriteUps} {practiceTracker.totalWriteUps === 1 ? 'leetcode article' : 'leetcode articles'} in the{' '}
                      <span className="tracker-period-desktop">last year</span>
                      <span className="tracker-period-mobile">last 6 months</span>
                    </h2>
                  </div>
                  <a href="https://github.com/SharooqSalaudeen/data-structures-and-algorithms-solutions" className="leetcode-github-link" target="_blank" rel="noopener noreferrer">
                    GitHub Solutions ↗
                  </a>
                </div>
                <LeetcodeTrackerGrid tracker={practiceTracker} ariaLabel="LeetCode articles over the last year" />
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
                <Search {...{ posts, setFilteredPosts }} placeholder="Search leetcode articles..." />
                {filteredPosts.length > 0 ? (
                  <PostView {...{ settings, posts: filteredPosts, isHome: true }} />
                ) : (
                  <p className="leetcode-empty-state">No LeetCode posts found yet.</p>
                )}
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
  let posts: GhostPostsOrPages
  let trackerPosts: OptimizedPosts | []

  try {
    settings = await getOptimizedAllSettings()
    posts = await getAllLeetcodePosts()
    trackerPosts = await getOptimizedAllLeetcodePosts()
  } catch (error) {
    throw new Error('LeetCode journey page creation failed.')
  }

  const cmsData = {
    posts,
    practiceTracker: getPracticeTracker(trackerPosts),
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
