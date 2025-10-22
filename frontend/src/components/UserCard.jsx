import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <Link to={`/profile/${user._id}`}>
        <img src={user.profilePicture} alt={user.username} className="user-card-avatar" />
      </Link>
      <div className="user-card-info">
        <Link to={`/profile/${user._id}`} className="user-card-name">
          {user.fullName}
        </Link>
        <p className="user-card-username">@{user.username}</p>
      </div>
      <FollowButton userId={user._id} />
    </div>
  );
};

export default UserCard;
