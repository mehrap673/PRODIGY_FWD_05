import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, Compass, Bell, MessageCircle, 
  Bookmark, Settings, LogOut, User,
  Sparkles, 
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' }, // Add this
    { icon: User, label: 'Profile', path: `/profile/${user?._id}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-gray-200 dark:border-dark-200 bg-white dark:bg-dark-100 p-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 px-4 py-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          SocialHub
        </span>
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-dark-200 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors cursor-pointer">
          <img
            src={user?.profilePicture}
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.username}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
