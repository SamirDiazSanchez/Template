export const useCrypto = () => {
  const hexToBytes = (hex: string): Uint8Array => {
    return hex && new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return buffer && Buffer.from(new Uint8Array(buffer)).toString("base64");
  }

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    return base64 && Uint8Array.from(Buffer.from(base64, "base64")).buffer;
  }

  const encryptAESGCM = (plaintext: string) => new Promise(async (res, rej) => {
    const keyBytes = hexToBytes(process.env.NEXT_PUBLIC_KEY);
    const ivBytes = hexToBytes(process.env.NEXT_PUBLIC_IV);
  
    if (![16, 24, 32].includes(keyBytes.length)) rej("La clave debe tener 128, 192 o 256 bits.");
    if (ivBytes.length !== 12) rej("El IV debe tener 12 bytes (96 bits).");

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );
      const plaintextBytes = new TextEncoder().encode(plaintext);
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: ivBytes },
        key,
        plaintextBytes
      );
      res(arrayBufferToBase64(encrypted));
    } catch (ex) {
      return rej(ex);
    }
  });

  const decryptAESGCM = (ciphertextBase64: string) => new Promise(async (res, rej) => {
    const keyBytes = hexToBytes(process.env.NEXT_PUBLIC_KEY);
    const ivBytes = hexToBytes(process.env.NEXT_PUBLIC_IV);

    if (![16, 24, 32].includes(keyBytes.length)) rej("La clave debe tener 128, 192 o 256 bits.");
    if (ivBytes.length !== 12) rej("El IV debe tener 12 bytes (96 bits).");

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );
      
      if (ciphertextBase64) {
        const ciphertextBytes = base64ToArrayBuffer(ciphertextBase64);
    
        const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: ivBytes },
          key,
          ciphertextBytes
        );
      
        const result = new TextDecoder().decode(decrypted);
        res(result);
      }
      else res("");
    }
    catch (ex) {
      rej(ex);
    }
  })
  
  return {
    encrypt: encryptAESGCM,
    decrypt: decryptAESGCM
  }
}