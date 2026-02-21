import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';

const DashboardCharts = ({ stats }) => {
  const statusData = [
    { label: 'Completed', value: stats.completed || 0, color: '#10b981' },
    { label: 'Pending', value: stats.pending || 0, color: '#f59e0b' }
  ];

  const assignmentData = [
    { label: 'Assigned', value: stats.assigned || 0, color: '#8b5cf6' },
    { label: 'Unassigned', value: stats.unassigned || 0, color: '#ef4444' }
  ];

  const total = stats.completed + stats.pending || 1;
  const completedPercent = (stats.completed / total) * 100;
  const pendingPercent = (stats.pending / total) * 100;

  const assignTotal = stats.assigned + stats.unassigned || 1;
  const assignedPercent = (stats.assigned / assignTotal) * 100;
  const unassignedPercent = (stats.unassigned / assignTotal) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Task Status Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Task Status Distribution</h3>
        </div>
        
        <div className="space-y-4">
          {statusData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.label === 'Completed' ? completedPercent : pendingPercent}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-bold text-green-600">{Math.round(completedPercent)}%</span>
          </div>
        </div>
      </div>

      {/* Assignment Status Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <PieChart className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Assignment Distribution</h3>
        </div>
        
        <div className="space-y-4">
          {assignmentData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.label === 'Assigned' ? assignedPercent : unassignedPercent}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Assignment Rate</span>
            <span className="font-bold text-purple-600">{Math.round(assignedPercent)}%</span>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Performance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{stats.customers || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total Tasks</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{stats.completed || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">{stats.pending || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{stats.employees || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Employees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
