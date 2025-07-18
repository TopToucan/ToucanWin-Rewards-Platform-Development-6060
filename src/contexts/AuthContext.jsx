import React, { createContext, useContext, useState } from 'react';
import { Roles, Permissions, RolePermissions } from '../models/RoleModel';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: "John Doe",
    role: Roles.USER,
    points: 1000
  });

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    return RolePermissions[user.role]?.includes(permission) || false;
  };

  const updateRole = (newRole) => {
    if (Object.values(Roles).includes(newRole)) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};