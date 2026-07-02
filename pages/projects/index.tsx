import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { HeaderIndex } from '@components/HeaderIndex'
import { Layout } from '@components/Layout'
import { ProjectCard } from '@components/projects/ProjectCard'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { BodyClass } from '@helpers/BodyClass'
import { getOptimizedAllSettings, GhostSettings } from '@lib/ghost'
import { processEnv } from '@lib/processEnv'
import { SEO } from '@meta/seo'
import { seoImage, ISeoImage } from '@meta/seoImage'
import { projects } from 'appConfig'

interface CmsData {
  settings: GhostSettings
  seoImage: ISeoImage
  bodyClass: string
}

interface ProjectsPageProps {
  cmsData: CmsData
}

export default function ProjectsPage({ cmsData }: ProjectsPageProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { settings, seoImage, bodyClass } = cmsData
  const { nextImages } = settings.processEnv

  return (
    <>
      <SEO
        {...{
          settings,
          seoImage,
          title: 'Projects',
          description: 'Projects Sharooq Salaudeen is building, experimenting with, and improving over time.',
        }}
      />
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <Layout
            {...{ bodyClass, sticky, settings, isHome: true }}
            header={
              <HeaderIndex
                {...{
                  settings,
                  pageTitle: 'Projects',
                  pageDescription: 'Things I am building, testing, and improving over time.',
                }}
              />
            }
          >
            <div className="inner projects-page">
              <div className="projects-featured-list">
                {projects.map((project) => (
                  <ProjectCard imageQuality={nextImages.quality} project={project} />
                ))}
              </div>
            </div>
          </Layout>
        )}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let settings

  try {
    settings = await getOptimizedAllSettings()
  } catch (error) {
    throw new Error('Projects page creation failed.')
  }

  const cmsData = {
    settings,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
    bodyClass: BodyClass({ isHome: true }),
  }

  return {
    props: {
      cmsData,
    },
    ...(processEnv.isr.enable && { revalidate: processEnv.isr.revalidate }),
  }
}
