import React from 'react';
import { Clock, Users, PlaySquare, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export default function DashboardStats({ statsData }) {
  const stats = [
    {
      label: 'Total Watch Time',
      value: statsData?.totalWatchTime || '0h 0m',
      trend: 'Latest',
      icon: <Clock className="w-5 h-5 text-primary" />,
    },
    {
      label: 'Parties Hosted',
      value: statsData?.partiesHosted || '0',
      trend: 'All time',
      icon: <PlaySquare className="w-5 h-5 text-secondary" />,
    },
    {
      label: 'Friends Joined',
      value: statsData?.friendsJoined || '0',
      trend: 'Unique users',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
    },
    {
      label: 'Most Watched',
      value: 'YouTube',
      trend: 'Top Category',
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-card/50 backdrop-blur-xl border border-white/20 p-6 hover:bg-card/70 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-muted/50 rounded-xl border border-white/5">
              {stat.icon}
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-full border border-white/5">
              {stat.trend}
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
