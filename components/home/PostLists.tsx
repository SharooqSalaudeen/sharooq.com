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
  title?: string
  settings: GhostSettings
  primaryTag?: Tag | null
  posts?: GhostPostsOrPages
}

export const PostLists = ({ title, settings, primaryTag, posts }: PreviewPostsProps) => {
  const text = get(getLang(settings.lang))
  const { url: cmsUrl } = settings
  const url = (primaryTag && resolveUrl({ cmsUrl, slug: primaryTag.slug, url: primaryTag.url })) || ''
  const primaryTagCount = primaryTag?.count?.posts

  return (
    <>
      {posts && 0 < posts.length && (
        <article className="post-list">
          <header className="post-list-header">
            <h3>{title ?? 'Articles'}</h3>
          </header>
          <div className="post-list-content">
            <ul>
              {posts?.map((post, i) => (
                <li key={i}>
                  <div className="post-list-tags">
                    {post.tags &&
                      post.tags.slice(0, 3).map((tag, idx) => {
                        return (
                          <div key={tag.id} className="post-list-tag">
                            <Link href={resolveUrl({ cmsUrl, slug: tag.slug, url: tag.url })}>
                              <a>{`${tag.name}`}&nbsp;</a>
                            </Link>
                            {`  ${post.tags && idx + 1 < post.tags?.slice(0, 3).length ? '-' : ''}`}
                          </div>
                        )
                      })}
                  </div>
                  <h4>
                    <Link href={resolveUrl({ cmsUrl, collectionPath: collections.getCollectionByNode(post), slug: post.slug, url: post.url })}>
                      <a>{post.title}</a>
                    </Link>
                  </h4>
                  <div className="post-list-meta">
                    <p>
                      <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMMM, YYYY')}</time> –{' '}
                      {readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <footer className="post-list-footer">
            <Link href={url}>
              <a>See more</a>
            </Link>
          </footer>
        </article>
      )}
    </>
  )
}
