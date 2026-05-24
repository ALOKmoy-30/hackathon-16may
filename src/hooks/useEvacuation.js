import { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export function useEvacuation() {
  const { sensors } = useContext(AppContext);
  const [selectedZone, setSelectedZone] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [route, setRoute] = useState([]);
  const [manualRiskMap, setManualRiskMap] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [ignitionNode, setIgnitionNode] = useState(null);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1500);

  const simInterval = useRef(null);

  // A helper function to build the path. For our simple map, we just route to nearest exit.
  const computeRoute = useCallback((zoneId, riskMap) => {
    if (!zoneId) return [];
    
    // Hardcoded logic for routing based on our 3 zones
    const isDanger = (riskMap[zoneId] || 0) > 70;
    
    if (zoneId === 'room1') {
      return isDanger ? ['room1', 'exitTop'] : ['room1', 'exitLeft'];
    } else if (zoneId === 'room2') {
      return isDanger ? ['room2', 'exitBottom'] : ['room2', 'exitLeft'];
    } else {
      return isDanger ? ['mainHall', 'exitBottom'] : ['mainHall', 'exitTop'];
    }
  }, []);

  // We construct combinedRiskMap here so useEffect can use it
  const combinedRiskMap = { ...manualRiskMap };
  (sensors || []).forEach(s => {
    if (s.status === 'DANGER') {
      const zoneId = s.zone === 'Room 1' ? 'room1' : s.zone === 'Room 2' ? 'room2' : s.zone === 'Main Hall' ? 'mainHall' : s.zone;
      combinedRiskMap[zoneId] = Math.max(combinedRiskMap[zoneId] || 0, 100);
    }
  });

  useEffect(() => {
    // If we have a selected zone, recompute route when risk map changes
    if (selectedZone) {
      setRoute(computeRoute(selectedZone, combinedRiskMap));
    }
  }, [selectedZone, JSON.stringify(combinedRiskMap), computeRoute]);

  const blockNode = useCallback((nodeId) => {
    setManualRiskMap(prev => ({ ...prev, [nodeId]: 100 }));
  }, []);

  const unblockNode = useCallback((nodeId) => {
    setManualRiskMap(prev => {
      const newMap = { ...prev };
      delete newMap[nodeId];
      return newMap;
    });
  }, []);

  const startSimulation = useCallback((nodeId) => {
    setIgnitionNode(nodeId);
    setHasSimulated(true);
    setIsSimulating(true);
    setSimulationStep(0);
    setManualRiskMap({ [nodeId]: 85 }); // Start fire

    if (simInterval.current) clearInterval(simInterval.current);

    simInterval.current = setInterval(() => {
      setSimulationStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= 8) {
          clearInterval(simInterval.current);
          setIsSimulating(false);
          return 8;
        }

        // Simple fire spread logic
        setManualRiskMap(currentRisk => {
          const newRisk = { ...currentRisk };
          if (nextStep === 2) {
             if (nodeId === 'room1') newRisk['mainHall'] = 50;
             else if (nodeId === 'room2') newRisk['mainHall'] = 50;
             else newRisk['room1'] = 50;
          }
          if (nextStep === 4) {
             if (nodeId === 'room1') newRisk['mainHall'] = 85;
             else if (nodeId === 'room2') newRisk['mainHall'] = 85;
             else newRisk['room1'] = 85;
          }
          if (nextStep === 6) {
             newRisk['room1'] = 85;
             newRisk['room2'] = 85;
             newRisk['mainHall'] = 85;
          }
          return newRisk;
        });

        return nextStep;
      });
    }, simulationSpeed);
  }, [simulationSpeed]);

  const pauseSimulation = useCallback(() => {
    if (simInterval.current) {
      clearInterval(simInterval.current);
      simInterval.current = null;
    }
    setIsSimulating(false);
  }, []);

  const resumeSimulation = useCallback(() => {
    if (simulationStep >= 8 || !ignitionNode) return;
    setIsSimulating(true);
    simInterval.current = setInterval(() => {
      setSimulationStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= 8) {
          clearInterval(simInterval.current);
          setIsSimulating(false);
          return 8;
        }
        
        // Match spread logic
        setManualRiskMap(currentRisk => {
          const newRisk = { ...currentRisk };
          if (nextStep === 2) {
             if (ignitionNode === 'room1') newRisk['mainHall'] = 50;
             else if (ignitionNode === 'room2') newRisk['mainHall'] = 50;
             else newRisk['room1'] = 50;
          }
          if (nextStep === 4) {
             if (ignitionNode === 'room1') newRisk['mainHall'] = 85;
             else if (ignitionNode === 'room2') newRisk['mainHall'] = 85;
             else newRisk['room1'] = 85;
          }
          if (nextStep === 6) {
             newRisk['room1'] = 85;
             newRisk['room2'] = 85;
             newRisk['mainHall'] = 85;
          }
          return newRisk;
        });
        
        return nextStep;
      });
    }, simulationSpeed);
  }, [simulationStep, ignitionNode, simulationSpeed]);

  const resetToNormal = useCallback(() => {
    if (simInterval.current) {
      clearInterval(simInterval.current);
      simInterval.current = null;
    }
    setIsSimulating(false);
    setSimulationStep(0);
    setIgnitionNode(null);
    setManualRiskMap({});
    setHasSimulated(false);
  }, []);

  return {
    selectedZone, setSelectedZone,
    currentFloor, setCurrentFloor,
    route,
    manualRiskMap: combinedRiskMap,
    isSimulating,
    simulationStep,
    ignitionNode,
    hasSimulated,
    blockNode,
    unblockNode,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetToNormal,
    simulationSpeed,
    setSimulationSpeed
  };
}
