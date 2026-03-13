'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

export default function CodeBlock({
  code,
  language = 'bash',
  title,
}: {
  code: string
  language?: string
  title?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="terminal rounded-xl overflow-hidden">
      {(title || true) && (
        <div className="terminal-header justify-between">
          <div className="flex items-center gap-2">
            <span className="terminal-dot w-3 h-3 bg-red-500/70" />
            <span className="terminal-dot w-3 h-3 bg-yellow-500/70" />
            <span className="terminal-dot w-3 h-3 bg-green-500/70" />
            {title && <span className="ml-3 text-slate-500 text-xs font-mono">{title}</span>}
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all font-mono"
          >
            {copied ? <Check size={11} className="text-zrok-400" /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <div className="terminal-body overflow-x-auto">
        <pre className="text-sm leading-7 font-mono whitespace-pre">
          {code.split('\n').map((line, i) => {
            const isComment = line.trim().startsWith('#')
            const isPrompt = line.trim().startsWith('$')
            return (
              <div key={i} className={
                isComment ? 'text-slate-600' :
                isPrompt  ? 'text-zrok-400'  :
                'text-slate-300'
              }>
                {line || '\u00A0'}
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}
