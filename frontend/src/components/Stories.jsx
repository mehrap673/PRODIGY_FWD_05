import { useState, useEffect } from 'react';
import { Plus, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data } = await api.get('/stories');
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    try {
      await api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Story uploaded!');
      fetchStories();
      setShowUpload(false);
    } catch (error) {
      toast.error('Failed to upload story');
    }
  };

  const viewStory = async (storyGroup, index) => {
    setSelectedStory(storyGroup);
    setCurrentIndex(index);
    
    // Mark as viewed
    try {
      await api.post(`/stories/${storyGroup.stories[0]._id}/view`);
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  };

  const nextStory = () => {
    if (currentIndex < selectedStory.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to next user's stories
      const currentUserIndex = stories.findIndex(s => s.author._id === selectedStory.author._id);
      if (currentUserIndex < stories.length - 1) {
        viewStory(stories[currentUserIndex + 1], 0);
      } else {
        setSelectedStory(null);
      }
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4">
        {/* Add Story */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setShowUpload(true)}
            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
          <p className="text-xs text-center mt-2 font-medium">Your Story</p>
        </div>

        {/* Stories */}
        {stories.map((storyGroup, idx) => (
          <div key={storyGroup.author._id} className="flex-shrink-0">
            <button
              onClick={() => viewStory(storyGroup, 0)}
              className={`relative w-20 h-20 rounded-full p-1 ${
                storyGroup.hasViewed
                  ? 'bg-gray-300 dark:bg-dark-300'
                  : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
              }`}
            >
              <img
                src={storyGroup.author.profilePicture}
                alt={storyGroup.author.username}
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-100"
              />
            </button>
            <p className="text-xs text-center mt-2 font-medium truncate w-20">
              {storyGroup.author.username}
            </p>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-2">
              {selectedStory.stories.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      idx === currentIndex ? 'w-full' : idx < currentIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStory.author.profilePicture}
                  alt={selectedStory.author.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{selectedStory.author.fullName}</p>
                  <p className="text-gray-300 text-sm">2h ago</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Story Content */}
            <div className="relative w-full max-w-lg aspect-[9/16]">
              {selectedStory.stories[currentIndex].media.type === 'image' ? (
                <img
                  src={selectedStory.stories[currentIndex].media.url}
                  alt="Story"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={selectedStory.stories[currentIndex].media.url}
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}

              {/* Navigation */}
              <button
                onClick={prevStory}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 rounded-full"
              >
                ←
              </button>
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 rounded-full"
              >
                →
              </button>
            </div>

            {/* Story Caption */}
            {selectedStory.stories[currentIndex].caption && (
              <div className="absolute bottom-20 left-4 right-4">
                <p className="text-white text-center">
                  {selectedStory.stories[currentIndex].caption}
                </p>
              </div>
            )}

            {/* Views */}
            <div className="absolute bottom-8 left-4 flex items-center gap-2 text-white">
              <Eye className="w-5 h-5" />
              <span>{selectedStory.stories[currentIndex].views?.length || 0} views</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-effect rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Create Story</h2>
              <label className="block w-full p-8 border-2 border-dashed border-gray-300 dark:border-dark-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <div className="text-center">
                  <Plus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Click to upload image or video
                  </p>
                </div>
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Stories;
