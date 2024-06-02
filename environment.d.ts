declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DATABASE_URL?: string;
      JWT_ACCESS_SECRET_KEY?: string;
      JWT_ACCESS_EXPIRES_IN?: string;
      JWT_REFRESH_SECRET_KEY?: string;
      JWT_REFRESH_EXPIRES_IN?: string;
      JWT_REFRESH_COOKIE_EXPIRES_IN?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_SESSION_TOKEN?: string;
      DOMAIN_NAME?: string;
      SES_SENDERS_EMAIL_ADDRESS?: string;
    }
  }
}

export {};
