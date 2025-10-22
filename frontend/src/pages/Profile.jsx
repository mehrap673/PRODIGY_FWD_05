import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, MoreHorizontal,
  Grid, Heart, MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import FollowButton from '../components/FollowButton';
import { toast } from 'react-toastify';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setUser(data);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    try {
      // Create or get existing conversation
      const { data } = await api.post('/messages/conversations', {
        participantId: user._id
      });
      
      // Navigate to messages with the conversation
      navigate('/messages', { state: { conversationId: data._id } });
      toast.success('Opening conversation...');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <Link to="/" className="text-primary-500 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto pb-24 lg:pb-4">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-primary-400 to-primary-600 rounded-b-3xl overflow-hidden">
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="relative -mt-20 mb-4">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-36 h-36 rounded-full border-4 border-white dark:border-dark-100 object-cover shadow-xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{user.fullName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>
            {user.bio && <p className="text-gray-800 dark:text-gray-200 mb-3">{user.bio}</p>}
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isOwnProfile ? (
              <Link
                to="/edit-profile"
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-200 dark:bg-dark-200 hover:bg-gray-300 dark:hover:bg-dark-300 rounded-full font-semibold transition-colors text-center"
              >
                Edit Profile
              </Link>
            ) : (
              <>
                <FollowButton userId={user._id} />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMessage}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </motion.button>
              </>
            )}
            <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 py-4 border-y border-gray-200 dark:border-dark-200">
          <div>
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
          </div>
          <div className="cursor-pointer hover:text-primary-500 transition-colors">
            <p className="text-2xl font-bold">{user.followers?.length || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
          </div>
          <div className="cursor-pointer hover:text-primary-500 transition-colors">
            <p className="text-2xl font-bold">{user.following?.length || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-6 border-b border-gray-200 dark:border-dark-200 overflow-x-auto scrollbar-hide">
          {[
            { id: 'posts', label: 'Posts', icon: Grid },
            { id: 'likes', label: 'Likes', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {activeTab === 'posts' && (
            posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center py-12 glass-effect rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
              </div>
            )
          )}
          
          {activeTab === 'likes' && (
            <div className="text-center py-12 glass-effect rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400">No liked posts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
