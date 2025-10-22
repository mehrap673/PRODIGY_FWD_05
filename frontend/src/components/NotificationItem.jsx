import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, Share2, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationItem = ({ notification, onMarkRead }) => {
  // Get icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-purple-500" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-orange-500" />;
      default:
        return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get background color based on notification type
  const getIconBgColor = () => {
    switch (notification.type) {
      case 'like':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'comment':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'follow':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'share':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'mention':
        return 'bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onMarkRead(notification._id)}
      className={`glass-effect rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        !notification.isRead 
          ? 'border-2 border-primary-500/30 bg-primary-50/50 dark:bg-primary-900/10' 
          : 'border border-gray-200 dark:border-dark-200'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* User Avatar with Icon Badge */}
        <div className="relative flex-shrink-0">
          <Link to={`/profile/${notification.sender?._id}`}>
            <img
              src={notification.sender?.profilePicture || 'https://via.placeholder.com/150'}
              alt={notification.sender?.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-dark-100"
            />
          </Link>
          {/* Icon Badge */}
          <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ${getIconBgColor()} border-2 border-white dark:border-dark-100`}>
            {getNotificationIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <Link 
                to={`/profile/${notification.sender?._id}`}
                className="font-semibold hover:text-primary-500 transition-colors"
              >
                {notification.sender?.fullName || 'Someone'}
              </Link>
              {' '}
              <span className="text-gray-600 dark:text-gray-400">
                {notification.message?.replace(notification.sender?.username, '').trim() || 'interacted with you'}
              </span>
            </p>
            
            {/* Unread Indicator */}
            {!notification.isRead && (
              <div className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>
            )}
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>

          {/* Post Preview if available */}
          {notification.post && (
            <Link
              to={`/post/${notification.post._id}`}
              className="mt-2 block"
            >
              <div className="p-3 bg-gray-100 dark:bg-dark-200 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {notification.post.content || 'View post'}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
