import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  Globe,
  Briefcase,
  GraduationCap,
  Plane,
  Settings,
  FileText,
  Wrench,
  Users,
  Shield,
  User,
  Brain,
  MessageSquare,
  BarChart3,
  Zap,
  Building,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{
    [key: string]: boolean;
  }>({
    globalOperations: false,
    amo: false,
    ai: false,
    economicLicense: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Function to determine if user has access to a specific section
  const hasAccess = (directorate: string | null = null, excludeDirectorates: string[] = []) => {
    if (!user) return false;
    
    if (user.role === "Super User" || user.directorate === "ICT") {
      return true;
    }
    
    // Check if user's directorate is excluded
    if (excludeDirectorates.includes(user.directorate)) {
      return false;
    }
    
    if (!directorate) {
      return true; // General sections accessible to all
    }
    
    return user.directorate === directorate;
  };
  
  // Function to determine if user has edit access
  const hasEditAccess = () => {
    return user?.role !== "Read and View";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isOpen) {
    return (
      <div className="h-screen bg-ncaa-primary text-white w-16 flex flex-col py-4 shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/lovable-uploads/660cad38-3239-4b0f-8012-a92a08141716.png"
            alt="NCAA Logo"
            className="h-10 w-10"
          />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-2">
            <li>
              <Link
                to="/"
                className={cn(
                  "flex items-center justify-center p-2 rounded-md hover:bg-white/10",
                  isActive("/") && "bg-white/20"
                )}
              >
                <LayoutDashboard className="h-6 w-6" />
              </Link>
            </li>
            <li>
              <button
                onClick={() => toggleMenu("ai")}
                className={cn(
                  "flex items-center justify-center p-2 rounded-md hover:bg-white/10 w-full",
                  openMenus.ai && "bg-white/20"
                )}
              >
                <Brain className="h-6 w-6" />
              </button>
            </li>
            {user?.role === "Super User" && (
              <li>
                <button
                  onClick={() => toggleMenu("globalOperations")}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md hover:bg-white/10 w-full",
                    openMenus.globalOperations && "bg-white/20"
                  )}
                >
                  <Globe className="h-6 w-6" />
                </button>
              </li>
            )}
            {hasAccess("DAWS") && (
              <li>
                <Link
                  to="/aoc"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10",
                    isActive("/aoc") && "bg-white/20"
                  )}
                >
                  <Shield className="h-6 w-6" />
                </Link>
              </li>
            )}
            {hasAccess("DAAS") && (
              <>
                <li>
                  <Link
                    to="/daas"
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md hover:bg-white/10",
                      isActive("/daas") && "bg-white/20"
                    )}
                  >
                    <Building className="h-6 w-6" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ato"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-white/10",
                      isActive("/ato") && "bg-white/20"
                    )}
                  >
                    <GraduationCap className="h-6 w-6" />
                  </Link>
                </li>
              </>
            )}
            {hasAccess("DOLTS") && (
              <li>
                <Link
                  to="/foreign-airline-dacl"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10",
                    isActive("/foreign-airline-dacl") && "bg-white/10"
                  )}
                >
                  <Globe className="h-6 w-6" />
                </Link>
              </li>
            )}
            {hasAccess("DAWS", ["DOLTS"]) && (
              <>
                <li>
                  <Link
                    to="/ac-status"
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md hover:bg-white/10",
                      isActive("/ac-status") && "bg-white/20"
                    )}
                  >
                    <Plane className="h-6 w-6" />
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => toggleMenu("amo")}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md hover:bg-white/10 w-full",
                      openMenus.amo && "bg-white/20"
                    )}
                  >
                    <Wrench className="h-6 w-6" />
                  </button>
                </li>
              </>
            )}
            <li>
              <Link
                to="/profile"
                className={cn(
                  "flex items-center justify-center p-2 rounded-md hover:bg-white/10",
                  isActive("/profile") && "bg-white/20"
                )}
              >
                <User className="h-6 w-6" />
              </Link>
            </li>
            {user?.role === "Super User" && (
              <>
                <li>
                  <Link
                    to="/users"
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md hover:bg-white/10",
                      isActive("/users") && "bg-white/20"
                    )}
                  >
                    <Users className="h-6 w-6" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/global/directorate"
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md hover:bg-white/10",
                      isActive("/global/directorate") && "bg-white/20"
                    )}
                  >
                    <Building className="h-6 w-6" />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="h-screen bg-ncaa-primary text-white w-64 flex flex-col py-4 shadow-lg">
      <div className="flex items-center justify-center mb-8">
        <img
          src="/lovable-uploads/660cad38-3239-4b0f-8012-a92a08141716.png"
          alt="NCAA Logo"
          className="h-12 w-12 mr-2"
        />
        <span className="font-bold text-xl">NCAA FSG</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className={cn(
                "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                isActive("/") && "bg-white/20"
              )}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span>Overview</span>
            </Link>
          </li>
          
          {/* AI Features */}
          <li>
            <Collapsible
              open={openMenus.ai}
              onOpenChange={() => toggleMenu("ai")}
              className="w-full"
            >
              <CollapsibleTrigger
                className={cn(
                  "flex items-center justify-between px-3 py-2 w-full rounded-md hover:bg-white/10 transition-colors",
                  openMenus.ai && "bg-white/20"
                )}
              >
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-3" />
                  <span>AI Features</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openMenus.ai && "transform rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-10 space-y-1 mt-1">
                <Link
                  to="/ai"
                  className={cn(
                    "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                    isActive("/ai") && "bg-white/10"
                  )}
                >
                  AI Dashboard
                </Link>
                <Link
                  to="/ai/chat"
                  className={cn(
                    "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                    isActive("/ai/chat") && "bg-white/10"
                  )}
                >
                  AI Chat Assistant
                </Link>
                <Link
                  to="/ai/document-analysis"
                  className={cn(
                    "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                    isActive("/ai/document-analysis") && "bg-white/10"
                  )}
                >
                  Document Analysis
                </Link>
                <Link
                  to="/ai/analytics"
                  className={cn(
                    "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                    isActive("/ai/analytics") && "bg-white/10"
                  )}
                >
                  Predictive Analytics
                </Link>
                <Link
                  to="/ai/reports"
                  className={cn(
                    "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                    isActive("/ai/reports") && "bg-white/10"
                  )}
                >
                  Smart Reports
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </li>
          
          {user?.role === "Super User" && (
            <li>
              <Collapsible
                open={openMenus.globalOperations}
                onOpenChange={() => toggleMenu("globalOperations")}
                className="w-full"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex items-center justify-between px-3 py-2 w-full rounded-md hover:bg-white/10 transition-colors",
                    openMenus.globalOperations && "bg-white/20"
                  )}
                >
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3" />
                    <span>Global Operations</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openMenus.globalOperations && "transform rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-10 space-y-1 mt-1">
                  <Link
                    to="/global/aircraft-manufacturer"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/aircraft-manufacturer") && "bg-white/10"
                    )}
                  >
                    Aircraft Manufacturer
                  </Link>
                  <Link
                    to="/global/aircraft-type"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/aircraft-type") && "bg-white/10"
                    )}
                  >
                    Aircraft Type
                  </Link>
                  <Link
                    to="/global/foreign-registration"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/foreign-registration") && "bg-white/10"
                    )}
                  >
                    Foreign Registration Mark
                  </Link>
                  <Link
                    to="/global/foreign-amo"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/foreign-amo") && "bg-white/10"
                    )}
                  >
                    Foreign AMO
                  </Link>
                  <Link
                    to="/global/general-aviation"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/general-aviation") && "bg-white/10"
                    )}
                  >
                    General Aviation
                  </Link>
                  <Link
                    to="/global/operation-type"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/operation-type") && "bg-white/10"
                    )}
                  >
                    Operation Type
                  </Link>
                  <Link
                    to="/global/state-registry"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/state-registry") && "bg-white/10"
                    )}
                  >
                    State of Registry
                  </Link>
                  <Link
                    to="/global/training-organization"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/training-organization") && "bg-white/10"
                    )}
                  >
                    Training Organization
                  </Link>
                  <Link
                    to="/global/travel-agency"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/travel-agency") && "bg-white/10"
                    )}
                  >
                    Travel Agency
                  </Link>
                  <Link
                    to="/global/foreign-airline"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/foreign-airline") && "bg-white/10"
                    )}
                  >
                    Foreign Airline
                  </Link>
                  <Link
                    to="/global/certificate-type"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/certificate-type") && "bg-white/10"
                    )}
                  >
                    Certificate Type
                  </Link>
                  <Link
                    to="/global/user-roles"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/user-roles") && "bg-white/10"
                    )}
                  >
                    User Roles
                  </Link>
                  <Link
                    to="/global/directorate"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/global/directorate") && "bg-white/10"
                    )}
                  >
                    Directorates
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </li>
          )}

          {hasAccess("DAWS") && (
            <li>
              <Link
                to="/aoc"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                  isActive("/aoc") && "bg-white/20"
                )}
              >
                <Shield className="h-5 w-5 mr-3" />
                <span>AOC</span>
              </Link>
            </li>
          )}

          {hasAccess("DAAS") && (
            <>
              <li>
                <Link
                  to="/daas"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                    isActive("/daas") && "bg-white/20"
                  )}
                >
                  <Building className="h-5 w-5 mr-3" />
                  <span>DAAS Module</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/ato"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                    isActive("/ato") && "bg-white/20"
                  )}
                >
                  <GraduationCap className="h-5 w-5 mr-3" />
                  <span>ATO</span>
                </Link>
              </li>
            </>
          )}

          {hasAccess("DOLTS") && (
            <li>
              <Link
                to="/foreign-airline-dacl"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                  isActive("/foreign-airline-dacl") && "bg-white/10"
                )}
              >
                <Briefcase className="h-5 w-5 mr-3" />
                <span>Foreign Airline DACL</span>
              </Link>
            </li>
          )}

          {/* Economic License - DATR with Technical privilege or Super User */}
          {(user?.role === "Super User" || (user?.directorate === "DATR" && user?.role === "Technical")) && (
            <li>
              <Collapsible
                open={openMenus.economicLicense}
                onOpenChange={() => toggleMenu("economicLicense")}
                className="w-full"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex items-center justify-between px-3 py-2 w-full rounded-md hover:bg-white/10 transition-colors",
                    openMenus.economicLicense && "bg-white/20"
                  )}
                >
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-3" />
                    <span>Economic License</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openMenus.economicLicense && "transform rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-10 space-y-1 mt-1">
                  <Link
                    to="/economic-license/paas"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/economic-license/paas") && "bg-white/10"
                    )}
                  >
                    PAAS
                  </Link>
                  <Link
                    to="/economic-license/aop"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/economic-license/aop") && "bg-white/10"
                    )}
                  >
                    AOP
                  </Link>
                  <Link
                    to="/economic-license/atl"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/economic-license/atl") && "bg-white/10"
                    )}
                  >
                    ATL
                  </Link>
                  <Link
                    to="/economic-license/pncf"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/economic-license/pncf") && "bg-white/10"
                    )}
                  >
                    PNCF
                  </Link>
                  <Link
                    to="/economic-license/atol"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/economic-license/atol") && "bg-white/10"
                    )}
                  >
                    ATOL
                  </Link>
                  <Link
                    to="/economic-license/fcop"
                    className={cn(
                      "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                      isActive("/economic-license/fcop") && "bg-white/10"
                    )}
                  >
                    FCOP
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </li>
          )}

          {hasAccess("DAWS", ["DOLTS"]) && (
            <>
              <li>
                <Link
                  to="/ac-status"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                    isActive("/ac-status") && "bg-white/20"
                  )}
                >
                  <Plane className="h-5 w-5 mr-3" />
                  <span>A/C Status</span>
                </Link>
              </li>

              <li>
                <Collapsible
                  open={openMenus.amo}
                  onOpenChange={() => toggleMenu("amo")}
                  className="w-full"
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex items-center justify-between px-3 py-2 w-full rounded-md hover:bg-white/10 transition-colors",
                      openMenus.amo && "bg-white/20"
                    )}
                  >
                    <div className="flex items-center">
                      <Wrench className="h-5 w-5 mr-3" />
                      <span>AMO</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openMenus.amo && "transform rotate-180"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-10 space-y-1 mt-1">
                    <Link
                      to="/amo/foreign"
                      className={cn(
                        "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                        isActive("/amo/foreign") && "bg-white/10"
                      )}
                    >
                      Foreign AMO
                    </Link>
                    <Link
                      to="/amo/local"
                      className={cn(
                        "block py-1.5 px-2 rounded hover:bg-white/10 text-sm transition-colors",
                        isActive("/amo/local") && "bg-white/10"
                      )}
                    >
                      Local AMO
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
              </li>

              <li>
                <Link
                  to="/focc-mcc"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                    isActive("/focc-mcc") && "bg-white/20"
                  )}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <span>FOCC/MCC</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/acceptance-certificate"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                    isActive("/acceptance-certificate") && "bg-white/20"
                  )}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <span>Type Acceptance Certificate</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/profile"
              className={cn(
                "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                isActive("/profile") && "bg-white/20"
              )}
            >
              <User className="h-5 w-5 mr-3" />
              <span>Profile</span>
            </Link>
          </li>
          
          {user?.role === "Super User" && (
            <>
              <li>
                <Link
                  to="/users"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                    isActive("/users") && "bg-white/20"
                  )}
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>Users</span>
                </Link>
              </li>
            </>
          )}
          
          <li>
            <Link
              to="/settings"
              className={cn(
                "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                isActive("/settings") && "bg-white/20"
              )}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="px-4 py-2 text-xs text-gray-300 border-t border-white/10 mt-4">
        <div className="flex items-center">
          <span className="flex-1">
            Ver 1.0.0 &copy; {new Date().getFullYear()} NCAA
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
