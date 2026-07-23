import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/search', title: pagesContent.search.metadata.title, description: pagesContent.search.metadata.description })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const labelFor = (task: TaskKey | null, fallback = 'Post') => task === 'listing' ? 'Places' : task === 'pdf' ? 'Guides' : fallback
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText((typeof post.summary === 'string' && post.summary) || compactRaw(content.description) || compactRaw(content.excerpt) || compactRaw(content.body) || '')
}
const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : ''].some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = labelFor(task, SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post')
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[1.5rem] bg-white text-[#0d0d0d] transition duration-500 hover:-translate-y-1 ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-[#171717] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.045]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[#c6a6ff] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#0d0d0d]">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="rounded-full bg-[#0d0d0d] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white">{taskLabel}</span> : null}
        <h2 className="editable-display mt-4 text-4xl leading-[1.15] tracking-[-0.04em]">{post.title}</h2>
        {summary ? <p className="mt-4 text-sm leading-7 text-[#0d0d0d99]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0d0d0d] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#0d0d0d] text-white">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[2rem] border border-white/15 bg-white/5 p-6 md:grid-cols-[0.8fr_1.2fr] lg:p-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">{pagesContent.search.hero.badge}</p>
              <h1 className="editable-display mt-5 text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/68">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end rounded-[2rem] bg-white p-4 text-[#0d0d0d] sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[#0d0d0d1a] bg-[#f2f0ed] px-4 py-3">
                <Search className="h-5 w-5 opacity-45" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-current/35" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-full border border-[#0d0d0d1a] bg-[#f2f0ed] px-4 py-3">
                  <Filter className="h-4 w-4 opacity-45" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-current/35" />
                </label>
                <select name="task" defaultValue={task} className="rounded-full border border-[#0d0d0d1a] bg-[#f2f0ed] px-4 py-3 text-sm font-medium outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{labelFor(item.key, item.label)}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#cc1c4b] px-6 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#0d0d0d]" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">{results.length} results</p>
              <h2 className="editable-display mt-2 text-5xl leading-[1.15] tracking-[-0.04em]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white/70">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <EditableReveal key={post.id || post.slug} index={index}><SearchResultCard post={post} index={index} /></EditableReveal>)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center">
              <p className="editable-display text-4xl tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm text-white/60">Try a different keyword, content type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
