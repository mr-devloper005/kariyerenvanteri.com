import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0d0d0d] text-white">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <EditableReveal>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">{pagesContent.about.badge}</p>
            <h1 className="editable-display mt-5 max-w-5xl text-[3.8rem] leading-[1.15] tracking-[-0.04em] sm:text-[5.6rem] lg:text-[6.5rem]">About {SITE_CONFIG.name}</h1>
            <p className="mt-8 max-w-3xl text-xl leading-[1.35] text-white/70">{pagesContent.about.description}</p>
          </EditableReveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <EditableReveal>
              <article className="rounded-[2rem] bg-white p-7 text-[#0d0d0d] sm:p-10">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 first:mt-0 text-lg leading-[1.45] text-[#0d0d0d99]">{paragraph}</p>)}
              </article>
            </EditableReveal>
            <div className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <EditableReveal key={value.title} index={index}>
                  <div className="rounded-[1.5rem] border border-white/15 bg-white/5 p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent-soft)]">0{index + 1}</p>
                    <h2 className="editable-display mt-3 text-4xl leading-[1.15] tracking-[-0.04em]">{value.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-white/65">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
