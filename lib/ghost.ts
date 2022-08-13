import { parse as urlParse } from 'url'
import GhostContentAPI, { Nullable, Params, PostOrPage, SettingsResponse, Pagination, PostsOrPages, Tag, Author } from '@tryghost/content-api'
import { normalizePost } from '@lib/ghost-normalize'
import { Node } from 'unist'
import { collections as config } from '@routesConfig'
import { Collections } from '@lib/collections'

import { ghostAPIUrl, ghostAPIKey, processEnv, ProcessEnvProps } from '@lib/processEnv'
import { imageDimensions, normalizedImageUrl, Dimensions } from '@lib/images'
import { IToC } from '@lib/toc'

import { contactPage, DarkMode } from '@appConfig'

export interface NextImage {
  url: string
  dimensions: Dimensions
}

export interface NavItem {
  url: string
  label: string
}

interface BrowseResults<T> extends Array<T> {
  meta: { pagination: Pagination }
}

interface OptimizedPost {
  id: string
  authors: Author[] | undefined
  excerpt: string | undefined
  featured: boolean | undefined
  primary_tag: Nullable<Tag> | undefined
  published_at: Nullable<string> | undefined
  reading_time: number | undefined
  slug: string | undefined
  tags: Tag[] | undefined
  title: string | undefined
  url: string | undefined
  feature_image: Nullable<string> | undefined
}

interface OptimizedSettings {
  processEnv: {
    nextImages: {
      feature: boolean
      inline: boolean
      quality: number
      source: boolean
    }
    staticProfilePicBadge: string
    siteUrl: string
    memberSubscriptions: boolean
    customNavigation: NavItem[]
    darkMode: {
      defaultMode: DarkMode
      overrideOS: boolean
    }
  }
  lang: string | undefined
  url: string | undefined
  cover_image: string | undefined
  title: string | undefined
  description: string | undefined
  secondary_navigation: NavItem[] | undefined
  navigation:
    | {
        label: string
        url: string
      }[]
    | undefined
  twitter: string | undefined
  facebook: string | undefined
  meta_title: Nullable<string> | undefined
  meta_description: Nullable<string> | undefined
  logo: string | undefined
  iconImage?: NextImage | undefined
  logoImage?: NextImage | undefined
  coverImage?: NextImage | undefined
}

export interface GhostSettings extends SettingsResponse {
  processEnv: ProcessEnvProps
  secondary_navigation?: NavItem[]
  iconImage?: NextImage
  logoImage?: NextImage
  coverImage?: NextImage
}

export interface GhostTag extends Tag {
  featureImage?: NextImage
}

export interface GhostAuthor extends Author {
  profileImage?: NextImage
}

export interface GhostPostOrPage extends PostOrPage {
  featureImage?: NextImage | null
  htmlAst?: Node | null
  toc?: IToC[] | null
}

export interface GhostPostsOrPages extends BrowseResults<GhostPostOrPage> {}

export interface GhostTags extends BrowseResults<GhostTag> {}

export interface GhostAuthors extends BrowseResults<GhostAuthor> {}

export interface OptimizedPosts extends Array<OptimizedPost> {}

const api = new GhostContentAPI({
  url: ghostAPIUrl,
  key: ghostAPIKey,
  version: 'v3',
})

const postAndPageFetchOptions: Params = {
  limit: 'all',
  include: ['tags', 'authors', 'count.posts'],
  order: ['featured DESC', 'published_at DESC'],
}

const tagAndAuthorFetchOptions: Params = {
  limit: 'all',
  include: 'count.posts',
}

const postAndPageSlugOptions: Params = {
  limit: 'all',
  fields: 'slug',
}

const excludePostOrPageBySlug = (filter?: string) => {
  if (!contactPage) return `${filter ?? ''}`
  return `slug:-contact, ${filter ?? ''}`
}

// helpers
export const createNextImage = async (url?: string | null): Promise<NextImage | undefined> => {
  if (!url) return undefined
  const normalizedUrl = await normalizedImageUrl(url)
  const dimensions = await imageDimensions(normalizedUrl)
  return (dimensions && { url: normalizedUrl, dimensions }) || undefined
}

async function createNextFeatureImages(nodes: BrowseResults<Tag | PostOrPage>): Promise<GhostTags | PostsOrPages> {
  const { meta } = nodes
  const images = await Promise.all(nodes.map((node) => createNextImage(node.feature_image)))
  const results = nodes.map((node, i) => ({ ...node, ...(images[i] && { featureImage: images[i] }) }))
  return Object.assign(results, { meta })
}

async function createNextProfileImages(nodes: BrowseResults<Author>): Promise<GhostAuthors> {
  const { meta } = nodes
  const images = await Promise.all(nodes.map((node) => createNextImage(node.profile_image)))
  const results = nodes.map((node, i) => ({ ...node, ...(images[i] && { profileImage: images[i] }) }))
  return Object.assign(results, { meta })
}

export async function createNextProfileImagesFromAuthors(nodes: Author[] | undefined): Promise<Author[] | undefined> {
  if (!nodes) return undefined
  const images = await Promise.all(nodes.map((node) => createNextImage(node.profile_image)))
  return nodes.map((node, i) => ({ ...node, ...(images[i] && { profileImage: images[i] }) }))
}

async function createNextProfileImagesFromPosts(nodes: BrowseResults<PostOrPage>): Promise<PostsOrPages> {
  const { meta } = nodes
  const authors = await Promise.all(nodes.map((node) => createNextProfileImagesFromAuthors(node.authors)))
  const results = nodes.map((node, i) => ({ ...node, ...(authors[i] && { authors: authors[i] }) }))
  return Object.assign(results, { meta })
}

export async function createOptimizedPosts(nodes: GhostPostsOrPages): Promise<OptimizedPosts> {
  const result = nodes.map((node, i) => ({
    id: node.id,
    authors: node.authors,
    excerpt: node.excerpt,
    featured: node.featured,
    primary_tag: node.primary_tag,
    published_at: node.published_at,
    reading_time: node.reading_time,
    slug: node.slug,
    tags: node.tags,
    title: node.title,
    url: node.url,
    feature_image: node.feature_image,
  }))
  return result
}

export async function getAllSettings(): Promise<GhostSettings> {
  //const cached = getCache<SettingsResponse>('settings')
  //if (cached) return cached
  const settings = await api.settings.browse()
  settings.url = settings?.url?.replace(/\/$/, ``)

  const iconImage = await createNextImage(settings.icon)
  const logoImage = await createNextImage(settings.logo)
  const coverImage = await createNextImage(settings.cover_image)

  const result = {
    processEnv,
    ...settings,
    ...(iconImage && { iconImage }),
    ...(logoImage && { logoImage }),
    ...(coverImage && { coverImage }),
  }
  //setCache('settings', result)
  return result
}

export async function createoptimizedAllSettings(settings: GhostSettings): Promise<OptimizedSettings> {
  const iconImage = settings.iconImage || null
  const logoImage = settings.logoImage || null
  const coverImage = settings.coverImage || null

  return {
    processEnv: {
      nextImages: {
        feature: settings.processEnv.nextImages.feature,
        inline: settings.processEnv.nextImages.inline,
        quality: settings.processEnv.nextImages.quality,
        source: settings.processEnv.nextImages.source,
      },
      staticProfilePicBadge: settings.processEnv.staticProfilePicBadge,
      siteUrl: settings.processEnv.siteUrl,
      memberSubscriptions: settings.processEnv.memberSubscriptions,
      customNavigation: settings.processEnv.customNavigation,
      darkMode: settings.processEnv.darkMode,
    },
    lang: settings.lang,
    url: settings.url,
    cover_image: settings.cover_image,
    title: settings.title,
    description: settings.description,
    secondary_navigation: settings.secondary_navigation,
    navigation: settings.navigation,
    twitter: settings.twitter,
    facebook: settings.facebook,
    meta_title: settings.meta_title,
    meta_description: settings.meta_description,
    logo: settings.logo,
    ...(iconImage && { iconImage }),
    ...(logoImage && { logoImage }),
    ...(coverImage && { coverImage }),
  }
}

export async function getOptimizedAllSettings(): Promise<OptimizedSettings> {
  const allSettings = await getAllSettings()
  return await createoptimizedAllSettings(allSettings)
}

export async function getAllTags(): Promise<GhostTags> {
  const tags = await api.tags.browse(tagAndAuthorFetchOptions)
  return await createNextFeatureImages(tags)
}

export async function getAllAuthors() {
  const authors = await api.authors.browse(tagAndAuthorFetchOptions)
  return await createNextProfileImages(authors)
}

export async function getAllPosts(props?: { limit: number }): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: excludePostOrPageBySlug(),
    ...(props && { ...props }),
  })
  const results = await createNextProfileImagesFromPosts(posts)
  return await createNextFeatureImages(results)
}

export async function getOptimizedAllPosts(props?: { limit: number }): Promise<OptimizedPosts> {
  const allPosts = await getAllPosts(props && { ...props })
  return await createOptimizedPosts(allPosts)
}

export async function getAllDeveloperPosts(props?: { limit: number }): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: excludePostOrPageBySlug('tag:-book-summary'),
    ...(props && { ...props }),
  })
  const results = await createNextProfileImagesFromPosts(posts)
  return await createNextFeatureImages(results)
}

export async function getOptimizedAllDeveloperPosts(props?: { limit: number }): Promise<OptimizedPosts> {
  const allPosts = await getAllDeveloperPosts(props && { ...props })
  return await createOptimizedPosts(allPosts)
}

export async function getAllBookSummaries(props?: { limit: number }): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: excludePostOrPageBySlug('tag:book-summary'),
    ...(props && { ...props }),
  })
  const results = await createNextProfileImagesFromPosts(posts)
  return await createNextFeatureImages(results)
}

export async function getOptimizedAllBookSummaries(props?: { limit: number }): Promise<OptimizedPosts> {
  const bookSummaries = await getAllBookSummaries(props && { ...props })
  return await createOptimizedPosts(bookSummaries)
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await api.posts.browse(postAndPageSlugOptions)
  return posts.map((p) => p.slug)
}

export async function getAllPages(props?: { limit: number }): Promise<GhostPostsOrPages> {
  const pages = await api.pages.browse({
    ...postAndPageFetchOptions,
    filter: excludePostOrPageBySlug(),
    ...(props && { ...props }),
  })
  return await createNextFeatureImages(pages)
}

// specific data by slug
export async function getTagBySlug(slug: string): Promise<Tag> {
  return await api.tags.read({
    ...tagAndAuthorFetchOptions,
    slug,
  })
}
export async function getAuthorBySlug(slug: string): Promise<GhostAuthor> {
  const author = await api.authors.read({
    ...tagAndAuthorFetchOptions,
    slug,
  })
  const profileImage = await createNextImage(author.profile_image)
  const result = {
    ...author,
    ...(profileImage && { profileImage }),
  }
  return result
}

export async function getPostBySlug(slug: string): Promise<GhostPostOrPage | null> {
  let result: GhostPostOrPage
  try {
    const post = await api.posts.read({
      ...postAndPageFetchOptions,
      slug,
    })
    // older Ghost versions do not throw error on 404
    if (!post) return null

    const { url } = await getAllSettings()
    result = await normalizePost(post, (url && urlParse(url)) || undefined)
  } catch (e) {
    const error = e as { response?: { status: number } }
    if (error.response?.status === 404) return null
    throw e
  }
  return result
}

export async function getPageBySlug(slug: string): Promise<GhostPostOrPage | null> {
  let result: GhostPostOrPage
  try {
    const page = await api.pages.read({
      ...postAndPageFetchOptions,
      slug,
    })

    // older Ghost versions do not throw error on 404
    if (!page) return null

    const { url } = await getAllSettings()
    result = await normalizePost(page, (url && urlParse(url)) || undefined)
  } catch (e) {
    const error = e as { response?: { status: number } }
    if (error.response?.status === 404) return null
    throw e
  }
  return result
}

// specific data by author/tag slug
export async function getPostsByAuthor(slug: string): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: `authors.slug:${slug}`,
  })
  return await createNextFeatureImages(posts)
}

export async function getPostsByTag(slug: string, limit?: number, excludeId?: string): Promise<GhostPostsOrPages> {
  const exclude = (excludeId && `+id:-${excludeId}`) || ``
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    ...(limit && { limit: `${limit}` }),
    filter: `tags.slug:${slug}${exclude}`,
  })
  return await createNextFeatureImages(posts)
}

// Collections
export const collections = new Collections<PostOrPage>(config)
