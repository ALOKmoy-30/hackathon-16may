import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { initSocket, getSocket } from '../services/socket.js';

export function useSocket() {
  const { setIsConnected } = useContext(AppContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const sock = initSocket();
    setSocket(sock);

    sock.on('connect', () => {
      setIsConnected(true);
    });

    sock.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      sock.off('connect');
      sock.off('disconnect');
    };
  }, [setIsConnected]);

  return socket;
}
