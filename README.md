# Wedding Invitation (React + Tailwind + Node + Supabase)

A rope-tied envelope opens slowly, then the invitation scrolls: countdown, story, celebration, the day, dress code, where to stay, wedding gift, RSVP. All text lives in Supabase and is edited at `/admin`.

## Setup
1. Create a project at supabase.com. In SQL Editor, run `supabase/schema.sql`.
2. Authentication > Users > Add user (your admin email and password).
3. Copy `.env.example` to `.env` and `client/.env.example` to `client/.env`. Fill in your keys.
4. `npm run setup`, then `npm run dev`. Open http://localhost:5173
5. Go to `/admin`, sign in, edit anything, press Save changes.

## Deploy
`npm run build`, then `npm start`. Express serves the API and the built site on one port (Render, Railway, or any Node host).
"# weadding_invitation" 
