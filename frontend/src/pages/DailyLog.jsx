import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import DailyLogForm from '../components/forms/DailyLogForm';
import StatusBadge from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import Loading from '../components/common/Loading';
import ConfirmModal from '../components/common/ConfirmModal';
import * as dailyLogService from '../services/dailyLogService';
import { formatDate, formatWeight } from '../utils/helpers';
import { exportToCSV, formatDailyLogsForExport } from '../utils/exportUtils';

const DailyLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingLog, setEditingLog] = useState(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, logId: null });
  const logsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, [currentPage, startDate, endDate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await dailyLogService.getDailyLogs(logsPerPage, currentPage);
      let filteredLogs = response.logs || [];
      
      // Apply date range filter
      if (startDate || endDate) {
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.date);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          
          if (start && end) {
            return logDate >= start && logDate <= end;
          } else if (start) {
            return logDate >= start;
          } else if (end) {
            return logDate <= end;
          }
          return true;
        });
      }
      
      setLogs(filteredLogs);
      setTotalPages(response.totalPages || 1);
      
      // Calculate metrics from latest log
      if (response.logs && response.logs.length > 0) {
        const latestLog = response.logs[0];
        setCalculatedMetrics({
          dailyChange: latestLog.dailyChange,
          sevenDayAverage: latestLog.sevenDayAverage,
          status: latestLog.status,
        });
      }
    } catch (err) {
      toast.error('Failed to load daily logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setEditingLog(null);
    fetchLogs();
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setDeleteModal({ isOpen: true, logId: id });
  };

  const confirmDelete = async () => {
    try {
      await dailyLogService.deleteDailyLog(deleteModal.logId);
      toast.success('Daily log deleted successfully');
      fetchLogs();
    } catch (err) {
      toast.error('Failed to delete daily log');
    }
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
  };

  const getStatusVariant = (status) => {
    if (!status) return 'neutral';
    if (status.includes('Going Up')) return 'success';
    if (status.includes('Too Slow')) return 'warning';
    if (status.includes('Dropping') || status.includes('Too Fast')) return 'danger';
    return 'neutral';
  };

  const getStatusDescription = (status) => {
    switch (true) {
      case !status || status === 'No data' || status === 'No Data':
        return 'Not enough data yet to determine trend.';
      case status.includes('Going Up'):
        return 'Healthy weekly gain (≈ 0.2–0.5 kg/week).';
      case status.includes('Too Slow'):
        return 'Weight gain is slower than target (< 0.2 kg/week).';
      case status.includes('Dropping'):
        return 'Weight is decreasing (≤ 0 kg/week).';
      case status.includes('Too Fast'):
        return 'Weight is increasing faster than target (> 0.5 kg/week).';
      default:
        return 'Trend information unavailable.';
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all logs for export
      const response = await dailyLogService.getDailyLogs(10000, 1);
      const formattedData = formatDailyLogsForExport(response.logs || []);
      const filename = `daily-logs-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(formattedData, filename);
      toast.success('Daily logs exported successfully!');
    } catch (err) {
      toast.error('Failed to export daily logs');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Daily Log</h1>
            <p className="text-neutral-600 text-sm mt-1">
              {editingLog ? 'Edit your daily entry' : 'Log your daily weight, nutrition, and gym attendance'}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <span className="material-icons text-sm mr-1">download</span>
            Export CSV
          </Button>
        </div>

        {/* Daily Log Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {editingLog ? 'Edit Entry' : "Today's Entry"}
            </h2>
            {editingLog && (
              <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>
          <DailyLogForm onSuccess={handleSuccess} initialData={editingLog} />
        </div>

        {/* Calculated Metrics */}
        {calculatedMetrics && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card">
              <h3 className="text-sm font-medium text-neutral-700 mb-1">Daily Change</h3>
              <p className="text-2xl font-bold text-neutral-900">
                {calculatedMetrics.dailyChange !== null && calculatedMetrics.dailyChange !== undefined
                  ? `${calculatedMetrics.dailyChange > 0 ? '+' : ''}${calculatedMetrics.dailyChange.toFixed(2)} kg`
                  : 'N/A'}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-neutral-700 mb-1">7-Day Average</h3>
              <p className="text-2xl font-bold text-neutral-900">
                {calculatedMetrics.sevenDayAverage
                  ? formatWeight(calculatedMetrics.sevenDayAverage)
                  : 'N/A'}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-neutral-700 mb-1">Status</h3>
              <StatusBadge
                variant={getStatusVariant(calculatedMetrics.status)}
                title={getStatusDescription(calculatedMetrics.status)}
              >
                {calculatedMetrics.status || 'No data'}
              </StatusBadge>
            </div>
          </div>
        )}

        {/* Recent Entries Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Entries</h2>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <Input
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
              {(startDate || endDate) && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading label="Loading logs..." />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-neutral-600 text-sm text-center py-8">
              No entries yet. Start logging your daily progress!
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Weight</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Change</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Eggs</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">Gym</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">Creatine</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">Energy</th>
                      <th className="px-4 py-3 text-center font-medium text-neutral-700">Strength</th>
                      <th className="px-4 py-3 text-left font-medium text-neutral-700">Notes</th>
                      <th className="px-4 py-3 text-right font-medium text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 text-neutral-900">
                          {formatDate(log.date)}
                        </td>
                        <td className="px-4 py-3 text-neutral-900 font-medium">
                          {formatWeight(log.weight)}
                        </td>
                        <td className={(() => {
                          const change = log.dailyChange;
                          const base = 'px-4 py-3 font-medium';
                          if (change === null || change === undefined) return `${base} text-neutral-500`;
                          if (change > 0) return `${base} text-success-600`;
                          if (change < 0) return `${base} text-danger-600`;
                          return `${base} text-neutral-500`;
                        })()}>
                          {(() => {
                            const change = log.dailyChange;
                            if (change === null || change === undefined) return '—';
                            const sign = change > 0 ? '+' : '';
                            return `${sign}${change.toFixed(2)} kg`;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-neutral-700">{log.eggsConsumed || 0}</td>
                        <td className="px-4 py-3 text-center">
                          {log.gymAttendance ? (
                            <span className="text-success-600">✓</span>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.creatineIntake ? (
                            <span className="text-success-600">✓</span>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-neutral-700">
                          {log.energyLevel || '—'}
                        </td>
                        <td className="px-4 py-3 text-center text-neutral-700">
                          {log.strengthInGym || '—'}
                        </td>
                        <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">
                          {log.notes || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEdit(log)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(log._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-neutral-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, logId: null })}
          onConfirm={confirmDelete}
          title="Delete Daily Log"
          message="Are you sure you want to delete this log entry? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default DailyLog;
