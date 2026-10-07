export type NavLink = { label: string; href: string }
export type SocialLink = { label: string; href: string; icon: string }
export type WorkItem = {
  name: string
  tag: string
  overlay: string
  badge: string
  logo: string
  video: string
}
export type Cta = {
  heading: string
  text: string
  buttonLabel: string
  whatsappText: string
}

export type SiteContent = {
  brand: {
    name: string
    logoUrl: string
    footerTagline: string
    copyright: string
  }
  nav: NavLink[]
  whatsappNumber: string
  bookLink: string
  contactEmail: string
  socials: SocialLink[]
  hero: {
    line1: string
    line2: string
    sub: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    showreel: string
    poster: string
  }
  home: {
    worksEyebrow: string
    worksTitle: string
    worksIntro: string
    shortHeading: string
    shortItems: WorkItem[]
    longHeading: string
    longItems: WorkItem[]
    worksCta: Cta
    formatsTitle: string
    formats: { tag: string; title: string; text: string; linkLabel: string; href: string }[]
    signalTitle: string
    signalLead: string
    signalText: string
    signalSteps: string[]
    signalLinkLabel: string
    signalLinkHref: string
    quote: string
    quoteCite: string
    standardTitle: string
    standardText: string
    standardLinkLabel: string
    standardLinkHref: string
    metricFrom: string
    metricTo: string
    metricNote: string
  }
  shortForm: {
    eyebrow: string
    title: string
    intro: string
    items: WorkItem[]
    cta: Cta
  }
  longForm: {
    eyebrow: string
    title: string
    intro: string
    items: WorkItem[]
    cta: Cta
  }
  about: {
    eyebrow: string
    title: string
    intro: string
    approachTitle: string
    approachLead: string
    approachText: string
    steps: string[]
    linkLabel: string
    linkHref: string
    quote: string
    quoteCite: string
    standardTitle: string
    standardText: string
    standardLinkLabel: string
    standardLinkHref: string
    stats: { from: string; to: string; label: string }[]
  }
  book: {
    eyebrow: string
    title: string
    intro: string
    sideTitle: string
    sideText: string
    bullets: { value: string; label: string }[]
  }
  contact: {
    eyebrow: string
    title: string
    titleAccent: string
  }
}

export const defaultContent: SiteContent = {
  brand: {
    name: '- joggi.dsg',
    logoUrl: 'logo.jpg',
    footerTagline: 'Launch films for products that are hard to explain.',
    copyright: '© 2026 joggi.dsg',
  },
  nav: [
    { label: 'Home', href: '#/' },
    { label: 'Short Form Work', href: '#/short-form' },
    { label: 'Long Form Work', href: '#/long-form' },
    { label: 'About Us', href: '#/about' },
  ],
  whatsappNumber: '1234567890',
  bookLink: 'https://calendly.com/joggi',
  contactEmail: 'hello@joggi.dsg',
  socials: [
    { label: 'WhatsApp', href: 'https://wa.me/1234567890', icon: 'fa-whatsapp' },
    { label: 'X', href: 'https://x.com/joggi.dsg', icon: 'fa-x-twitter' },
    { label: 'Instagram', href: 'https://www.instagram.com/joggi.dsg', icon: 'fa-instagram' },
  ],
  hero: {
    line1: 'You build the future,',
    line2: 'we make it visible at joggi.dsg.',
    sub: 'High-impact launch videos and conversion-focused product videos for tech companies.',
    primaryLabel: 'SEE MY WORK',
    primaryHref: '#/long-form',
    secondaryLabel: 'Book a call',
    showreel: 'hero-media/showreel-with-sound.mp4',
    poster: 'hero-media/posters/showreel.jpg',
  },
  home: {
    worksEyebrow: 'Selected work',
    worksTitle: 'Recent launches.',
    worksIntro: 'A few projects that show the range, from first frame to final mix.',
    shortHeading: 'Short form work',
    shortItems: [
      { name: 'Base44', tag: 'Social cutdown', overlay: 'Social cutdown — Base44', badge: 'Short form', logo: 'clients/base44.png', video: 'works/sample-1.mp4' },
      { name: 'Asana', tag: 'Feature launch', overlay: 'Feature launch — Asana', badge: 'Short form', logo: 'clients/asana.png', video: 'works/sample-2.mp4' },
      { name: 'Agent Arcade', tag: 'Launch reel', overlay: 'Launch reel — Agent Arcade', badge: 'Short form', logo: 'clients/agent-arcade.png', video: 'works/sample-3.mp4' },
      { name: 'OnePay', tag: 'Paid social ad', overlay: 'Paid social ad — OnePay', badge: 'Short form', logo: 'clients/onepay.png', video: 'works/sample-4.mp4' },
    ],
    longHeading: 'Long form work',
    longItems: [
      { name: 'Advanc', tag: 'Launch film', overlay: 'Launch film — Advanc', badge: 'Long form', logo: 'clients/advanc.png', video: 'works/sample-2.mp4' },
      { name: 'Windsurf', tag: 'Product video', overlay: 'Product video — Windsurf', badge: 'Long form', logo: 'clients/windsurf.png', video: 'works/sample-3.mp4' },
      { name: 'Inflect', tag: 'Brand film', overlay: 'Brand film — Inflect', badge: 'Long form', logo: 'clients/inflect.png', video: 'works/sample-4.mp4' },
      { name: 'IOPEX', tag: 'Product explainer', overlay: 'Product explainer — IOPEX', badge: 'Long form', logo: 'clients/iopex.png', video: 'works/sample-1.mp4' },
    ],
    worksCta: {
      heading: 'Enquire about this',
      text: 'Tell me about your project — scope, budget, and deadline.',
      buttonLabel: 'Enquire about this',
      whatsappText: 'hey i need a video edited and my budget is : (your budget)',
    },
    formatsTitle: 'Long form & short form.',
    formats: [
      { tag: 'Long form', title: 'Launch films & product videos', text: '60 to 180 seconds built to explain a complex product: the angle, the story, the motion, and the mix.', linkLabel: 'View long form', href: '#/long-form' },
      { tag: 'Short form', title: 'Reels, ads & social cutdowns', text: '15 to 60 seconds engineered for feeds and paid: sharp hooks, fast pacing, and a clear payoff.', linkLabel: 'View short form', href: '#/short-form' },
    ],
    signalTitle: 'Make complexity feel like momentum.',
    signalLead: 'A launch film should do more than look good.',
    signalText: 'It should give the audience a way in: a clear idea, a memorable rhythm, and a product they can understand before the second watch.',
    signalSteps: ['Find the angle', 'Build the story', 'Shape the motion', 'Finish the sound'],
    signalLinkLabel: 'See our work',
    signalLinkHref: '#/long-form',
    quote: "Bring us the hard part. We'll make it clear.",
    quoteCite: 'joggi.dsg / motion design',
    standardTitle: 'Less noise. More signal.',
    standardText: 'One team from research to sound design. One launch film that knows what it is trying to make the audience feel.',
    standardLinkLabel: 'See the full portfolio',
    standardLinkHref: '#/long-form',
    metricFrom: '11.1',
    metricTo: '64.9',
    metricNote: 'views created across launches, branded, organic, and inorganic.',
  },
  shortForm: {
    eyebrow: 'Short form',
    title: 'Short form work.',
    intro: '15 to 60 second cuts engineered for feeds and paid: sharp hooks, fast pacing, and a clear payoff.',
    items: [
      { name: 'Base44', tag: 'Social cutdown', overlay: 'Social cutdown — Base44', badge: 'Short form', logo: 'clients/base44.png', video: 'works/sample-1.mp4' },
      { name: 'Asana', tag: 'Feature launch', overlay: 'Feature launch — Asana', badge: 'Short form', logo: 'clients/asana.png', video: 'works/sample-2.mp4' },
      { name: 'Agent Arcade', tag: 'Launch reel', overlay: 'Launch reel — Agent Arcade', badge: 'Short form', logo: 'clients/agent-arcade.png', video: 'works/sample-3.mp4' },
      { name: 'OnePay', tag: 'Paid social ad', overlay: 'Paid social ad — OnePay', badge: 'Short form', logo: 'clients/onepay.png', video: 'works/sample-4.mp4' },
      { name: 'Advanc', tag: 'Product teaser', overlay: 'Product teaser — Advanc', badge: 'Short form', logo: 'clients/advanc.png', video: 'works/sample-1.mp4' },
      { name: 'Windsurf', tag: 'Hook test', overlay: 'Hook test — Windsurf', badge: 'Short form', logo: 'clients/windsurf.png', video: 'works/sample-2.mp4' },
      { name: 'Inflect', tag: 'Story cut', overlay: 'Story cut — Inflect', badge: 'Short form', logo: 'clients/inflect.png', video: 'works/sample-3.mp4' },
      { name: 'IOPEX', tag: 'UGC edit', overlay: 'UGC edit — IOPEX', badge: 'Short form', logo: 'clients/iopex.png', video: 'works/sample-4.mp4' },
      { name: 'Synq', tag: 'Feature drop', overlay: 'Feature drop — Synq', badge: 'Short form', logo: 'clients/synq.png', video: 'works/sample-1.mp4' },
      { name: 'Base44', tag: 'Founder hook', overlay: 'Founder hook — Base44', badge: 'Short form', logo: 'clients/base44.png', video: 'works/sample-2.mp4' },
      { name: 'Asana', tag: 'Product tip', overlay: 'Product tip — Asana', badge: 'Short form', logo: 'clients/asana.png', video: 'works/sample-3.mp4' },
      { name: 'Agent Arcade', tag: 'Trailer cut', overlay: 'Trailer cut — Agent Arcade', badge: 'Short form', logo: 'clients/agent-arcade.png', video: 'works/sample-4.mp4' },
      { name: 'OnePay', tag: 'Offer ad', overlay: 'Offer ad — OnePay', badge: 'Short form', logo: 'clients/onepay.png', video: 'works/sample-1.mp4' },
      { name: 'Advanc', tag: 'Demo cut', overlay: 'Demo cut — Advanc', badge: 'Short form', logo: 'clients/advanc.png', video: 'works/sample-2.mp4' },
      { name: 'Windsurf', tag: 'Paid social', overlay: 'Paid social — Windsurf', badge: 'Short form', logo: 'clients/windsurf.png', video: 'works/sample-3.mp4' },
      { name: 'Inflect', tag: 'Announcement', overlay: 'Announcement — Inflect', badge: 'Short form', logo: 'clients/inflect.png', video: 'works/sample-4.mp4' },
      { name: 'Base44', tag: 'Growth ad', overlay: 'Growth ad — Base44', badge: 'Short form', logo: 'clients/base44.png', video: 'works/sample-3.mp4' },
      { name: 'Asana', tag: 'Retargeting', overlay: 'Retargeting — Asana', badge: 'Short form', logo: 'clients/asana.png', video: 'works/sample-4.mp4' },
    ],
    cta: {
      heading: 'Enquire about this',
      text: 'Tell me about your short form project — scope, budget, and deadline.',
      buttonLabel: 'Enquire about this',
      whatsappText: 'hey i need short form edits and my budget is : (your budget)',
    },
  },
  longForm: {
    eyebrow: 'Long form',
    title: 'Long form work.',
    intro: '60 to 180 seconds built to explain a complex product: the angle, the story, the motion, and the mix.',
    items: [
      { name: 'Advanc', tag: 'Launch film', overlay: 'Launch film — Advanc', badge: 'Long form', logo: 'clients/advanc.png', video: 'works/sample-2.mp4' },
      { name: 'Windsurf', tag: 'Product video', overlay: 'Product video — Windsurf', badge: 'Long form', logo: 'clients/windsurf.png', video: 'works/sample-3.mp4' },
      { name: 'Inflect', tag: 'Brand film', overlay: 'Brand film — Inflect', badge: 'Long form', logo: 'clients/inflect.png', video: 'works/sample-4.mp4' },
      { name: 'IOPEX', tag: 'Product explainer', overlay: 'Product explainer — IOPEX', badge: 'Long form', logo: 'clients/iopex.png', video: 'works/sample-1.mp4' },
      { name: 'Base44', tag: 'Platform film', overlay: 'Platform film — Base44', badge: 'Long form', logo: 'clients/base44.png', video: 'works/sample-2.mp4' },
      { name: 'Asana', tag: 'Feature story', overlay: 'Feature story — Asana', badge: 'Long form', logo: 'clients/asana.png', video: 'works/sample-3.mp4' },
      { name: 'Agent Arcade', tag: 'Brand film', overlay: 'Brand film — Agent Arcade', badge: 'Long form', logo: 'clients/agent-arcade.png', video: 'works/sample-4.mp4' },
      { name: 'OnePay', tag: 'Explainer', overlay: 'Explainer — OnePay', badge: 'Long form', logo: 'clients/onepay.png', video: 'works/sample-1.mp4' },
    ],
    cta: {
      heading: 'Enquire about this',
      text: 'Tell me about your long form project — scope, budget, and deadline.',
      buttonLabel: 'Enquire about this',
      whatsappText: 'hey i need long form edits and my budget is : (your budget)',
    },
  },
  about: {
    eyebrow: 'About us',
    title: 'We make complex products feel obvious.',
    intro: 'joggi.dsg is a motion design studio for tech companies. One team from research to sound design, building launch films that know what they want the audience to feel.',
    approachTitle: 'Less noise. More signal.',
    approachLead: 'A launch film should do more than look good.',
    approachText: 'It should give the audience a way in: a clear idea, a memorable rhythm, and a product they can understand before the second watch. We work as one partner from first frame to final mix.',
    steps: ['Find the angle', 'Build the story', 'Shape the motion', 'Finish the sound'],
    linkLabel: 'See our work',
    linkHref: '#/long-form',
    quote: "Bring us the hard part. We'll make it clear.",
    quoteCite: 'joggi.dsg / motion design',
    standardTitle: 'Senior craft, no hand-offs.',
    standardText: 'You talk to the people making the film. Research, scripting, storyboards, motion, and sound stay in one room, so nothing gets lost in translation.',
    standardLinkLabel: 'Book a call',
    standardLinkHref: '#/book',
    stats: [
      { from: '11.1', to: '64.9', label: 'Views created across branded, organic, and inorganic launches.' },
      { from: '2.0', to: '480.0', label: 'Impressions generated for product and feature launches.' },
      { from: '1.4', to: '12.5', label: 'Organic views earned from films built for the feed.' },
      { from: '3.0', to: '98.0', label: 'Seconds of animation shipped from first frame to final mix.' },
    ],
  },
  book: {
    eyebrow: 'Book a call',
    title: "Let's talk about your launch.",
    intro: "Pick a time below for a free 30-minute discovery call. We'll talk through your product, your timeline, and the story worth telling.",
    sideTitle: 'Prefer to message first?',
    sideText: "Send a note on WhatsApp or email and we'll reply within one business day.",
    bullets: [
      { value: '30 min', label: 'Discovery call' },
      { value: '48 h', label: 'Proposal after the call' },
      { value: '2-4 wk', label: 'Typical launch film delivery' },
    ],
  },
  contact: {
    eyebrow: 'Start a project',
    title: 'Have a project in mind?',
    titleAccent: "Let's get in touch!",
  },
}

export function mergeContent(base: SiteContent, patch: unknown): SiteContent {
  if (!patch || typeof patch !== 'object') return base
  const out: Record<string, unknown> = { ...(base as unknown as Record<string, unknown>) }
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    const current = out[key]
    if (Array.isArray(value)) out[key] = value
    else if (value && typeof value === 'object' && current && typeof current === 'object' && !Array.isArray(current)) {
      out[key] = mergeContent(current as SiteContent, value)
    } else if (value !== undefined) out[key] = value
  }
  return out as unknown as SiteContent
}