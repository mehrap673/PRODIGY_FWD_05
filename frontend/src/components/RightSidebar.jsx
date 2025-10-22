import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, UserPlus } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trending, setTrending] = useState([
    { tag: 'WebDevelopment', posts: '12.5K' },
    { tag: 'ReactJS', posts: '8.3K' },
    { tag: 'AI', posts: '15.2K' },
    { tag: 'TailwindCSS', posts: '5.7K' },
  ]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      const { data } = await api.get('/users/suggested');
      setSuggestedUsers(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  return (
    <aside className="hidden xl:block w-80 h-screen sticky top-0 p-4 space-y-4 overflow-y-auto scrollbar-hide">
      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold">Trending Topics</h2>
        </div>
        <div className="space-y-4">
          {trending.map((item, index) => (
            <Link
              key={index}
              to={`/explore?tag=${item.tag}`}
              className="block hover:bg-gray-100 dark:hover:bg-dark-200 rounded-xl p-3 transition-colors"
            >
              <p className="font-semibold text-primary-600 dark:text-primary-400">
                #{item.tag}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.posts} posts
              </p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Suggested Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold">Suggested For You</h2>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <Link to={`/profile/${user._id}`}>
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-dark-200"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${user._id}`}
                  className="font-semibold text-sm hover:text-primary-500 transition-colors truncate block"
                >
                  {user.fullName}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{user.username}
                </p>
              </div>
              <button className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-xs text-gray-500 dark:text-gray-400 px-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
        <p>© 2025 SocialHub. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default RightSidebar;
