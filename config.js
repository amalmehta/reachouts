// Connection settings for the Reachouts backend. See docs/GUIDE.md.
// Both values are public by design: the anon key only allows what the database rules permit.
const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

window.REACHOUTS = isLocal
  ? {
      // The local copy of the backend started by `supabase start`.
      supabaseUrl: "http://127.0.0.1:54321",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    }
  : {
      // From your Supabase project: Settings → API.
      supabaseUrl: "YOUR_SUPABASE_URL",
      supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
    };
