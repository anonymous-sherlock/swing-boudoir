import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Trash2,
  Download,
  Plus
} from 'lucide-react';
import { AdminUser } from '../types/adminTypes';
import { useAdmin } from '../contexts/AdminContext';

interface UserTableProps {
  users: AdminUser[];
  onUserAction: (userId: string, action: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onUserAction }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge variant="secondary">Suspended</Badge>;
      case 'banned':
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-red-500">Admin</Badge>;
      case 'moderator':
        return <Badge variant="default" className="bg-blue-500">Moderator</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <input
                      type="checkbox"
                      placeholder='Select All'
                      checked={selectedUsers.length === users.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Competitions</th>
                  <th className="text-left p-2">Votes</th>
                  <th className="text-left p-2">Joined</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        placeholder='Select'
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{getRoleBadge(user.role)}</td>
                    <td className="p-2">{getStatusBadge(user.status)}</td>
                    <td className="p-2">{user.competitions}</td>
                    <td className="p-2">{user.totalVotes}</td>
                    <td className="p-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const UserManagement: React.FC = () => {
  const { logAdminAction } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock users data
  useEffect(() => {
    const mockUsers: AdminUser[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-15T00:00:00Z',
        lastLogin: '2024-01-20T10:30:00Z',
        competitions: 3,
        totalVotes: 45
      },
      {
        id: '2',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'moderator',
        status: 'active',
        createdAt: '2024-01-10T00:00:00Z',
        lastLogin: '2024-01-20T09:15:00Z',
        competitions: 5,
        totalVotes: 120
      },
      {
        id: '3',
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'user',
        status: 'suspended',
        createdAt: '2024-01-05T00:00:00Z',
        lastLogin: '2024-01-18T14:20:00Z',
        competitions: 1,
        totalVotes: 8
      },
      {
        id: '4',
        email: 'admin@swingboudoir.com',
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-20T11:45:00Z',
        competitions: 0,
        totalVotes: 0
      }
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setIsLoading(false);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleUserAction = async (userId: string, action: string) => {
    await logAdminAction(action, 'user', userId);
    // Handle the action (suspend, ban, etc.)
  };

  const handleExportUsers = async () => {
    await logAdminAction('EXPORT_USERS', 'system', 'export');
    // Export functionality
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              title='Status'
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={roleFilter}
              title='Role'
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <Button variant="outline" className="justify-start">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">Active</Badge>
              <span className="text-sm font-medium">Active Users</span>
            </div>
            <p className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Suspended</Badge>
              <span className="text-sm font-medium">Suspended</span>
            </div>
            <p className="text-2xl font-bold">
              {users.filter(u => u.status === 'suspended').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">Banned</Badge>
            </div>
            <p className="text-2xl font-bold">
              {users.filter(u => u.status === 'banned').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <UserTable 
        users={filteredUsers} 
        onUserAction={handleUserAction}
      />
    </div>
  );
}; 