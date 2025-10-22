import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Search, Send, MoreVertical, Phone, Video, Smile, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    // If coming from profile with conversationId
    if (location.state?.conversationId) {
      const conversation = conversations.find(c => c._id === location.state.conversationId);
      if (conversation) {
        setSelectedChat(conversation);
      }
    }
  }, [location.state, conversations]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.on('new message', (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      return () => {
        socket.off('new message');
      };
    }
  }, [socket]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      const { data } = await api.post('/messages', {
        conversationId: selectedChat._id,
        content: message
      });

      setMessages([...messages, data]);
      setMessage('');

      if (socket) {
        socket.emit('send message', {
          conversationId: selectedChat._id,
          content: message
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getOtherUser = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-gray-200 dark:border-dark-200 bg-white dark:bg-dark-100`}>
        <div className="p-4 border-b border-gray-200 dark:border-dark-200">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-200 rounded-full outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-12rem)] pb-20 lg:pb-0 scrollbar-hide">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">No conversations yet</p>
              <p className="text-sm mt-2">Visit someone's profile and click Message to start chatting</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = getOtherUser(conv);
              return (
                <motion.button
                  key={conv._id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full p-4 flex items-center gap-3 border-b border-gray-200 dark:border-dark-200 transition-colors ${
                    selectedChat?._id === conv._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={otherUser?.profilePicture || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'}
                      alt={otherUser?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {otherUser?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-100 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{otherUser?.fullName}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conv.updatedAt && formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-dark-100">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full"
              >
                ←
              </button>
              <div className="relative">
                <img
                  src={getOtherUser(selectedChat)?.profilePicture || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'}
                  alt={getOtherUser(selectedChat)?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {getOtherUser(selectedChat)?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-100 rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-semibold">{getOtherUser(selectedChat)?.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getOtherUser(selectedChat)?.isOnline ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-50 pb-20 lg:pb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${msg.sender._id === user._id ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender._id === user._id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        : 'bg-white dark:bg-dark-100'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-dark-200 bg-white dark:bg-dark-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-200 rounded-full outline-none focus:ring-2 focus:ring-primary-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!message.trim()}
                className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-dark-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your Messages</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
