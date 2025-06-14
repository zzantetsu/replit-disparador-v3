import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen text-white grid-background overflow-x-hidden font-secondary">
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Enhanced gradient orbs */}
          <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl animate-slow-pulse"></div>
          <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-accent opacity-15 rounded-full blur-3xl animate-slow-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-2/3 left-1/2 w-72 h-72 opacity-10 rounded-full blur-3xl animate-slow-pulse" style={{animationDelay: '6s', background: 'linear-gradient(45deg, hsl(280, 100%, 60%), hsl(25, 95%, 53%))'}}></div>
          
          {/* Floating elements inspired by N8N */}
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-accent rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary rounded-full opacity-40 animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-50 animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
