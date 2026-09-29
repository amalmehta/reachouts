# Reachouts

<p>
  <img src="docs/Reachouts%20%E2%80%93%20Light.png" alt="A Reachouts page in light mode" width="48%">
  <img src="docs/Reachouts%20%E2%80%93%20Dark.png" alt="A Reachouts page in dark mode" width="48%">
</p>

**Your own friendly link where people can send you questions. Messages land in your inbox, and you just hit reply.**

```mermaid
flowchart LR
  A[You sign in with your email] --> B[Pick a link<br>reachouts/?u=you]
  B --> C[Share it on LinkedIn]
  C --> D[Visitor writes a message]
  D --> E[Lands in your inbox]
  E -- Hit reply --> D
```

<img src="docs/Reachouts%20%E2%80%93%20Phone.png" alt="A Reachouts page on a phone" width="220" align="right">

- Anyone can sign up: email sign-in link, no password
- Add a short headline and your own intro to your page
- Visitors just type their email and a message
- Your email address is never shown to visitors
- Replies go straight back to the sender
- Rate limits and a spam honeypot built in
- Light and dark mode, and it works on phones

<br clear="right">

<img src="docs/Reachouts%20%E2%80%93%20Get%20Your%20Link.png" alt="Getting your own Reachouts link" width="48%">

Setup, deployment and how it works are in **[docs/GUIDE.md](docs/GUIDE.md)**.
