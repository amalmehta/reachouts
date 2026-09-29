// Sends a visitor's message to the Reachouts owner's inbox, with Reply-To set to the visitor.
import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_URL = Deno.env.get("RESEND_API_URL") ?? "https://api.resend.com/emails";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Reachouts <onboarding@resend.dev>";

const PER_OWNER_PER_HOUR = 30;
const PER_SENDER_PER_HOUR = 5;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply(405, { error: "Method not allowed." });

  let input: { handle?: string; email?: string; message?: string; botcheck?: unknown };
  try {
    input = await req.json();
  } catch {
    return reply(400, { error: "Invalid request." });
  }

  // Bots fill in the hidden field; pretend it worked.
  if (input.botcheck) return reply(200, { ok: true });

  const handle = String(input.handle ?? "").trim().toLowerCase();
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "").trim();

  if (!/^[a-z0-9-]{3,30}$/.test(handle)) return reply(400, { error: "This link looks broken." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return reply(400, { error: "Mind adding an email so I can write back?" });
  }
  if (!message || message.length > 5000) return reply(400, { error: "Don't forget your message!" });
  if (!RESEND_API_KEY) return reply(500, { error: "Email sending isn't set up yet." });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: profile } = await db.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if (!profile) return reply(404, { error: "Hmm, couldn't find this link." });

  const hourAgo = new Date(Date.now() - 3600_000).toISOString();
  const [{ count: ownerCount }, { count: senderCount }] = await Promise.all([
    db.from("sends").select("id", { count: "exact", head: true }).eq("profile_id", profile.id).gte("created_at", hourAgo),
    db.from("sends").select("id", { count: "exact", head: true }).eq("sender_email", email.toLowerCase()).gte("created_at", hourAgo),
  ]);
  if ((ownerCount ?? 0) >= PER_OWNER_PER_HOUR || (senderCount ?? 0) >= PER_SENDER_PER_HOUR) {
    return reply(429, { error: "Lots of messages right now. Please try again in a bit." });
  }

  const { data: owner } = await db.auth.admin.getUserById(profile.id);
  if (!owner?.user?.email) return reply(404, { error: "Hmm, couldn't find this link." });

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [owner.user.email],
      reply_to: email,
      subject: `Reachouts: message from ${email}`,
      text: `${message}\n\n—\nSent from your Reachouts link by ${email}. Hit reply to answer them.`,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return reply(502, { error: "Hmm, that didn't go through. Mind trying again?" });
  }

  await db.from("sends").insert({ profile_id: profile.id, sender_email: email.toLowerCase() });
  return reply(200, { ok: true });
});
