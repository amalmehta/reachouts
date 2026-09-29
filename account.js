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

    const { data: profile } = await sb.from("profiles").select("handle").eq("id", user.id).maybeSingle();
    if (!profile) return go("setup");

    const link = linkFor(profile.handle);
    document.getElementById("link").value = link;
    document.getElementById("open").href = link;
    document.getElementById("inbox").textContent = user.email;
    go("done");
  }

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
      handle: setupForm.handle.value,
    });
    button.disabled = false;
    if (!error) return render();
    show(setupForm, error.code === "23505" ? "That link's taken. Try another one?" : "Hmm, that didn't work. Mind trying again?", "error");
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
