import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Search, Moon, Sun, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 glass-effect border-b border-gray-200/50 dark:border-dark-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">SocialHub</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search SocialHub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-dark-200 rounded-full outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </motion.button>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-dark-200 rounded-full outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 bg-white dark:bg-dark-100 z-50 p-4"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SocialHub</span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Add menu items here if needed */}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
