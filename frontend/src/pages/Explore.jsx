import { useState, useEffect } from 'react';
import { TrendingUp, Hash, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([
    { name: 'WebDevelopment', posts: '12.5K' },
    { name: 'ReactJS', posts: '8.3K' },
    { name: 'AI', posts: '15.2K' },
    { name: 'TailwindCSS', posts: '5.7K' },
    { name: 'JavaScript', posts: '20.1K' },
  ]);

  useEffect(() => {
    fetchSuggestedUsers();
    fetchAllPosts();
    fetchTrendingPosts();
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      const { data } = await api.get('/users/suggested');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchTrendingPosts = async () => {
    try {
      const { data } = await api.get('/posts/trending');
      setTrendingPosts(data);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const { data } = await api.get(`/users/search?q=${searchQuery}`);
      setUsers(data);
      setActiveTab('people');
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleTagClick = async (tag) => {
    try {
      const { data } = await api.get(`/posts/tag/${tag}`);
      setPosts(data.posts);
      setActiveTab('posts');
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 mb-6"
      >
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for people, posts, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern"
          />
        </form>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'tags', label: 'Tags', icon: Hash },
          { id: 'people', label: 'People', icon: Users },
          { id: 'posts', label: 'Posts', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'glass-effect hover:bg-gray-100 dark:hover:bg-dark-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'trending' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Trending Posts</h2>
            {trendingPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tags.map((tag, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTagClick(tag.name)}
                className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    #{tag.name}
                  </h3>
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">{tag.posts} posts</p>
              </motion.button>
            ))}
          </div>
        )}

        {activeTab === 'people' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
