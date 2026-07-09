"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./dashboard/page";
import ProductsPage from "./products/page";
import SalesPage from "./sales/page";
import ReportsPage from "./reports/page";
import SettingsPage from "./settings/page";
import ProcurementPage from "./procurement/page";
import AccountingDashboard from "./accounting/page";
import { User, RolePermission } from "@/types";

const defaultRoles: RolePermission[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all features",
    permissions: {
      dashboard: true, categories: true, products: true, reports: true, sales: true,
      procurement: true, accounting: true, settings: true, users: true,
      subscriptions: true, costcentres: true
    },
    createdAt: new Date()
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Access to accounting and procurement",
    permissions: {
      dashboard: true, categories: true, products: true, reports: true, sales: true,
      procurement: true, accounting: true, settings: false, users: false,
      subscriptions: false, costcentres: false
    },
    createdAt: new Date()
  },
  {
    id: "cashier",
    name: "Cashier",
    description: "Access to sales and basic reports",
    permissions: {
      dashboard: true, categories: false, products: false, reports: true, sales: true,
      procurement: false, accounting: false, settings: false, users: false,
      subscriptions: false, costcentres: false
    },
    createdAt: new Date()
  }
];

const defaultAdmin: User = {
  id: "1",
  username: "admin",
  password: "admin123",
  roleId: "admin",
  createdAt: new Date()
};

const defaultAccountant: User = {
  id: "2",
  username: "accountant",
  password: "accountant123",
  roleId: "accountant",
  createdAt: new Date()
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<RolePermission | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>([defaultAdmin, defaultAccountant]);
  const [roles, setRoles] = useState<RolePermission[]>(defaultRoles);

  useEffect(() => {
    // Only handle users/roles, leave logo/settings completely alone!
    console.log("Home: initializing...");
    
    let savedUsers: string | null = null;
    let savedRoles: string | null = null;
    try {
      savedUsers = localStorage.getItem("systemUsers");
      savedRoles = localStorage.getItem("systemRoles");
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    
    if (!savedUsers) {
      console.log("Home: setting default users in localStorage");
      localStorage.setItem("systemUsers", JSON.stringify([defaultAdmin, defaultAccountant]));
      setUsers([defaultAdmin, defaultAccountant]);
    } else {
      try {
        const parsed = JSON.parse(savedUsers).map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt)
        }));
        setUsers(parsed);
      } catch (e) {
        console.error("Error parsing users:", e);
        localStorage.setItem("systemUsers", JSON.stringify([defaultAdmin, defaultAccountant]));
        setUsers([defaultAdmin, defaultAccountant]);
      }
    }

    if (!savedRoles) {
      console.log("Home: setting default roles in localStorage");
      localStorage.setItem("systemRoles", JSON.stringify(defaultRoles));
      setRoles(defaultRoles);
    } else {
      try {
        const parsed = JSON.parse(savedRoles).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt)
        }));
        setRoles(parsed);
      } catch (e) {
        console.error("Error parsing roles:", e);
        localStorage.setItem("systemRoles", JSON.stringify(defaultRoles));
        setRoles(defaultRoles);
      }
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    console.log("Home: handleLogin called with", username, password);
    console.log("Home: users are", users);
    console.log("Home: roles are", roles);
    const user = users.find(u => u.username === username && u.password === password);
    console.log("Home: found user", user);
    if (user) {
      const role = roles.find(r => r.id === user.roleId);
      console.log("Home: found role for user", role);
      setCurrentUser(user);
      setCurrentRole(role || null);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem("currentUser");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }

  const canAccess = (page: string): boolean => {
    if (!currentRole) return false;
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
    return !!currentRole.permissions[pageToPermission[page]];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && (
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          userRole={currentRole} 
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          {activePage === "dashboard" && canAccess("dashboard") && <Dashboard userRole={currentUser?.roleId} />}
          {activePage === "products" && canAccess("products") && <ProductsPage userRole={currentUser?.roleId} />}
          {activePage === "sales" && canAccess("sales") && <SalesPage userRole={currentUser?.roleId} />}
          {activePage === "reports" && canAccess("reports") && <ReportsPage userRole={currentUser?.roleId} />}
          {activePage === "settings" && canAccess("settings") && <SettingsPage />}
          {activePage === "procurement" && canAccess("procurement") && <ProcurementPage />}
          {activePage === "accounting" && canAccess("accounting") && <AccountingDashboard />}
          {activePage === "label-printing" && canAccess("label-printing") && <ProductsPage userRole={currentUser?.roleId} />}
        </main>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, users }: { onLogin: (username: string, password: string) => boolean, users: User[] }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLogo, setShowLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("ELECTRICAL HALL NIG LTD");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem("companyLogo");
      const savedSettings = localStorage.getItem("companySettings");
      if (savedLogo) setShowLogo(savedLogo);
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setCompanyName(settings.name.toUpperCase());
        } catch (e) {
          console.error("Error parsing company settings:", e);
        }
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = onLogin(username, password);
    if (!success) {
      setError("Invalid username or password!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            {showLogo ? (
              <img
                src={showLogo}
                alt="Company Logo"
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-lg">
                ⚡
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{companyName}</h1>
          <p className="text-sm text-gray-500 uppercase tracking-wider">Business Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
