import { useState, useEffect } from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      // This would fetch saved posts from your API
      // For now, using empty array
      setBookmarkedPosts([]);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
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
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <BookmarkIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Bookmarks</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-16">
          All your saved posts in one place
        </p>
      </motion.div>

      {bookmarkedPosts.length > 0 ? (
        <div className="space-y-6">
          {bookmarkedPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookmarkIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start saving posts to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
