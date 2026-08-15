/* ============================================================
   app.js — screens, scoring, progress.
   ============================================================ */

(function () {
  'use strict';

  // Progress is stored per player so a shared phone does not mean shared stars.
  // The pre-profiles key doubles as the namespace prefix: "<KEY>::<playerId>".
  var LEGACY_KEY = 'doublesiq.progress.v2';
  var PLAYERS_KEY = 'doublesiq.players.v1';

  var state = {
    levelId: 'easy',
    scenario: null,
    stepIndex: 0,
    stepResults: [],      // per ball: { score, pick, dist, hintUsed }
    pick: null,
    locked: false,
    hintUsed: false,
    phase: 'ask',         // 'ask' -> primary locks in; 'result' -> primary advances
    mode: 'play'          // 'play' | 'review' (re-reading one ball) | 'retry'
  };

  var players = loadPlayers();
  adoptLegacyProgress();
  var progress = load();

  /* ---------------- storage ---------------- */

  // Every read and write is guarded: Safari private browsing throws on both.
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }

  function dropKey(key) {
    try { localStorage.removeItem(key); } catch (e) { /* private mode */ }
  }

  function progressKeyFor(id) { return LEGACY_KEY + '::' + id; }
  function progressKey() { return progressKeyFor(players.activeId); }

  function loadPlayers() {
    var saved = readJSON(PLAYERS_KEY, null);
    if (saved && saved.list && saved.list.length) return saved;
    var seeded = { list: [{ id: 'p1', name: 'Player 1' }], activeId: 'p1' };
    writeJSON(PLAYERS_KEY, seeded);
    return seeded;
  }

  /* Adopt progress saved before profiles existed. Deliberately independent of
     whether the roster was just seeded — if the roster is written first and the
     old key is spotted afterwards, those stars would otherwise be stranded. */
  function adoptLegacyProgress() {
    var legacy = readJSON(LEGACY_KEY, null);
    if (!legacy || !legacy.scores) return;
    var key = progressKeyFor(players.activeId);
    var already = readJSON(key, null);
    var empty = !already || !already.scores ||
                !Object.keys(already.scores).length;
    if (empty) writeJSON(key, legacy);   // never clobber real progress
    dropKey(LEGACY_KEY);
  }

  function savePlayers() { writeJSON(PLAYERS_KEY, players); }

  function activePlayer() {
    for (var i = 0; i < players.list.length; i++) {
      if (players.list[i].id === players.activeId) return players.list[i];
    }
    return players.list[0];
  }

  function load() {
    var p = readJSON(progressKey(), null) || {};
    if (!p.scores) p.scores = {};
    return p;
  }

  function save() { writeJSON(progressKey(), progress); }

  function starsForPlayer(id) {
    var pr = readJSON(progressKeyFor(id), null);
    var total = 0;
    if (pr && pr.scores) {
      for (var k in pr.scores) {
        if (pr.scores.hasOwnProperty(k)) total += pr.scores[k].stars || 0;
      }
    }
    return total;
  }

  function newPlayerId() {
    return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 46656).toString(36);
  }

  function addPlayer(name) {
    name = String(name || '').trim().slice(0, 20);
    if (!name) return 'empty';
    var clash = players.list.some(function (p) {
      return p.name.toLowerCase() === name.toLowerCase();
    });
    if (clash) return 'duplicate';
    var p = { id: newPlayerId(), name: name };
    players.list.push(p);
    players.activeId = p.id;
    savePlayers();
    progress = load();
    return null;
  }

  function switchPlayer(id) {
    players.activeId = id;
    savePlayers();
    progress = load();
  }

  function renamePlayer(id, name) {
    name = String(name || '').trim().slice(0, 20);
    if (!name) return;
    players.list.forEach(function (p) { if (p.id === id) p.name = name; });
    savePlayers();
  }

  function removePlayer(id) {
    if (players.list.length <= 1) return;      // never leave zero players
    players.list = players.list.filter(function (p) { return p.id !== id; });
    dropKey(progressKeyFor(id));
    if (players.activeId === id) players.activeId = players.list[0].id;
    savePlayers();
    progress = load();
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

  /* ---------------- who's playing ---------------- */

  // Player names are the only user-authored strings this app renders.
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderPlayerChip() {
    var p = activePlayer();
    $('player-name').textContent = p.name;
    $('player-avatar').textContent = p.name.charAt(0).toUpperCase();
  }

  function renderPlayerList() {
    var wrap = $('player-list');
    wrap.innerHTML = '';
    var many = players.list.length > 1;
    players.list.forEach(function (p) {
      var row = document.createElement('div');
      row.className = 'player-row' + (p.id === players.activeId ? ' active' : '');
      row.innerHTML =
        '<button class="player-pick" type="button" data-pick="' + p.id + '">' +
          '<span class="avatar">' + esc(p.name.charAt(0).toUpperCase()) + '</span>' +
          '<b>' + esc(p.name) + '</b>' +
          '<span class="pstars">' + starsForPlayer(p.id) + ' ★</span>' +
        '</button>' +
        '<button class="player-edit" type="button" data-rename="' + p.id +
          '" aria-label="Rename ' + esc(p.name) + '">✎</button>' +
        (many ? '<button class="player-del" type="button" data-del="' + p.id +
          '" aria-label="Remove ' + esc(p.name) + '">×</button>' : '');
      wrap.appendChild(row);
    });
  }

  function playerError(msg) {
    var el = $('player-err');
    el.textContent = msg || '';
    el.classList.toggle('hidden', !msg);
  }

  function openPlayers() {
    renderPlayerList();
    playerError('');
    $('new-player-name').value = '';
    $('player-modal').classList.remove('hidden');
  }

  function closePlayers() {
    $('player-modal').classList.add('hidden');
    renderPlayerChip();
    renderHome();
  }

  /* ---------------- home ---------------- */

  function renderHome() {
    var wrap = $('level-list');
    wrap.innerHTML = '';
    LEVELS.forEach(function (lvl) {
      var list = byLevel(lvl.id);
      var btn = document.createElement('button');
      btn.className = 'level-card lvl-' + lvl.id;
      btn.innerHTML =
        '<span class="level-badge">' + lvl.badge + '</span>' +
        '<span><h3>' + lvl.name + '</h3><span class="fine">' + lvl.blurb + '</span></span>' +
        '<span class="level-meta"><b>' + levelStars(lvl.id) + '/' + (list.length * 3) + '</b><span>★ earned</span></span>';
      btn.addEventListener('click', function () { openLevel(lvl.id); });
      wrap.appendChild(btn);
    });
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
    state.stepResults = [];
    state.mode = 'play';
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
      if (i === state.stepIndex) d.className = 'now';
      else if (state.stepResults[i]) d.className = 'done';
      wrap.appendChild(d);
    });
  }

  function renderStep() {
    var step = currentStep();
    state.pick = null;
    state.locked = false;
    state.hintUsed = false;
    state.phase = 'ask';

    renderDots();
    Court.clearAll();
    Court.drawFrame(step);

    $('ask-kind').textContent = step.kind === 'hit'
      ? 'Place the ball — drag to adjust' : 'Place yourself — drag to adjust';
    $('prompt-text').textContent =
      (state.stepIndex === 0 && state.mode === 'play' ? state.scenario.situation + ' ' : '') + step.prompt;
    $('play-role').textContent = state.mode === 'retry'
      ? 'Ball ' + (state.stepIndex + 1) + ' · another go'
      : state.scenario.role;

    $('ask-block').classList.remove('hidden');
    $('result-block').classList.add('hidden');
    $('hint-box').classList.add('hidden');
    $('hint-btn').disabled = false;
    $('primary-btn').textContent = 'Lock it in';
    $('primary-btn').disabled = true;
    $('sheet-scroll').scrollTop = 0;
    updateFade();

    playBall();
  }

  function playBall() {
    var step = currentStep();
    Court.playPath(step.ballPath || [], null);
  }

  /* ---------------- placing your answer ----------------
     Press to place, then slide to fine-tune. The full-credit radius is smaller
     than a fingertip on every phone size, so a single tap cannot be precise and
     the finger hides the mark while it is down. Dragging fixes both: guide lines
     extend past the hand, and the mark is visible the moment you lift. */

  var dragging = false;

  function courtPoint(ev) {
    var p = Court.toCourt(ev.clientX, ev.clientY);
    if (!p) return null;
    p.x = Math.max(-22, Math.min(22, p.x));
    p.y = Math.max(-44, Math.min(44, p.y));
    return p;
  }

  function setPick(p, isDragging) {
    state.pick = p;
    var step = currentStep();
    Court.drawPick(p, step.you, step.kind, isDragging);
    $('primary-btn').disabled = false;
  }

  function onPointerDown(ev) {
    if (state.locked || !state.scenario || state.phase !== 'ask') return;
    var p = courtPoint(ev);
    if (!p) return;
    dragging = true;
    var svg = $('court');
    if (svg.setPointerCapture) { try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ } }
    setPick(p, true);
    ev.preventDefault();
  }

  function onPointerMove(ev) {
    if (!dragging) return;
    var p = courtPoint(ev);
    if (!p) return;
    setPick(p, true);
    ev.preventDefault();
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (state.pick) setPick(state.pick, false);   // drop the guide lines
  }

  function lockIn() {
    if (!state.pick || state.locked) return;
    state.locked = true;
    state.phase = 'result';

    var step = currentStep();
    var d = Court.dist(state.pick, step.target);
    var score = scoreFor(d, step.perfect, step.good);
    if (state.hintUsed) score = Math.min(score, 75);

    // Keyed by index, not pushed, so re-answering one ball replaces it in place.
    var res = { score: score, pick: state.pick, dist: d, hintUsed: state.hintUsed };
    state.stepResults[state.stepIndex] = res;

    Court.drawTarget(step.target, step.perfect, step.good, state.pick);
    showVerdict(step, res);

    $('ask-block').classList.add('hidden');
    $('result-block').classList.remove('hidden');
    $('hint-btn').disabled = true;

    var primary = $('primary-btn');
    primary.textContent = state.mode === 'retry' ? 'Back to results'
      : state.stepIndex < state.scenario.steps.length - 1 ? 'Next ball' : 'See summary';
    // The button under the thumb just changed meaning. Hold it inert briefly so
    // a fast second tap cannot skip past coaching that was never read.
    primary.disabled = true;
    setTimeout(function () {
      if (state.phase === 'result') primary.disabled = false;
    }, 450);

    $('sheet-scroll').scrollTop = 0;
    updateFade();
  }

  function showVerdict(step, res) {
    var g = gradeFor(res.score);
    $('verdict-grade').textContent = g.label;
    $('verdict-grade').className = g.cls;
    $('verdict-score').textContent = res.score + '/100' + (res.hintUsed ? ' (hint used)' : '');
    $('verdict-dist').textContent = 'You were ' + res.dist.toFixed(1) +
      ' ft from the coach\'s spot. Green circle = full marks.';
    $('coach-text').textContent = step.coach;
  }

  /* Open one ball from the summary: the court, where you put yourself, and
     where the coach wanted you — so you can study the actual location. */
  function openReview(i) {
    state.mode = 'review';
    state.stepIndex = i;
    state.locked = true;      // taps are inert until they ask for another go
    state.phase = 'result';

    var step = currentStep();
    var res = state.stepResults[i];

    show('screen-play');
    $('play-title').textContent = state.scenario.title;
    $('play-role').textContent =
      'Ball ' + (i + 1) + ' of ' + state.scenario.steps.length + ' · reviewing';
    renderDots();

    Court.clearAll();
    Court.drawFrame(step);
    if (res && res.pick) Court.drawPick(res.pick, step.you, step.kind);
    Court.drawTarget(step.target, step.perfect, step.good, res ? res.pick : null);
    playBall();

    if (res) showVerdict(step, res);
    $('ask-block').classList.add('hidden');
    $('result-block').classList.remove('hidden');
    $('hint-btn').disabled = true;
    $('primary-btn').textContent = 'Try this ball again';
    $('primary-btn').disabled = false;
    $('sheet-scroll').scrollTop = 0;
    updateFade();
  }

  function retryBall() {
    state.mode = 'retry';
    renderStep();
  }

  function nextStep() {
    // Reviewing or re-taking a single ball always lands back on the summary.
    if (state.mode !== 'play') { finishScenario(); return; }
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
    $('hint-btn').disabled = true;
    updateFade();
  }

  /* ---------------- summary ---------------- */

  function finishScenario() {
    var scn = state.scenario;
    var done = state.stepResults.filter(Boolean);
    var total = done.reduce(function (a, r) { return a + r.score; }, 0);
    var avg = done.length ? Math.round(total / done.length) : 0;
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
    state.stepResults.forEach(function (r, i) {
      if (!r) return;
      rows += '<button class="row" type="button" data-step="' + i + '">' +
                '<i>' + (i + 1) + '</i>' +
                '<span>' + gradeFor(r.score).label + '</span>' +
                '<b>' + r.score + '</b><em aria-hidden="true">›</em>' +
              '</button>';
    });
    $('sum-steps').innerHTML =
      '<h3>Ball by ball</h3><p class="fine" style="margin-bottom:4px">' +
      'Tap a ball to see that spot again.</p>' + rows;
    Array.prototype.forEach.call($('sum-steps').querySelectorAll('[data-step]'), function (el) {
      el.addEventListener('click', function () {
        openReview(parseInt(el.getAttribute('data-step'), 10));
      });
    });

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

    // Pointer events cover touch, pen and mouse with one code path.
    // touch-action:none on the svg stops the browser stealing the drag.
    var court = $('court');
    court.addEventListener('pointerdown', onPointerDown);
    court.addEventListener('pointermove', onPointerMove);
    court.addEventListener('pointerup', onPointerUp);
    court.addEventListener('pointercancel', onPointerUp);
    $('sheet-scroll').addEventListener('scroll', updateFade, { passive: true });
    window.addEventListener('resize', updateFade);

    $('primary-btn').addEventListener('click', function () {
      if (state.mode === 'review') { retryBall(); return; }
      if (state.phase === 'ask') lockIn(); else nextStep();
    });
    $('hint-btn').addEventListener('click', useHint);
    // Replay stays live after the answer too: re-watching the point with the
    // coach's spot already on screen is the most useful time to see it.
    $('replay-btn').addEventListener('click', playBall);
    $('quit-btn').addEventListener('click', function () {
      Court.stopAnim();
      if (state.mode !== 'play') { finishScenario(); return; }
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

    $('reset-progress').addEventListener('click', function () {
      if (!window.confirm('Wipe all scores and stars for ' + activePlayer().name + '?')) return;
      progress = { scores: {} };
      save();
      renderHome();
    });

    $('player-chip').addEventListener('click', openPlayers);
    $('close-players').addEventListener('click', closePlayers);
    $('player-modal').addEventListener('click', function (e) {
      if (e.target === $('player-modal')) closePlayers();   // tap the backdrop
    });

    $('player-list').addEventListener('click', function (e) {
      var pick = e.target.closest('[data-pick]');
      var del = e.target.closest('[data-del]');
      var ren = e.target.closest('[data-rename]');
      if (pick) { switchPlayer(pick.getAttribute('data-pick')); closePlayers(); return; }
      if (ren) {
        var id = ren.getAttribute('data-rename');
        var cur = players.list.filter(function (p) { return p.id === id; })[0];
        var next = window.prompt('Name for this player:', cur ? cur.name : '');
        if (next !== null) { renamePlayer(id, next); renderPlayerList(); renderPlayerChip(); }
        return;
      }
      if (del) {
        var did = del.getAttribute('data-del');
        var who = players.list.filter(function (p) { return p.id === did; })[0];
        if (!who) return;
        if (!window.confirm('Remove ' + who.name + '? Their stars are deleted with them.')) return;
        removePlayer(did);
        renderPlayerList();
        renderPlayerChip();
      }
    });

    $('add-player-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var err = addPlayer($('new-player-name').value);
      if (err === 'empty') { playerError('Type a name first.'); return; }
      if (err === 'duplicate') { playerError('Someone here already has that name.'); return; }
      $('new-player-name').value = '';
      playerError('');
      renderPlayerList();
      renderPlayerChip();
    });

    // The markup ships a literal year so the byline is correct with scripting
    // off; this keeps it current without anyone having to remember.
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(document.querySelectorAll('.yr'), function (el) {
      el.textContent = year;
    });

    renderPlayerChip();
    renderHome();
    show('screen-home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
