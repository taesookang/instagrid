const admin = require("firebase-admin");
const serviceAccount = require("../../secret.json");

export const verifyIdToken = (token: string) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error: Error) => {
      throw error;
    });
};
