(async function () {
  const cfg = window.REACHOUTS;
  const ready = !cfg.supabaseUrl.startsWith("YOUR_");
  const sb = ready && window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  const form = document.getElementById("reach-form");
  const status = document.getElementById("status");
  const send = document.getElementById("send");
  const handle = (new URLSearchParams(location.search).get("u") || "").trim().toLowerCase();

  function show(text, kind) {
    status.textContent = text;
    status.className = kind || "";
  }

  function showHome(notFound) {
    if (notFound) {
      document.getElementById("home-heading").textContent = "Hmm, couldn't find that one 🤔";
      document.getElementById("home-lede").textContent =
        "This Reachouts link doesn't exist, or it may have a typo. Want one of your own?";
    }
    document.getElementById("home").hidden = false;
  }

  if (!handle || !ready) return showHome(!!handle);

  const { data, error } = await sb.rpc("public_profile", { h: handle });
  if (error || !data || !data.length) return showHome(true);

  document.getElementById("heading").textContent = `Hi, I'm ${data[0].display_name} 👋`;
  if (data[0].headline) {
    const headline = document.getElementById("headline");
    headline.textContent = data[0].headline;
    headline.hidden = false;
  }
  if (data[0].intro) document.getElementById("lede").textContent = data[0].intro;
  document.getElementById("tab").hidden = false;
  document.getElementById("make-own").hidden = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      show(bad.name === "email" ? "Mind adding an email so I can write back?" : "Don't forget your message!", "error");
      bad.focus();
      return;
    }

    const fields = Object.fromEntries(new FormData(form));
    send.disabled = true;
    show("Sending…");
    try {
      const { error } = await sb.functions.invoke("send-message", {
        body: { handle, email: fields.email, message: fields.message, botcheck: !!fields.botcheck },
      });
      if (error) {
        const body = await error.context?.json?.().catch(() => null);
        show(body?.error || "Hmm, couldn't connect. Check your internet and try again?", "error");
      } else {
        form.reset();
        show("Got it, thanks for reaching out! I'll write back soon. 🙂", "ok");
      }
    } finally {
      send.disabled = false;
    }
  });
})();
