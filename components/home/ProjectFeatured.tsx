import { projects } from 'appConfig'
import { ProjectCard } from '@components/projects/ProjectCard'

function ProjectFeatured(nextImages: { feature: boolean; inline: boolean; quality: number; source: boolean }) {
  return (
    <>
      {projects.slice(0, 2).map((project) => (
        <ProjectCard
          key={project.githubUrl || project.pageUrl || project.title}
          imageQuality={nextImages.quality}
          project={project}
        />
      ))}
    </>
  )
}

export default ProjectFeatured
