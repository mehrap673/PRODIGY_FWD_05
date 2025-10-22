import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to socket server');
        newSocket.emit('join conversations');
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from socket server');
      });

      newSocket.on('online users', (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
