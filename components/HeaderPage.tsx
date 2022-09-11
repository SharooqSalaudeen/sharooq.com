import { SiteNav } from '@components/SiteNav'
import { HeaderBackground } from './HeaderBackground'
import { GhostPostOrPage, GhostSettings, NextImage } from '@lib/ghost'
import Image from 'next/image'
import Link from 'next/link'

import { getLang, get } from '@utils/use-lang'

interface HeaderPageProps {
  settings: GhostSettings
  page?: GhostPostOrPage
}

export const HeaderPage = ({ settings, page }: HeaderPageProps) => {
  const text = get(getLang(settings.lang))

  const site = settings
  const siteLogo = site.logoImage
  const coverImg = site.cover_image || ''

  const title = page?.meta_title || page?.title || ''
  const description = page?.meta_description || page?.excerpt || ''

  const { processEnv } = settings
  const { siteUrl, nextImages } = processEnv
  const { feature: nextFeatureImages, quality: imageQuality } = nextImages
  const targetHeight = 55
  const calcSiteLogoWidth = (image: NextImage, targetHeight: number) => {
    const { width, height } = image.dimensions
    return (targetHeight * width) / height
  }
  return (
    <header className="site-home-header">
      <HeaderBackground srcImg={coverImg}>
        {/* <div className="outer site-nav-main">
          <div className="inner">
            <SiteNav {...{ settings }} className="site-nav" />
          </div>
        </div> */}
        <div className="inner">
          <SiteNav className="site-nav" {...{ siteUrl, settings }} />
          <div className="site-header-content">
            <h1 className="site-title">{title}</h1>
            <h2 className="site-description">{description}</h2>
          </div>
        </div>
      </HeaderBackground>
    </header>
  )
}
