import { useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderIndex } from '@components/HeaderIndex'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { SEO } from '@meta/seo'
import { Subscribe } from '@components/Subscribe'
import { HomeSubscription } from '@components/home/HomeSubscription'

import { processEnv } from '@lib/processEnv'
import {
  getOptimizedAllDeveloperPosts,
  getOptimizedAllFeaturedPosts,
  getOptimizedAllPosts,
  getOptimizedAllSettings,
  getOptimizedLatestPosts,
  GhostPostOrPage,
  GhostPostsOrPages,
  GhostSettings,
  OptimizedPosts,
} from '@lib/ghost'
import { seoImage, ISeoImage } from '@meta/seoImage'

import { BodyClass } from '@helpers/BodyClass'
import { Search } from '@components/search/search'
import { TagFilter } from '@components/filters/TagFilter'
import { PostLists } from '@components/home/PostLists'
import { PostFeatured } from '@components/home/PostFeatured'
import { featuredPosts } from 'appConfig'
import { HomeTopicCards } from '@components/home/HomeTopicCards'

/**
 * Main index page (home page)
 *
 * Loads all posts from CMS
 *
 */

interface CmsData {
  posts: GhostPostsOrPages
  latestPosts?: GhostPostsOrPages
  featuredPosts?: GhostPostsOrPages
  settings: GhostSettings
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  bodyClass: string
}

interface IndexProps {
  cmsData: CmsData
}

export default function Index({ cmsData }: IndexProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { settings, latestPosts, featuredPosts, seoImage, bodyClass } = cmsData
  console.log('fetured posts', featuredPosts)

  const { processEnv } = settings
  const { nextImages, toc, memberSubscriptions, commenting } = processEnv

  // const [filteredPosts, setFilteredPosts] = useState<GhostPostsOrPages>(posts)

  return (
    <>
      <SEO {...{ settings, seoImage }} />
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <Layout {...{ bodyClass, sticky, settings, isHome: true }} header={<HeaderIndex {...{ settings }} />}>
            {/* <Search {...{ posts, setFilteredPosts }} placeholder="Search articles..." />
            <TagFilter {...{ posts, setFilteredPosts }} />
            <PostView {...{ settings, posts: filteredPosts, isHome: true }} /> */}

            <div className="inner">
              {!memberSubscriptions && <HomeSubscription {...{ settings }} />}

              <HomeTopicCards {...{ settings }} />
              <div className="post-section">
                <PostLists {...{ settings, posts: featuredPosts, title: 'Featured ' }} />
                <PostLists {...{ settings, posts: latestPosts, title: 'Latest ' }} />
              </div>
              <header className="post-featured-header">
                <h3>Read My Book Summaries</h3>
              </header>
              <div className="post-featured-section">
                {latestPosts && <PostFeatured {...{ settings, post: latestPosts[0] }} />}
                {latestPosts && <PostFeatured {...{ settings, post: latestPosts[1] }} />}
              </div>
            </div>
            {/* {!memberSubscriptions && <Subscribe {...{ settings }} />} */}
          </Layout>
        )}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let settings
  let posts: OptimizedPosts | []
  let latestPosts: OptimizedPosts | []
  let featuredPosts: OptimizedPosts | []
  let featuredBooks: OptimizedPosts | []

  try {
    settings = await getOptimizedAllSettings()
    // posts = await getOptimizedAllDeveloperPosts()
    latestPosts = await getOptimizedLatestPosts({ limit: 5 })
    featuredPosts = await getOptimizedAllFeaturedPosts({ limit: 5 })
  } catch (error) {
    throw new Error('Index creation failed.')
  }

  const cmsData = {
    settings,
    // posts,
    latestPosts,
    featuredPosts,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
    bodyClass: BodyClass({ isHome: true }),
  }

  return {
    props: {
      cmsData,
    },
    ...(processEnv.isr.enable && { revalidate: processEnv.isr.revalidate }), // re-generate at most once every second
  }
}
