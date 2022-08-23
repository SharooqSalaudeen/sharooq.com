import Link from 'next/link'
import dayjs from 'dayjs'

import { PostCard } from '@components/PostCard'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'
import { Tag } from '@tryghost/content-api'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'

interface PreviewPostsProps {
  settings: GhostSettings
  primaryTag?: Tag | null
  posts?: GhostPostsOrPages
  prev?: GhostPostOrPage
  next?: GhostPostOrPage
}

export const HomeLatestArticles = ({ settings, primaryTag, posts, prev, next }: PreviewPostsProps) => {
  const text = get(getLang(settings.lang))
  const { url: cmsUrl } = settings
  const url = (primaryTag && resolveUrl({ cmsUrl, slug: primaryTag.slug, url: primaryTag.url })) || ''
  const primaryTagCount = primaryTag?.count?.posts

  return (
    <>
      {posts && 0 < posts.length && (
        <article className="articles-list">
          <header className="articles-list-header">
            <h3>Latest Articles</h3>
          </header>
          <div className="articles-list-content">
            <ul>
              {posts?.map((post, i) => (
                <li key={i}>
                  <h4>
                    <Link href={resolveUrl({ cmsUrl, collectionPath: collections.getCollectionByNode(post), slug: post.slug, url: post.url })}>
                      <a>{post.title}</a>
                    </Link>
                  </h4>
                  <div className="articles-list-meta">
                    <p>
                      <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMMM, YYYY')}</time> –{' '}
                      {readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <footer className="articles-list-footer">
            <Link href={url}>
              <a>See more</a>
            </Link>
          </footer>
        </article>
      )}

      {prev && prev.slug && <PostCard {...{ settings, post: prev }} />}

      {next && next.slug && <PostCard {...{ settings, post: next }} />}
    </>
  )
}
