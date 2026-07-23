'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
const COMMENT_KEY_PREFIX = 'slot4:article-comments:'

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(COMMENT_KEY_PREFIX)) continue
    const articleSlug = key.replace(COMMENT_KEY_PREFIX, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // Ignore corrupted local comment records.
    }
  }
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) => [item.name, item.email, item.comment, item.articleTitle, item.articleSlug].filter(Boolean).some((value) => String(value).toLowerCase().includes(term)))
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  function refreshComments() {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main className="bg-[#0d0d0d] text-white">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <EditableReveal>
            <div className="grid gap-8 rounded-[2rem] border border-white/15 bg-white/5 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/55">
                  <MessageSquare className="h-4 w-4" /> Local comments
                </p>
                <h1 className="editable-display mt-5 text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">Comments</h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">Review comments saved in this browser from article pages.</p>
              </div>
              <div className="self-end rounded-[2rem] bg-white p-5 text-[#0d0d0d]">
                <label className="flex items-center gap-3 rounded-full bg-[#f2f0ed] px-4 py-3">
                  <Search className="h-5 w-5 text-[#0d0d0d99]" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Search comments"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#0d0d0d99]"
                  />
                </label>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[#0d0d0d99]">{filtered.length} comment{filtered.length === 1 ? '' : 's'} found</p>
                  <button type="button" className="rounded-full bg-[#0d0d0d] px-5 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white" onClick={refreshComments}>Refresh</button>
                </div>
              </div>
            </div>
          </EditableReveal>

          {visibleComments.length ? (
            <section className="mt-8 grid gap-4">
              {visibleComments.map((item, index) => (
                <EditableReveal key={`${item.articleSlug}-${item.id}`} index={index}>
                  <article className="rounded-[1.5rem] bg-white p-5 text-[#0d0d0d]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#0d0d0d99]">Saved comment</p>
                      </div>
                      {item.articleSlug ? (
                        <Link href={`/article/${item.articleSlug}`} className="inline-flex items-center gap-2 rounded-full bg-[#c6a6ff] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em]">
                          Open article <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                    {item.articleTitle ? <p className="mt-5 text-sm font-medium uppercase tracking-[0.14em] text-[#cc1c4b]">{item.articleTitle}</p> : null}
                    <p className="mt-3 text-sm leading-7 text-[#0d0d0d99]">{item.comment}</p>
                  </article>
                </EditableReveal>
              ))}
            </section>
          ) : (
            <section className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center">
              <h2 className="editable-display text-4xl tracking-[-0.04em]">No comments yet</h2>
              <p className="mt-3 text-sm text-white/60">Add a comment on any article page and it will appear here.</p>
            </section>
          )}

          {filtered.length > COMMENTS_PER_PAGE ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/15 bg-white/5 p-4 text-sm text-white/65">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button type="button" className="rounded-full border border-white/15 px-4 py-2 font-medium disabled:opacity-40" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
                <button type="button" className="rounded-full border border-white/15 px-4 py-2 font-medium disabled:opacity-40" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
