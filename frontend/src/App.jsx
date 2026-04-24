import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import ThreatsChart from './components/ThreatsChart';
import AttackMap from './components/AttackMap';
import RecentAlerts from './components/RecentAlerts';
import TopAttackers from './components/TopAttackers';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const { alerts, isConnected, counters } = useWebSocket();
  const [timeRange, setTimeRange] = useState('24H');

  const timeRanges = ['1H', '6H', '24H', '7D', '30D'];

  return (
    <div className="flex min-h-screen bg-[#0a0e17]">
      {/* Sidebar */}
      <Sidebar isConnected={isConnected} />

      {/* Main Content */}
      <main className="ml-[260px] flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <Header />

        {/* Time Range Selector */}
        <div className="flex items-center justify-end mb-4 -mt-2">
          <div className="flex items-center bg-white/[0.04] rounded-lg border border-white/[0.06] p-0.5">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-kavach-accent text-white shadow-lg shadow-kavach-accent/20'
                    : 'text-kavach-muted hover:text-kavach-text'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <StatCards counters={counters} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ThreatsChart />
          <AttackMap />
        </div>

        {/* Bottom Row — Alerts + Top Attackers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <RecentAlerts alerts={alerts} />
          <TopAttackers />
        </div>
      </main>
    </div>
  );
}
