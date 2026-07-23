'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const staticLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
          <span className="editable-display max-w-[210px] truncate text-2xl leading-none tracking-[-0.04em] sm:max-w-[300px]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-2 lg:flex">
          {staticLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-medium uppercase tracking-[0.16em] transition duration-500 ${
                  active ? 'bg-white text-[#0d0d0d]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/search" aria-label="Search" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition duration-500 hover:bg-white hover:text-[#0d0d0d]">
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--editable-cta-text)] transition duration-500 hover:bg-white hover:text-[#0d0d0d] sm:inline-flex">
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button type="button" onClick={logout} className="hidden rounded-full border border-white/15 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white/75 transition duration-500 hover:bg-white hover:text-[#0d0d0d] sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white/75 transition duration-500 hover:bg-white hover:text-[#0d0d0d] sm:inline-flex">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--editable-cta-text)] transition duration-500 hover:bg-white hover:text-[#0d0d0d] sm:inline-flex">
                <UserPlus className="h-4 w-4" /> Get started
              </Link>
            </>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/15 bg-[#0d0d0d] px-5 py-5 lg:hidden">
          <div className="grid gap-2">
            {[...staticLinks, ...(session ? [{ label: 'Submit', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] ${active ? 'bg-white text-[#0d0d0d]' : 'text-white/75 hover:bg-white/10'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? <button type="button" onClick={logout} className="rounded-full px-5 py-3 text-left text-sm font-medium uppercase tracking-[0.14em] text-white/75 hover:bg-white/10">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
