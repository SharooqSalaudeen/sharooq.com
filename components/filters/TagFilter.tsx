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
    <div className="tag-filter-container">
      {filters.map((item, idx) => (
        <button key={idx} className={`tag-filter ${filter === item ? 'tag-filter-active' : ''}`} onClick={() => handleChange(item)}>
          {item}
        </button>
      ))}
    </div>
  )
}
