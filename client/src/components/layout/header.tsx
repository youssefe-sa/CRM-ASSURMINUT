import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface HeaderProps {
  title: string;
  onNewClient?: () => void;
}

export function Header({ title, onNewClient }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <span className="text-slate-500">|</span>
          <span className="text-slate-600 capitalize">{currentDate}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border-slate-200 pl-4 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            {onNewClient && (
              <Button onClick={onNewClient} className="bg-primary hover:bg-primary/80">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau client
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
