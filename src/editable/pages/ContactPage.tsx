'use client'

import { Building2, FileText, Mail } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const tone = {
  shell: 'bg-[#0d0d0d] text-white',
  panel: 'bg-white text-[#0d0d0d]',
  soft: 'border border-white/15 bg-white/5',
  muted: 'text-white/65',
}

function getLanes() {
  return [
    { icon: Building2, title: 'Entry updates', body: 'Send corrections, new details, or clarification for anything that should be easier to evaluate.' },
    { icon: FileText, title: 'Guide submissions', body: 'Share a useful resource, report, checklist, or source link for review.' },
    { icon: Mail, title: 'Partnership support', body: 'Coordinate publishing questions, coverage requests, and collaboration ideas.' },
  ]
}

export default function ContactPage() {
  const lanes = getLanes()

  return (
    <EditableSiteShell className={tone.shell}>
      <main className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">{pagesContent.contact.eyebrow}</p>
            <h1 className="editable-display mt-5 text-5xl leading-[1.15] tracking-[-0.04em] sm:text-6xl lg:text-[5.25rem]">{pagesContent.contact.title}</h1>
            <p className={`mt-6 max-w-2xl text-base leading-7 ${tone.muted}`}>{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.5rem] p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                  <h2 className="editable-display mt-3 text-3xl leading-[1.15] tracking-[-0.04em]">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-7 sm:p-9 ${tone.panel}`}>
            <h2 className="editable-display text-5xl leading-[1.15] tracking-[-0.04em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
