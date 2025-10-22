import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Comment = ({ comment }) => {
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
    >
      <Link to={`/profile/${comment.author?._id}`}>
        <img
          src={comment.author?.profilePicture}
          alt={comment.author?.username}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-dark-200"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-dark-100 rounded-2xl px-4 py-2">
          <Link
            to={`/profile/${comment.author?._id}`}
            className="font-semibold text-sm hover:text-primary-500 transition-colors"
          >
            {comment.author?.fullName}
          </Link>
          <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
            {comment.content}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2 px-2">
          <button
            onClick={handleLike}
            className={`text-xs font-medium flex items-center gap-1 hover:text-primary-500 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            {likes > 0 && likes}
          </button>
          <button className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">
            Reply
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;
