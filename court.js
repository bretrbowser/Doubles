/* ============================================================
   court.js — drawing the court, the players and the ball.

   COORDINATE SYSTEM (all numbers are real feet):
     x : -18 .. +18   left/right.  0 = center service line.
                      +-13.5 = singles sidelines, +-18 = doubles sidelines.
     y : -39 .. +39   near/far.    0 = the net.
                      +39 = YOUR baseline (bottom of the screen)
                      -39 = the OPPONENTS' baseline (top of the screen)
                      +-21 = the service lines.

   Your team always plays the bottom half. Your deuce court is x > 0,
   your ad court is x < 0 (stand at your baseline facing the net and
   your right hand is screen-right). For the opponents it is mirrored:
   their deuce court is x < 0.
   ============================================================ */

var Court = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var svg, layers;

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  function init() {
    svg = document.getElementById('court');
    layers = {
      guides: document.getElementById('layer-guides'),
      path: document.getElementById('layer-path'),
      actors: document.getElementById('layer-actors'),
      pick: document.getElementById('layer-pick')
    };
  }

  function clear(which) {
    var l = layers[which];
    while (l.firstChild) l.removeChild(l.firstChild);
  }

  function clearAll() { clear('guides'); clear('path'); clear('actors'); clear('pick'); }

  /* Convert a screen point (touch/click) into court feet. */
  function toCourt(clientX, clientY) {
    var ctm = svg.getScreenCTM();
    if (!ctm) return null;
    var inv = ctm.inverse();
    var p = svg.createSVGPoint();
    p.x = clientX; p.y = clientY;
    var q = p.matrixTransform(inv);
    return { x: q.x, y: q.y };
  }

  function dist(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* ---------------- players ---------------- */

  function drawActor(pos, cls, label) {
    var g = el('g', { class: 'actor ' + cls, transform: 'translate(' + pos.x + ',' + pos.y + ')' });
    if (cls === 'a-you') {
      g.appendChild(el('circle', { class: 'you-halo', r: 3.4 }));
      g.appendChild(el('circle', { class: 'you-halo', r: 4.6 }));
    }
    g.appendChild(el('circle', { r: 2.05 }));
    var t = el('text', { y: 0.75 });
    t.textContent = label;
    g.appendChild(t);
    layers.actors.appendChild(g);
    return g;
  }

  /* frame = { you, partner, opp1, opp2 } in feet */
  function drawFrame(frame) {
    clear('actors');
    if (frame.opp1) drawActor(frame.opp1, 'a-opp', '1');
    if (frame.opp2) drawActor(frame.opp2, 'a-opp', '2');
    if (frame.partner) drawActor(frame.partner, 'a-partner', 'P');
    if (frame.you) drawActor(frame.you, 'a-you', 'YOU');
  }

  /* ---------------- ball ---------------- */

  var ballNode = null, animId = null;

  function ballAt(pos, scale) {
    if (!ballNode) {
      ballNode = el('circle', { class: 'ball', r: 1.05 });
      layers.path.appendChild(ballNode);
    }
    ballNode.setAttribute('cx', pos.x);
    ballNode.setAttribute('cy', pos.y);
    ballNode.setAttribute('r', 1.05 * (scale || 1));
  }

  function stopAnim() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  /* Animate the ball along a list of points, then settle at the last one. */
  function playPath(points, done) {
    stopAnim();
    clear('path');
    ballNode = null;

    if (!points || points.length < 2) {
      if (points && points.length === 1) ballAt(points[0], 1);
      if (done) done();
      return;
    }

    // faint dashed trail so the route stays readable after the ball stops
    var d = 'M' + points.map(function (p) { return p.x + ',' + p.y; }).join(' L');
    layers.path.appendChild(el('path', { class: 'ball-trail', d: d }));

    // segment lengths, for constant speed
    var segs = [], total = 0, i;
    for (i = 1; i < points.length; i++) {
      var L = dist(points[i - 1], points[i]);
      segs.push(L); total += L;
    }
    var dur = Math.max(650, Math.min(2300, total * 13));
    var t0 = null;

    function frame(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var travelled = k * total, acc = 0, idx = 0;
      while (idx < segs.length - 1 && acc + segs[idx] < travelled) { acc += segs[idx]; idx++; }
      var local = segs[idx] > 0 ? (travelled - acc) / segs[idx] : 1;
      var a = points[idx], b = points[idx + 1];
      var pos = { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
      // little "height" cue: the ball swells in the middle of each segment
      ballAt(pos, 1 + 0.35 * Math.sin(local * Math.PI));
      if (k < 1) { animId = requestAnimationFrame(frame); }
      else { animId = null; ballAt(points[points.length - 1], 1); if (done) done(); }
    }
    animId = requestAnimationFrame(frame);
  }

  /* ---------------- the player's pick ---------------- */

  /* `dragging` draws full-length guide lines through the point. A fingertip
     covers roughly 44px and the full-credit radius is smaller than that, so
     without guides that reach past the finger you cannot see what you picked. */
  function drawPick(pos, from, kind, dragging) {
    clear('pick');
    if (dragging) {
      layers.pick.appendChild(el('line', { class: 'reticle', x1: pos.x, y1: -45, x2: pos.x, y2: 45 }));
      layers.pick.appendChild(el('line', { class: 'reticle', x1: -23, y1: pos.y, x2: 23, y2: pos.y }));
    }
    if (from && kind !== 'hit') {
      layers.pick.appendChild(el('line', {
        class: 'move-arrow', x1: from.x, y1: from.y, x2: pos.x, y2: pos.y
      }));
    }
    layers.pick.appendChild(el('circle', { class: 'pick', cx: pos.x, cy: pos.y, r: 2.6 }));
    layers.pick.appendChild(el('line', { class: 'pick-x', x1: pos.x - 1.2, y1: pos.y, x2: pos.x + 1.2, y2: pos.y }));
    layers.pick.appendChild(el('line', { class: 'pick-x', x1: pos.x, y1: pos.y - 1.2, x2: pos.x, y2: pos.y + 1.2 }));
  }

  /* ---------------- the coach's answer ---------------- */

  function drawTarget(target, perfect, good, pick) {
    layers.guides.appendChild(el('circle', { class: 'target-outer', cx: target.x, cy: target.y, r: good }));
    layers.guides.appendChild(el('circle', { class: 'target-ring', cx: target.x, cy: target.y, r: perfect }));
    var t = el('text', { class: 'zone-label', x: target.x, y: target.y + 0.7 });
    t.textContent = '✓';
    layers.guides.appendChild(t);
    if (pick) {
      layers.guides.appendChild(el('line', {
        class: 'err-line', x1: pick.x, y1: pick.y, x2: target.x, y2: target.y
      }));
    }
  }

  return {
    init: init,
    clearAll: clearAll,
    clear: clear,
    toCourt: toCourt,
    dist: dist,
    drawFrame: drawFrame,
    playPath: playPath,
    ballAt: ballAt,
    stopAnim: stopAnim,
    drawPick: drawPick,
    drawTarget: drawTarget
  };
})();
