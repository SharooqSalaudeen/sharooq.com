/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'

import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { HoverOnAvatar } from '@components/effects/HoverOnAvatar'
import { AvatarIcon } from '@icons/AvatarIcon'
import { GhostAuthor, GhostSettings } from '@lib/ghost'

interface AuthorListProps {
  settings: GhostSettings
  authors?: GhostAuthor[]
  isPost?: boolean
}

export const AuthorList = ({ settings, authors, isPost }: AuthorListProps) => {
  const text = get(getLang(settings.lang))
  const { nextImages } = settings.processEnv
  const { staticProfilePicBadge } = settings.processEnv
  const { url: cmsUrl } = settings

  return (
    <ul className="author-list">
      {authors?.map((author, i) => {
        const url = resolveUrl({ cmsUrl, slug: author.slug, url: author.url || undefined })
        const profileImg = author.profileImage
        const authorName = author.name || ''

        return (
          <HoverOnAvatar
            key={i}
            activeClass="hovered"
            render={(hover) => (
              <li key={i} ref={hover.anchorRef} className="author-list-item">
                {!isPost && <div className="author-name-tooltip">{authorName}</div>}
                {isPost && (
                  <div className={`author-card ${hover.state.currentClass}`}>
                    <div className="author-profile-image">
                      {staticProfilePicBadge ? (
                        <Image
                          className="author-profile-image"
                          src={staticProfilePicBadge}
                          alt={authorName}
                          style={{ width: '100%', height: 'auto' }}
                          quality={nextImages.quality}
                          width={200}
                          height={200}
                        />
                      ) : profileImg && nextImages.feature ? (
                        <Image
                          className="author-profile-image"
                          src={profileImg.url}
                          alt={authorName}
                          style={{ width: '100%', height: 'auto' }}
                          quality={nextImages.quality}
                          {...profileImg.dimensions}
                        />
                      ) : (
                        author.profile_image && <img src={author.profile_image} alt={authorName} />
                      )}
                    </div>
                    <div className="author-info">
                      {author.bio ? (
                        <div className="bio">
                          <h2>{authorName}</h2>
                          <p>{author.bio}</p>
                          <p>
                            <Link href={url}>
                              {text(`MORE_POSTS`)}
                            </Link>{' '}
                            {text(`BY`)} {authorName}.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h2>{authorName}</h2>
                          <p>
                            {text(`READ`)}{' '}
                            <Link href={url}>
                              {text(`MORE_POSTS_SM`)}
                            </Link>{' '}
                            {text(`BY_THIS_AUTHOR`)}.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {staticProfilePicBadge ? (
                  <Link href={url} className={`${(isPost && `author`) || `static`}-avatar`} aria-label={authorName}>
                    <Image src={staticProfilePicBadge} alt={authorName} style={{ width: '100%', height: 'auto' }} quality={nextImages.quality} width={200} height={200} />
                  </Link>
                ) : profileImg && nextImages.feature ? (
                  <Link href={url} className={`${(isPost && `author`) || `static`}-avatar`} aria-label={authorName}>
                    <Image src={profileImg.url} alt={authorName} style={{ width: '100%', height: 'auto' }} quality={nextImages.quality} {...profileImg.dimensions} />
                  </Link>
                ) : author.profile_image ? (
                  <Link href={url} className={`${(isPost && `author`) || `static`}-avatar`} aria-label={authorName}>
                    <img src={author.profile_image} alt={authorName} />
                  </Link>
                ) : (
                  <Link href={url} className={`${(isPost && `author`) || `static`}-avatar author-profile-image`} aria-label={authorName}>
                    <AvatarIcon />
                  </Link>
                )}
              </li>
            )}
          />
        );
      })}
    </ul>
  );
}
