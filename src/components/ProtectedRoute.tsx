import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, PERMISSIONS } from '../types/auth';
import { ShieldAlert } from 'lucide-react';

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  permission?: keyof typeof PERMISSIONS;
  fallback?: React.ReactNode;
}

export const ProtectedContent: React.FC<GuardProps> = ({
  children,
  allowedRoles,
  permission,
  fallback = null,
}) => {
  const { hasAccess, canPerform } = useAuth();

  let isAuthorized = true;

  if (allowedRoles) {
    isAuthorized = hasAccess(allowedRoles);
  }

  if (isAuthorized && permission) {
    isAuthorized = canPerform(permission);
  }

  if (!isAuthorized) {
    return (
      <>{fallback}</> || (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-center space-x-3 text-amber-800 dark:text-amber-300 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Ação ou visualização restrita para o seu perfil de acesso.</span>
        </div>
      )
    );
  }

  return <>{children}</>;
};
