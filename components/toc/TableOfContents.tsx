import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useActiveHash } from '@components/effects/UseActiveHash'
import { IToC } from '@lib/toc'
import { getLang, get } from '@utils/use-lang'

const getHeadingIds = (toc: IToC[], traverseFullDepth = true, maxDepth: number, recursionDepth = 1): string[] => {
  const idList = []

  if (toc) {
    for (const item of toc) {
      item.id && idList.push(item.id)

      if (item.items && traverseFullDepth && recursionDepth < (maxDepth || 6)) {
        idList.push(...getHeadingIds(item.items, true, maxDepth, recursionDepth + 1))
      }
    }
  }
  return idList
}

const isUnderDepthLimit = (depth: number, maxDepth: number) => (maxDepth === null ? true : depth < maxDepth)

const createItems = (toc: IToC[], url: string, depth: number, maxDepth: number, activeHash: string, isDesktop: boolean) =>
  toc.map((head, index) => {
    const isActive = isDesktop && head.id === `${activeHash}`
    return (
      <li key={`${url}#${head.id}-${depth}-${index}`}>
        {head.id && (
          <Link href={`${url}#${head.id}`}>
            <a className={isActive ? 'link active' : 'link'}>{head.heading}</a>
          </Link>
        )}
        {head.items && isUnderDepthLimit(depth, maxDepth) && <ul className="sub">{createItems(head.items, url, depth + 1, maxDepth, activeHash, isDesktop)}</ul>}
      </li>
    )
  })

interface TableOfContentsProps {
  toc: IToC[]
  url: string
  maxDepth?: number
  lang?: string
}

export const TableOfContents = ({ toc, url, maxDepth = 2, lang }: TableOfContentsProps) => {
  const text = get(getLang(lang))

  const [isDesktop, setIsDesktop] = useState(false)
  const activeHash = useActiveHash(getHeadingIds(toc, true, maxDepth))
  const tocRef = useRef<HTMLElement>(null)
  const isUserScrolling = useRef(false)
  const userScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const isDesktopQuery = window.matchMedia(`(min-width: 1170px)`)
    setIsDesktop(isDesktopQuery.matches)

    const updateIsDesktop = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    isDesktopQuery.addListener(updateIsDesktop)
    return () => isDesktopQuery.removeListener(updateIsDesktop)
  }, [])

  // Detect when the user manually scrolls the TOC so we can pause auto-scroll
  useEffect(() => {
    const container = tocRef.current
    if (!container) return

    const handleUserScroll = () => {
      isUserScrolling.current = true
      if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current)
      userScrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false
      }, 1200)
    }

    container.addEventListener('wheel', handleUserScroll, { passive: true })
    container.addEventListener('touchmove', handleUserScroll, { passive: true })
    return () => {
      container.removeEventListener('wheel', handleUserScroll)
      container.removeEventListener('touchmove', handleUserScroll)
      if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current)
    }
  }, [])

  useEffect(() => {
    if (!isDesktop || !activeHash || !tocRef.current || isUserScrolling.current) return
    const container = tocRef.current
    const activeLink = container.querySelector<HTMLElement>('a.active')
    if (activeLink) {
      const containerRect = container.getBoundingClientRect()
      const linkRect = activeLink.getBoundingClientRect()
      const isAbove = linkRect.top < containerRect.top
      const isBelow = linkRect.bottom > containerRect.bottom
      if (isAbove || isBelow) {
        const offset = linkRect.top - containerRect.top - containerRect.height / 2 + linkRect.height / 2
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' })
      }
    }
  }, [activeHash, isDesktop])

  return (
    <>
      {toc.length > 0 ? (
        <aside className="toc" ref={tocRef}>
          <nav>
            <h2>{text(`TABLE_OF_CONTENTS`)}</h2>
            <ul className="list">{createItems(toc, url, 1, maxDepth, activeHash, isDesktop)}</ul>
          </nav>
        </aside>
      ) : null}
    </>
  )
}
