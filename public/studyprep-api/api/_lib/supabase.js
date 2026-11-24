const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers(extra = {}) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY sozlanmagan');
  }
  const h = {
    apikey: SERVICE_KEY,
    'Content-Type': 'application/json',
    ...extra
  };
  // Yangi sb_secret_... kalitda Authorization kerak emas; eski JWT (eyJ...) da qo'shiladi
  if (SERVICE_KEY.startsWith('eyJ')) {
    h.Authorization = `Bearer ${SERVICE_KEY}`;
  }
  return h;
}

export async function sbRest(path, { method = 'GET', body, prefer } = {}) {
  const h = headers(prefer ? { Prefer: prefer } : {});
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!r.ok) {
    throw new Error(data?.message || data?.error || `Supabase xato: ${r.status}`);
  }
  return data;
}

export async function sbRpc(fnName, params = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(params)
  });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!r.ok) {
    throw new Error(data?.message || data?.error || `Supabase RPC xato: ${r.status}`);
  }
  return data;
}
