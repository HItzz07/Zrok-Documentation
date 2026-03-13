'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Trophy, Star, Lock } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  xp: number
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'what',       title: 'The Curious',       desc: 'Learned what zrok is',           icon: '🧠', xp: 50  },
  { id: 'why',        title: 'Problem Solver',     desc: 'Understood the problem',         icon: '💡', xp: 75  },
  { id: 'how',        title: 'Architect',          desc: 'Explored the architecture',      icon: '🏗️', xp: 100 },
  { id: 'install',    title: 'Installer',          desc: 'Ready to install',               icon: '📦', xp: 75  },
  { id: 'tutorial',   title: 'First Tunnel!',      desc: 'Completed your first share',     icon: '🚀', xp: 150 },
  { id: 'shares',     title: 'Security Minded',    desc: 'Understand public vs private',   icon: '🔐', xp: 100 },
  { id: 'advanced',   title: 'Power User',         desc: 'Unlocked advanced features',     icon: '⚡', xp: 125 },
  { id: 'selfhost',   title: 'Operator',           desc: 'Ready to self-host',             icon: '🖥️', xp: 150 },
  { id: 'usecases',   title: 'Visionary',          desc: 'Saw the real-world potential',   icon: '🌍', xp: 100 },
  { id: 'playground', title: 'CLI Master',         desc: 'Played the CLI playground',      icon: '🎮', xp: 200 },
]

export default function AchievementPanel({ completed }: { completed: Set<string> }) {
  const [newUnlock, setNewUnlock] = useState<string | null>(null)
  const [prev, setPrev] = useState<Set<string>>(new Set())

  useEffect(() => {
    const newly = [...completed].find(id => !prev.has(id))
    if (newly) {
      setNewUnlock(newly)
      setTimeout(() => setNewUnlock(null), 3000)
    }
    setPrev(new Set(completed))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed])

  const totalXP = ACHIEVEMENTS.filter(a => completed.has(a.id)).reduce((s, a) => s + a.xp, 0)
  const maxXP = ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0)

  return (
    <>
      {/* Achievement unlock toast */}
      {newUnlock && (() => {
        const ach = ACHIEVEMENTS.find(a => a.id === newUnlock)!
        return (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 achievement-pop"
          >
            <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 glow-green border border-zrok-500/30 min-w-56">
              <div className="w-12 h-12 rounded-xl bg-zrok-500/20 flex items-center justify-center text-2xl">
                {ach.icon}
              </div>
              <div>
                <p className="text-xs text-zrok-400 font-semibold uppercase tracking-wider">Achievement!</p>
                <p className="text-white font-bold">{ach.title}</p>
                <p className="text-slate-400 text-xs">+{ach.xp} XP</p>
              </div>
            </div>
          </motion.div>
        )
      })()}

      {/* Panel */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" />
            <h3 className="font-bold text-white">Achievements</h3>
          </div>
          <div className="text-right">
            <p className="text-zrok-400 font-mono font-bold">{totalXP} XP</p>
            <p className="text-slate-500 text-xs">/ {maxXP} XP</p>
          </div>
        </div>

        {/* XP bar */}
        <div className="h-2 bg-midnight-600 rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-bar rounded-full"
            animate={{ width: `${(totalXP / maxXP) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Achievement list */}
        <div className="grid grid-cols-2 gap-2">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = completed.has(ach.id)
            return (
              <motion.div
                key={ach.id}
                animate={{ opacity: unlocked ? 1 : 0.4 }}
                className={`rounded-xl p-3 flex items-center gap-2 transition-all ${
                  unlocked ? 'badge-gradient' : 'bg-midnight-700/50 border border-white/5'
                }`}
              >
                <span className="text-xl">{unlocked ? ach.icon : '🔒'}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${unlocked ? 'text-white' : 'text-slate-600'}`}>
                    {ach.title}
                  </p>
                  <p className={`text-xs ${unlocked ? 'text-zrok-500' : 'text-slate-700'}`}>
                    +{ach.xp} XP
                  </p>
                </div>
                {unlocked && <Star size={10} className="text-yellow-400 ml-auto flex-shrink-0" />}
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}
