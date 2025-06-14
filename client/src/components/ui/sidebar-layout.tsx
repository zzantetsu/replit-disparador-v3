import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Server, 
  User, 
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLocation } from 'wouter';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setLocation('/login');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: location === '/dashboard'
    },
    {
      name: 'Gerenciar Instâncias',
      icon: Server,
      path: '/instances',
      active: location === '/instances'
    }
  ];

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 p-4 flex flex-col relative z-10 flex-shrink-0">
        <div className="glass-card rounded-3xl h-full flex flex-col shadow-2xl">
          {/* Logo/Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center neon-glow">
                <div className="w-5 h-5 bg-white rounded-lg"></div>
              </div>
              <h1 className="text-white font-primary font-bold text-xl">AuthFlow</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => setLocation(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                      item.active 
                        ? 'bg-gradient-to-r from-primary/30 to-purple-500/20 border border-primary/40 text-white shadow-lg shadow-primary/10' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${
                      item.active ? 'text-primary' : 'group-hover:text-primary'
                    }`} />
                    <span className="font-secondary font-medium text-sm truncate">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-t border-white/5 mt-auto">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-white/5 text-white group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium font-secondary text-white truncate">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name || 'User'}
                  </div>
                  <div className="text-xs text-gray-400 font-secondary truncate">{user?.email}</div>
                </div>
                {isProfileOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 glass-card rounded-xl p-3 shadow-2xl border border-white/10 z-50">
                  <div className="space-y-2">
                    <div className="px-2 py-2 border-b border-white/10">
                      <div className="text-xs text-gray-400 font-secondary uppercase tracking-wide">Account</div>
                      <div className="text-sm text-white font-secondary font-medium truncate mt-1">{user?.email}</div>
                      <div className="text-xs text-gray-500 font-secondary mt-1">Active Session</div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg transition-all duration-300 hover:bg-red-500/10 text-red-400 hover:text-red-300 group"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-secondary font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-full">
        <div className="min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}