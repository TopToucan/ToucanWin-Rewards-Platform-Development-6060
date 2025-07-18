export const Roles = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

export const Permissions = {
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_CAMPAIGNS: 'manage_campaigns',
  MANAGE_USERS: 'manage_users',
  VIEW_REPORTS: 'view_reports',
  MANAGE_REWARDS: 'manage_rewards'
};

export const RolePermissions = {
  [Roles.ADMIN]: [
    Permissions.VIEW_ANALYTICS,
    Permissions.MANAGE_CAMPAIGNS,
    Permissions.MANAGE_USERS,
    Permissions.VIEW_REPORTS,
    Permissions.MANAGE_REWARDS
  ],
  [Roles.MANAGER]: [
    Permissions.VIEW_ANALYTICS,
    Permissions.MANAGE_CAMPAIGNS,
    Permissions.VIEW_REPORTS
  ],
  [Roles.USER]: []
};