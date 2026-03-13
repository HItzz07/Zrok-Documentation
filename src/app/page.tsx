'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Globe, Lock, Shield, Cpu, Share2,
  GitBranch, Server, Users, Rocket,
  ChevronRight, Check, BookOpen,
  Network, Key, Radio, Database,
  Infinity as InfinityIcon
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Section from '@/components/Section'
import TerminalSimulator from '@/components/TerminalSimulator'
import ArchitectureDiagram from '@/components/ArchitectureDiagram'
import ShareToggle from '@/components/ShareToggle'
import CLIPlayground from '@/components/CLIPlayground'
import AchievementPanel from '@/components/AchievementPanel'
import InstallTabs from '@/components/InstallTabs'
import CodeBlock from '@/components/CodeBlock'
import NamespaceChart from '@/components/NamespaceChart'

const SECTIONS = ['what','why','how','install','tutorial','shares','namespaces','advanced','selfhost','usecases','playground']

// ── Hero particle component (precomputed to avoid WAAPI Infinity bug) ────────
const PARTICLES = [
  { left: '8%',  top: '15%', dur: 3.2, delay: 0.0 },
  { left: '18%', top: '72%', dur: 5.1, delay: 0.6 },
  { left: '27%', top: '38%', dur: 4.0, delay: 1.2 },
  { left: '35%', top: '85%', dur: 6.3, delay: 0.3 },
  { left: '42%', top: '22%', dur: 3.7, delay: 2.1 },
  { left: '55%', top: '60%', dur: 5.5, delay: 0.9 },
  { left: '63%', top: '10%', dur: 4.8, delay: 1.5 },
  { left: '71%', top: '78%', dur: 3.5, delay: 0.4 },
  { left: '80%', top: '45%', dur: 6.0, delay: 1.8 },
  { left: '89%', top: '28%', dur: 4.2, delay: 2.4 },
  { left: '12%', top: '55%', dur: 5.8, delay: 0.7 },
  { left: '23%', top: '90%', dur: 3.9, delay: 1.1 },
  { left: '47%', top: '42%', dur: 4.5, delay: 0.5 },
  { left: '58%', top: '88%', dur: 5.2, delay: 1.9 },
  { left: '75%', top: '18%', dur: 3.3, delay: 2.6 },
  { left: '84%', top: '65%', dur: 6.1, delay: 0.2 },
  { left: '6%',  top: '33%', dur: 4.7, delay: 1.4 },
  { left: '33%', top: '68%', dur: 5.4, delay: 0.8 },
  { left: '66%', top: '52%', dur: 3.6, delay: 2.2 },
  { left: '94%', top: '40%', dur: 5.9, delay: 0.1 },
]

function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-zrok-500/40"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -28, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.dur, repeatType: 'loop', repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── Comparison card ─────────────────────────────────────────────────────────
function CompareCard({ title, items, color, icon: Icon }: {
  title: string; items: { label: string; good: boolean }[]; color: string; icon: any
}) {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <h4 className="font-bold text-white text-lg">{title}</h4>
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
              item.good ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/15 text-red-400'
            }`}>
              {item.good ? '✓' : '✗'}
            </span>
            <span className={`text-sm ${item.good ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Concept card ─────────────────────────────────────────────────────────────
function ConceptCard({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass rounded-2xl p-5 card-hover border border-white/5 hover:border-zrok-500/20 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: color + '20' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

// ── Use Case card ────────────────────────────────────────────────────────────
function UseCaseCard({ emoji, title, desc, tags }: { emoji: string; title: string; desc: string; tags: string[] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-6 border border-white/5 hover:border-zrok-500/20 transition-all"
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full badge-gradient text-zrok-400">{t}</span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState('what')
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)

  const markComplete = useCallback((id: string) => {
    setCompletedSections(prev => {
      const next = new Set(prev)
      next.add(id)
      setProgress((next.size / SECTIONS.length) * 100)
      return next
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (SECTIONS.includes(id)) {
              setActiveSection(id)
              markComplete(id)
            }
          }
        })
      },
      { threshold: 0.2, rootMargin: '-80px 0px -20% 0px' }
    )
    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [markComplete])

  return (
    <div className="min-h-screen bg-midnight-900 grid-bg">
      <Navigation
        activeSection={activeSection}
        progress={progress}
        completedSections={completedSections}
      />

      {/* Layout with sidebar offset */}
      <div className="lg:pl-64">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-16">
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-zrok-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <HeroParticles />

          <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gradient text-zrok-400 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-zrok-400 animate-pulse" />
              Open Source · Zero Trust · No BS
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
                <span className="shimmer-text">zrok</span>
                <span className="block text-white mt-2 text-4xl md:text-5xl font-bold">
                  Share Anything.<br className="md:hidden" /> Instantly.
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                The open-source, zero-trust sharing platform built on OpenZiti.
                Share localhost. No ports. No NAT traversal. No headaches.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('tutorial')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-zrok-500 hover:bg-zrok-400 text-white font-semibold transition-all glow-green hover:scale-105 active:scale-95"
              >
                <Rocket size={18} /> Start Building
              </button>
              <button
                onClick={() => document.getElementById('what')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-zrok-500/20 text-slate-300 hover:text-white font-semibold transition-all hover:border-zrok-500/40"
              >
                <BookOpen size={18} /> Learn More
              </button>
            </motion.div>

            {/* Quick terminal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="max-w-lg mx-auto"
            >
              <div className="terminal rounded-xl overflow-hidden">
                <div className="terminal-header">
                  <span className="terminal-dot w-3 h-3 bg-red-500/80" />
                  <span className="terminal-dot w-3 h-3 bg-yellow-500/80" />
                  <span className="terminal-dot w-3 h-3 bg-green-500/80" />
                </div>
                <div className="terminal-body space-y-1 text-sm">
                  <p><span className="text-zrok-600">$ </span><span className="text-zrok-300">zrok share public 3000</span></p>
                  <p className="text-slate-500">⠸ establishing share...</p>
                  <p className="text-emerald-400">✓ share ready</p>
                  <p className="text-purple-300">  → https://a8f3x9.share.zrok.io</p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-8 justify-center pt-4"
            >
              {[
                { label: 'Open Source', icon: GitBranch },
                { label: 'Zero Trust', icon: Shield },
                { label: 'Self Hostable', icon: Server },
                { label: 'Cross Platform', icon: Globe },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Icon size={14} className="text-zrok-600" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
          >
            <span className="text-xs">Scroll to explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, repeatType: 'loop', duration: 1.4, ease: 'easeInOut' }}>
              <ChevronRight size={16} className="rotate-90" />
            </motion.div>
          </motion.div>
        </div>

        {/* ── CONTENT AREA ─────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pb-32">

          {/* ── SECTION 1: WHAT IS ZROK ────────────────────────────────────── */}
          <Section
            id="what"
            badge="01 · Introduction"
            title="What is zrok?"
            subtitle="zrok is an open-source, zero-trust sharing platform. It lets you share local services — like a web server or API — with the world in seconds, without any firewall rules or port forwarding."
          >
            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {[
                { icon: Zap, color: '#16b46c', title: 'Instant sharing', desc: 'One command and your localhost is reachable from anywhere on the planet. No config, no DNS, no waiting.' },
                { icon: Shield, color: '#8b5cf6', title: 'Zero trust built-in', desc: 'Built on OpenZiti — a battle-tested zero-trust networking framework. Encrypted by default, always.' },
                { icon: GitBranch, color: '#3b82f6', title: '100% open source', desc: 'Fork it, self-host it, contribute to it. No vendor lock-in. Ever.' },
              ].map(c => <ConceptCard key={c.title} {...c} />)}
            </div>

            {/* zrok vs ngrok comparison */}
            <h3 className="text-2xl font-bold text-white mb-6">How does it compare?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <CompareCard
                title="Traditional Tunnels"
                icon={Network}
                color="#ef4444"
                items={[
                  { label: 'Proprietary SaaS', good: false },
                  { label: 'Closed source', good: false },
                  { label: 'Limited free tier', good: false },
                  { label: 'No self-hosting', good: false },
                  { label: 'Easy to use', good: true },
                ]}
              />
              <CompareCard
                title="VPNs & Bastion Hosts"
                icon={Server}
                color="#f59e0b"
                items={[
                  { label: 'Complex setup', good: false },
                  { label: 'Requires a public server', good: false },
                  { label: 'Fine-grained access control', good: true },
                  { label: 'High maintenance overhead', good: false },
                  { label: 'Secure when done right', good: true },
                ]}
              />
              <CompareCard
                title="zrok"
                icon={Zap}
                color="#16b46c"
                items={[
                  { label: 'Open source', good: true },
                  { label: 'Zero trust by default', good: true },
                  { label: 'Self-hostable', good: true },
                  { label: 'No port forwarding needed', good: true },
                  { label: 'Simple CLI', good: true },
                ]}
              />
            </div>
          </Section>

          {/* ── SECTION 2: WHY ─────────────────────────────────────────────── */}
          <Section
            id="why"
            badge="02 · Motivation"
            title="Why does zrok exist?"
            subtitle="Sharing a local service with someone outside your network is harder than it should be. Firewalls, NAT, ISP restrictions — they all get in the way."
          >
            {/* Problem / Solution */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="glass rounded-2xl p-6 border border-red-500/15">
                <p className="text-xs font-mono text-red-500 mb-3 uppercase tracking-widest">The Problem</p>
                <ul className="space-y-3">
                  {[
                    'ISP blocks inbound traffic on home connections',
                    'NAT makes direct connections impossible',
                    'Setting up a cloud VM just to demo a feature is overkill',
                    'Proprietary tunnels have restrictive free tiers',
                    'VPNs require all parties to be enrolled',
                  ].map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-400">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl p-6 border border-zrok-500/15">
                <p className="text-xs font-mono text-zrok-500 mb-3 uppercase tracking-widest">The zrok Solution</p>
                <ul className="space-y-3">
                  {[
                    'Outbound-only connections — no firewall rules needed',
                    'Zero trust fabric handles all routing automatically',
                    'One command: zrok share public <port>',
                    'Completely open source and self-hostable',
                    'Private shares with token-based access control',
                  ].map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                      <span className="text-zrok-500 mt-0.5 flex-shrink-0">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Use moments */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { emoji: '🧑‍💻', label: 'Share localhost' },
                { emoji: '📡', label: 'Remote dev demos' },
                { emoji: '📁', label: 'File sharing' },
                { emoji: '🌐', label: 'Private networking' },
              ].map(({ emoji, label }) => (
                <div key={label} className="glass rounded-xl p-4 text-center card-hover border border-white/5 hover:border-zrok-500/20 transition-colors">
                  <div className="text-3xl mb-2">{emoji}</div>
                  <p className="text-sm text-slate-300 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── SECTION 3: HOW IT WORKS ────────────────────────────────────── */}
          <Section
            id="how"
            badge="03 · Architecture"
            title="How zrok works"
            subtitle="zrok sits on top of OpenZiti — a zero-trust networking fabric. Your traffic never touches the public internet unencrypted."
          >
            <ArchitectureDiagram />

            {/* Concept glossary */}
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Users, color: '#16b46c', title: 'Account', desc: 'Your identity on the zrok network. Created with zrok invite.' },
                { icon: Cpu, color: '#8b5cf6', title: 'Environment', desc: 'A registered instance of zrok on a machine. Created with zrok enable.' },
                { icon: Share2, color: '#3b82f6', title: 'Share', desc: 'An active tunnel from a local port to a zrok frontend. Public or private.' },
                { icon: Key, color: '#f59e0b', title: 'Share Token', desc: 'A unique identifier for a share. Used to access private shares.' },
                { icon: Globe, color: '#ec4899', title: 'Frontend', desc: 'The public-facing zrok service that serves share URLs.' },
                { icon: Server, color: '#06b6d4', title: 'Backend Modes', desc: 'Proxy (HTTP), web (static files), tcpTunnel, and more.' },
              ].map(c => <ConceptCard key={c.title} {...c} />)}
            </div>

            {/* Request flow */}
            <div className="mt-10 glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-5">Animated Request Flow</h3>
              <div className="relative flex items-center justify-between gap-2 overflow-x-auto py-4">
                {[
                  { label: 'Consumer', color: '#06b6d4', icon: '🧑‍💻' },
                  { label: 'zrok Frontend', color: '#16b46c', icon: '🌐' },
                  { label: 'OpenZiti Fabric', color: '#ec4899', icon: '🔐' },
                  { label: 'zrok Backend', color: '#8b5cf6', icon: '⚡' },
                  { label: 'Your App', color: '#3b82f6', icon: '🖥️' },
                ].map((node, i, arr) => (
                  <div key={i} className="flex items-center gap-0 flex-shrink-0">
                    <div className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', delay: i * 0.3, ease: 'easeInOut' }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: node.color + '18', border: `1px solid ${node.color}40` }}
                      >
                        {node.icon}
                      </motion.div>
                      <p className="text-xs text-slate-500 text-center" style={{ color: node.color }}>{node.label}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="relative w-12 h-4 mx-1 flex-shrink-0">
                        <div className="absolute inset-y-0 left-0 right-0 overflow-hidden">
                          <motion.div
                            className="h-0.5 w-3 bg-zrok-400 rounded absolute top-1/2 -translate-y-1/2"
                            animate={{ x: [0, 36, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', delay: i * 0.3, ease: 'linear' }}
                          />
                        </div>
                        <div className="absolute inset-y-0 left-0 right-0 border-t border-dashed border-slate-700 top-1/2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                All traffic flows through OpenZiti&apos;s encrypted overlay — end to end, always.
              </p>
            </div>
          </Section>

          {/* ── SECTION 4: INSTALLATION ────────────────────────────────────── */}
          <Section
            id="install"
            badge="04 · Setup"
            title="Install zrok"
            subtitle="Get zrok running on your machine in under two minutes. Pick your platform:"
          >
            <InstallTabs />
          </Section>

          {/* ── SECTION 5: FIRST SHARE TUTORIAL ───────────────────────────── */}
          <Section
            id="tutorial"
            badge="05 · Tutorial"
            title="Your First Share"
            subtitle="Follow this interactive tutorial to go from zero to a live public URL in 3 commands."
          >
            <TerminalSimulator
              title="zrok · first share tutorial"
              steps={[
                {
                  command: 'zrok invite',
                  delay: 60,
                  output: [
                    { text: 'Enter your email: dev@example.com', type: 'out' },
                    { text: '⠸ sending verification email...', type: 'info' },
                    { text: '✓ check your email for a verification link', type: 'success' },
                    { text: '  → once verified, copy your account token', type: 'out' },
                  ],
                },
                {
                  command: 'zrok enable eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                  delay: 70,
                  output: [
                    { text: '⠸ contacting zrok controller...', type: 'info' },
                    { text: '⠸ creating environment...', type: 'info' },
                    { text: '✓ environment "my-laptop" enabled', type: 'success' },
                    { text: '  → saved to ~/.zrok/environment.json', type: 'out' },
                  ],
                },
                {
                  command: 'zrok share public 8080',
                  delay: 80,
                  output: [
                    { text: '⠸ requesting share...', type: 'info' },
                    { text: '⠸ registering with OpenZiti fabric...', type: 'info' },
                    { text: '⠸ establishing tunnel...', type: 'info' },
                    { text: '', type: 'out' },
                    { text: '✓ share established!', type: 'success' },
                    { text: '', type: 'out' },
                    { text: '  your service is live at:', type: 'out' },
                    { text: '  https://j8f3kx2.share.zrok.io', type: 'url' },
                    { text: '', type: 'out' },
                    { text: '  ctrl-c to stop sharing', type: 'info' },
                  ],
                },
              ]}
            />

            {/* Achievement callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-6 flex items-center gap-4 p-5 rounded-2xl badge-gradient border border-zrok-500/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-zrok-500/20 flex items-center justify-center text-3xl achievement-pop">
                🚀
              </div>
              <div>
                <p className="text-xs text-zrok-500 font-semibold uppercase tracking-widest">Achievement Unlocked</p>
                <p className="text-white font-bold text-lg">First Tunnel!</p>
                <p className="text-slate-400 text-sm">You just shared your first service with the world.</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-zrok-400 font-mono font-bold">+150 XP</p>
              </div>
            </motion.div>
          </Section>

          {/* ── SECTION 6: PUBLIC VS PRIVATE ──────────────────────────────── */}
          <Section
            id="shares"
            badge="06 · Security Model"
            title="Public vs Private Shares"
            subtitle="Choose the sharing model that fits your use case. Toggle between them to understand the tradeoffs."
          >
            <ShareToggle />
          </Section>

          {/* ── SECTION 7: NAMESPACES & RESERVED NAMES ────────────────────── */}
          <Section
            id="namespaces"
            badge="07 · Persistence"
            title="Namespaces & Reserved Names"
            subtitle="In zrok v2.0+, persistent sharing is managed through Namespaces and Reserved Names. No more random, ephemeral tokens."
          >
            <NamespaceChart />

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Why Namespaces?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Namespaces act as logical groupings (like DNS zones). Names within them are unique and persistent identifiers for your shares.
                </p>
                <ul className="space-y-2">
                  {[
                    'Persistent tokens across restarts',
                    'Logical resource grouping',
                    'Zero coupling between environments & names',
                    'Custom domain support (pro feature)',
                  ].map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-zrok-500">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Core Workflow</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">1. Create a reserved name</p>
                    <CodeBlock code="$ zrok create name -n public my-prod-api" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">2. Start sharing using that name</p>
                    <CodeBlock code="$ zrok share public localhost:8080 -n public:my-prod-api" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">3. Check your namespaces</p>
                    <CodeBlock code="$ zrok list namespaces" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 glass rounded-2xl border border-zrok-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-zrok-400" size={18} />
                <h4 className="text-white font-bold">Closed Namespaces</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                While the <code className="text-zrok-400">public</code> namespace is open to everyone, you can create <code className="text-purple-400">Closed Namespaces</code> to restrict which accounts can create or use names within that group.
              </p>
            </div>
          </Section>

          {/* ── SECTION 7: ADVANCED FEATURES ──────────────────────────────── */}
          <Section
            id="advanced"
            badge="07 · Advanced"
            title="Advanced Features"
            subtitle="Once you're comfortable with basic sharing, unlock the full power of zrok."
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Persistent shares */}
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-zrok-500/20 transition-colors card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zrok-500/20 flex items-center justify-center">
                    <InfinityIcon size={18} className="text-zrok-400" />
                  </div>
                  <h3 className="font-bold text-white">Persistent Shares</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  By default, shares get a new URL every time. Use reserved shares to get a stable, permanent URL.
                </p>
                <CodeBlock code={`# Reserve a share
$ zrok reserve public --backend-mode proxy localhost:8080
# Your reserved token:  my-stable-token

# Start sharing with the reserved token
$ zrok share reserved my-stable-token`} />
              </div>

              {/* Web mode */}
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-zrok-500/20 transition-colors card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Globe size={18} className="text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white">Web Mode</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Share a local directory as a static website. Great for sharing build outputs, reports, or documentation.
                </p>
                <CodeBlock code={`# Share a local folder as a public website
$ zrok share public --backend-mode web ./dist

# Your build is now live at:
# https://x9f1k3.share.zrok.io`} />
              </div>

              {/* Proxy mode */}
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-zrok-500/20 transition-colors card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Radio size={18} className="text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white">Proxy Mode</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Default mode — transparently proxies HTTP/S traffic to any local port. Works with any web framework.
                </p>
                <CodeBlock code={`# Proxy your local dev server
$ zrok share public --backend-mode proxy localhost:3000

# Works with any framework:
# Next.js, FastAPI, Rails, etc.`} />
              </div>

              {/* TCP tunnel */}
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-zrok-500/20 transition-colors card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Database size={18} className="text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white">TCP Tunnel Mode</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Share any TCP service — databases, SSH, game servers. Not just HTTP.
                </p>
                <CodeBlock code={`# Share a local PostgreSQL instance (private)
$ zrok share private \\
    --backend-mode tcpTunnel \\
    localhost:5432

# Colleague accesses:
$ zrok access private <token>`} />
              </div>

              {/* zrok Drive */}
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-zrok-500/20 transition-colors card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Database size={18} className="text-orange-400" />
                  </div>
                  <h3 className="font-bold text-white">zrok Drive & Copy</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  The <code className="text-orange-400">drive</code> and <code className="text-orange-400">copy</code> modes provide a distributed file sharing system with built-in sync.
                </p>
                <CodeBlock code={`# Mount a remote zrok drive locally
$ zrok drive mount <share_token> /mnt/zrok

# Copy files between drives
$ zrok copy local_file.zip zrok:remote_dir/`} />
              </div>
            </div>

            {/* Backend modes table */}
            <div className="mt-6 glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="font-semibold text-white">All Backend Modes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-slate-500 font-medium">Mode</th>
                      <th className="text-left p-4 text-slate-500 font-medium">Protocol</th>
                      <th className="text-left p-4 text-slate-500 font-medium">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['proxy',      'HTTP/S',    'Web apps, APIs, dev servers'],
                      ['web',        'HTTP/S',    'Static file hosting from directory'],
                      ['tcpTunnel',  'TCP',       'Databases, SSH, raw TCP services'],
                      ['udpTunnel',  'UDP',       'Game servers, streaming'],
                      ['caddy',      'HTTP/S',    'Caddy reverse proxy integration'],
                      ['drive',      'HTTP/S',    'zrok file drive (built-in file sharing)'],
                    ].map(([mode, proto, use], i) => (
                      <tr key={i} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                        <td className="p-4 font-mono text-zrok-400">{mode}</td>
                        <td className="p-4 text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-xs">{proto}</span>
                        </td>
                        <td className="p-4 text-slate-400">{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* ── SECTION 8: SELF HOSTING ────────────────────────────────────── */}
          <Section
            id="selfhost"
            badge="08 · Self Hosting"
            title="Run Your Own zrok"
            subtitle="Don't want to rely on the public zrok service? Deploy your own instance in minutes with Docker Compose."
          >
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Shield, color: '#16b46c', title: 'Full control', desc: 'Your data, your infrastructure, your rules.' },
                { icon: Server, color: '#8b5cf6', title: 'Private deployment', desc: 'Isolated from the public zrok service.' },
                { icon: Users, color: '#3b82f6', title: 'Team accounts', desc: 'Run it for your entire organization.' },
              ].map(c => <ConceptCard key={c.title} {...c} />)}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-white font-semibold mb-3">1. Clone the zrok repository</p>
                <CodeBlock code={`$ git clone https://github.com/openziti/zrok.git
$ cd zrok/docker/compose`} />
              </div>
              <div>
                <p className="text-white font-semibold mb-3">2. Configure and start</p>
                <CodeBlock code={`# Copy the example env file
$ cp .env.example .env

# Edit .env with your domain and settings
$ nano .env

# Start the full stack
$ docker compose up -d`} />
              </div>
              <div>
                <p className="text-white font-semibold mb-3">3. Point your zrok CLI at your instance</p>
                <CodeBlock code={`# Use your own controller instead of api.zrok.io
$ zrok invite --endpoint https://zrok.yourdomain.com
$ zrok enable --endpoint https://zrok.yourdomain.com <token>`} />
              </div>
            </div>

            <div className="mt-6 p-5 glass rounded-2xl border border-blue-500/20 flex gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-blue-400 font-semibold mb-1">Self-hosted stack includes</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  OpenZiti controller, OpenZiti router, zrok controller, zrok frontend, and a management UI — all in one Docker Compose file.
                </p>
              </div>
            </div>
          </Section>

          {/* ── SECTION 9: USE CASES ───────────────────────────────────────── */}
          <Section
            id="usecases"
            badge="09 · Real World"
            title="Real-World Use Cases"
            subtitle="See how developers use zrok every day to solve real problems."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <UseCaseCard
                emoji="🔌"
                title="Share Local APIs"
                desc="Run your backend locally and share it with mobile apps, webhooks, or teammates — without deploying."
                tags={['webhooks', 'REST API', 'mobile dev']}
              />
              <UseCaseCard
                emoji="🎨"
                title="Demo to Clients"
                desc="Show your latest build to a client on the other side of the world. One command, live in seconds."
                tags={['demos', 'client review', 'frontend']}
              />
              <UseCaseCard
                emoji="📁"
                title="File Sharing"
                desc="Use zrok drive to spin up a temporary file server. No Dropbox, no S3 bucket required."
                tags={['files', 'drive', 'no cloud']}
              />
              <UseCaseCard
                emoji="🤝"
                title="Remote Collaboration"
                desc="Your pair-programming partner can hit your dev server like it's running on their machine."
                tags={['pair programming', 'remote', 'collaboration']}
              />
              <UseCaseCard
                emoji="🧪"
                title="Webhook Testing"
                desc="Receive Stripe, GitHub, or Twilio webhooks directly on localhost. Inspect every request in real time."
                tags={['webhooks', 'Stripe', 'GitHub']}
              />
              <UseCaseCard
                emoji="🔒"
                title="Secure Internal Tools"
                desc="Expose internal dashboards and tools only to people with the right zrok token. True zero-trust access."
                tags={['private share', 'zero trust', 'internal']}
              />
            </div>
          </Section>

          {/* ── SECTION 10: CLI PLAYGROUND ─────────────────────────────────── */}
          <Section
            id="playground"
            badge="10 · Playground"
            title="CLI Playground"
            subtitle="Experiment with zrok commands right here in the browser. No installation needed."
          >
            <CLIPlayground />
          </Section>

          {/* ── ACHIEVEMENT PANEL ──────────────────────────────────────────── */}
          <div className="mt-12">
            <AchievementPanel completed={completedSections} />
          </div>

          {/* ── FOOTER ─────────────────────────────────────────────────────── */}
          <footer className="mt-20 py-12 border-t border-white/5 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-zrok-500 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold shimmer-text text-lg">zrok</span>
            </div>
            <p className="text-slate-500 text-sm">
              Open source on{' '}
              <a href="https://github.com/openziti/zrok" target="_blank" rel="noopener"
                className="text-zrok-500 hover:text-zrok-400 transition-colors underline-anim">
                GitHub
              </a>
              {' '}· Built on{' '}
              <a href="https://openziti.io" target="_blank" rel="noopener"
                className="text-zrok-500 hover:text-zrok-400 transition-colors underline-anim">
                OpenZiti
              </a>
              {' '}· Interactive docs by Antigravity
            </p>
            <p className="text-slate-700 text-xs">MIT License · Not affiliated with NetFoundry</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
