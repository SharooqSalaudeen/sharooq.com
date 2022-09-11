import { useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderIndex } from '@components/HeaderIndex'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { SEO } from '@meta/seo'

import { processEnv } from '@lib/processEnv'
import { getOptimizedAllDeveloperPosts, getOptimizedAllPosts, getOptimizedAllSettings, GhostPostOrPage, GhostPostsOrPages, GhostSettings, OptimizedPosts } from '@lib/ghost'
import { seoImage, ISeoImage } from '@meta/seoImage'

import { BodyClass } from '@helpers/BodyClass'
import { Search } from '@components/search/search'
import { TagFilter } from '@components/filters/TagFilter'

/**
 * Main index page (home page)
 *
 * Loads all posts from CMS
 *
 */

interface CmsData {
  posts: GhostPostsOrPages
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

  const { settings, posts, seoImage, bodyClass } = cmsData
  const [filteredPosts, setFilteredPosts] = useState<GhostPostsOrPages>(posts)

  return (
    <>
      <SEO {...{ settings, seoImage }} />
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <Layout
            {...{ bodyClass, sticky, settings, isHome: true }}
            header={<HeaderIndex {...{ settings, pageTitle: 'Articles', pageDescription: 'Articles on a broad spectrum of programming paradigms, bug fixes and solutions' }} />}
          >
            <Search {...{ posts, setFilteredPosts }} placeholder="Search articles..." />
            <TagFilter {...{ posts, setFilteredPosts }} />
            <PostView {...{ settings, posts: filteredPosts, isHome: true }} />
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
    posts = await getOptimizedAllDeveloperPosts()
  } catch (error) {
    throw new Error('Index creation failed.')
  }

  const cmsData = {
    settings,
    posts,
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
