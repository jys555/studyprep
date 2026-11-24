import crypto from 'node:crypto';

const ALLOWED_ORIGINS = [
  'https://study-prep-b9f71.web.app',
  'https://study-prep-b9f71.firebaseapp.com',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'study-prep-b9f71';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'jumanovyashnarbek55@gmail.com').toLowerCase();

let cachedCerts = null;
let certsExpiresAt = 0;

export function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

async function getGoogleCerts() {
  if (cachedCerts && Date.now() < certsExpiresAt) return cachedCerts;
  const r = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!r.ok) throw new Error('Google sertifikatlarini olib bo\'lmadi');
  cachedCerts = await r.json();
  certsExpiresAt = Date.now() + 3600 * 1000;
  return cachedCerts;
}

function b64urlToBuf(str) {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

export async function verifyFirebaseToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    const err = new Error('Avtorizatsiya tokeni topilmadi');
    err.status = 401;
    throw err;
  }
  const token = auth.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    const err = new Error('Noto\'g\'ri JWT formati');
    err.status = 401;
    throw err;
  }

  const header = JSON.parse(b64urlToBuf(parts[0]).toString('utf8'));
  const payload = JSON.parse(b64urlToBuf(parts[1]).toString('utf8'));
  const sig = b64urlToBuf(parts[2]);

  if (header.alg !== 'RS256' || !header.kid) {
    const err = new Error('JWT algoritmi qo\'llab-quvvatlanmaydi');
    err.status = 401;
    throw err;
  }

  const certs = await getGoogleCerts();
  const pem = certs[header.kid];
  if (!pem) {
    cachedCerts = null;
    const err = new Error('JWT kaliti mos kelmadi');
    err.status = 401;
    throw err;
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
  if (!verifier.verify(pem, sig)) {
    const err = new Error('JWT imzosi yaroqsiz');
    err.status = 401;
    throw err;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== PROJECT_ID || payload.iss !== `https://securetoken.google.com/${PROJECT_ID}`) {
    const err = new Error('JWT loyiha identifikatori mos emas');
    err.status = 401;
    throw err;
  }
  if (!payload.sub || payload.exp <= now) {
    const err = new Error('Sessiya muddati tugagan, qayta kiring');
    err.status = 401;
    throw err;
  }

  const email = (payload.email || '').toLowerCase();
  return {
    uid: payload.sub,
    email,
    emailVerified: Boolean(payload.email_verified),
    name: payload.name || '',
    picture: payload.picture || '',
    isAdmin: Boolean(payload.email_verified && email === ADMIN_EMAIL)
  };
}

export function getIsoWeekId(date = new Date()) {
  // O'zbekiston vaqti (UTC+5) bo'yicha hafta raqami
  const uz = new Date(date.getTime() + 5 * 3600 * 1000);
  const d = new Date(Date.UTC(uz.getUTCFullYear(), uz.getUTCMonth(), uz.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getUzDateStr(date = new Date()) {
  const uz = new Date(date.getTime() + 5 * 3600 * 1000);
  return uz.toISOString().slice(0, 10);
}
