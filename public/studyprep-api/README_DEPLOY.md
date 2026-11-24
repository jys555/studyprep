# StudyPrep 2.0 — 5 daqiqalik ishga tushirish qo'llanmasi

## 1. Supabase (Postgres baza)
1. [supabase.com](https://supabase.com) da bepul loyiha oching (Region: **Frankfurt — eu-central-1**).
2. **SQL Editor -> New Query** ga `studyprep_supabase_schema.sql` faylini tashlab **Run** bosing.
3. **Project Settings -> API** dan ikkita qiymatni nusxalang:
   - `Project URL` (`SUPABASE_URL`)
   - `service_role` secret kalit (`SUPABASE_SERVICE_ROLE_KEY`) — buni hech qachon frontendga qo'ymang!

## 2. Vercel (Serverless API + VPNsiz Telegram Broadcast)
1. Ushbu `studyprep_vercel_api` papkasini alohida GitHub repoga yuklang (masalan, `studyprep-api`).
2. [vercel.com](https://vercel.com) -> **Add New Project** -> o'sha reponi ulang.
3. **Settings -> Environment Variables** ga quyidagilarni kiriting:
   - `SUPABASE_URL` = Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase `service_role` kaliti
   - `BOT_TOKEN` = Telegram bot tokeningiz
   - `FIREBASE_PROJECT_ID` = `study-prep-b9f71`
   - `ADMIN_EMAIL` = `jumanovyashnarbek55@gmail.com`
4. **Deploy** bosing. Tayyor URL (masalan `https://studyprep-api.vercel.app`) ni tekshiring:
   - `https://studyprep-api.vercel.app/api/health` -> `{"ok": true, "db": "alive"}`
   - `https://studyprep-api.vercel.app/api/config` -> 7 ta fakultet va 59 ta guruh chiqadi.
