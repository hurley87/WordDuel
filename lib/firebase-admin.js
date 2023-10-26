import admin from 'firebase-admin';

export function initializeAdmin() {
  // if already created, return the same instance
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // initialize admin app
  return admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
      private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.NEXT_PUBLIC_CLIENT_CERT_URL,
      universe_domain: 'googleapis.com',
    }),
  });
}
