import type { Cta, SiteContent, WorkItem } from './content'

const esc = (s: string) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function waHref(c: SiteContent, text?: string) {
  const digits = (c.whatsappNumber || '').replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

function topbar(c: SiteContent, active: string) {
  const links = c.nav
    .map(
      (l) =>
        `<a href="${esc(l.href)}"${l.href === active ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`
    )
    .join('')
  return `
      <header class="topbar">
        <a class="brand" href="#/" aria-label="${esc(c.brand.name)} home">
          <img class="brand-mark" src="${esc(c.brand.logoUrl)}" alt="" />
          <span class="brand-name">${esc(c.brand.name)}</span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${links}
          <a class="nav-cta" href="#/book">Book a call</a>
          <a class="nav-whatsapp" href="${waHref(c, "Hi " + c.brand.name + ", I'd like to discuss a project!")}" target="_blank" rel="noreferrer noopener" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </nav>
        <button class="menu" type="button" aria-label="Open navigation" aria-expanded="false"><span class="menu-bar"></span><span class="menu-bar"></span></button>
      </header>

      <div class="rule" id="top"></div>
`
}

function hero(c: SiteContent) {
  const h = c.hero
  return `
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-signal-field" aria-hidden="true">
          <span class="signal-field-trajectory"></span>
          <span class="signal-field-node one"></span>
          <span class="signal-field-node two"></span>
          <span class="signal-field-orbit"></span>
          <span class="signal-field-glow"></span>
          <span class="signal-field-stretch"></span>
          <span class="signal-field-rail"></span>
          <span class="signal-field-guide"></span>
          <span class="signal-field-sweep"></span>
          <span class="signal-field-arc top"></span>
          <span class="signal-field-arc left"></span>
          <span class="signal-field-arc right"></span>
          <span class="signal-field-thread top"></span>
          <span class="signal-field-thread center"></span>
          <span class="signal-field-thread right"></span>
          <span class="signal-field-circuit top"></span>
          <span class="signal-field-circuit left"></span>
          <span class="signal-field-circuit right"></span>
        </div>
        <div class="hero-copy">
          <div>
          <h1 id="hero-title"><span class="hero-line hero-line-primary" data-vp="${esc(h.line1)}">${esc(h.line1)}</span><span class="hero-line hero-line-accent" data-vp="${esc(h.line2)}">${esc(h.line2)}</span></h1>
          </div>
          <div class="hero-bottom">
            <p>${esc(h.sub)}</p>
            <div class="hero-actions">
              <a class="button-link button-primary hero-cta" href="${esc(h.primaryHref)}">${esc(h.primaryLabel)}</a>
              <a class="button-link button-outline" href="${esc(c.bookLink)}" target="_blank" rel="noreferrer noopener">${esc(h.secondaryLabel)}</a>
            </div>
          </div>
        </div>
        <div class="hero-aside">
          <div class="hero-reel">
            <video autoplay muted loop playsinline preload="auto" poster="${esc(h.poster)}" src="${esc(h.showreel)}" aria-label="joggi.dsg showreel 2026"></video>
            <div class="reel-info">
              <div><span>joggi.dsg showreel</span><strong>2026</strong></div>
              <div class="reel-controls">
                <button class="reel-btn" type="button" data-hero-toggle="play" aria-label="Pause showreel"><i class="fa-solid fa-pause"></i></button>
                <button class="reel-btn" type="button" data-hero-toggle="mute" aria-label="Unmute showreel"><i class="fa-solid fa-volume-xmark"></i></button>
              </div>
            </div>
          </div>
        </div>
        <a class="hero-scroll-cue" href="#studio" aria-label="Scroll down to selected teams">
          <span>Scroll down</span>
          <span class="hero-scroll-cue-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-down"></i></span>
        </a>
      </section>
`
}

function staticCard(item: WorkItem, variant: 'short' | 'long') {
  return `
            <article class="work-card">
              <div class="work-media work-media--${variant}">
                <div class="work-fallback"><strong>${esc(item.name)}</strong></div>
                <span class="work-badge">${esc(item.badge)}</span>
              </div>
              <div class="work-meta"><h3>${esc(item.name)}</h3><p>${esc(item.tag)}</p></div>
            </article>`
}

function workCard(item: WorkItem, variant: 'short' | 'long') {
  return `
          <article class="work-card">
            <div class="work-media work-media--${variant} work-media--logo">
              <video data-video-src="${esc(item.video)}" muted loop playsinline preload="none" aria-hidden="true"></video>
              <div class="work-fallback"><img class="work-logo" src="${esc(item.logo)}" alt="${esc(item.name)}" loading="lazy" /></div>
              <span class="work-badge">${esc(item.badge)}</span>
              <span class="work-title">${esc(item.overlay)}</span>
              <button class="work-play" type="button" aria-label="Play ${esc(item.name)} video"><i class="fa-solid fa-play"></i></button>
            </div>
            <div class="work-meta"><h3>${esc(item.name)}</h3><p>${esc(item.tag)}</p></div>
          </article>`
}

function ctaBlock(c: SiteContent, cta: Cta) {
  return `
        <div class="work-cta">
          <div>
            <h3>${esc(cta.heading)}</h3>
            <p>${esc(cta.text)}</p>
          </div>
          <a class="button-link button-primary" href="${waHref(c, cta.whatsappText)}" target="_blank" rel="noreferrer noopener"><i class="fa-brands fa-whatsapp"></i>&nbsp;${esc(cta.buttonLabel)}</a>
        </div>`
}

function worksHome(c: SiteContent) {
  const h = c.home
  return `
      <section class="section works-home" id="work" aria-labelledby="works-title">
        <div class="section-head">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>${esc(h.worksEyebrow)}</div>
            <h2 id="works-title">${esc(h.worksTitle)}</h2>
          </div>
          <p>${esc(h.worksIntro)}</p>
        </div>
        <div class="works-sub">
          <div class="works-sub-head">
            <h3>${esc(h.shortHeading)}</h3>
            <a class="works-sub-link" href="#/short-form">View all <i class="fa-solid fa-arrow-right"></i></a>
          </div>
          <div class="works-row">${h.shortItems.map((i) => staticCard(i, 'short')).join('')}
          </div>
        </div>

        <div class="works-sub">
          <div class="works-sub-head">
            <h3>${esc(h.longHeading)}</h3>
            <a class="works-sub-link" href="#/long-form">View all <i class="fa-solid fa-arrow-right"></i></a>
          </div>
          <div class="works-row">${h.longItems.map((i) => staticCard(i, 'long')).join('')}
          </div>
        </div>
${ctaBlock(c, h.worksCta)}
      </section>
`
}

function formats(c: SiteContent) {
  const h = c.home
  const cards = h.formats
    .map(
      (f) => `
          <a class="format-card" href="${esc(f.href)}">
            <span class="format-tag">${esc(f.tag)}</span>
            <h3>${esc(f.title)}</h3>
            <p>${esc(f.text)}</p>
            <span class="format-more">${esc(f.linkLabel)} <i class="fa-solid fa-arrow-right"></i></span>
          </a>`
    )
    .join('')
  return `
      <section class="section formats" id="formats" aria-labelledby="formats-title">
        <div class="section-head">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>Formats</div>
            <h2 id="formats-title">${esc(h.formatsTitle)}</h2>
          </div>
        </div>
        <div class="format-grid">${cards}
        </div>
      </section>
`
}

function steps(items: string[]) {
  return items
    .map((s, i) => `<div><strong>0${i + 1}</strong><span>${esc(s)}</span></div>`)
    .join('')
}

function signal(c: SiteContent) {
  const h = c.home
  return `
      <section class="signal" id="studio" aria-labelledby="signal-title">
        <div>
          <h2 id="signal-title">${esc(h.signalTitle)}</h2>
        </div>
        <div class="signal-copy">
          <p><strong>${esc(h.signalLead)}</strong> ${esc(h.signalText)}</p>
          <div class="signal-list">${steps(h.signalSteps)}
          </div>
          <a class="button-link button-outline" href="${esc(h.signalLinkHref)}">${esc(h.signalLinkLabel)}</a>
        </div>
      </section>
`
}

function quote(c: SiteContent) {
  const h = c.home
  return `
      <section class="quote" aria-labelledby="quote-title">
        <div class="quote-card">
          <span class="quote-mark"><i class="fa-solid fa-quote-left"></i></span>
          <blockquote id="quote-title">${esc(h.quote)}</blockquote>
          <cite>${esc(h.quoteCite)}</cite>
        </div>
        <div class="quote-side">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>The standard</div>
            <h2>${esc(h.standardTitle)}</h2>
          </div>
          <p>${esc(h.standardText)}</p>
          <p class="quote-proof"><span class="metric-value" data-count-from="${esc(h.metricFrom)}" data-count-to="${esc(h.metricTo)}" aria-live="polite">${esc(h.metricTo)}M+</span>${esc(h.metricNote)}</p>
          <a class="button-link button-outline" href="${esc(h.standardLinkHref)}">${esc(h.standardLinkLabel)}</a>
        </div>
      </section>
`
}

function contactSection(c: SiteContent) {
  const socials = c.socials
    .map(
      (s) =>
        `<a class="social-icon" href="${esc(s.href)}" target="_blank" rel="noreferrer noopener" aria-label="${esc(c.brand.name)} on ${esc(s.label)}"><i class="fa-brands ${esc(s.icon)}"></i></a>`
    )
    .join('')
  const footerNav = c.nav
    .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
    .join('')
  return `
      <section class="cta" aria-labelledby="cta-title">
        <div class="contact-panel">
          <div class="contact-grid">
            <div class="contact-intro">
              <div class="eyebrow"><span class="blue-dot"></span>${esc(c.contact.eyebrow)}</div>
              <h2 id="cta-title"><span>${esc(c.contact.title)}</span> <em>${esc(c.contact.titleAccent)}</em></h2>
            </div>
            <form class="contact-form" aria-label="Project enquiry" data-form-endpoint="">
              <div class="contact-field">
                <label for="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" placeholder="Enter your name" autocomplete="name" />
              </div>
              <div class="contact-field">
                <label for="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" placeholder="Enter your email" autocomplete="email" />
              </div>
              <div class="contact-field">
                <label for="contact-budget">Budget</label>
                <select id="contact-budget" name="budget">
                  <option>$1K - $2K</option>
                  <option>$2K - $5K</option>
                  <option>$5K+</option>
                </select>
              </div>
              <div class="contact-field">
                <label for="contact-message">Message</label>
                <textarea id="contact-message" name="message" placeholder="Describe your product"></textarea>
              </div>
              <button class="contact-submit" type="submit">Submit</button>
            </form>
          </div>
          <footer class="footer">
            <nav class="footer-nav" aria-label="Footer">${footerNav}</nav>
            <div class="footer-socials" aria-label="Social links">${socials}</div>
            <div class="footer-bottom">
              <a class="footer-brand" href="#top">${esc(c.brand.name)}</a>
              <div class="footer-legal"><span>${esc(c.brand.copyright)}</span><span>${esc(c.brand.footerTagline)}</span></div>
            </div>
          </footer>
        </div>
      </section>
`
}

function workPage(
  c: SiteContent,
  opts: { id: string; variant: 'short' | 'long'; eyebrow: string; title: string; intro: string; items: WorkItem[]; cta: Cta }
) {
  return `
      <section class="section work-page" aria-labelledby="${esc(opts.id)}-title">
        <div class="section-head">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>${esc(opts.eyebrow)}</div>
            <h2 id="${esc(opts.id)}-title">${esc(opts.title)}</h2>
          </div>
          <p>${esc(opts.intro)}</p>
        </div>
        <div class="work-grid work-grid--${opts.variant}">${opts.items.map((i) => workCard(i, opts.variant)).join('')}
        </div>
${ctaBlock(c, opts.cta)}
      </section>
`
}

function aboutPage(c: SiteContent) {
  const a = c.about
  const stats = a.stats
    .map(
      (s) => `
          <div class="about-stat">
            <span class="metric-value" data-count-from="${esc(s.from)}" data-count-to="${esc(s.to)}" aria-live="polite">${esc(s.to)}M+</span>
            <p>${esc(s.label)}</p>
          </div>`
    )
    .join('')
  return `
      <section class="section about-page" aria-labelledby="about-title">
        <div class="section-head">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>${esc(a.eyebrow)}</div>
            <h2 id="about-title">${esc(a.title)}</h2>
          </div>
          <p>${esc(a.intro)}</p>
        </div>
      </section>

      <section class="signal" aria-labelledby="about-approach">
        <div>
          <h2 id="about-approach">${esc(a.approachTitle)}</h2>
        </div>
        <div class="signal-copy">
          <p><strong>${esc(a.approachLead)}</strong> ${esc(a.approachText)}</p>
          <div class="signal-list">${steps(a.steps)}
          </div>
          <a class="button-link button-outline" href="${esc(a.linkHref)}">${esc(a.linkLabel)}</a>
        </div>
      </section>

      <section class="section about-results" aria-labelledby="about-results-title">
        <div class="section-head">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>The numbers</div>
            <h2 id="about-results-title">Proof, not promises.</h2>
          </div>
          <p>Work that ships on time and moves the metrics that matter after launch day.</p>
        </div>
        <div class="about-stats">${stats}
        </div>
      </section>

      <section class="quote" aria-labelledby="about-quote-title">
        <div class="quote-card">
          <span class="quote-mark"><i class="fa-solid fa-quote-left"></i></span>
          <blockquote id="about-quote-title">${esc(a.quote)}</blockquote>
          <cite>${esc(a.quoteCite)}</cite>
        </div>
        <div class="quote-side">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>How we work</div>
            <h2>${esc(a.standardTitle)}</h2>
          </div>
          <p>${esc(a.standardText)}</p>
          <a class="button-link button-primary" href="${esc(a.standardLinkHref)}">${esc(a.standardLinkLabel)}</a>
        </div>
      </section>
`
}

function bookPage(c: SiteContent) {
  const b = c.book
  const bullets = b.bullets
    .map((x) => `<li><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></li>`)
    .join('')
  return `
      <section class="section book-page" aria-labelledby="book-title">
        <div class="section-head">
          <div>
            <div class="eyebrow"><span class="blue-dot"></span>${esc(b.eyebrow)}</div>
            <h2 id="book-title">${esc(b.title)}</h2>
          </div>
          <p>${esc(b.intro)}</p>
        </div>
        <div class="book-grid">
          <div class="book-calendly">
            <iframe src="${esc(c.bookLink)}?hide_gdpr_banner=1&primary_color=0e86b3" title="Book a discovery call" loading="lazy"></iframe>
          </div>
          <aside class="book-side">
            <h3>${esc(b.sideTitle)}</h3>
            <p>${esc(b.sideText)}</p>
            <a class="button-link button-primary" href="${waHref(c, "Hi " + c.brand.name + ", I'd like to discuss a project!")}" target="_blank" rel="noreferrer noopener">Chat on WhatsApp</a>
            <a class="button-link button-outline" href="${esc(c.bookLink)}" target="_blank" rel="noreferrer noopener">Open Calendly in a new tab</a>
            <ul class="book-list">${bullets}</ul>
          </aside>
        </div>
      </section>
`
}

export function renderRoute(c: SiteContent, hash: string): string {
  const shell = (body: string, active: string) => `${topbar(c, active)}${body}${contactSection(c)}`
  switch (hash) {
    case '#/short-form':
      return shell(
        workPage(c, { id: 'short', variant: 'short', ...c.shortForm }),
        '#/short-form'
      )
    case '#/long-form':
      return shell(
        workPage(c, { id: 'long', variant: 'long', ...c.longForm }),
        '#/long-form'
      )
    case '#/about':
      return shell(aboutPage(c), '#/about')
    case '#/book':
      return shell(bookPage(c), '#/book')
    default:
      return `${topbar(c, '#/')}${hero(c)}${worksHome(c)}${formats(c)}${signal(c)}${quote(c)}${contactSection(c)}`
  }
}