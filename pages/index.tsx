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
  getPostBySlug,
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
import { featuredBooks } from 'appConfig'
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
  firstFeaturedBook?: GhostPostOrPage
  secondFeaturedBook?: GhostPostOrPage
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

  const { settings, latestPosts, featuredPosts, firstFeaturedBook, secondFeaturedBook, seoImage, bodyClass } = cmsData

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
              {memberSubscriptions && <HomeSubscription {...{ settings }} />}

              <HomeTopicCards {...{ settings }} />
              <div className="post-section">
                <PostLists {...{ settings, posts: featuredPosts, title: 'Featured ' }} />
                <PostLists {...{ settings, posts: latestPosts, title: 'Latest ' }} />
              </div>

              <div className="post-featured-section">
                <header className="post-featured-header">
                  <h3>Read My Book Summaries</h3>
                  <hr className="heading-underline" />
                </header>
                <div className="post-featured-container">
                  {firstFeaturedBook && <PostFeatured {...{ settings, post: firstFeaturedBook, imageUrl: featuredBooks[0].imageUrl }} />}
                  {secondFeaturedBook && <PostFeatured {...{ settings, post: secondFeaturedBook, imageUrl: featuredBooks[1].imageUrl }} />}
                </div>
              </div>
            </div>
            {memberSubscriptions && <Subscribe {...{ settings }} />}
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
  let firstFeaturedBook: GhostPostOrPage | null
  let secondFeaturedBook: GhostPostOrPage | null

  try {
    settings = await getOptimizedAllSettings()
    latestPosts = await getOptimizedLatestPosts({ limit: 5 })
    featuredPosts = await getOptimizedAllFeaturedPosts({ limit: 5 })
    firstFeaturedBook = await getPostBySlug(featuredBooks[0].slug)
    secondFeaturedBook = await getPostBySlug(featuredBooks[1].slug)
  } catch (error) {
    throw new Error('Index creation failed.')
  }

  const cmsData = {
    settings,
    // posts,
    latestPosts,
    featuredPosts,
    firstFeaturedBook,
    secondFeaturedBook,
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
