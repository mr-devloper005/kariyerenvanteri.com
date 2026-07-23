'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function displayLabel(key: string, fallback: string) {
  if (key === 'listing') return 'Places'
  if (key === 'pdf') return 'Guides'
  return fallback
}

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <section className="border-y border-white/15">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">Publish with confidence</p>
              <h2 className="editable-display mt-3 max-w-3xl text-4xl leading-[1.15] tracking-[-0.04em] sm:text-5xl">
              Share a useful place, guide, or local resource.
            </h2>
          </div>
          <Link href={session ? '/create' : '/signup'} className="inline-flex self-end rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition duration-500 hover:bg-white hover:text-[#0d0d0d]">
            {session ? 'Submit' : 'Get started'}
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="editable-display text-3xl leading-none tracking-[-0.04em]">{SITE_CONFIG.name}</Link>
          <p className="mt-5 max-w-md text-base leading-[1.45] text-white/65">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          
        </div>

        <FooterColumn title="Directory" links={taskLinks.map((task) => ({ label: displayLabel(task.key, task.label), href: task.route }))} />
        <FooterColumn title="Resources" links={[{ label: 'Search', href: '/search' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }]} />
        <FooterColumn title="Account" links={session ? [{ label: 'Submit', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }]} />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">Note</p>
          <p className="mt-4 text-sm leading-6 text-white/60">{globalContent.footer?.bottomNote || 'Built for useful discovery.'}</p>
          {session ? <button type="button" onClick={logout} className="mt-4 text-sm font-medium uppercase tracking-[0.12em] text-white/70 transition hover:text-white">Logout</button> : null}
        </div>
      </div>
      <div className="border-t border-white/15 px-5 py-5 text-center text-xs font-medium uppercase tracking-[0.14em] text-white/45">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">{title}</p>
      <div className="mt-4 grid gap-2">
        {links.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="inline-flex items-center gap-2 text-sm font-medium text-white/68 transition hover:text-white">
            {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
