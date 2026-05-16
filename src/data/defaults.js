// Pre-filled demo portfolio so the app opens to a stunning state.

export const uid = () => Math.random().toString(36).slice(2, 10);

export const DEFAULT_PORTFOLIO = {
  personal: {
    name: 'Mira Castellanos',
    title: 'Staff Engineer · Realtime Systems',
    bio: 'I build instrumentation-grade software at the seam between data, latency, and human attention. Currently focused on streaming inference pipelines and the editor experience around them.',
    location: 'Lisbon, PT',
    email: 'hi@mira.dev',
    github: 'https://github.com/mcastellanos',
    linkedin: 'https://linkedin.com/in/mcastellanos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
  },
  skills: [
    { id: uid(), label: 'TypeScript' },
    { id: uid(), label: 'Rust' },
    { id: uid(), label: 'React' },
    { id: uid(), label: 'WebGPU' },
    { id: uid(), label: 'Postgres' },
    { id: uid(), label: 'Kafka' },
    { id: uid(), label: 'Distributed Systems' },
    { id: uid(), label: 'Observability' },
    { id: uid(), label: 'gRPC' },
    { id: uid(), label: 'Terraform' }
  ],
  projects: [
    {
      id: uid(),
      title: 'Riftline',
      desc: 'A real-time collaborative debugger for distributed traces. Engineers see request waterfalls update live across regions, with sub-second causal ordering. Built on a custom CRDT and a WebGPU-accelerated timeline.',
      tags: ['TypeScript', 'Rust', 'WebGPU', 'OpenTelemetry'],
      liveUrl: 'https://riftline.dev',
      githubUrl: 'https://github.com/mcastellanos/riftline',
      featured: true
    },
    {
      id: uid(),
      title: 'Cinder',
      desc: 'Lightweight feature flag store with deterministic rollout simulation. Operators can replay any traffic window against a proposed flag change before shipping it.',
      tags: ['Go', 'Postgres', 'gRPC'],
      liveUrl: '',
      githubUrl: 'https://github.com/mcastellanos/cinder',
      featured: false
    },
    {
      id: uid(),
      title: 'Vellum',
      desc: 'A markdown editor that compiles to print-perfect PDF. Used by three independent magazines for their digital-first workflow.',
      tags: ['React', 'Pandoc', 'LaTeX'],
      liveUrl: 'https://vellum.press',
      githubUrl: '',
      featured: false
    },
    {
      id: uid(),
      title: 'Halcyon',
      desc: 'Open-source incident timeline tool that stitches alerts, deploys and chat into a single narrative. Saved an on-call team ~40 minutes of context-gathering per incident.',
      tags: ['Python', 'Slack API', 'PagerDuty'],
      liveUrl: '',
      githubUrl: 'https://github.com/mcastellanos/halcyon',
      featured: false
    }
  ],
  experience: [
    {
      id: uid(),
      company: 'Northvane',
      role: 'Staff Engineer, Platform',
      duration: '2023 — Present',
      bullets: [
        'Lead the streaming inference platform powering 11 customer-facing surfaces.',
        'Cut p99 latency 38% by re-architecting the routing fabric around a single-leader queue.',
        'Mentor 4 senior engineers, run the platform-wide design review process.'
      ]
    },
    {
      id: uid(),
      company: 'Mosaic Labs',
      role: 'Senior Software Engineer',
      duration: '2020 — 2023',
      bullets: [
        'Built the V2 query engine — a reactive CRDT that backs three internal products.',
        'Owned the migration from monolith → service mesh, completed without downtime.',
        'Authored the company engineering RFC process, still in use today.'
      ]
    },
    {
      id: uid(),
      company: 'Quill & Sons',
      role: 'Software Engineer',
      duration: '2017 — 2020',
      bullets: [
        'Shipped the editor used by ~140k freelance writers.',
        'Built the realtime collaboration layer (operational transform) from scratch.'
      ]
    }
  ],
  appearance: {
    theme: 'obsidian',
    accent: '#7c3aed',
    font: 'inter',
    textScale: 1
  }
};
