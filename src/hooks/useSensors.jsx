import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { getSensors } from '../services/api.js';

export function useSensors() {
  const { sensors, setSensors } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensors = async () => {
      setLoading(true);
      try {
        const response = await getSensors();
        setSensors(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, [setSensors]);

  return { sensors, loading, error };
}
