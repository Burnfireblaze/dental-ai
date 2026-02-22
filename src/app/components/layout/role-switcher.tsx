import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, Stethoscope, User, Shield } from 'lucide-react';
import { useRole, UserRole } from '../../contexts/role-context';
import { Button } from '../ui/button';

const roleConfig = {
  doctor: {
    label: 'Doctor View',
    icon: Stethoscope,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    defaultRoute: '/home',
  },
  patient: {
    label: 'Patient View',
    icon: User,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    defaultRoute: '/patient/dashboard',
  },
  admin: {
    label: 'Admin Hub',
    icon: Shield,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    defaultRoute: '/admin/dashboard',
  },
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = roleConfig[role];
  const CurrentIcon = currentRole.icon;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsOpen(false);
    navigate(roleConfig[newRole].defaultRoute);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-9 ${currentRole.bgColor} ${currentRole.borderColor} ${currentRole.color} hover:opacity-80`}
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{currentRole.label}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {(Object.keys(roleConfig) as UserRole[]).map((roleKey) => {
              const config = roleConfig[roleKey];
              const Icon = config.icon;
              const isActive = roleKey === role;

              return (
                <button
                  key={roleKey}
                  onClick={() => handleRoleChange(roleKey)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isActive
                      ? `${config.bgColor} ${config.color}`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{config.label}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 bg-current rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}