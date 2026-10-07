import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './index.css'
import s3 from './s3.js?raw'
import s4 from './s4.js?raw'
import s5 from './s5.js?raw'
import VariableProximity from './VariableProximity'
import { loadContent } from './store'
import { renderRoute } from './render'
import type { SiteContent } from './content'

const Admin = lazy(() => import('./admin/Admin'))

const KNOWN = ['#/', '#/short-form', '#/long-form', '#/about', '#/book', '#/admin']

export default function App() {
  const containerRef = useRef<HTMLElement | null>(null)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [page, setPage] = useState('#/')
  const [lines, setLines] = useState<HTMLElement[]>([])
  const [isMobile, setIsMobile] = useState(false)

  const reload = () => loadContent().then(setContent)

  useEffect(() => {
    reload()
  }, [])

  useEffect(() => {
    const sync = () => {
      const hash = (window.location.hash || '#/').split('?')[0]
      setPage(KNOWN.includes(hash) ? hash : '#/')
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    if (!content || page === '#/admin') {
      setLines([])
      return
    }
    window.scrollTo(0, 0)
    const run = new Function(`${s3}\n${s4}\n${s5}`)
    run()

    const hero = document.querySelector('.hero')
    containerRef.current = hero instanceof HTMLElement ? hero : null

    const els = Array.from(
      document.querySelectorAll<HTMLElement>('#hero-title .hero-line')
    )
    els.forEach((el) => {
      el.textContent = ''
    })
    setLines(els)
  }, [page, content])

  if (page === '#/admin') {
    return (
      <Suspense fallback={<div className="admin"><div className="admin-body">Loading dashboard…</div></div>}>
        <Admin content={content} onSaved={reload} />
      </Suspense>
    )
  }

  const markup = content ? renderRoute(content, page) : ''

  return (
    <>
      <main className="page" dangerouslySetInnerHTML={{ __html: markup }} />
      {lines.map((el, i) => {
        if (!el.isConnected) return null
        const label = el.dataset.vp || ''
        const accent = el.classList.contains('hero-line-accent')
        if (isMobile) {
          return createPortal(
            <span className="hero-line-text">{label}</span>,
            el,
            `m${i}`
          )
        }
        return createPortal(
          <VariableProximity
            label={label}
            className={accent ? 'hero-vp hero-vp-accent' : 'hero-vp hero-vp-primary'}
            fromFontVariationSettings="'wght' 100, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={150}
            falloff="linear"
          />,
          el,
          `d${i}`
        )
      })}
    </>
  )
}