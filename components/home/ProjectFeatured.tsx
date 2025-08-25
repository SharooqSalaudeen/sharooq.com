import Image from 'next/image'
import Link from 'next/link'

function ProjectFeatured(nextImages: { feature: boolean; inline: boolean; quality: number; source: boolean }) {
  return (
    <>
      <article className={`post-featured-card `}>
        {/* {featImg && ( */}
        <Link href="https://github.com/SharooqSalaudeen/readinsight-backend-nodejs" passHref>
          <a className="post-card-image-link" aria-label="Read Insight" target="_blank" rel="noopener noreferrer">
            {/* {nextImages.feature ? ( */}
            <div className="post-card-image">
              <Image
                src="https://res.cloudinary.com/sharooq/image/upload/v1707776687/Blog/home/featured_projects/uvorg7oaqucloehcusyy.jpg"
                alt="Read Insight"
                sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
                layout="fill"
                objectFit="contain"
                quality={nextImages.quality}
              />
            </div>
            {/* ) : ( */}
            {/* post.feature_image &&  */}
            {/* <img className="post-card-image" src={imageUrl} alt={post.title} /> */}
            {/* )} */}
          </a>
        </Link>
        {/* )} */}
        <div className="post-card-content">
          <div>
            <Link href="https://github.com/SharooqSalaudeen/readinsight-backend-nodejs" passHref>
              <a className="post-card-content-link" target="_blank" rel="noopener noreferrer">
                <header className="post-card-header">
                  {/* {post.primary_tag && <div className="post-card-primary-tag">{post.primary_tag.name}</div>} */}

                  <h2 className="post-card-title">ReadInsight - A fully A.I powered news website</h2>
                </header>
                <section className="post-card-excerpt">
                  {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
                  <p>
                    An A.I.-powered news website using fine-tuned LLM models, Docker, Node.js, and PostgreSQL to automate real-time news aggregation, article generation, and
                    publication on a streamlined frontend.
                  </p>
                </section>
              </a>
            </Link>
          </div>
        </div>
        v
      </article>
      <article className={`post-featured-card `}>
        {/* {featImg && ( */}
        <Link href="https://sharooqsalaudeen.github.io" passHref>
          <a className="post-card-image-link" aria-label="Portfolio Website" target="_blank" rel="noopener noreferrer">
            {/* {nextImages.feature ? ( */}
            <div className="post-card-image">
              <Image
                src="https://res.cloudinary.com/sharooq/image/upload/v1707781880/Blog/home/featured_projects/ishw83iftrfnperhniz3.jpg"
                alt="Portfolio Website"
                sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
                layout="fill"
                objectFit="contain"
                quality={nextImages.quality}
              />
            </div>
            {/* ) : ( */}
            {/* post.feature_image &&  */}
            {/* <img className="post-card-image" src={imageUrl} alt={post.title} /> */}
            {/* )} */}
          </a>
        </Link>
        {/* )} */}
        <div className="post-card-content">
          <div>
            <Link href="https://sharooqsalaudeen.github.io" passHref>
              <a className="post-card-content-link" target="_blank" rel="noopener noreferrer">
                <header className="post-card-header">
                  {/* {post.primary_tag && <div className="post-card-primary-tag">{post.primary_tag.name}</div>} */}

                  <h2 className="post-card-title">Sharooq Salaudeen - Portfolio Website</h2>
                </header>
                <section className="post-card-excerpt">
                  {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
                  <p>
                    Explore my portfolio website to discover a showcase of my past projects! From web development to graphic design, each creation reflects my passion and
                    expertise.
                  </p>
                </section>
              </a>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

export default ProjectFeatured
