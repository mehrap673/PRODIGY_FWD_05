import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import RightSidebar from './components/RightSidebar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-dark-50 transition-colors duration-300">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <div className="flex">
                        <Sidebar />
                        <div className="flex-1 flex flex-col">
                          <Navbar />
                          <main className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-0">
                            <div className="flex-1 min-w-0">
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/profile/:id" element={<Profile />} />
                                <Route path="/explore" element={<Explore />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/messages" element={<Messages />} />
                                <Route path="/bookmarks" element={<Bookmarks />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/analytics" element={<AnalyticsDashboard />} />
                                <Route path="/edit-profile" element={<EditProfile />} />
                              </Routes>
                            </div>
                            <RightSidebar />
                          </main>
                          <MobileNav />
                        </div>
                      </div>
                    </PrivateRoute>
                  }
                />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                className="mt-16"
              />
            </div>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
