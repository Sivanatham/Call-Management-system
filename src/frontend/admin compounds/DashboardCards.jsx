import React from 'react';
import { Users, UserCheck, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.customers || 0,
      icon: Users,
      color: 'blue',
      description: 'All customer calls'
    },
    {
      title: 'Completed Tasks',
      value: stats.completed || 0,
      icon: CheckCircle,
      color: 'green',
      description: 'Successfully connected'
    },
    {
      title: 'Pending Tasks',
      value: stats.pending || 0,
      icon: Clock,
      color: 'orange',
      description: 'Awaiting completion'
    },
    {
      title: 'Assigned Tasks',
      value: stats.assigned || 0,
      icon: UserCheck,
      color: 'purple',
      description: 'Assigned to employees'
    },
    {
      title: 'Unassigned Tasks',
      value: stats.unassigned || 0,
      icon: AlertCircle,
      color: 'red',
      description: 'Need assignment'
    },
    {
      title: 'Total Employees',
      value: stats.employees || 0,
      icon: UserCheck,
      color: 'indigo',
      description: 'Active employees'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate || 0}%`,
      icon: TrendingUp,
      color: 'teal',
      description: 'Overall performance'
    },
    {
      title: 'Total Teams',
      value: stats.teams || 0,
      icon: Users,
      color: 'pink',
      description: 'Active teams'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', iconBg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-50', iconBg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-50', iconBg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-50', iconBg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-200' },
      pink: { bg: 'bg-pink-50', iconBg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);
        
        return (
          <div
            key={index}
            className={`glass-effect rounded-xl p-6 card-hover border-2 ${colors.border} animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.iconBg} text-white`}>
                <Icon size={24} />
              </div>
            </div>
            
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {card.value}
            </p>
            
            <p className="text-xs text-gray-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
