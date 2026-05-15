// Data source switch - routes between mock data and real Telegram API
import { mockSensorData, startStressTestSimulation, stopStressTestSimulation, getInitialMockSensorData } from '../mock/mockData.js';
import { fetchSensorData } from './telegramService.js';

const USE_REAL_DATA = import.meta.env.VITE_USE_REAL_DATA === 'true';

// Get sensor data from the appropriate source
export async function getSensorData(onUpdate = null) {
  if (USE_REAL_DATA) {
    console.log('Fetching real data from Telegram API...');
    const realData = await fetchSensorData();

    if (!realData) {
      console.warn('Real data unavailable, falling back to mock data');
      return getInitialMockSensorData();
    }

    return realData;
  }

  console.log('Using mock data (demo mode)');
  if (onUpdate) {
    startStressTestSimulation(onUpdate);
  }
  return getInitialMockSensorData();
}

// Get current data source mode
export function getDataSourceMode() {
  return {
    isRealData: USE_REAL_DATA,
    mode: USE_REAL_DATA ? 'live' : 'demo',
    label: USE_REAL_DATA ? 'Live Data' : 'Demo Mode',
  };
}

// Export mock data for direct access if needed
export { mockSensorData, startStressTestSimulation, stopStressTestSimulation, getInitialMockSensorData };
