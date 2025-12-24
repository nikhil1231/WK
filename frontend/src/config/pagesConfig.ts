export type PageOption = {
  label: string
  value: string
  helperText?: string
}

export type PageConfig = {
  id: string
  title: string
  shortLabel?: string
  description?: string
  options: PageOption[]
  required?: boolean
}

export const pagesConfig: PageConfig[] = [
  {
    id: 'goals',
    title: 'What are you trying to accomplish?',
    shortLabel: 'Goals',
    description: 'Pick every outcome that matters right now. This helps us tailor the experience.',
    required: true,
    options: [
      { value: 'shipping-speed', label: 'Ship faster', helperText: 'Streamline builds & reviews' },
      { value: 'dx', label: 'Improve DX', helperText: 'Developer happiness & tooling' },
      { value: 'quality', label: 'Quality focus', helperText: 'Tests, linting, observability' },
      { value: 'costs', label: 'Cut costs', helperText: 'Infra + licensing' },
      { value: 'scaling', label: 'Scale the team', helperText: 'Processes & onboarding' },
      { value: 'experimentation', label: 'Experiment more', helperText: 'Feature flags & analysis' },
    ],
  },
  {
    id: 'stack',
    title: 'What does your stack look like?',
    shortLabel: 'Stack',
    description: 'Select every framework/runtime you actively maintain.',
    required: true,
    options: [
      { value: 'react', label: 'React' },
      { value: 'next', label: 'Next.js' },
      { value: 'react-native', label: 'React Native / Expo' },
      { value: 'node', label: 'Node.js APIs' },
      { value: 'python', label: 'Python services' },
      { value: 'go', label: 'Go services' },
    ],
  },
  {
    id: 'concerns',
    title: 'Anything keeping you up at night?',
    shortLabel: 'Concerns',
    description: 'Optional, but it helps us surface the right playbooks.',
    options: [
      { value: 'perf', label: 'Performance' },
      { value: 'security', label: 'Security posture' },
      { value: 'reliability', label: 'Reliability / SLOs' },
      { value: 'hiring', label: 'Hiring' },
      { value: 'knowledge', label: 'Knowledge sharing' },
      { value: 'governance', label: 'Governance & compliance' },
    ],
  },
]

