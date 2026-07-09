"use client";

import { useState, useEffect } from "react";
import { CompanySettings, User, RolePermission } from "@/types";

const defaultSettings: CompanySettings = {
  name: "Electrical Hall (Nig) Ltd",
  address: "50, Idoluwo Street Idumota Lagos Island, Lagos.",
  phone: "09080930885, 08021030267",
  email: "electricalhall@yahoo.com",
  rcNumber: "1187947",
  motto: "In God Alone We put our Trust"
};

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

const defaultUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    roleId: "admin",
    createdAt: new Date()
  },
  {
    id: "2",
    username: "accountant",
    password: "accountant123",
    roleId: "accountant",
    createdAt: new Date()
  }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [roles, setRoles] = useState<RolePermission[]>(defaultRoles);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'company' | 'users' | 'roles'>('company');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id" | "createdAt">>({
    username: "",
    password: "",
    roleId: "cashier"
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Omit<RolePermission, "id" | "createdAt">>({
    name: "",
    description: "",
    permissions: {
      dashboard: false, categories: false, products: false, reports: false, sales: false,
      procurement: false, accounting: false, settings: false, users: false,
      subscriptions: false, costcentres: false
    }
  });
  const [editingRole, setEditingRole] = useState<RolePermission | null>(null);

  useEffect(() => {
    let savedSettings: string | null = null;
    let savedLogo: string | null = null;
    let savedUsers: string | null = null;
    let savedRoles: string | null = null;

    try {
      savedSettings = localStorage.getItem("companySettings");
      savedLogo = localStorage.getItem("companyLogo");
      savedUsers = localStorage.getItem("systemUsers");
      savedRoles = localStorage.getItem("systemRoles");
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing company settings:", e);
      }
    }
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers).map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt)
        })));
      } catch (e) {
        console.error("Error parsing users:", e);
        setUsers(defaultUsers);
      }
    }
    if (savedRoles) {
      try {
        setRoles(JSON.parse(savedRoles).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt)
        })));
      } catch (e) {
        console.error("Error parsing roles:", e);
        setRoles(defaultRoles);
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        localStorage.setItem("companyLogo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    localStorage.setItem("companySettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const addUser = () => {
    if (!newUser.username || !newUser.password || !newUser.roleId) {
      alert("Please fill in all fields");
      return;
    }

    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers));
    
    setNewUser({ username: "", password: "", roleId: "cashier" });
    setShowAddUser(false);
    alert("User added successfully!");
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) {
      alert("Cannot delete the last user!");
      return;
    }
    
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem("systemUsers", JSON.stringify(updatedUsers));
    }
  };

  const startEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({ username: user.username, password: user.password, roleId: user.roleId });
    setShowAddUser(true);
  };

  const saveEditUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(u => 
      u.id === editingUser.id ? { ...u, ...newUser } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers));
    
    setEditingUser(null);
    setNewUser({ username: "", password: "", roleId: "cashier" });
    setShowAddUser(false);
    alert("User updated successfully!");
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setNewUser({ username: "", password: "", roleId: "cashier" });
    setShowAddUser(false);
  };

  const addRole = () => {
    if (!newRole.name) {
      alert("Role name is required");
      return;
    }
    const role: RolePermission = {
      ...newRole,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedRoles = [...roles, role];
    setRoles(updatedRoles);
    localStorage.setItem("systemRoles", JSON.stringify(updatedRoles));
    setNewRole({
      name: "", description: "",
      permissions: {
        dashboard: false, categories: false, products: false, reports: false, sales: false,
        procurement: false, accounting: false, settings: false, users: false,
        subscriptions: false, costcentres: false
      }
    });
    setShowAddRole(false);
    alert("Role added successfully!");
  };

  const deleteRole = (roleId: string) => {
    if (roleId === "admin") {
      alert("Cannot delete default Admin role!");
      return;
    }
    const hasUsers = users.some(u => u.roleId === roleId);
    if (hasUsers) {
      alert("Cannot delete role: there are users assigned to this role!");
      return;
    }
    if (confirm("Are you sure you want to delete this role?")) {
      const updatedRoles = roles.filter(r => r.id !== roleId);
      setRoles(updatedRoles);
      localStorage.setItem("systemRoles", JSON.stringify(updatedRoles));
    }
  };

  const startEditRole = (role: RolePermission) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description || "",
      permissions: { ...role.permissions }
    });
    setShowAddRole(true);
  };

  const saveEditRole = () => {
    if (!editingRole) return;
    const updatedRoles = roles.map(r =>
      r.id === editingRole.id ? { ...r, ...newRole } : r
    );
    setRoles(updatedRoles);
    localStorage.setItem("systemRoles", JSON.stringify(updatedRoles));
    setEditingRole(null);
    setNewRole({
      name: "", description: "",
      permissions: {
        dashboard: false, categories: false, products: false, reports: false, sales: false,
        procurement: false, accounting: false, settings: false, users: false,
        subscriptions: false, costcentres: false
      }
    });
    setShowAddRole(false);
    alert("Role updated successfully!");
  };

  const cancelEditRole = () => {
    setEditingRole(null);
    setNewRole({
      name: "", description: "",
      permissions: {
        dashboard: false, categories: false, products: false, reports: false, sales: false,
        procurement: false, accounting: false, settings: false, users: false,
        subscriptions: false, costcentres: false
      }
    });
    setShowAddRole(false);
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || "Unknown Role";
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Configure your company details, manage users and roles</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveSettingsTab('company')}
          className={`px-6 py-3 -mb-px border-b-2 font-medium transition-all ${
            activeSettingsTab === 'company'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🏢 Company
        </button>
        <button
          onClick={() => setActiveSettingsTab('users')}
          className={`px-6 py-3 -mb-px border-b-2 font-medium transition-all ${
            activeSettingsTab === 'users'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveSettingsTab('roles')}
          className={`px-6 py-3 -mb-px border-b-2 font-medium transition-all ${
            activeSettingsTab === 'roles'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🔐 Roles & Permissions
        </button>
      </div>

      {/* Company Settings */}
      {activeSettingsTab === 'company' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              🖼️ Company Logo
            </h2>
            <div className="flex flex-col items-center gap-4">
              {logoPreview ? (
                <div className="w-48 h-48 border-2 border-dashed rounded-2xl flex items-center justify-center overflow-hidden">
                  <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed rounded-2xl flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">🏢</div>
                    <div>No Logo</div>
                  </div>
                </div>
              )}
              <label className="px-6 py-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 font-medium">
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              📋 Company Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">RC Number</label>
                <input
                  type="text"
                  value={settings.rcNumber}
                  onChange={(e) => setSettings({ ...settings, rcNumber: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Motto</label>
                <input
                  type="text"
                  value={settings.motto}
                  onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              <button
                onClick={saveSettings}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeSettingsTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              👥 User Management
            </h2>
            <button
              onClick={() => {
                setEditingUser(null);
                setNewUser({ username: "", password: "", roleId: "cashier" });
                setShowAddUser(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
            >
              ➕ Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-left rounded-tl-xl">Username</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Created Date</th>
                  <th className="p-4 text-left rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.roleId === "admin" 
                          ? "bg-red-100 text-red-800" 
                          : user.roleId === "accountant" 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {getRoleName(user.roleId)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditUser(user)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Management */}
      {activeSettingsTab === 'roles' && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🔐 Roles & Permissions
            </h2>
            <button
              onClick={() => {
                setEditingRole(null);
                setNewRole({
                  name: "", description: "",
                  permissions: {
                    dashboard: false, categories: false, products: false, reports: false, sales: false,
                    procurement: false, accounting: false, settings: false, users: false,
                    subscriptions: false, costcentres: false
                  }
                });
                setShowAddRole(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
            >
              ➕ Add Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{role.name}</h3>
                  {role.description && (
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(role.permissions).map(([key, value]) => (
                      value && (
                        <span key={key} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {key}
                        </span>
                      )
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditRole(role)}
                    className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
                    disabled={role.id === "admin"}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-6">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                <select
                  value={newUser.roleId}
                  onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingUser ? saveEditUser : addUser}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  {editingUser ? "Save Changes" : "Add User"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-6">
              {editingRole ? "Edit Role" : "Add New Role"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role Name *</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  rows={2}
                  placeholder="Enter role description"
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="font-bold mb-3">Permissions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(newRole.permissions).map((permKey) => (
                    <div key={permKey} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`perm-${permKey}`}
                        checked={(newRole.permissions as any)[permKey]}
                        onChange={(e) => setNewRole({
                          ...newRole,
                          permissions: {
                            ...newRole.permissions,
                            [permKey]: e.target.checked
                          }
                        })}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`perm-${permKey}`} className="text-sm capitalize">
                        {permKey}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingRole ? saveEditRole : addRole}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  {editingRole ? "Save Changes" : "Add Role"}
                </button>
                <button
                  onClick={cancelEditRole}
                  className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Configuration (under Company tab) */}
      {activeSettingsTab === 'company' && (
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            🧾 Receipt Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed rounded-2xl p-6">
              <h3 className="font-bold mb-4">Receipt Preview</h3>
              <div className="text-center">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="w-32 h-32 mx-auto mb-2 object-contain" />
                )}
                <div className="text-lg font-bold">{settings.name}</div>
                <div className="text-sm text-gray-600">{settings.address}</div>
                <div className="text-sm text-gray-600">{settings.phone}</div>
                <div className="border-t border-b my-4 py-2">
                  Receipt Preview
                </div>
                <div className="text-sm text-gray-700 italic">{settings.motto}</div>
              </div>
            </div>
            <div className="border-2 border-dashed rounded-2xl p-6">
              <h3 className="font-bold mb-4">Receipt Options</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="showLogo" defaultChecked className="w-5 h-5" />
                  <label htmlFor="showLogo">Show Logo on Receipt</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="showMotto" defaultChecked className="w-5 h-5" />
                  <label htmlFor="showMotto">Show Motto on Receipt</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="showAddress" defaultChecked className="w-5 h-5" />
                  <label htmlFor="showAddress">Show Address on Receipt</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}