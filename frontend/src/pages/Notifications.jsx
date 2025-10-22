import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import NotificationItem from '../components/NotificationItem';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notifications.filter(n => !n.isRead).length} unread
              </p>
            </div>
          </div>
          <button 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300 rounded-xl transition-colors font-medium"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </motion.div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              When you get notifications, they'll show up here
            </p>
          </motion.div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NotificationItem
                notification={notification}
                onMarkRead={handleMarkAsRead}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
