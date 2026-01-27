import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const GymDaysPieChart = ({ gymDays = 0, totalDays = 0 }) => {
  if (totalDays === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-500">No gym data available</p>
      </div>
    );
  }

  const restDays = totalDays - gymDays;
  const gymPercentage = ((gymDays / totalDays) * 100).toFixed(1);

  const data = [
    { name: 'Gym Days', value: gymDays, color: '#4caf50' },
    { name: 'Rest Days', value: restDays, color: '#d1d5db' },
  ];

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 p-4 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4 w-full">Gym Attendance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} days`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-primary-600">{gymPercentage}%</p>
        <p className="text-sm text-neutral-600">Gym Consistency</p>
      </div>
    </div>
  );
};

export default GymDaysPieChart;
