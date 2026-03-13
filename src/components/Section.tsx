'use client'
import { motion } from 'framer-motion'

interface SectionProps {
  id: string
  badge?: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function Section({ id, badge, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`section-anchor py-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12"
      >
        {badge && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-semibold text-zrok-500 bg-zrok-500/10 border border-zrok-500/20 px-3 py-1 rounded-full">
              {badge}
            </span>
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{title}</h2>
        {subtitle && <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}
