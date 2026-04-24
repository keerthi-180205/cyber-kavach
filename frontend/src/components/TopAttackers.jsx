import React, { useState, useEffect } from 'react';
import { topAttackers as mockTopAttackers } from '../data/mockData';

const BACKEND_URL = 'http://localhost:8000';

export default function TopAttackers() {
  const [attackers, setAttackers] = useState(mockTopAttackers);

  useEffect(() => {
    fetch(`${BACKEND_URL}/top-attackers`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAttackers(data);
        }
      })
      .catch(() => {});

    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/top-attackers`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAttackers(data);
          }
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Top Attacking IPs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">IP Address</th>
              <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">Attack Count</th>
              <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">Location</th>
              <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {attackers.map((attacker, idx) => (
              <tr key={attacker.ip} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-mono font-medium">
                    {attacker.ip}
                  </span>
                </td>
                <td className="py-3 text-sm font-semibold text-white">{attacker.count}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2 text-sm text-kavach-text">
                    <span className="text-base">{attacker.flag}</span>
                    {attacker.location}
                  </div>
                </td>
                <td className="py-3 text-xs text-kavach-muted">{attacker.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <a href="#" className="text-xs font-medium text-kavach-accent hover:text-cyan-300 transition-colors">
          View All Attackers →
        </a>
      </div>
    </div>
  );
}
