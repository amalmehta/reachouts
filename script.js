(function () {
  const cfg = window.ADVICE_TAB || {};
  const form = document.getElementById("advice-form");
  const status = document.getElementById("status");
  const send = document.getElementById("send");

  if (cfg.heading) document.getElementById("heading").textContent = cfg.heading;
  if (cfg.lede) document.getElementById("lede").textContent = cfg.lede;

  function show(text, kind) {
    status.textContent = text;
    status.className = kind || "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      show(bad.name === "email" ? "Mind adding an email so I can write back?" : "Don't forget your message!", "error");
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
      subject: `Advice Tab: message from ${data.email}`,
      from_name: "Advice Tab",
      email: data.email,
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
        show("Got it, thanks for reaching out! I'll write back soon. 🙂", "ok");
      } else {
        show(json.message || "Hmm, that didn't go through. Mind trying again?", "error");
      }
    } catch {
      show("Hmm, couldn't connect. Check your internet and try again?", "error");
    } finally {
      send.disabled = false;
    }
  });
})();
