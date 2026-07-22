import { TwitterIcon } from '@icons/TwitterIcon'
import { FacebookIcon } from '@icons/FacebookIcon'
import { LinkedInIcon } from '@icons/LinkedInIcon'
import { InstagramIcon } from '@icons/InstagramIcon'
import { GitHubIcon } from '@icons/GitHubIcon'

// import { SocialRss } from '@components/SocialRss'
import { GhostSettings } from '@lib/ghost'

interface SocialLinkProps {
  siteUrl: string
  site: GhostSettings
}

export const SocialLinks = ({ siteUrl, site }: SocialLinkProps) => {
  const githubUrl = 'https://github.com/SharooqSalaudeen'
  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`
  const linkedinUrl =
    site.linkedin && `${site.linkedin.startsWith('http://') || site.linkedin.startsWith('https://') ? site.linkedin : `https://${site.linkedin.replace(/^\/+/, ``)}`}`
  const instagramUrl =
    site.instagram &&
    `${
      site.instagram.startsWith('http://') || site.instagram.startsWith('https://') ? site.instagram : `https://www.instagram.com/${site.instagram.replace(/^@|^\/+|\/+$/g, ``)}/`
    }`

  const { processEnv } = site
  const { memberSubscriptions, feedlyRss } = processEnv

  return (
    <>
      {site.facebook && (
        <a href={facebookUrl} className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook">
          <FacebookIcon />
        </a>
      )}
      {site.twitter && (
        <a href={twitterUrl} className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter">
          <TwitterIcon />
        </a>
      )}
      {site.linkedin && linkedinUrl && (
        <a href={linkedinUrl} className="social-link social-link-ln" target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <LinkedInIcon />
        </a>
      )}
      {site.instagram && instagramUrl && (
        <a href={instagramUrl} className="social-link social-link-ig" target="_blank" rel="noopener noreferrer" title="Instagram">
          <InstagramIcon />
        </a>
      )}
      <a href={githubUrl} className="social-link social-link-gh" target="_blank" rel="noopener noreferrer" title="GitHub">
        <GitHubIcon />
      </a>
      {/* {!memberSubscriptions && feedlyRss && <SocialRss {...{ siteUrl }} />} */}
    </>
  )
}
