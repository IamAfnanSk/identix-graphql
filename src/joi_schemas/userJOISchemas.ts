import Joi from 'joi';

import { UserRegisterInput, UserRequestPasswordResetInput } from '../generated/resolvers-types.js';

const JOIcreateUserSchema = Joi.object<UserRegisterInput>({
  username: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username must have atleast 3 characters',
    'string.max': 'Username must have atmost 20 characters',
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email is not valid',
    }),

  password: Joi.string().required().min(8).max(25).messages({
    'string.base': 'Password should be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must have atleast 8 characters',
    'string.max': 'Password must have atmost 25 characters',
  }),
  firstName: Joi.string().min(1).max(10).alphanum().messages({
    'string.base': 'Firstname should be a string',
    'string.max': 'Firstname must have atmost 10 character',
    'string.min': 'Firstname must have atleat 1 character',
    'string.alphanum': 'No special characters allowed in firstname',
  }),

  lastName: Joi.string().min(1).max(10).alphanum().messages({
    'string.base': 'Lastname should be a string',
    'string.max': 'Lastname must have atmost 10 character',
    'string.min': 'Lastname must have atleat 1 character',
    'string.alphanum': 'No special characters allowed in lastname',
  }),
});

const JOIrequestPasswordResetSchema = Joi.object<UserRequestPasswordResetInput>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email is not valid',
    }),
});

export { JOIcreateUserSchema, JOIrequestPasswordResetSchema };
