import Story from '../models/Story.js';
import Notification from '../models/Notification.js';

export const cleanupExpiredStories = async () => {
  try {
    const deletedStories = await Story.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    console.log(`🧹 Cleaned up ${deletedStories.deletedCount} expired stories`);
  } catch (error) {
    console.error('Error cleaning up stories:', error);
  }
};

export const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedNotifications = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true
    });

    console.log(`🧹 Cleaned up ${deletedNotifications.deletedCount} old notifications`);
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
  }
};
