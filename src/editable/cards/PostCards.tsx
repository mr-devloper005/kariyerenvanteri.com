import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] bg-[#0d0d0d] text-white">
      <div className="relative min-h-[560px] p-6 sm:p-8 lg:min-h-[680px]">
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover opacity-70 ${dc.motion.zoom}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.02)_0%,rgba(13,13,13,0.88)_100%)]" />
        <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-end lg:min-h-[620px]">
          <span className="w-fit rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[#0d0d0d]">{label}</span>
          <h3 className="mt-5 max-w-4xl text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-base leading-[1.35] text-white/72">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#0d0d0d]">
            Open <ArrowRight className="h-4 w-4 transition duration-500 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block w-[260px] shrink-0 overflow-hidden rounded-[1.5rem] bg-[#fafafa] text-[#0d0d0d] transition duration-500 hover:-translate-y-1 sm:w-[320px]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#171717]">
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
        <span className="absolute left-4 top-4 rounded-full bg-[#0d0d0d] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#cc1c4b]">{getEditableCategory(post)}</p>
        <h3 className="mt-3 text-3xl leading-[1.15] tracking-[-0.04em]">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#0d0d0d99]">{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.5rem] border border-[#0d0d0d1a] bg-[#fafafa] p-5 text-[#0d0d0d] transition duration-500 hover:bg-[#c6a6ff]">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-xs font-medium text-white">{String(index + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#0d0d0d99]"><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="mt-2 text-2xl leading-[1.15] tracking-[-0.04em]">{post.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#0d0d0d99]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[1.5rem] border border-[#0d0d0d1a] bg-[#fafafa] text-[#0d0d0d] transition duration-500 hover:-translate-y-1 sm:grid-cols-[280px_minmax(0,1fr)]">
      <div className="relative aspect-[16/12] overflow-hidden bg-[#171717] sm:aspect-auto sm:min-h-[220px]">
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#cc1c4b]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 text-4xl leading-[1.15] tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#0d0d0d99]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0d0d0d] px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white">Open <ArrowRight className="h-4 w-4 transition duration-500 group-hover:translate-x-1" /></span>
      </div>
    </Link>
  )
}
