import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bell, MessageCircle, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id}` },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-100 border-t border-gray-200 dark:border-dark-200 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-primary-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-primary-500' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
