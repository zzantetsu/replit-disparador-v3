import React from 'react';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { Button } from '@/components/ui/button';
import { Plus, Server, Play, Pause, Settings } from 'lucide-react';

export default function Instances() {
  return (
    <SidebarLayout>
      <div className="min-h-screen p-6 relative">
        {/* Header */}
        <header className="relative z-10 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-primary font-bold bg-gradient-to-r from-white via-purple-200 to-accent bg-clip-text text-transparent">
                Gerenciar Instâncias
              </h1>
              <p className="text-muted-foreground text-lg font-secondary mt-2">
                Configure e monitore suas instâncias do sistema
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Instância
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10">
          {/* Empty State */}
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center neon-glow">
              <Server className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-primary font-semibold mb-4 text-white">
              Nenhuma instância encontrada
            </h3>
            <p className="text-muted-foreground font-secondary mb-8 max-w-md mx-auto">
              Comece criando sua primeira instância para gerenciar seus serviços e automações.
            </p>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-secondary">
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeira Instância
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}