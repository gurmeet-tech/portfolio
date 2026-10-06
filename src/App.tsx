import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './index.css'
import homeHtml from './main.html?raw'
import contact from './partials/contact.html?raw'
import shortForm from './pages/short-form.html?raw'
import longForm from './pages/long-form.html?raw'
import about from './pages/about.html?raw'
import book from './pages/book.html?raw'
import s3 from './s3.js?raw'
import s4 from './s4.js?raw'
import s5 from './s5.js?raw'
import VariableProximity from './VariableProximity'

const WhatsApp =
  'https://wa.me/1234567890?text=Hi%20joggi.dsg%2C%20I%27d%20like%20to%20discuss%20a%20project!'

const navItems: [string, string][] = [
  ['#/', 'Home'],
  ['#/short-form', 'Short Form Work'],
  ['#/long-form', 'Long Form Work'],
  ['#/about', 'About Us'],
]

function topbar(active: string) {
  const links = navItems
    .map(
      ([href, label]) =>
        `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`
    )
    .join('')
  return `
      <header class="topbar">
        <a class="brand" href="#/" aria-label="joggi.dsg home">
          <img class="brand-mark" src="logo.jpg" alt="" />
          <span class="brand-name">- joggi.dsg</span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${links}
          <a class="nav-cta" href="#/book">Book a call</a>
          <a class="nav-whatsapp" href="${WhatsApp}" target="_blank" rel="noreferrer noopener" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </nav>
        <button class="menu" type="button" aria-label="Open navigation" aria-expanded="false"><span class="menu-bar"></span><span class="menu-bar"></span></button>
      </header>

      <div class="rule" id="top"></div>
`
}

function pageShell(active: string, body: string) {
  return `${topbar(active)}${body}${contact}`
}

const routes: Record<string, string> = {
  '#/': homeHtml,
  '#/short-form': pageShell('#/short-form', shortForm),
  '#/long-form': pageShell('#/long-form', longForm),
  '#/about': pageShell('#/about', about),
  '#/book': pageShell('#/book', book),
}

export default function App() {
  const containerRef = useRef<HTMLElement | null>(null)
  const [page, setPage] = useState('#/')
  const [lines, setLines] = useState<HTMLElement[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const sync = () => {
      const hash = (window.location.hash || '#/').split('?')[0]
      setPage(routes[hash] ? hash : '#/')
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
  }, [page])

  const markup = routes[page] || routes['#/']

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