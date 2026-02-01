import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
import Input from '../components/common/Input';
import { Button } from '../components/common/Button';
import * as dailyLogService from '../services/dailyLogService';

const CreatineAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [creatineStartDate, setCreatineStartDate] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    // Load saved creatine start date from localStorage
    const saved = localStorage.getItem('creatineStartDate');
    if (saved) {
      setCreatineStartDate(saved);
      setShowForm(false);
      calculateAnalysis(saved);
    }
  }, []);

  const calculateAnalysis = async (startDateStr) => {
    try {
      setLoading(true);
      
      const response = await dailyLogService.getDailyLogs(10000, 1);
      const allLogs = response.logs || [];

      if (allLogs.length === 0) {
        toast.error('No weight data available');
        setLoading(false);
        return;
      }

      const startDate = new Date(startDateStr);
      
      // Sort logs by date and filter
      const sortedLogs = allLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
      const preCreatineLogs = sortedLogs.filter(log => new Date(log.date) < startDate);
      const postCreatineLogs = sortedLogs.filter(log => new Date(log.date) >= startDate);

      if (preCreatineLogs.length < 7) {
        toast.warning('Need at least 7 days of pre-creatine data');
      }

      if (postCreatineLogs.length < 7) {
        toast.warning('Need at least 7 days of post-creatine data for analysis');
      }

      // Calculate pre-creatine metrics - Ensure sorted by date
      const sortedPreLogs = [...preCreatineLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
      const preWeightStart = sortedPreLogs.length > 0 ? sortedPreLogs[0].weight : 0;
      const preWeightEnd = sortedPreLogs.length > 0 ? sortedPreLogs[sortedPreLogs.length - 1].weight : 0;
      const preGain = preWeightEnd - preWeightStart;
      const preDays = preCreatineLogs.length;
      const preGainRate = preDays > 0 ? (preGain / preDays * 7).toFixed(2) : '0.00'; // per week
      const preEnergy = preCreatineLogs.filter(log => log.energyLevel).length > 0
        ? (preCreatineLogs.filter(log => log.energyLevel).reduce((sum, log) => sum + log.energyLevel, 0) / preCreatineLogs.filter(log => log.energyLevel).length).toFixed(1)
        : 0;
      const preStrength = preCreatineLogs.filter(log => log.strengthInGym).length > 0
        ? (preCreatineLogs.filter(log => log.strengthInGym).reduce((sum, log) => sum + log.strengthInGym, 0) / preCreatineLogs.filter(log => log.strengthInGym).length).toFixed(1)
        : 0;
      const preGymDays = preCreatineLogs.filter(log => log.gymAttendance).length;
      const preGymConsistency = preDays > 0 ? ((preGymDays / preDays) * 100).toFixed(0) : 0;

      // Calculate post-creatine metrics - Ensure sorted by date
      const sortedPostLogs = [...postCreatineLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
      const postWeightStart = sortedPostLogs.length > 0 ? sortedPostLogs[0].weight : 0;
      const postWeightEnd = sortedPostLogs.length > 0 ? sortedPostLogs[sortedPostLogs.length - 1].weight : 0;
      const postGain = postWeightEnd - postWeightStart;
      const postDays = postCreatineLogs.length;
      const postGainRate = postDays > 0 ? (postGain / postDays * 7).toFixed(2) : '0.00'; // per week
      const postEnergy = postCreatineLogs.filter(log => log.energyLevel).length > 0
        ? (postCreatineLogs.filter(log => log.energyLevel).reduce((sum, log) => sum + log.energyLevel, 0) / postCreatineLogs.filter(log => log.energyLevel).length).toFixed(1)
        : 0;
      const postStrength = postCreatineLogs.filter(log => log.strengthInGym).length > 0
        ? (postCreatineLogs.filter(log => log.strengthInGym).reduce((sum, log) => sum + log.strengthInGym, 0) / postCreatineLogs.filter(log => log.strengthInGym).length).toFixed(1)
        : 0;
      const postGymDays = postCreatineLogs.filter(log => log.gymAttendance).length;
      const postGymConsistency = postDays > 0 ? ((postGymDays / postDays) * 100).toFixed(0) : 0;

      // Calculate improvements
      const gainRateImprovement = ((postGainRate - preGainRate) / Math.abs(preGainRate || 1) * 100).toFixed(0);
      const energyImprovement = ((postEnergy - preEnergy) / (preEnergy || 1) * 100).toFixed(0);
      const strengthImprovement = ((postStrength - preStrength) / (preStrength || 1) * 100).toFixed(0);
      const gymConsistencyImprovement = postGymConsistency - preGymConsistency;

      // Determine verdict
      let verdict = 'Mixed Results';
      if (parseFloat(gainRateImprovement) > 20 || parseFloat(strengthImprovement) > 15) {
        verdict = 'Appears Effective';
      } else if (parseFloat(gainRateImprovement) < -20 || parseFloat(strengthImprovement) < -15) {
        verdict = 'No Noticeable Effect';
      }

      setAnalysis({
        startDate: startDateStr,
        preDays,
        postDays,
        pre: {
          gain: preGain.toFixed(2),
          gainRate: preGainRate,
          energy: preEnergy,
          strength: preStrength,
          gymConsistency: preGymConsistency,
        },
        post: {
          gain: postGain.toFixed(2),
          gainRate: postGainRate,
          energy: postEnergy,
          strength: postStrength,
          gymConsistency: postGymConsistency,
        },
        improvements: {
          gainRate: gainRateImprovement,
          energy: energyImprovement,
          strength: strengthImprovement,
          gymConsistency: gymConsistencyImprovement,
        },
        verdict,
      });
    } catch (error) {
      console.error('Failed to calculate analysis:', error);
      toast.error('Failed to calculate creatine analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleSetStartDate = () => {
    if (!creatineStartDate) {
      toast.error('Please select a creatine start date');
      return;
    }
    localStorage.setItem('creatineStartDate', creatineStartDate);
    setShowForm(false);
    calculateAnalysis(creatineStartDate);
  };

  const handleResetDate = () => {
    localStorage.removeItem('creatineStartDate');
    setCreatineStartDate('');
    setShowForm(true);
    setAnalysis(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Creatine Impact Analysis</h1>
          <p className="text-neutral-600 text-sm mt-1">Compare your progress before and after creatine</p>
        </div>

        {showForm ? (
          <div className="card max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Set Creatine Start Date</h3>
            <div className="space-y-3">
              <Input
                label="Creatine Start Date"
                type="date"
                value={creatineStartDate}
                onChange={(e) => setCreatineStartDate(e.target.value)}
                required
              />
              <Button
                onClick={handleSetStartDate}
                variant="primary"
                className="w-full"
              >
                Analyze Impact
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-neutral-600">
                Analysis from <span className="font-semibold">{new Date(analysis?.startDate).toLocaleDateString()}</span>
              </p>
              <Button
                onClick={handleResetDate}
                variant="secondary"
                size="sm"
              >
                Change Date
              </Button>
            </div>

            {analysis && (
              <>
                {/* Verdict Card */}
                <div className={`card border-l-4 ${
                  analysis.verdict === 'Appears Effective' ? 'border-success-500 bg-success-50' :
                  analysis.verdict === 'No Noticeable Effect' ? 'border-danger-500 bg-danger-50' :
                  'border-warning-500 bg-warning-50'
                }`}>
                  <p className="text-sm text-neutral-600 mb-1">Analysis Verdict</p>
                  <p className={`text-2xl font-bold ${
                    analysis.verdict === 'Appears Effective' ? 'text-success-600' :
                    analysis.verdict === 'No Noticeable Effect' ? 'text-danger-600' :
                    'text-warning-600'
                  }`}>
                    {analysis.verdict}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2">
                    Based on {analysis.preDays} days pre-creatine and {analysis.postDays} days post-creatine
                  </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Weight Gain Comparison */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weight Gain Speed</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Pre-Creatine</p>
                        <p className="text-xl font-bold text-neutral-900">{analysis.pre.gainRate} kg/week</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Post-Creatine</p>
                        <p className="text-xl font-bold text-primary-600">{analysis.post.gainRate} kg/week</p>
                      </div>
                      <div className={`text-sm font-semibold p-2 rounded ${
                        parseFloat(analysis.improvements.gainRate) > 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                      }`}>
                        {parseFloat(analysis.improvements.gainRate) > 0 ? '+' : ''}{analysis.improvements.gainRate}% change
                      </div>
                    </div>
                  </div>

                  {/* Energy Comparison */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Energy Levels</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Pre-Creatine</p>
                        <p className="text-xl font-bold text-neutral-900">{analysis.pre.energy}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Post-Creatine</p>
                        <p className="text-xl font-bold text-primary-600">{analysis.post.energy}/5</p>
                      </div>
                      <div className={`text-sm font-semibold p-2 rounded ${
                        parseFloat(analysis.improvements.energy) > 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                      }`}>
                        {parseFloat(analysis.improvements.energy) > 0 ? '+' : ''}{analysis.improvements.energy}% change
                      </div>
                    </div>
                  </div>

                  {/* Strength Comparison */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Strength Levels</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Pre-Creatine</p>
                        <p className="text-xl font-bold text-neutral-900">{analysis.pre.strength}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Post-Creatine</p>
                        <p className="text-xl font-bold text-primary-600">{analysis.post.strength}/5</p>
                      </div>
                      <div className={`text-sm font-semibold p-2 rounded ${
                        parseFloat(analysis.improvements.strength) > 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                      }`}>
                        {parseFloat(analysis.improvements.strength) > 0 ? '+' : ''}{analysis.improvements.strength}% change
                      </div>
                    </div>
                  </div>

                  {/* Gym Consistency Comparison */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Gym Consistency</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Pre-Creatine</p>
                        <p className="text-xl font-bold text-neutral-900">{analysis.pre.gymConsistency}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Post-Creatine</p>
                        <p className="text-xl font-bold text-primary-600">{analysis.post.gymConsistency}%</p>
                      </div>
                      <div className={`text-sm font-semibold p-2 rounded ${
                        parseFloat(analysis.improvements.gymConsistency) > 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                      }`}>
                        {parseFloat(analysis.improvements.gymConsistency) > 0 ? '+' : ''}{analysis.improvements.gymConsistency}% points
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="card bg-neutral-50">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Recommendation</h3>
                  <p className="text-neutral-700">
                    {analysis.verdict === 'Appears Effective'
                      ? 'Creatine appears to be having a positive impact on your progress. Continue with consistent usage and monitor results over time.'
                      : analysis.verdict === 'No Noticeable Effect'
                      ? 'Creatine does not appear to be significantly impacting your metrics. Consider evaluating your training and nutrition.'
                      : 'Results are mixed. Ensure consistent usage and adequate nutrition. Give it at least 4-6 weeks for full effects.'}
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CreatineAnalysis;
