# Thunder Street Ministry website

A Jekyll site built for GitHub Pages. GitHub builds it for you on every commit — there is nothing to install.

## Put it online (about 10 minutes)

1. Create a new repository on GitHub, e.g. `thunder-street-ministry`.
2. Upload everything in this folder (drag the files into the repo page, or use `git push`).
3. In the repo, open **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. Open `_config.yml` and set:
   - `url` to `https://YOUR-USERNAME.github.io`
   - `baseurl` to `/thunder-street-ministry` (your repo name), or `""` if the repo is named `YOUR-USERNAME.github.io` or you use a custom domain
   - `contact_email` to the address families should write to
5. Wait a minute, then visit `https://YOUR-USERNAME.github.io/thunder-street-ministry/`.

**Custom domain:** add it under Settings → Pages → Custom domain, set `url` to it and `baseurl` to `""`.

## Where the content lives

| What | File |
|---|---|
| Site name, email, Home verse | `_config.yml` |
| Home page | `index.html` |
| About (Goals, Methods, Mission statement) | `about.html` |
| Cases landing page | `cases/index.html` (builds itself from the case files) |
| Each case | `_cases/firstname-lastname.md` |
| Resources links | `_data/resources.yml` |
| Colors, type, layout | `assets/css/main.css` (colors are at the top) |

Still sample content: the Training and Recommended Reading links. The four organizations under Resources are real; confirm you want to list them.

## Under construction mode

`under_construction: true` in `_config.yml` shows the "Under construction" screen as the home page, featuring the case named in `featured_case`, and hides the About / Cases / Resources menu. Case pages still work. When the full site is ready, set it to `false` and commit.

## Connecting the contact form

GitHub Pages can't receive form submissions on its own, so the form uses Formspree (free for up to 50 messages a month).

1. Sign up at https://formspree.io with the email address that should receive messages.
2. Create a new form and copy its endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `contact_form_endpoint` in `_config.yml` and commit.
4. Send yourself a test message from the live site. Formspree asks you to confirm the first one.

Until the endpoint is set, the form opens the visitor's email app with their message already filled in.

## Adding a case

1. Copy `templates/case-template.md` into the `_cases` folder and rename it, e.g. `_cases/sarah-smith.md`. The file name becomes the web address (`/cases/sarah-smith/`).
2. Fill in the fields; the comments in the template explain each one. `status` must be `Missing`, `Murdered` or `Unidentified`, which drives the filter on the Cases page. `order` sets the position in the grid.
3. Put the portrait in `assets/img/cases/` (a 4:5 portrait crop, around 800×1000px, works best) and point `photo:` at it.
4. **Overview tab** = the `timeline:` list plus everything written below the closing `---`. **Case photos tab** = the `photos:` list; add `sensitive: true` to blur a photo until the viewer chooses to see it. **Research tab** = the `research:` links and optional `research_notes:`.
5. Commit. The case appears on the Cases page automatically.

If a value contains `#` (like "Campsite #2"), wrap it in double quotes.

`_cases/jaryd-atadero.md` is a complete real example.

## Previewing on your own computer (optional)

On Fedora: `sudo dnf install ruby ruby-devel gcc-c++ make`, then in this folder `bundle install` and `bundle exec jekyll serve`. Open http://localhost:4000/thunder-street-ministry/.

## Why not WordPress

GitHub Pages only serves static files; WordPress needs PHP and a database, so it cannot run there. Jekyll is the system GitHub Pages runs natively. If you later want a WordPress-style editing screen, a free Git-based CMS such as Decap CMS or Pages CMS can sit on top of this repo without changing the design.
