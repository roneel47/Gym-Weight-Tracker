import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const WeeklyGainChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-500">No weekly gain data available</p>
      </div>
    );
  }

  // Determine color based on gain amount
  const getBarColor = (gain) => {
    if (gain < 0) return '#ef4444'; // Red if negative
    if (gain < 0.2) return '#eab308'; // Yellow if too slow
    if (gain > 0.5) return '#ef4444'; // Red if too fast
    return '#4caf50'; // Green if optimal (0.2-0.5)
  };

  const chartData = data.map((entry, index) => ({
    week: `W${index + 1}`,
    gain: parseFloat(entry.gain.toFixed(2)),
    originalWeek: entry.week,
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 p-4">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Weight Gain</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value.toFixed(2)} kg`, 'Gain']}
          />
          <Legend />
          <Bar dataKey="gain" name="Weight Gain (kg)" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.gain)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-neutral-600">Optimal (0.2-0.5 kg)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span className="text-neutral-600">Too Slow (&lt;0.2 kg)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-neutral-600">Too Fast (&gt;0.5 kg)</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyGainChart;
