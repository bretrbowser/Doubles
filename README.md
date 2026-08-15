# Doubles IQ

A tennis doubles positioning trainer for phones. Fifteen coached scenarios across
three levels. A point plays out on a court, the ball freezes at the moment of
decision, and you tap where you should be.

You are always the **gold** player at the bottom of the screen. Your partner is
**blue**. The opponents are **red**.

No accounts, no server, no build step — it is three files of plain HTML, CSS and
JavaScript. Progress is stored in the browser on each person's own phone.

---

## Part 1 — Getting this onto the web (start here)

You have never done this before, so here is the whole thing, in order. It takes
about five minutes and there is nothing you can break.

### What already exists

Some vocabulary first, because the rest of this makes no sense without it:

| Word | What it actually means |
|---|---|
| **Repository** (repo) | A folder that GitHub stores for you, with a full history of every change. Yours is `bretrbowser/Doubles`. |
| **Branch** | A parallel copy of the folder where work happens before it becomes official. The official one is usually called `main`. |
| **Commit** | A saved snapshot with a note explaining what changed. |
| **Push** | Uploading your commits from your computer to GitHub. |
| **Pull request** (PR) | A proposal to merge one branch into another, so you can look it over first. |
| **GitHub Pages** | A free web host built into GitHub. It serves the files in your repo as a real website. |

The code for this app is already committed and pushed to a branch called
`claude/tennis-doubles-coach-app-veb60y`. Nothing is on `main` yet.

### Step 1 — Get the code onto `main`

Go to <https://github.com/bretrbowser/Doubles>. GitHub will show a yellow banner
about the recently pushed branch with a **Compare & pull request** button. Click it.

If you don't see the banner, click the **Pull requests** tab, then **New pull
request**, and set it to compare `main` ← `claude/tennis-doubles-coach-app-veb60y`.

On the next screen click **Create pull request**, then **Merge pull request**,
then **Confirm merge**. The code is now on `main`. (`main` doesn't exist yet? Then
open the branch dropdown on the repo home page, pick the `claude/...` branch, and
GitHub will offer to make it the default — that works too.)

### Step 2 — Turn on GitHub Pages

1. In your repo, click **Settings** (top right of the repo, not your account settings).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions** from the dropdown.

That's the whole configuration. There is a file in this repo at
`.github/workflows/deploy.yml` that does the publishing automatically.

### Step 3 — Watch it deploy

Click the **Actions** tab. You'll see a job called *Deploy to GitHub Pages*
running. It takes about a minute. When the dot turns green, your site is live at:

```
https://bretrbowser.github.io/Doubles/
```

Send that link to your friends. On an iPhone they can open it in Safari, tap the
share button, and choose **Add to Home Screen** — it then behaves like an app,
full screen, no browser chrome.

### Step 4 — Every change from now on

Any time anything is pushed to `main`, that workflow runs again and the live site
updates by itself. You don't have to do anything else, ever.

> **If Step 3 fails:** the most common cause is skipping Step 2, or picking
> "Deploy from a branch" instead of "GitHub Actions". Go back and check the
> Source dropdown.

---

## Part 2 — Working on it

### Trying changes without touching the live site

Open `index.html` in any browser by double-clicking it. Everything works
offline — there is no server and no build step, which is the entire reason the
app is written this way.

### Editing the coaching content

All fifteen scenarios live in **`scenarios.js`**, and that is the file worth
knowing. Everything else is plumbing. Each scenario looks like this:

```js
{
  id: 'e1', level: 'easy',
  title: 'Home Base at the Net',
  role: "You are the server's partner",
  situation: 'Shown once, before the first decision.',
  takeaway: 'Shown on the summary screen at the end.',
  steps: [ /* one entry per decision */ ]
}
```

And each step:

```js
{
  kind: 'move',            // 'move' = tap where YOU go; 'hit' = tap where the ball lands
  prompt: 'The question.',
  you:     { x: -7, y: 9 },      // where everyone is standing at the freeze
  partner: { x:  7, y: 40.5 },
  opp1:    { x:-10, y: -41 },
  opp2:    { x:  7, y: -21 },
  ballPath: [ /* points the ball flies through before it freezes */ ],
  target:  { x: -7, y: 9 },      // the coach's answer
  perfect: 3,                    // full marks within 3 feet
  good:    7.5,                  // partial credit out to 7.5 feet
  keyIdea: 'The one-line hint.',
  coach:   'The explanation shown after they answer.'
}
```

### The coordinate system

Every number is **real feet on a real court**.

```
              OPPONENTS' BASELINE   y = -39
                       |
     service line ---- | ----       y = -21
                       |
=========== NET ==================  y =   0
                       |
     service line ---- | ----       y = +21
                       |
              YOUR BASELINE         y = +39

  x = -18        x = 0        x = +18
  (doubles       (center      (doubles
   sideline)      line)        sideline)

  Singles sidelines are at x = ±13.5.
```

Your team always plays the bottom half. **Your deuce court is `x > 0`** and your
ad court is `x < 0` — stand at your baseline facing the net and your right hand
points to screen-right. For the opponents it is mirrored: their deuce court is
`x < 0`, which is why a deuce-court serve travels diagonally from `x = +7` down
to a landing spot around `x = -6`.

Behind-the-baseline positions use values past ±39 (a server stands at `y = 40.5`).

### Adding a scenario

Add an object to the `SCENARIOS` array in `scenarios.js` with a new `id` and a
`level` of `easy`, `medium` or `hard`. It appears in the app automatically — the
level screens are built from that array, and the star totals adjust themselves.

### The rest of the files

| File | What it does |
|---|---|
| `index.html` | All four screens (home, level, play, summary) and the static court SVG. |
| `styles.css` | Everything visual. |
| `court.js` | Draws players, animates the ball, converts a screen tap into court feet. |
| `scenarios.js` | **The coaching content.** |
| `app.js` | Screen flow, scoring, star ratings, saved progress. |
| `.github/workflows/deploy.yml` | Publishes the site on every push. |

### How scoring works

Distance from your tap to the coach's spot, in feet. Inside `perfect` is 100.
Between `perfect` and `good` it slides from 100 down to 60. Beyond that it falls
away to zero. Taking a hint caps that step at 75.

A scenario's score is the average of its steps: 88+ earns three stars, 68+ two,
45+ one. Medium unlocks after three Easy scenarios are cleared, Hard after three
Medium — or tick **Unlock everything** on the home screen and ignore all that.

---

## Ideas worth building next

- A **wrong-answer library**: when someone taps a common mistake (hugging the
  alley, running to the center mark), say so by name instead of only scoring it.
- **Two-player mode** — pass the phone, compare scores on the same scenario.
- Let the user pick **which player they are** in a scenario, so the same point can
  be drilled from all four positions.
- **Left-handed partner** variants; the middle-forehand rules invert.
- A **scenario editor** page, so you can author points without editing JavaScript.
