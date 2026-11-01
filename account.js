(function () {
  const cfg = window.REACHOUTS;
  if (cfg.supabaseUrl.startsWith("YOUR_")) {
    document.getElementById("loading").textContent = "Sign-ups open very soon. Check back in a bit! 🙂";
    return;
  }
  // Implicit flow so the emailed sign-in link works even when opened on another device.
  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { flowType: "implicit" } });

  const sections = ["loading", "signin", "setup", "done"].map((id) => document.getElementById(id));
  const signinForm = document.getElementById("signin-form");
  const setupForm = document.getElementById("setup-form");
  const editForm = document.getElementById("edit-form");
  let user = null;

  function go(id) {
    for (const s of sections) s.hidden = s.id !== id;
  }

  function show(form, text, kind) {
    const status = form.querySelector(".status");
    status.textContent = text;
    status.className = `status ${kind || ""}`;
  }

  function linkFor(handle) {
    const url = new URL("./", location.href);
    url.search = new URLSearchParams({ u: handle }).toString();
    return url.toString();
  }

  async function render() {
    if (!user) return go("signin");

    const { data: profile } = await sb.from("profiles").select("handle, display_name, headline, intro").eq("id", user.id).maybeSingle();
    if (!profile) return go("setup");

    const link = linkFor(profile.handle);
    document.getElementById("link").value = link;
    document.getElementById("open").href = link;
    document.getElementById("inbox").textContent = user.email;
    editForm.name.value = profile.display_name;
    editForm.headline.value = profile.headline;
    editForm.intro.value = profile.intro;
    go("done");
    loadLog();
  }

  // Everyone who reached out, newest first.
  let log = [];
  async function loadLog() {
    const { data } = await sb.from("messages")
      .select("sender_email, message, created_at")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1000);
    log = data || [];

    const list = document.getElementById("log-list");
    list.replaceChildren();
    for (const m of log) {
      const item = document.createElement("li");
      const top = document.createElement("div");
      top.className = "log-top";
      const who = document.createElement("strong");
      who.textContent = m.sender_email;
      const when = document.createElement("span");
      when.className = "log-when";
      when.textContent = new Date(m.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      const replyLink = document.createElement("a");
      replyLink.textContent = "Reply";
      replyLink.href = `mailto:${m.sender_email}?subject=${encodeURIComponent("Re: your message on Reachouts")}`;
      top.append(who, when, replyLink);
      const text = document.createElement("p");
      text.className = m.message ? "log-text" : "log-text missing";
      text.textContent = m.message || "Sent before the log started, so the message is only in your inbox.";
      item.append(top, text);
      list.append(item);
    }
    document.getElementById("log-count").textContent = log.length ? `(${log.length})` : "";
    document.getElementById("log-empty").hidden = log.length > 0;
    document.getElementById("download").hidden = log.length === 0;
  }

  document.getElementById("download").addEventListener("click", () => {
    // Quote every cell, and defuse anything a spreadsheet would treat as a formula.
    const cell = (v) => {
      let s = String(v ?? "");
      if (/^[=+\-@]/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };
    const rows = [["Date", "Email", "Message"], ...log.map((m) => [new Date(m.created_at).toISOString(), m.sender_email, m.message])];
    const csv = rows.map((r) => r.map(cell).join(",")).join("\r\n");
    const a = document.createElement("a");
    // The BOM makes Excel read the file as UTF-8.
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = "Reachouts Log.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  sb.auth.onAuthStateChange((_event, session) => {
    const next = session?.user ?? null;
    if (next?.id === user?.id && sections[0].hidden) return;
    user = next;
    // Clean the sign-in tokens out of the address bar.
    if (location.hash.includes("access_token")) history.replaceState(null, "", location.pathname);
    setTimeout(render); // don't call Supabase inside the auth callback
  });

  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!signinForm.checkValidity()) return show(signinForm, "That email doesn't look quite right.", "error");

    const button = signinForm.querySelector("button");
    button.disabled = true;
    show(signinForm, "Sending…");
    const { error } = await sb.auth.signInWithOtp({
      email: signinForm.email.value.trim(),
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    button.disabled = false;
    if (error) show(signinForm, "Hmm, that didn't work. Mind trying again in a minute?", "error");
    else show(signinForm, "Check your inbox 📬 Click the link in the email to sign in.", "ok");
  });

  // Suggest a handle from the name until the person edits the handle themselves.
  let handleEdited = false;
  setupForm.handle.addEventListener("input", () => (handleEdited = true));
  setupForm.name.addEventListener("input", () => {
    if (handleEdited) return;
    setupForm.handle.value = setupForm.name.value.toLowerCase().normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30);
  });

  setupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setupForm.name.value = setupForm.name.value.trim();
    setupForm.handle.value = setupForm.handle.value.trim().toLowerCase();
    if (!setupForm.checkValidity()) {
      const bad = setupForm.querySelector(":invalid");
      return show(setupForm, bad.name === "name" ? "What should we call you?" : "Links can use 3–30 lowercase letters, numbers and dashes.", "error");
    }

    const button = setupForm.querySelector("button");
    button.disabled = true;
    const { error } = await sb.from("profiles").insert({
      id: user.id,
      display_name: setupForm.name.value,
      headline: setupForm.headline.value.trim(),
      intro: setupForm.intro.value.trim(),
      handle: setupForm.handle.value,
    });
    button.disabled = false;
    if (!error) return render();
    show(setupForm, error.code === "23505" ? "That link's taken. Try another one?" : "Hmm, that didn't work. Mind trying again?", "error");
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    editForm.name.value = editForm.name.value.trim();
    if (!editForm.checkValidity()) return show(editForm, "What should we call you?", "error");

    const button = editForm.querySelector("button");
    button.disabled = true;
    const { error } = await sb.from("profiles")
      .update({
        display_name: editForm.name.value,
        headline: editForm.headline.value.trim(),
        intro: editForm.intro.value.trim(),
      })
      .eq("id", user.id);
    button.disabled = false;
    show(editForm, error ? "Hmm, that didn't save. Mind trying again?" : "Saved ✓", error ? "error" : "ok");
  });

  const copy = document.getElementById("copy");
  copy.addEventListener("click", async () => {
    const link = document.getElementById("link");
    try {
      await navigator.clipboard.writeText(link.value);
    } catch {
      link.select();
      document.execCommand("copy");
    }
    copy.textContent = "Copied!";
    setTimeout(() => (copy.textContent = "Copy link"), 1500);
  });

  document.getElementById("signout").addEventListener("click", async (e) => {
    e.preventDefault();
    await sb.auth.signOut();
  });
})();
