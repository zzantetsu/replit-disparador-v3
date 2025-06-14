import React from 'react';
import { Shield, Zap, Users, Activity, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const { user, session } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getFullName = (firstName?: string, lastName?: string) => {
    return `${firstName || ''} ${lastName || ''}`.trim() || 'User';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen p-6 relative">
        {/* Header */}
        <header className="relative z-10 mb-8">
          <div>
            <h1 className="text-4xl font-primary font-bold bg-gradient-to-r from-white via-purple-200 to-accent bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg font-secondary mt-2">
              Your authentication platform is ready for N8N integration
            </p>
          </div>
        </header>

        {/* Main Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 h-full">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center neon-glow">
                  <span className="text-white font-bold text-xl font-primary">
                    {getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
                  </span>
                </div>
                <h3 className="text-xl font-primary font-semibold mb-2">
                  {getFullName(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
                </h3>
                <p className="text-muted-foreground font-secondary">{user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="flex items-center">
                      <div className="dot dot-red"></div>
                      <div className="dot dot-yellow"></div>
                      <div className="dot dot-green"></div>
                      <span className="text-xs text-gray-400 ml-2 font-secondary">Session Details</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-sm font-mono">
                    <div className="text-accent">user@authflow:~$</div>
                    <div className="text-gray-300">Session expires: {formatDate(session?.expires_at?.toString())}</div>
                    <div className="text-gray-300">Token: <span className="text-primary">{session?.access_token?.slice(0, 16)}...</span></div>
                    <div className="text-green-400">✓ Authentication active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Cards */}
              <div className="feature-card p-6 rounded-3xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-primary font-semibold text-lg">Secure Authentication</h4>
                    <p className="text-muted-foreground text-sm font-secondary">JWT-based session management</p>
                  </div>
                </div>
                <div className="text-sm text-gray-300 font-secondary">
                  Enterprise-grade security with token-based authentication ready for API integration.
                </div>
              </div>

              <div className="feature-card p-6 rounded-3xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center mr-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-primary font-semibold text-lg">N8N Integration</h4>
                    <p className="text-muted-foreground text-sm font-secondary">Ready for workflow automation</p>
                  </div>
                </div>
                <div className="text-sm text-gray-300 font-secondary">
                  Seamless integration with N8N endpoints for automated workflow processing.
                </div>
              </div>

              <div className="feature-card p-6 rounded-3xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-primary font-semibold text-lg">User Management</h4>
                    <p className="text-muted-foreground text-sm font-secondary">Complete authentication system</p>
                  </div>
                </div>
                <div className="text-sm text-gray-300 font-secondary">
                  Full user lifecycle management with registration, login, and password recovery.
                </div>
              </div>

              <div className="feature-card p-6 rounded-3xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-primary font-semibold text-lg">Real-time Status</h4>
                    <p className="text-muted-foreground text-sm font-secondary">Live session monitoring</p>
                  </div>
                </div>
                <div className="text-sm text-gray-300 font-secondary">
                  Monitor authentication status and session health in real-time.
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="mt-6">
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-primary font-semibold mb-4 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                  Continue to Platform
                </h3>
                <p className="text-muted-foreground font-secondary mb-6">
                  Your authentication is complete. Ready to integrate with your WhatsApp messaging platform.
                </p>
                <div className="gradient-border rounded-2xl">
                  <Button className="w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] gradient-border-content font-secondary text-white border-0"
                    style={{background: 'var(--gradient-primary)'}}>
                    <Terminal className="w-5 h-5 mr-2" />
                    Launch Platform
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}