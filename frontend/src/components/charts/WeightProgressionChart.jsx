import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const WeightProgressionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-500">No weight data available</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    weight: entry.weight,
    average: entry.sevenDayAverage || null,
  }));

  return (
    <div className="w-full h-96 bg-white rounded-lg border border-neutral-200 p-4">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weight Progression</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => (value ? value.toFixed(2) : 'N/A')}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#1976d2"
            dot={{ fill: '#1976d2', r: 4 }}
            activeDot={{ r: 6 }}
            name="Daily Weight (kg)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#4caf50"
            strokeDasharray="5 5"
            dot={false}
            name="7-Day Average (kg)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightProgressionChart;
