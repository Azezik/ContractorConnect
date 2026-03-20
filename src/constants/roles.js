export const ACCOUNT_ROLES = {
  CLIENT: 'client',
  CONTRACTOR: 'contractor',
};

export const ROLES = {
  ...ACCOUNT_ROLES,
  CUSTOMER: ACCOUNT_ROLES.CLIENT,
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};
