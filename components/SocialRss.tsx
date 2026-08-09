import { RssIcon } from '@icons/RssIcon'
import { resolveUrlPath } from '@utils/url'

interface SocialRssProps {
  siteUrl: string
}

export const SocialRss = ({ siteUrl }: SocialRssProps) => (
  <a className="rss-button" href={`https://feedly.com/i/subscription/feed/${resolveUrlPath(siteUrl, 'rss.xml')}`} target="_blank" rel="noopener noreferrer" title="Rss">
    <RssIcon />
  </a>
)
