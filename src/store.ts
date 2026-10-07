import { defaultContent, mergeContent, type SiteContent } from './content'
import { firebaseConfig } from './firebaseConfig'

export async function loadContent(): Promise<SiteContent> {
  try {
    const base = firebaseConfig.databaseURL?.replace(/\/$/, '')
    if (!base) return defaultContent
    const response = await fetch(`${base}/site.json`, { headers: { Accept: 'application/json' } })
    if (!response.ok) return defaultContent
    const data = (await response.json()) as unknown
    if (!data || typeof data !== 'object') return defaultContent
    return mergeContent(defaultContent, data as Partial<SiteContent>)
  } catch {
    return defaultContent
  }
}