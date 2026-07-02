/**
 * Some of the defaults defined here can be overwritten by environment variables
 * Check lib/environments.ts
 */

// Cache control
export const fileCache: boolean = true

// Google analytics tracking ID (now called measurement ID in version 4)
export const googleAnalytics: boolean = true
export const gaMeasurementId: string = 'G-C64LCMV4CL'

// Dark mode
export type DarkMode = 'dark' | 'light' | null
export const defaultMode: DarkMode = 'light'
export const overrideOS: boolean = true

// Images
export const nextFeatureImages: boolean = true
export const nextInlineImages: boolean = true
export const imageQuality: number = 80
export const sourceImages: boolean = false

// RSS
export const rssFeed: boolean = true
export const feedlyRss: boolean = false

// Ghost Member Subscriptions
export const memberSubscriptions: boolean = true

// Commenting system
export type CommentingSystem = 'commento' | 'disqus' | null
export const commenting: CommentingSystem = null

export const commentoUrl: string = 'https://cdn.commento.io' // 'https://commento.your-blog.com'
export const disqusShortname: string = 'short-name-oes-here'

// PrismJS
export const prism: boolean = true
export const prismIgnoreMissing: boolean = true

// Contact Page
export const contactPage: boolean = false
export const customPage = {}

// Table of Contents
export const toc: boolean = true
export const maxDepth: number = 2

// Custom site navigation (default: [], label is case sensitive)
// Override: [{ label: 'Home', url: '/' }]
// Add new: [{ label: 'Contact', url: '/contact' }]
import { NavItem } from '@lib/ghost'
export const customNavigation: NavItem[] = [
  // { label: 'Contact', url: '/contact' }
]

// Incremental Static Regenerations (ISR)
// Disable ISR when using `next export`, otherwise enable it
export const isr: boolean = false
export const revalidate: number = 10
export const maxNumberOfPosts: number = 20
export const maxNumberOfPages: number = 20

// Author Profile Picture
export const staticProfilePic: string = ''
export const staticProfilePicBadge: string = ''

// Site-meta picture
export const staticSiteMetaImage: string = 'https://res.cloudinary.com/sharooq/image/upload/v1649626966/Blog/app/site-meta_vin5iz.png'

// Article Tags
export const filters: string[] = ['AWS', 'Docker', 'TypeScript', 'Python', 'Leetcode', 'Machine Learning', 'JavaScript', 'ReactJS']

// Projects
export interface Project {
  title: string
  description: string
  imageUrl: string
  url: string
  githubUrl?: string
  pageUrl?: string
  label: string
}

export const projects: Project[] = [
  {
    title: 'ReadInsight - A fully A.I powered news website',
    description:
      'An A.I.-powered news website using fine-tuned LLM models, Docker, Node.js, and PostgreSQL to automate real-time news aggregation, article generation, and publication on a streamlined frontend.',
    imageUrl: 'https://res.cloudinary.com/sharooq/image/upload/v1707776687/Blog/home/featured_projects/uvorg7oaqucloehcusyy.jpg',
    url: 'https://github.com/SharooqSalaudeen/readinsight-backend-nodejs',
    githubUrl: 'https://github.com/SharooqSalaudeen/readinsight-backend-nodejs',
    label: 'Read Insight',
  },
  {
    title: 'Sharooq Salaudeen - Portfolio Website',
    description:
      'Explore my portfolio website to discover a showcase of my past projects! From web development to graphic design, each creation reflects my passion and expertise.',
    imageUrl: 'https://res.cloudinary.com/sharooq/image/upload/v1707781880/Blog/home/featured_projects/ishw83iftrfnperhniz3.jpg',
    url: 'https://sharooqsalaudeen.github.io',
    pageUrl: 'https://sharooqsalaudeen.github.io',
    label: 'Portfolio Website',
  },
]

// Features Posts images
export const featuredBooks: { slug: string; imageUrl: string }[] = [
  {
    slug: 'atomic-habits-james-clear-summary-notes-quotes-highlights',
    imageUrl: 'https://res.cloudinary.com/sharooq/image/upload/v1661407560/Blog/home/featured_books/thumbnail-atomic-habits_m7lrpt.jpg',
  },
  {
    slug: 'the-monk-who-sold-his-ferrari-robin-sharma-summary-notes-quotes-highlights',
    imageUrl: 'https://res.cloudinary.com/sharooq/image/upload/v1661407564/Blog/home/featured_books/thumbnail-the-monk-who-sold-his-ferrari_eavd4a.jpg',
  },
]
