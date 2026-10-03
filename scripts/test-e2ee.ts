/**
 * Automated Verification & Cryptographic Security Test Suite
 * Tests Web Crypto API primitives, ECDH key agreement, AES-GCM encryption,
 * ciphertext integrity/tamper-resistance, and forward-secure group key rotation.
 */

// Node.js WebCrypto polyfill / compatibility for standalone testing
const webCrypto = globalThis.crypto;

// Helper: Uint8Array to Base64
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

// Helper: Base64 to Uint8Array
function base64ToBuffer(base64: string): Uint8Array<ArrayBuffer> {
  const buf = Buffer.from(base64, 'base64');
  const arrayBuffer = new ArrayBuffer(buf.length);
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buf.length; i++) {
    bytes[i] = buf[i];
  }
  return bytes;
}

// Generate ECDH P-256 KeyPair
async function generateECDHKeyPair(): Promise<CryptoKeyPair> {
  return await webCrypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );
}

// Compute deterministic SHA-256 fingerprint
async function computeFingerprint(publicJwk: JsonWebKey): Promise<string> {
  const canonical = JSON.stringify({
    crv: publicJwk.crv,
    kty: publicJwk.kty,
    x: publicJwk.x,
    y: publicJwk.y,
  });
  const encoder = new TextEncoder();
  const hashBuffer = await webCrypto.subtle.digest('SHA-256', encoder.encode(canonical));
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return hex.match(/.{1,4}/g)?.slice(0, 8).join(' ') || hex.slice(0, 32);
}

// Derive pairwise AES-GCM key
async function derivePairwiseKey(
  privateKeyJwk: JsonWebKey,
  publicKeyJwk: JsonWebKey
): Promise<CryptoKey> {
  const privateKey = await webCrypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveKey']
  );

  const publicKey = await webCrypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    []
  );

  return await webCrypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt direct message
async function encryptMessage(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const iv = webCrypto.getRandomValues(new Uint8Array(new ArrayBuffer(12)));
  const ciphertextBuffer = await webCrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
  };
}

// Decrypt direct message
async function decryptMessage(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  const ciphertext = base64ToBuffer(ciphertextBase64);
  const iv = base64ToBuffer(ivBase64);

  const decryptedBuffer = await webCrypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
}

async function runTests() {
  console.log('====================================================');
  console.log(' OpenChat — End-to-End Encryption Verification Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, title: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] ${title}`);
      process.exitCode = 1;
    }
  }

  // TEST 1: Key Generation & Fingerprinting
  console.log('Test 1: Generating client-side ECDH P-256 keypairs...');
  const alicePair = await generateECDHKeyPair();
  const bobPair = await generateECDHKeyPair();
  const charliePair = await generateECDHKeyPair();

  const alicePublicJwk = await webCrypto.subtle.exportKey('jwk', alicePair.publicKey);
  const alicePrivateJwk = await webCrypto.subtle.exportKey('jwk', alicePair.privateKey);
  const bobPublicJwk = await webCrypto.subtle.exportKey('jwk', bobPair.publicKey);
  const bobPrivateJwk = await webCrypto.subtle.exportKey('jwk', bobPair.privateKey);
  const charliePublicJwk = await webCrypto.subtle.exportKey('jwk', charliePair.publicKey);
  const charliePrivateJwk = await webCrypto.subtle.exportKey('jwk', charliePair.privateKey);

  const aliceFingerprint = await computeFingerprint(alicePublicJwk);
  const bobFingerprint = await computeFingerprint(bobPublicJwk);

  assert(aliceFingerprint.length === 39, `Alice fingerprint format valid (${aliceFingerprint})`);
  assert(bobFingerprint.length === 39, `Bob fingerprint format valid (${bobFingerprint})`);
  assert(aliceFingerprint !== bobFingerprint, 'Distinct identity fingerprints');

  // TEST 2: Pairwise Key Derivation (Diffie-Hellman Property)
  console.log('\nTest 2: Pairwise ECDH shared key agreement between Alice and Bob...');
  const aliceSharedKey = await derivePairwiseKey(alicePrivateJwk, bobPublicJwk);
  const bobSharedKey = await derivePairwiseKey(bobPrivateJwk, alicePublicJwk);

  const secretMessage = 'Hello Bob, this message is encrypted strictly on my device!';
  const { ciphertext, iv } = await encryptMessage(secretMessage, aliceSharedKey);

  assert(ciphertext !== secretMessage, 'Ciphertext is non-plaintext Base64');
  assert(!ciphertext.includes('Hello'), 'Plaintext string not found in ciphertext');

  const bobDecrypted = await decryptMessage(ciphertext, iv, bobSharedKey);
  assert(bobDecrypted === secretMessage, 'Bob successfully decrypted Alice message via derived secret');

  // TEST 3: Tamper Resistance (Ciphertext Integrity via AES-GCM Tag)
  console.log('\nTest 3: Testing ciphertext tampering rejection...');
  const tamperedBytes = base64ToBuffer(ciphertext);
  tamperedBytes[0] ^= 0xff; // Flip bits in ciphertext
  const tamperedCiphertext = bufferToBase64(tamperedBytes);

  let tamperCaught = false;
  try {
    await decryptMessage(tamperedCiphertext, iv, bobSharedKey);
  } catch {
    tamperCaught = true;
  }
  assert(tamperCaught, 'Tampered ciphertext rejected by AES-GCM authentication tag');

  // TEST 4: Group Key Generation, Envelope Wrapping & Decryption
  console.log('\nTest 4: Group Chat Key Envelope Generation & Distribution...');
  // Alice creates group key (AES-256)
  const groupKeyV1 = await webCrypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const rawGroupKeyV1 = await webCrypto.subtle.exportKey('raw', groupKeyV1);

  // Wrap group key for Bob and Charlie
  async function wrapKey(rawKey: ArrayBuffer, memberPubJwk: JsonWebKey, adminPrivJwk: JsonWebKey) {
    const pwKey = await derivePairwiseKey(adminPrivJwk, memberPubJwk);
    const wrapIv = webCrypto.getRandomValues(new Uint8Array(new ArrayBuffer(12)));
    const wrappedBuf = await webCrypto.subtle.encrypt(
      { name: 'AES-GCM', iv: wrapIv },
      pwKey,
      rawKey
    );
    return { wrapped: bufferToBase64(wrappedBuf), iv: bufferToBase64(wrapIv) };
  }

  async function unwrapKey(wrappedBase64: string, wrapIvBase64: string, memberPrivJwk: JsonWebKey, adminPubJwk: JsonWebKey) {
    const pwKey = await derivePairwiseKey(memberPrivJwk, adminPubJwk);
    const rawKey = await webCrypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBuffer(wrapIvBase64) },
      pwKey,
      base64ToBuffer(wrappedBase64)
    );
    return await webCrypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  }

  const bobEnvelopeV1 = await wrapKey(rawGroupKeyV1, bobPublicJwk, alicePrivateJwk);
  const charlieEnvelopeV1 = await wrapKey(rawGroupKeyV1, charliePublicJwk, alicePrivateJwk);

  const bobUnwrappedV1 = await unwrapKey(bobEnvelopeV1.wrapped, bobEnvelopeV1.iv, bobPrivateJwk, alicePublicJwk);
  const charlieUnwrappedV1 = await unwrapKey(charlieEnvelopeV1.wrapped, charlieEnvelopeV1.iv, charliePrivateJwk, alicePublicJwk);

  const groupMsgV1 = 'Welcome to the private project group!';
  const groupEncryptedV1 = await encryptMessage(groupMsgV1, groupKeyV1);

  const bobGroupDecrypted = await decryptMessage(groupEncryptedV1.ciphertext, groupEncryptedV1.iv, bobUnwrappedV1);
  const charlieGroupDecrypted = await decryptMessage(groupEncryptedV1.ciphertext, groupEncryptedV1.iv, charlieUnwrappedV1);

  assert(bobGroupDecrypted === groupMsgV1, 'Bob unwrapped envelope & decrypted group message V1');
  assert(charlieGroupDecrypted === groupMsgV1, 'Charlie unwrapped envelope & decrypted group message V1');

  // TEST 5: Forward-Secure Key Rotation on Member Removal
  console.log('\nTest 5: Forward Secrecy via Key Rotation (Charlie removed from group)...');
  // Charlie is removed. Admin (Alice) rotates key to V2.
  const groupKeyV2 = await webCrypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const rawGroupKeyV2 = await webCrypto.subtle.exportKey('raw', groupKeyV2);

  // Alice wraps V2 ONLY for Bob. Charlie NEVER receives the V2 key envelope.
  const bobEnvelopeV2 = await wrapKey(rawGroupKeyV2, bobPublicJwk, alicePrivateJwk);
  const bobUnwrappedV2 = await unwrapKey(bobEnvelopeV2.wrapped, bobEnvelopeV2.iv, bobPrivateJwk, alicePublicJwk);

  const confidentialMsgV2 = 'Confidential message after Charlie was removed!';
  const groupEncryptedV2 = await encryptMessage(confidentialMsgV2, groupKeyV2);

  const bobDecryptedV2 = await decryptMessage(groupEncryptedV2.ciphertext, groupEncryptedV2.iv, bobUnwrappedV2);
  assert(bobDecryptedV2 === confidentialMsgV2, 'Remaining member (Bob) decrypted V2 message');

  let charlieFailedToDecrypt = false;
  try {
    // Charlie attempts to decrypt V2 message with his stale V1 key
    await decryptMessage(groupEncryptedV2.ciphertext, groupEncryptedV2.iv, charlieUnwrappedV1);
  } catch {
    charlieFailedToDecrypt = true;
  }
  assert(charlieFailedToDecrypt, 'Forward Secrecy Enforced: Removed member (Charlie) cannot decrypt V2 message');

  console.log(`\n====================================================`);
  console.log(` Test Summary: ${passed}/${total} assertions passed successfully!`);
  console.log(`====================================================\n`);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
