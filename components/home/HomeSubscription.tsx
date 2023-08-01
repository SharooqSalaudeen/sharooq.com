import { GhostSettings } from '@lib/ghost'
import { SubscribeForm } from '@components/SubscribeForm'
import Image from 'next/image'

export const HomeSubscription = ({ settings }: { settings: GhostSettings }) => {
  const { nextImages, staticProfilePic } = settings.processEnv

  return (
    <div className="home-subscribe-container">
      <section className="home-subscribe-form subscribe-form">
        <p>
          My name is Sharooq Salaudeen and I'm a software engineer by profession. This is the place where I share the things I've learned and created over the years. I won't bother
          you with ads, affiliate links, and paywall on this space.
        </p>
        <p>Checkout my monthly newsletter where I share actionable productivity tips, latest advancements in engineering and other practical life advice.</p>
        <p>Sign up below to join our growing community of friendly readers.</p>
        <SubscribeForm {...{ settings }} />
      </section>
      <div className="home-author-container">
        <Image
          src={'https://res.cloudinary.com/sharooq/image/upload/v1659299906/Blog/app/blogavatar_xomoot.jpg'}
          alt="Sharooq Salaudeen"
          layout="responsive"
          objectFit="fill"
          quality={nextImages.quality}
          width="48px"
          height="48px"
          className="home-author-pic"
        />
      </div>
    </div>
  )
}
