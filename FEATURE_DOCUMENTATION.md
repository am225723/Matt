# Feature Documentation - UI/UX Overhaul

## Table of Contents
1. [Body Map Calibration](#body-map-calibration)
2. [Spreadsheet Data Import](#spreadsheet-data-import)
3. [Dark Color Scheme](#dark-color-scheme)
4. [Technical Implementation](#technical-implementation)

---

## Body Map Calibration

### Overview
The Body Map Calibration feature allows users to adjust the alignment of body part overlays with the background body image in the Anxiety Tracker. This addresses misalignment issues where overlays (head, rightArm, stomach, etc.) don't perfectly match the body photo.

### Accessing Calibration Mode
**Secret Button**: Triple-click on the "Anxiety Tracker" title to open the calibration interface.

### Features

#### 1. Visual Calibration Interface
- **Grid Overlay**: Optional grid display for precise positioning
- **Real-time Preview**: See changes immediately as you adjust
- **Body Part Selection**: Choose from 14 different body parts to calibrate

#### 2. Adjustment Controls
Each body part has three adjustable parameters:
- **Horizontal Position (X)**: Move left/right (-100px to +100px)
- **Vertical Position (Y)**: Move up/down (-100px to +100px)
- **Scale**: Resize the overlay (0.5x to 1.5x)

#### 3. Persistence
- Settings are automatically saved to browser localStorage
- Calibration persists across sessions
- Each body part has independent settings

#### 4. Reset Functionality
- **Reset All**: One-click button to restore all body parts to default positions
- **Individual Reset**: Adjust one part at a time without affecting others

### Usage Instructions

1. **Open Calibration**
   - Navigate to the Anxiety Tracker
   - Triple-click on the "Anxiety Tracker" title
   - Calibration modal will appear

2. **Select Body Part**
   - Click on any body part button (Head, Stomach, Right Arm, etc.)
   - The preview will highlight the selected part

3. **Adjust Position**
   - Use the "Horizontal Position" slider to move left/right
   - Use the "Vertical Position" slider to move up/down
   - Use the "Scale" slider to resize

4. **Save Changes**
   - Click "Save Calibration" to persist your changes
   - Click "Reset All" to restore defaults
   - Click the X button to close without saving

### Tips for Best Results
- Enable the grid overlay for precise alignment
- Start with the head and work your way down
- Use small adjustments (5-10px at a time)
- Test with actual anxiety tracking to verify alignment
- Reset if you make a mistake and start over

---

## Spreadsheet Data Import

### Overview
The Spreadsheet Data Import feature allows users to bulk upload health data from Excel or CSV files directly into the Health Dashboard, eliminating the need for manual data entry.

### Accessing Import Feature
Click the **"Import Data"** button in the Health Dashboard header (top right, next to the time range selector).

### Supported File Formats
- Excel: `.xlsx`, `.xls`
- CSV: `.csv`

### Features

#### 1. Smart Column Detection
The system automatically detects and maps common column names:
- **Date**: date, Date, DATE, timestamp, Timestamp
- **Steps**: steps, Steps, STEPS, step_count, stepCount
- **Sleep**: sleep, Sleep, SLEEP, sleep_hours, sleepHours
- **Heart Rate**: heart_rate, heartRate, Heart Rate, HR, bpm
- **Weight**: weight, Weight, WEIGHT, body_weight
- **Stress Level**: stress, Stress, stress_level, stressLevel
- **Alcohol**: alcohol, Alcohol, drinks, alcohol_intake
- **Calories**: calories, Calories, calorie_intake
- **Mood**: mood, Mood, mood_score
- **Exercise**: exercise, Exercise, exercise_minutes, workout
- **Sleep Quality**: sleep_quality, sleepQuality, Sleep Quality
- **Water**: water, Water, water_intake, hydration

#### 2. Data Validation
- Validates date formats (supports multiple formats)
- Checks for required date column
- Verifies at least one health metric is present
- Provides clear error messages for issues

#### 3. Preview Before Import
- Shows first 5 rows of data
- Displays detected column mappings
- Shows total number of rows to be imported
- Allows review before committing

#### 4. Template Download
- Click "Download Template" to get a properly formatted example
- Template includes all supported columns
- Contains sample data for reference

#### 5. Smart Data Merging
- Automatically merges with existing data
- Avoids duplicate entries (by date)
- Updates existing entries if dates match
- Sorts data chronologically

### Usage Instructions

1. **Prepare Your Data**
   - Download the template for proper formatting
   - Ensure you have a date column
   - Use standard column names (see list above)
   - Format dates consistently (YYYY-MM-DD recommended)

2. **Upload File**
   - Click "Import Data" button
   - Click the upload area or drag and drop your file
   - Wait for processing (usually 1-2 seconds)

3. **Review Preview**
   - Check detected columns are correct
   - Review first 5 rows of data
   - Look for any validation errors
   - Verify total row count

4. **Import Data**
   - Click "Import X Entries" button
   - Data will be merged with existing entries
   - Success message will confirm import
   - Dashboard will update automatically

### Data Format Requirements

#### Date Column (Required)
- Must be present in spreadsheet
- Supported formats:
  - YYYY-MM-DD (2025-01-15)
  - MM/DD/YYYY (01/15/2025)
  - DD/MM/YYYY (15/01/2025)
  - ISO 8601 (2025-01-15T00:00:00Z)

#### Health Metrics (At least one required)
- Numeric values without units
- Examples:
  - Steps: 8000 (not "8,000 steps")
  - Sleep: 7.5 (not "7.5 hours")
  - Weight: 150 (not "150 lbs")
  - Heart Rate: 72 (not "72 bpm")

### Example Spreadsheet

| date       | steps | sleep | heartRate | weight | stressLevel | calories | mood | exerciseMinutes | waterIntake |
|------------|-------|-------|-----------|--------|-------------|----------|------|-----------------|-------------|
| 2025-01-01 | 8000  | 7.5   | 72        | 150    | 5           | 2000     | 4    | 45              | 64          |
| 2025-01-02 | 10000 | 8     | 70        | 149.5  | 4           | 1800     | 5    | 60              | 72          |
| 2025-01-03 | 7500  | 6.5   | 75        | 150    | 6           | 2200     | 3    | 30              | 56          |

### Troubleshooting

**Error: "Date column not found"**
- Ensure your spreadsheet has a column named "date" or similar
- Check spelling and capitalization
- Try renaming your date column to exactly "date"

**Error: "No health metrics detected"**
- Verify column names match supported names
- Check for typos in column headers
- Ensure at least one health metric column exists

**Error: "Invalid date format"**
- Use a standard date format (YYYY-MM-DD recommended)
- Ensure dates are actual date values, not text
- Check for empty date cells

**Import shows 0 entries**
- Verify your file has data rows (not just headers)
- Check that dates are valid
- Ensure at least one health metric has values

---

## Dark Color Scheme

### Overview
The Dark Color Scheme update changes all text colors in the Health Dashboard to dark colors, improving readability and reducing eye strain.

### Changes Made

#### 1. Text Colors
- **Primary Text**: #1f2937 (dark gray)
- **Secondary Text**: #374151 (medium gray)
- **Muted Text**: #6b7280 (light gray)

#### 2. Chart Colors
- **Line 1**: #1e40af (dark blue)
- **Line 2**: #7c3aed (dark purple)
- **Line 3**: #dc2626 (dark red)
- **Line 4**: #059669 (dark green)
- **Line 5**: #d97706 (dark orange)

#### 3. Chart Elements
- **Axis Text**: Dark gray (#1f2937)
- **Grid Lines**: Light gray (#e5e7eb)
- **Tooltips**: Dark text on light background
- **Legends**: Dark text for clarity

#### 4. UI Elements
- **Headers**: Dark gray (#111827)
- **Card Titles**: Dark gray (#111827)
- **Descriptions**: Medium gray (#4b5563)
- **Badges**: Dark blue background with white text
- **Buttons**: Dark text for visibility

### Accessibility

The color scheme maintains WCAG 2.1 Level AA standards:
- **Contrast Ratio**: Minimum 4.5:1 for normal text
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear focus indicators
- **Color Independence**: Information not conveyed by color alone

### Browser Compatibility
- Works in all modern browsers
- No JavaScript required
- Pure CSS implementation
- Graceful degradation in older browsers

---

## Technical Implementation

### Architecture

#### Component Structure
```
src/
├── components/
│   ├── BodyMapCalibration.jsx      # Calibration modal
│   ├── SpreadsheetUpload.jsx       # Import modal
│   ├── AnxietyTracker.jsx          # Updated with calibration trigger
│   └── EnhancedHealthDashboard.jsx # Updated with import button
└── styles/
    └── dark-health-dashboard.css   # Dark color scheme
```

### Dependencies

#### New Dependencies
- **xlsx** (^0.18.5): Excel file parsing and manipulation

#### Existing Dependencies Used
- **framer-motion**: Animations for modals
- **lucide-react**: Icons
- **@radix-ui**: UI components (Button, Card, Slider, etc.)
- **date-fns**: Date parsing and formatting

### State Management

#### Body Map Calibration
```javascript
// Stored in localStorage as JSON
{
  head: { x: 0, y: 0, scale: 1 },
  stomach: { x: 5, y: -10, scale: 1.1 },
  rightArm: { x: -3, y: 2, scale: 0.95 },
  // ... other body parts
}
```

#### Health Data
```javascript
// Stored in localStorage via useLocalStorage hook
[
  {
    date: "2025-01-15T00:00:00.000Z",
    steps: 8000,
    sleep: 7.5,
    heartRate: 72,
    // ... other metrics
  },
  // ... more entries
]
```

### API Reference

#### BodyMapCalibration Component
```jsx
<BodyMapCalibration 
  onClose={() => void}      // Called when modal closes
  onSave={(data) => void}   // Called when calibration is saved
/>
```

#### SpreadsheetUpload Component
```jsx
<SpreadsheetUpload 
  onDataImport={(data) => void}  // Called with parsed data array
  onClose={() => void}           // Called when modal closes
/>
```

### Performance Considerations

#### File Upload
- Maximum file size: 10MB (browser limitation)
- Processing time: ~1-2 seconds for 1000 rows
- Memory usage: Minimal (streaming parser)

#### Calibration
- Real-time preview updates
- Debounced slider changes
- Optimized SVG rendering

#### Data Storage
- localStorage limit: ~5-10MB
- Automatic cleanup of old data
- Efficient JSON serialization

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Calibration | ✅ | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ |
| Dark Colors | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |

### Security Considerations

#### File Upload
- Client-side processing only
- No data sent to server
- File type validation
- Size limits enforced

#### Data Storage
- localStorage is domain-specific
- No sensitive data stored
- User can clear at any time
- No external access

### Future Enhancements

#### Potential Features
1. **Export Functionality**: Download health data as Excel/CSV
2. **Cloud Sync**: Optional cloud backup of calibration settings
3. **Multiple Profiles**: Different calibrations for different users
4. **Advanced Import**: Support for JSON, XML formats
5. **Data Visualization**: More chart types and customization
6. **Mobile Optimization**: Touch-friendly calibration controls
7. **Undo/Redo**: History for calibration changes
8. **Preset Calibrations**: Common body types as starting points

---

## Support

For issues or questions:
1. Check this documentation first
2. Review the pull request: https://github.com/am225723/Matt/pull/37
3. Open a GitHub issue with details
4. Include browser version and error messages

## Version History

### v1.0.0 (2025-10-15)
- Initial release
- Body map calibration feature
- Spreadsheet data import
- Dark color scheme implementation