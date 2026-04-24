import React, { useState } from 'react';
import { attackMapPoints } from '../data/mockData';

// Simplified world map SVG paths (continents outline)
const worldPaths = [
  // North America
  "M120,80 L160,60 L200,55 L240,60 L280,80 L290,100 L280,130 L270,150 L250,170 L230,175 L200,160 L180,165 L160,155 L140,150 L130,130 L120,110 Z",
  // South America
  "M200,180 L220,175 L240,185 L250,210 L260,240 L255,270 L240,290 L225,300 L210,295 L200,275 L195,250 L190,220 L195,200 Z",
  // Europe
  "M460,60 L480,55 L510,58 L530,65 L540,80 L535,95 L520,105 L505,110 L490,105 L475,100 L465,90 L458,75 Z",
  // Africa
  "M470,120 L500,115 L530,120 L545,140 L550,170 L545,200 L535,230 L520,250 L500,260 L480,255 L465,240 L455,210 L450,180 L455,150 L460,135 Z",
  // Asia
  "M540,50 L580,40 L640,35 L700,40 L740,55 L750,80 L745,100 L730,120 L700,135 L670,140 L640,138 L610,130 L580,120 L560,110 L545,95 L540,75 Z",
  // Australia
  "M690,210 L730,205 L760,210 L775,225 L770,245 L755,255 L730,260 L710,255 L695,240 L690,225 Z",
];

export default function AttackMap() {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Attack Map</h3>
        <select className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-kavach-muted focus:outline-none focus:border-kavach-accent/30 cursor-pointer">
          <option>World Wide</option>
          <option>North America</option>
          <option>Europe</option>
          <option>Asia</option>
        </select>
      </div>

      {/* Map */}
      <div className="relative">
        <svg
          viewBox="0 0 850 320"
          className="w-full h-auto"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Continents */}
          {worldPaths.map((d, idx) => (
            <path
              key={idx}
              d={d}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          ))}

          {/* Connection lines from attack points */}
          {attackMapPoints.map((point) => (
            <line
              key={`line-${point.id}`}
              x1={point.x}
              y1={point.y}
              x2={point.x + 60}
              y2={point.y - 30}
              stroke={point.severity === 'CRITICAL' ? 'rgba(236,72,153,0.3)' : 'rgba(239,68,68,0.2)'}
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          ))}

          {/* Attack points */}
          {attackMapPoints.map((point) => (
            <g
              key={point.id}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              {/* Outer glow */}
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill={point.severity === 'CRITICAL' ? 'rgba(236,72,153,0.2)' : 'rgba(239,68,68,0.2)'}
                className="attack-dot"
              />
              {/* Inner dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={point.severity === 'CRITICAL' ? '#ec4899' : '#ef4444'}
              />
            </g>
          ))}

          {/* Tooltip */}
          {hoveredPoint && (
            <g>
              <rect
                x={hoveredPoint.x + 10}
                y={hoveredPoint.y - 50}
                width="160"
                height="48"
                rx="6"
                fill="#111827"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text x={hoveredPoint.x + 20} y={hoveredPoint.y - 32} fill="#e6edf3" fontSize="11" fontWeight="600" fontFamily="Inter">
                {hoveredPoint.ip}
              </text>
              <text x={hoveredPoint.x + 20} y={hoveredPoint.y - 16} fill="#7d8590" fontSize="9" fontFamily="Inter">
                {hoveredPoint.type}
              </text>
            </g>
          )}
        </svg>

        {/* Legend dots */}
        <div className="flex items-center gap-5 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-kavach-muted">High (10+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] text-kavach-muted">Medium (5-10)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-kavach-muted">Low (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] text-kavach-muted">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
