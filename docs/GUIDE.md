# Reachouts Guide

## How it works

| Piece | What it does |
| --- | --- |
| `index.html` + `script.js` | The page visitors see at `…/reachouts/?u=<handle>`. With no handle, it's a landing page. |
| `account.html` + `account.js` | Sign in with an emailed link, pick a name and handle, then copy your link. |
| `config.js` | The Supabase URL and anon key. Both are public by design. |
| `supabase/migrations/` | The `profiles` table (handle and display name) and the `sends` log used for rate limits. Row-level security means people can only see and edit their own profile. |
| `supabase/functions/send-message/` | Looks up the owner of a handle and emails them through Resend, with **Reply-To set to the visitor**. |
| `supabase/templates/magic-link.html` | The sign-in email. |

Your inbox is the email you sign in with, which the sign-in link verifies. Visitors never see it. They only see your display name.

Limits: each visitor email can send 5 messages an hour, and each link receives at most 30 an hour.

## Going live

You need free accounts on [Supabase](https://supabase.com) and [Resend](https://resend.com). Commands run from the project folder, and `npx supabase` needs Node.

1. **Create a Supabase project.** Copy its **Project URL** and **anon public key** from *Settings → API* into the non-local half of `config.js`.
2. **Connect the folder to it:**

   ```bash
   npx supabase login
   ```

   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```

3. **Create the tables, sign-in settings and email function:**

   ```bash
   npx supabase db push
   ```

   ```bash
   npx supabase config push
   ```

   ```bash
   npx supabase functions deploy send-message
   ```

4. **Connect Resend.** Create an API key in Resend, then store it as a secret. Run this yourself, since the key is private:

   ```bash
   npx supabase secrets set RESEND_API_KEY=<your-resend-key>
   ```

5. **Push to GitHub.** Pages serves the site at `https://amalmehta.github.io/reachouts/`. Sign in at `/account.html`, pick your handle, and share your link.

### Without your own domain (works for you only)

- Resend's test sender (`onboarding@resend.dev`) only delivers to the email on your Resend account.
- Supabase's built-in sign-in emails only reach members of your Supabase team.

So out of the box, **you** can sign up and receive messages, but other people can't sign up yet.

### Opening it to everyone (needs a domain, about $10 a year)

1. Add and verify your domain in Resend (*Domains*).
2. Send messages from it:

   ```bash
   npx supabase secrets set FROM_EMAIL="Reachouts <hello@yourdomain.com>"
   ```

3. Send sign-in emails through Resend too. In Supabase go to *Authentication → Emails → SMTP settings* and enter host `smtp.resend.com`, port `465`, username `resend`, and your Resend API key as the password. Use a sender on your domain.

## Running it locally

Needs Docker Desktop running.

```bash
npx supabase start
```

```bash
npx supabase functions serve --env-file supabase/functions/.env
```

```bash
python3 -m http.server 8791
```

`supabase/functions/.env` holds `RESEND_API_KEY=…`. It's git-ignored. Open http://localhost:8791/account.html. Sign-in emails land in the local test inbox at http://127.0.0.1:54324. `config.js` switches to the local backend automatically on `localhost`.

## Customizing

| What | Where |
| --- | --- |
| Visitor page wording | `index.html` |
| Colors | the variables at the top of `styles.css` (light and dark) |
| Email subject and footer | `supabase/functions/send-message/index.ts` |
| Rate limits | `PER_OWNER_PER_HOUR` / `PER_SENDER_PER_HOUR` in the same file |
| Sign-in email | `supabase/templates/magic-link.html` |

## Troubleshooting

- **"Sign-ups open very soon"**: `config.js` still has the placeholder Supabase values.
- **"Email sending isn't set up yet."**: the `RESEND_API_KEY` secret is missing.
- **Messages don't arrive, or reach only you**: you're on Resend's test sender. See *Opening it to everyone*.
- **Sign-in link goes to the wrong page**: check *Authentication → URL Configuration* in Supabase. The site URL should be `https://amalmehta.github.io/reachouts/account.html`.
