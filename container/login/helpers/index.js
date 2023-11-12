export const  decryptImage = async (data, iv) => {
    // Asumiendo que la clave es la misma que en el servidor y está almacenada de forma segura
    const key = await crypto.subtle.importKey(
      'raw',
      Buffer.from(process.env.IMAGE_FACE_KEY, 'utf-8'),
      { name: 'AES-CTR', length: 256 },
      false,
      ['decrypt']
    );
    return await crypto.subtle.decrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      key,
      data
    );
  }