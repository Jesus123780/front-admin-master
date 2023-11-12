import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const algorithm = 'aes-256-ctr';

// Clave fija para pruebas (No segura para producción)
function generateEncryptionKey(password, salt) {
    return crypto
      .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
      .toString('hex')
      .slice(0, 32)
  }

  const ENCRYPTION_KEY = generateEncryptionKey(
    'tu-contraseña',
    'alguna-sal-segura'
)
  console.log("🚀 ~ file: referenceImage.js:19 ~ ENCRYPTION_KEY:", ENCRYPTION_KEY)
const iv = crypto.randomBytes(16); // Generar un nuevo IV para cada imagen

export default function handler(req, res) {
  const imagePath = path.join(process.cwd(), 'private', 'me.png');
  const imageBuffer = fs.readFileSync(imagePath);

  // Encriptar la imagen
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.send({ iv: iv.toString('hex'), data: encrypted.toString('hex') });
}
