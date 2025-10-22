import { useState } from 'react';
import api from '../utils/api';

const FollowButton = ({ userId, initialFollowing = false }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/users/${userId}/unfollow`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/${userId}/follow`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
