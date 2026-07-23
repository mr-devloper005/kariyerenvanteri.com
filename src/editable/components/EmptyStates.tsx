import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh entries will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2rem] border border-white/15 bg-white/5 p-8 text-center text-white', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0d0d0d]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-5 text-5xl leading-[1.15] tracking-[-0.04em]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#cc1c4b] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#0d0d0d]">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The layout stays ready even when the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
