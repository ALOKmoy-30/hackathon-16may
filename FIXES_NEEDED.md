# FIXES NEEDED

## PAGE: /dashboard
- **BROKEN**: sensor cards show undefined
- **CAUSE**: sensors array is empty on mount before loading completes
- **FIX**: add loading state + fallback to mockData

- **BROKEN**: KPI cards computing wrong numbers
- **CAUSE**: hardcoded or incorrectly calculating active alerts and zones
- **FIX**: Use displayData length, filter alerts by !resolved, and use Set for unique zones

- **BROKEN**: Gauge ring showing NaN or not rendering
- **CAUSE**: avgTemp computation might result in NaN if sensors array is empty
- **FIX**: Add safe fallback to displayData and calculate properly

- **BROKEN**: Activity chart empty or erroring
- **CAUSE**: mockChartData is currently hardcoded, needs fallback to activityData or proper default
- **FIX**: Use proper data shape fallback for recharts

## PAGE: /sensors
- **BROKEN**: Table showing empty rows or crashing (missing feature)
- **CAUSE**: Missing table component for sensor details
- **FIX**: Add table fallback and use displayData

- **BROKEN**: Slide-over chart crashing on open (missing feature)
- **CAUSE**: Missing history API call and slide-over UI
- **FIX**: Add try/catch with fallback mock data for history chart

- **BROKEN**: Filter dropdowns not filtering (missing feature)
- **CAUSE**: Missing zone and status filters
- **FIX**: Implement combined zone and status filtering logic

## PAGE: /alerts
- **BROKEN**: Alerts list empty even with mock data
- **CAUSE**: alerts array from context might be empty initially
- **FIX**: Fallback to mockData.alerts

- **BROKEN**: Acknowledge button not working correctly
- **CAUSE**: removeAlert simply removes it, instead of marking it resolved (if we implement tabs)
- **FIX**: Update context to support acknowledgeAlert or simulate it

- **BROKEN**: BarChart not rendering (missing feature)
- **CAUSE**: Missing BarChart component for alerts per zone
- **FIX**: Add recharts BarChart with fallback data

## PAGE: /control
- **BROKEN**: Toggle switches not toggling visually
- **CAUSE**: State might not be bound correctly or missing AppContext integration
- **FIX**: Add local state and CSS transition toggles

- **BROKEN**: Zone cards "Mark Danger" not reflecting (missing feature)
- **CAUSE**: Missing UI for marking specific zones as danger manually
- **FIX**: Add localZoneStatus state and merge with AppContext

- **BROKEN**: Threshold form not pre-filling (missing feature)
- **CAUSE**: Missing threshold configuration form
- **FIX**: Fetch thresholds on mount with fallback to defaults

- **BROKEN**: Log console not showing entries
- **CAUSE**: Logs might be empty on startup
- **FIX**: Seed initial logs on mount

## PAGE: /login
- **BROKEN**: Login form not submitting or showing errors (missing feature)
- **CAUSE**: Missing Login page entirely
- **FIX**: Create Login component with proper error handling and redirect

## PAGE: /evacuation
- **BROKEN**: Route not computing or showing errors (missing feature / hook)
- **CAUSE**: useEvacuation hook missing or not handling empty sensorData
- **FIX**: Add fallback safeSensorData

- **BROKEN**: SVG floor plan not showing rooms (or overflows)
- **CAUSE**: BUILDING_NODES not used or SVG viewBox incorrect
- **FIX**: Update viewBox and scale coordinates as instructed
