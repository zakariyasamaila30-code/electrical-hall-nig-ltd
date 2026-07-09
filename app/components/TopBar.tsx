interface TopBarProps {
  toggleSidebar: () => void;
  onLogout: () => void;
}

export default function TopBar({ toggleSidebar, onLogout }: TopBarProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-red-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
          >
            ☰
          </button>
          <div className="bg-white text-slate-800 px-6 py-3 rounded-xl flex items-center gap-3">
            <span className="text-2xl">🏪</span>
            <span className="font-bold">Exelsor Shops</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-white hover:bg-gray-100">
            ➕
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            🏷️
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            📋
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            📊
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            📄
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            💬
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            🔒
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            🔔
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 font-medium flex items-center gap-2"
          >
            🚪 Logout
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
            👤
          </div>
        </div>
      </div>
    </div>
  );
}
