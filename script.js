(function () {
  const cfg = window.ADVICE_TAB || {};
  const form = document.getElementById("advice-form");
  const status = document.getElementById("status");
  const send = document.getElementById("send");

  if (cfg.heading) {
    document.getElementById("heading").textContent = cfg.heading;
    document.title = cfg.heading;
  }
  if (cfg.lede) document.getElementById("lede").textContent = cfg.lede;

  function show(text, kind) {
    status.textContent = text;
    status.className = kind || "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      show(bad.name === "email" ? "Please enter a valid email." : "Please fill in every field.", "error");
      bad.focus();
      return;
    }
    if (!cfg.accessKey || cfg.accessKey.startsWith("YOUR_")) {
      show("This page isn't set up yet: add a Web3Forms access key in config.js.", "error");
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return; // silently drop bot submissions

    const payload = {
      access_key: cfg.accessKey,
      subject: `Advice Tab: ${data.type} from ${data.name}`,
      from_name: "Advice Tab",
      name: data.name,
      email: data.email,
      type: data.type,
      message: data.message,
      botcheck: false,
    };

    send.disabled = true;
    show("Sending…");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        form.reset();
        show("Sent. Thanks — I'll get back to you by email.", "ok");
      } else {
        show(json.message || "Something went wrong. Please try again.", "error");
      }
    } catch {
      show("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      send.disabled = false;
    }
  });
})();
