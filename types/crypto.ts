export interface StoredKeyPair {
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
  fingerprint: string;
  createdAt: number;
}

export interface EncryptedPayload {
  ciphertext: string; // Base64
  iv: string;         // Base64
  algorithm: string;  // 'AES-GCM-256'
  keyVersion?: number;
}

export interface DecryptedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  plaintext: string;
  isDecrypted: boolean;
  decryptionError?: string;
  keyVersion: number;
  status: 'sent' | 'delivered' | 'seen';
  createdAt: string;
}

export interface KeyPairResult {
  keyPair: CryptoKeyPair;
  publicKeyJwk: JsonWebKey;
  fingerprint: string;
}
