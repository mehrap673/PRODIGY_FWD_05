import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Comment from './Comment';

const PostCard = ({ post, onUpdate }) => {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [views] = useState(Math.floor(Math.random() * 1000) + 100);

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      setLikes(data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data } = await api.post('/comments', {
        postId: post._id,
        content: commentText
      });
      setComments([data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      await api.post(`/posts/${post._id}/save`);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Link to={`/profile/${post.author?._id}`}>
            <img
              src={post.author?.profilePicture}
              alt={post.author?.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link 
              to={`/profile/${post.author?._id}`}
              className="font-semibold hover:text-primary-500 transition-colors block truncate"
            >
              {post.author?.fullName}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{post.author?.username} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {post.content}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/explore?tag=${tag}`}
                className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-2 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.media.map((item, index) => (
            <div key={index} className="relative group overflow-hidden">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt="Post media"
                  className="w-full h-auto max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{views}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{comments.length}</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-200 flex items-center justify-around">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            isLiked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">Like</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-dark-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Comment Input */}
              <form onSubmit={handleComment} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 input-modern"
                />
                <button
                  type="submit"
                  className="btn-gradient"
                >
                  Post
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {comments.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
