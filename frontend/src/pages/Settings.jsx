import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, Lock, Bell, Shield, Eye, Globe, 
  Moon, Sun, Monitor 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Eye },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="glass-effect rounded-2xl p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-12 lg:col-span-9">
          <div className="glass-effect rounded-2xl p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bio</label>
                  <textarea
                    defaultValue={user?.bio}
                    className="input-modern"
                    rows="3"
                  />
                </div>

                <button onClick={handleSave} className="btn-gradient">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-dark-200">
                  <div>
                    <p className="font-semibold">Private Account</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Only followers can see your posts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-300 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-dark-200">
                  <div>
                    <p className="font-semibold">Show Activity Status</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let others see when you're online
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-300 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">Tagged Posts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow people to tag you in posts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-300 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                
                {['Likes', 'Comments', 'New Followers', 'Messages', 'Mentions'].map((notif) => (
                  <div key={notif} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-dark-200 last:border-0">
                    <p className="font-semibold">{notif}</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-300 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Appearance</h2>
                
                <div>
                  <p className="font-semibold mb-4">Theme</p>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-dark-200 hover:border-primary-300'
                      }`}
                    >
                      <Sun className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                      <p className="font-medium text-center">Light</p>
                    </button>
                    
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-dark-200 hover:border-primary-300'
                      }`}
                    >
                      <Moon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                      <p className="font-medium text-center">Dark</p>
                    </button>
                    
                    <button className="p-4 rounded-xl border-2 border-gray-200 dark:border-dark-200 hover:border-primary-300 transition-all">
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                      <p className="font-medium text-center">System</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
