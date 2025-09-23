import React, { useState } from 'react';
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
  Send
} from 'lucide-react';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: 'New User Registration',
    message: 'John Doe has registered as a new user.',
    type: 'info',
    isRead: false,
    timestamp: '2025-09-22T14:32:00Z',
    user: 'John Doe',
    userAvatar: null
  },
  {
    id: 2,
    title: 'System Update',
    message: 'The system will undergo maintenance on September 25th at 2:00 AM UTC. Expect 30 minutes of downtime.',
    type: 'warning',
    isRead: false,
    timestamp: '2025-09-22T10:15:00Z',
    user: 'System',
    userAvatar: null
  },
  {
    id: 3,
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully.',
    type: 'success',
    isRead: true,
    timestamp: '2025-09-22T03:00:00Z',
    user: 'System',
    userAvatar: null
  },
  {
    id: 4,
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.254.',
    type: 'error',
    isRead: true,
    timestamp: '2025-09-21T22:45:00Z',
    user: 'Security System',
    userAvatar: null
  },
  {
    id: 5,
    title: 'New Comment',
    message: 'Alice Williams commented on your recent post.',
    type: 'info',
    isRead: true,
    timestamp: '2025-09-21T16:20:00Z',
    user: 'Alice Williams',
    userAvatar: null
  },
  {
    id: 6,
    title: 'Storage Warning',
    message: 'Your storage usage is at 85% of your allocated quota.',
    type: 'warning',
    isRead: true,
    timestamp: '2025-09-21T09:10:00Z',
    user: 'System',
    userAvatar: null
  },
  {
    id: 7,
    title: 'Task Completed',
    message: 'Weekly analytics report generation completed.',
    type: 'success',
    isRead: true,
    timestamp: '2025-09-20T23:55:00Z',
    user: 'System',
    userAvatar: null
  },
];

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  
  // Filter notifications based on search term and filter
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && !notification.isRead;
    if (filter === 'read') return matchesSearch && notification.isRead;
    if (filter === 'info') return matchesSearch && notification.type === 'info';
    if (filter === 'warning') return matchesSearch && notification.type === 'warning';
    if (filter === 'success') return matchesSearch && notification.type === 'success';
    if (filter === 'error') return matchesSearch && notification.type === 'error';
    
    return matchesSearch;
  });
  
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
    if (!isRead) return 'bg-blue-50';
    
    switch (type) {
      case 'info':
        return 'bg-white hover:bg-blue-50';
      case 'warning':
        return 'bg-white hover:bg-yellow-50';
      case 'success':
        return 'bg-white hover:bg-green-50';
      case 'error':
        return 'bg-white hover:bg-red-50';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500">Manage system notifications and alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsComposeModalOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Compose
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
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
          <Card className="h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  {filteredNotifications.filter(n => !n.isRead).length} unread notifications
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all read
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
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
              
              <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-md cursor-pointer flex items-start ${
                        getNotificationBgColor(notification.type, notification.isRead)
                      } ${selectedNotification?.id === notification.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => {
                        setSelectedNotification(notification);
                        if (!notification.isRead) {
                          handleMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatDate(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-500 font-medium">No notifications found</h3>
                    <p className="text-gray-400 text-sm">
                      {searchTerm ? 'Try a different search term' : 'You\'re all caught up!'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Notification Detail */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedNotification ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getNotificationIcon(selectedNotification.type)}
                      <CardTitle className="ml-2">{selectedNotification.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteNotification(selectedNotification.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedNotification(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {formatDate(selectedNotification.timestamp)} • From {selectedNotification.user}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{selectedNotification.message}</p>
                    
                    {/* Additional content based on notification type */}
                    {selectedNotification.type === 'warning' && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Warning Details</h4>
                            <p className="text-sm text-yellow-700">
                              This is a system warning that requires your attention. Please review the details and take appropriate action.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedNotification.type === 'error' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800">Error Details</h4>
                            <p className="text-sm text-red-700">
                              This is a critical error that requires immediate attention. Please investigate and resolve as soon as possible.
                            </p>
                            <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-800 overflow-x-auto">
                              Error Code: SEC-1254<br />
                              Location: Authentication Service<br />
                              Time: {new Date(selectedNotification.timestamp).toISOString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedNotification.type === 'success' && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800">Success Details</h4>
                            <p className="text-sm text-green-700">
                              The operation completed successfully. No further action is required.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
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
                <Bell className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No notification selected</h3>
                <p className="text-gray-500 text-center max-w-md">
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
                <p className="text-sm font-medium text-gray-500">Total</p>
                <h4 className="text-2xl font-bold">{notifications.length}</h4>
              </div>
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <h4 className="text-2xl font-bold">{notifications.filter(n => !n.isRead).length}</h4>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Warnings</p>
                <h4 className="text-2xl font-bold">{notifications.filter(n => n.type === 'warning').length}</h4>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Errors</p>
                <h4 className="text-2xl font-bold">{notifications.filter(n => n.type === 'error').length}</h4>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Compose Notification Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Compose Notification</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsComposeModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="notification-title">Title</Label>
                <Input id="notification-title" placeholder="Enter notification title" />
              </div>
              
              <div>
                <Label htmlFor="notification-message">Message</Label>
                <textarea 
                  id="notification-message" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                  placeholder="Enter notification message"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notification-type">Type</Label>
                  <select 
                    id="notification-type" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="notification-recipients">Recipients</Label>
                  <select 
                    id="notification-recipients" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                <input type="checkbox" id="send-email" className="rounded border-gray-300" />
                <Label htmlFor="send-email">Also send as email</Label>
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

export default NotificationsSection;