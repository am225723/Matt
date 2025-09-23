import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  Info, 
  X, 
  Filter, 
  RefreshCw,
  CheckCircle,
  Settings,
  Send,
  Search,
  MoreHorizontal,
  Trash2,
  Archive,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  MessageSquare,
  Mail
} from 'lucide-react';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: 'New User Registration',
    message: 'John Doe has registered as a new user.',
    type: 'info',
    isRead: false,
    isStarred: false,
    timestamp: '2025-09-22T14:32:00Z',
    user: 'John Doe',
    userAvatar: null,
    category: 'user'
  },
  {
    id: 2,
    title: 'System Update',
    message: 'The system will undergo maintenance on September 25th at 2:00 AM UTC. Expect 30 minutes of downtime.',
    type: 'warning',
    isRead: false,
    isStarred: true,
    timestamp: '2025-09-22T10:15:00Z',
    user: 'System',
    userAvatar: null,
    category: 'system'
  },
  {
    id: 3,
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully.',
    type: 'success',
    isRead: true,
    isStarred: false,
    timestamp: '2025-09-22T03:00:00Z',
    user: 'System',
    userAvatar: null,
    category: 'system'
  },
  {
    id: 4,
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.254.',
    type: 'error',
    isRead: true,
    isStarred: true,
    timestamp: '2025-09-21T22:45:00Z',
    user: 'Security System',
    userAvatar: null,
    category: 'security'
  },
  {
    id: 5,
    title: 'New Comment',
    message: 'Alice Williams commented on your recent post.',
    type: 'info',
    isRead: true,
    isStarred: false,
    timestamp: '2025-09-21T16:20:00Z',
    user: 'Alice Williams',
    userAvatar: null,
    category: 'comment'
  },
  {
    id: 6,
    title: 'Storage Warning',
    message: 'Your storage usage is at 85% of your allocated quota.',
    type: 'warning',
    isRead: true,
    isStarred: false,
    timestamp: '2025-09-21T09:10:00Z',
    user: 'System',
    userAvatar: null,
    category: 'system'
  },
  {
    id: 7,
    title: 'Task Completed',
    message: 'Weekly analytics report generation completed.',
    type: 'success',
    isRead: true,
    isStarred: false,
    timestamp: '2025-09-20T23:55:00Z',
    user: 'System',
    userAvatar: null,
    category: 'task'
  },
];

const NotificationsSectionRedesign = ({ onNotificationsRead }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Filter notifications based on search term, filter, and category
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead) ||
      (filter === 'starred' && notification.isStarred);
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      notification.category === selectedCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };
  
  // Handle marking notification as read
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    if (onNotificationsRead) {
      onNotificationsRead();
    }
  };
  
  // Handle toggling star status
  const handleToggleStar = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isStarred: !notification.isStarred } : notification
    ));
  };
  
  // Handle deleting a notification
  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
  };
  
  // Handle refreshing notifications
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get notification background color based on type
  const getNotificationBgColor = (type, isRead) => {
    if (!isRead) return 'bg-blue-50 dark:bg-blue-900/20';
    
    switch (type) {
      case 'info':
        return 'bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/10';
      case 'warning':
        return 'bg-white hover:bg-yellow-50 dark:bg-gray-800 dark:hover:bg-yellow-900/10';
      case 'success':
        return 'bg-white hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-green-900/10';
      case 'error':
        return 'bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/10';
      default:
        return 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700';
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'task':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Effect to update parent component with unread count
  useEffect(() => {
    if (unreadCount === 0 && onNotificationsRead) {
      onNotificationsRead();
    }
  }, [unreadCount, onNotificationsRead]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsComposeModalOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Compose
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </>
            )}
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount} unread
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all read
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search notifications..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 flex space-x-2 overflow-x-auto pb-1">
                  <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filter === 'unread' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </Button>
                  <Button 
                    variant={filter === 'starred' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('starred')}
                  >
                    Starred
                  </Button>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {currentNotifications.length > 0 ? (
                  currentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${
                        getNotificationBgColor(notification.type, notification.isRead)
                      } ${selectedNotification?.id === notification.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => {
                        setSelectedNotification(notification);
                        if (!notification.isRead) {
                          handleMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium text-sm ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            <button 
                              className="ml-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(notification.id);
                              }}
                            >
                              <Star className={`h-4 w-4 ${notification.isStarred ? 'text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400' : ''}`} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(notification.timestamp)}</span>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">No notifications found</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'You\'re all caught up!'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {filteredNotifications.length > itemsPerPage && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Notification Detail */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden h-full">
            {selectedNotification ? (
              <>
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between py-4">
                  <div className="flex items-center">
                    {getNotificationIcon(selectedNotification.type)}
                    <CardTitle className="ml-2 text-lg">{selectedNotification.title}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleStar(selectedNotification.id)}
                    >
                      <Star className={`h-4 w-4 ${selectedNotification.isStarred ? 'text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteNotification(selectedNotification.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedNotification(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <span>From: {selectedNotification.user}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(selectedNotification.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{selectedNotification.message}</p>
                    
                    {/* Additional content based on notification type */}
                    {selectedNotification.type === 'warning' && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Warning Details</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                              This is a system warning that requires your attention. Please review the details and take appropriate action.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedNotification.type === 'error' && (
                      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800 dark:text-red-300">Error Details</h4>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              This is a critical error that requires immediate attention. Please investigate and resolve as soon as possible.
                            </p>
                            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs font-mono text-red-800 dark:text-red-300 overflow-x-auto">
                              Error Code: SEC-1254<br />
                              Location: Authentication Service<br />
                              Time: {new Date(selectedNotification.timestamp).toISOString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedNotification.type === 'success' && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800 dark:text-green-300">Success Details</h4>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              The operation completed successfully. No further action is required.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">
                        Archive
                      </Button>
                      <Button>
                        Take Action
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No notification selected</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  Select a notification from the list to view its details here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <h4 className="text-2xl font-bold">{notifications.length}</h4>
              </div>
              <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unread</p>
                <h4 className="text-2xl font-bold">{unreadCount}</h4>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Warnings</p>
                <h4 className="text-2xl font-bold">{notifications.filter(n => n.type === 'warning').length}</h4>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Errors</p>
                <h4 className="text-2xl font-bold">{notifications.filter(n => n.type === 'error').length}</h4>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Compose Notification Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Compose Notification</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsComposeModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="notification-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <Input id="notification-title" placeholder="Enter notification title" />
              </div>
              
              <div>
                <label htmlFor="notification-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea 
                  id="notification-message" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Enter notification message"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="notification-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select 
                    id="notification-type" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="notification-recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipients</label>
                  <select 
                    id="notification-recipients" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Users</option>
                    <option value="admins">Admins Only</option>
                    <option value="editors">Editors Only</option>
                    <option value="viewers">Viewers Only</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="send-email" 
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
                />
                <label htmlFor="send-email" className="text-sm text-gray-700 dark:text-gray-300">Also send as email</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsComposeModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsComposeModalOpen(false)}>
                Send Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsSectionRedesign;