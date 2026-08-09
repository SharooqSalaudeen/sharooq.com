import { GhostPostsOrPages } from '@lib/ghost'
import React, { Dispatch, useState, useEffect } from 'react'
import { filters } from '@appConfig'

interface TagFilterProps {
  setFilteredPosts: Dispatch<any>
  posts: GhostPostsOrPages
}

export function TagFilter(props: TagFilterProps) {
  const [filter, setFilter] = useState<string | null>(null)
  const { posts, setFilteredPosts } = props

  const handleChange = (value: string) => {
    if (filter === value) {
      setFilter(null)
    } else {
      setFilter(value)
    }
  }

  useEffect(() => {
    if (filter) {
      setFilteredPosts(posts.filter((post) => post?.tags?.some((tag) => tag.name === filter)))
    } else {
      setFilteredPosts(posts)
    }
  }, [filter, posts, setFilteredPosts])

  return (
    <div className="tag-filter-container">
      {filters.map((item, idx) => (
        <button key={idx} className={`tag-filter ${filter === item ? 'tag-filter-active' : ''}`} onClick={() => handleChange(item)}>
          {item}
        </button>
      ))}
    </div>
  )
}
