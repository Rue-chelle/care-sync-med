
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Plus, 
  BarChart3,
  Settings,
  Users,
  Pill,
  Building,
  Shield
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
  userName?: string;
}

export const DashboardSidebar = ({ 
  items, 
  activeTab, 
  onTabChange, 
  userRole, 
  userName 
}: DashboardSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:relative lg:top-0 lg:left-0"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative z-40 h-screen bg-white/90 backdrop-blur-sm border-r border-blue-100 transition-transform duration-300 ease-in-out",
        "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !isOpen && "lg:w-16"
      )}>
        <div className="p-4 h-full flex flex-col">
          {/* User Info */}
          <div className={cn(
            "mb-6 pb-4 border-b border-blue-100",
            !isOpen && "lg:hidden"
          )}>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userName?.substring(0, 1) || userRole.substring(0, 1).toUpperCase()}
              </div>
              <div className={cn("transition-opacity", !isOpen && "lg:opacity-0")}>
                <p className="font-medium text-sm">{userName || "User"}</p>
                <p className="text-xs text-gray-600 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2 flex-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start relative",
                    activeTab === item.id 
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white" 
                      : "hover:bg-blue-50",
                    !isOpen && "lg:justify-center lg:px-2"
                  )}
                  onClick={() => {
                    onTabChange(item.id);
                    if (isMobile) closeSidebar();
                  }}
                >
                  <Icon className={cn("h-4 w-4", isOpen || !isMobile ? "mr-3" : "")} />
                  <span className={cn(
                    "transition-opacity",
                    !isOpen && "lg:opacity-0 lg:absolute lg:left-full lg:ml-2 lg:bg-gray-900 lg:text-white lg:px-2 lg:py-1 lg:rounded lg:text-xs lg:whitespace-nowrap lg:z-50"
                  )}>
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      className={cn(
                        "ml-auto bg-red-500 text-white",
                        !isOpen && "lg:absolute lg:-top-1 lg:-right-1"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* AloraMed Branding */}
          <div className={cn(
            "mt-auto pt-4 border-t border-blue-100 text-center",
            !isOpen && "lg:hidden"
          )}>
            <div className="text-xs text-gray-500">Powered by</div>
            <div className="font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              AloraMed
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
