import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Local places and practical guides',
      description: 'Find useful local records, compare places, and open downloadable guides from one focused discovery platform.',
      openGraphTitle: 'Local places and practical guides',
      openGraphDescription: 'A focused platform for local discovery and useful reference downloads.',
      keywords: ['local directory', 'guides', 'reports', 'local search', 'place index'],
    },
    hero: {
      badge: 'Local discovery desk',
      title: ['Find the right place.', 'Open the right guide.'],
      description: 'Browse local records, compare essentials, and keep useful guides close when decisions need context.',
      primaryCta: { label: 'Explore places', href: '/listing' },
      secondaryCta: { label: 'Open guides', href: '/pdf' },
      searchPlaceholder: 'Search places, guides, topics, and categories',
      focusLabel: 'Focus',
      featureCardBadge: 'Latest useful find',
      featureCardTitle: 'Fresh records and guides shape the front page.',
      featureCardDescription: 'Recent entries stay prominent while every route and feed keeps working exactly as before.',
    },
    intro: {
      badge: 'How it works',
      title: 'A sharper way to move between local context and useful downloads.',
      paragraphs: [
        'The platform brings local records and practical guide material into one browsing flow, so visitors can compare details and keep researching without changing tools.',
        'Records prioritize direct action: location, contact points, category, trust signals, and related recommendations stay close to the decision.',
        'Guides are treated like working files, with metadata, preview space, and download actions presented before decorative content.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Local records with contact-ready metadata.',
        'Guide pages designed around preview and download actions.',
        'Search and category browsing across active sections.',
        'Clean typography, strong imagery, and low-friction actions.',
      ],
      primaryLink: { label: 'Browse places', href: '/listing' },
      secondaryLink: { label: 'View guides', href: '/pdf' },
    },
    cta: {
      badge: 'Add useful context',
      title: 'Submit a place, guide, or resource worth finding.',
      description: 'Use the publishing workspace to add useful entries that help visitors compare, download, and act.',
      primaryCta: { label: 'Submit', href: '/create' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest entries in this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'Useful local discovery, organized with intent.',
    description: `${slot4BrandConfig.siteName} helps visitors move from broad research to specific action by pairing place records with practical guide material.`,
    paragraphs: [
      'The platform is built around clarity: concise records, strong category cues, helpful summaries, and a browsing rhythm that does not bury the important details.',
      'Visitors can search, compare, save context, and open downloadable material without needing a separate publishing or research workflow.',
    ],
    values: [
      {
        title: 'Local context first',
        description: 'Every layout makes contact points, location cues, and category signals easy to scan.',
      },
      {
        title: 'Guides as working material',
        description: 'Downloadable resources are treated as primary content, with preview space and metadata that support fast evaluation.',
      },
      {
        title: 'Trust through structure',
        description: 'Clean hierarchy, visible facts, and related discovery paths help people decide what to open next.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what needs to be added, corrected, or clarified.',
    description: 'Send a note about a local record, guide submission, partnership, or site question. We will route it to the right workflow.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search places, guides, topics, categories, and active site content.',
    },
    hero: {
      badge: 'Search the index',
      title: 'Find places, guides, and useful context faster.',
      description: 'Use keywords, categories, and active sections to move straight to relevant entries.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable entries',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Sign in to submit useful entries.',
      description: 'Use your account to open the publishing workspace and prepare place records, guides, and other active entries.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Add the details people need before they act.',
      description: 'Choose the entry type, add facts, links, summary, imagery when relevant, and a clean body of context.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in page for this site.',
      badge: 'Member access',
      title: 'Welcome back to the discovery desk.',
      description: 'Sign in to submit entries, manage drafts, and keep useful local context moving.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Sign in successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Account creation page for this site.',
      badge: 'Site access',
      title: 'Create an account and start submitting.',
      description: 'Create an account to access the publishing workspace and prepare useful entries for review.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'More places',
      fallbackTitle: 'Place details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
