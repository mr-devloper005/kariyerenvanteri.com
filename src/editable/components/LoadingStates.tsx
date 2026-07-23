import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[1.5rem] bg-white/12', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] bg-[#0d0d0d] px-5 py-14 text-white sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">{label}</p>
      <PulseBlock className="mt-6 h-20 w-3/4 max-w-5xl" />
      <PulseBlock className="mt-4 h-6 w-2/3 max-w-2xl" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[1.5rem] border border-white/15 bg-white/5 p-5">
            <PulseBlock className="h-56 w-full" />
            <PulseBlock className="mt-5 h-8 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[1.5rem] border border-white/15 bg-white/5 p-4">
          <PulseBlock className="h-48 w-full" />
          <PulseBlock className="mt-4 h-7 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-32 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 bg-[#0d0d0d] px-5 py-14 text-white sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-96 w-full rounded-[2rem]" />
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">{label}</p>
        <PulseBlock className="mt-6 h-24 w-4/5" />
        <PulseBlock className="mt-6 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
