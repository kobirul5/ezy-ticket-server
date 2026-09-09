import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || "5000",
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "12",
  frontend_url: process.env.FRONTEND_BASE_URL || "http://localhost:3000",
   APP_DASHBOARD_URL: process.env.APP_DASHBOARD_URL || "http://localhost:3000/dashboard",
  jwt: {
    jwt_secret: process.env.JWT_SECRET || "ezy_ticket_super_secret_jwt_key_2026",
    expires_in: process.env.EXPIRES_IN || "7d",
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || "ezy_ticket_super_secret_refresh_token_key_2026",
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
    reset_pass_secret: process.env.RESET_PASS_TOKEN || "ezy_ticket_reset_pass_secret_key_2026",
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN || "15m",
  },
  reset_pass_link: process.env.RESET_PASS_LINK || "http://localhost:3000/reset-password",
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
    smtp_server: process.env.smtp_server,
    smtp_port: process.env.smtp_port,
    smtp_user: process.env.smtp_user,
    smtp_pass: process.env.smtp_pass,
  },
  brevoMail: {
    api_key: process.env.BREVO_API_KEY,
    email: process.env.BREVO_EMAIL,
    sender_name: process.env.BREVO_SENDER_NAME,
  },
  stripe: {
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    admin_account: process.env.STRIPE_ADMIN_ACCOUNT_ID,
  },
  authorizeNet: {
    apiLoginId: process.env.AUTHORIZE_NET_API_LOGIN_ID,
    transactionKey: process.env.AUTHORIZE_NET_TRANSACTION_KEY,
  },
  platformCharge: {
    percentage: Number(process.env.PLATFORM_CHARGE_PERCENTAGE) || 10, // Default 10% if not set in env
  },
  client: {
    url:
      process.env.FRONTEND_BASE_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:3000",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  firebase: {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com",
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  sslcommerz: {
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASS,
    is_live: process.env.IS_LIVE === "true",
  },
  server_url: process.env.SERVER_URL || "http://localhost:5000",
};
