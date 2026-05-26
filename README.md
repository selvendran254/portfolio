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

### Step 1 — Create GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `portfolio` (or `selvendran254.github.io` for main site URL)
3. Public repo → Create

### Step 2 — Push code

```bash
cd /home/dell/Documents/profile
git init
git add .
git commit -m "Add glassmorphism portfolio"
git branch -M main
git remote add origin https://github.com/selvendran254/portfolio.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Repo → **Settings** → **Pages**
2. **Source:** GitHub Actions
3. Push to `main` — workflow auto deploys

### Your live URL

| Repo name | Live URL |
|-----------|----------|
| `portfolio` | https://selvendran254.github.io/portfolio/ |
| `selvendran254.github.io` | https://selvendran254.github.io/ |

## Project Structure

```
profile/
├── index.html
├── css/style.css
├── js/main.js
├── assets/
│   ├── favicon.svg
│   └── selvendran.pdf
└── .github/workflows/deploy.yml
```

## Contact

- Email: selvendranapalanisamy@gmail.com
- GitHub: [selvendran254](https://github.com/selvendran254)
- LinkedIn: [selvendran-p](https://linkedin.com/in/selvendran-p)
