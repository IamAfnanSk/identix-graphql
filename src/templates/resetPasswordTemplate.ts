import { CreateTemplateRequest } from '@aws-sdk/client-ses';

import { SES_CLIENT } from '../constants/sesClient.js';

const params: CreateTemplateRequest = {
  Template: {
    TemplateName: 'ResetPasswordTemplate',
    SubjectPart: 'Password reset request | identix',
    HtmlPart: `<h1>Hello {{userName }}</h1>, <p>Your reset link is valid for next 1 hour: <a href="https://${process.env.DOMAIN_NAME}/password-reset?token={{token}}">Click to reset your password</a></p>`,
    TextPart: '',
  },
};

SES_CLIENT.createTemplate(params, (error) => {
  if (error) console.log(error);
});
