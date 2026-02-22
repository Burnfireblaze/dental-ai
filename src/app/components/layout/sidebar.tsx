import { NavLink } from 'react-router';
import { 
  Home, 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Bot, 
  BarChart3, 
  Settings,
  Users,
  Activity,
  Calendar,
  FolderOpen,
  Share2,
  UserCog
} from 'lucide-react';
import { useRole } from '../../contexts/role-context';

interface SidebarProps {
  onNavigate?: () => void;
}

const doctorNavItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'X-ray Analysis' },
  { to: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/stats', icon: BarChart3, label: 'Stats & Calibration' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const patientNavItems = [
  { to: '/patient/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/patient/records', icon: FolderOpen, label: 'My Records' },
  { to: '/patient/timeline', icon: Calendar, label: 'Treatment Timeline' },
  { to: '/patient/share', icon: Share2, label: 'Share Records' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/roles', icon: UserCog, label: 'Roles & Permissions' },
  { to: '/admin/activity', icon: Activity, label: 'System Activity' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { role } = useRole();
  
  const navItems = 
    role === 'patient' ? patientNavItems :
    role === 'admin' ? adminNavItems :
    doctorNavItems;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}