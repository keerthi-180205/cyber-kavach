import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import { attackMapPoints } from '../data/mockData';

// Free TopoJSON hosted by react-simple-maps
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map severity → colors
const severityColor = {
  CRITICAL: { dot: '#f472b6', glow: 'rgba(236,72,153,0.50)', line: 'rgba(236,72,153,0.45)' },
  HIGH:     { dot: '#f87171', glow: 'rgba(239,68,68,0.45)',  line: 'rgba(239,68,68,0.40)' },
  MEDIUM:   { dot: '#fbbf24', glow: 'rgba(245,158,11,0.45)', line: 'rgba(245,158,11,0.40)' },
  LOW:      { dot: '#34d399', glow: 'rgba(16,185,129,0.45)', line: 'rgba(16,185,129,0.40)' },
};

// Geo-coordinates for attack origins (lat/lng)
const attackOrigins = [
  { id: 1, coordinates: [-95.71,  37.09], ip: '203.0.113.45',  type: 'Brute Force Attack',  severity: 'HIGH',     location: 'United States' },
  { id: 2, coordinates: [37.62,   55.75], ip: '198.51.100.23',  type: 'Reverse Shell',       severity: 'CRITICAL', location: 'Russia' },
  { id: 3, coordinates: [10.45,   51.16], ip: '185.220.101.1',  type: 'Network Anomaly',     severity: 'MEDIUM',   location: 'Germany' },
  { id: 4, coordinates: [104.19,  35.86], ip: '45.33.32.156',   type: 'Brute Force Attack',  severity: 'HIGH',     location: 'China' },
  { id: 5, coordinates: [2.21,    46.60], ip: '91.189.88.142',  type: 'Failed Logins',       severity: 'HIGH',     location: 'France' },
];

// Our server location (target of attacks)
const SERVER_LOCATION = [77.59, 12.97]; // Bangalore, India

export default function AttackMap() {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Re-trigger pulse animation periodically
  useEffect(() => {
    const interval = setInterval(() => setPulseKey((k) => k + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setIsExpanded(false); };
    if (isExpanded) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isExpanded]);

  return (
    <>
    {/* Fullscreen backdrop */}
    {isExpanded && (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={() => setIsExpanded(false)}
      />
    )}
    <div className={`glass-card p-5 transition-all duration-300 ease-in-out ${
      isExpanded
        ? 'fixed inset-4 z-50 overflow-auto rounded-2xl shadow-2xl shadow-black/50'
        : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-white">Live Attack Map</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-kavach-muted bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.06]">
            {attackOrigins.length} active sources
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden bg-[#060a12] border border-white/[0.04]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [40, 25] }}
          style={{ width: '100%', height: 'auto' }}
          viewBox="0 0 800 450"
        >
          {/* Countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rpiKey || geo.rsmKey}
                  geography={geo}
                  fill="rgba(56,189,248,0.08)"
                  stroke="rgba(148,163,184,0.25)"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', fill: 'rgba(56,189,248,0.15)' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Attack lines — from origin to server */}
          {attackOrigins.map((point) => {
            const colors = severityColor[point.severity] || severityColor.HIGH;
            return (
              <Line
                key={`line-${point.id}`}
                from={point.coordinates}
                to={SERVER_LOCATION}
                stroke={colors.line}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="5 3"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* Server marker */}
          <Marker coordinates={SERVER_LOCATION}>
            <circle r={10} fill="rgba(59,130,246,0.20)" />
            <circle r={6} fill="rgba(59,130,246,0.40)" />
            <circle r={3.5} fill="#60a5fa" />
            <text
              textAnchor="middle"
              y={-12}
              style={{ fontFamily: 'Inter', fill: '#60a5fa', fontSize: '7px', fontWeight: 600 }}
            >
              SERVER
            </text>
          </Marker>

          {/* Attack origin markers */}
          {attackOrigins.map((point) => {
            const colors = severityColor[point.severity] || severityColor.HIGH;
            return (
              <Marker
                key={point.id}
                coordinates={point.coordinates}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring */}
                <circle r={14} fill={colors.glow} className="attack-dot" opacity={0.5} />
                {/* Mid ring */}
                <circle r={7} fill={colors.glow} />
                {/* Core dot */}
                <circle r={4} fill={colors.dot} />
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Hover tooltip (HTML overlay for better styling) */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{ top: '12px', right: '12px' }}
          >
            <div className="bg-[#111827]/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-xl min-w-[180px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: (severityColor[hoveredPoint.severity] || severityColor.HIGH).dot }}
                />
                <span className="text-white text-xs font-semibold">{hoveredPoint.ip}</span>
              </div>
              <div className="text-kavach-muted text-[10px] space-y-0.5">
                <p>Type: <span className="text-kavach-text">{hoveredPoint.type}</span></p>
                <p>Severity: <span className="text-kavach-text">{hoveredPoint.severity}</span></p>
                <p>Origin: <span className="text-kavach-text">{hoveredPoint.location}</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend + Expand Button */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-[10px] text-kavach-muted">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-kavach-muted">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] text-kavach-muted">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] text-kavach-muted">Server</span>
          </div>
        </div>

        {/* Expand / Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                     bg-white/[0.06] border border-white/[0.08] text-kavach-muted
                     hover:bg-kavach-accent/20 hover:text-kavach-accent hover:border-kavach-accent/30
                     transition-all duration-200 cursor-pointer"
          title={isExpanded ? 'Minimize map' : 'Maximize map'}
        >
          {isExpanded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Minimize
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Expand
            </>
          )}
        </button>
      </div>
    </div>
    </>
  );
}
