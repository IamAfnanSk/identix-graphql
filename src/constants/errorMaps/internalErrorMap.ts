type ErrorMapKey =
  | 'auth/unauthorized'
  | 'auth/unauthenticated'
  | 'user/inValidUserLoginCredentials'
  | 'user/emailAlreadyExists'
  | 'user/usernameAlreadyExists'
  | 'user/failRegister'
  | 'user/failDelete'
  | 'user/notFound'
  | 'user/failPasswordReset'
  | 'userLink/failCreate'
  | 'userLink/failUpdate'
  | 'userLink/alreadyDeleted'
  | 'userLink/failFetched'
  | 'user/invalidToken'
  | 'server/failComplete'
  | 'auth/samePassword';

const internalErrorMap: Record<ErrorMapKey, string> = {
  'auth/unauthorized': 'You are not authorized to perform this action',
  'auth/unauthenticated': 'You are not authenticated',
  'auth/samePassword': 'You cannot set your new password same as old password',
  'user/inValidUserLoginCredentials': 'Unable to login. Please check username/password combination',
  'user/emailAlreadyExists': 'Email already registered',
  'user/usernameAlreadyExists': 'Username is taken',
  'user/failRegister': 'Registration failed',
  'user/failDelete': 'Failed to delete account',
  'user/notFound': 'User not found',
  'user/failPasswordReset': 'Expired or invalid request',
  'userLink/failCreate': 'Failed to create new link',
  'userLink/failUpdate': 'Failed to update link',
  'userLink/alreadyDeleted': 'Link already deleted',
  'userLink/failFetched': 'Unable to fetch links',
  'user/invalidToken': 'Expired or Invalid Token',
  'server/failComplete': 'Something went wrong, please try again later',
};

export { internalErrorMap };
