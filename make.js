(function () {
  const form = document.getElementById("make-form");
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  const link = document.getElementById("link");
  const open = document.getElementById("open");
  const copy = document.getElementById("copy");

  function show(text, kind) {
    status.textContent = text;
    status.className = kind || "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.key.value = form.key.value.trim();
    form.name.value = form.name.value.trim();

    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      show(bad.name === "name" ? "What should we call you?" : "That doesn't look like a Web3Forms key. It should look like xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.", "error");
      bad.focus();
      return;
    }

    const url = new URL("./", location.href);
    url.search = new URLSearchParams({ n: form.name.value, k: form.key.value }).toString();

    link.value = url.toString();
    open.href = url.toString();
    result.classList.add("show");
    show("Here's your link! Send yourself a test message to make sure it works.", "ok");
  });

  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link.value);
    } catch {
      link.select();
      document.execCommand("copy");
    }
    copy.textContent = "Copied!";
    setTimeout(() => (copy.textContent = "Copy link"), 1500);
  });
})();
