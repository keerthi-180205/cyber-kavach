import React from 'react';
import { severityColors, alertTypeIcons } from '../data/mockData';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function SeverityBadge({ severity }) {
  const colors = severityColors[severity] || severityColors.MEDIUM;
  return (
    <span className={`severity-badge ${colors.bg} ${colors.text} border ${colors.border}`}>
      {severity}
    </span>
  );
}

export default function RecentAlerts({ alerts }) {
  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
      </div>

      {/* Alert List */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {alerts.map((alert, idx) => (
          <div
            key={alert.id || idx}
            className={`flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-200 ${idx === 0 ? 'alert-flash' : ''}`}
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
              alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                ? 'bg-red-500/10'
                : alert.severity === 'MEDIUM'
                ? 'bg-amber-500/10'
                : 'bg-emerald-500/10'
            }`}>
              {alertTypeIcons[alert.type] || '⚠️'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{alert.label}</p>
              <p className="text-xs text-kavach-muted truncate mt-0.5">{alert.description}</p>
            </div>

            {/* Server */}
            <div className="hidden xl:block text-xs text-kavach-muted whitespace-nowrap">
              {alert.server}
            </div>

            {/* Time */}
            <div className="text-xs text-kavach-muted whitespace-nowrap">
              {formatTime(alert.timestamp)}
            </div>

            {/* Badge */}
            <SeverityBadge severity={alert.severity} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <a href="#" className="text-xs font-medium text-kavach-accent hover:text-cyan-300 transition-colors">
          View All Alerts →
        </a>
      </div>
    </div>
  );
}
