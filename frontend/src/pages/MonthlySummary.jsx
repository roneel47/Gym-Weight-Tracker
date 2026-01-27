import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
import StatusBadge from '../components/common/StatusBadge';
import * as dailyLogService from '../services/dailyLogService';

const MonthlySummary = () => {
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [previousMonth, setPreviousMonth] = useState(null);

  useEffect(() => {
    fetchMonthlySummary();
  }, [currentMonth]);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const monthEnd = endOfMonth(currentMonth);
      const prevMonthStart = startOfMonth(subMonths(currentMonth, 1));
      const prevMonthEnd = endOfMonth(subMonths(currentMonth, 1));

      // Fetch all logs
      const response = await dailyLogService.getAllDailyLogs(1, 1000);
      const allLogs = response.dailyLogs || [];

      // Filter logs for current month
      const monthLogs = allLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= currentMonth && logDate <= monthEnd;
      });

      // Filter logs for previous month (for comparison)
      const prevMonthLogs = allLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= prevMonthStart && logDate <= prevMonthEnd;
      });

      if (monthLogs.length === 0) {
        setMonthlySummary({
          monthName: format(currentMonth, 'MMMM yyyy'),
          totalDays: 0,
          logs: [],
        });
        setPreviousMonth(null);
        return;
      }

      // Current month calculations
      const startWeight = monthLogs[0].weight;
      const endWeight = monthLogs[monthLogs.length - 1].weight;
      const totalGain = endWeight - startWeight;
      const weeksCount = Math.ceil(monthLogs.length / 7);
      const avgWeeklyGain = (totalGain / weeksCount).toFixed(2);

      const gymDays = monthLogs.filter(log => log.gymAttendance).length;
      const expectedGymDays = Math.ceil(monthLogs.length / 7) * 4; // Assuming 4 gym days per week
      const gymConsistency = ((gymDays / monthLogs.length) * 100).toFixed(0);

      const creatineUsed = monthLogs.some(log => log.creatineTaken);
      const creatineDays = monthLogs.filter(log => log.creatineTaken).length;

      const totalEggs = monthLogs.reduce((sum, log) => sum + (log.eggs || 0), 0);
      const avgEggs = (totalEggs / monthLogs.length).toFixed(1);

      const avgEnergy = monthLogs.filter(log => log.energyLevel).length > 0
        ? (monthLogs.filter(log => log.energyLevel).reduce((sum, log) => sum + log.energyLevel, 0) /
          monthLogs.filter(log => log.energyLevel).length).toFixed(1)
        : 'N/A';

      const avgStrength = monthLogs.filter(log => log.strengthLevel).length > 0
        ? (monthLogs.filter(log => log.strengthLevel).reduce((sum, log) => sum + log.strengthLevel, 0) /
          monthLogs.filter(log => log.strengthLevel).length).toFixed(1)
        : 'N/A';

      // Determine status
      let status = 'No Data';
      if (totalGain > 1.5) status = 'Too Fast';
      else if (totalGain >= 0.8 && totalGain <= 1.5) status = 'Going Up';
      else if (totalGain > 0) status = 'Too Slow';
      else if (totalGain < 0) status = 'Going Down';
      else status = 'Stable';

      // Previous month calculations
      let prevMonthData = null;
      if (prevMonthLogs.length > 0) {
        const prevStartWeight = prevMonthLogs[0].weight;
        const prevEndWeight = prevMonthLogs[prevMonthLogs.length - 1].weight;
        const prevTotalGain = prevEndWeight - prevStartWeight;
        const prevGymDays = prevMonthLogs.filter(log => log.gymAttendance).length;
        const prevGymConsistency = ((prevGymDays / prevMonthLogs.length) * 100).toFixed(0);

        prevMonthData = {
          month: format(subMonths(currentMonth, 1), 'MMMM yyyy'),
          totalGain: prevTotalGain.toFixed(2),
          gymConsistency: prevGymConsistency,
          avgEggs: (prevMonthLogs.reduce((sum, log) => sum + (log.eggs || 0), 0) / prevMonthLogs.length).toFixed(1),
        };
      }

      setMonthlySummary({
        monthName: format(currentMonth, 'MMMM yyyy'),
        totalDays: monthLogs.length,
        startWeight: startWeight.toFixed(2),
        endWeight: endWeight.toFixed(2),
        totalGain: totalGain.toFixed(2),
        weeksCount,
        avgWeeklyGain,
        gymDays,
        expectedGymDays,
        gymConsistency,
        creatineUsed,
        creatineDays,
        totalEggs,
        avgEggs,
        avgEnergy,
        avgStrength,
        status,
        logs: monthLogs,
      });
      setPreviousMonth(prevMonthData);
    } catch (error) {
      console.error('Failed to fetch monthly summary:', error);
      toast.error('Failed to load monthly summary');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Month Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Monthly Summary</h1>
            <p className="text-neutral-600 text-sm mt-1">{monthlySummary?.monthName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium text-neutral-700 transition"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium text-neutral-700 transition"
            >
              Next →
            </button>
          </div>
        </div>

        {monthlySummary && monthlySummary.totalDays === 0 ? (
          <div className="card text-center py-12">
            <p className="text-neutral-500">No data available for this month</p>
          </div>
        ) : (
          <>
            {/* Status Badge */}
            {monthlySummary && (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Monthly Status</p>
                  <StatusBadge status={monthlySummary.status} />
                </div>
              </div>
            )}

            {/* Weight Progression Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">Start Weight</p>
                <p className="text-2xl font-bold text-neutral-900">{monthlySummary?.startWeight} kg</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">End Weight</p>
                <p className="text-2xl font-bold text-neutral-900">{monthlySummary?.endWeight} kg</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Gain</p>
                <p className={`text-2xl font-bold ${parseFloat(monthlySummary?.totalGain) > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {monthlySummary?.totalGain} kg
                </p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-neutral-600 mb-1">Avg Weekly Gain</p>
                <p className="text-2xl font-bold text-primary-600">{monthlySummary?.avgWeeklyGain} kg</p>
              </div>
            </div>

            {/* Training Consistency */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Training Consistency</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600">Gym Days</span>
                    <span className="text-lg font-bold text-success-600">{monthlySummary?.gymDays}/{monthlySummary?.totalDays}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-success-500 h-2 rounded-full"
                      style={{ width: `${((monthlySummary?.gymDays || 0) / (monthlySummary?.totalDays || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{monthlySummary?.gymConsistency}% consistency</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600">Expected vs Actual</span>
                    <span className="text-lg font-bold text-neutral-900">
                      {monthlySummary?.gymDays}/{monthlySummary?.expectedGymDays}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${Math.min(((monthlySummary?.gymDays || 0) / (monthlySummary?.expectedGymDays || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplementation & Nutrition */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Supplementation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Creatine Used</span>
                    <span className="text-lg font-bold text-primary-600">{monthlySummary?.creatineUsed ? 'Yes' : 'No'}</span>
                  </div>
                  {monthlySummary?.creatineUsed && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Days</span>
                      <span className="text-lg font-bold text-neutral-900">{monthlySummary?.creatineDays} days</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Nutrition</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Eggs</span>
                    <span className="text-lg font-bold text-neutral-900">{monthlySummary?.totalEggs} eggs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Average/Day</span>
                    <span className="text-lg font-bold text-neutral-900">{monthlySummary?.avgEggs} eggs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Avg Energy</span>
                    <span className="text-lg font-bold text-neutral-900">{monthlySummary?.avgEnergy}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Avg Strength</span>
                    <span className="text-lg font-bold text-neutral-900">{monthlySummary?.avgStrength}/5</span>
                  </div>
                </div>
              </div>

              {previousMonth && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Previous Month Comparison</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">{previousMonth.month}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Total Gain</span>
                      <span className="text-neutral-900">{previousMonth.totalGain} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Gym Consistency</span>
                      <span className="text-neutral-900">{previousMonth.gymConsistency}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MonthlySummary;
