import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard,
  FileText,
  Plane,
  Settings,
  Users,
  Building2,
  Shield,
  MapPin,
  Globe,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Brain,
  Search,
  BarChart3,
  FileSearch,
  AlertTriangle,
  Bot
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { canAccessGlobalOperations } = usePermissions();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview and analytics"
    },
    {
      title: "AI Features",
      icon: Brain,
      description: "AI-powered tools",
      subItems: [
        {
          title: "Document Analysis",
          href: "/ai/document-analysis",
          icon: FileSearch,
          description: "OCR and data extraction"
        },
        {
          title: "Compliance Monitor",
          href: "/ai/compliance-monitoring",
          icon: AlertTriangle,
          description: "Automated compliance checks"
        },
        {
          title: "Predictive Analytics",
          href: "/ai/predictive-analytics",
          icon: BarChart3,
          description: "Forecasting and trends"
        },
        {
          title: "Intelligent Search",
          href: "/ai/intelligent-search",
          icon: Search,
          description: "Smart search and recommendations"
        },
        {
          title: "Report Generation",
          href: "/ai/report-generation",
          icon: FileText,
          description: "AI-generated reports"
        },
        {
          title: "Aviation Assistant",
          href: "/ai/chatbot-assistant",
          icon: Bot,
          description: "AI chatbot helper"
        }
      ]
    },
    {
      title: "Certificates",
      href: "/certificates",
      icon: FileText,
      description: "Manage aviation certificates"
    },
    {
      title: "Aircraft",
      href: "/aircraft",
      icon: Plane,
      description: "Track aircraft information"
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      description: "Manage user accounts",
      requiredRole: "Super User"
    },
    {
      title: "Organizations",
      href: "/organizations",
      icon: Building2,
      description: "Manage organizations"
    },
    {
      title: "Compliance",
      href: "/compliance",
      icon: Shield,
      description: "Ensure regulatory compliance"
    },
    {
      title: "Aerodromes",
      href: "/aerodromes",
      icon: MapPin,
      description: "Manage aerodrome information"
    },
    {
      title: "Global Operations",
      href: "/global-operations",
      icon: Globe,
      description: "Oversee global operations",
      requiredPermission: canAccessGlobalOperations
    },
    {
      title: "Audit Trail",
      href: "/audit-trail",
      icon: MessageSquare,
      description: "Track system changes",
      requiredPermission: canAccessGlobalOperations
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Configure system settings"
    }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item, isSubItem = false }: { item: any; isSubItem?: boolean }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    const content = (
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
          isSubItem ? "ml-4 text-sm" : "",
          active
            ? "bg-ncaa-primary/10 text-ncaa-primary border-r-2 border-ncaa-primary"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <Icon className={cn("flex-shrink-0", isSubItem ? "w-4 h-4" : "w-5 h-5")} />
        {isOpen && (
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.title}</div>
            {!isSubItem && item.description && (
              <div className="text-xs text-gray-500 truncate">{item.description}</div>
            )}
          </div>
        )}
      </div>
    );

    return item.href ? <Link to={item.href}>{content}</Link> : content;
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/660cad38-3239-4b0f-8012-a92a08141716.png"
                alt="NCAA Logo"
                className="w-8 h-8"
              />
              <div>
                <h1 className="font-bold text-sm text-ncaa-primary">NCAA</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>
          ) : (
            <img
              src="/lovable-uploads/660cad38-3239-4b0f-8012-a92a08141716.png"
              alt="NCAA Logo"
              className="w-8 h-8 mx-auto"
            />
          )}
          
          <button
            onClick={toggle}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <PanelLeftClose className="w-4 h-4 text-gray-600" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item, index) => (
          <div key={index}>
            <NavItem item={item} />
            
            {/* AI Features Submenu */}
            {item.subItems && isOpen && (
              <div className="mt-2 space-y-1">
                {item.subItems.map((subItem: any, subIndex: number) => (
                  <NavItem key={subIndex} item={subItem} isSubItem />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      {isOpen && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.role}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
