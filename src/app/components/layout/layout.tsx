import { Outlet } from 'react-router';
import Header from './header';
import Sidebar from './sidebar';
import MobileNav from './mobile-nav';
import { useState } from 'react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white pt-16">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
