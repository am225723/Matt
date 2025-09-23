import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  UserPlus, 
  Download, 
  Upload, 
  Filter,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  User,
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';

// Mock user data
const mockUsers = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'Admin', 
    status: 'Active',
    lastLogin: '2025-09-22T14:32:00Z',
    createdAt: '2025-01-15T09:20:00Z',
    avatar: null,
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    location: 'New York, USA'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'Editor', 
    status: 'Active',
    lastLogin: '2025-09-21T10:15:00Z',
    createdAt: '2025-02-20T11:45:00Z',
    avatar: null,
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    location: 'San Francisco, USA'
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'Viewer', 
    status: 'Inactive',
    lastLogin: '2025-08-15T16:20:00Z',
    createdAt: '2025-03-10T14:30:00Z',
    avatar: null,
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    location: 'Chicago, USA'
  },
  { 
    id: 4, 
    name: 'Alice Williams', 
    email: 'alice@example.com', 
    role: 'Editor', 
    status: 'Active',
    lastLogin: '2025-09-22T09:45:00Z',
    createdAt: '2025-04-05T08:15:00Z',
    avatar: null,
    phone: '+1 (555) 456-7890',
    department: 'Design',
    location: 'Austin, USA'
  },
  { 
    id: 5, 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    role: 'Viewer', 
    status: 'Active',
    lastLogin: '2025-09-20T11:30:00Z',
    createdAt: '2025-05-12T13:40:00Z',
    avatar: null,
    phone: '+1 (555) 567-8901',
    department: 'Support',
    location: 'Miami, USA'
  },
  { 
    id: 6, 
    name: 'Diana Prince', 
    email: 'diana@example.com', 
    role: 'Admin', 
    status: 'Active',
    lastLogin: '2025-09-21T15:20:00Z',
    createdAt: '2025-06-18T10:30:00Z',
    avatar: null,
    phone: '+1 (555) 678-9012',
    department: 'Executive',
    location: 'Seattle, USA'
  },
  { 
    id: 7, 
    name: 'Edward Stark', 
    email: 'edward@example.com', 
    role: 'Editor', 
    status: 'Inactive',
    lastLogin: '2025-09-10T08:45:00Z',
    createdAt: '2025-07-22T14:15:00Z',
    avatar: null,
    phone: '+1 (555) 789-0123',
    department: 'Product',
    location: 'Boston, USA'
  },
];

const UserManagementSectionRedesign = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === 'role') {
      comparison = a.role.localeCompare(b.role);
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField === 'lastLogin') {
      comparison = new Date(a.lastLogin) - new Date(b.lastLogin);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setIsDeleteConfirmOpen(false);
    setSelectedUser(null);
  };
  
  // Handle user status toggle
  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Active' ? 'Inactive' : 'Active'
        };
      }
      return user;
    }));
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle row selection
  const handleRowSelection = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter(id => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };
  
  // Handle select all rows
  const handleSelectAllRows = () => {
    if (selectedRows.length === currentUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentUsers.map(user => user.id));
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (action === 'delete') {
      setUsers(users.filter(user => !selectedRows.includes(user.id)));
      setSelectedRows([]);
    } else if (action === 'activate') {
      setUsers(users.map(user => {
        if (selectedRows.includes(user.id)) {
          return { ...user, status: 'Active' };
        }
        return user;
      }));
    } else if (action === 'deactivate') {
      setUsers(users.map(user => {
        if (selectedRows.includes(user.id)) {
          return { ...user, status: 'Inactive' };
        }
        return user;
      }));
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Get user avatar or initials
  const getUserAvatar = (user) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />;
    } else {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      return (
        <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
          {initials}
        </div>
      );
    }
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsAddUserModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
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
          <div className="flex">
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              onClick={() => setViewMode('table')}
              size="icon"
              className="rounded-r-none"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              onClick={() => setViewMode('grid')}
              size="icon"
              className="rounded-l-none"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Bulk Actions (visible when rows are selected) */}
          {selectedRows.length > 0 && (
            <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedRows.length} {selectedRows.length === 1 ? 'user' : 'users'} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* User List - Table View */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 dark:border-gray-600"
                        checked={selectedRows.length === currentUsers.length && currentUsers.length > 0}
                        onChange={handleSelectAllRows}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      User
                      {sortField === 'name' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('role')}
                    >
                      Role
                      {sortField === 'role' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortField === 'status' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('lastLogin')}
                    >
                      Last Login
                      {sortField === 'lastLogin' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedRows.includes(user.id)}
                          onChange={() => handleRowSelection(user.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 mr-3">
                          {getUserAvatar(user)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {currentUsers.length === 0 && (
            <div className="text-center py-10">
              <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">No users found</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {searchTerm || filterRole !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Add a new user to get started'}
              </p>
              {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('all');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {currentUsers.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedUsers.length)} of {sortedUsers.length} users
                </span>
                <select 
                  className="ml-4 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* User List - Grid View */}
      {viewMode === 'grid' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-3">
                      {getUserAvatar(user)}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last login: {formatDate(user.lastLogin).split(',')[0]}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add User Card */}
            <Card className="overflow-hidden border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent">
              <CardContent className="p-0">
                <button 
                  className="w-full h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => setIsAddUserModalOpen(true)}
                >
                  <UserPlus className="h-10 w-10 mb-2" />
                  <span className="font-medium">Add New User</span>
                </button>
              </CardContent>
            </Card>
          </div>
          
          {/* Empty State */}
          {currentUsers.length === 0 && (
            <Card className="py-10">
              <div className="text-center">
                <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">No users found</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Add a new user to get started'}
                </p>
                {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterRole('all');
                      setFilterStatus('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          )}
          
          {/* Pagination */}
          {currentUsers.length > 0 && (
            <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedUsers.length)} of {sortedUsers.length} users
                </span>
                <select 
                  className="ml-4 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={8}>8 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={16}>16 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add New User</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select id="role" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <select id="department" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="design">Design</option>
                    <option value="support">Support</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="sendInvite" className="rounded border-gray-300 dark:border-gray-600" />
                <Label htmlFor="sendInvite">Send invitation email</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddUserModalOpen(false)}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit User</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditUserModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20">
                  {getUserAvatar(selectedUser)}
                </div>
              </div>
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" defaultValue={selectedUser.name} />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <select 
                    id="edit-role" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={selectedUser.role.toLowerCase()}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select 
                    id="edit-status" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={selectedUser.status.toLowerCase()}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input id="edit-phone" defaultValue={selectedUser.phone} />
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input id="edit-department" defaultValue={selectedUser.department} />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input id="edit-location" defaultValue={selectedUser.location} />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditUserModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditUserModalOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete the user "{selectedUser.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementSectionRedesign;