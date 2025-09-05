"use client";

import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function SocialDashboard() {
  const { user, signOut } = useAuthenticator();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Followers', value: '2.4M', change: '+12.5%', icon: '👥' },
    { title: 'Engagement Rate', value: '4.2%', change: '+0.8%', icon: '💬' },
    { title: 'Posts This Month', value: '47', change: '+15', icon: '📝' },
    { title: 'Reach', value: '8.9M', change: '+23.1%', icon: '📈' }
  ];

  const recentPosts = [
    { platform: 'Twitter', content: 'Just launched our new feature! Check it out...', time: '2h ago', engagement: '1.2K' },
    { platform: 'Instagram', content: 'Behind the scenes of our latest campaign', time: '4h ago', engagement: '3.4K' },
    { platform: 'LinkedIn', content: 'Industry insights: The future of social media', time: '6h ago', engagement: '856' },
    { platform: 'Facebook', content: 'Community spotlight: Meet our top contributors', time: '8h ago', engagement: '2.1K' }
  ];

  const accounts = [
    { platform: 'Twitter', handle: '@company', followers: '125K', status: 'active' },
    { platform: 'Instagram', handle: '@company_official', followers: '89K', status: 'active' },
    { platform: 'LinkedIn', handle: 'Company Inc.', followers: '45K', status: 'active' },
    { platform: 'Facebook', handle: 'Company Page', followers: '67K', status: 'paused' }
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SocialFlow</h2>
          <span className="sidebar-subtitle">Social Media Manager</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <span className="nav-icon">📝</span>
            <span>Posts</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon">📈</span>
            <span>Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            <span className="nav-icon">🔗</span>
            <span>Accounts</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'scheduling' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduling')}
          >
            <span className="nav-icon">⏰</span>
            <span>Scheduling</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <span className="nav-icon">💬</span>
            <span>Inbox</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.signInDetails?.loginId?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.signInDetails?.loginId}</span>
              <span className="user-role">Social Manager</span>
            </div>
          </div>
          <button onClick={signOut} className="sign-out-btn">
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'posts' && 'Content Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
              {activeTab === 'accounts' && 'Account Management'}
              {activeTab === 'scheduling' && 'Post Scheduling'}
              {activeTab === 'inbox' && 'Message Inbox'}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'overview' && 'Monitor your social media performance across all platforms'}
              {activeTab === 'posts' && 'Create, edit, and manage your social media content'}
              {activeTab === 'analytics' && 'Detailed insights and performance metrics'}
              {activeTab === 'accounts' && 'Manage connected social media accounts'}
              {activeTab === 'scheduling' && 'Schedule posts across multiple platforms'}
              {activeTab === 'inbox' && 'Manage messages and comments'}
            </p>
          </div>
          
          <div className="header-right">
            <div className="notifications">
              <button className="notification-btn">
                <span>🔔</span>
                <span className="notification-badge">3</span>
              </button>
            </div>
            <button className="create-post-btn">
              <span>➕</span>
              <span>Create Post</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <h3 className="stat-title">{stat.title}</h3>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-change positive">{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts and Recent Activity */}
              <div className="dashboard-grid">
                <div className="chart-container">
                  <div className="chart-header">
                    <h3>Engagement Trends</h3>
                    <div className="chart-controls">
                      <button className="chart-btn active">7D</button>
                      <button className="chart-btn">30D</button>
                      <button className="chart-btn">90D</button>
                    </div>
                  </div>
                  <div className="chart-placeholder">
                    <div className="chart-bars">
                      {[65, 45, 80, 55, 70, 90, 75].map((height, i) => (
                        <div key={i} className="chart-bar" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                    <div className="chart-labels">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                <div className="recent-posts">
                  <div className="section-header">
                    <h3>Recent Posts</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="posts-list">
                    {recentPosts.map((post, index) => (
                      <div key={index} className="post-item">
                        <div className="post-platform">
                          <span className="platform-icon">
                            {post.platform === 'Twitter' && '🐦'}
                            {post.platform === 'Instagram' && '📷'}
                            {post.platform === 'LinkedIn' && '💼'}
                            {post.platform === 'Facebook' && '👥'}
                          </span>
                          <span className="platform-name">{post.platform}</span>
                        </div>
                        <div className="post-content">
                          <p>{post.content}</p>
                          <div className="post-meta">
                            <span className="post-time">{post.time}</span>
                            <span className="post-engagement">{post.engagement} engagements</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'accounts' && (
            <div className="accounts-section">
              <div className="section-header">
                <h2>Connected Accounts</h2>
                <button className="add-account-btn">
                  <span>➕</span>
                  <span>Add Account</span>
                </button>
              </div>
              
              <div className="accounts-grid">
                {accounts.map((account, index) => (
                  <div key={index} className="account-card">
                    <div className="account-header">
                      <div className="account-platform">
                        <span className="platform-icon">
                          {account.platform === 'Twitter' && '🐦'}
                          {account.platform === 'Instagram' && '📷'}
                          {account.platform === 'LinkedIn' && '💼'}
                          {account.platform === 'Facebook' && '👥'}
                        </span>
                        <div className="platform-info">
                          <h4>{account.platform}</h4>
                          <p>{account.handle}</p>
                        </div>
                      </div>
                      <div className={`account-status ${account.status}`}>
                        {account.status}
                      </div>
                    </div>
                    <div className="account-stats">
                      <div className="stat">
                        <span className="stat-label">Followers</span>
                        <span className="stat-value">{account.followers}</span>
                      </div>
                    </div>
                    <div className="account-actions">
                      <button className="action-btn">Manage</button>
                      <button className="action-btn secondary">Analytics</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              <div className="section-header">
                <h2>Content Library</h2>
                <div className="post-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Drafts</button>
                  <button className="filter-btn">Published</button>
                  <button className="filter-btn">Scheduled</button>
                </div>
              </div>
              
              <div className="posts-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="post-card">
                    <div className="post-preview">
                      <div className="post-image"></div>
                    </div>
                    <div className="post-info">
                      <h4>Sample Post Title {i}</h4>
                      <p>This is a sample post description that shows how content will appear...</p>
                      <div className="post-meta">
                        <span className="post-date">Dec 15, 2024</span>
                        <span className="post-status published">Published</span>
                      </div>
                    </div>
                    <div className="post-actions">
                      <button className="action-btn">Edit</button>
                      <button className="action-btn secondary">Analytics</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="analytics-header">
                <h2>Performance Analytics</h2>
                <div className="date-range">
                  <button className="date-btn active">Last 7 days</button>
                  <button className="date-btn">Last 30 days</button>
                  <button className="date-btn">Last 90 days</button>
                </div>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Top Performing Posts</h3>
                  <div className="top-posts">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="top-post">
                        <div className="post-rank">#{i}</div>
                        <div className="post-details">
                          <h4>Post Title {i}</h4>
                          <p>12.{i}K engagements</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h3>Audience Demographics</h3>
                  <div className="demographics">
                    <div className="demo-item">
                      <span className="demo-label">18-24</span>
                      <div className="demo-bar">
                        <div className="demo-fill" style={{ width: '35%' }}></div>
                      </div>
                      <span className="demo-percent">35%</span>
                    </div>
                    <div className="demo-item">
                      <span className="demo-label">25-34</span>
                      <div className="demo-bar">
                        <div className="demo-fill" style={{ width: '45%' }}></div>
                      </div>
                      <span className="demo-percent">45%</span>
                    </div>
                    <div className="demo-item">
                      <span className="demo-label">35-44</span>
                      <div className="demo-bar">
                        <div className="demo-fill" style={{ width: '20%' }}></div>
                      </div>
                      <span className="demo-percent">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduling' && (
            <div className="scheduling-section">
              <div className="section-header">
                <h2>Post Scheduling</h2>
                <button className="schedule-post-btn">
                  <span>📅</span>
                  <span>Schedule New Post</span>
                </button>
              </div>
              
              <div className="calendar-view">
                <div className="calendar-header">
                  <button className="calendar-nav">←</button>
                  <h3>December 2024</h3>
                  <button className="calendar-nav">→</button>
                </div>
                <div className="calendar-grid">
                  {Array.from({ length: 31 }, (_, i) => (
                    <div key={i} className="calendar-day">
                      <span className="day-number">{i + 1}</span>
                      {i % 5 === 0 && <div className="scheduled-post"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="inbox-section">
              <div className="section-header">
                <h2>Message Inbox</h2>
                <div className="inbox-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Unread</button>
                  <button className="filter-btn">Comments</button>
                  <button className="filter-btn">Mentions</button>
                </div>
              </div>
              
              <div className="messages-list">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="message-item">
                    <div className="message-avatar">
                      <span>U{i}</span>
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <h4>User {i}</h4>
                        <span className="message-time">2h ago</span>
                      </div>
                      <p>This is a sample message from a user. They're asking about our product...</p>
                      <div className="message-actions">
                        <button className="action-btn">Reply</button>
                        <button className="action-btn secondary">Mark as Read</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </main>
    </div>
  );
}
