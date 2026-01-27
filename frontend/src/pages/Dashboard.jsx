import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
import WeightProgressionChart from '../components/charts/WeightProgressionChart';
import WeeklyGainChart from '../components/charts/WeeklyGainChart';
import GymDaysPieChart from '../components/charts/GymDaysPieChart';
import CreatineUsageChart from '../components/charts/CreatineUsageChart';
import * as dailyLogService from '../services/dailyLogService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    dailyLogs: [],
    currentWeight: null,
    sevenDayAverage: null,
    trend: null,
    gymDays: 0,
    totalDays: 0,
    personalRecords: 0,
    avgEnergy: 0,
    avgStrength: 0,
    weeklyGains: [],
    creatineDays: 0,
    creatineStarted: false,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch last 90 days of data for comprehensive dashboard
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      const response = await dailyLogService.getAllDailyLogs(1, 1000);
      const allLogs = response.dailyLogs || [];

      if (allLogs.length === 0) {
        setDashboardData(prev => ({ ...prev }));
        setLoading(false);
        return;
      }

      // Sort by date
      const sortedLogs = allLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Calculate metrics
      const currentWeight = sortedLogs[sortedLogs.length - 1].weight;
      const sevenDayLogs = sortedLogs.slice(-7);
      const sevenDayAverage = sevenDayLogs.length > 0
        ? (sevenDayLogs.reduce((sum, log) => sum + log.weight, 0) / sevenDayLogs.length).toFixed(2)
        : currentWeight;

      // Determine trend
      const prevWeight = sortedLogs.length > 1 ? sortedLogs[sortedLogs.length - 2].weight : currentWeight;
      const trend = currentWeight > prevWeight ? 'Going Up' : currentWeight < prevWeight ? 'Going Down' : 'Stable';

      // Gym consistency
      const gymDays = sortedLogs.filter(log => log.gymAttendance).length;
      const totalDays = sortedLogs.length;

      // Creatine tracking
      const creatineDays = sortedLogs.filter(log => log.creatineTaken).length;
      const creatineStarted = creatineDays > 0;

      // Average energy and strength
      const validEnergyLogs = sortedLogs.filter(log => log.energyLevel);
      const avgEnergy = validEnergyLogs.length > 0
        ? (validEnergyLogs.reduce((sum, log) => sum + log.energyLevel, 0) / validEnergyLogs.length).toFixed(1)
        : 0;

      const validStrengthLogs = sortedLogs.filter(log => log.strengthLevel);
      const avgStrength = validStrengthLogs.length > 0
        ? (validStrengthLogs.reduce((sum, log) => sum + log.strengthLevel, 0) / validStrengthLogs.length).toFixed(1)
        : 0;

      // Calculate weekly gains
      const weeklyGains = calculateWeeklyGains(sortedLogs);

      setDashboardData({
        dailyLogs: sortedLogs,
        currentWeight: currentWeight.toFixed(2),
        sevenDayAverage: sevenDayAverage,
        trend,
        gymDays,
        totalDays,
        personalRecords: 0, // Will fetch from workout logs later
        avgEnergy,
        avgStrength,
        weeklyGains,
        creatineDays,
        creatineStarted,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyGains = (logs) => {
    if (logs.length < 7) return [];

    const weeks = [];
    for (let i = 0; i < logs.length; i += 7) {
      const weekLogs = logs.slice(i, Math.min(i + 7, logs.length));
      if (weekLogs.length > 0) {
        const startWeight = weekLogs[0].weight;
        const endWeight = weekLogs[weekLogs.length - 1].weight;
        const gain = endWeight - startWeight;
        weeks.push({
          week: Math.floor(i / 7) + 1,
          gain,
        });
      }
    }
    return weeks;
  };

  const calculateProjection = () => {
    if (dashboardData.weeklyGains.length === 0) return null;

    const avgWeeklyGain = dashboardData.weeklyGains.reduce((sum, w) => sum + w.gain, 0) / dashboardData.weeklyGains.length;
    const targetWeight = 60;
    const currentWeight = parseFloat(dashboardData.currentWeight);
    const remainingGain = targetWeight - currentWeight;
    const weeksToTarget = remainingGain > 0 ? Math.ceil(remainingGain / avgWeeklyGain) : 0;

    return {
      avgWeeklyGain: avgWeeklyGain.toFixed(2),
      weeksToTarget,
      targetDate: new Date(Date.now() + weeksToTarget * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  };

  if (loading) {
    return <Loading />;
  }

  const projection = calculateProjection();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 text-sm mt-1">Track your progress and view analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">Current Weight</p>
            <p className="text-2xl font-bold text-primary-600">{dashboardData.currentWeight} kg</p>
            <p className="text-xs text-neutral-500 mt-1">{dashboardData.trend}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">7-Day Average</p>
            <p className="text-2xl font-bold text-neutral-900">{dashboardData.sevenDayAverage} kg</p>
            <p className="text-xs text-neutral-500 mt-1">Trend baseline</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">Gym Consistency</p>
            <p className="text-2xl font-bold text-success-600">
              {dashboardData.totalDays > 0 ? Math.round((dashboardData.gymDays / dashboardData.totalDays) * 100) : 0}%
            </p>
            <p className="text-xs text-neutral-500 mt-1">{dashboardData.gymDays}/{dashboardData.totalDays} days</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-neutral-600 mb-1">Avg Energy/Strength</p>
            <p className="text-2xl font-bold text-neutral-900">{dashboardData.avgEnergy}/{dashboardData.avgStrength}</p>
            <p className="text-xs text-neutral-500 mt-1">Out of 5</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WeightProgressionChart data={dashboardData.dailyLogs} />
          <WeeklyGainChart data={dashboardData.weeklyGains} />
          <GymDaysPieChart gymDays={dashboardData.gymDays} totalDays={dashboardData.totalDays} />
          <CreatineUsageChart
            creatineDays={dashboardData.creatineDays}
            totalDays={dashboardData.totalDays}
            started={dashboardData.creatineStarted}
          />
        </div>

        {/* Projection Section */}
        {projection && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card">
              <p className="text-sm text-neutral-600 mb-1">Average Weekly Gain</p>
              <p className="text-2xl font-bold text-primary-600">{projection.avgWeeklyGain} kg</p>
              <p className="text-xs text-neutral-500 mt-1">Last {dashboardData.weeklyGains.length} weeks</p>
            </div>
            <div className="card">
              <p className="text-sm text-neutral-600 mb-1">Target Progress</p>
              <p className="text-2xl font-bold text-neutral-900">
                {((parseFloat(dashboardData.currentWeight) / 60) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-neutral-500 mt-1">Towards 60 kg</p>
            </div>
            <div className="card">
              <p className="text-sm text-neutral-600 mb-1">Estimated Date to 60 kg</p>
              <p className="text-2xl font-bold text-success-600">{projection.targetDate}</p>
              <p className="text-xs text-neutral-500 mt-1">{projection.weeksToTarget} weeks</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
