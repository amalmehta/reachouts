(async function () {
  const cfg = window.REACHOUTS;
  const ready = !cfg.supabaseUrl.startsWith("YOUR_");
  const sb = ready && window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  const form = document.getElementById("reach-form");
  const status = document.getElementById("status");
  const send = document.getElementById("send");
  const postcard = document.getElementById("postcard");
  const handle = (new URLSearchParams(location.search).get("u") || "").trim().toLowerCase();

  function show(text, kind) {
    status.textContent = text;
    status.className = kind || "";
  }

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // One of "sending", "sent", "returning", "failed"; the button's CSS animates each
  function setButton(state) {
    send.classList.remove("sending", "sent", "returning", "failed");
    send.classList.add(state);
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
  document.getElementById("to-name").textContent = data[0].display_name;
  if (data[0].headline) {
    const headline = document.getElementById("headline");
    headline.textContent = data[0].headline;
    headline.hidden = false;
  }
  if (data[0].intro) document.getElementById("lede").textContent = data[0].intro;
  document.getElementById("tab").hidden = false;
  document.getElementById("make-own").hidden = false;

  // Tap-to-start ideas: put an opening line in the note, but never over what someone wrote
  const message = form.elements.message;
  const starters = [...document.querySelectorAll("[data-starter]")];
  function pressStarter(chip) {
    starters.forEach((b) => b.setAttribute("aria-pressed", b === chip));
  }
  pressStarter(null);
  for (const chip of starters) {
    chip.addEventListener("click", () => {
      const untouched = !message.value.trim() || starters.some((b) => b.dataset.starter === message.value);
      if (untouched) {
        message.value = chip.dataset.starter;
        pressStarter(chip);
      }
      message.focus();
      message.setSelectionRange(message.value.length, message.value.length);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      show(bad.name === "email" ? "Mind adding an email so I can write back?" : "Don't forget your message!", "error");
      bad.focus();
      return;
    }

    const fields = Object.fromEntries(new FormData(form));
    let sent = false;
    send.disabled = true;
    setButton("sending");
    show("Sending…");
    try {
      // Give the plane time to finish its flight even when the reply is instant
      const [{ error }] = await Promise.all([
        sb.functions.invoke("send-message", {
          body: { handle, email: fields.email, message: fields.message, botcheck: !!fields.botcheck },
        }),
        wait(reduceMotion.matches ? 0 : 700),
      ]);
      if (error) {
        const body = await error.context?.json?.().catch(() => null);
        show(body?.error || "Hmm, couldn't connect. Check your internet and try again?", "error");
      } else {
        sent = true;
        setButton("sent");
        postcard.classList.add("posted");
        show("Got it, thanks for reaching out! I'll write back soon. 🙂", "ok");
        // Clear the card while it's out of sight, mid-flight
        await wait(reduceMotion.matches ? 0 : 360);
        form.reset();
        pressStarter(null);
      }
    } finally {
      if (sent) {
        await wait(2400);
        postcard.classList.remove("posted");
        setButton("returning");
      } else {
        setButton("failed");
      }
      send.disabled = false;
    }
  });
})();
