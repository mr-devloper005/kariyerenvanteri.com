import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0d0d0d] text-white">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1120px] items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <div className="rounded-[2rem] bg-white p-7 text-[#0d0d0d] sm:p-9">
            <h1 className="editable-display text-5xl leading-[1.15] tracking-[-0.04em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-6 text-sm text-[#0d0d0d99]">Already have an account? <Link href="/login" className="font-medium text-[#cc1c4b] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">{pagesContent.auth.signup.badge}</p>
            <h2 className="editable-display mt-5 max-w-3xl text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[5.25rem]">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
