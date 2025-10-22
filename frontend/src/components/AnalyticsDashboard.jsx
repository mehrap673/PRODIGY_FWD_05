import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [engagementData, setEngagementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, engagementRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/engagement?period=7')
      ]);

      setStats(statsRes.data);
      
      // Format engagement data for chart
      const chartData = Object.entries(engagementRes.data).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        engagements: data.engagements,
        posts: data.posts,
        rate: parseFloat(data.rate)
      }));
      
      setEngagementData(chartData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your account performance and engagement
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Followers"
          value={stats.followers.total}
          change={`+${stats.followers.weekGrowth}`}
          changePercent={stats.followers.percentageGrowth}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Posts"
          value={stats.posts.total}
          change={`${stats.posts.totalLikes} likes`}
          color="green"
        />
        <StatCard
          icon={Heart}
          label="Avg Likes"
          value={stats.posts.averageLikes}
          change={`${stats.engagement.rate}% rate`}
          color="red"
        />
        <StatCard
          icon={MessageCircle}
          label="Comments"
          value={stats.posts.totalComments}
          change={`${stats.posts.totalShares} shares`}
          color="purple"
        />
      </div>

      {/* Engagement Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-4">Engagement Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagements"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Engagement Rate Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-4">Engagement Rate</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Bar dataKey="rate" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, change, changePercent, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colors[color]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {changePercent && (
          <span className="text-green-500 font-semibold text-sm">
            +{changePercent}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
        {label}
      </h3>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{change}</p>
    </motion.div>
  );
};

export default AnalyticsDashboard;
