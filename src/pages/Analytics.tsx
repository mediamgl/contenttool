/**
 * @krisspy-file
 * @type page
 * @name "Analytics"
 * @title "Analytics Dashboard"
 * @description "View content performance analytics and engagement metrics"
 * @routes ["/analytics"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, LineChart, Download, Filter, Calendar } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics: AnalyticsMetric[] = [
    {
      label: 'Total Views',
      value: '12,480',
      change: 24,
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-brand',
    },
    {
      label: 'Engagement Rate',
      value: '8.4%',
      change: 5,
      trend: 'up',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-success',
    },
    {
      label: 'Shares',
      value: '340',
      change: -2,
      trend: 'down',
      icon: <PieChart className="w-6 h-6" />,
      color: 'text-warning',
    },
    {
      label: 'Comments',
      value: '127',
      change: 12,
      trend: 'up',
      icon: <LineChart className="w-6 h-6" />,
      color: 'text-info',
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-lg flex-wrap gap-lg">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-inverse" />
                </div>
                <div>
                  <h1 className="heading-2">Analytics</h1>
                  <p className="body-small text-secondary">Track your content performance</p>
                </div>
              </div>

              <div className="flex items-center gap-md">
                <select
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                  className="input"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl space-y-3xl">
          {/* Metrics Grid */}
          <section>
            <h2 className="heading-3 mb-lg">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
              {metrics.map((metric, idx) => (
                <Card key={idx} variant="default">
                  <div className="flex items-start justify-between mb-md">
                    <div className={`w-12 h-12 bg-secondary rounded-lg flex items-center justify-center ${metric.color}`}>
                      {metric.icon}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        metric.trend === 'up' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {metric.trend === 'up' ? '+' : '-'}
                      {metric.change}%
                    </span>
                  </div>
                  <p className="caption text-secondary mb-xs">{metric.label}</p>
                  <p className="heading-2">{metric.value}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            {/* Views Chart */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-secondary rounded-lg flex items-center justify-center text-secondary">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 mx-auto mb-md opacity-50" />
                    <p className="text-sm">Line chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Content */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-md">
                  {[
                    { title: 'The Future of AI in 2024', views: 3240, engagement: 12.4 },
                    { title: 'Content Writing Tips', views: 2180, engagement: 8.7 },
                    { title: 'Social Media Strategy Guide', views: 1940, engagement: 9.2 },
                  ].map((item, idx) => (
                    <div key={idx} className="pb-md border-b border-primary last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-sm">
                        <p className="heading-4 text-primary">{item.title}</p>
                        <span className="badge badge-info">{item.views} views</span>
                      </div>
                      <div className="flex items-center gap-md">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${item.engagement}0%` }}
                          />
                        </div>
                        <span className="caption text-secondary whitespace-nowrap">
                          {item.engagement}% engagement
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Platform Breakdown */}
          <section>
            <h2 className="heading-3 mb-lg">Platform Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-lg">
              {[
                { platform: 'Medium', views: 4200, share: 34 },
                { platform: 'LinkedIn', views: 3100, share: 25 },
                { platform: 'Twitter', views: 2800, share: 22 },
                { platform: 'Dev.to', views: 1600, share: 13 },
                { platform: 'Substack', views: 780, share: 6 },
              ].map((item, idx) => (
                <Card key={idx} variant="default">
                  <div className="space-y-md">
                    <div>
                      <p className="caption text-secondary mb-xs">{item.platform}</p>
                      <p className="heading-3">{item.views}</p>
                      <p className="body-small text-secondary">views</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-sm">
                        <span className="text-xs text-secondary">Share</span>
                        <span className="text-xs font-semibold text-brand">{item.share}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand to-secondary-brand rounded-full"
                          style={{ width: `${item.share}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Audience Demographics */}
          <section>
            <h2 className="heading-3 mb-lg">Audience Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              {[
                {
                  title: 'Geographic Distribution',
                  data: [
                    { label: 'United States', value: 45 },
                    { label: 'United Kingdom', value: 20 },
                    { label: 'Canada', value: 15 },
                    { label: 'Other', value: 20 },
                  ],
                },
                {
                  title: 'Device Type',
                  data: [
                    { label: 'Desktop', value: 68 },
                    { label: 'Mobile', value: 28 },
                    { label: 'Tablet', value: 4 },
                  ],
                },
                {
                  title: 'Time of Day',
                  data: [
                    { label: 'Morning (6-12)', value: 25 },
                    { label: 'Afternoon (12-18)', value: 35 },
                    { label: 'Evening (18-24)', value: 28 },
                    { label: 'Night (0-6)', value: 12 },
                  ],
                },
              ].map((section, idx) => (
                <Card key={idx} variant="default">
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-md">
                      {section.data.map((item, itemIdx) => (
                        <div key={itemIdx}>
                          <div className="flex items-center justify-between mb-sm">
                            <span className="text-sm text-primary">{item.label}</span>
                            <span className="text-sm font-semibold text-brand">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand rounded-full"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
