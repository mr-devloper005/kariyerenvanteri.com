import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0d0d0d] text-white">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1120px] items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">{pagesContent.auth.login.badge}</p>
            <h1 className="editable-display mt-5 max-w-3xl text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[5.25rem]">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-7 text-[#0d0d0d] sm:p-9">
            <h2 className="editable-display text-5xl leading-[1.15] tracking-[-0.04em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[#0d0d0d99]">New here? <Link href="/signup" className="font-medium text-[#cc1c4b] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
