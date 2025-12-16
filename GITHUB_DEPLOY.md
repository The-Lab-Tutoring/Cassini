# GitHub Deployment Guide for Cassini Whiteboard

## Option 1: GitHub Pages (Automated)

### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 2: Add deploy script to package.json

Add this to your `"scripts"` section:

```json
"deploy": "npm run build && gh-pages -d dist"
```

### Step 3: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Cassini Whiteboard"
```

### Step 4: Create GitHub Repository

1. Go to <https://github.com/new>
2. Name it: `cassini-whiteboard`
3. Don't initialize with README (you already have one)
4. Click "Create repository"

### Step 5: Connect and Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/cassini-whiteboard.git
git branch -M main
git push -u origin main
```

### Step 6: Deploy to GitHub Pages

```bash
npm run deploy
```

Your app will be live at: `https://YOUR_USERNAME.github.io/cassini-whiteboard/`

---

## Option 2: GitHub Pages (Manual)

### Step 1: Create Repository

Same as Option 1, steps 3-5

### Step 2: Create gh-pages branch

```bash
git checkout --orphan gh-pages
git rm -rf .
```

### Step 3: Copy dist contents

```bash
cp -r dist/* .
git add .
git commit -m "Deploy"
git push origin gh-pages
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `gh-pages` / `root`
5. Save

---

## Option 3: GitHub + Vercel (Recommended for Production)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Cassini Whiteboard"
git remote add origin https://github.com/YOUR_USERNAME/cassini-whiteboard.git
git push -u origin main
```

### Step 2: Deploy with Vercel

1. Go to <https://vercel.com>
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

Your app will be live at: `https://cassini-whiteboard.vercel.app`

---

## Option 4: GitHub + Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy with Netlify

1. Go to <https://app.netlify.com>
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

Your app will be live at: `https://YOUR_SITE_NAME.netlify.app`

---

## Quick Commands Summary

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Initialize git
git init
git add .
git commit -m "Cassini Whiteboard"

# 3. Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/cassini-whiteboard.git
git push -u origin main

# 4. Deploy to GitHub Pages
npm run deploy
```

---

## .gitignore (Important!)

Make sure you have a `.gitignore` file:

```
node_modules/
dist/
*.log
.DS_Store
.env
```

Note: We ignore `dist/` in git because it's built automatically during deployment.

---

## Troubleshooting

**Issue:** Blank page on GitHub Pages  
**Solution:** Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/cassini-whiteboard/'  // Add this line with your repo name
})
```

Then rebuild and redeploy:

```bash
npm run build
npm run deploy
```

---

## Which Option Should You Choose?

- **GitHub Pages**: Free, simple, good for personal projects
- **Vercel**: Free, automatic deployments, best performance
- **Netlify**: Free, easy setup, great for teams

**Recommendation:** Use Vercel or Netlify for the best experience!
