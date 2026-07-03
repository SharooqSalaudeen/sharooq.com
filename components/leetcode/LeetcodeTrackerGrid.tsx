import { useRef, useEffect } from 'react'
import type { CSSProperties } from 'react'

import { PracticeTracker, getMonthLabels } from './leetcodeUtils'

interface LeetcodeTrackerGridProps {
  tracker: PracticeTracker
  ariaLabel?: string
}

export const LeetcodeTrackerGrid = ({ tracker, ariaLabel = 'LeetCode articles over the last year' }: LeetcodeTrackerGridProps) => {
  const desktopScrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const monthLabels = getMonthLabels(tracker.weeks)
  const recentWeeks = tracker.weeks.slice(tracker.weeks.length - 26)
  const recentMonthLabels = getMonthLabels(recentWeeks)

  useEffect(() => {
    desktopScrollRef.current && (desktopScrollRef.current.scrollLeft = desktopScrollRef.current.scrollWidth)
    mobileScrollRef.current && (mobileScrollRef.current.scrollLeft = mobileScrollRef.current.scrollWidth)
  }, [])

  return (
    <div className="leetcode-practice-tracker" aria-label={ariaLabel}>
      {/* Desktop: full year */}
      <div className="leetcode-practice-scroll tracker-desktop" ref={desktopScrollRef}>
        <div className="leetcode-practice-grid" aria-hidden="true" style={{ '--week-count': tracker.weeks.length } as CSSProperties}>
          <span className="leetcode-day-label" style={{ gridColumn: 1, gridRow: 3 }}>
            Mon
          </span>
          <span className="leetcode-day-label" style={{ gridColumn: 1, gridRow: 5 }}>
            Wed
          </span>
          <span className="leetcode-day-label" style={{ gridColumn: 1, gridRow: 7 }}>
            Fri
          </span>
          {monthLabels.map((label) => (
            <span key={label.name + label.colStart} className="leetcode-month-label" style={{ gridColumn: `${label.colStart + 1} / ${label.colEnd + 1}`, gridRow: 1 }}>
              {label.name}
            </span>
          ))}
          {tracker.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="leetcode-practice-week">
              {week.map((day, dayIndex) => (
                <span
                  className={`leetcode-practice-day level-${day.level}`}
                  key={day.date}
                  style={{ gridColumn: weekIndex + 2, gridRow: dayIndex + 2 }}
                  title={`${day.date}: ${day.count} ${day.count === 1 ? 'article' : 'articles'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: last 6 months */}
      <div className="leetcode-practice-scroll tracker-mobile" ref={mobileScrollRef}>
        <div className="leetcode-practice-grid" aria-hidden="true" style={{ '--week-count': recentWeeks.length } as CSSProperties}>
          <span className="leetcode-day-label" style={{ gridColumn: 1, gridRow: 3 }}>
            Mon
          </span>
          <span className="leetcode-day-label" style={{ gridColumn: 1, gridRow: 5 }}>
            Wed
          </span>
          <span className="leetcode-day-label" style={{ gridColumn: 1, gridRow: 7 }}>
            Fri
          </span>
          {recentMonthLabels.map((label) => (
            <span key={label.name + label.colStart} className="leetcode-month-label" style={{ gridColumn: `${label.colStart + 1} / ${label.colEnd + 1}`, gridRow: 1 }}>
              {label.name}
            </span>
          ))}
          {recentWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="leetcode-practice-week">
              {week.map((day, dayIndex) => (
                <span
                  className={`leetcode-practice-day level-${day.level}`}
                  key={day.date}
                  style={{ gridColumn: weekIndex + 2, gridRow: dayIndex + 2 }}
                  title={`${day.date}: ${day.count} ${day.count === 1 ? 'article' : 'articles'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="leetcode-practice-legend" aria-hidden="true">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span className={`leetcode-practice-day level-${level}`} key={level} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
