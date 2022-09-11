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

interface HomeTopicCardsProps {
  settings: GhostSettings
  post?: GhostPostOrPage
  num?: number
  isHome?: boolean
}
export const HomeTopicCards = ({ settings, post, num, isHome }: HomeTopicCardsProps) => {
  const { nextImages } = settings.processEnv

  // const text = get(getLang(settings.lang))
  const cmsUrl = settings.url
  // const collectionPath = collections.getCollectionByNode(post)
  // const url = resolveUrl({ cmsUrl, collectionPath, slug: post.slug, url: post.url })
  // const featImg = post.featureImage
  // const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))

  const cards = [
    {
      slug: '/articles',
      icon: '/articles.png',
      name: 'Articles',
      desc: 'I write about a broad spectrum of programming paradigms, bug fixes and solutions ',
    },
    {
      slug: 'book-summaries',
      icon: '/books.png',
      name: 'Book Summaries',
      desc: 'My summary of books that truly inspired and changed the way I view about my life',
    },
    {
      slug: 'about',
      icon: '/writer.png',
      name: 'About Me',
      desc: 'Who I am? what I am working on right now? and Where to contact me?',
    },
  ]

  return (
    <>
      <div className="home-topic-cards">
        {cards.map((topic, idx) => (
          <Link key={idx} href={topic.slug}>
            <div className="home-topic-card">
              <div className="icon" style={{}}>
                <Image src={topic.icon} alt={topic.name} layout="fixed" objectFit="fill" quality={nextImages.quality} width="48px" height="48px" />
              </div>
              <h2>{topic.name}</h2>
              <p>{topic.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
