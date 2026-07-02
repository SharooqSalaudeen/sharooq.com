import { projects } from 'appConfig'
import { ProjectCard } from '@components/projects/ProjectCard'

function ProjectFeatured(nextImages: { feature: boolean; inline: boolean; quality: number; source: boolean }) {
  return (
    <>
      {projects.slice(0, 2).map((project) => (
        <ProjectCard imageQuality={nextImages.quality} key={project.url} project={project} />
      ))}
    </>
  )
}

export default ProjectFeatured
