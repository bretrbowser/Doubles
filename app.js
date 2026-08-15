/* ============================================================
   app.js — screens, scoring, progress.
   ============================================================ */

(function () {
  'use strict';

  var STORE_KEY = 'doublesiq.progress.v2';

  var state = {
    levelId: 'easy',
    scenario: null,
    stepIndex: 0,
    stepScores: [],
    pick: null,
    locked: false,
    hintUsed: false
  };

  var progress = load();

  /* ---------------- storage ---------------- */

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      var p = raw ? JSON.parse(raw) : {};
      if (!p.scores) p.scores = {};
      if (typeof p.unlockAll !== 'boolean') p.unlockAll = false;
      return p;
    } catch (e) {
      return { scores: {}, unlockAll: false };
    }
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* private mode */ }
  }

  /* ---------------- helpers ---------------- */

  function $(id) { return document.getElementById(id); }

  function byLevel(levelId) {
    return SCENARIOS.filter(function (s) { return s.level === levelId; });
  }

  function starsFor(score) {
    if (score >= 88) return 3;
    if (score >= 68) return 2;
    if (score >= 45) return 1;
    return 0;
  }

  function starHTML(n, total) {
    total = total || 3;
    var out = '';
    for (var i = 0; i < total; i++) out += i < n ? '★' : '<span class="off">★</span>';
    return out;
  }

  function levelStars(levelId) {
    return byLevel(levelId).reduce(function (sum, s) {
      var rec = progress.scores[s.id];
      return sum + (rec ? rec.stars : 0);
    }, 0);
  }

  function levelDone(levelId) {
    return byLevel(levelId).filter(function (s) {
      var rec = progress.scores[s.id];
      return rec && rec.stars >= 1;
    }).length;
  }

  function isLocked(levelId) {
    if (progress.unlockAll) return false;
    if (levelId === 'medium') return levelDone('easy') < 3;
    if (levelId === 'hard') return levelDone('medium') < 3;
    return false;
  }

  function scoreFor(d, perfect, good) {
    if (d <= perfect) return 100;
    if (d <= good) return Math.round(100 - 40 * (d - perfect) / (good - perfect));
    var far = good * 2.2;
    if (d <= far) return Math.max(0, Math.round(60 - 55 * (d - good) / (far - good)));
    return 0;
  }

  function gradeFor(score) {
    if (score >= 100) return { label: 'Perfect position', cls: 'g-perfect' };
    if (score >= 85) return { label: 'Excellent', cls: 'g-perfect' };
    if (score >= 60) return { label: 'Good — tighten it up', cls: 'g-good' };
    if (score >= 30) return { label: 'Off — read the coaching', cls: 'g-ok' };
    return { label: 'Wrong area', cls: 'g-bad' };
  }

  /* The sheet fades its bottom edge while there is more text to scroll to. */
  function updateFade() {
    var el = $('sheet-scroll');
    var more = el.scrollHeight - el.clientHeight - el.scrollTop > 6;
    el.classList.toggle('at-end', !more);
  }

  function show(screenId) {
    ['screen-home', 'screen-level', 'screen-play', 'screen-summary'].forEach(function (id) {
      $(id).classList.toggle('is-active', id === screenId);
    });
    window.scrollTo(0, 0);
  }

  /* ---------------- home ---------------- */

  function renderHome() {
    var wrap = $('level-list');
    wrap.innerHTML = '';
    LEVELS.forEach(function (lvl) {
      var list = byLevel(lvl.id);
      var locked = isLocked(lvl.id);
      var btn = document.createElement('button');
      btn.className = 'level-card lvl-' + lvl.id + (locked ? ' locked' : '');
      btn.innerHTML =
        '<span class="level-badge">' + lvl.badge + '</span>' +
        '<span><h3>' + lvl.name + '</h3><span class="fine">' +
          (locked
            ? (lvl.id === 'medium' ? 'Clear 3 Easy scenarios to unlock' : 'Clear 3 Medium scenarios to unlock')
            : lvl.blurb) +
        '</span></span>' +
        '<span class="level-meta"><b>' + levelStars(lvl.id) + '/' + (list.length * 3) + '</b><span>★ earned</span></span>';
      btn.addEventListener('click', function () {
        if (locked) return;
        openLevel(lvl.id);
      });
      wrap.appendChild(btn);
    });
    $('unlock-all').checked = progress.unlockAll;
  }

  /* ---------------- level ---------------- */

  function openLevel(levelId) {
    state.levelId = levelId;
    var lvl = LEVELS.filter(function (l) { return l.id === levelId; })[0];
    $('level-title').textContent = lvl.name;
    $('level-blurb').textContent = lvl.blurb;

    var wrap = $('scenario-list');
    wrap.innerHTML = '';
    byLevel(levelId).forEach(function (scn, i) {
      var rec = progress.scores[scn.id];
      var btn = document.createElement('button');
      btn.className = 'scn-card';
      btn.innerHTML =
        '<span class="scn-num">' + (i + 1) + '</span>' +
        '<span><b>' + scn.title + '</b><span class="fine">' + scn.role +
        ' · ' + scn.steps.length + ' decision' + (scn.steps.length > 1 ? 's' : '') + '</span></span>' +
        '<span class="stars">' + starHTML(rec ? rec.stars : 0) + '</span>';
      btn.addEventListener('click', function () { startScenario(scn); });
      wrap.appendChild(btn);
    });
    show('screen-level');
  }

  /* ---------------- play ---------------- */

  function startScenario(scn) {
    state.scenario = scn;
    state.stepIndex = 0;
    state.stepScores = [];
    show('screen-play');
    $('play-title').textContent = scn.title;
    $('play-role').textContent = scn.role;
    renderStep();
  }

  function currentStep() {
    return state.scenario.steps[state.stepIndex];
  }

  function renderDots() {
    var wrap = $('step-dots');
    wrap.innerHTML = '';
    state.scenario.steps.forEach(function (_, i) {
      var d = document.createElement('i');
      if (i < state.stepIndex) d.className = 'done';
      else if (i === state.stepIndex) d.className = 'now';
      wrap.appendChild(d);
    });
  }

  function renderStep() {
    var step = currentStep();
    state.pick = null;
    state.locked = false;
    state.hintUsed = false;

    renderDots();
    Court.clearAll();
    Court.drawFrame(step);

    $('ask-kind').textContent = step.kind === 'hit'
      ? 'Tap where the ball should land' : 'Tap where you should move';
    $('prompt-text').textContent =
      (state.stepIndex === 0 ? state.scenario.situation + ' ' : '') + step.prompt;

    $('ask-block').classList.remove('hidden');
    $('result-block').classList.add('hidden');
    $('hint-box').classList.add('hidden');
    $('hint-btn').classList.remove('hidden');
    $('lock-btn').classList.remove('hidden');
    $('lock-btn').disabled = true;
    $('next-btn').classList.add('hidden');
    $('sheet-scroll').scrollTop = 0;
    updateFade();

    playBall();
  }

  function playBall() {
    var step = currentStep();
    Court.playPath(step.ballPath || [], null);
  }

  function onCourtTap(ev) {
    if (state.locked || !state.scenario) return;
    var t = ev.touches ? ev.touches[0] : ev;
    var p = Court.toCourt(t.clientX, t.clientY);
    if (!p) return;
    // keep taps somewhere sane
    p.x = Math.max(-23, Math.min(23, p.x));
    p.y = Math.max(-47, Math.min(47, p.y));
    state.pick = p;
    var step = currentStep();
    Court.drawPick(p, step.you, step.kind);
    $('lock-btn').disabled = false;
  }

  function lockIn() {
    if (!state.pick || state.locked) return;
    state.locked = true;

    var step = currentStep();
    var d = Court.dist(state.pick, step.target);
    var score = scoreFor(d, step.perfect, step.good);
    if (state.hintUsed) score = Math.min(score, 75);
    state.stepScores.push(score);

    Court.drawTarget(step.target, step.perfect, step.good, state.pick);

    var g = gradeFor(score);
    $('verdict-grade').textContent = g.label;
    $('verdict-grade').className = g.cls;
    $('verdict-score').textContent = score + '/100' + (state.hintUsed ? ' (hint used)' : '');
    $('verdict-dist').textContent = 'You were ' + d.toFixed(1) + ' ft from the coach\'s spot. Green circle = full marks.';
    $('coach-text').textContent = step.coach;

    $('ask-block').classList.add('hidden');
    $('result-block').classList.remove('hidden');
    $('hint-btn').classList.add('hidden');
    $('lock-btn').classList.add('hidden');
    $('next-btn').classList.remove('hidden');
    $('next-btn').textContent =
      state.stepIndex < state.scenario.steps.length - 1 ? 'Next ball' : 'Finish scenario';
    $('sheet-scroll').scrollTop = 0;
    updateFade();
  }

  function nextStep() {
    if (state.stepIndex < state.scenario.steps.length - 1) {
      state.stepIndex++;
      renderStep();
    } else {
      finishScenario();
    }
  }

  function useHint() {
    if (state.locked) return;
    state.hintUsed = true;
    var box = $('hint-box');
    box.textContent = currentStep().keyIdea;
    box.classList.remove('hidden');
    $('hint-btn').classList.add('hidden');
  }

  /* ---------------- summary ---------------- */

  function finishScenario() {
    var scn = state.scenario;
    var total = state.stepScores.reduce(function (a, b) { return a + b; }, 0);
    var avg = Math.round(total / state.stepScores.length);
    var stars = starsFor(avg);

    var prev = progress.scores[scn.id];
    if (!prev || avg > prev.score) {
      progress.scores[scn.id] = { score: avg, stars: stars };
      save();
    }

    $('sum-title').textContent = scn.title;
    $('sum-stars').innerHTML = starHTML(stars);
    $('sum-score').innerHTML = '<b>' + avg + '</b> / 100' +
      (prev && prev.score > avg ? ' &nbsp;·&nbsp; best ' + prev.score : '');
    $('sum-takeaway').textContent = scn.takeaway;
    $('sum-eyebrow').textContent = stars === 3 ? 'Nailed it' : stars === 0 ? 'Worth another look' : 'Scenario complete';

    var rows = '';
    state.stepScores.forEach(function (s, i) {
      rows += '<div class="row"><i>' + (i + 1) + '</i><span>' + gradeFor(s).label + '</span><b>' + s + '</b></div>';
    });
    $('sum-steps').innerHTML = '<h3>Ball by ball</h3>' + rows;

    var list = byLevel(scn.level);
    var idx = list.indexOf(scn);
    var nextScn = list[idx + 1];
    var nextBtn = $('sum-next');
    if (nextScn) {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = 'Next: ' + nextScn.title;
      nextBtn.onclick = function () { startScenario(nextScn); };
    } else {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = 'Back to levels';
      nextBtn.onclick = function () { renderHome(); show('screen-home'); };
    }

    show('screen-summary');
  }

  /* ---------------- wiring ---------------- */

  function init() {
    Court.init();

    // `click` fires on touch devices too, and touch-action:manipulation on the
    // svg removes the double-tap delay — so one listener covers both.
    $('court').addEventListener('click', onCourtTap);
    $('sheet-scroll').addEventListener('scroll', updateFade, { passive: true });
    window.addEventListener('resize', updateFade);

    $('lock-btn').addEventListener('click', lockIn);
    $('next-btn').addEventListener('click', nextStep);
    $('hint-btn').addEventListener('click', useHint);
    $('replay-btn').addEventListener('click', function () {
      if (state.locked) return;
      playBall();
    });
    $('quit-btn').addEventListener('click', function () {
      Court.stopAnim();
      openLevel(state.levelId);
    });
    $('sum-retry').addEventListener('click', function () { startScenario(state.scenario); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (b) {
      b.addEventListener('click', function () {
        var to = b.getAttribute('data-nav');
        if (to === 'home') { renderHome(); show('screen-home'); }
        if (to === 'level') { openLevel(state.levelId); }
      });
    });

    $('unlock-all').addEventListener('change', function (e) {
      progress.unlockAll = e.target.checked;
      save();
      renderHome();
    });

    $('reset-progress').addEventListener('click', function () {
      if (!window.confirm('Wipe all scores and stars?')) return;
      progress = { scores: {}, unlockAll: progress.unlockAll };
      save();
      renderHome();
    });

    renderHome();
    show('screen-home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
