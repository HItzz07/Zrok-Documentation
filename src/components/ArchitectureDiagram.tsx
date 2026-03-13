'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Node {
  id: string
  label: string
  x: number
  y: number
  color: string
  icon: string
}

interface Edge {
  from: string
  to: string
  label?: string
  animated?: boolean
}

const NODES: Node[] = [
  { id: 'dev',       label: 'Developer',       x: 80,  y: 200, color: '#16b46c', icon: '👨‍💻' },
  { id: 'local',     label: 'Local Service',   x: 200, y: 200, color: '#3b82f6', icon: '🖥️' },
  { id: 'backend',   label: 'zrok Backend',    x: 360, y: 140, color: '#8b5cf6', icon: '⚡' },
  { id: 'env',       label: 'Environment',     x: 360, y: 260, color: '#f59e0b', icon: '🌍' },
  { id: 'ziti',      label: 'OpenZiti Fabric', x: 520, y: 200, color: '#ec4899', icon: '🔐' },
  { id: 'frontend',  label: 'zrok Frontend',   x: 680, y: 140, color: '#16b46c', icon: '🌐' },
  { id: 'consumer',  label: 'Consumer',        x: 800, y: 200, color: '#06b6d4', icon: '🧑‍💻' },
]

const EDGES: Edge[] = [
  { from: 'dev',      to: 'local',    label: 'runs'            },
  { from: 'local',    to: 'backend',  label: 'share',   animated: true },
  { from: 'local',    to: 'env',      label: 'enable'          },
  { from: 'backend',  to: 'ziti',     label: 'tunnel',  animated: true },
  { from: 'env',      to: 'ziti',     label: 'auth'            },
  { from: 'ziti',     to: 'frontend', label: 'expose',  animated: true },
  { from: 'frontend', to: 'consumer', label: 'URL'             },
]

function getNode(id: string) { return NODES.find(n => n.id === id)! }

export default function ArchitectureDiagram() {
  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox="0 0 900 380"
        className="w-full"
        style={{ minWidth: 640 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="rgba(22,180,108,0.6)" />
          </marker>
          <marker id="arrow-animated" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#16b46c" />
          </marker>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#060b14" />
            <stop offset="100%" stopColor="#090f1b" />
          </linearGradient>
          <style>{`
            @keyframes dashFlow {
              to { stroke-dashoffset: -24; }
            }
            .flow-line {
              stroke-dasharray: 8 4;
              animation: dashFlow 1.2s linear infinite;
            }
            @keyframes nodeFloat {
              0%,100% { transform: translateY(0px); }
              50%      { transform: translateY(-4px); }
            }
            .node-group { cursor: pointer; }
            .node-group:hover circle { filter: url(#glow); }
          `}</style>
        </defs>

        {/* Background */}
        <rect width="900" height="380" fill="url(#bgGrad)" rx="16" />

        {/* Grid */}
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(22,180,108,0.04)" strokeWidth="0.5" />
        </pattern>
        <rect width="900" height="380" fill="url(#grid)" rx="16" />

        {/* Zone labels */}
        <rect x="16" y="16" width="290" height="348" rx="10" fill="rgba(22,180,108,0.03)" stroke="rgba(22,180,108,0.08)" strokeWidth="1" strokeDasharray="4 3" />
        <text x="30" y="36" fill="rgba(22,180,108,0.4)" fontSize="10" fontFamily="monospace">DEVELOPER SIDE</text>

        <rect x="480" y="16" width="404" height="348" rx="10" fill="rgba(139,92,246,0.03)" stroke="rgba(139,92,246,0.08)" strokeWidth="1" strokeDasharray="4 3" />
        <text x="494" y="36" fill="rgba(139,92,246,0.4)" fontSize="10" fontFamily="monospace">PUBLIC INTERNET</text>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const from = getNode(edge.from)
          const to   = getNode(edge.to)
          const mx   = (from.x + to.x) / 2
          const my   = (from.y + to.y) / 2 - 18
          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke={edge.animated ? '#16b46c' : 'rgba(22,180,108,0.25)'}
                strokeWidth={edge.animated ? 1.5 : 1}
                markerEnd={edge.animated ? 'url(#arrow-animated)' : 'url(#arrow)'}
                className={edge.animated ? 'flow-line' : ''}
              />
              {edge.label && (
                <text
                  x={mx} y={my}
                  textAnchor="middle"
                  fill="rgba(148,163,184,0.7)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {NODES.map((node) => (
          <g key={node.id} className="node-group">
            <circle
              cx={node.x} cy={node.y} r={32}
              fill={node.color + '18'}
              stroke={node.color}
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            <circle cx={node.x} cy={node.y} r={24} fill={node.color + '20'} />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16">{node.icon}</text>
            <text
              x={node.x} y={node.y + 50}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#16b46c" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
          Encrypted tunnel (OpenZiti)
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="rgba(22,180,108,0.4)" strokeWidth="1" /></svg>
          Control plane
        </div>
      </div>
    </div>
  )
}
