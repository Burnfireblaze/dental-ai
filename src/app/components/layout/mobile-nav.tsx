import { NavLink } from 'react-router';
import { Home, LayoutDashboard, Upload, Bot, Settings, FolderOpen, Users, Calendar } from 'lucide-react';
import { useRole } from '../../contexts/role-context';

const doctorNavItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/ai-assistant', icon: Bot, label: 'AI' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const patientNavItems = [
  { to: '/patient/dashboard', icon: Home, label: 'Home' },
  { to: '/patient/records', icon: FolderOpen, label: 'Records' },
  { to: '/patient/timeline', icon: Calendar, label: 'Timeline' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileNav() {
  const { role } = useRole();
  
  const navItems = 
    role === 'patient' ? patientNavItems :
    role === 'admin' ? adminNavItems :
    doctorNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[60px] ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}