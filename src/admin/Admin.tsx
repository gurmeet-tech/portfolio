import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import type { User } from 'firebase/auth'
import './admin.css'
import type { SiteContent, WorkItem } from '../content'
import { login, logout, saveContent, uploadImage, watchAuth } from '../adminApi'

type Props = { content: SiteContent | null; onSaved: () => void }

const SECTIONS = [
  { id: 'brand', label: 'Brand & logo', icon: 'fa-bolt' },
  { id: 'nav', label: 'Navigation', icon: 'fa-bars' },
  { id: 'contact', label: 'Contact & socials', icon: 'fa-paper-plane' },
  { id: 'hero', label: 'Home — hero', icon: 'fa-house' },
  { id: 'home', label: 'Home — sections', icon: 'fa-layer-group' },
  { id: 'shortForm', label: 'Short form page', icon: 'fa-film' },
  { id: 'longForm', label: 'Long form page', icon: 'fa-clapperboard' },
  { id: 'about', label: 'About page', icon: 'fa-circle-info' },
  { id: 'book', label: 'Book page', icon: 'fa-calendar-check' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="afield">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

function Text({ label, value, onChange, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

function Area({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadImage(file, 'uploads'))
    } catch {
      alert('Upload failed. Make sure Firebase Storage is enabled and its rules allow authenticated uploads.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="afield">
      <span>{label}</span>
      <div className="aimg">
        <img src={value} alt="" />
        <div className="aimg-fields">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload" />
          <div className="arow">
            <button type="button" className="abtn" disabled={busy} onClick={() => inputRef.current?.click()}>
              {busy ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        </div>
      </div>
    </div>
  )
}

function ArrayList<T>({ items, onChange, makeItem, addLabel, titleOf, render }: {
  items: T[]
  onChange: (v: T[]) => void
  makeItem: () => T
  addLabel: string
  titleOf: (item: T, i: number) => string
  render: (item: T, edit: (patch: Partial<T>) => void) => ReactNode
}) {
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items]
    const [x] = next.splice(i, 1)
    next.splice(j, 0, x)
    onChange(next)
  }
  return (
    <div className="alist">
      {items.map((it, i) => (
        <details className="alist-item" key={i}>
          <summary>
            <span className="alist-idx">{i + 1}</span>
            <span className="alist-title">{titleOf(it, i)}</span>
            <div className="alist-btns">
              <button type="button" aria-label="Move up" onClick={(e) => { e.preventDefault(); e.stopPropagation(); move(i, -1) }}>↑</button>
              <button type="button" aria-label="Move down" onClick={(e) => { e.preventDefault(); e.stopPropagation(); move(i, 1) }}>↓</button>
              <button type="button" aria-label="Delete" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(items.filter((_, x) => x !== i)) }}>✕</button>
            </div>
          </summary>
          <div className="alist-body">
            {render(it, (p) => onChange(items.map((x, xi) => (xi === i ? { ...x, ...p } : x))))}
          </div>
        </details>
      ))}
      <button type="button" className="abtn-ghost" onClick={() => onChange([...items, makeItem()])}>+ {addLabel}</button>
    </div>
  )
}

function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="afield">
      <span>{label}</span>
      {items.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input type="text" value={s} onChange={(e) => onChange(items.map((x, xi) => (xi === i ? e.target.value : x)))} />
          <button type="button" className="alist-btns" style={{ display: 'flex' }} aria-label="Remove" onClick={() => onChange(items.filter((_, xi) => xi !== i))}>✕</button>
        </div>
      ))}
      <button type="button" className="abtn-ghost" onClick={() => onChange([...items, 'New item'])}>+ Add</button>
    </div>
  )
}

function WorkList({ items, onChange }: { items: WorkItem[]; onChange: (v: WorkItem[]) => void }) {
  return (
    <ArrayList
      items={items}
      onChange={onChange}
      addLabel="Add work item"
      titleOf={(w) => `${w.name} — ${w.tag}`}
      makeItem={() => ({ name: 'New project', tag: 'Category', overlay: 'Category — Client', badge: 'Short form', logo: 'clients/base44.png', video: 'works/sample-1.mp4' })}
      render={(w, edit) => (
        <div className="agrid">
          <Text label="Client name" value={w.name} onChange={(v) => edit({ name: v })} />
          <Text label="Category" value={w.tag} onChange={(v) => edit({ tag: v })} />
          <Text label="Overlay title" value={w.overlay} onChange={(v) => edit({ overlay: v })} hint="Shown over the video" />
          <Text label="Badge" value={w.badge} onChange={(v) => edit({ badge: v })} hint="e.g. Short form / Long form" />
          <Text label="Video URL" value={w.video} onChange={(v) => edit({ video: v })} />
          <div />
          <div style={{ gridColumn: '1 / -1' }}>
            <ImageField label="Client logo" value={w.logo} onChange={(v) => edit({ logo: v })} />
          </div>
        </div>
      )}
    />
  )
}

function CtaFields({ value, onChange }: { value: { heading: string; text: string; buttonLabel: string; whatsappText: string }; onChange: (patch: Partial<{ heading: string; text: string; buttonLabel: string; whatsappText: string }>) => void }) {
  return (
    <div className="agrid">
      <Text label="Heading" value={value.heading} onChange={(v) => onChange({ heading: v })} />
      <Text label="Button label" value={value.buttonLabel} onChange={(v) => onChange({ buttonLabel: v })} />
      <div style={{ gridColumn: '1 / -1' }}>
        <Area label="Description" value={value.text} onChange={(v) => onChange({ text: v })} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Text label="WhatsApp message" value={value.whatsappText} onChange={(v) => onChange({ whatsappText: v })} hint="Pre-filled text when the button is tapped" />
      </div>
    </div>
  )
}

function SectionBody({ active, draft, setDraft }: { active: SectionId; draft: SiteContent; setDraft: Dispatch<SetStateAction<SiteContent | null>> }) {
  const patch = (key: keyof SiteContent, value: unknown) =>
    setDraft((d) => {
      if (!d) return d
      const cur = d[key]
      if (cur && typeof cur === 'object' && !Array.isArray(cur) && value && typeof value === 'object' && !Array.isArray(value)) {
        return { ...d, [key]: { ...cur, ...(value as object) } } as SiteContent
      }
      return { ...d, [key]: value } as SiteContent
    })

  switch (active) {
    case 'brand':
      return (
        <div className="acard">
          <h2>Brand & logo</h2>
          <p className="acard-hint">Your logo, name and footer details used across the whole site.</p>
          <ImageField label="Logo" value={draft.brand.logoUrl} onChange={(v) => patch('brand', { logoUrl: v })} />
          <Text label="Brand name" value={draft.brand.name} onChange={(v) => patch('brand', { name: v })} />
          <Text label="Footer tagline" value={draft.brand.footerTagline} onChange={(v) => patch('brand', { footerTagline: v })} />
          <Text label="Copyright line" value={draft.brand.copyright} onChange={(v) => patch('brand', { copyright: v })} />
        </div>
      )
    case 'nav':
      return (
        <div className="acard">
          <h2>Navigation links</h2>
          <p className="acard-hint">Top menu items. Use #/ , #/short-form , #/long-form , #/about for internal pages, or a full https:// URL for external links.</p>
          <ArrayList
            items={draft.nav}
            onChange={(v) => patch('nav', v )}
            addLabel="Add link"
            titleOf={(l) => `${l.label} → ${l.href}`}
            makeItem={() => ({ label: 'New link', href: '#/' })}
            render={(l, edit) => (
              <div className="agrid">
                <Text label="Label" value={l.label} onChange={(v) => edit({ label: v })} />
                <Text label="Link" value={l.href} onChange={(v) => edit({ href: v })} />
              </div>
            )}
          />
          <p className="acard-hint" style={{ marginTop: 16 }}>The bar also always shows a “Book a call” button (#/book) and a WhatsApp icon.</p>
        </div>
      )
    case 'contact':
      return (
        <div className="acard">
          <h2>Contact & socials</h2>
          <p className="acard-hint">Used by every WhatsApp button and the footer.</p>
          <div className="agrid">
            <Text label="WhatsApp number" value={draft.whatsappNumber} onChange={(v) => patch('whatsappNumber', v )} hint="Digits only, with country code. e.g. 919876543210" />
            <Text label="Calendly / booking link" value={draft.bookLink} onChange={(v) => patch('bookLink', v )} />
            <Text label="Contact email" value={draft.contactEmail} onChange={(v) => patch('contactEmail', v )} />
          </div>
          <Text label="Contact eyebrow" value={draft.contact.eyebrow} onChange={(v) => patch('contact', { eyebrow: v })} />
          <div className="agrid">
            <Text label="Contact heading" value={draft.contact.title} onChange={(v) => patch('contact', { title: v })} />
            <Text label="Contact heading (accent)" value={draft.contact.titleAccent} onChange={(v) => patch('contact', { titleAccent: v })} />
          </div>
          <p className="acard-hint" style={{ marginTop: 18 }}>Social icons</p>
          <ArrayList
            items={draft.socials}
            onChange={(v) => patch('socials', v )}
            addLabel="Add social"
            titleOf={(s) => `${s.label}`}
            makeItem={() => ({ label: 'New', href: 'https://', icon: 'fa-link' })}
            render={(s, edit) => (
              <div className="agrid">
                <Text label="Label" value={s.label} onChange={(v) => edit({ label: v })} />
                <Text label="URL" value={s.href} onChange={(v) => edit({ href: v })} />
                <Text label="Icon class" value={s.icon} onChange={(v) => edit({ icon: v })} hint="Font Awesome brand icon, e.g. fa-whatsapp, fa-x-twitter, fa-instagram, fa-linkedin-in" />
              </div>
            )}
          />
        </div>
      )
    case 'hero':
      return (
        <div className="acard">
          <h2>Home hero</h2>
          <p className="acard-hint">The big headline and showreel at the top of the home page.</p>
          <Text label="Headline line 1" value={draft.hero.line1} onChange={(v) => patch('hero', { line1: v })} />
          <Text label="Headline line 2" value={draft.hero.line2} onChange={(v) => patch('hero', { line2: v })} />
          <div className="agrid">
            <Text label="Primary button label" value={draft.hero.primaryLabel} onChange={(v) => patch('hero', { primaryLabel: v })} />
            <Text label="Primary button link" value={draft.hero.primaryHref} onChange={(v) => patch('hero', { primaryHref: v })} />
            <Text label="Secondary button label" value={draft.hero.secondaryLabel} onChange={(v) => patch('hero', { secondaryLabel: v })} />
          </div>
          <Area label="Sub-headline" value={draft.hero.sub} onChange={(v) => patch('hero', { sub: v })} />
          <Text label="Showreel video URL" value={draft.hero.showreel} onChange={(v) => patch('hero', { showreel: v })} />
          <ImageField label="Showreel poster image" value={draft.hero.poster} onChange={(v) => patch('hero', { poster: v })} />
        </div>
      )
    case 'home':
      return (
        <>
          <div className="acard">
            <h2>Selected work</h2>
            <p className="acard-hint">The two sample rows on the home page (no videos here, just logos).</p>
            <Text label="Eyebrow" value={draft.home.worksEyebrow} onChange={(v) => patch('home', { worksEyebrow: v })} />
            <Text label="Heading" value={draft.home.worksTitle} onChange={(v) => patch('home', { worksTitle: v })} />
            <Area label="Intro" value={draft.home.worksIntro} onChange={(v) => patch('home', { worksIntro: v })} />
            <Text label="Short form row title" value={draft.home.shortHeading} onChange={(v) => patch('home', { shortHeading: v })} />
            <WorkList items={draft.home.shortItems} onChange={(v) => patch('home', { shortItems: v })} />
            <Text label="Long form row title" value={draft.home.longHeading} onChange={(v) => patch('home', { longHeading: v })} />
            <WorkList items={draft.home.longItems} onChange={(v) => patch('home', { longItems: v })} />
            <p className="acard-hint" style={{ marginTop: 18 }}>Enquiry call-to-action</p>
            <CtaFields value={draft.home.worksCta} onChange={(v) => patch('home', { worksCta: { ...draft.home.worksCta, ...v } })} />
          </div>

          <div className="acard">
            <h2>Formats</h2>
            <Text label="Heading" value={draft.home.formatsTitle} onChange={(v) => patch('home', { formatsTitle: v })} />
            <ArrayList
              items={draft.home.formats}
              onChange={(v) => patch('home', { formats: v })}
              addLabel="Add format"
              titleOf={(f) => f.title}
              makeItem={() => ({ tag: 'Format', title: 'New format', text: 'Description', linkLabel: 'View', href: '#/' })}
              render={(f, edit) => (
                <div className="agrid">
                  <Text label="Tag" value={f.tag} onChange={(v) => edit({ tag: v })} />
                  <Text label="Title" value={f.title} onChange={(v) => edit({ title: v })} />
                  <Text label="Link label" value={f.linkLabel} onChange={(v) => edit({ linkLabel: v })} />
                  <Text label="Link" value={f.href} onChange={(v) => edit({ href: v })} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Area label="Description" value={f.text} onChange={(v) => edit({ text: v })} />
                  </div>
                </div>
              )}
            />
          </div>

          <div className="acard">
            <h2>Signal / pitch section</h2>
            <Text label="Heading" value={draft.home.signalTitle} onChange={(v) => patch('home', { signalTitle: v })} />
            <Text label="Paragraph — bold lead" value={draft.home.signalLead} onChange={(v) => patch('home', { signalLead: v })} />
            <Area label="Paragraph — rest" value={draft.home.signalText} onChange={(v) => patch('home', { signalText: v })} />
            <StringList label="Numbered steps" items={draft.home.signalSteps} onChange={(v) => patch('home', { signalSteps: v })} />
            <div className="agrid">
              <Text label="Button label" value={draft.home.signalLinkLabel} onChange={(v) => patch('home', { signalLinkLabel: v })} />
              <Text label="Button link" value={draft.home.signalLinkHref} onChange={(v) => patch('home', { signalLinkHref: v })} />
            </div>
          </div>

          <div className="acard">
            <h2>Quote & standard</h2>
            <Area label="Quote" value={draft.home.quote} onChange={(v) => patch('home', { quote: v })} />
            <Text label="Quote attribution" value={draft.home.quoteCite} onChange={(v) => patch('home', { quoteCite: v })} />
            <Text label="Standard heading" value={draft.home.standardTitle} onChange={(v) => patch('home', { standardTitle: v })} />
            <Area label="Standard text" value={draft.home.standardText} onChange={(v) => patch('home', { standardText: v })} />
            <div className="agrid">
              <Text label="Counter — from" value={draft.home.metricFrom} onChange={(v) => patch('home', { metricFrom: v })} />
              <Text label="Counter — to" value={draft.home.metricTo} onChange={(v) => patch('home', { metricTo: v })} />
            </div>
            <Text label="Counter note" value={draft.home.metricNote} onChange={(v) => patch('home', { metricNote: v })} />
            <div className="agrid">
              <Text label="Button label" value={draft.home.standardLinkLabel} onChange={(v) => patch('home', { standardLinkLabel: v })} />
              <Text label="Button link" value={draft.home.standardLinkHref} onChange={(v) => patch('home', { standardLinkHref: v })} />
            </div>
          </div>
        </>
      )
    case 'shortForm':
      return (
        <div className="acard">
          <h2>Short form page</h2>
          <Text label="Eyebrow" value={draft.shortForm.eyebrow} onChange={(v) => patch('shortForm', { eyebrow: v })} />
          <Text label="Title" value={draft.shortForm.title} onChange={(v) => patch('shortForm', { title: v })} />
          <Area label="Intro" value={draft.shortForm.intro} onChange={(v) => patch('shortForm', { intro: v })} />
          <p className="acard-hint" style={{ marginTop: 18 }}>Reels ({draft.shortForm.items.length})</p>
          <WorkList items={draft.shortForm.items} onChange={(v) => patch('shortForm', { items: v })} />
          <p className="acard-hint" style={{ marginTop: 18 }}>Enquiry call-to-action</p>
          <CtaFields value={draft.shortForm.cta} onChange={(v) => patch('shortForm', { cta: { ...draft.shortForm.cta, ...v } })} />
        </div>
      )
    case 'longForm':
      return (
        <div className="acard">
          <h2>Long form page</h2>
          <Text label="Eyebrow" value={draft.longForm.eyebrow} onChange={(v) => patch('longForm', { eyebrow: v })} />
          <Text label="Title" value={draft.longForm.title} onChange={(v) => patch('longForm', { title: v })} />
          <Area label="Intro" value={draft.longForm.intro} onChange={(v) => patch('longForm', { intro: v })} />
          <p className="acard-hint" style={{ marginTop: 18 }}>Long form videos</p>
          <WorkList items={draft.longForm.items} onChange={(v) => patch('longForm', { items: v })} />
          <p className="acard-hint" style={{ marginTop: 18 }}>Enquiry call-to-action</p>
          <CtaFields value={draft.longForm.cta} onChange={(v) => patch('longForm', { cta: { ...draft.longForm.cta, ...v } })} />
        </div>
      )
    case 'about':
      return (
        <>
          <div className="acard">
            <h2>About page</h2>
            <Text label="Eyebrow" value={draft.about.eyebrow} onChange={(v) => patch('about', { eyebrow: v })} />
            <Text label="Title" value={draft.about.title} onChange={(v) => patch('about', { title: v })} />
            <Area label="Intro" value={draft.about.intro} onChange={(v) => patch('about', { intro: v })} />
          </div>
          <div className="acard">
            <h2>Approach</h2>
            <Text label="Heading" value={draft.about.approachTitle} onChange={(v) => patch('about', { approachTitle: v })} />
            <Text label="Paragraph — bold lead" value={draft.about.approachLead} onChange={(v) => patch('about', { approachLead: v })} />
            <Area label="Paragraph — rest" value={draft.about.approachText} onChange={(v) => patch('about', { approachText: v })} />
            <StringList label="Numbered steps" items={draft.about.steps} onChange={(v) => patch('about', { steps: v })} />
            <div className="agrid">
              <Text label="Button label" value={draft.about.linkLabel} onChange={(v) => patch('about', { linkLabel: v })} />
              <Text label="Button link" value={draft.about.linkHref} onChange={(v) => patch('about', { linkHref: v })} />
            </div>
          </div>
          <div className="acard">
            <h2>Numbers</h2>
            <ArrayList
              items={draft.about.stats}
              onChange={(v) => patch('about', { stats: v })}
              addLabel="Add stat"
              titleOf={(s) => s.label}
              makeItem={() => ({ from: '0.0', to: '1.0', label: 'New stat' })}
              render={(s, edit) => (
                <div className="agrid">
                  <Text label="Count from" value={s.from} onChange={(v) => edit({ from: v })} />
                  <Text label="Count to" value={s.to} onChange={(v) => edit({ to: v })} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Text label="Label" value={s.label} onChange={(v) => edit({ label: v })} />
                  </div>
                </div>
              )}
            />
          </div>
          <div className="acard">
            <h2>Quote & closing</h2>
            <Area label="Quote" value={draft.about.quote} onChange={(v) => patch('about', { quote: v })} />
            <Text label="Quote attribution" value={draft.about.quoteCite} onChange={(v) => patch('about', { quoteCite: v })} />
            <Text label="Closing heading" value={draft.about.standardTitle} onChange={(v) => patch('about', { standardTitle: v })} />
            <Area label="Closing text" value={draft.about.standardText} onChange={(v) => patch('about', { standardText: v })} />
            <div className="agrid">
              <Text label="Button label" value={draft.about.standardLinkLabel} onChange={(v) => patch('about', { standardLinkLabel: v })} />
              <Text label="Button link" value={draft.about.standardLinkHref} onChange={(v) => patch('about', { standardLinkHref: v })} />
            </div>
          </div>
        </>
      )
    case 'book':
      return (
        <div className="acard">
          <h2>Book page</h2>
          <Text label="Eyebrow" value={draft.book.eyebrow} onChange={(v) => patch('book', { eyebrow: v })} />
          <Text label="Title" value={draft.book.title} onChange={(v) => patch('book', { title: v })} />
          <Area label="Intro" value={draft.book.intro} onChange={(v) => patch('book', { intro: v })} />
          <Text label="Side heading" value={draft.book.sideTitle} onChange={(v) => patch('book', { sideTitle: v })} />
          <Area label="Side text" value={draft.book.sideText} onChange={(v) => patch('book', { sideText: v })} />
          <ArrayList
            items={draft.book.bullets}
            onChange={(v) => patch('book', { bullets: v })}
            addLabel="Add highlight"
            titleOf={(b) => `${b.value} — ${b.label}`}
            makeItem={() => ({ value: '30 min', label: 'New highlight' })}
            render={(b, edit) => (
              <div className="agrid">
                <Text label="Value" value={b.value} onChange={(v) => edit({ value: v })} />
                <Text label="Label" value={b.label} onChange={(v) => edit({ label: v })} />
              </div>
            )}
          />
          <p className="acard-hint" style={{ marginTop: 16 }}>The Calendly embed and “Chat on WhatsApp” button use the booking link and WhatsApp number from “Contact & socials”.</p>
        </div>
      )
  }
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email.trim(), password)
    } catch {
      setError('Wrong email or password.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="admin">
      <form className="admin-login-card" style={{ margin: '80px auto' }} onSubmit={submit}>
        <div className="admin-logo"><span>◆</span> joggi.dsg admin</div>
        <h1>Welcome back</h1>
        <p>Sign in to edit your website content.</p>
        <Field label="Email">
          <input type="text" value={email} autoComplete="username" onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <input type="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error ? <p style={{ color: '#d03238', fontSize: 13 }}>{error}</p> : null}
        <button type="submit" className="abtn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}

export default function Admin({ content, onSaved }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [active, setActive] = useState<SectionId>('brand')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => watchAuth((u) => { setUser(u); setReady(true) }), [])

  useEffect(() => {
    if (content) setDraft(content)
  }, [content])

  if (!ready) return <div className="admin"><p style={{ padding: 40 }}>Loading…</p></div>
  if (!user) return <Login />
  if (!content || !draft) return <div className="admin"><p style={{ padding: 40 }}>Loading content…</p></div>

  const save = async () => {
    setSaving(true)
    setStatus('Saving…')
    try {
      await saveContent(draft)
      onSaved()
      setStatus('Saved ✓')
      window.setTimeout(() => setStatus(''), 2500)
    } catch {
      setStatus('Save failed')
      alert('Could not save. Check that Firestore is enabled and its rules allow authenticated writes.')
    } finally {
      setSaving(false)
    }
  }

  const current = SECTIONS.find((s) => s.id === active)

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="admin-logo">
            <span>◆</span>
            <strong>{draft.brand.name}</strong>
          </div>
          <nav className="admin-side-nav">
            {SECTIONS.map((s) => (
              <button key={s.id} type="button" className={s.id === active ? 'is-active' : ''} onClick={() => setActive(s.id)}>
                <i className={`fa-solid ${s.icon}`} /> {s.label}
              </button>
            ))}
          </nav>
          <button type="button" className="admin-signout" onClick={() => logout()}>Sign out · {user.email}</button>
        </aside>

        <div className="admin-main">
          <header className="admin-top">
            <h1>{current?.label}</h1>
            <div className="admin-top-actions">
              <span className="admin-status">{status}</span>
              <a className="admin-view" href="#/" target="_blank" rel="noreferrer">View site ↗</a>
              <button type="button" className="admin-save" style={{ minWidth: 120 }} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </header>
          <div className="admin-body">
            <SectionBody active={active} draft={draft} setDraft={setDraft} />
          </div>
        </div>
      </div>
    </div>
  )
}