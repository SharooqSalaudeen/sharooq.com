import { GhostPostsOrPages } from '@lib/ghost'
import React, { Dispatch, useState, useEffect } from 'react'

interface TagFilterProps {
  setFilteredPosts: Dispatch<any>
  posts: GhostPostsOrPages
}

export function TagFilter(props: TagFilterProps) {
  const [filter, setFilter] = useState<string | null>(null)
  const { posts, setFilteredPosts } = props
  console.log('posts', posts)

  const handleChange = (value: string) => {
    if (filter === value) {
      setFilter(null)
    } else {
      setFilter(value)
    }
  }

  const filterPostsByTag = () => {
    const _posts = posts.filter((post) => {
      const flag = post?.tags?.some((tag) => tag.name === filter)
      return flag
    })
    return _posts
  }

  useEffect(() => {
    if (filter) {
      setFilteredPosts(filterPostsByTag)
    } else {
      setFilteredPosts(posts)
    }
  }, [filter])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <button onClick={() => handleChange('Machine Learning')}>Machine Learning</button>
      <button onClick={() => handleChange('JavaScript')}>JavaScript</button>
      <button onClick={() => handleChange('TypeScript')}>TypeScript</button>
      <button onClick={() => handleChange('ReactJS')}>ReactJS</button>
      <button onClick={() => handleChange('1 minute reads')}>1 Minute Reads</button>
    </div>
  )
}
