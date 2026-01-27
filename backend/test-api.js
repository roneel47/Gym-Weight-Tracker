/**
 * API Integration Test
 * Quick validation of all major endpoints
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let authToken = null;
let userId = null;
let dailyLogId = null;
let workoutLogId = null;

const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true, // Don't throw on any status
});

const printTest = (testName, status, details = '') => {
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${testName}: ${details}`);
};

const runTests = async () => {
  console.log('\n========================================');
  console.log('🧪 API Integration Tests');
  console.log('========================================\n');

  try {
    // 1. Health Check
    console.log('📌 Health Check:');
    let res = await api.get('/health');
    printTest('GET /health', res.status === 200 ? 'PASS' : 'FAIL', res.status);

    // 2. Authentication Tests
    console.log('\n📌 Authentication:');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test@12345';

    res = await api.post('/auth/register', {
      email: testEmail,
      password: testPassword,
      name: 'Test User',
    });
    printTest('POST /auth/register', res.status === 201 ? 'PASS' : 'FAIL', `Status ${res.status}`);
    if (res.data.token) {
      authToken = res.data.token;
      userId = res.data.user._id;
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    }

    res = await api.post('/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    printTest('POST /auth/login', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}`);

    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    res = await api.get('/auth/me', config);
    printTest('GET /auth/me', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}`);

    // 3. Daily Log Tests
    console.log('\n📌 Daily Logs:');
    const today = new Date().toISOString().split('T')[0];

    res = await api.post(
      '/daily-logs',
      {
        date: today,
        weight: 75.5,
        eggsConsumed: 8,
        gymAttendance: true,
        creatineIntake: false,
        energyLevel: 4,
        strengthInGym: 4,
        notes: 'Test entry',
      },
      config
    );
    printTest('POST /daily-logs', res.status === 201 ? 'PASS' : 'FAIL', `Status ${res.status}`);
    if (res.data.dailyLog) {
      dailyLogId = res.data.dailyLog._id;
    }

    res = await api.get('/daily-logs', config);
    printTest('GET /daily-logs', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}, Count: ${res.data.dailyLogs?.length || 0}`);

    if (dailyLogId) {
      res = await api.get(`/daily-logs/${dailyLogId}`, config);
      printTest('GET /daily-logs/:id', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}`);
    }

    res = await api.get(`/daily-logs/stats/weekly`, config);
    printTest('GET /daily-logs/stats/weekly', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}`);

    // 4. Workout Log Tests
    console.log('\n📌 Workout Logs:');

    res = await api.post(
      '/workout-logs',
      {
        date: today,
        exercises: [
          {
            exerciseName: 'Barbell Bench Press',
            muscleGroup: 'Chest',
            sets: 4,
            reps: 8,
            weightUsed: 100,
            personalRecord: true,
            notes: 'Great form',
          },
          {
            exerciseName: 'Dumbbell Flyes',
            muscleGroup: 'Chest',
            sets: 3,
            reps: 12,
            weightUsed: 30,
            personalRecord: false,
          },
        ],
      },
      config
    );
    printTest('POST /workout-logs', res.status === 201 ? 'PASS' : 'FAIL', `Status ${res.status}`);
    if (res.data.workoutLog) {
      workoutLogId = res.data.workoutLog._id;
    }

    res = await api.get('/workout-logs', config);
    printTest('GET /workout-logs', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}, Count: ${res.data.workoutLogs?.length || 0}`);

    if (workoutLogId) {
      res = await api.get(`/workout-logs/${workoutLogId}`, config);
      printTest('GET /workout-logs/:id', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}`);
    }

    res = await api.get('/workout-logs/stats/prs?startDate=2025-01-01&endDate=2026-12-31', config);
    printTest('GET /workout-logs/stats/prs', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}, PRs: ${res.data.prs?.length || 0}`);

    res = await api.get('/workout-logs/stats/volume?startDate=2025-01-01&endDate=2026-12-31', config);
    printTest('GET /workout-logs/stats/volume', res.status === 200 ? 'PASS' : 'FAIL', `Status ${res.status}`);

    console.log('\n========================================');
    console.log('✅ Tests Complete');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }

  process.exit(0);
};

// Wait for server to be ready, then run tests
setTimeout(runTests, 2000);
