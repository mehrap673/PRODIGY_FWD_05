import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Image, Video, Smile, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import Stories from '../components/Stories';
import { toast } from 'react-toastify';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts/feed');
      setPosts(data);
    } catch (error) {
      toast.error('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);

    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'image' : 'video'
    }));
    setMediaPreviews(previews);
  };

  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    setIsPosting(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('tags', tags);
    
    mediaFiles.forEach(file => {
      formData.append('media', file);
    });

    try {
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([data, ...posts]);
      setContent('');
      setTags('');
      setMediaFiles([]);
      setMediaPreviews([]);
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Error creating post');
    } finally {
      setIsPosting(false);
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
    <div className="max-w-2xl mx-auto p-4 pb-24 lg:pb-4 space-y-6">
      {/* Stories */}
      <Stories />
      
      {/* Create Post Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex gap-4">
          <img
            src={user?.profilePicture}
            alt={user?.username}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
          />
          <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
            <textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 text-lg"
              rows="3"
            />

            <input
              type="text"
              placeholder="Add tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-100 dark:bg-dark-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />

            {/* Media Previews */}
            <AnimatePresence>
              {mediaPreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden">
                      {preview.type === 'image' ? (
                        <img
                          src={preview.url}
                          alt={`Preview ${index}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <video
                          src={preview.url}
                          className="w-full h-48 object-cover"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-200">
              <div className="flex gap-2">
                <label className="p-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full cursor-pointer transition-colors group">
                  <Image className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  className="p-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors group"
                >
                  <Video className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  type="button"
                  className="p-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors group"
                >
                  <Smile className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <button
                type="submit"
                disabled={isPosting || (!content.trim() && mediaFiles.length === 0)}
                className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts yet. Start following people to see their posts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
