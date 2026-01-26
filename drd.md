# Gym Progress Tracker - Design Requirements Document (DRD)

## 1. Project Overview & Scope

### 1.1 Product Context
**Application Name:** Gym Progress Tracker (Dirty Bulk Edition)

**Purpose:** Create a clean, intuitive MERN stack web application for a 21-year-old male user to track daily gym progress, body weight, nutrition (eggs consumed), and supplementation (creatine) with automated analytics and progress visualization.

**Platform:** MERN Stack (MongoDB, Express.js, React, Node.js) - Responsive Web Application

**Design Focus:** Clean, minimalist, data-forward design that removes friction from daily logging while providing powerful visualizations for long-term trend analysis.

### 1.2 Target User & Personas

**Primary User:**
- **Name:** Young Bodybuilder / Fitness Enthusiast
- **Age:** 21 years old
- **Tech Proficiency:** Intermediate (comfortable with web applications)
- **Daily Interaction:** 2-3 minutes to log daily metrics
- **Pain Points:** 
  - Needs quick, frictionless data entry
  - Wants clear progress visualization without complexity
  - Frustrated by errors when data is incomplete
  - Needs to track supplement impact over time

**User Needs:**
1. **Quick Entry:** Log data in <2 minutes without confusion
2. **Clear Status:** Instantly see if progress is on track
3. **Historical View:** Compare current performance to past data
4. **Visual Analytics:** See trends at a glance via charts
5. **Creatine Tracking:** Isolate and compare pre/post creatine periods

### 1.3 UI/UX Goals

| Goal | Rationale | Success Metric |
|------|-----------|-----------------|
| **Minimal Cognitive Load** | User should focus on entering data, not interpreting UI | Entry time < 2 minutes/day |
| **Error Prevention** | No error messages for incomplete data | 0 error states when data missing |
| **Visual Hierarchy** | Critical metrics prominent, detailed data secondary | Users find key info in <3 seconds |
| **Consistency** | All sheets follow same design language | 100% UI pattern reuse |
| **Mobile-First Readiness** | Works seamlessly on phones and tablets | Full functionality on 5-7" screens |
| **Accessibility** | WCAG 2.1 AA compliance | All elements keyboard navigable |
| **Data Visualization** | Charts communicate trends instantly | Users understand status without reading numbers |

---

## 2. Design System & Brand Identity

### 2.1 Color Palette

#### Primary Colors
| Name | Usage | HEX | RGB | RGBA |
|------|-------|-----|-----|------|
| **Brand Primary** | Headers, CTA buttons, progress indicators | `#2E7D32` | rgb(46, 125, 50) | rgba(46, 125, 50, 1) |
| **Success Green** | "On track" status, positive progress | `#4CAF50` | rgb(76, 175, 80) | rgba(76, 175, 80, 1) |
| **Warning Yellow** | "Too slow" status, attention needed | `#FBC02D` | rgb(251, 192, 45) | rgba(251, 192, 45, 1) |
| **Danger Red** | "Gaining too fast" / "Dropping" status | `#E53935` | rgb(229, 57, 53) | rgba(229, 57, 53, 1) |
| **Neutral Blue** | Creatine toggles, secondary actions | `#1976D2` | rgb(25, 118, 210) | rgba(25, 118, 210, 1) |

#### Secondary Colors
| Name | Usage | HEX | RGB | RGBA |
|------|-------|-----|-----|------|
| **Background Light** | Sheet backgrounds, cards | `#F5F5F5` | rgb(245, 245, 245) | rgba(245, 245, 245, 1) |
| **Background Dark** | Hover states, secondary sections | `#EEEEEE` | rgb(238, 238, 238) | rgba(238, 238, 238, 1) |
| **Border Gray** | Cell borders, dividers | `#BDBDBD` | rgb(189, 189, 189) | rgba(189, 189, 189, 1) |
| **Text Primary** | Main text, labels | `#212121` | rgb(33, 33, 33) | rgba(33, 33, 33, 1) |
| **Text Secondary** | Helper text, descriptions | `#757575` | rgb(117, 117, 117) | rgba(117, 117, 117, 1) |
| **Text Disabled** | Disabled fields, placeholder text | `#BDBDBD` | rgb(189, 189, 189) | rgba(189, 189, 189, 1) |

#### Chart Colors (Data Visualization)
| Chart Type | Color 1 | Color 2 | Color 3 | Color 4 |
|-----------|---------|---------|---------|---------|
| **Line Graph** | `#1976D2` (weight) | `#4CAF50` (avg) | - | - |
| **Bar Chart** | `#FBC02D` (gain) | `#E53935` (loss) | - | - |
| **Pie Charts** | `#4CAF50` (active) | `#BDBDBD` (inactive) | - | - |

### 2.2 Typography

#### Font Families
```
Primary Font: 'Google Sans', 'Roboto', -apple-system, sans-serif
Monospace Font: 'Roboto Mono', 'Courier New', monospace (for numeric data)
```

#### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1 (Sheet Title)** | 28px | 500 | 1.2 | Main sheet header |
| **H2 (Section Header)** | 22px | 500 | 1.3 | Section titles |
| **H3 (Subsection)** | 18px | 500 | 1.4 | Subsection headers |
| **Body Regular** | 14px | 400 | 1.6 | Standard text, labels |
| **Body Small** | 12px | 400 | 1.5 | Helper text, captions |
| **Label** | 13px | 500 | 1.4 | Form labels, cell headers |
| **Button** | 14px | 500 | 1.5 | Button text |
| **Data (Number)** | 14px | 700 | 1.6 | Numeric values in cells |

#### Font Weights
- **400:** Regular text, body copy
- **500:** Labels, headers, buttons
- **700:** Emphasis, numeric data, status values

### 2.3 Spacing System

**Base Unit:** 8px (Google Sheets compatibility)

| Spacing | Value | Usage |
|---------|-------|-------|
| **xs** | 4px | Tight spacing, inline elements |
| **sm** | 8px | Padding in inputs, small gaps |
| **md** | 16px | Standard padding, section spacing |
| **lg** | 24px | Large gaps between sections |
| **xl** | 32px | Major section separation |

#### Cell Padding
- **Form Inputs:** 8px (horizontal) × 6px (vertical)
- **Data Cells:** 8px (horizontal) × 4px (vertical)
- **Header Cells:** 12px (horizontal) × 8px (vertical)

### 2.4 Iconography

**Icon Library:** Google Material Icons 3.0

**Icon Usage Guide:**
| Element | Icon | Size | Color | Usage |
|---------|------|------|-------|-------|
| **Gym Toggle On** | `fitness_center` | 20px | `#4CAF50` | Indicate gym attendance |
| **Gym Toggle Off** | `fitness_center` | 20px | `#BDBDBD` | Indicate no gym |
| **Creatine Toggle On** | `local_drink` | 20px | `#1976D2` | Indicate creatine taken |
| **Creatine Toggle Off** | `local_drink` | 20px | `#BDBDBD` | Indicate no creatine |
| **Personal Record** | `trending_up` | 20px | `#FBC02D` | Mark PR achievement |
| **Status Good** | `check_circle` | 20px | `#4CAF50` | On track status |
| **Status Warning** | `warning` | 20px | `#FBC02D` | Too slow status |
| **Status Bad** | `error` | 20px | `#E53935` | Dropping/too fast status |
| **Add Entry** | `add_circle` | 24px | `#2E7D32` | Add new row |
| **Edit** | `edit` | 18px | `#1976D2` | Edit entry |
| **Delete** | `delete` | 18px | `#E53935` | Delete entry |
| **Chart** | `bar_chart` | 20px | `#1976D2` | Navigate to dashboard |
| **Settings** | `settings` | 20px | `#757575` | Preferences/creatine date |

### 2.5 Shapes & Borders

#### Border Radius
| Element | Radius | Usage |
|---------|--------|-------|
| **Sharp** | 0px | Data cells, grid |
| **Subtle** | 2px | Input fields, buttons |
| **Rounded** | 4px | Status badges, chips |
| **Pill** | 20px | Toggle switches (if custom) |

#### Borders
| Type | Style | Color | Width | Usage |
|------|-------|-------|-------|-------|
| **Cell Border** | Solid | `#BDBDBD` | 1px | Standard grid |
| **Focus Border** | Solid | `#2E7D32` | 2px | Active input |
| **Header Border** | Solid | `#424242` | 2px | Section divider |
| **Error Border** | Solid | `#E53935` | 2px | Invalid input |

#### Shadows (if applicable in Google Sheets)
- None - Google Sheets UI is flat by design

---

## 3. UI Component Library

### 3.1 Core Components

#### 3.1.1 Text Input Field

**States:**
- **Default:** Empty, ready for input
  - Border: `#BDBDBD` 1px
  - Background: `#FFFFFF`
  - Text: `#212121`

- **Focused:** User has clicked/tapped
  - Border: `#2E7D32` 2px
  - Background: `#FFFFFF`
  - Text: `#212121`

- **Filled:** Contains user data
  - Border: `#BDBDBD` 1px
  - Background: `#FFFFFF`
  - Text: `#212121` (data), `#4CAF50` (valid indicator)

- **Disabled:** Not editable (e.g., date field)
  - Border: `#BDBDBD` 1px
  - Background: `#F5F5F5`
  - Text: `#BDBDBD`

**Dimensions:**
- Height: 32px
- Padding: 8px horizontal, 6px vertical
- Font: Body Regular (14px)
- Placeholder: Text Secondary color

**Validation:**
- Green checkmark (`✓`) appears when valid
- Empty space when incomplete (no error message)

---

#### 3.1.2 Number Input (Weight, Eggs, etc.)

**States:** Same as Text Input

**Format Rules:**
- Weight: Decimal 0-200 kg (e.g., 49.5)
- Eggs: Whole numbers 0-50 (e.g., 8)
- Sets/Reps: Whole numbers 1-100

**Display:**
- Right-aligned for numeric values
- Monospace font (Roboto Mono)
- Thousand separators: None (not applicable)

---

#### 3.1.3 Checkbox / Toggle Switch

**Toggle for:** Gym Attendance, Creatine Intake, Personal Record

**States:**

| State | Visual | Meaning |
|-------|--------|---------|
| **Unchecked (Off)** | ☐ Light gray box | No / Not done |
| **Checked (On)** | ☑ Green box with checkmark | Yes / Done |
| **Disabled** | ☐ Faded gray | Cannot change |
| **Hover** | Darker border | Ready to click |

**Design:**
- Size: 20px × 20px
- Border: 2px `#BDBDBD` (unchecked), `#4CAF50` (checked)
- Fill: `#FFFFFF` (unchecked), `#4CAF50` (checked)
- Checkmark: `#FFFFFF` 2px stroke
- Spacing: 8px margin right of label

---

#### 3.1.4 Rating Scale (1-5)

**Purpose:** Energy Level, Strength in Gym

**Design Option 1 (Stars):**
```
☆ ☆ ☆ ☆ ☆  (empty)
★ ★ ★ ☆ ☆  (3/5 selected)
★ ★ ★ ★ ★  (5/5 selected)
```
- Size: 20px per star
- Filled: `#FBC02D`
- Empty: `#BDBDBD`
- Spacing: 4px between stars

**Design Option 2 (Number Input):**
- Simpler for Google Sheets
- Input field with validation: 1-5 only
- Display: Single number (e.g., "4")
- Spinners: Up/down arrows optional

**Recommendation:** Use Option 2 for simplicity

---

#### 3.1.5 Date Selector

**Auto-Populated:** Current date, read-only

**Display:**
- Format: MMM DD, YYYY (e.g., "Feb 02, 2026")
- Font: Body Regular (14px)
- Color: `#212121`
- Background: `#F5F5F5` (disabled state)
- Padding: 8px × 6px

**Interaction:**
- Click to open date picker (Google Sheets native)
- Manual edit: Optional (for backdating entries)

---

#### 3.1.6 Status Badge

**Purpose:** Display weight trend status

**States:**

| Status | Background | Text | Icon | Usage |
|--------|------------|------|------|-------|
| **Going Up** | `#4CAF50` | `#FFFFFF` | ✓ | Weight increasing |
| **Too Slow** | `#FBC02D` | `#212121` | ⚠ | < 0.2 kg/week |
| **Dropping** | `#E53935` | `#FFFFFF` | ✕ | Negative change |
| **Too Fast** | `#E53935` | `#FFFFFF` | ⚠ | > 0.5 kg/week |
| **Blank** | None | None | - | Insufficient data |

**Design:**
- Padding: 8px × 12px
- Border Radius: 4px
- Font: Label weight (500), 13px
- Display: Centered in cell
- Height: Auto, minimum 28px

---

#### 3.1.7 Data Cell

**Purpose:** Display calculated metrics (daily change, 7-day avg, etc.)

**States:**

- **Default:** Contains calculated value
  - Background: `#FFFFFF`
  - Border: `#BDBDBD` 1px
  - Text: `#212121`, monospace, bold for numbers
  - Padding: 8px × 4px

- **Highlighted:** Indicates new calculation
  - Background: `#F0F4C3` (light yellow highlight)
  - Fades after 2 seconds

- **Empty:** Insufficient data
  - Background: `#FFFFFF`
  - Border: `#BDBDBD` 1px
  - Text: None (blank, no dashes or zeros)
  - Padding: 8px × 4px

**Format Rules:**
- Weight: 2 decimals (49.50 kg)
- Integers: No decimals (8 eggs)
- Percentages: Whole number (87%)
- Alignment: Right-aligned for numbers, left for text

---

#### 3.1.8 Section Header

**Purpose:** Visually separate form sections

**Design:**
- Height: 36px
- Background: `#F5F5F5`
- Border-Bottom: `#424242` 2px solid
- Text: H3 size (18px), weight 500
- Padding: 12px horizontal, 8px vertical
- Color: `#212121`

**Examples:**
- "Daily Metrics"
- "Gym Performance"
- "Weekly Summary"

---

#### 3.1.9 Help Text / Label

**Purpose:** Explain input fields

**Design:**
- Font: Body Small (12px), weight 400
- Color: `#757575` (Text Secondary)
- Margin-Bottom: 4px
- Display: Above or beside input

**Examples:**
- "Weight in kg (e.g., 49.5)"
- "Number of boiled eggs"
- "Energy level 1-5"

---

#### 3.1.10 Button (if applicable)

**Primary Button (Add Entry, Submit):**
- Background: `#2E7D32` (Brand Primary)
- Text: `#FFFFFF`, Button weight (500), 14px
- Padding: 10px × 16px
- Border Radius: 2px
- Hover: Background `#1B5E20` (darker green)
- Active: Background `#0D3B1C`, shadow/inset effect

**Secondary Button (Cancel, Reset):**
- Background: `#EEEEEE`
- Text: `#212121`
- Border: `#BDBDBD` 1px
- Hover: Background `#E0E0E0`

**Disabled Button:**
- Background: `#F5F5F5`
- Text: `#BDBDBD`
- Cursor: Not-allowed

---

### 3.2 Advanced Components

#### 3.2.1 Line Chart (Weight Progression)

**Purpose:** Show daily weight and 7-day average over time

**Design Specifications:**
- **Type:** Line + Points
- **X-Axis:** Date (Feb 1, Feb 8, Feb 15, etc.)
- **Y-Axis:** Weight in kg (49-52 range)
- **Series 1 (Daily Weight):**
  - Color: `#1976D2` (Neutral Blue)
  - Style: Points only (no line), 6px diameter circles
  - Hover: Show tooltip with exact weight

- **Series 2 (7-Day Average):**
  - Color: `#4CAF50` (Success Green)
  - Style: Solid line, 2px stroke
  - Hover: Show trend direction

**Chart Area:**
- Background: `#FFFFFF`
- Grid: Light gray (`#EEEEEE`) vertical lines for weeks
- Padding: 16px on all sides
- Legend: Below chart, horizontal layout

**Interactive Features:**
- Tooltip on hover: Date, weight, 7-day avg
- Zoom: Optional (for long-term view)
- No data: Show message "Add weight data to see progression"

---

#### 3.2.2 Bar Chart (Weekly Gain)

**Purpose:** Show weight gained per week

**Design Specifications:**
- **Type:** Vertical bars
- **X-Axis:** Week number (Week 1, Week 2, Week 3, etc.)
- **Y-Axis:** Weight gained (kg)

- **Bar Colors:**
  - Green (`#4CAF50`) if 0.2-0.5 kg (on track)
  - Yellow (`#FBC02D`) if < 0.2 kg (too slow)
  - Red (`#E53935`) if > 0.5 kg (too fast)
  - Dark Gray (`#424242`) if negative (losing weight)

**Chart Area:**
- Background: `#FFFFFF`
- Grid: Horizontal lines at 0.1 kg intervals
- Bar Width: 40px, spacing 20px between
- Padding: 16px all sides
- Legend: Color key below chart

**Interactive Features:**
- Hover: Show exact gain, status
- No data: Show placeholder "Complete 2 weeks of data to see weekly gains"

---

#### 3.2.3 Pie Chart (Gym Days vs Rest Days)

**Purpose:** Show gym attendance ratio

**Design Specifications:**
- **Type:** Donut/Pie chart
- **Segments:**
  - Gym Days: `#4CAF50` (green)
  - Rest Days: `#BDBDBD` (gray)

- **Center Label (optional):**
  - Text: "87% Gym"
  - Font: 16px, bold
  - Color: `#212121`

**Chart Area:**
- Background: `#FFFFFF`
- Size: 200px diameter
- Padding: 16px all sides
- Legend: Right side, with percentages

**Interactive Features:**
- Hover: Highlight segment, show count (e.g., "6 gym days")
- Click: Can navigate to daily log for that week
- No data: Show placeholder "Add gym attendance data"

---

#### 3.2.4 Pie Chart (Creatine Days vs Non-Creatine Days)

**Purpose:** Show creatine usage ratio

**Design Specifications:**
- Same as Gym Days chart
- **Segments:**
  - Creatine Days: `#1976D2` (blue)
  - Non-Creatine Days: `#BDBDBD` (gray)

- **Center Label:**
  - Text: "35% Creatine"
  - Font: 16px, bold

**Note:** Blank until creatine use begins

---

#### 3.2.5 Creatine Comparison Table

**Purpose:** Compare pre/post creatine metrics side-by-side

**Design:**

| Metric | Pre-Creatine | Post-Creatine | Change |
|--------|--------------|---------------|--------|
| **Weight Gain (kg/week)** | 0.25 | 0.35 | ↑ +0.10 |
| **Avg Strength** | 3.2/5 | 3.8/5 | ↑ +0.6 |
| **Avg Energy** | 3.1/5 | 3.5/5 | ↑ +0.4 |
| **PRs Count** | 4 | 8 | ↑ +4 |

**Styling:**
- Headers: Bold, `#212121`, background `#F5F5F5`
- Data: Monospace font for numbers
- Change Indicator: Green arrow (↑) for improvement, Yellow (→) for stable, Red (↓) for decline
- Borders: `#BDBDBD` 1px between rows and columns

---

### 3.3 Component States & Animations

#### 3.3.1 Form Input States

```
[Default]      [Focused]       [Filled]        [Error]         [Disabled]
┌─────────┐    ┌═════════┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│         │    │ 49.5    │    │ 49.5    │    │ invalid │    │ N/A     │
└─────────┘    └═════════┘    └─────────┘    └─────────┘    └─────────┘
Idle           Active         Valid data     Invalid input   Locked
```

#### 3.3.2 Toggle States

```
[Off]          [On]           [Hover Off]    [Hover On]     [Disabled]
☐ Gym         ☑ Gym          ☐ Gym          ☑ Gym          ☐ Gym
Gray           Green          Dark Gray      Dark Green     Light Gray
```

#### 3.3.3 Status Badge Transitions

```
[Blank]                [Loading]              [Complete]
(empty space)          ⟳ Calculating...       ✓ Going Up
                       Duration: 1 second     Color: Green
```

---

## 4. Key Screens & User Flows

### 4.1 Screen Inventory

**Primary Screens:**
1. Daily Log (Main Entry Screen)
2. Workout Log (Exercise Tracking)
3. Weekly Summary (Automated Aggregation)
4. Monthly Summary (Long-term View)
5. Dashboard (Visualizations)
6. Creatine Analysis (Pre/Post Comparison)
7. Settings (Preferences)

---

### 4.2 Daily Log Screen

**Purpose:** Primary user interaction point for daily data entry

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Daily Log                       │
│  Today: Feb 02, 2026                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📅 DATE                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Feb 02, 2026                              [Lock] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ⚖️  WEIGHT (kg)                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 49.5                                      ✓      │  │
│  └──────────────────────────────────────────────────┘  │
│  Help text: Weight in kg (e.g., 49.5)                 │
│                                                          │
│  DAILY CHANGE: -0.2 kg ↓                               │
│  7-DAY AVERAGE: 49.7 kg                                │
│  STATUS: Going Up ✓ (Green Badge)                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🍳 EGGS CONSUMED                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 8                                         ✓      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  GYM ATTENDANCE                    ☑ Yes  ☐ No        │
│  CREATINE TAKEN                    ☐ Yes  ☑ No        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ⚡ ENERGY LEVEL (1-5)                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 4                                         ✓      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  💪 STRENGTH IN GYM (1-5)                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 4                                         ✓      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  📝 NOTES (Optional)                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ First gym day! Felt good, mostly back work      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│               [SAVE ENTRY]  [CLEAR]                    │
│                                                          │
└─────────────────────────────────────────────────────────┘

BELOW (scrollable):
┌─────────────────────────────────────────────────────────┐
│  RECENT ENTRIES                                         │
│  ─────────────────────────────────────────────────────  │
│  Date      | Weight | Eggs | Gym | Creatine | Energy   │
│  ─────────────────────────────────────────────────────  │
│  Feb 01    | 49.7   | 9    | ✓   | ✗        | 3        │
│  Jan 31    | 49.9   | 8    | ✗   | ✗        | 2        │
│  Jan 30    | 50.1   | 10   | ✓   | ✗        | 4        │
└─────────────────────────────────────────────────────────┘
```

**User Flow:**
1. User opens Daily Log sheet
2. System auto-populates today's date
3. User scrolls to entry form (if not visible)
4. User enters weight (field highlights green if valid)
5. User enters eggs count
6. User toggles gym attendance (checkbox)
7. User toggles creatine (checkbox)
8. User rates energy (1-5)
9. User rates strength (1-5)
10. User optionally adds notes
11. User clicks SAVE ENTRY
12. System calculates and updates metrics
13. User sees updated Recent Entries table below

**Key Interactions:**
- **Auto-calculation:** System shows daily change and 7-day avg as user enters data
- **Real-time validation:** Green checkmark appears when weight is valid number
- **No errors:** If user leaves field blank, system shows nothing (not error)
- **Quick toggles:** User can click checkboxes without tabbing
- **Tab order:** Date → Weight → Eggs → Gym → Creatine → Energy → Strength → Notes

---

### 4.3 Workout Log Screen

**Purpose:** Track individual exercises and PRs

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Workout Log                     │
│  Feb 02, 2026 (Monday - Back & Biceps)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📅 DATE                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Feb 02, 2026                              [Lock] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  💪 EXERCISE                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Dropdown] Barbell Row                    ✓     │  │
│  └──────────────────────────────────────────────────┘  │
│  Help: Select from gym split schedule                  │
│                                                          │
│  SETS                                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 4                                         ✓     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  REPS                                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 6                                         ✓     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  WEIGHT USED (kg)                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 40                                        ✓     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  PERSONAL RECORD (PR)              ☑ Yes  ☐ No        │
│                                                          │
│               [ADD EXERCISE]  [CLEAR]                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

BELOW (scrollable):
┌─────────────────────────────────────────────────────────┐
│  WORKOUT HISTORY FOR THIS DATE                          │
│  ─────────────────────────────────────────────────────  │
│  Exercise      | Sets | Reps | Weight | PR  | Edit    │
│  ─────────────────────────────────────────────────────  │
│  Barbell Row   | 4    | 6    | 40 kg  | ✓   | [Edit]  │
│  Dumbbell Curl | 3    | 8    | 10 kg  | ✓   | [Edit]  │
│  Lat Pulldown  | 4    | 8    | 80 kg  | ✗   | [Edit]  │
│  ─────────────────────────────────────────────────────  │
│  Total Volume: 420 kg (4×40 + 3×10 + 4×80)            │
│  Total PRs: 2/3 exercises                              │
└─────────────────────────────────────────────────────────┘
```

**Dropdown Options (Exercise Selector):**
- Organized by muscle group based on gym split
- Monday: Back and Biceps
  - Barbell Row
  - Lat Pulldown
  - Bent-Over Row
  - Dumbbell Curl
  - Barbell Curl
  - etc.
- Tuesday: Legs and Shoulders
  - Leg Press
  - Squat
  - Leg Curl
  - Shoulder Press
  - etc.

**User Flow:**
1. User opens Workout Log sheet
2. System auto-populates today's date and muscle groups for that day
3. User selects exercise from dropdown
4. User enters sets, reps, weight
5. User toggles PR checkbox if applicable
6. User clicks ADD EXERCISE
7. Exercise appears in history table below
8. User can add more exercises for same day
9. Each new exercise shows total volume at bottom

**Key Interactions:**
- **Smart Exercise List:** Dropdown auto-filters based on gym split schedule
- **Volume Calculator:** Auto-calculates total weight lifted per day
- **PR Tracking:** Highlights PRs with yellow icon
- **Quick Add:** Users can add multiple exercises in rapid succession
- **Edit/Delete:** Each entry has edit icon and delete option

---

### 4.4 Weekly Summary Screen

**Purpose:** Automated aggregation of weekly metrics

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Weekly Summary                  │
│  Week of Feb 02 - Feb 08, 2026 (Week 1)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 WEIGHT PROGRESSION                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Start of Week:        49.8 kg                    │  │
│  │ End of Week:          50.3 kg                    │  │
│  │ Total Gain:           +0.5 kg ✓ (Green)         │  │
│  │ Average Daily:        50.05 kg                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🍳 NUTRITION                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Total Eggs:           56 eggs                    │  │
│  │ Average per Day:      8 eggs/day                 │  │
│  │ Daily Range:          7-10 eggs                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🏋️ TRAINING                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Gym Days:            6/7 days (86%)              │  │
│  │ Rest Days:           1/7 days (14%)              │  │
│  │ Total Volume:        2,840 kg                    │  │
│  │ PRs Achieved:        4                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  💊 SUPPLEMENTATION                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Creatine Days:       0/7 days (Not started)     │  │
│  │ Non-Creatine Days:   7/7 days (100%)            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ⚡ ENERGY & PERFORMANCE                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Avg Energy:          3.7/5                       │  │
│  │ Avg Strength:        3.8/5                       │  │
│  │ Energy Trend:        ↑ Improving                 │  │
│  │ Strength Trend:      ↑ Improving                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ✅ WEEKLY STATUS                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ VERDICT: ON TRACK ✓                             │  │
│  │ (Weight gain: 0.5 kg - Optimal range)           │  │
│  │ Recommendation: Maintain current protocol        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘

BELOW (scrollable):
┌─────────────────────────────────────────────────────────┐
│  📈 WEIGHT TREND                                        │
│                                                          │
│  50.4 │                                      ●          │
│  50.2 │                              ──●──                │
│  50.0 │                        ──●──                     │
│  49.8 │                ──●──                            │
│  49.6 │          ●──                                    │
│       └────────────────────────────────────────────    │
│        Mon   Tue   Wed   Thu   Fri   Sat   Sun          │
│       ● Daily  ─ 7-day avg                             │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PREVIOUS WEEKS                                         │
│  (Summary tables for previous weeks if available)       │
└─────────────────────────────────────────────────────────┘
```

**Status Logic Display:**
- **Green (On Track):** 0.2-0.5 kg gain + good gym consistency + improving metrics
- **Yellow (Too Slow):** < 0.2 kg gain OR gym consistency < 70%
- **Red (Too Fast):** > 0.5 kg gain OR negative trend
- **Blank:** < 7 days data

**Key Interactions:**
- **Click on week:** Drills down to daily entries for that week
- **Status legend:** Hovering over status shows calculation formula
- **Chart hover:** Shows exact values for each day
- **Compare weeks:** Link to compare with previous week

---

### 4.5 Dashboard Screen

**Purpose:** Visualize progress with charts

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Dashboard                       │
│  Cumulative Progress View                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ WEIGHT PROGRESSION  │  │ WEEKLY WEIGHT GAIN  │      │
│  │ (Line Graph)        │  │ (Bar Chart)         │      │
│  │                     │  │                     │      │
│  │ 52│                 │  │ 0.6│        ▐█     │      │
│  │ 51│        ●        │  │ 0.4│  ▐█   ▐█     │      │
│  │ 50│   ──●──         │  │ 0.2│  ▐█   ▐█  ▐█ │      │
│  │ 49│ ●──              │  │ 0.0├─────────────  │      │
│  │   ├────────────────  │  │    └───────────────  │      │
│  │   │ ● Daily   ─ Avg  │  │    W1 W2 W3 W4 W5  │      │
│  │                     │  │                     │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ GYM DAYS            │  │ CREATINE USAGE      │      │
│  │ (Pie Chart)         │  │ (Pie Chart)         │      │
│  │                     │  │                     │      │
│  │     ╱─────╲         │  │     ╱───╲           │      │
│  │   ╱   86%    ╲      │  │   ╱  0%  ╲          │      │
│  │  │  Gym      │     │  │  │ Creatine│        │      │
│  │   ╲  Days  ╱       │  │   ╲ Days ╱         │      │
│  │     ╲─────╱         │  │     ╲───╱           │      │
│  │                     │  │                     │      │
│  │ ■ Gym 6 days       │  │ ■ Creatine 0 days  │      │
│  │ ■ Rest 1 day       │  │ ■ Non-Creatine 7   │      │
│  │                     │  │                     │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                          │
└─────────────────────────────────────────────────────────┘

BELOW (scrollable):
┌─────────────────────────────────────────────────────────┐
│  KEY METRICS AT A GLANCE                                │
│  ───────────────────────────────────────────────────    │
│  Current Weight: 50.3 kg    │  Progress: +0.8 kg (1.6%) │
│  7-Day Average: 50.05 kg    │  Trend: ↑ Gaining         │
│  Gym Consistency: 86%       │  PRs This Month: 4        │
│  Avg Energy: 3.7/5          │  Avg Strength: 3.8/5      │
│                                                          │
│  PROJECTION                                             │
│  At current rate: ~2.0 kg gain per month               │
│  Target weight (60 kg): ~4-5 months away                │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CREATINE ANALYSIS (Once started)                        │
│  Compare pre vs post creatine metrics                   │
│  [Link: View Full Creatine Comparison]                  │
└─────────────────────────────────────────────────────────┘
```

**Chart Placement:**
- Top left: Weight Progression line graph (50% width)
- Top right: Weekly Gain bar chart (50% width)
- Bottom left: Gym Days pie chart (50% width)
- Bottom right: Creatine Usage pie chart (50% width)

**Key Interactions:**
- **Hover on chart:** Show exact values
- **Click on data point:** Link to corresponding daily log entry
- **Chart legend:** Click to toggle data series visibility
- **Full screen:** Expand any chart to full width
- **Export:** Download chart as image

---

### 4.6 Creatine Analysis Screen (Phase 3)

**Purpose:** Compare pre-creatine and post-creatine periods

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Creatine Impact Analysis        │
│  Comparing performance before vs after supplementation  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔬 CREATINE START DATE                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Date Picker] Mar 01, 2026                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ANALYSIS RESULTS                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 WEIGHT GAIN SPEED                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pre-Creatine:    0.25 kg/week                   │  │
│  │ Post-Creatine:   0.35 kg/week                   │  │
│  │ Difference:      +0.10 kg/week (↑ +40%)         │  │
│  │ Statistical Significance: Moderate              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  💪 STRENGTH PROGRESSION                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pre-Creatine:    3.2/5 average rating           │  │
│  │ Post-Creatine:   3.8/5 average rating           │  │
│  │ Difference:      +0.6 points (↑ +18.75%)        │  │
│  │ Trend: Improved strength in gym                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ⚡ ENERGY LEVELS                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pre-Creatine:    3.1/5 average rating           │  │
│  │ Post-Creatine:   3.5/5 average rating           │  │
│  │ Difference:      +0.4 points (↑ +12.9%)         │  │
│  │ Trend: Slightly improved energy                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🏆 PERSONAL RECORDS                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pre-Creatine:    4 PRs (2 per month)            │  │
│  │ Post-Creatine:   8 PRs (4 per month)            │  │
│  │ Difference:      +4 PRs (↑ +100%)               │  │
│  │ Trend: Significantly more strength gains        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🏋️ GYM CONSISTENCY                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pre-Creatine:    82% gym adherence              │  │
│  │ Post-Creatine:   88% gym adherence              │  │
│  │ Difference:      +6% (↑ Improved consistency)   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  OVERALL VERDICT                                        │
│  Creatine appears to have positive impact on progress.  │
│  Weight gain +40%, Strength +18.75%, PRs +100%         │
│  Recommendation: Continue creatine supplementation      │
│                                                          │
└─────────────────────────────────────────────────────────┘

BELOW:
┌─────────────────────────────────────────────────────────┐
│  📈 COMPARATIVE CHARTS                                  │
│                                                          │
│  Weight Gain Comparison   │  Strength Ratings          │
│  (Line chart overlay)     │  (Side-by-side bars)       │
│  Pre vs Post              │  Pre vs Post               │
│                                                          │
│  Energy Levels Comparison │  PR Count Comparison       │
│  (Bar chart)              │  (Pie or bar chart)        │
│  Pre vs Post              │  Pre vs Post               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key Interactions:**
- **Change start date:** Recalculate all comparisons
- **View detailed data:** Click metric to see all values for that period
- **Download report:** Export comparison as PDF
- **Share result:** Generate shareable link with analysis

---

## 5. Responsiveness & Accessibility

### 5.1 Responsive Breakpoints

| Device | Width | Density | Considerations |
|--------|-------|---------|------------------|
| **Mobile (Phone)** | 375px - 480px | 2-3x DPI | Single column, stacked layout |
| **Small Tablet** | 600px - 768px | 1.5-2x DPI | 1.5 column or 2 columns |
| **Large Tablet** | 768px - 1024px | 1.5x DPI | 2 columns, better spacing |
| **Desktop** | 1024px+ | 1x DPI | Full layout, 2-3 columns |

### 5.2 Mobile-Optimized (375px - 480px)

**Daily Log Mobile:**
```
┌──────────────────────┐
│ Gym Progress Tracker │
│ Daily Log            │
├──────────────────────┤
│ Date: Feb 02, 2026  │
├──────────────────────┤
│ Weight (kg)          │
│ ┌──────────────────┐ │
│ │ 49.5        ✓   │ │
│ └──────────────────┘ │
│ Help: e.g., 49.5    │
├──────────────────────┤
│ Eggs                 │
│ ┌──────────────────┐ │
│ │ 8           ✓   │ │
│ └──────────────────┘ │
├──────────────────────┤
│ GYM      ☑ YES  ☐ NO │
│ CREATINE ☐ YES  ☑ NO │
├──────────────────────┤
│ Energy (1-5)         │
│ ┌──────────────────┐ │
│ │ 4           ✓   │ │
│ └──────────────────┘ │
├──────────────────────┤
│ Strength (1-5)       │
│ ┌──────────────────┐ │
│ │ 4           ✓   │ │
│ └──────────────────┘ │
├──────────────────────┤
│ Notes                │
│ ┌──────────────────┐ │
│ │ First gym day!  │ │
│ │                 │ │
│ └──────────────────┘ │
├──────────────────────┤
│  [SAVE]   [CLEAR]   │
└──────────────────────┘
```

**Responsive Rules:**
- **Input width:** 100% of container
- **Buttons:** Full width, stacked vertically on mobile
- **Checkboxes:** Large touch targets (48px minimum)
- **Font sizes:** Increased for readability (16px minimum)
- **Spacing:** Increased padding (12px on mobile vs 8px desktop)
- **Charts:** Single column, full width on mobile

### 5.3 Tablet Optimization (600px - 768px)

**Layout:** 2-column layout where applicable

```
┌─────────────────────────────────────────┐
│  Daily Log - Weekly Summary             │
├─────────────────────┬───────────────────┤
│  DAILY ENTRY        │  WEEKLY SNAPSHOT  │
│ (Left, 40% width)   │ (Right, 60% width)│
│                     │                   │
│ Date: Feb 02, 2026  │ Week 1 Summary    │
│ Weight: 49.5 kg     │ Gain: +0.5 kg     │
│ [form fields...]    │ Gym: 6 days (86%) │
│                     │ PRs: 4            │
│ [SAVE] [CLEAR]      │ Status: On Track  │
│                     │                   │
└─────────────────────┴───────────────────┘
```

### 5.4 Desktop Layout (1024px+)

**Layout:** Full multi-column with sidebar

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar         │  Main Content Area                    │
│ ─────────────   ├─────────────────────────────────────  │
│ Dashboard       │  Daily Log - Feb 02, 2026             │
│ Daily Log       │                                       │
│ Workout Log     │  Date: Feb 02, 2026                   │
│ Weekly Sum      │  Weight: 49.5 kg  │ Daily Change: -0.2│
│ Monthly Sum     │  Eggs: 8          │ 7-Day Avg: 49.7  │
│ Creatine        │  Gym: ☑           │ Status: Going Up  │
│ Settings        │  Creatine: ☐      │                  │
│                 │  Energy: 4/5      │ Strength: 4/5     │
│                 │  Notes: [text]    │                  │
│                 │  [SAVE]  [CLEAR]  │                  │
│                 │                   │                  │
│                 │  RECENT ENTRIES   │                  │
│                 │  ┌──────────────┐ │                  │
│                 │  │ History...   │ │                  │
│                 │  └──────────────┘ │                  │
└─────────────────┴───────────────────────────────────────┘
```

---

### 5.5 Accessibility Requirements

**WCAG 2.1 Level AA Compliance**

#### Color Contrast
| Element | Minimum Contrast | Example |
|---------|------------------|---------|
| **Text on Background** | 4.5:1 | Black text (#212121) on white (#FFFFFF) = 12.63:1 ✓ |
| **UI Components** | 3:1 | Green button (#2E7D32) on white = 3.95:1 ✓ |
| **Borders/Dividers** | 3:1 | Gray border (#BDBDBD) on white = 2.1:1 ✗ → Increase to #909090 (3.5:1) |
| **Links** | 4.5:1 | Blue link (#1976D2) on white = 4.54:1 ✓ |
| **Status Icons** | 3:1 | Green checkmark on light background = compliant |

#### Keyboard Navigation
- **Tab Order:** Logical flow through form fields
  - Date (skip - read-only)
  - Weight → Eggs → Gym → Creatine → Energy → Strength → Notes
- **Enter Key:** Submits form or toggles checkbox
- **Space:** Toggles checkbox
- **Escape:** Clears form
- **All buttons:** Accessible via keyboard
- **Skip Links:** "Skip to main content" link on each sheet

#### Screen Reader Support
- **Form Labels:** Associated with input fields using `<label for="id">` or Google Sheets accessibility equivalents
- **Icons:** Have text alternatives (e.g., "✓ Going Up" reads as "check mark Going Up")
- **Charts:** Have accessible data tables below visualization
- **Status Messages:** Announced via ARIA-live regions

#### Focus Indicators
- **Focused Input:** 2px blue border (#1976D2) visible around active field
- **Focused Button:** 2px border + background change
- **Focus Visible:** Contrast ratio ≥ 3:1 against background

#### Mobile Accessibility
- **Touch Targets:** Minimum 48px × 48px for interactive elements
- **Double Tap:** Zoom enabled (maximum-scale=2)
- **Orientation:** Content accessible in both portrait and landscape
- **Pinch Zoom:** Not disabled, user can zoom to 200%

#### Text Alternatives
- **All Icons:** Have tooltips describing their purpose
- **Charts:** Have accompanying data tables
- **Colors:** Status communicated with text + icon, not color alone
  - Example: "✓ On Track" (icon + text) instead of just green color

---

## 6. Interactions & Animations

### 6.1 Micro-interactions

#### 6.1.1 Input Field Interaction

**State: Typing**
- **Trigger:** User clicks or taps input field
- **Animation:**
  - Border: Gray (#BDBDBD) → Green (#2E7D32)
  - Duration: 200ms
  - Easing: ease-out
  - Background highlight: Subtle white → Light green (#F1F8E9) fade-in
- **Feedback:** Focus border appears, field expands slightly

**State: Validation**
- **Trigger:** User enters valid data (e.g., 49.5 in weight field)
- **Animation:**
  - Checkmark appears: Scale 0 → 1
  - Duration: 300ms
  - Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce)
  - Color: Gray → Green
- **Feedback:** Green checkmark confirms entry is valid

**State: Tab Out**
- **Trigger:** User moves to next field
- **Animation:**
  - Border: Green (#2E7D32) → Gray (#BDBDBD)
  - Duration: 200ms
  - Easing: ease-in
  - Checkmark: Remains visible or fades to 50% opacity
- **Feedback:** Field stabilizes but shows it was valid

---

#### 6.1.2 Toggle Interaction

**State: Off → On**
- **Trigger:** User clicks checkbox
- **Animation:**
  - Checkbox fill: White → Green (#4CAF50)
  - Checkmark appears: Scale 0 → 1, opacity 0 → 1
  - Duration: 250ms
  - Easing: ease-out
- **Feedback:** Satisfying click sensation, visual confirmation

**State: On → Off**
- **Animation:**
  - Checkbox fill: Green (#4CAF50) → White
  - Checkmark disappears: Scale 1 → 0, opacity 1 → 0
  - Duration: 250ms
  - Easing: ease-in

**State: Hover**
- **Animation:**
  - Border: 1px → 2px
  - Cursor: pointer
  - Background: Subtle shadow or highlight
  - Duration: 100ms instant

---

#### 6.1.3 Status Badge Appearance

**Animation: Status Calculated**
- **Trigger:** Calculations update status
- **Animation:**
  - Fade in: Opacity 0 → 1
  - Duration: 400ms
  - Easing: ease-out
  - Slide up: translateY(8px) → translateY(0)
  - Color: Based on status (green/yellow/red)
- **Feedback:** Status appears smoothly, drawing attention

**Animation: Status Changes**
- **Trigger:** Status changes (e.g., "Too Slow" → "Going Up")
- **Animation:**
  - Cross-fade: Old status fades out, new status fades in
  - Duration: 300ms
  - Easing: ease-in-out
  - Pulse: New badge pulses once (scale 1 → 1.05 → 1)

---

#### 6.1.4 Chart Animation

**Animation: Chart Loads**
- **Trigger:** User navigates to Dashboard
- **Animation:**
  - Bars/lines draw from left to right
  - Duration: 1000ms
  - Easing: ease-out
  - Stagger: Each bar/point offset 50ms from previous
- **Feedback:** Data feels alive, not static

**Animation: Data Point Hover**
- **Trigger:** User hovers on chart data point
- **Animation:**
  - Circle enlarges: radius × 1.5
  - Duration: 200ms
  - Easing: ease-out
  - Tooltip appears: Fade in + slide up
  - Color: Highlight point, dim others (opacity 0.3)
- **Feedback:** Clear focus on selected data

---

### 6.2 Page Transitions

**Navigation Between Sheets:**
- **Transition Style:** Fade + subtle slide
- **Duration:** 300ms
- **Easing:** ease-in-out
- **Effect:**
  - Current sheet: Opacity 1 → 0, slideUp(10px)
  - New sheet: Opacity 0 → 1, slideUp(-10px) to position
- **Feedback:** Smooth navigation without jarring jumps

**Form Submission:**
- **Trigger:** User clicks SAVE
- **Animation:**
  - Button: Background color pulse
  - Duration: 500ms
  - Loading state: Button text → spinner, disabled
  - Success state: Checkmark appears on button (300ms)
  - Toast notification: Slide in from bottom
  - Message: "Entry saved successfully"
  - Auto-dismiss: After 3 seconds (fade out 300ms)

---

### 6.3 Loading States

**Calculation in Progress:**
```
Status: ⟳ Calculating...
Duration: 1000ms (approximate)
Animation: Spinner rotates continuously
Once complete: "✓ Going Up" replaces spinner
```

**Chart Loading:**
- **Skeleton Screen:** Show outline of chart while loading
  - Gray placeholder boxes
  - Pulse animation (opacity 0.5 → 1 → 0.5, 1.5s cycle)
  - Duration: Until chart data loads
- **Chart Fade-in:** Once data ready, skeleton fades out, chart fades in (300ms)

---

## 7. Edge Cases & Empty States

### 7.1 Empty States

#### 7.1.1 First Time User

**Daily Log (Day 1):**
```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Daily Log                       │
│  Today: Feb 02, 2026                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Welcome! Let's start tracking your progress.           │
│  Fill in today's metrics to begin.                      │
│                                                          │
│  DATE: Feb 02, 2026                                     │
│  WEIGHT: [Empty field] kg                               │
│  EGGS: [Empty field]                                    │
│  GYM: [Unchecked]     CREATINE: [Unchecked]            │
│  ENERGY: [Empty field]    STRENGTH: [Empty field]      │
│  NOTES: [Empty field]                                   │
│                                                          │
│               [SAVE ENTRY]  [CLEAR]                    │
│                                                          │
│  No previous entries yet.                               │
│  (Recent entries will appear here after first entry)    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Dashboard (Day 1):**
```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Dashboard                       │
│  Getting Started                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Not enough data yet                                 │
│                                                          │
│  Add at least 7 days of data to see your progress       │
│  charts and trends.                                     │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │ [Placeholder]   │  │ [Placeholder]   │             │
│  │ Weight chart    │  │ Weekly gains    │             │
│  │ (7+ days req.)  │  │ (2+ weeks req.) │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │ [Placeholder]   │  │ [Placeholder]   │             │
│  │ Gym days        │  │ Creatine usage  │             │
│  │ (1+ week req.)  │  │ (n/a until used)│             │
│  └─────────────────┘  └─────────────────┘             │
│                                                          │
│  Progress Tips:                                         │
│  • Log daily for 7 days to unlock weight trends         │
│  • Complete first workout to see exercise data          │
│  • Start creatine whenever ready to compare impact      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 7.1.2 No Creatine Data Yet

**Creatine Analysis Tab:**
```
┌─────────────────────────────────────────────────────────┐
│  Gym Progress Tracker - Creatine Analysis               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔬 CREATINE START DATE                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Select date when creatine started]              │  │
│  │ (Not started yet - leave blank)                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ⏳ ANALYSIS NOT AVAILABLE YET                          │
│                                                          │
│  This analysis compares your progress before and       │
│  after starting creatine supplementation.              │
│                                                          │
│  To enable this feature:                               │
│  1. Set your creatine start date above                 │
│  2. Ensure you have at least 14 days of data in        │
│     each period (pre and post)                         │
│                                                          │
│  [Current Status]                                       │
│  ✓ Pre-creatine data: 5 weeks available               │
│  ✗ Post-creatine data: Not started                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 7.2 Error States

#### 7.2.1 Invalid Weight Entry

**User enters:** "abc" in weight field

```
Weight field shows:
┌──────────────────────────────────┐
│ abc                           ✗  │  ← Red X appears
└──────────────────────────────────┘
Help text changes to: "Please enter a valid number (e.g., 49.5)"
Field border: Red (#E53935) 2px
```

**Behavior:**
- No error message popup
- Just visual feedback
- User knows entry is invalid
- Prevents saving invalid data
- User can clear and re-enter

#### 7.2.2 Blank Required Field

**User clicks SAVE without entering weight:**

```
Weight field:
┌──────────────────────────────────┐
│ [empty]                          │  ← No change, stays blank
└──────────────────────────────────┘

Status: Save button remains enabled, but show inline message:
"⚠ Weight is required"
Help text: "Please enter your morning weight"
```

**Behavior:**
- No error popup
- Subtle inline message
- Field highlights
- Form doesn't submit
- User corrects entry

#### 7.2.3 Data Calculation Issues

**Insufficient data for 7-day average (e.g., only 3 days of data):**

```
7-DAY AVERAGE WEIGHT: [blank]  (not displayed)
Daily Change: -0.2 kg           (still shown, only needs 1 day)
Status: [blank]                 (not displayed)
```

**Behavior:**
- No error message like "#DIV/0!"
- Simply blank, as requested
- Field exists but empty
- User knows more data is needed
- Auto-fills when threshold reached

---

### 7.3 Missing Data Handling

#### Scenario: User forgets entry for 1 day

**Daily Log:**
```
Feb 01: 49.7 kg (complete entry)
Feb 02: [no entry]
Feb 03: 50.1 kg (complete entry)
```

**Weekly Summary should:**
- ✓ Still show week stats (using available data)
- ✓ Calculate averages with 6 data points (Feb 1, 3-7)
- ✓ NOT show error or #N/A
- ✓ Display as "6 days recorded" in notes
- ✓ Status still calculated (if ≥4 days of data)

---

### 7.4 Boundary Cases

#### Case: Month spans 2 sheets (month ends mid-week)

**January 31 (Friday) → February 1 (Saturday)**

**System handles:**
- ✓ Week summaries correctly split
- ✓ Monthly summaries aggregate both weeks
- ✓ Charts show continuous timeline
- ✓ No data loss or duplication

#### Case: Creatine start on exact month boundary

**Start date:** March 1, 2026 (first day of month)

**System handles:**
- ✓ Pre-creatine period: Jan 26 - Feb 28 (complete months)
- ✓ Post-creatine period: Mar 1 onwards
- ✓ Comparisons accurate
- ✓ Charts show clear demarcation line

#### Case: User enters very high numbers (data error)

**Example:** Weight = 150 kg (likely typo)

**System:**
- ✓ Accepts entry (validation range 0-200 kg)
- ✓ Shows in spreadsheet
- ✓ Calculates normally
- ✓ But flags in dashboard: "⚠ Unusual value detected"
- ✓ User can edit/delete if mistaken

---

## 8. Component Documentation

### 8.1 Component Usage Examples

#### Daily Log Date Field
```
✓ Auto-populated with current date
✓ Read-only (can't edit directly)
✓ Format: Mon MMM DD, YYYY (e.g., "Mon Feb 02, 2026")
✓ Manual entry: Optional (for past entries)
✓ Keyboard: Cannot be tabbed into (skip with Tab key)
```

#### Energy/Strength Rating
```
✓ Input: 1-5 number field
✓ Validation: Rejects values outside 1-5
✓ Display: Plain number (e.g., "4")
✓ Optional star visualization: ★★★★☆ (if enhanced)
✓ Required: Yes (can't save without entry)
```

#### Status Badge
```
✓ Display location: Daily Log, Weekly Summary, Dashboard
✓ Colors: Green (good), Yellow (warning), Red (bad), Blank (insufficient data)
✓ Auto-calculation: Triggered when weight data enters
✓ Animation: Fade + slide-up when appears/changes
✓ Formula logic: Based on daily or weekly weight change
```

---

### 8.2 Reusable Patterns

#### Pattern: Two-Column Input Form
```
[Label]              [Label]
[Input] ✓           [Input] ✓

[Label]              [Label]
[Input]             [Checkbox]
```
Usage: Daily Log, Workout Log, Settings

#### Pattern: Status Indicator with Metric
```
┌─────────────────────┐
│ [Icon] Metric Name  │
│ Value: X            │
│ Status: [Badge]     │
│ Trend: [Arrow]      │
└─────────────────────┘
```
Usage: Weekly Summary, Monthly Summary, Creatine Analysis

#### Pattern: Chart with Data Table
```
[Chart Visualization]
──────────────────────
[Accompanying Data Table]
Date | Value | Trend
──────────────────────
```
Usage: All visualizations (accessibility + clarity)

---

## 9. Visual Hierarchy & Layout Rules

### 9.1 Content Priority (Daily Log)

1. **Tier 1 (Critical):** Date, Weight, Status
   - Largest text (H3 size)
   - Top of form
   - Color-coded status badge
   - Always visible

2. **Tier 2 (Important):** Gym, Creatine, Energy, Strength
   - Medium text (Body Regular)
   - Checkboxes prominent
   - Mid-form position

3. **Tier 3 (Supporting):** Eggs, Notes, Daily Change, 7-Day Avg
   - Standard text (Body Small)
   - Below toggles
   - Optional/reference data

4. **Tier 4 (Historical):** Recent Entries table
   - Smallest text (Caption)
   - Bottom of sheet
   - Scrollable if long

### 9.2 Grid & Alignment

**Form Alignment:**
- Labels: Left-aligned, 12px from field
- Fields: Width 100% on mobile, max-width 400px on desktop
- Icons: Left margin 8px from label, vertically centered
- Spacing between rows: 16px (md unit)

**Chart Alignment:**
- Charts: Center-aligned in container
- Titles: Above chart, left-aligned
- Legends: Below chart, centered
- Padding: 16px on all sides

---

## 10. Performance & Loading Guidelines

### 10.1 Performance Targets

- **Form Load:** < 1 second
- **Daily entry submission:** < 2 seconds
- **Chart render:** < 500ms (once data loaded)
- **Sheet navigation:** < 300ms (transition animation)
- **Mobile load:** < 3 seconds on 4G

### 10.2 Optimization Strategies

- **Lazy load:** Charts load only when tab selected
- **Data pagination:** Show only last 30 entries, paginate older data
- **Formula optimization:** Cache calculated values, recalculate on update
- **Image optimization:** Charts exported as lightweight PNG
- **Mobile reduction:** Simplify charts on screens < 500px width

---

## 11. Brand & Visual Consistency

### 11.1 Design Language

**Philosophy:** Clean, minimal, data-focused
- No unnecessary decoration
- Whitespace for breathing room
- Color only when it adds meaning
- Consistent patterns throughout

**Tone:** Encouraging, supportive, straightforward
- Help text is friendly, not technical
- Status messages are positive ("On Track!" not "Warning")
- Empty states explain next steps
- Errors are suggestions, not failures

### 11.2 Consistent UI Patterns

| Element | Appearance | Behavior |
|---------|-----------|----------|
| **Toggles** | Checkboxes, always the same style | Click to toggle, instant feedback |
| **Badges** | Colored, rounded corners | Show status with color + text + icon |
| **Buttons** | Green primary, gray secondary | Hover state, disabled state visible |
| **Inputs** | Bordered boxes, left-aligned text | Focus border changes color, validation checkmark |
| **Help Text** | Small gray text below field | Never disappears, only changes |
| **Icons** | Material Design, 20px size | Color-coded by function |
| **Charts** | Consistent colors across tabs | Legends always present, data labels on hover |

---

## 12. Sign-Off & Handoff

### 12.1 Design Approval

| Role | Responsibility | Sign-Off |
|------|-----------------|----------|
| **UI/UX Designer** | Visual design, interactions, responsiveness | __________ |
| **Product Manager** | Feature completeness, user flow accuracy | __________ |
| **Accessibility Auditor** | WCAG compliance, contrast ratios, keyboard nav | __________ |
| **QA Lead** | Edge cases, empty states, mobile testing | __________ |

### 12.2 Handoff Checklist

- [ ] All components documented with states
- [ ] Responsive breakpoints tested
- [ ] Color palette hex codes provided
- [ ] Font stack and sizes documented
- [ ] Icon library linked (Material Design)
- [ ] Animation specs defined (duration, easing)
- [ ] Accessibility requirements listed
- [ ] Empty/error states designed
- [ ] Form flows documented
- [ ] Interactive prototypes created
- [ ] Developer design system guidelines ready
- [ ] QA test cases prepared

---

## Appendix A: Design Tokens

### Color Tokens
```json
{
  "colors": {
    "primary": "#2E7D32",
    "success": "#4CAF50",
    "warning": "#FBC02D",
    "danger": "#E53935",
    "secondary": "#1976D2",
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "border": "#BDBDBD",
    "text": {
      "primary": "#212121",
      "secondary": "#757575",
      "disabled": "#BDBDBD"
    }
  }
}
```

### Typography Tokens
```json
{
  "typography": {
    "h1": { "size": "28px", "weight": 500 },
    "h2": { "size": "22px", "weight": 500 },
    "h3": { "size": "18px", "weight": 500 },
    "body": { "size": "14px", "weight": 400 },
    "small": { "size": "12px", "weight": 400 },
    "label": { "size": "13px", "weight": 500 }
  }
}
```

### Spacing Tokens
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}
```

---

## Appendix B: Interaction Specifications (Detailed)

### Input Validation State Machine

```
[Empty] 
   ↓ (User types)
[Typing] → Checkmark (if valid) → [Valid]
   ↓ (If invalid)
[Invalid] → User corrects → [Valid]
   ↓ (User tabs away)
[Blur] → Keep checkmark → Field loses focus
```

### Status Badge State Machine

```
[Data Insufficient]
   ↓ (7 days of data)
[Calculating] (⟳ spinner for 1sec)
   ↓
[Complete] → Shows status + color (fade in + slide up 300ms)
   ↓ (Data changes)
[Update] → Cross-fade between old/new status (300ms)
```

---

## Appendix C: Accessibility Checklist

- [ ] All form fields have associated labels
- [ ] Color contrast ratios ≥ 4.5:1 for text
- [ ] Color contrast ratios ≥ 3:1 for UI components
- [ ] Keyboard navigation works on all forms
- [ ] Tab order is logical
- [ ] Focus indicators clearly visible (≥ 3:1 contrast)
- [ ] All icons have text alternatives
- [ ] Charts have accompanying data tables
- [ ] Status conveyed with text + icon, not color alone
- [ ] Touch targets ≥ 48px × 48px
- [ ] No content disappears on zoom to 200%
- [ ] Animations can be disabled (prefers-reduced-motion)
- [ ] Links are distinguishable (not color alone)
- [ ] Error messages are clear and specific

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Ready for Development Handoff
