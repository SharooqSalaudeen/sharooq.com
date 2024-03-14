import { GhostSettings } from '@lib/ghost'
import { SubscribeForm } from '@components/SubscribeForm'
import Image from 'next/image'

export const HomeSubscription = ({ settings }: { settings: GhostSettings }) => {
  const { nextImages, staticProfilePic } = settings.processEnv

  return (
    <div className="home-subscribe-container">
      <section className="home-subscribe-form subscribe-form">
        <p>
          Hello, I'm Sharooq Salaudeen, a dedicated software engineer and data scientist. This blog is my canvas where I paint with my learnings and creations, accumulated over my
          professional journey as a resource for the community, a spark for inspiration, and a repository for future reference.
        </p>
        <p>
          I invite you to subscribe to my monthly newsletter. It's a concentrated dose of productivity hacks, updates on the latest technological advancements, and practical advice
          to navigate life's complexities.
        </p>
        <p>Sign up below to join my growing community of friendly readers.</p>
        <SubscribeForm {...{ settings }} />
      </section>
      {/* <div className="home-author-container">
        <Image
          src={'https://res.cloudinary.com/sharooq/image/upload/v1706975508/Blog/app/fitwo0fnk6njprddprgv.jpg'}
          alt="Sharooq Salaudeen"
          layout="responsive"
          objectFit="fill"
          quality={nextImages.quality}
          width="48px"
          height="48px"
          className="home-author-pic"
        />
      </div> */}
    </div>
  )
}
