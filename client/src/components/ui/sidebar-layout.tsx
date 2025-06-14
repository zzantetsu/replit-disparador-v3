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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="w-72 p-4 flex flex-col">
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl h-full flex flex-col shadow-2xl">
          {/* Logo/Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-white font-primary font-bold text-lg">AuthFlow</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => setLocation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      item.active 
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.active ? 'text-primary' : 'group-hover:text-primary'}`} />
                    <span className="font-secondary font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-t border-white/10">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/5 text-white"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium font-secondary truncate">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </div>
                </div>
                {isProfileOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-3 shadow-2xl">
                  <div className="space-y-2">
                    <div className="px-3 py-2 border-b border-white/10">
                      <div className="text-xs text-gray-400 font-secondary">Email</div>
                      <div className="text-sm text-white font-secondary truncate">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-secondary">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}