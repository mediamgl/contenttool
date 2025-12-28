/**
 * @krisspy-file
 * @type page
 * @name "AdminDashboard"
 * @title "Admin Dashboard"
 * @description "System administration dashboard with stats and user management"
 * @routes ["/admin"]
 * @requiresAuth false
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, HardDrive, TrendingUp, Activity, Settings, Trash2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { adminAPI } from '../services/api';

interface AdminStats {
  totalUsers: number;
  totalContent: number;
  totalDocuments: number;
  activeUsers: number;
  contentThisWeek: number;
  documentsThisMonth: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      role: 'user',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-brand' },
        { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-success' },
        { label: 'Total Content', value: stats.totalContent, icon: FileText, color: 'text-warning' },
        { label: 'This Week', value: stats.contentThisWeek, icon: TrendingUp, color: 'text-info' },
        { label: 'Documents', value: stats.totalDocuments, icon: HardDrive, color: 'text-secondary-brand' },
        { label: 'This Month', value: stats.documentsThisMonth, icon: BarChart3, color: 'text-accent' },
      ]
    : [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-inverse" />
              </div>
              <div>
                <h1 className="heading-2">Admin Dashboard</h1>
                <p className="body-small text-secondary">System statistics and management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl space-y-3xl">
          {/* Stats Grid */}
          <section>
            <h2 className="heading-3 mb-lg">System Overview</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-32 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {statCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={idx} variant="default">
                      <div className="flex items-start justify-between mb-md">
                        <div className={`w-12 h-12 bg-secondary rounded-lg flex items-center justify-center ${stat.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="caption text-secondary mb-xs">{stat.label}</p>
                      <p className="heading-2 text-brand">{stat.value}</p>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* User Management */}
          <section>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="heading-3">User Management</h2>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-md">
              {users.map(user => (
                <Card key={user.id} variant="default">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-md mb-md">
                        <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-inverse font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="heading-4">{user.name}</h3>
                          <p className="body-small text-secondary">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-lg flex-wrap">
                        <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {user.status}
                        </span>
                        <span className="badge badge-info">{user.role}</span>
                        <span className="caption text-secondary">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        <span className="caption text-secondary">
                          Last: {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button className="p-md hover:bg-secondary rounded-lg transition-colors text-danger">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* System Health */}
          <section>
            <h2 className="heading-3 mb-lg">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {[
                { label: 'API Status', status: 'healthy', detail: 'All systems operational' },
                { label: 'Database', status: 'healthy', detail: 'Connection stable' },
                { label: 'Storage', status: 'healthy', detail: '45% capacity used' },
              ].map((item, idx) => (
                <Card key={idx} variant="default">
                  <div className="flex items-start justify-between mb-md">
                    <div>
                      <p className="body-base font-semibold text-primary">{item.label}</p>
                      <p className="body-small text-secondary mt-sm">{item.detail}</p>
                    </div>
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  </div>
                  <span className={`badge ${item.status === 'healthy' ? 'badge-success' : 'badge-warning'}`}>
                    {item.status}
                  </span>
                </Card>
              ))}
            </div>
          </section>

          {/* Activity Log */}
          <section>
            <h2 className="heading-3 mb-lg">Recent Activity</h2>
            <Card>
              <div className="space-y-md">
                {[
                  { action: 'User registered', detail: 'jane@example.com', time: '2 hours ago', type: 'info' },
                  { action: 'Content published', detail: '5 pieces published', time: '5 hours ago', type: 'success' },
                  { action: 'API key added', detail: 'Anthropic provider', time: '1 day ago', type: 'info' },
                  { action: 'System backup', detail: 'Scheduled backup completed', time: '2 days ago', type: 'success' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-md pb-md border-b border-primary last:border-0 last:pb-0">
                    <div
                      className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 ${
                        log.type === 'success' ? 'bg-success' : 'bg-brand'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="body-small font-semibold text-primary">{log.action}</p>
                      <p className="text-xs text-secondary">{log.detail}</p>
                    </div>
                    <span className="caption text-secondary whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
