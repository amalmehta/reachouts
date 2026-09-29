# Advice Tab

<p>
  <img src="docs/Advice%20Tab%20%E2%80%93%20Light.png" alt="Advice Tab in light mode" width="48%">
  <img src="docs/Advice%20Tab%20%E2%80%93%20Dark.png" alt="Advice Tab in dark mode" width="48%">
</p>

**A shareable link where people can send you reachouts and questions, delivered straight to your email.**

```mermaid
flowchart LR
  A[Visitor opens your link] --> B[Fills in name, email,<br>type and message]
  B --> C[Web3Forms]
  C --> D[Your inbox]
  D -- Reply goes to the visitor --> A
```

<img src="docs/Advice%20Tab%20%E2%80%93%20Phone.png" alt="Advice Tab on a phone" width="220" align="right">

- One static page with no server to run
- Your email address is never shown on the page
- Light and dark mode, and it works on phones
- Spam honeypot built in

Setup, deployment and customization are in **[docs/GUIDE.md](docs/GUIDE.md)**.
