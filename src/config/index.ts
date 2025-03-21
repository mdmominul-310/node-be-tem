import * as dotenv from "dotenv";
import path from "path";

// dotenv.config({
//     path: path.join(process.cwd(), '.env')
// });

// Load environment variables based on the current environment
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(process.cwd(), ".env") });
} else if (process.env.NODE_ENV === "development") {
  console.log("Loading local environment variables");
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
} else {
  dotenv.config({ path: path.join(process.cwd(), ".env") });
}

export default {
  project_name: process.env.PROJECT_NAME || "cap-product-service",
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  // mongo database configuration
  mongodb_host: process.env.mongodb_host || "localhost",
  mongodb_database: process.env.mongodb_database || "captake",
  mongodb_user: process.env.user || "introbanglaltd",
  mongodb_password: process.env.password,
  auth_api_key: process.env.AUTH_API_KEY || "admin",

  // encryption configuration
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire_in: process.env.JWT_EXPIRE_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,

  // aws email configuration
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  email_host: process.env.EMAIL_HOST,

  // sms configuration
  sms_api: process.env.SMS_API,
  sms_api_user: process.env.SMS_API_USER,
  sms_api_password: process.env.SMS_API_PASSWORD,
  sms_api_sender_id: process.env.SMS_API_SENDER_ID,
  sms_api_type: process.env.SMS_API_TYPE,

    // Google Auth Configuration
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
};
