import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { getSensors } from '../services/api.js';

export function useSensors() {
  const { sensors, loading } = useContext(AppContext);

  return { sensors: sensors || [], loading, error: null };
}
