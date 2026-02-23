import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

const TasksTable = ({ status, title }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Responsive resize handler with debouncing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    // Initial check after mount
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Load tasks on status change
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/calls/', {
        params: { status: status, limit: 100 }
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Status badge class generator
  const getStatusClass = (status) => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-2">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl pt-2 shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div className="p-3 sm:p-6  ms-2 border-b text-center border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-2xl  font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Total: {tasks.length} tasks
        </p>
      </div>

      {/* MOBILE: Enhanced Card Layout */}
      {isMobile ? (
        <div className="p-3 sm:p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-16 sm:py-20 text-gray-500 dark:text-gray-400">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm sm:text-base">No tasks found</p>
              <p className="text-xs mt-1 opacity-75">Try adjusting your filters</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200"
              >
                <div className="flex flex-col gap-3 mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight">
                    {task.customer_name || 'Unknown Customer'}
                  </h4>
                  
                  {/* Priority and Status - SEPARATE LINES ON MOBILE */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                    <div className="flex justify-end">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityClass(task.priority)} min-w-[44px] text-center`}>
                        {task.priority || 'LOW'}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(task.status)} min-w-[52px] text-center`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="flex items-start gap-2.5 pt-2">
                    <span className="text-gray-500 mt-0.5 flex-shrink-0">📞</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded-md flex-1 min-w-0">
                      {task.phone || 'N/A'}
                    </span>
                  </div>
                  
                  {task.campaign && (
                    <div className="flex items-start gap-2.5 pt-2">
                      <span className="text-gray-500 mt-0.5 flex-shrink-0">🏷️</span>
                      <span className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm flex-1 min-w-0">
                        {task.campaign}
                      </span>
                    </div>
                  )}
                  
                  {task.remarks && (
                    <div className="flex items-start gap-2.5 pt-2">
                      <span className="text-gray-500 mt-0.5 flex-shrink-0">💬</span>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1 min-w-0 line-clamp-3">
                        {task.remarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* TABLET/DESKTOP: Enhanced Responsive Table */
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="w-full min-w-[650px] sm:min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className={`px-3 sm:px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isTablet ? 'max-w-[140px] truncate' : ''}`}>
                  Customer
                </th>
                <th className={`px-3 sm:px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isTablet ? 'max-w-[120px] truncate' : ''}`}>
                  Phone
                </th>
                <th className="px-3 sm:px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className={`px-3 sm:px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isTablet ? 'hidden lg:table-cell' : ''}`}>
                  Campaign
                </th>
                <th className={`px-3 sm:px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isTablet ? 'max-w-[160px] truncate' : ''}`}>
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-xl">📋</span>
                    </div>
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-150">
                    <td className={`px-3 sm:px-4 lg:px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 ${isTablet ? 'max-w-[140px] truncate' : ''}`}>
                      {task.customer_name || 'Unknown'}
                    </td>
                    <td className={`px-3 sm:px-4 lg:px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100 ${isTablet ? 'max-w-[120px] truncate' : ''}`}>
                      {task.phone || 'N/A'}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityClass(task.priority)}`}>
                        {task.priority || 'LOW'}
                      </span>
                    </td>
                    <td className={`px-3 sm:px-4 lg:px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${isTablet ? 'hidden lg:table-cell' : ''}`}>
                      {task.campaign || '-'}
                    </td>
                    <td className={`px-3 sm:px-4 lg:px-6 py-4 text-sm text-gray-600 dark:text-gray-400 ${isTablet ? 'max-w-[160px] truncate line-clamp-2' : ''}`}>
                      {task.remarks || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile empty state spacing fix */}
      {isMobile && tasks.length === 0 && (
        <div className="p-4 pb-12" />
      )}
    </div>
  );
};

export default TasksTable;
