/**
 * Grants (or revokes) the `admin` Firebase Auth custom claim for a user.
 *
 * The Firestore rules allow cross-user reads only when
 * `request.auth.token.admin == true`, so this claim is what unlocks /admin.
 *
 * Usage:
 *   node scripts/setAdminClaim.mjs <email> [--revoke]
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS pointing at a service-account key
 * (Firebase Console > Project settings > Service accounts > Generate new private key).
 */
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'cv-builder-website-7e761';

function initAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set.\n' +
        'Set it to the path of your downloaded service-account JSON, e.g.\n' +
        '  PowerShell: $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\secure\\serviceAccount.json"\n' +
        '  bash:      export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json'
    );
  }

  return initializeApp({
    credential: cert(credentialsPath),
    projectId: PROJECT_ID,
  });
}

async function main() {
  const args = process.argv.slice(2);
  const revoke = args.includes('--revoke');
  const email = args.find((arg) => !arg.startsWith('--'));

  if (!email) {
    console.error('Usage: node scripts/setAdminClaim.mjs <email> [--revoke]');
    process.exit(1);
  }

  initAdmin();
  const auth = getAuth();

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (error) {
    if (error?.code === 'auth/user-not-found') {
      console.error(`No Firebase Auth user found for ${email}.`);
      console.error('Sign up through the app first, then re-run this script.');
      process.exit(1);
    }
    throw error;
  }

  const claims = { ...(user.customClaims || {}) };
  if (revoke) {
    delete claims.admin;
  } else {
    claims.admin = true;
  }

  await auth.setCustomUserClaims(user.uid, claims);

  const updated = await auth.getUser(user.uid);
  console.log(
    revoke
      ? `Revoked admin claim for ${updated.email} (uid ${updated.uid}).`
      : `Granted admin claim to ${updated.email} (uid ${updated.uid}).`
  );
  console.log('customClaims:', JSON.stringify(updated.customClaims || {}));
  console.log('Ask the user to sign out and sign back in so the new token is issued.');
}

main().catch((error) => {
  console.error('Failed:', error?.message || error);
  process.exit(1);
});