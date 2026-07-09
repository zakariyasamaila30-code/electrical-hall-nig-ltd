import { useState, useEffect } from "react";
import { RolePermission } from "@/types";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  userRole?: RolePermission | null;
}

export default function Sidebar({ activePage, setActivePage, userRole }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean}>({
    products: true,
    reports: true,
    sales: true
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("ELECTRICAL HALL (NIG) LTD");

  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem("companyLogo");
      const savedSettings = localStorage.getItem("companySettings");
      if (savedLogo) {
        setCompanyLogo(savedLogo);
      }
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setCompanyName(settings.name.toUpperCase());
        } catch (e) {
          console.error("Error parsing company settings in sidebar:", e);
        }
      }
    } catch (e) {
      console.error("Error reading from localStorage in sidebar:", e);
    }
  }, []);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const canAccess = (page: string): boolean => {
    console.log("Sidebar: canAccess called for", page, "userRole is", userRole);
    if (!userRole) return false;
    const pageToPermission: Record<string, keyof RolePermission["permissions"]> = {
      "dashboard": "dashboard",
      "categories": "categories",
      "products": "products",
      "reports": "reports",
      "sales": "sales",
      "procurement": "procurement",
      "accounting": "accounting",
      "settings": "settings",
      "users": "users",
      "subscriptions": "subscriptions",
      "costcentres": "costcentres",
      "label-printing": "products"
    };
    const hasPermission = !!userRole.permissions[pageToPermission[page]];
    console.log("Sidebar: hasPermission for", page, "is", hasPermission);
    return hasPermission;
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", permission: "dashboard" as const },
    { 
      id: "categories", 
      label: "Categories", 
      icon: "🔗",
      permission: "categories" as const
    },
    { 
      id: "products", 
      label: "Products", 
      icon: "📦",
      permission: "products" as const,
      subItems: [
        { id: "label-printing", label: "Label Printing" },
        { id: "products", label: "Manage Products" }
      ]
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: "📊",
      permission: "reports" as const,
      subItems: [
        { id: "credits", label: "Credits" },
        { id: "expenses", label: "Expenses" },
        { id: "profits", label: "Profits" },
        { id: "reports", label: "Sales Reports" },
        { id: "stock-position", label: "Stock Position" }
      ]
    },
    { 
      id: "sales", 
      label: "Sales", 
      icon: "📹",
      permission: "sales" as const,
      subItems: [
        { id: "sales", label: "Create Invoice" }
      ]
    },
    { 
      id: "procurement", 
      label: "Procurement", 
      icon: "🏭",
      permission: "procurement" as const
    },
    { 
      id: "accounting", 
      label: "Accounting", 
      icon: "💰",
      permission: "accounting" as const
    },
    { 
      id: "users", 
      label: "Users", 
      icon: "👤",
      permission: "users" as const
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: "🔧",
      permission: "settings" as const
    },
    { 
      id: "subscriptions", 
      label: "Subscriptions", 
      icon: "📋",
      permission: "subscriptions" as const
    },
    { 
      id: "costcentres", 
      label: "Cost Centres", 
      icon: "🔒",
      permission: "costcentres" as const
    }
  ].filter(item => {
    if (!userRole) return false;
    const pageToPermission: Record<string, keyof RolePermission["permissions"]> = {
      "dashboard": "dashboard",
      "categories": "categories",
      "products": "products",
      "reports": "reports",
      "sales": "sales",
      "procurement": "procurement",
      "accounting": "accounting",
      "settings": "settings",
      "users": "users",
      "subscriptions": "subscriptions",
      "costcentres": "costcentres",
      "label-printing": "products"
    };
    return !!userRole.permissions[pageToPermission[item.id]];
  });

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-col items-center gap-2">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-36 h-36 object-contain rounded-lg"
            />
          ) : (
            <div className="w-36 h-36 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center text-5xl font-bold shadow-lg">
              ⚡
            </div>
          )}
          <div className="text-center">
            <div className="font-bold text-yellow-400 text-xl">{companyName}</div>
            <div className="text-xs text-slate-400">INVENTORY MADE EASY</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs text-slate-400 uppercase mb-4">Navigation</div>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleMenu(item.id);
                  } else {
                    setActivePage(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all ${
                  activePage === item.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.subItems && (
                  <span className={`transition-transform ${expandedMenus[item.id] ? "rotate-90" : ""}`}>
                    ▶
                  </span>
                )}
              </button>
              
              {item.subItems && expandedMenus[item.id] && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActivePage(subItem.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                        activePage === subItem.id
                          ? "bg-slate-700 text-white border-l-4 border-blue-500"
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
