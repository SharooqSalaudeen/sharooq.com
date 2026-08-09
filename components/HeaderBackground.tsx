import { ReactNode } from 'react'
import { siteCover } from '@meta/siteDefaults'
import Image from 'next/image'
import { imageDimensions } from '@lib/images'
interface HeaderBackgroundProps {
  srcImg: string
  children: ReactNode
}

export const HeaderBackground = ({ srcImg, children }: HeaderBackgroundProps) => {
  return (
    <>
      {srcImg ? (
        <div className="outer site-header-background responsive-header-img" style={{ backgroundImage: `url(${srcImg})` }}>
          {children}
        </div>
      ) : siteCover ? (
        <div className="site-cover-contianer">
          <Image src={siteCover} alt="" fill style={{ objectFit: 'cover' }} quality={100} className="site-cover" priority />
          {children}
        </div>
      ) : (
        <div className="outer site-header-background no-image">{children}</div>
      )}
    </>
  )
}
