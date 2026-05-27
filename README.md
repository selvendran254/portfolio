# Selvendran Palanisamy — Portfolio

Glassmorphism portfolio for Embedded Systems & IoT Developer.

## Live Demo

After deploy: `https://selvendran254.github.io/portfolio/`  
(or your repo name — see steps below)

## Local Run

```bash
cd profile
python3 -m http.server 8080
```

Open: http://localhost:8080

## Deploy to GitHub Pages (Free)

### Step 1 — Push code

```bash
cd /home/dell/Documents/profile
git add .
git commit -m "Your message"
git push origin main
```

### Step 2 — Enable GitHub Pages

1. Repo → **Settings** → **Pages**
2. **Source:** GitHub Actions
3. Push to `main` — workflow auto deploys

### Your live URL

| Repo name | Live URL |
|-----------|----------|
| `portfolio` | https://selvendran254.github.io/portfolio/ |
| `selvendran254.github.io` | https://selvendran254.github.io/ |

## Contact Form (Email)

Portfolio form sends messages to your Gmail via [Web3Forms](https://web3forms.com).

1. Open https://web3forms.com
2. Enter `selvendranapalanisamy@gmail.com`
3. Copy the **Access Key** shown on screen
4. Paste it in `js/config.js` → `WEB3FORMS_ACCESS_KEY`

No activation email wait — the key appears instantly on the website.

## Project Structure

```
profile/
├── index.html
├── css/style.css
├── js/
│   ├── main.js
│   └── certificates.js
├── assets/
│   ├── favicon.svg
│   ├── og-image.svg
│   └── selvendran.pdf
└── .github/workflows/deploy.yml
```

## Contact

- Email: selvendranapalanisamy@gmail.com
- GitHub: [selvendran254](https://github.com/selvendran254)
- LinkedIn: [selvendran-p](https://linkedin.com/in/selvendran-p)
