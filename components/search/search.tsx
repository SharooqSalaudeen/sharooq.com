import { useRef, useState, useEffect, Dispatch } from 'react'
import { GhostPostsOrPages } from '@lib/ghost'
import { Index } from 'flexsearch'

interface SearchProps {
  setFilteredPosts: Dispatch<any>
  posts: GhostPostsOrPages
}

export function Search(props: SearchProps) {
  const { setFilteredPosts, posts } = props
  const [index, setIndex] = useState(new Index({ tokenize: 'forward' }))
  const searchRef = useRef<any>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>([])

  useEffect(() => {
    Object.values(posts).forEach((post) => {
      setIndex(index.add(post.id, post.title!))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setResults(
      index.search(query, {
        suggest: true,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (query) {
      let filteredPosts = posts.filter((post) => results.includes(post.id))
      setFilteredPosts(filteredPosts)
    } else {
      setFilteredPosts(posts)
    }
  }, [results])

  return (
    <div className="search-container" ref={searchRef}>
      <input className="searchbar" onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." type="text" value={query} />
    </div>
  )
}
