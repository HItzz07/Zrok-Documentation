'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Play, RotateCcw, ChevronRight } from 'lucide-react'

type Line = { text: string; type: 'cmd' | 'out' | 'success' | 'info' | 'url' | 'error' }

interface TerminalSimulatorProps {
  steps: {
    command: string
    output: Line[]
    delay?: number
  }[]
  title?: string
  autoPlay?: boolean
}

export default function TerminalSimulator({ steps, title = 'zrok terminal', autoPlay = false }: TerminalSimulatorProps) {
  const [lines, setLines] = useState<Line[]>([])
  const [stepIdx, setStepIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [typingCmd, setTypingCmd] = useState('')
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines, typingCmd])

  useEffect(() => {
    if (autoPlay && !running && !done) {
      handlePlay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typeCommand = (cmd: string): Promise<void> => {
    return new Promise((res) => {
      let i = 0
      const iv = setInterval(() => {
        setTypingCmd(cmd.slice(0, i + 1))
        i++
        if (i >= cmd.length) { clearInterval(iv); res() }
      }, 38)
    })
  }

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

  const handlePlay = async () => {
    if (running) return
    setRunning(true)
    setDone(false)

    for (let i = stepIdx; i < steps.length; i++) {
      const step = steps[i]
      setTypingCmd('')
      await typeCommand(step.command)
      await wait(200)
      setTypingCmd('')
      setLines(prev => [...prev, { text: `$ ${step.command}`, type: 'cmd' }])

      for (const line of step.output) {
        await wait(step.delay ?? 80)
        setLines(prev => [...prev, line])
      }
      await wait(400)
      setStepIdx(i + 1)
    }

    setRunning(false)
    setDone(true)
  }

  const handleReset = () => {
    setLines([])
    setTypingCmd('')
    setStepIdx(0)
    setRunning(false)
    setDone(false)
  }

  const colorMap: Record<string, string> = {
    cmd:     'text-zrok-400',
    out:     'text-slate-300',
    success: 'text-emerald-400',
    info:    'text-blue-400',
    url:     'text-purple-300 underline cursor-pointer',
    error:   'text-red-400',
  }

  return (
    <div className="terminal rounded-xl overflow-hidden w-full">
      {/* Header */}
      <div className="terminal-header justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-red-500/80" />
          <div className="terminal-dot bg-yellow-500/80" />
          <div className="terminal-dot bg-green-500/80" />
          <div className="ml-3 flex items-center gap-1.5 text-slate-500 text-xs">
            <Terminal size={12} />
            <span>{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={running}
            className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-40"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={handlePlay}
            disabled={running || done}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zrok-500/20 hover:bg-zrok-500/30 text-zrok-400 text-xs font-mono transition-all disabled:opacity-40"
          >
            <Play size={11} fill="currentColor" />
            {done ? 'Done' : running ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="terminal-body min-h-40 max-h-96 overflow-y-auto space-y-0.5">
        {lines.length === 0 && !running && (
          <p className="text-slate-600 italic text-sm">Click Run to start the simulation...</p>
        )}
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`font-mono text-sm leading-6 ${colorMap[line.type]}`}
          >
            {line.type === 'cmd'
              ? <><span className="text-zrok-600 select-none">&gt; </span>{line.text}</>
              : line.text
            }
          </motion.div>
        ))}

        {/* Typing indicator */}
        {typingCmd && (
          <div className="font-mono text-sm text-zrok-400 leading-6">
            <span className="text-zrok-600 select-none">&gt; </span>
            {typingCmd}
            <span className="animate-blink border-r-2 border-zrok-400 ml-0.5">&nbsp;</span>
          </div>
        )}

        {/* Done indicator */}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-1.5 text-zrok-500 text-xs"
          >
            <ChevronRight size={12} />
            <span>Session complete</span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
