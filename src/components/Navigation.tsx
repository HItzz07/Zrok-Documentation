'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, ChevronRight } from 'lucide-react'

const navSections = [
  { id: 'what',      label: '01 What is zrok',      emoji: '🌐' },
  { id: 'why',       label: '02 Why zrok',           emoji: '💡' },
  { id: 'how',       label: '03 How it works',       emoji: '⚙️' },
  { id: 'install',   label: '04 Installation',       emoji: '📦' },
  { id: 'tutorial',  label: '05 First Share',        emoji: '🚀' },
  { id: 'shares',    label: '06 Public vs Private',  emoji: '🔐' },
  { id: 'advanced',  label: '07 Advanced Features',  emoji: '🧩' },
  { id: 'selfhost',  label: '08 Self Hosting',       emoji: '🖥️' },
  { id: 'usecases',  label: '09 Use Cases',          emoji: '💼' },
  { id: 'playground',label: '10 CLI Playground',     emoji: '🎮' },
]

export default function Navigation({
  activeSection,
  progress,
  completedSections,
}: {
  activeSection: string
  progress: number
  completedSections: Set<string>
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      {/* Top Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-zrok-500 flex items-center justify-center glow-green animate-pulse-glow">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight shimmer-text">zrok</span>
            <span className="text-slate-500 text-sm font-medium hidden sm:block">docs</span>
          </button>

          {/* Progress display */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-400 text-sm">{completedSections.size}/{navSections.length} sections</span>
            <div className="w-32 h-1.5 bg-midnight-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full progress-bar rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-zrok-400 text-sm font-mono">{Math.round(progress)}%</span>
          </div>

          {/* GitHub badge */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://github.com/openziti/zrok" target="_blank" rel="noopener"
              className="flex items-center gap-1.5 text-slate-400 hover:text-zrok-400 transition-colors text-sm underline-anim">
              GitHub <ChevronRight size={14} />
            </a>
          </div>

          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg glass text-slate-400 hover:text-zrok-400 transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Progress bar rail */}
        <div className="h-0.5 bg-midnight-700">
          <motion.div
            className="h-full progress-bar"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="fixed left-0 top-14 bottom-0 w-64 hidden lg:flex flex-col glass-strong border-r border-zrok-500/10 overflow-y-auto z-40">
        <div className="p-4 pt-6 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-3">Learning Path</p>
          {navSections.map((s) => {
            const isActive = activeSection === s.id
            const isDone = completedSections.has(s.id)
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive
                    ? 'bg-zrok-500/10 text-zrok-400 border-l-2 border-zrok-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-l-2 border-transparent'
                  }`}
              >
                <span className="text-base">{s.emoji}</span>
                <span className="text-sm font-medium flex-1">{s.label}</span>
                {isDone && (
                  <span className="text-zrok-500 text-xs">✓</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Achievement panel */}
        <div className="m-4 mt-auto p-3 badge-gradient rounded-xl">
          <p className="text-xs text-slate-400 mb-1">🏆 Progress</p>
          <p className="text-zrok-400 font-bold text-lg">{completedSections.size} / {navSections.length}</p>
          <p className="text-xs text-slate-500">sections explored</p>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-72 z-50 glass-strong border-r border-zrok-500/20 overflow-y-auto md:hidden"
          >
            <div className="p-6 space-y-1.5 mt-14">
              {navSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-zrok-500/10 hover:text-zrok-400 transition-all"
                >
                  <span>{s.emoji}</span>
                  <span className="text-sm">{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
