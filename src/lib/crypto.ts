// Convert a string to an ArrayBuffer
async function stringToBuffer(str: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert an ArrayBuffer to a hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const SECRET_SEED = 'your-secret-seed-here';

export async function hashPassword(password: string, ownerInfo: string): Promise<string> {
  // Create salt using SHA-256
  const saltData = await stringToBuffer(ownerInfo + SECRET_SEED);
  const saltBuffer = await crypto.subtle.digest('SHA-256', saltData);
  const salt = bufferToHex(saltBuffer);
  
  // Hash password with salt
  const passwordData = await stringToBuffer(password + salt);
  const hashedBuffer = await crypto.subtle.digest('SHA-256', passwordData);
  return bufferToHex(hashedBuffer);
}

export async function deriveKey(hashedPassword: string): Promise<string> {
  // Import the secret seed as a key
  const encoder = new TextEncoder();
  const seedBuffer = await stringToBuffer(SECRET_SEED);
  const key = await crypto.subtle.importKey(
    'raw',
    seedBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the hashed password using HMAC
  const data = await stringToBuffer(hashedPassword);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    data
  );

  return bufferToHex(signature);
}

export function computeIndex(key: string): number {
  return parseInt(key.substring(0, 8), 16);
}