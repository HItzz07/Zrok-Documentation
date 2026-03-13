'use client'
import { motion } from 'framer-motion'
import { Database, Tag, Share2, Shield, User } from 'lucide-react'

export default function NamespaceChart() {
  return (
    <div className="relative p-8 glass rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Layer 1: Account */}
        <div className="flex flex-col items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-2xl bg-zrok-500/10 border border-zrok-500/30 flex items-center justify-center glow-green"
          >
            <User className="text-zrok-400" size={32} />
          </motion.div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">Account</p>
            <p className="text-slate-500 text-[10px] font-mono">dev@zrok.io</p>
          </div>
        </div>

        <div className="hidden md:block w-8 h-px bg-zrok-500/20" />

        {/* Layer 2: Namespaces */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="p-4 glass rounded-xl border-l-4 border-zrok-500 flex items-center gap-4 min-w-[200px]"
          >
            <div className="w-10 h-10 rounded-lg bg-zrok-500/10 flex items-center justify-center">
              <Database className="text-zrok-400" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">public</p>
              <p className="text-slate-500 text-[10px]">Default Namespace</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 glass rounded-xl border-l-4 border-purple-500 flex items-center gap-4 min-w-[200px]"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Shield className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">work-team</p>
              <p className="text-slate-500 text-[10px]">Closed Namespace</p>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block w-8 h-px bg-zrok-500/20" />

        {/* Layer 3: Names */}
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="px-3 py-2 badge-gradient rounded-lg border border-zrok-500/20 flex items-center gap-2"
          >
            <Tag size={12} className="text-zrok-400" />
            <span className="text-xs font-mono text-white">my-stable-api</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="px-3 py-2 badge-gradient rounded-lg border border-zrok-500/20 flex items-center gap-2"
          >
            <Tag size={12} className="text-zrok-400" />
            <span className="text-xs font-mono text-white">demo-site</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20 flex items-center gap-2"
          >
            <Tag size={12} className="text-purple-400" />
            <span className="text-xs font-mono text-white">prod-db</span>
          </motion.div>
        </div>

        {/* Connections Arrows (Mobile logic simplified) */}
        <div className="absolute top-1/2 left-0 right-0 pointer-events-none opacity-20 hidden md:block">
           <svg width="100%" height="100" viewBox="0 0 800 100">
              <path d="M100,50 L200,30 M100,50 L200,70" stroke="currentColor" fill="none" className="text-zrok-500" />
              <path d="M400,30 L500,20 M400,30 L500,45" stroke="currentColor" fill="none" className="text-zrok-500" />
              <path d="M400,70 L500,80" stroke="currentColor" fill="none" className="text-purple-500" />
           </svg>
        </div>
      </div>

      {/* Annotation */}
      <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono italic">
        * Persistent share tokens are tied to reserved names
      </div>
    </div>
  )
}
