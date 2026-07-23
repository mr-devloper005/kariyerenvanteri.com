import Link from 'next/link'
import {
  ArrowRight, Bookmark, Building2, Download, FileText, Image as ImageIcon,
  MapPin, Megaphone, Search, ShieldCheck, UserRound,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

function displayLabel(task: TaskKey) {
  if (task === 'listing') return 'Places'
  if (task === 'pdf') return 'Guides'
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
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

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestPostImages(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function SectionHeading({ eyebrow, title, body, dark = false }: { eyebrow: string; title: string; body?: string; dark?: boolean }) {
  return (
    <EditableReveal>
      <div className="max-w-4xl">
        <p className={`text-xs font-medium uppercase tracking-[0.22em] ${dark ? 'text-white/55' : 'text-[#0d0d0d99]'}`}>{eyebrow}</p>
        <h2 className={`editable-display mt-4 text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[4.75rem] ${dark ? 'text-white' : 'text-[#0d0d0d]'}`}>{title}</h2>
        {body ? <p className={`mt-5 max-w-2xl text-base leading-[1.45] ${dark ? 'text-white/65' : 'text-[#0d0d0d99]'}`}>{body}</p> : null}
      </div>
    </EditableReveal>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover ${SITE_CONFIG.name}`
  const featured = pool[0]
  const first = heroImages[0]
  const second = heroImages[1] || first

  return (
    <section className="bg-[#0d0d0d] text-white">
      <div className={`${container} py-10 sm:py-14 lg:py-16`}>
        <div className="grid min-h-[560px] gap-0 lg:grid-cols-[0.75fr_1.5fr_0.75fr]">
          <EditableReveal className="relative order-2 overflow-hidden rounded-b-[2rem] bg-white/5 lg:order-1 lg:col-span-1 lg:rounded-l-[2rem] lg:rounded-br-none">
            {first ? <img src={first} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" /> : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(13,13,13,0.55))]" />
          </EditableReveal>

          <EditableReveal className="order-1 flex flex-col justify-between border border-white/15 p-6 sm:p-8 lg:order-2 lg:p-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">{pagesContent.home.hero.badge}</p>
              <h1 className="editable-display mt-5 max-w-3xl text-[3.8rem] leading-[1.15] tracking-[-0.04em] sm:text-[5.25rem] lg:text-[5.9rem]">{heroTitle}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-[1.35] text-white/70">{pagesContent.home.hero.description}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <form action="/search" className="flex min-h-14 overflow-hidden rounded-full bg-white text-[#0d0d0d]">
                <div className="flex flex-1 items-center gap-3 px-5">
                  <Search className="h-5 w-5 text-[#0d0d0d99]" />
                  <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#0d0d0d99]" />
                </div>
                <button className="bg-[var(--slot4-accent)] px-6 text-sm font-medium uppercase tracking-[0.12em] text-white">Search</button>
              </form>
              <Link href={primaryRoute} className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-6 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition duration-500 hover:bg-white hover:text-[#0d0d0d]">
                Browse {displayLabel(primaryTask)} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          <EditableReveal className="relative order-3 overflow-hidden rounded-t-[2rem] bg-white/5 lg:rounded-r-[2rem] lg:rounded-tl-none">
            {second ? <img src={second} alt="" className="absolute inset-0 h-full w-full object-cover opacity-82" /> : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.05),rgba(13,13,13,0.62))]" />
            {featured ? (
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">Latest</p>
                <p className="mt-2 text-2xl leading-[1.15] tracking-[-0.04em]">{featured.title}</p>
              </div>
            ) : null}
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({}: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  if (!categories.length) return null
  return (
    <section className="bg-[#fafafa] text-[#0d0d0d]">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeading eyebrow={pagesContent.home.intro.badge} title={pagesContent.home.intro.title} body={pagesContent.home.intro.paragraphs[0]} />
          <EditableReveal className="grid gap-4 sm:grid-cols-2">
            {pagesContent.home.intro.sidePoints.map((point, index) => (
              <div key={point} className="rounded-[1.5rem] border border-[#0d0d0d1a] bg-[#0d0d0d08] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#cc1c4b]">0{index + 1}</p>
                <p className="mt-4 text-lg leading-[1.2]">{point}</p>
              </div>
            ))}
          </EditableReveal>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((task, index) => {
            const Icon = taskIcon[task.key] || FileText
            return (
              <EditableReveal key={task.key} index={index}>
                <Link href={task.route} className="group flex min-h-48 flex-col justify-between rounded-[1.5rem] bg-[#0d0d0d] p-5 text-white transition duration-500 hover:bg-[var(--slot4-accent)]">
                  <Icon className="h-7 w-7 text-white/70" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">Explore</p>
                    <h3 className="editable-display mt-2 text-3xl leading-[1.15] tracking-[-0.04em]">{displayLabel(task.key)}</h3>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ActivityCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <EditableReveal index={index}>
      <Link href={href} className="group block overflow-hidden rounded-[1.5rem] bg-[#fafafa] text-[#0d0d0d] transition duration-500 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#171717]">
          <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" loading="lazy" />
          {category ? <span className="absolute left-4 top-4 rounded-full bg-[#c6a6ff] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#0d0d0d]">{category}</span> : null}
        </div>
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#cc1c4b]">No. {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 text-3xl leading-[1.15] tracking-[-0.04em]">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#0d0d0d99]">{getExcerpt(post, 140)}</p>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 7)
  if (!activity.length) return null
  const [feature, ...rest] = activity
  return (
    <section className="bg-[#0d0d0d] text-white">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <SectionHeading dark eyebrow="Featured index" title="New entries with the strongest signal." body={`Latest useful records from ${SITE_CONFIG.name}, arranged with the image-led rhythm of the reference.`} />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <EditableReveal>
            <Link href={postHref(primaryTask, feature, primaryRoute)} className="group block overflow-hidden rounded-[2rem] bg-white text-[#0d0d0d]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#171717]">
                <img src={getEditablePostImage(feature)} alt={feature.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#cc1c4b]">Lead</p>
                <h3 className="mt-3 text-5xl leading-[1.15] tracking-[-0.04em] sm:text-[4.5rem]">{feature.title}</h3>
                <p className="mt-5 max-w-2xl text-base leading-[1.45] text-[#0d0d0d99]">{getExcerpt(feature, 180)}</p>
              </div>
            </Link>
          </EditableReveal>
          <div className="grid gap-4">
            {rest.slice(0, 4).map((post, index) => (
              <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((section) => section.posts.length).slice(0, 2)
  if (!visible.length) return null

  return (
    <>
      <section className="bg-[#fafafa] text-[#0d0d0d]">
          <div className={`${container} py-14 sm:py-16`}>
          <EditableReveal>
            <div className="grid gap-4 rounded-[2rem] border border-[#0d0d0d1a] p-6 sm:grid-cols-3 sm:p-8">
              {([
                ['Records indexed', posts.length || 0, MapPin],
                ['Active sections', SITE_CONFIG.tasks.filter((task) => task.enabled).length, ShieldCheck],
                ['Guide-ready actions', visible.reduce((sum, section) => sum + section.posts.length, 0), Download],
              ] as Array<[string, number, ComponentType<{ className?: string }>]>).map(([label, value, Icon]) => (
                <div key={String(label)} className="border-b border-[#0d0d0d1a] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5 last:border-0">
                  <Icon className="h-6 w-6 text-[#cc1c4b]" />
                  <p className="editable-display mt-4 text-6xl leading-[1.15] tracking-[-0.04em]">{value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[#0d0d0d99]">{label}</p>
                </div>
              ))}
            </div>
          </EditableReveal>
        </div>
      </section>
      {visible.map((section, sectionIndex) => (
        <section key={section.key} className={sectionIndex % 2 === 0 ? 'bg-[#fafafa] text-[#0d0d0d]' : 'bg-[#0d0d0d] text-white'}>
          <div className={`${container} py-16 sm:py-20`}>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                dark={sectionIndex % 2 === 1}
                eyebrow={sectionIndex === 0 ? 'Fresh shelf' : 'More to explore'}
                title={sectionIndex === 0 ? 'Recently added for quick scanning.' : 'Keep moving through the index.'}
              />
              <Link href={section.href || primaryRoute} className="inline-flex w-fit items-center gap-3 rounded-full border border-current/20 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] transition duration-500 hover:bg-current hover:text-[var(--slot4-page-bg)]">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.posts.slice(0, 8).map((post, index) => (
                <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#fafafa] text-[#0d0d0d]">
      <div className={`${container} grid gap-5 py-16 sm:py-20 lg:grid-cols-2`}>
        {[
          { title: 'Submit a place', body: 'Add a useful local record with practical facts and contact paths.', href: '/create', label: 'Submit' },
          { title: 'Ask for help', body: 'Send corrections, partnerships, guide ideas, or coverage requests.', href: '/contact', label: 'Contact' },
        ].map((item, index) => (
          <EditableReveal key={item.title} index={index}>
            <Link href={item.href} className="group relative block min-h-[340px] overflow-hidden rounded-[2rem] bg-[#0d0d0d] p-7 text-white sm:p-9">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,var(--slot4-accent),transparent_28%),radial-gradient(circle_at_80%_80%,var(--slot4-blue),transparent_30%)]" />
              <div className="relative flex h-full min-h-[290px] flex-col justify-between">
                <ArrowRight className="h-8 w-8 text-white/50 transition duration-500 group-hover:translate-x-2" />
                <div>
                  <h2 className="editable-display text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl">{item.title}</h2>
                  <p className="mt-5 max-w-md text-base leading-[1.4] text-white/68">{item.body}</p>
                  <span className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#0d0d0d]">{item.label}</span>
                </div>
              </div>
            </Link>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}
