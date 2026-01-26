# Gym Progress Tracker - Product Requirements Document

## 1. Executive Summary

**Project Name:** Gym Progress Tracker (Dirty Bulk Edition)

**Objective:** Create a comprehensive MERN stack (MongoDB, Express.js, React, Node.js) web application for tracking body weight, nutrition, gym performance, and supplementation to monitor the effectiveness of a dirty bulking program and analyze the impact of creatine supplementation.

**User Profile:** 21-year-old male, starting weight 49.5 kg, aiming to gain weight and strength through bulking and gym training (starting February 2, 2026).

**Success Criteria:** A simple, error-free web application that provides clear insights into weight progression, gym consistency, and supplement effects without requiring complex data entry or showing errors when data is incomplete.

---

## 2. Business Context & Problem Statement

### User Situation
- **Starting Point:** 49.5 kg, below desired weight
- **Goal:** Systematic weight and strength gain through dirty bulking
- **Constraint:** Currently lacks structured tracking system
- **Challenge:** Need to differentiate progress before and after creatine supplementation

### Key Problems to Solve
1. No centralized system to track daily metrics consistently
2. Difficulty identifying whether bulking strategy is working optimally
3. Inability to quantify impact of creatine supplementation
4. Manual calculations prevent easy progress visualization
5. Multiple daily weighings cause confusion (user needs once-daily standard)

### Why This Matters
Understanding whether the bulking protocol is effective and how creatine influences weight gain, strength, and energy helps optimize training for better results.

---

## 3. User Stories & Acceptance Criteria

### Story 1: Daily Data Entry
**As a** user  
**I want to** record my daily progress metrics in one place  
**So that** I can consistently track my bulking journey

**Acceptance Criteria:**
- [ ] System records date automatically
- [ ] User can input morning weight (kg)
- [ ] User can input number of eggs eaten (whole number)
- [ ] User can toggle gym attendance (Yes/No)
- [ ] User can toggle creatine intake (Yes/No)
- [ ] User can rate energy level (1-5 scale)
- [ ] User can rate gym strength (1-5 scale)
- [ ] User can add optional notes
- [ ] All toggles use checkboxes/switches, not text input
- [ ] Form validates that weight is positive number
- [ ] Form validates that eggs is non-negative whole number
- [ ] Form allows empty notes field without error

### Story 2: Automatic Weight Analysis
**As a** user  
**I want to** see my weight trends automatically calculated  
**So that** I can understand if my bulking is on track

**Acceptance Criteria:**
- [ ] System calculates daily weight change (current - previous day)
- [ ] System calculates 7-day rolling average weight
- [ ] System displays status: "Going Up", "Too Slow", "Dropping", "Too Fast"
- [ ] Status shows blank if insufficient data (< 7 days)
- [ ] No error messages appear when data is missing
- [ ] Calculations update automatically when new data is entered

### Story 3: Workout Logging
**As a** user  
**I want to** log individual workout details  
**So that** I can track exercise progression and PRs

**Acceptance Criteria:**
- [ ] User can record date, exercise name, sets, reps, weight used
- [ ] User can mark if personal record (PR) was achieved
- [ ] System follows gym split schedule (Monday-Saturday pattern)
- [ ] PR toggle uses checkbox, not text
- [ ] Workout logs link to daily gym attendance entry
- [ ] User can view workout history

### Story 4: Weekly Summary
**As a** user  
**I want to** see a weekly progress snapshot  
**So that** I can assess my weekly performance

**Acceptance Criteria:**
- [ ] Summary shows start-of-week weight
- [ ] Summary shows end-of-week weight
- [ ] Summary shows total weekly weight gain
- [ ] Summary shows average eggs per day
- [ ] Summary shows number of gym days
- [ ] Summary shows number of creatine days
- [ ] Summary displays status (Under Eating / On Track / Gaining Too Fast)
- [ ] Updates automatically when weekly data is complete

### Story 5: Monthly Summary
**As a** user  
**I want to** see comprehensive monthly progress  
**So that** I can evaluate long-term bulking effectiveness

**Acceptance Criteria:**
- [ ] Summary shows start-of-month weight
- [ ] Summary shows end-of-month weight
- [ ] Summary shows total monthly weight gain
- [ ] Summary shows average weekly gain
- [ ] Summary calculates gym consistency percentage
- [ ] Summary indicates whether creatine was used that month
- [ ] All metrics roll up from daily/weekly data

### Story 6: Creatine Impact Analysis
**As a** user  
**I want to** compare metrics before and after creatine use  
**So that** I can quantify creatine's effectiveness

**Acceptance Criteria:**
- [ ] System identifies date creatine use began
- [ ] System segments data into "Pre-Creatine" and "Post-Creatine" periods
- [ ] Comparison shows weight gain speed (kg/week)
- [ ] Comparison shows average strength rating before vs after
- [ ] Comparison shows average energy level before vs after
- [ ] Comparison shows number of PRs in each period
- [ ] Calculations update automatically as new data is added

### Story 7: Progress Dashboard
**As a** user  
**I want to** visualize my progress with charts  
**So that** I can quickly see trends and patterns

**Acceptance Criteria:**
- [ ] Line graph displays daily weight and 7-day average
- [ ] Bar graph shows weekly weight gain (kg)
- [ ] Pie chart shows gym days vs rest days
- [ ] Pie chart shows creatine days vs non-creatine days
- [ ] Charts auto-update when data changes
- [ ] Charts remain blank until sufficient data exists
- [ ] Charts are readable and color-coded

---

## 4. Core Features & Requirements

### 4.1 Daily Tracking Sheet
**Input Fields:**
- Date (auto-populated)
- Morning Weight (kg, decimal)
- Eggs Consumed (whole number)
- Gym Attendance (Toggle)
- Creatine Taken (Toggle)
- Energy Level (1-5 scale)
- Strength in Gym (1-5 scale)
- Notes (free text, optional)

**Automatic Calculations:**
- Daily weight change (current weight - previous weight)
- 7-day rolling average weight
- Weight trend status

### 4.2 Workout Log Sheet
**Input Fields:**
- Date
- Exercise Name
- Sets (whole number)
- Reps (whole number)
- Weight Used (kg, decimal)
- Personal Record (Toggle)

**Data Organization:**
- Organized by date
- Filterable by muscle group based on gym split
- Linked to daily gym attendance

### 4.3 Weekly Summary Sheet
**Automatic Calculations:**
- Week start weight (Monday or Week 1)
- Week end weight (Sunday or Week 7)
- Total weight gained (absolute)
- Average eggs per day
- Gym days count
- Creatine days count
- Status classification

**Status Logic:**
- Under Eating: < 0.2 kg gain/week
- On Track: 0.2-0.5 kg gain/week
- Gaining Too Fast: > 0.5 kg gain/week

### 4.4 Monthly Summary Sheet
**Automatic Calculations:**
- Month start weight (Day 1)
- Month end weight (Last day)
- Total weight gained
- Average weekly gain (monthly gain / 4)
- Gym consistency (gym days / expected training days × 100%)
- Creatine usage indicator

### 4.5 Creatine Comparison Sheet
**Tracking:**
- Identifies creatine start date (user-input)
- Segments all data into pre/post periods
- Calculates comparative metrics:
  - Weight gain speed (kg/week) in each period
  - Average strength rating per period
  - Average energy level per period
  - PR count per period
  - Gym consistency per period

### 4.6 Dashboard (Visualization Sheet)
**Charts:**
1. **Weight Progression Line Graph**
   - X-axis: Date
   - Y-axis: Weight (kg)
   - Series 1: Daily weight (points)
   - Series 2: 7-day average (line)

2. **Weekly Gain Bar Chart**
   - X-axis: Week number
   - Y-axis: Weight gained (kg)

3. **Gym Attendance Pie Chart**
   - Gym Days vs Rest Days
   - Percentage breakdown

4. **Creatine Usage Pie Chart**
   - Creatine Days vs Non-Creatine Days
   - Percentage breakdown

---

## 5. Gym Split Schedule

**Training Structure (6 Days / 1 Rest):**
- **Monday:** Back and Biceps
- **Tuesday:** Legs and Shoulders
- **Wednesday:** Chest and Triceps
- **Thursday:** Back and Biceps
- **Friday:** Legs and Shoulders
- **Saturday:** Chest and Triceps
- **Sunday:** Rest

---

## 6. Technical Specifications

### Platform & Technology
- **Primary System:** MERN Stack Web Application
- **Frontend:** React.js with React Router, Recharts for visualizations
- **Backend:** Node.js with Express.js REST API
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Frontend (Vercel/Netlify), Backend (Railway/Render), Database (MongoDB Atlas)

### Application Structure
```
Gym Progress Tracker (MERN)
├── Frontend (React)
│   ├── Pages
│   │   ├── Dashboard (main overview)
│   │   ├── Daily Log (data entry)
│   │   ├── Workout Log (exercise tracking)
│   │   ├── Weekly Summary (analytics)
│   │   ├── Monthly Summary (analytics)
│   │   ├── Creatine Analysis (comparison)
│   │   └── Settings (user preferences)
│   └── Components
│       ├── Forms (input components)
│       ├── Charts (data visualizations)
│       └── UI (buttons, badges, etc.)
├── Backend (Node.js + Express)
│   ├── Routes (API endpoints)
│   ├── Controllers (business logic)
│   ├── Models (MongoDB schemas)
│   ├── Middleware (auth, validation)
│   └── Utils (calculations, helpers)
└── Database (MongoDB)
    ├── Users (authentication)
    ├── DailyLogs (daily entries)
    ├── WorkoutLogs (exercise data)
    └── Settings (user preferences)
```

### Data Validation Rules
- Weight field: Must be positive decimal (0-200 kg)
- Eggs field: Must be non-negative integer (0-50)
- Energy/Strength: Must be integer 1-5
- Date: Auto-populated with current date
- Toggles: Boolean (true/false)
- Validation enforced on both frontend and backend

### Calculation Logic (Backend)
1. **Daily Change Calculation:**
   ```javascript
   const dailyChange = currentWeight - previousDayWeight;
   return dailyChange || null; // null if no previous data
   ```

2. **7-Day Average Calculation:**
   ```javascript
   const getLast7Days = await DailyLog.find({ userId, date: { $gte: sevenDaysAgo } });
   if (getLast7Days.length < 7) return null;
   const average = getLast7Days.reduce((sum, log) => sum + log.weight, 0) / 7;
   return parseFloat(average.toFixed(2));
   ```

3. **Status Calculation:**
   ```javascript
   if (!sevenDayAvg) return null;
   if (dailyChange < 0) return 'Dropping';
   if (dailyChange < 0.2) return 'Too Slow';
   if (dailyChange > 0.5) return 'Too Fast';
   return 'Going Up';
   ```

4. **Error Handling:**
   - Return `null` instead of errors when data is insufficient
   - Frontend displays blank/placeholder when receiving `null`
   - All calculations wrapped in try-catch blocks

### Error Handling
- Missing data displays as blank cells, never as error messages
- All formulas check for sufficient data before calculation
- System gracefully handles incomplete weeks/months

---

## 7. User Interface & User Experience

### Design Principles
- **Simplicity:** Minimal inputs, maximum clarity
- **Focus:** One primary task per sheet
- **Consistency:** Same toggle/checkbox style throughout
- **Accessibility:** Large, readable fonts; clear labels

### Input Methods
- **Text Fields:** Weight, Eggs, Exercise names, Notes
- **Toggles/Checkboxes:** Gym attendance, Creatine, PR achievement
- **Dropdowns:** Exercise names (optional, for consistency)
- **Sliders or Number Fields:** Energy and Strength (1-5)

### Color Coding (Optional Enhancement)
- **Green:** On track weight gain
- **Yellow:** Too slow or need attention
- **Red:** Dropping weight or gaining too fast
- **Blue:** Creatine usage indicators
- **Gray:** Rest days

---

## 8. Data Flow & Integration

### Daily Entry Workflow
1. User opens Daily Log sheet
2. System auto-populates today's date
3. User enters: Weight, Eggs, Energy, Strength, Notes
4. User toggles: Gym attendance, Creatine
5. System auto-calculates: Daily change, 7-day average, Status
6. Optional: User adds workout log entries

### Weekly Aggregation
- Every Sunday, Weekly Summary auto-calculates from Daily Log
- Formulas reference Daily Log range for that week
- Status classification determines if on track

### Monthly Aggregation
- Monthly Summary auto-calculates from Weekly Summary
- Gym consistency percentage calculated from Daily Log gym days

### Creatine Analysis
- User identifies creatine start date
- System segments all historical data
- Comparisons calculate automatically

### Dashboard Updates
- All charts reference base data tables
- Charts update automatically when new data enters
- Blank until sufficient data exists (7+ days for weekly, 28+ days for monthly)

---

## 9. Data Validation & Quality Rules

### Input Constraints
| Field | Type | Valid Range | Required | Validation |
|-------|------|-------------|----------|------------|
| Date | Date | Any date | Yes (Auto) | Auto-populated |
| Weight | Decimal | 0-200 kg | Yes | Must be positive |
| Eggs | Integer | 0-50 | Yes | Non-negative whole number |
| Gym | Boolean | Yes/No | Yes | Checkbox/Toggle |
| Creatine | Boolean | Yes/No | Yes | Checkbox/Toggle |
| Energy | Integer | 1-5 | Yes | Dropdown or number field |
| Strength | Integer | 1-5 | Yes | Dropdown or number field |
| Notes | Text | Any | No | Free text |
| Exercise | Text | Any | Yes (Workout Log) | Predefined list (optional) |
| Sets | Integer | 1-10 | Yes | Positive whole number |
| Reps | Integer | 1-100 | Yes | Positive whole number |
| Weight Used | Decimal | 0-500 kg | Yes | Positive decimal |
| PR | Boolean | Yes/No | Yes | Checkbox/Toggle |

### Error Prevention
- Dropdown lists for predefined values (exercises, ratings)
- Range validation on numeric fields
- Required field enforcement
- Data type matching (no text in number fields)

---

## 10. Success Metrics & KPIs

### Primary Metrics
| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Consistent Data Entry | 100% daily logs | Days with entries / Total days | Daily |
| Weekly Weight Gain | 0.2-0.5 kg/week | End weight - Start weight / 7 | Weekly |
| Gym Consistency | 85-100% | Gym days / Training days scheduled | Weekly |
| System Reliability | 0 errors | System error count | Continuous |
| Dashboard Accuracy | 100% | Manual verification vs automated calcs | Weekly |

### Secondary Metrics
| Metric | Purpose | Tracked | Frequency |
|--------|---------|---------|-----------|
| Creatine Impact | Quantify supplement effectiveness | Weight gain speed, strength, energy | Monthly |
| Strength Progression | Track gym performance | PRs count, workout volume | Weekly |
| Energy Patterns | Identify optimal conditions | Avg energy before/after creatine | Monthly |
| Gym Split Adherence | Monitor training consistency | Exercises per muscle group | Weekly |

### Data Validation
- Weekly summary must match daily log totals (±1% margin for rounding)
- Monthly summary must match weekly summary totals
- Creatine period comparisons must be mathematically sound

---

## 11. Feature Prioritization & Phases

### Phase 1: MVP (Weeks 1-2) - ESSENTIAL
- Daily Log sheet with all required fields
- Basic automatic calculations (daily change, 7-day average, status)
- Workout Log sheet
- Simple data validation

### Phase 2: Analytics (Weeks 3-4) - HIGH PRIORITY
- Weekly Summary sheet
- Monthly Summary sheet
- Dashboard with charts (line graph, bar graph, pie charts)

### Phase 3: Advanced (Weeks 5+) - MEDIUM PRIORITY
- Creatine Analysis sheet (pre/post comparison)
- Enhanced data visualization
- Performance benchmarking
- Export/backup capabilities

---

## 12. Constraints & Dependencies

### Constraints
- **Time Zone:** UTC stored in database, displayed in user's local timezone
- **Device:** Responsive web app (desktop, tablet, mobile browsers)
- **Data Storage:** MongoDB Atlas (512MB free tier, upgradable)
- **Update Frequency:** Real-time updates via REST API
- **Offline Access:** Limited offline functionality (PWA with service workers)

### Dependencies
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for data sync
- User account (email + password authentication)
- Consistent daily weigh-in schedule
- Accurate manual data entry

### Assumptions
- User will weigh self once daily, morning after bathroom
- User will maintain consistent gym schedule
- Creatine start date will be clearly defined
- No retroactive bulk data entry needed initially

---

## 13. Testing & Validation Strategy

### Unit Testing
- [ ] Weight calculations with edge cases (decimal precision)
- [ ] 7-day average with partial weeks (6 days, 8 days)
- [ ] Status classification with exact threshold values
- [ ] Date formatting across months and years

### Integration Testing
- [ ] Daily Log → Weekly Summary data propagation
- [ ] Weekly Summary → Monthly Summary aggregation
- [ ] Dashboard chart updates when data changes
- [ ] Creatine analysis correctly segments data

### User Acceptance Testing
- [ ] User enters 30 days of sample data
- [ ] Verify all calculations match manual verification
- [ ] Test with missing days (gaps in data)
- [ ] Verify status classifications are accurate
- [ ] Check that no error messages appear with incomplete data

### Edge Cases to Test
- Missing weight entry for one day
- Negative weight change (weight loss during bulk)
- Zero eggs eaten on a day
- Week spanning two months
- First week with <7 days of data
- Month with <4 complete weeks

---

## 14. Risk Analysis & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| User stops daily logging | Complete system failure | Medium | Set reminders, make entry simple |
| Data entry errors (typos) | Inaccurate analysis | Medium | Validation rules, dropdown lists |
| Formula errors | Wrong calculations | Low | Thorough testing, backup verification |
| Accidental data deletion | Loss of historical data | Low | Automatic Google Sheets backups |
| Chart rendering issues | Dashboard unusable | Low | Test on multiple devices/browsers |
| Misinterpretation of status | Wrong conclusions | Medium | Clear documentation of formulas |

---

## 15. Implementation Timeline

### Week 1-2 (MVP)
- Day 1-2: Design spreadsheet structure
- Day 3-4: Build Daily Log sheet with formulas
- Day 5-6: Build Workout Log sheet
- Day 7-8: Testing and refinement
- Day 9-10: Documentation

### Week 3-4 (Analytics)
- Day 11-12: Build Weekly Summary sheet
- Day 13-14: Build Monthly Summary sheet
- Day 15-16: Create Dashboard with charts
- Day 17-18: Integration testing
- Day 19-20: Final refinement and documentation

### Week 5+ (Optional Advanced)
- Creatine Analysis sheet
- Performance benchmarking
- Additional visualizations

---

## 16. Documentation & Training

### User Documentation
- Quick start guide (1 page)
- Formula explanations for interested users
- FAQ for common scenarios
- Troubleshooting guide

### System Documentation
- Sheet structure overview
- Formula reference guide
- Calculation methodology
- Data validation rules

### Training Needs
- No formal training needed (simple interface)
- Self-guided quick start sufficient
- Optional: Formula explanation for advanced users

---

## 17. Future Enhancements

### Potential Additions
1. **Mobile App Version:** Dedicated iOS/Android app
2. **Predictive Analytics:** Forecast weight gain trajectory
3. **Meal Planning Integration:** Coordinate with nutrition app
4. **Social Sharing:** Share progress with trainer/friends
5. **Export Reports:** PDF monthly/quarterly reports
6. **Advanced Graphing:** Additional chart types
7. **Milestone Celebrations:** Automatic notifications for milestones
8. **Comparative Analysis:** Compare current bulk to previous cycles

---

## 18. Success Criteria & Launch Readiness

### System Ready When:
- [ ] All MVP features implemented and tested
- [ ] Zero error messages appear with incomplete data
- [ ] All formulas validated against manual calculations
- [ ] Dashboard displays all four required charts
- [ ] User can complete one full day of data entry without confusion
- [ ] Weekly summary accurately aggregates daily data
- [ ] System tested across 30+ days of sample data
- [ ] All edge cases handled gracefully

### User Ready When:
- [ ] Understands daily entry process
- [ ] Knows how to interpret status and charts
- [ ] Has committed to consistent daily logging
- [ ] Has confirmed starting weight and start date

---

## 19. Sign-Off & Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | [User] | ________ | ________ |
| Development Lead | [Builder] | ________ | ________ |
| QA Lead | [Tester] | ________ | ________ |

---

## Appendix A: Glossary

- **Dirty Bulk:** Eating in caloric surplus without strict macro tracking
- **7-Day Average:** Rolling average of last 7 consecutive days' weights
- **Personal Record (PR):** Maximum weight lifted for an exercise
- **Gym Split:** Weekly training schedule dividing muscle groups
- **Creatine:** Supplement to support muscle strength and growth
- **Status:** Automated classification of weight gain rate (Under Eating / On Track / Gaining Too Fast)

---

## Appendix B: Sample Data Entry

**Sample Daily Log Entry:**
| Date | Weight (kg) | Eggs | Gym | Creatine | Energy | Strength | Notes |
|------|------------|------|-----|----------|--------|----------|-------|
| 2/2/2026 | 49.8 | 8 | ✓ | ✗ | 4 | 4 | First gym day! |
| 2/3/2026 | 49.9 | 10 | ✗ | ✗ | 3 | - | Sore from first day |
| 2/4/2026 | 50.1 | 9 | ✓ | ✗ | 4 | 4 | Feeling stronger |

**Sample Workout Entry:**
| Date | Exercise | Sets | Reps | Weight (kg) | PR |
|------|----------|------|------|-------------|-----|
| 2/2/2026 | Barbell Row | 4 | 6 | 40 | ✓ |
| 2/2/2026 | Dumbbell Curl | 3 | 8 | 10 | ✓ |

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Ready for Implementation