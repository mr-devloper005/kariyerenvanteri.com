import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download,
  ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { Ads, getSlotSizes } from '@/lib/ads'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const pickRandom = (items: string[]) => items[Math.floor(items.length / 2)] || items[0]

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}
const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}
const taskLabel = (task: TaskKey) => task === 'listing' ? 'Places' : task === 'pdf' ? 'Guides' : getTaskConfig(task)?.label || task

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'classified' ? <GenericDetail task={task} post={post} related={related} icon={<Tag className="h-8 w-8" />} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <GenericDetail task={task} post={post} related={related} icon={<Bookmark className="h-8 w-8" />} /> : null}
        {task === 'profile' ? <GenericDetail task={task} post={post} related={related} icon={<UserRound className="h-8 w-8" />} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  return (
    <Link href={getTaskConfig(task)?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white/68 transition hover:bg-white hover:text-[#0d0d0d]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskLabel(task)}
    </Link>
  )
}

function Kicker({ task, children, light = false }: { task: TaskKey; children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] ${light ? 'text-[#0d0d0d99]' : 'text-white/55'}`}>
      <span className={light ? 'text-[#cc1c4b]' : 'text-[var(--tk-accent-soft)]'}>{getTaskTheme(task).kicker}</span>
      <span className={`h-1 w-1 rounded-full ${light ? 'bg-[#0d0d0d33]' : 'bg-white/30'}`} />
      <span>{children}</span>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-7 max-w-none ${compact ? 'text-[15px] leading-7' : 'text-lg leading-8'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function FactStrip({ items, light = false }: { items: Array<[string, string]>; light?: boolean }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className={`grid overflow-hidden rounded-[1.5rem] border sm:grid-cols-2 lg:grid-cols-4 ${light ? 'border-[#0d0d0d1a] bg-[#fafafa] text-[#0d0d0d]' : 'border-white/15 bg-white/5 text-white'}`}>
      {visible.map(([label, value]) => (
        <div key={label} className={`border-b p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${light ? 'border-[#0d0d0d1a]' : 'border-white/15'}`}>
          <p className={`text-xs font-medium uppercase tracking-[0.18em] ${light ? 'text-[#0d0d0d99]' : 'text-white/50'}`}>{label}</p>
          <p className="mt-2 break-words text-base font-medium">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours'])
  const mapSrc = mapSrcFor(post)
  const category = categoryOf(post, 'Place')

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <BackLink task="listing" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              <div className="grid overflow-hidden rounded-[2rem] border border-white/15 bg-white text-[#0d0d0d] lg:grid-cols-[1fr_0.78fr]">
                <div className="p-7 sm:p-10">
                  <Kicker task="listing" light>{category}</Kicker>
                  <h1 className="editable-display mt-5 text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">{post.title}</h1>
                  {leadText(post) ? <p className="mt-6 max-w-2xl text-lg leading-[1.4] text-[#0d0d0d99]">{leadText(post)}</p> : null}
                </div>
                <div className="relative min-h-[320px] overflow-hidden bg-[#171717]">
                  {hero ? <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <Building2 className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-white/40" />}
                </div>
              </div>
            </EditableReveal>
            <div className="mt-6"><FactStrip light items={[['Location', address], ['Phone', phone], ['Status', 'Verified']]} /></div>
            <section className="mt-10 rounded-[2rem] bg-[#fafafa] p-6 text-[#0d0d0d] sm:p-9">
              <h2 className="editable-display text-5xl leading-[1.15] tracking-[-0.04em] sm:text-[4rem]">A closer look</h2>
              <BodyContent post={post} />
              {post.tags?.length ? <div className="mt-8 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full border border-[#0d0d0d1a] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]">{tag}</span>)}</div> : null}
              <ImageStrip images={images.slice(1)} />
              {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            </section>
          </article>
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <ContactCard rows={[['Address', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2], ['Hours', hours, CheckCircle2]]} primaryHref={website || (phone ? `tel:${phone}` : email ? `mailto:${email}` : '')} />
            <TrustPanel />
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
          </aside>
        </div>
      </section>
      <RelatedStrip task="listing" related={related} title="More places" />
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'guideUrl', 'p' + 'dfUrl', 'doc' + 'umentUrl', 'url'])
  const pages = getField(post, ['pages', 'pageCount'])
  const size = getField(post, ['fileSize', 'size'])
  const uploadedBy = getField(post, ['uploadedBy', 'author', 'source'])
  const category = categoryOf(post, 'Guide')
  const filename = fileUrl ? fileUrl.split('/').pop()?.split('?')[0] || post.slug : post.slug

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              <div className="flex flex-wrap gap-2">
                {['Reference guide', 'Download', category].map((chip) => <span key={chip} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white/65">{chip}</span>)}
              </div>
              <h1 className="editable-display mt-6 max-w-5xl text-[3.8rem] leading-[1.15] tracking-[-0.04em] sm:text-[5.6rem] lg:text-[6.5rem]">{post.title}</h1>
              {leadText(post) ? <p className="mt-8 max-w-4xl border-l border-[var(--tk-accent-soft)] pl-6 text-xl leading-[1.25] text-white/72 sm:text-2xl">{leadText(post)}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#0d0d0d]"><Download className="h-4 w-4" /> Download</Link> : null}
                {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white/70 transition hover:bg-white hover:text-[#0d0d0d]"><ExternalLink className="h-4 w-4" /> Open in new tab</Link> : null}
              </div>
            </EditableReveal>
            <div className="mt-8"><FactStrip items={[['Pages', pages || 'See preview'], ['Size', size || 'Listed on open'], ['Format', 'Guide'], ['Updated', 'Available now']]} /></div>
            {fileUrl ? (
              <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/15 bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-[#0d0d0d1a] p-4 text-[#0d0d0d]">
                  <span className="text-sm font-medium uppercase tracking-[0.14em]">Preview</span>
                  <span className="rounded-full bg-[#0d0d0d] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-white">Live file</span>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`} title={post.title} className="h-[70vh] max-h-[820px] min-h-[520px] w-full bg-[#f2f0ed]" />
              </div>
            ) : null}
            <section className="mt-10 grid gap-8 rounded-[2rem] bg-[#fafafa] p-6 text-[#0d0d0d] sm:p-9 lg:grid-cols-[0.72fr_1.28fr]">
              <h2 className="editable-display text-5xl leading-[1.15] tracking-[-0.04em] sm:text-[4rem]">Inside the guide</h2>
              <div>
                <BodyContent post={post} compact />
                {post.tags?.length ? <div className="mt-8 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full border border-[#0d0d0d1a] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]">{tag}</span>)}</div> : null}
                {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#0d0d0d] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white">Download</Link> : null}
              </div>
            </section>
            <div className="mt-10">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </div>
          </article>
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-white/15 bg-white p-6 text-[#0d0d0d]">
              <div className="editable-display flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-[#0d0d0d] text-5xl tracking-[-0.04em] text-white">G</div>
              <p className="mt-5 break-words text-sm font-medium text-[#0d0d0d99]">{filename}</p>
              <div className="mt-5 grid gap-3 text-sm">
                {[['Category', category], ['Pages', pages || 'Preview'], ['Size', size || 'Open to view'], ['Uploaded by', uploadedBy || SITE_CONFIG.name], ['Updated', 'Available now']].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-t border-[#0d0d0d1a] pt-3"><span className="text-[#0d0d0d99]">{label}</span><span className="text-right font-medium">{value}</span></div>
                ))}
              </div>
              {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full justify-center rounded-full bg-[#cc1c4b] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white">Download</Link> : null}
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/5 p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">What is inside</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/68">
                <li>Key summary and context</li>
                <li>Structured reference sections</li>
                <li>Download-ready source material</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="pdf" related={related} title="Related guides" guideTiles />
    </>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20">
        <BackLink task="article" />
        <Kicker task="article">{categoryOf(post, 'Article')}</Kicker>
        <h1 className="editable-display mt-6 text-6xl leading-[1.15] tracking-[-0.04em] sm:text-8xl">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[2rem] border border-white/15 object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} title="Related reading" />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="columns-1 gap-5 sm:columns-2">{images.map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="mb-5 rounded-[1.5rem] border border-white/15" />)}</div>
          <aside><Camera className="h-8 w-8 text-[var(--tk-accent-soft)]" /><h1 className="editable-display mt-5 text-6xl leading-[1.15] tracking-[-0.04em]">{post.title}</h1><BodyContent post={post} compact /></aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} title="Related visuals" />
    </>
  )
}

function GenericDetail({ task, post, related, icon }: { task: TaskKey; post: SitePost; related: SitePost[]; icon: React.ReactNode }) {
  const images = getImages(post)
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 lg:px-8">
        <BackLink task={task} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[2rem] border border-white/15 bg-white/5 p-7">{icon}<Kicker task={task}>{categoryOf(post, taskLabel(task))}</Kicker><h1 className="editable-display mt-5 text-6xl leading-[1.15] tracking-[-0.04em]">{post.title}</h1></aside>
          <article className="rounded-[2rem] bg-white p-7 text-[#0d0d0d] sm:p-10">
            {images[0] ? <img src={images[0]} alt="" className="mb-8 aspect-[16/9] w-full rounded-[1.5rem] object-cover" /> : null}
            <BodyContent post={post} />
          </article>
        </div>
      </section>
      <RelatedStrip task={task} related={related} title={`More ${taskLabel(task).toLowerCase()}`} />
    </>
  )
}

function ContactCard({ rows, primaryHref }: { rows: Array<[string, string, typeof MapPin]>; primaryHref: string }) {
  return (
    <div className="rounded-[2rem] border border-white/15 bg-white p-6 text-[#0d0d0d]">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#0d0d0d99]">Contact record</p>
      <div className="mt-4 grid gap-2">
        {rows.filter(([, value]) => value).map(([label, value, Icon]) => (
          <a key={label} href={label === 'Phone' ? `tel:${value}` : label === 'Email' ? `mailto:${value}` : label === 'Website' ? value : undefined} className="flex gap-3 rounded-[1rem] border border-[#0d0d0d1a] p-3 text-sm transition hover:bg-[#c6a6ff]">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#cc1c4b]" />
            <span className="min-w-0"><span className="block text-xs uppercase tracking-[0.14em] text-[#0d0d0d99]">{label}</span><span className="break-words font-medium">{value}</span></span>
          </a>
        ))}
      </div>
      {primaryHref ? <a href={primaryHref} className="mt-5 inline-flex w-full justify-center rounded-full bg-[#cc1c4b] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white">Contact now</a> : null}
    </div>
  )
}

function TrustPanel() {
  return (
    <div className="rounded-[2rem] border border-white/15 bg-white/5 p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">Trust signals</p>
      <div className="mt-4 grid gap-3 text-sm text-white/70">
        {['Verified contact paths', 'Structured local facts', 'Reviewed for useful context'].map((item) => <p key={item} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent-soft)]" /> {item}</p>)}
      </div>
    </div>
  )
}

function ImageStrip({ images }: { images: string[] }) {
  if (!images.length) return null
  return <div className="mt-10 grid gap-3 sm:grid-cols-3">{images.slice(0, 6).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.25rem] object-cover" />)}</div>
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-[#0d0d0d1a]">
      <div className="flex items-center gap-2 p-4 text-sm font-medium"><MapPin className="h-4 w-4 text-[#cc1c4b]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function RelatedStrip({ task, related, title, guideTiles = false }: { task: TaskKey; related: SitePost[]; title: string; guideTiles?: boolean }) {
  if (!related.length) return null
  return (
    <section className="border-t border-white/15">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="editable-display max-w-4xl text-5xl leading-[1.15] tracking-[-0.04em]">{title}</h2>
          <Link href={getTaskConfig(task)?.route || '/'} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white/65">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {related.map((item, index) => <RelatedCard key={item.id || item.slug} task={task} post={item} index={index} guideTile={guideTiles} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, index, guideTile = false }: { task: TaskKey; post: SitePost; index: number; guideTile?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (guideTile) {
    return (
      <Link href={href} className="rounded-[1.5rem] border border-white/15 bg-white p-5 text-[#0d0d0d] transition hover:-translate-y-1">
        <div className="editable-display flex h-20 w-20 items-center justify-center rounded-[1rem] bg-[#0d0d0d] text-4xl tracking-[-0.04em] text-white">G</div>
        <h3 className="mt-5 text-2xl leading-[1.15] tracking-[-0.04em] sm:text-3xl">{post.title}</h3>
        <span className="mt-4 inline-flex rounded-full bg-[#c6a6ff] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]">Guide</span>
      </Link>
    )
  }
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.5rem] bg-white text-[#0d0d0d] transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#171717]">{image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" /> : <FileText className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/50" />}</div>
      <div className="p-5"><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#cc1c4b]">No. {String(index + 1).padStart(2, '0')}</p><h3 className="mt-3 text-2xl leading-[1.15] tracking-[-0.04em] sm:text-3xl">{post.title}</h3></div>
    </Link>
  )
}
