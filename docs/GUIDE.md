# Advice Tab Guide

## How it works

Advice Tab is one static page: `index.html`, `styles.css`, `script.js` and `config.js`. When someone submits the form, the page sends it to [Web3Forms](https://web3forms.com), and Web3Forms emails it to you. The email's reply-to is the sender's address, so you can reply straight from your inbox.

## 1. Get a Web3Forms access key

1. Go to https://web3forms.com and enter the email address where you want messages to arrive.
2. They email you an access key. It looks like a UUID.
3. Open `config.js` and replace `YOUR_WEB3FORMS_ACCESS_KEY` with that key.

Web3Forms keys are designed to sit in public front-end code, so committing the key is fine. The key can only send email to you.

## 2. Try it locally

```bash
python3 -m http.server 8791
```

Open http://localhost:8791, fill in the form and press **Send**. You should see "Sent. Thanks…" on the page and get an email titled **Advice Tab: message from <their email>** within a minute. Check spam the first time.

Until a key is set, pressing Send shows "This page isn't set up yet…". That's expected.

## 3. Put it online with GitHub Pages

1. Push this folder to a GitHub repo, for example `advice-tab`.
2. In the repo, go to **Settings → Pages**, set **Source: Deploy from a branch** and **Branch: main / (root)**, then save.
3. After a minute your link is live at `https://<your-username>.github.io/advice-tab/`.

Share that link anywhere: your email signature, bio, LinkedIn or website.

## Letting anyone make their own

Anyone can open `make.html` (the **Make your own Advice Tab →** link at the bottom of every page), paste their own free Web3Forms key and first name, and get a personal link:

```
https://amalmehta.github.io/advice-tab/?n=Sam&k=<their-key>
```

That link says "Hi, I'm Sam 👋" and sends messages to Sam's inbox, not yours. There are no accounts and nothing is stored: the key and name live in the link itself. Web3Forms keys are meant to be public, so having the key in the link is fine.

Your own link (no `?k=`) keeps using the key in `config.js`.

## Customizing

| What | Where |
| --- | --- |
| Heading and intro line | `heading` and `lede` in `config.js` |
| Colors | the variables at the top of `styles.css` (light and dark) |
| Email subject | `subject` in `script.js` |

## Spam

The form has a hidden honeypot field. Bots that fill it in are dropped silently. Web3Forms also runs its own spam filtering. If spam gets through, you can turn on hCaptcha in the Web3Forms dashboard.

## Troubleshooting

- **"Invalid access key"**: the key in `config.js` is wrong or has a typo.
- **"Couldn't reach the server"**: the visitor is offline or an ad blocker is blocking `api.web3forms.com`.
- **No email arrives**: check spam, and check that the key was created with the right address.
