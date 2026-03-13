'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Lock, ChevronDown, Shield, Zap, Users } from 'lucide-react'

const shareTypes = [
  {
    id: 'public',
    title: 'Public Share',
    icon: Globe,
    color: '#16b46c',
    tagline: 'Share instantly. Zero config.',
    description: 'Anyone with the URL can access your service. Perfect for quick demos, webhooks, and sharing with clients.',
    features: [
      { icon: Zap,    text: 'Instant public URL',                good: true  },
      { icon: Globe,  text: 'Accessible from anywhere',          good: true  },
      { icon: Users,  text: 'No authentication required',        good: false },
      { icon: Shield, text: 'No end-to-end encryption at edges', good: false },
    ],
    command: 'zrok share public 8080',
    output: 'https://your-token.share.zrok.io',
    useCases: ['Client demos', 'Webhook testing', 'Quick file sharing', 'CI/CD previews'],
  },
  {
    id: 'private',
    title: 'Private Share',
    icon: Lock,
    color: '#8b5cf6',
    tagline: 'Zero-trust. Access tokens only.',
    description: 'Only users with a valid zrok account and access token can reach your service. Fully encrypted end-to-end via OpenZiti.',
    features: [
      { icon: Shield, text: 'End-to-end encrypted with ZiTi',   good: true },
      { icon: Lock,   text: 'Token-based access control',        good: true },
      { icon: Zap,    text: 'No exposure to public internet',    good: true },
      { icon: Users,  text: 'Requires zrok account to access',  good: false },
    ],
    command: 'zrok share private 8080',
    output: 'zrok access private <your-token>',
    useCases: ['Internal tools', 'Secure API sharing', 'Remote dev access', 'Team collaboration'],
  },
]

export default function ShareToggle() {
  const [active, setActive] = useState<'public' | 'private'>('public')
  const share = shareTypes.find(s => s.id === active)!
  const Icon = share.icon

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex gap-3 p-1 glass rounded-xl w-fit mx-auto">
        {shareTypes.map(s => {
          const SI = s.icon
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id as 'public' | 'private')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                active === s.id
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={active === s.id ? { background: s.color + '25', boxShadow: `0 0 20px ${s.color}30`, border: `1px solid ${s.color}40` } : {}}
            >
              <SI size={15} />
              {s.title}
            </button>
          )
        })}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="glass rounded-2xl overflow-hidden"
          style={{ borderColor: share.color + '30', borderWidth: 1 }}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: share.color + '20' }}>
                <Icon size={22} style={{ color: share.color }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{share.title}</h3>
                <p style={{ color: share.color }} className="text-sm font-medium mt-0.5">{share.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">{share.description}</p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {/* Features */}
            <div className="p-6 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Properties</p>
              {share.features.map((f, i) => {
                const FI = f.icon
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      f.good ? 'bg-emerald-500/15' : 'bg-slate-700/50'
                    }`}>
                      <FI size={12} className={f.good ? 'text-emerald-400' : 'text-slate-500'} />
                    </div>
                    <span className={`text-sm ${f.good ? 'text-slate-200' : 'text-slate-500'}`}>{f.text}</span>
                    <span className="ml-auto text-xs">{f.good ? '✓' : '—'}</span>
                  </div>
                )
              })}
            </div>

            {/* Use cases + command */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Use Cases</p>
              <div className="flex flex-wrap gap-2">
                {share.useCases.map((u, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs"
                    style={{ background: share.color + '15', color: share.color, border: `1px solid ${share.color}30` }}>
                    {u}
                  </span>
                ))}
              </div>

              {/* Command preview */}
              <div className="mt-4 terminal rounded-xl overflow-hidden">
                <div className="terminal-header">
                  <span className="terminal-dot bg-red-500/80 w-2.5 h-2.5" />
                  <span className="terminal-dot bg-yellow-500/80 w-2.5 h-2.5" />
                  <span className="terminal-dot bg-green-500/80 w-2.5 h-2.5" />
                </div>
                <div className="terminal-body py-3 space-y-1.5 text-xs">
                  <p><span className="text-zrok-600">$ </span><span className="text-zrok-300">{share.command}</span></p>
                  <p className="text-slate-400">▶ establishing {active} share...</p>
                  <p className="text-emerald-400">✓ share ready!</p>
                  <p style={{ color: active === 'public' ? '#a78bfa' : '#34d399' }}>{share.output}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
