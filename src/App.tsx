import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './index.css'
import html from './main.html?raw'
import s3 from './s3.js?raw'
import s4 from './s4.js?raw'
import s5 from './s5.js?raw'
import VariableProximity from './VariableProximity'

export default function App() {
  const containerRef = useRef<HTMLElement | null>(null)
  const [lines, setLines] = useState<HTMLElement[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const run = new Function(`${s3}\n${s4}\n${s5}`)
    run()

    const hero = document.querySelector('.hero')
    if (hero instanceof HTMLElement) containerRef.current = hero

    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)

    const els = Array.from(
      document.querySelectorAll<HTMLElement>('#hero-title .hero-line')
    )
    els.forEach((el) => {
      el.textContent = ''
    })
    setLines(els)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  return (
    <>
      <main className="page" dangerouslySetInnerHTML={{ __html: html }} />
      {lines.map((el, i) => {
        const label = el.dataset.vp ?? ''
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