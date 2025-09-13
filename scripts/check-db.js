// scripts/check-db.js
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔎 MONGODB_URI leído por dotenv:', process.env.MONGODB_URI || '(undefined)');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI no está definido en .env');
  process.exit(1);
}

try {
  await connectDB(process.env.MONGODB_URI);
  console.log('✅ Conexión OK');
  process.exit(0);
} catch (e) {
  console.error('❌ Error de conexión:', e?.message || e);
  process.exit(1);
}
