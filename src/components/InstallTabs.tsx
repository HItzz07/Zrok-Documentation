'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Terminal, Apple, Package, Check } from 'lucide-react'
import CodeBlock from './CodeBlock'

const platforms = [
  {
    id: 'linux',
    label: 'Linux',
    icon: Terminal,
    steps: [
      {
        title: 'Download the binary',
        code: `# Download latest release
$ curl -sSLf https://github.com/openziti/zrok/releases/latest/download/zrok_linux_amd64.tar.gz \\
    | tar -xz -C /usr/local/bin`,
      },
      {
        title: 'Verify installation',
        code: `$ zrok version
v0.4.x`,
      },
      {
        title: 'Create an account & enable',
        code: `$ zrok invite
# Enter your email → verify it

$ zrok enable <your-token>
✓ environment enabled`,
      },
    ],
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: Monitor,
    steps: [
      {
        title: 'Download & install via winget',
        code: `# Option A: winget (recommended)
$ winget install openziti.zrok

# Option B: Download MSI from GitHub Releases
# https://github.com/openziti/zrok/releases`,
      },
      {
        title: 'Verify installation (PowerShell)',
        code: `PS> zrok version
v0.4.x`,
      },
      {
        title: 'Create account & enable',
        code: `PS> zrok invite
# Enter email → verify

PS> zrok enable <your-token>`,
      },
    ],
  },
  {
    id: 'mac',
    label: 'macOS',
    icon: Apple,
    steps: [
      {
        title: 'Install via Homebrew',
        code: `$ brew tap openziti/homebrew-repo
$ brew install zrok`,
      },
      {
        title: 'Verify installation',
        code: `$ zrok version
v0.4.x`,
      },
      {
        title: 'Create account & enable',
        code: `$ zrok invite
# Enter your email and verify

$ zrok enable <your-token>
✓ environment enabled`,
      },
    ],
  },
  {
    id: 'docker',
    label: 'Docker',
    icon: Package,
    steps: [
      {
        title: 'Pull the zrok image',
        code: `$ docker pull openziti/zrok`,
      },
      {
        title: 'Enable the environment',
        code: `$ docker run --rm -it \\
    -e ZROK_API_ENDPOINT=https://api.zrok.io \\
    -v zrok-data:/mnt/zrok \\
    openziti/zrok enable <your-token>`,
      },
      {
        title: 'Share a local port',
        code: `$ docker run --rm -it \\
    --network host \\
    -v zrok-data:/mnt/zrok \\
    openziti/zrok share public 8080`,
      },
    ],
  },
]

export default function InstallTabs() {
  const [active, setActive] = useState('linux')
  const platform = platforms.find(p => p.id === active)!

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {platforms.map(p => {
          const Icon = p.icon
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === p.id
                  ? 'bg-zrok-500/20 text-zrok-400 border border-zrok-500/30 shadow-lg shadow-zrok-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={15} />
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {platform.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-5"
            >
              {/* Step number */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-zrok-500/20 border border-zrok-500/40 flex items-center justify-center text-zrok-400 text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                {i < platform.steps.length - 1 && (
                  <div className="w-px flex-1 bg-zrok-500/15 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <p className="text-white font-semibold mb-3 flex items-center gap-2">
                  {step.title}
                  {i === platform.steps.length - 1 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      Final step
                    </span>
                  )}
                </p>
                <CodeBlock code={step.code} language="bash" />
              </div>
            </motion.div>
          ))}

          {/* Done */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold text-sm">You&apos;re ready!</p>
              <p className="text-slate-400 text-xs">Proceed to the First Share tutorial to go live in seconds.</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
