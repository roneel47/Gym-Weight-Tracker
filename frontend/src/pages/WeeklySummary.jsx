import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
import StatusBadge from '../components/common/StatusBadge';
import * as dailyLogService from '../services/dailyLogService';

const WeeklySummary = () => {
  const [loading, setLoading] = useState(false);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [weeklySummary, setWeeklySummary] = useState(null);

  useEffect(() => {
    fetchWeeklySummary();
  }, [weekStart]);

  const fetchWeeklySummary = async () => {
    try {
      setLoading(true);
      const weekEnd = endOfWeek(weekStart);

      // Fetch daily logs for the week
      const response = await dailyLogService.getDailyLogs(1000, 1);
      const allLogs = response.dailyLogs || [];

      // Filter logs for current week
      const weekLogs = allLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      if (weekLogs.length === 0) {
        setWeeklySummary({
          weekStart: format(weekStart, 'MMM dd, yyyy'),
          weekEnd: format(weekEnd, 'MMM dd, yyyy'),
          totalDays: 0,
          logs: [],
        });
        return;
      }

      // Calculate metrics
      const startWeight = weekLogs[0].weight;
      const endWeight = weekLogs[weekLogs.length - 1].weight;
      const totalGain = endWeight - startWeight;
      const avgWeight = (weekLogs.reduce((sum, log) => sum + log.weight, 0) / weekLogs.length).toFixed(2);

      const gymDays = weekLogs.filter(log => log.gymAttendance).length;
      const restDays = weekLogs.length - gymDays;

      const totalEggs = weekLogs.reduce((sum, log) => sum + (log.eggs || 0), 0);
      const avgEggs = (totalEggs / weekLogs.length).toFixed(1);

      const creatineDays = weekLogs.filter(log => log.creatineTaken).length;
      const creatinePercentage = ((creatineDays / weekLogs.length) * 100).toFixed(0);

      const avgEnergy = weekLogs.filter(log => log.energyLevel).length > 0
        ? (weekLogs.filter(log => log.energyLevel).reduce((sum, log) => sum + log.energyLevel, 0) /
          weekLogs.filter(log => log.energyLevel).length).toFixed(1)
        : 'N/A';

      const avgStrength = weekLogs.filter(log => log.strengthLevel).length > 0
        ? (weekLogs.filter(log => log.strengthLevel).reduce((sum, log) => sum + log.strengthLevel, 0) /
          weekLogs.filter(log => log.strengthLevel).length).toFixed(1)
        : 'N/A';

      // Determine status
      let status = 'No Data';
      if (totalGain > 0.5) status = 'Too Fast';
      else if (totalGain >= 0.2 && totalGain <= 0.5) status = 'Going Up';
      else if (totalGain > 0) status = 'Too Slow';
      else if (totalGain < 0) status = 'Going Down';
      else status = 'Stable';

      setWeeklySummary({
        weekStart: format(weekStart, 'MMM dd, yyyy'),
        weekEnd: format(weekEnd, 'MMM dd, yyyy'),
        totalDays: weekLogs.length,
        startWeight: startWeight.toFixed(2),
        endWeight: endWeight.toFixed(2),
        totalGain: totalGain.toFixed(2),
        avgWeight,
        gymDays,
        restDays,
        totalEggs,
        avgEggs,
        creatineDays,
        creatinePercentage,
        avgEnergy,
        avgStrength,
        status,
        logs: weekLogs,
      });
    } catch (error) {
      console.error('Failed to fetch weekly summary:', error);
      toast.error('Failed to load weekly summary');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Week Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Weekly Summary</h1>
            <p className="text-neutral-600 text-sm mt-1">
              Week of {weeklySummary?.weekStart} to {weeklySummary?.weekEnd}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousWeek}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium text-neutral-700 transition"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextWeek}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium text-neutral-700 transition"
            >
              Next →
            </button>
          </div>
        </div>

        {weeklySummary && weeklySummary.totalDays === 0 ? (
          <div className="card text-center py-12">
            <p className="text-neutral-500">No data available for this week</p>
          </div>
        ) : (
          <>
            {/* Status Badge */}
            {weeklySummary && (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Weekly Status</p>
                  <StatusBadge status={weeklySummary.status} />
                </div>
              </div>
            )}

            {/* Weight Progression Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">Start Weight</p>
                <p className="text-2xl font-bold text-neutral-900">{weeklySummary?.startWeight} kg</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">End Weight</p>
                <p className="text-2xl font-bold text-neutral-900">{weeklySummary?.endWeight} kg</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Gain</p>
                <p className={`text-2xl font-bold ${parseFloat(weeklySummary?.totalGain) > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {weeklySummary?.totalGain} kg
                </p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">Weekly Average</p>
                <p className="text-2xl font-bold text-primary-600">{weeklySummary?.avgWeight} kg</p>
              </div>
            </div>

            {/* Training Section */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Training</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Gym Days</span>
                    <span className="text-lg font-bold text-success-600">{weeklySummary?.gymDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Rest Days</span>
                    <span className="text-lg font-bold text-neutral-600">{weeklySummary?.restDays} days</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-success-500 h-2 rounded-full"
                      style={{ width: `${((weeklySummary?.gymDays || 0) / (weeklySummary?.totalDays || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Nutrition</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Eggs</span>
                    <span className="text-lg font-bold text-neutral-900">{weeklySummary?.totalEggs} eggs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Average/Day</span>
                    <span className="text-lg font-bold text-neutral-900">{weeklySummary?.avgEggs} eggs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplementation & Performance */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Supplementation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Creatine Days</span>
                    <span className="text-lg font-bold text-primary-600">{weeklySummary?.creatineDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Consistency</span>
                    <span className="text-lg font-bold text-neutral-900">{weeklySummary?.creatinePercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Avg Energy</span>
                    <span className="text-lg font-bold text-neutral-900">{weeklySummary?.avgEnergy}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Avg Strength</span>
                    <span className="text-lg font-bold text-neutral-900">{weeklySummary?.avgStrength}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Breakdown Table */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Daily Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Weight</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Gym</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Eggs</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Creatine</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Energy</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Strength</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {weeklySummary?.logs.map((log, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                          {format(new Date(log.date), 'EEE, MMM dd')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {log.weight.toFixed(2)} kg
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {log.gymAttendance ? '✓' : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {log.eggs || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {log.creatineTaken ? '✓' : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {log.energyLevel || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {log.strengthLevel || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WeeklySummary;
