import { Link, useLocation } from "wouter";
import { 
  Users, 
  FileText, 
  Folder, 
  Calendar, 
  Phone, 
  BarChart3,
  Shield,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { path: "/dashboard", icon: BarChart3, label: "Tableau de bord" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/devis", icon: FileText, label: "Devis" },
  { path: "/documents", icon: Folder, label: "Documents" },
  { path: "/agenda", icon: Calendar, label: "Agenda" },
  { path: "/appels", icon: Phone, label: "Journal des appels" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg w-64 min-h-screen border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-lg p-2">
            <Shield className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">CRM Assurance</h1>
            <p className="text-sm text-slate-500">Mutuelle Santé</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`flex items-center space-x-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                    isActive 
                      ? "text-primary bg-blue-50" 
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-200 rounded-full p-2">
            <Users className="text-slate-600 h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role === "admin" ? "Administrateur" : "Courtier"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
