import React, { useState, useEffect } from 'react';

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
}

const severityColors = {
  HIGH:     'text-red-400 bg-red-500/10',
  CRITICAL: 'text-pink-400 bg-pink-500/10',
  MEDIUM:   'text-amber-400 bg-amber-500/10',
  LOW:      'text-emerald-400 bg-emerald-500/10',
};

export default function TopAttackers() {
  const [attackers, setAttackers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttackers = () => {
    fetch('/api/attackers')
      .then((r) => r.json())
      .then((data) => { setAttackers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttackers();
    const interval = setInterval(fetchAttackers, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Top Attacking IPs</h3>
        <span className="text-[10px] text-kavach-muted bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.06]">
          {attackers.length} unique IPs
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-xs text-kavach-muted text-center py-6">Loading...</p>
        ) : attackers.length === 0 ? (
          <p className="text-xs text-kavach-muted text-center py-6">No attackers detected yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">IP Address</th>
                <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">Attacks</th>
                <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">Type</th>
                <th className="text-left text-[11px] font-semibold text-kavach-muted uppercase tracking-wider pb-3">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {attackers.map((a, idx) => (
                <tr
                  key={a.ip}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-mono font-medium">
                      {a.ip}
                    </span>
                  </td>
                  <td className="py-3 text-sm font-semibold text-white">{a.count}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${severityColors[a.severity] || severityColors.MEDIUM}`}>
                      {(a.type || 'unknown').replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-kavach-muted">{formatTime(a.last_seen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-right">
        <a href="#" className="text-xs font-medium text-kavach-accent hover:text-cyan-300 transition-colors">
          View All Attackers →
        </a>
      </div>
    </div>
  );
}
