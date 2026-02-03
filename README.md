# khushi

A tiny single-file GitHub Pages site: a personalized "Happy Birthday — Saurabh!" static page (drop-in `index.html`).

Features
- Romantic Hinglish birthday message for *Saurabh* with lightweight confetti animation.
- Soft Unsplash background (replaceable in the CSS).
- Background music via YouTube (unmute/mute control) with a graceful fallback.
- Mobile-friendly and accessible (ARIA + polite live announcement).

Usage — publish with GitHub Pages 🚀
1. Ensure `index.html` is in the repository root (this repo includes it).
2. In your repository: Settings → Pages → Source: `main` branch, folder `/ (root)` → Save.
3. Wait ~1–2 minutes, then visit: `https://<your-username>.github.io/<repo-name>/`.

Customize
- Change the displayed name and message inside `index.html` (edit the `<h1>` and the paragraph with id `message`).
- Replace the background image by editing the `background-image: url("...")` in the CSS — the site now also uses an animated hearts canvas for a popping/falling hearts effect (toggleable by `prefers-reduced-motion`). To change or disable:
  - Remove or hide the `#hearts` canvas in `index.html` to disable animation.
  - Or change the CSS `background-image` URL to replace the static background behind the animation.
- Swap the song by changing `VIDEO_ID` in the script (use the YouTube watch?v=... id).

Slideshow (cakes & wishes)
- The site now includes two accessible slideshows: *Cakes* and *Birthday wishes*.
- Images are loaded from Unsplash (free-to-use photos). To replace images with your own or images found on Google:
  - Prefer photos you own or that are explicitly licensed for reuse. If you use images from Google, verify the source and license before publishing.
  - To change images, edit the `src` attributes in the `index.html` slideshow `<img>` elements.
  - For quick replacements, use Unsplash URLs (`https://images.unsplash.com/...`) or the Unsplash Source API (`https://source.unsplash.com/`) for themed/random images.

Two-page flow (wish → questions)
- The welcome/wish UI remains on `index.html`. The interactive Questions section is moved to `questions.html` so guests can answer on a separate page.
- From the wish page click **Answer the questions** to open `questions.html` (answers are saved locally in the browser and can be exported).

License & notes
- Single-file pages, no build required. Designed for quick GitHub Pages hosting.
- Images in the example come from Unsplash — review their license if you need attribution for a particular photo.
- If you want me to replace the placeholders with specific Google images you provide (or upload), I can do that and ensure proper attribution.
- If you want a ZIP or a different audio approach (direct MP3), tell me and I can prepare it.
