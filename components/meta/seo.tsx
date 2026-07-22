import { useRouter } from 'next/router'
import Head from 'next/head'
import url from 'url'

import { GhostSettings } from '@lib/ghost'
import { Author, PostOrPage, Tag } from '@tryghost/content-api'
import { ISeoImage } from '@meta/seoImage'
import { siteTitleMeta, siteDescriptionMeta, siteIcon } from '@meta/siteDefaults'

interface SEOProps {
  title?: string
  description?: string
  sameAs?: string[]
  settings: GhostSettings
  canonical?: string
  seoImage?: ISeoImage
  article?: PostOrPage
}

const getPublicTags = (tags: Tag[] | undefined) => (tags ? tags.filter((tag) => tag.name?.substr(0, 5) !== 'hash-') : [])

const getPersonId = (siteUrl: string) => `${siteUrl.replace(/\/$/, ``)}/#person`

const getWebsiteId = (siteUrl: string) => `${siteUrl.replace(/\/$/, ``)}/#website`

export const SEO = (props: SEOProps) => {
  const { title: t, description: d, seoImage, settings, article } = props

  const { og_title, og_description, published_at, updated_at, primary_author, primary_tag, twitter_title, twitter_description } = article || {}
  const type = article ? 'article' : 'website'
  const facebook = primary_author?.facebook

  const router = useRouter()
  const siteUrl = settings.processEnv.siteUrl
  const canonical = url.resolve(siteUrl, `${router.basePath}${router.asPath}`)
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`
  const normalizedCanonical = canonical.endsWith('/') ? canonical : `${canonical}/`
  const isHomePage = !article && normalizedCanonical === normalizedSiteUrl

  const { twitter, title: settingsTitle, description: settingsDescription, meta_title, meta_description } = settings
  const title = t || meta_title || settingsTitle || siteTitleMeta
  const description = d || meta_description || settingsDescription || siteDescriptionMeta

  const jsonLd = getJsonLd({ ...props, title, description, seoImage, canonical }, isHomePage)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={og_title || title} />
      <meta property="og:description" content={og_description || description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content={canonical} />
      {published_at && <meta property="article:published_time" content={published_at} />}
      {updated_at && <meta property="article:modified_time" content={updated_at} />}
      {getPublicTags(article?.tags).map(({ name: keyword }, i) => (
        <meta property="article:tag" content={keyword} key={i} />
      ))}
      {facebook && <meta property="article:author" content={`https://www.facebook.com/${facebook.replace(/^\//, ``)}/`} />}
      <meta property="twitter:title" content={twitter_title || title} />
      <meta property="twitter:description" content={twitter_description || description} />
      <meta property="twitter:url" content={canonical} />
      {primary_author && <meta property="twitter:label1" content="Written by" />}
      {primary_author && <meta property="twitter:data1" content={primary_author?.name} />}
      {primary_tag && <meta property="twitter:label2" content="Filed under" />}
      {primary_tag && <meta property="twitter:data2" content={primary_tag?.name} />}
      <meta property="twitter:card" content="summary_large_image" />
      {twitter && <meta property="twitter:creator" content={twitter} />}
      {twitter && <meta property="twitter:site" content={`https://twitter.com/${twitter.replace(/^@/, ``)}/`} />}
      {seoImage && <meta name="twitter:image" content={seoImage.url} />}
      {seoImage && <meta property="og:image" content={seoImage.url} />}
      {seoImage && <meta property="og:image:width" content={`${seoImage.dimensions.width}`} />}
      {seoImage && <meta property="og:image:height" content={`${seoImage.dimensions.height}`} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}></script>
    </Head>
  )
}

export const authorSameAs = (author: Author) => {
  const { website, twitter, facebook } = author

  const authorProfiles = [website, twitter && `https://twitter.com/${twitter.replace(/^@/, ``)}/`, facebook && `https://www.facebook.com/${facebook.replace(/^\//, ``)}/`].filter(
    (element): element is string => !!element
  )

  return authorProfiles.length > 0 ? authorProfiles : undefined
}

const getJsonLd = ({ title, description, canonical, seoImage, settings, sameAs, article }: SEOProps, isHomePage: boolean) => {
  const siteUrl = settings.processEnv.siteUrl
  const personId = getPersonId(siteUrl)
  const websiteId = getWebsiteId(siteUrl)
  const pubLogoUrl = settings.logo || url.resolve(siteUrl, siteIcon)
  const type = article ? 'BlogPosting' : 'WebSite'

  const jsonLd = {
    '@context': `https://schema.org/`,
    '@type': type,
    ...(type === 'WebSite' && { '@id': websiteId }),
    sameAs,
    url: canonical,
    ...(article && { ...getArticleJsonLd(article, personId) }),
    image: {
      ...(seoImage && {
        '@type': `ImageObject`,
        url: seoImage.url,
        ...seoImage.dimensions,
      }),
    },
    publisher: {
      '@id': personId,
    },
    mainEntityOfPage: {
      '@type': `WebPage`,
      '@id': isHomePage ? websiteId : siteUrl,
    },
    description,
  }

  if (!isHomePage) {
    return jsonLd
  }

  const personSameAs = [
    'https://github.com/SharooqSalaudeen',
    ...(settings.linkedin ? [`https://www.linkedin.com/in/${settings.linkedin.replace(/^\/+|\/+$/g, ``)}/`] : []),
    ...(settings.instagram ? [`https://www.instagram.com/${settings.instagram.replace(/^@|^\/+|\/+$/g, ``)}/`] : []),
    ...(settings.twitter ? [`https://twitter.com/${settings.twitter.replace(/^@/, ``)}/`] : []),
    ...(settings.facebook ? [`https://www.facebook.com/${settings.facebook.replace(/^\//, ``)}/`] : []),
  ]

  return {
    '@context': `https://schema.org/`,
    '@graph': [
      {
        '@id': personId,
        '@type': 'Person',
        name: 'Sharooq Salaudeen',
        givenName: 'Sharooq',
        url: siteUrl,
        image: pubLogoUrl,
        jobTitle: 'Software Engineer',
        sameAs: personSameAs,
      },
      { ...jsonLd },
    ],
  }
}

const getArticleJsonLd = (article: PostOrPage, personId: string) => {
  const { published_at, updated_at, primary_author, tags, meta_title, title } = article
  const publicTags = getPublicTags(tags)
  const keywords = publicTags?.length ? publicTags.join(`, `) : undefined
  const headline = meta_title || title

  return {
    datePublished: published_at,
    dateModified: updated_at,
    author: {
      '@id': personId,
    },
    keywords,
    headline,
  }
}
