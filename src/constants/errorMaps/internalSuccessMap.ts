type SuccessMapKey =
  | 'user/successRegister'
  | 'user/successDelete'
  | 'user/successPasswordResetRequest'
  | 'user/successPasswordReset'
  | 'user/successLogout'
  | 'userLink/successCreate'
  | 'userLink/successDelete'
  | 'userLink/successUpdate';

const internalSuccessMap: Record<SuccessMapKey, string> = {
  'user/successRegister': 'User registered successfully',
  'user/successDelete': 'User deleted successsfully',
  'user/successPasswordResetRequest': 'Please find password reset instructions on your registered email address',
  'user/successPasswordReset': 'Password changed successfully',
  'user/successLogout': 'Logged out successfully',
  'userLink/successCreate': 'UserLink Created Successfully',
  'userLink/successDelete': 'UserLink deleted successfully',
  'userLink/successUpdate': 'UserLink updated successfully',
};

export { internalSuccessMap };
