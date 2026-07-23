import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const FONT_DISPLAY = "'Tilt Warp', 'Host Grotesk', system-ui, sans-serif"
const FONT_BODY = "'Host Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const base = {
  dark: true,
  fontDisplay: FONT_DISPLAY,
  fontBody: FONT_BODY,
  bg: '#0d0d0d',
  surface: '#fafafa',
  raised: '#171717',
  text: '#fafafa',
  muted: '#fafafabf',
  line: '#fafafa26',
  accent: '#cc1c4b',
  accentSoft: '#c6a6ff',
  onAccent: '#fafafa',
  glow: 'rgba(204,28,75,0.2)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading', note: 'Editorial notes and useful context for deeper browsing.' },
  listing: { ...base, kicker: 'Places', note: 'Verified local records with practical ways to connect.' },
  classified: { ...base, kicker: 'Board', note: 'Fast-moving posts arranged for quick decisions.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual stories with strong crops and focused context.' },
  sbm: { ...base, kicker: 'Saved', note: 'Curated links and resources worth keeping close.' },
  pdf: { ...base, kicker: 'Guides', note: 'Downloadable guides and reports presented as a working library.' },
  profile: { ...base, kicker: 'Profiles', note: 'People and organizations with clear credibility cues.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
