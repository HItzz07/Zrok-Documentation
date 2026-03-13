'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Play, RotateCcw, Copy, Check } from 'lucide-react'

const COMMANDS: Record<string, { desc: string; output: string[] }> = {
  'zrok version': {
    desc: 'Show zrok version',
    output: ['v0.4.x', ''],
  },
  'zrok invite': {
    desc: 'Create a new account',
    output: [
      'enter email address: user@example.com',
      '! check your email for a '
      + 'verification link',
      '✓ account created successfully',
    ],
  },
  'zrok enable --apiEndpoint https://api.zrok.io': {
    desc: 'Enable zrok in this environment',
    output: [
      '⠸ enabling...',
      '✓ environment enabled',
      '  → zrokToken saved to ~/.zrok/environment.json',
    ],
  },
  'zrok share public 8080': {
    desc: 'Share port 8080 publicly',
    output: [
      '⠸ establishing share...',
      '✓ share established',
      '',
      '  access your service at:',
      '  https://j8a3kx.share.zrok.io',
      '',
      '  ctrl-c to stop sharing',
    ],
  },
  'zrok share private 8080': {
    desc: 'Share port 8080 privately',
    output: [
      '⠸ establishing private share...',
      '✓ private share established',
      '',
      '  share token: 8oXmV7pLqNzK',
      '  share with: zrok access private 8oXmV7pLqNzK',
    ],
  },
  'zrok access private <token>': {
    desc: 'Access a private share',
    output: [
      '⠸ connecting to private share...',
      '✓ access established on http://127.0.0.1:9090',
    ],
  },
  'zrok status': {
    desc: 'Show active shares and environments',
    output: [
      'Environments',
      '  env-1234  my-laptop  enabled',
      '',
      'Shares',
      '  j8a3kx  public  :8080  active',
    ],
  },
  'zrok disable': {
    desc: 'Disable environment',
    output: [
      '⠸ disabling environment...',
      '✓ environment disabled',
    ],
  },
}

const QUICK_CMDS = [
  'zrok version',
  'zrok invite',
  'zrok enable --apiEndpoint https://api.zrok.io',
  'zrok share public 8080',
  'zrok share private 8080',
  'zrok access private <token>',
  'zrok status',
  'zrok disable',
]

export default function CLIPlayground() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ cmd: string; out: string[] }[]>([])
  const [copied, setCopied] = useState(false)

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return
    const found = Object.entries(COMMANDS).find(([k]) => {
      if (k === trimmed) return true
      const pattern = k.replace(/<[^>]+>/g, '.+')
      return new RegExp(`^${pattern}$`).test(trimmed)
    })
    const output = found
      ? found[1].output
      : [`command not found: ${trimmed.split(' ')[0]}`, "try: zrok --help"]
    setHistory(h => [...h, { cmd: trimmed, out: output }])
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') runCommand(input)
  }

  const reset = () => { setHistory([]); setInput('') }

  const copySession = async () => {
    const text = history
      .map(h => `$ ${h.cmd}\n${h.out.join('\n')}`)
      .join('\n\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quick commands */}
      <div className="flex flex-wrap gap-2">
        {QUICK_CMDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => setInput(cmd)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono badge-gradient text-zrok-300 hover:text-white hover:border-zrok-400/50 transition-all"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="terminal rounded-xl overflow-hidden">
        <div className="terminal-header justify-between">
          <div className="flex items-center gap-2">
            <div className="terminal-dot bg-red-500/80 w-3 h-3" />
            <div className="terminal-dot bg-yellow-500/80 w-3 h-3" />
            <div className="terminal-dot bg-green-500/80 w-3 h-3" />
            <span className="ml-3 text-slate-500 text-xs font-mono flex items-center gap-1">
              <Terminal size={11} /> zrok-playground
            </span>
          </div>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button onClick={copySession}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors">
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            <button onClick={reset}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors">
              <RotateCcw size={11} /> Clear
            </button>
          </div>
        </div>

        <div className="terminal-body min-h-64 max-h-96 overflow-y-auto space-y-3">
          {history.length === 0 && (
            <p className="text-slate-600 italic text-sm">Welcome to the zrok CLI playground. Type a command below or click a quick-run button.</p>
          )}

          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <p className="text-zrok-400 font-mono text-sm">
                <span className="text-zrok-600 select-none">$ </span>{entry.cmd}
              </p>
              {entry.out.map((line, j) => (
                <p key={j} className={`font-mono text-sm ${
                  line.includes('✓') ? 'text-emerald-400'
                  : line.startsWith('  https://') || line.match(/https?:\/\//) ? 'text-purple-300'
                  : line.includes('not found') ? 'text-red-400'
                  : 'text-slate-400'
                }`}>
                  {line}
                </p>
              ))}
            </motion.div>
          ))}

          {/* Input line */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-zrok-600 select-none font-mono text-sm">$</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="type a command..."
              className="flex-1 bg-transparent outline-none font-mono text-sm text-zrok-300 placeholder-slate-700 caret-zrok-400"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-slate-600 text-center">Press Enter to execute · Try <code className="text-zrok-600">zrok share public 8080</code></p>
    </div>
  )
}
