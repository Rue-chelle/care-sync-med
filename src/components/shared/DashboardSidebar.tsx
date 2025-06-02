
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
  userName?: string;
  theme?: 'light' | 'dark';
}

export const DashboardSidebar = ({ 
  items, 
  activeTab, 
  onTabChange,
  userRole,
  userName,
  theme = 'light'
}: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Always start collapsed on mobile, or remember user preference on desktop
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      // Try to load from localStorage on desktop
      const savedState = localStorage.getItem(`${userRole}-sidebar-collapsed`);
      if (savedState !== null) {
        setCollapsed(savedState === 'true');
      } else {
        // Default to collapsed for cleaner UI
        setCollapsed(true);
      }
    }
  }, [isMobile, userRole]);

  // Save preference when changed
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(`${userRole}-sidebar-collapsed`, String(collapsed));
    }
  }, [collapsed, isMobile, userRole]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';
  };

  const baseClasses = `${
    theme === 'dark' 
      ? 'bg-[#121212]/80 backdrop-blur-md' 
      : 'bg-white/80 backdrop-blur-md'
  } h-screen fixed left-0 top-0 pt-20 border-r ${
    theme === 'dark' ? 'border-purple-500/20' : 'border-slate-200'
  } flex flex-col transition-all duration-300 z-30`;

  const textClasses = theme === 'dark' ? 'text-purple-300' : 'text-slate-600';
  const bgHoverClasses = theme === 'dark' ? 'hover:bg-purple-500/10' : 'hover:bg-slate-100';
  const activeBgClasses = theme === 'dark' ? 'bg-purple-500/20' : 'bg-blue-50';
  const activeTextClasses = theme === 'dark' ? 'text-white' : 'text-blue-600';

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Toggle button for mobile */}
      <Button
        variant="outline"
        size="icon"
        className={`fixed ${theme === 'dark' ? 'text-white bg-[#1a1a2e] border-purple-500/20' : ''} left-4 top-4 z-50 md:hidden`}
        onClick={toggleCollapsed}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={`${baseClasses} ${
          collapsed 
            ? 'w-16 translate-x-0' 
            : isMobile 
              ? 'w-64 translate-x-0' 
              : 'w-64 translate-x-0'
        } ${isMobile && collapsed ? '-translate-x-full' : ''}`}
      >
        <div className="flex items-center justify-between px-3 mb-6">
          {!collapsed && (
            <div className={`truncate font-medium ${theme === 'dark' ? 'text-purple-100' : 'text-slate-800'}`}>
              {userRole === 'patient' ? 'Patient Portal' : (
                userRole === 'doctor' ? 'Doctor Portal' : (
                  userRole === 'admin' ? 'Admin Portal' : 'Super Admin'
                )
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`${theme === 'dark' ? 'text-purple-300 hover:bg-purple-500/10' : ''} ml-auto`}
            onClick={toggleCollapsed}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {!collapsed && userName && (
          <div className={`mb-6 px-3 py-2 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-slate-50'} mx-3 rounded-lg`}>
            <div className="flex items-center space-x-2">
              <Avatar className={`h-8 w-8 ${theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'} leading-none`}>
                  {userName}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-purple-300' : 'text-slate-500'} leading-none`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full ${
                    isActive 
                      ? `${activeBgClasses} ${activeTextClasses}`
                      : `${textClasses} ${bgHoverClasses}`
                  } justify-start ${collapsed ? 'pl-4' : ''}`}
                  onClick={() => {
                    onTabChange(item.id);
                    if (isMobile) setCollapsed(true);
                  }}
                >
                  <Icon className={`h-5 w-5 ${isActive ? '' : ''} ${collapsed ? 'mx-auto' : 'mr-2'}`} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <Badge className="ml-auto" variant={theme === 'dark' ? 'outline' : 'default'}>
                      {item.badge}
                    </Badge>
                  )}
                  {collapsed && item.badge && item.badge > 0 && (
                    <Badge 
                      className="absolute top-0 right-0 translate-x-1 -translate-y-1 h-5 w-5 p-0 flex items-center justify-center"
                      variant={theme === 'dark' ? 'outline' : 'default'}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {!collapsed && (
          <div className={`mt-auto p-4 ${theme === 'dark' ? 'text-purple-400' : 'text-slate-500'} text-xs`}>
            <p>© 2025 AloraMed</p>
          </div>
        )}
      </aside>
    </>
  );
};
