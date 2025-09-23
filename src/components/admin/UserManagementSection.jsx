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
  Filter
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
    createdAt: '2025-01-15T09:20:00Z'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'Editor', 
    status: 'Active',
    lastLogin: '2025-09-21T10:15:00Z',
    createdAt: '2025-02-20T11:45:00Z'
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'Viewer', 
    status: 'Inactive',
    lastLogin: '2025-08-15T16:20:00Z',
    createdAt: '2025-03-10T14:30:00Z'
  },
  { 
    id: 4, 
    name: 'Alice Williams', 
    email: 'alice@example.com', 
    role: 'Editor', 
    status: 'Active',
    lastLogin: '2025-09-22T09:45:00Z',
    createdAt: '2025-04-05T08:15:00Z'
  },
  { 
    id: 5, 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    role: 'Viewer', 
    status: 'Active',
    lastLogin: '2025-09-20T11:30:00Z',
    createdAt: '2025-05-12T13:40:00Z'
  },
];

const UserManagementSection = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddUserModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Login</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'Editor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(user.lastLogin)}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
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
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No users found matching your search criteria.</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> users
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-900 text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add User Modal Placeholder */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select id="role" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="sendInvite" className="rounded border-gray-300" />
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
      
      {/* Edit User Modal Placeholder */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" defaultValue={selectedUser.name} />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <select 
                  id="edit-role" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue={selectedUser.status.toLowerCase()}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the user "{selectedUser.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 text-white"
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

export default UserManagementSection;