import Image from 'next/image'
import Link from 'next/link'

import { Project } from 'appConfig'

interface ProjectCardProps {
  imageQuality: number
  project: Project
}

export const ProjectCard = ({ imageQuality, project }: ProjectCardProps) => {
  return (
    <article className="post-featured-card project-featured-card">
      <div className="post-card-image-link">
        <div className="post-card-image">
          <Image
            src={project.imageUrl}
            alt={project.label}
            sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
            fill
            style={{ objectFit: 'contain' }}
            quality={imageQuality}
          />
        </div>
      </div>
      <div className="post-card-content">
        <div>
          <div className="post-card-content-link">
            <header className="post-card-header">
              <h2 className="post-card-title">{project.title}</h2>
            </header>
            <section className="post-card-excerpt">
              <p>{project.description}</p>
            </section>
          </div>
          {(project.githubUrl || project.pageUrl) && (
            <div className="project-card-actions">
              {project.githubUrl && (
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  
                    GitHub
                  
                </Link>
              )}
              {project.pageUrl && (
                <Link href={project.pageUrl} target="_blank" rel="noopener noreferrer">
                  
                    View page
                  
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
