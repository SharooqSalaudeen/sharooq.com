import Link from 'next/link'
import dayjs from 'dayjs'
import Image from 'next/image'

import { PostCard } from '@components/PostCard'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { PostClass } from '@helpers/PostClass'

import { getLang, get } from '@utils/use-lang'
import { Tag } from '@tryghost/content-api'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'

interface PostCardProps {
  settings: GhostSettings
  post: GhostPostOrPage
  num?: number
  isHome?: boolean
  imageUrl: string
}
export const PostFeatured = ({ settings, post, num, isHome, imageUrl }: PostCardProps) => {
  const { nextImages } = settings.processEnv
  const text = get(getLang(settings.lang))
  const cmsUrl = settings.url
  const collectionPath = collections.getCollectionByNode(post)
  const url = resolveUrl({ cmsUrl, collectionPath, slug: post.slug, url: post.url })
  const featImg = post.featureImage
  const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))
  const postClass = PostClass({ tags: post.tags, isFeatured: post.featured, isImage: !!featImg })
  const large = (featImg && isHome && num !== undefined && 0 === num % 6 && `post-card-large`) || ``
  const authors = post?.authors?.filter((_, i) => (i < 2 ? true : false))

  // const imageUrl = `https://res.cloudinary.com/sharooq/image/upload/v1661407564/Blog/home/featured_books/thumbnail-the-monk-who-sold-his-ferrari_eavd4a.jpg`
  return (
    <>
      <article className={`post-featured-card `}>
        {/* {featImg && ( */}
        <Link href={url}>
          <a className="post-card-image-link" aria-label={post.title}>
            {/* {nextImages.feature ? ( */}
            <div className="post-card-image">
              <Image
                src={imageUrl}
                alt={post.title}
                sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
                layout="fill"
                objectFit="contain"
                quality={nextImages.quality}
              />
            </div>
            {/* ) : ( */}
            {/* post.feature_image &&  */}
            {/* <img className="post-card-image" src={imageUrl} alt={post.title} /> */}
            {/* )} */}
          </a>
        </Link>
        {/* )} */}
        <div className="post-card-content">
          <div>
            <Link href={url}>
              <a className="post-card-content-link">
                <header className="post-card-header">
                  {/* {post.primary_tag && <div className="post-card-primary-tag">{post.primary_tag.name}</div>} */}

                  <h2 className="post-card-title">{post.title}</h2>
                </header>
                <section className="post-card-excerpt">
                  {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
                  <p>{post.excerpt}</p>
                </section>
              </a>
            </Link>
          </div>

          <footer className="post-card-meta">
            <div className="post-card-byline-content">
              <span className="post-card-byline-date">
                <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMM YYYY')}&nbsp;</time>
                <span className="bull">&bull; </span> {readingTime}
              </span>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}
