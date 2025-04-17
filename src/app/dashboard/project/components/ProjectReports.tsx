import { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter, Users, MessageSquare } from 'lucide-react';
import { Project } from '@/components/dashboard/types';

interface ProjectReportsProps {
  project: Project;
}

// Mock data for charts
const activityData = [
  { date: 'Mon', count: 22 },
  { date: 'Tue', count: 15 },
  { date: 'Wed', count: 32 },
  { date: 'Thu', count: 27 },
  { date: 'Fri', count: 30 },
  { date: 'Sat', count: 11 },
  { date: 'Sun', count: 8 },
];

const messageData = [
  { category: 'User', count: 42, color: '#6366F1' },
  { category: 'Agent', count: 78, color: '#10B981' },
  { category: 'System', count: 14, color: '#F59E0B' },
];

export default function ProjectReports({ project }: ProjectReportsProps) {
  const [timeframe, setTimeframe] = useState('week');
  const [isExporting, setIsExporting] = useState(false);
  
  // In a real application, these would fetch from your database
  const totalMessages = 134;
  const activeUsers = 5;
  const avgResponseTime = '1.2s';
  
  // Find the maximum value in activity data for scaling
  const maxActivityValue = Math.max(...activityData.map(d => d.count));
  
  // Calculate total messages for the pie chart
  const totalMessageCount = messageData.reduce((sum, item) => sum + item.count, 0);
  
  // Export report handler (mock function)
  const handleExportReport = () => {
    setIsExporting(true);
    
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would generate and download a report
      
      // Create a dummy CSV
      const csvContent = `Project Report: ${project.name}\nDate: ${new Date().toLocaleDateString()}\n\nMetrics:\nTotal Messages,${totalMessages}\nActive Users,${activeUsers}\nAvg Response Time,${avgResponseTime}`;
      
      // Create a blob and download it
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };
  
  return (
    <div className="bg-[#252525] rounded-xl border border-[#313131] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-[#6366F1]" />
          <h2 className="text-xl font-medium">Project Reports</h2>
        </div>
        
        <div className="flex gap-3">
          <div className="flex bg-[#343131] rounded-md overflow-hidden">
            <button 
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 text-sm ${timeframe === 'week' ? 'bg-[#6366F1] text-white' : 'text-[#94A3B8]'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 text-sm ${timeframe === 'month' ? 'bg-[#6366F1] text-white' : 'text-[#94A3B8]'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1.5 text-sm ${timeframe === 'year' ? 'bg-[#6366F1] text-white' : 'text-[#94A3B8]'}`}
            >
              Year
            </button>
          </div>
          
          <button 
            onClick={handleExportReport}
            disabled={isExporting}
            className="px-3 py-1.5 border border-[#313131] hover:border-[#6366F1] text-white rounded-md transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Export</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#343131] border border-[#313131] rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#94A3B8]">Total Messages</h3>
            <MessageSquare size={16} className="text-[#6366F1]" />
          </div>
          <p className="text-2xl font-semibold">{totalMessages}</p>
          <div className="mt-2 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded-full inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>12% from last {timeframe}</span>
          </div>
        </div>
        
        <div className="bg-[#343131] border border-[#313131] rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#94A3B8]">Active Users</h3>
            <Users size={16} className="text-[#6366F1]" />
          </div>
          <p className="text-2xl font-semibold">{activeUsers}</p>
          <div className="mt-2 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded-full inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>3 new this {timeframe}</span>
          </div>
        </div>
        
        <div className="bg-[#343131] border border-[#313131] rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#94A3B8]">Avg Response Time</h3>
            <Calendar size={16} className="text-[#6366F1]" />
          </div>
          <p className="text-2xl font-semibold">{avgResponseTime}</p>
          <div className="mt-2 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded-full inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>0.3s faster</span>
          </div>
        </div>
      </div>
      
      {/* Activity chart */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Activity Over Time</h3>
          <div className="flex items-center gap-1 text-sm text-[#94A3B8]">
            <Filter size={14} />
            <span>Daily activity</span>
          </div>
        </div>
        
        <div className="bg-[#343131] border border-[#313131] rounded-md p-4">
          <div className="flex items-end h-48 gap-1">
            {activityData.map((day, index) => (
              <div key={index} className="flex-grow flex flex-col items-center">
                <div 
                  className="w-full bg-[#6366F1] rounded-t-sm" 
                  style={{ 
                    height: `${(day.count / maxActivityValue) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <div className="text-xs text-[#94A3B8] mt-2">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Message distribution */}
      <div>
        <div className="mb-4">
          <h3 className="font-medium">Message Distribution</h3>
        </div>
        
        <div className="bg-[#343131] border border-[#313131] rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pie chart visualization */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {messageData.reduce((acc, item, i) => {
                  const previousTotal = acc.total;
                  const percentage = (item.count / totalMessageCount) * 100;
                  const startAngle = (previousTotal / totalMessageCount) * 360;
                  const endAngle = startAngle + (percentage / 100) * 360;
                  
                  // Calculate coordinates for the slice
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                  
                  // Determine if the arc should be drawn as a large arc
                  const largeArcFlag = percentage > 50 ? 1 : 0;
                  
                  acc.elements.push(
                    <path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={item.color}
                    />
                  );
                  
                  return {
                    elements: acc.elements,
                    total: previousTotal + item.count
                  };
                }, { elements: [] as React.ReactNode[], total: 0 }).elements}
                
                {/* Center circle for donut chart */}
                <circle cx="50" cy="50" r="25" fill="#343131" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-[#94A3B8]">Total</div>
                  <div className="text-xl font-semibold">{totalMessageCount}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend and metrics */}
          <div className="col-span-2 flex flex-col justify-center">
            <div className="space-y-3">
              {messageData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-xs text-[#94A3B8]">
                      ({Math.round((item.count / totalMessageCount) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#444] text-sm text-[#94A3B8]">
              <p>
                {timeframe === 'week' ? 'Weekly' : timeframe === 'month' ? 'Monthly' : 'Yearly'} data shows 
                {messageData[0].count > messageData[1].count ? ' users send ' : ' agents respond with '}
                more messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 