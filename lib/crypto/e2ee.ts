import { StoredKeyPair, EncryptedPayload } from '@/types/crypto';
import {
  saveUserKeyPair,
  loadUserKeyPair,
  saveCachedGroupKey,
  loadCachedGroupKey,
} from './idb';
import { SupabaseClient } from '@supabase/supabase-js';

// In-memory caches to optimize message rendering without repeated WebCrypto imports
const directKeyCache = new Map<string, CryptoKey>();
const groupKeyCache = new Map<string, CryptoKey>();

// Utility: ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Utility: Base64 to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array<ArrayBuffer> {
  const binary = window.atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Generate device ECDH P-256 key pair
export async function generateECDHKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true, // extractable so we can store in client IndexedDB
    ['deriveKey', 'deriveBits']
  );
}

// Compute a deterministic SHA-256 fingerprint from public JWK for UI identity verification
export async function computeKeyFingerprint(publicJwk: JsonWebKey): Promise<string> {
  const canonical = JSON.stringify({
    crv: publicJwk.crv,
    kty: publicJwk.kty,
    x: publicJwk.x,
    y: publicJwk.y,
  });
  const encoder = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(canonical));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  // Format as 8 blocks of 4 chars: e.g. "A1B2 C3D4 E5F6 ..."
  return hex.match(/.{1,4}/g)?.slice(0, 8).join(' ') || hex.slice(0, 32);
}

// Ensure the current user has client-side E2EE keys generated and stored in IndexedDB,
// and ensures their public key is published to Supabase user_keys table.
export async function initializeUserKeys(
  userId: string,
  supabase: SupabaseClient
): Promise<StoredKeyPair> {
  // 1. Check local IndexedDB first
  let stored = await loadUserKeyPair(userId);

  if (!stored) {
    // Generate fresh ECDH key pair
    const keyPair = await generateECDHKeyPair();
    const publicJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privateJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const fingerprint = await computeKeyFingerprint(publicJwk);

    stored = {
      publicKeyJwk: publicJwk,
      privateKeyJwk: privateJwk,
      fingerprint,
      createdAt: Date.now(),
    };

    // Store private key safely in client IndexedDB ONLY
    await saveUserKeyPair(userId, stored);
  }

  // 2. Ensure public key is published on Supabase
  try {
    const { data: existingKey } = await supabase
      .from('user_keys')
      .select('public_key, key_fingerprint')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingKey) {
      await supabase.from('user_keys').upsert({
        user_id: userId,
        public_key: stored.publicKeyJwk,
        key_fingerprint: stored.fingerprint,
        algorithm: 'ECDH-P256',
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Could not sync public key with Supabase:', err);
  }

  return stored;
}

// Import a public ECDH key from JWK
export async function importPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    []
  );
}

// Import a private ECDH key from JWK
export async function importPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    false,
    ['deriveKey', 'deriveBits']
  );
}

// Derive a shared pairwise AES-GCM 256-bit encryption key between two users
export async function derivePairwiseKey(
  ownPrivateKeyJwk: JsonWebKey,
  peerPublicKeyJwk: JsonWebKey,
  peerUserId?: string
): Promise<CryptoKey> {
  if (peerUserId && directKeyCache.has(peerUserId)) {
    return directKeyCache.get(peerUserId)!;
  }

  const ownPrivateKey = await importPrivateKey(ownPrivateKeyJwk);
  const peerPublicKey = await importPublicKey(peerPublicKeyJwk);

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: peerPublicKey,
    },
    ownPrivateKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );

  if (peerUserId) {
    directKeyCache.set(peerUserId, derivedKey);
  }

  return derivedKey;
}

// Encrypt plaintext for 1:1 direct message using AES-GCM
export async function encryptDirectMessage(
  plaintext: string,
  pairwiseKey: CryptoKey
): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plaintext);

  // Fresh 12-byte cryptographically random IV for every message
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    pairwiseKey,
    encoded
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
    algorithm: 'AES-GCM-256',
    keyVersion: 1,
  };
}

// Decrypt 1:1 direct message using AES-GCM
export async function decryptDirectMessage(
  ciphertextBase64: string,
  ivBase64: string,
  pairwiseKey: CryptoKey
): Promise<string> {
  try {
    const ciphertext = base64ToBuffer(ciphertextBase64);
    const iv = base64ToBuffer(ivBase64);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      pairwiseKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error('E2EE Decryption failure:', err);
    throw new Error('Unable to decrypt this message');
  }
}

// ==============================================================================
// GROUP CHAT CRYPTOGRAPHIC ENGINE
// ==============================================================================

// Generate a random 256-bit AES-GCM group key
export async function generateGroupKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable so admin can wrap it for members
    ['encrypt', 'decrypt']
  );
}

// Wrap (encrypt) the group key for a specific member using ECDH pairwise agreement
export async function wrapGroupKeyForMember(
  groupKey: CryptoKey,
  memberPublicJwk: JsonWebKey,
  adminPrivateJwk: JsonWebKey
): Promise<{ encryptedKey: string; iv: string }> {
  const pairwiseKey = await derivePairwiseKey(adminPrivateJwk, memberPublicJwk);
  const rawGroupKey = await window.crypto.subtle.exportKey('raw', groupKey);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    pairwiseKey,
    rawGroupKey
  );

  return {
    encryptedKey: bufferToBase64(encryptedKeyBuffer),
    iv: bufferToBase64(iv),
  };
}

// Unwrap (decrypt) the group key received by a member
export async function unwrapGroupKey(
  encryptedKeyBase64: string,
  ivBase64: string,
  memberPrivateJwk: JsonWebKey,
  creatorPublicJwk: JsonWebKey,
  groupId: string,
  version: number
): Promise<CryptoKey> {
  const cacheKey = `${groupId}_v${version}`;
  if (groupKeyCache.has(cacheKey)) {
    return groupKeyCache.get(cacheKey)!;
  }

  // Check IndexedDB cache
  const cachedRaw = await loadCachedGroupKey(groupId, version);
  if (cachedRaw) {
    const imported = await window.crypto.subtle.importKey(
      'raw',
      cachedRaw,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
    groupKeyCache.set(cacheKey, imported);
    return imported;
  }

  // Derive pairwise key with creator/admin who wrapped it
  const pairwiseKey = await derivePairwiseKey(memberPrivateJwk, creatorPublicJwk);
  const encryptedBuffer = base64ToBuffer(encryptedKeyBase64);
  const iv = base64ToBuffer(ivBase64);

  const rawKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    pairwiseKey,
    encryptedBuffer
  );

  // Cache in IndexedDB for subsequent sessions
  await saveCachedGroupKey(groupId, version, rawKeyBuffer);

  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    rawKeyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  groupKeyCache.set(cacheKey, importedKey);
  return importedKey;
}

// Encrypt a group message using the group key
export async function encryptGroupMessage(
  plaintext: string,
  groupKey: CryptoKey,
  keyVersion: number
): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    groupKey,
    encoded
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
    algorithm: 'AES-GCM-256',
    keyVersion,
  };
}

// Decrypt a group message using the group key
export async function decryptGroupMessage(
  ciphertextBase64: string,
  ivBase64: string,
  groupKey: CryptoKey
): Promise<string> {
  try {
    const ciphertext = base64ToBuffer(ciphertextBase64);
    const iv = base64ToBuffer(ivBase64);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      groupKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error('Group E2EE Decryption failure:', err);
    throw new Error('Unable to decrypt this group message');
  }
}

// Clear memory caches on sign out
export function clearKeyCaches() {
  directKeyCache.clear();
  groupKeyCache.clear();
}
