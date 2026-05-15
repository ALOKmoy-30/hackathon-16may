// Static mock data for demo mode
// NO random values - all data is stable and predictable

export let mockSensorData = {
  sensors: [
    {
      id: 1,
      name: 'Sensor A (Lab)',
      zone: 'Lab',
      location: 'Floor 1 - Lab',
      temperature: 25,
      smokeLevel: 0,
      gasLevel: 0,
      humidity: 50,
      status: 'NORMAL',
      lastUpdate: '2026-05-15T17:06:00.000Z',
      history: [
        { time: '17:01', value: 25 },
      ],
    },
    {
      id: 2,
      name: 'Sensor B (Hallway)',
      zone: 'Hallway',
      location: 'Floor 1 - Hallway',
      temperature: 25,
      smokeLevel: 0,
      gasLevel: 0,
      humidity: 50,
      status: 'NORMAL',
      lastUpdate: '2026-05-15T17:06:00.000Z',
      history: [
        { time: '17:01', value: 25 },
      ],
    },
    {
      id: 3,
      name: 'Sensor C (Office)',
      zone: 'Office',
      location: 'Floor 1 - Office',
      temperature: 25,
      smokeLevel: 0,
      gasLevel: 0,
      humidity: 50,
      status: 'NORMAL',
      lastUpdate: '2026-05-15T17:06:00.000Z',
      history: [
        { time: '17:01', value: 25 },
      ],
    },
    {
      id: 4,
      name: 'Sensor D (Hallway)',
      zone: 'Hallway',
      location: 'Floor 1 - Hallway Section 2',
      temperature: 25,
      smokeLevel: 0,
      gasLevel: 0,
      humidity: 50,
      status: 'NORMAL',
      lastUpdate: '2026-05-15T17:06:00.000Z',
      history: [
        { time: '17:01', value: 25 },
      ],
    },
    {
      id: 5,
      name: 'Sensor E (Office)',
      zone: 'Office',
      location: 'Floor 1 - Office Section 2',
      temperature: 25,
      smokeLevel: 0,
      gasLevel: 0,
      humidity: 50,
      status: 'NORMAL',
      lastUpdate: '2026-05-15T17:06:00.000Z',
      history: [
        { time: '17:01', value: 25 },
      ],
    },
    {
      id: 6,
      name: 'Sensor F (Lab)',
      zone: 'Lab',
      location: 'Floor 1 - Lab Section 2',
      temperature: 25,
      smokeLevel: 0,
      gasLevel: 0,
      humidity: 50,
      status: 'NORMAL',
      lastUpdate: '2026-05-15T17:06:00.000Z',
      history: [
        { time: '17:01', value: 25 },
      ],
    },
  ],
  alerts: [],
  zones: [
    { id: 'A', name: 'Zone A', status: 'NORMAL', sensorCount: 1 },
  ],
  lastUpdated: '2026-05-15T17:06:00.000Z',
};

let simulationInterval = null;
let simulationStep = 0;
const MAX_STEPS = 30; // 30 seconds for simulation

export const startStressTestSimulation = (onUpdate) => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  simulationStep = 0;

  // Reset sensors to initial state
  mockSensorData.sensors = mockSensorData.sensors.map(sensor => ({
    ...sensor,
    smokeLevel: 0,
    gasLevel: 0,
    temperature: 25,
    status: 'NORMAL',
  }));

  simulationInterval = setInterval(() => {
    simulationStep++;
    const newSensors = mockSensorData.sensors.map(sensor => {
      let newSmoke = sensor.smokeLevel;
      let newGas = sensor.gasLevel;
      let newTemp = sensor.temperature;
      let newStatus = sensor.status;

      if (sensor.id === 1) { // Lab sensor
        if (simulationStep <= 10) {
          newGas = Math.min(100, simulationStep * 10); // Increase rapidly
          newSmoke = Math.min(100, simulationStep * 5);
          newTemp = Math.min(60, 25 + simulationStep * 2);
        } else {
          newGas = 100;
          newSmoke = 50;
          newTemp = 60;
        }
      } else if (sensor.id === 2 || sensor.id === 4) { // Hallway sensors
        if (simulationStep > 10 && simulationStep <= 20) {
          newGas = Math.min(100, (simulationStep - 10) * 10); // Start increasing after Lab
          newSmoke = Math.min(100, (simulationStep - 10) * 5);
          newTemp = Math.min(50, 25 + (simulationStep - 10) * 1.5);
        } else if (simulationStep > 20) {
          newGas = 100;
          newSmoke = 50;
          newTemp = 50;
        }
      }

      if (newGas > 70 || newSmoke > 70) {
        newStatus = 'DANGER';
      } else if (newGas > 40 || newSmoke > 40) {
        newStatus = 'WARNING';
      } else {
        newStatus = 'NORMAL';
      }

      // Update history (simplified: just keep last entry if value changes significantly)
      const lastHistory = sensor.history[sensor.history.length - 1];
      const currentTime = new Date().toLocaleTimeString().substring(0, 5);
      if (sensor.history.length === 0 || lastHistory.value !== newTemp || lastHistory.time !== currentTime) {
        sensor.history.push({ time: currentTime, value: newTemp });
        if (sensor.history.length > 5) {
          sensor.history.shift(); // Keep history to 5 entries
        }
      }

      return {
        ...sensor,
        smokeLevel: newSmoke,
        gasLevel: newGas,
        temperature: newTemp,
        status: newStatus,
        lastUpdate: new Date().toISOString(),
      };
    });

    mockSensorData.sensors = newSensors;
    mockSensorData.lastUpdated = new Date().toISOString();
    onUpdate({ ...mockSensorData });

    if (simulationStep >= MAX_STEPS) {
      clearInterval(simulationInterval);
      simulationInterval = null;
      console.log('Stress test simulation ended.');
    }
  }, 1000); // Update every second
};

export const stopStressTestSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('Stress test simulation stopped.');
  }
  // Reset sensors to initial state after stopping
  mockSensorData.sensors = mockSensorData.sensors.map(sensor => ({
    ...sensor,
    smokeLevel: 0,
    gasLevel: 0,
    temperature: 25,
    status: 'NORMAL',
    lastUpdate: new Date().toISOString(),
  }));
  return { ...mockSensorData };
};

export const getInitialMockSensorData = () => {
  return JSON.parse(JSON.stringify(mockSensorData));
}

