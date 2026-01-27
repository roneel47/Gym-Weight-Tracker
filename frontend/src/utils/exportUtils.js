// Utility functions for exporting data to CSV

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas, quotes, or newlines
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDailyLogsForExport = (logs) => {
  return logs.map(log => ({
    Date: new Date(log.date).toLocaleDateString(),
    'Weight (kg)': log.weight,
    'Eggs Consumed': log.eggsConsumed || 0,
    'Gym Attendance': log.gymAttendance ? 'Yes' : 'No',
    'Creatine Taken': log.creatineTaken || log.creatineIntake ? 'Yes' : 'No',
    'Energy Level': log.energyLevel || 'N/A',
    'Strength Level': log.strengthInGym || 'N/A',
    'Notes': log.notes || ''
  }));
};

export const formatWorkoutLogsForExport = (workouts) => {
  const rows = [];
  
  workouts.forEach(workout => {
    const workoutDate = new Date(workout.date).toLocaleDateString();
    
    if (workout.exercises && workout.exercises.length > 0) {
      workout.exercises.forEach(exercise => {
        rows.push({
          Date: workoutDate,
          Exercise: exercise.exerciseName,
          'Muscle Group': exercise.muscleGroup,
          Sets: exercise.sets,
          Reps: exercise.reps,
          'Weight (kg)': exercise.weightUsed,
          'Personal Record': exercise.personalRecord ? 'Yes' : 'No',
          Volume: exercise.sets * exercise.reps * exercise.weightUsed,
          Notes: exercise.notes || ''
        });
      });
    }
  });
  
  return rows;
};
