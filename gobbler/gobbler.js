(function () {
  "use strict";

  var app = document.getElementById("app");
  var live = document.getElementById("g-live");
  var SESSION_KEY = "vm-gobbler-session";
  var MUTE_KEY = "vm-gobbler-mute";

  var view = null;
  var mode = "landing";
  var ui = {
    joinOpen: false,
    accuse: false,
    peekPick: false,
    shieldPick: false,
    rules: false,
    confirm: null,
    toast: "",
    toastBad: false,
    error: "",
    holding: false,
    hasPeeked: false,
    revealUntil: 0,
    busy: false
  };
  var clockOffset = 0;
  var ws = null;
  var wantSocket = false;
  var backoff = 500;
  var reconnectTimer = null;
  var pollTimer = null;
  var pingTimer = null;
  var toastTimer = null;
  var lastPhase = "";
  var seenLogId = 0;
  var freshIds = {};
  var audioCtx = null;
  var heldCard = null;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function session() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
    catch (e) { return null; }
  }

  function saveSession(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      code: data.code,
      playerId: data.playerId,
      token: data.token,
      name: data.name
    }));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function muted() {
    return localStorage.getItem(MUTE_KEY) === "1";
  }

  function roomFromUrl() {
    var raw = new URLSearchParams(location.search).get("room") || "";
    return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  function joinUrl(code) {
    return location.origin + "/gobbler/?room=" + code;
  }

  function toast(text, bad) {
    ui.toast = text || "";
    ui.toastBad = !!bad;
    paint();
    clearTimeout(toastTimer);
    if (text) toastTimer = setTimeout(function () { ui.toast = ""; paint(); }, 4200);
  }

  function say(text) {
    if (live && text) live.textContent = text;
  }

  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function serverNow() {
    return Date.now() + clockOffset;
  }

  function chime() {
    if (muted()) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var ctx = audioCtx;
      if (ctx.state === "suspended") ctx.resume();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 494;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.38);
    } catch (e) { /* sound is optional */ }
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  }

  function noteFeast(next) {
    freshIds = {};
    if (!view || !view.feast || !next.feast) return;
    var prev = {};
    view.feast.forEach(function (d) { if (d.eaten) prev[d.id] = true; });
    next.feast.forEach(function (d) { if (d.eaten && !prev[d.id]) freshIds[d.id] = true; });
  }

  function applyView(next) {
    if (!next) return;
    if (view && typeof next.rev === "number" && next.rev < view.rev) return;
    if (!next.you) {
      stopNet();
      clearSession();
      view = null;
      mode = "landing";
      ui.error = "You left the table.";
      paint();
      return;
    }
    var phaseChanged = !view || view.phase !== next.phase;
    noteFeast(next);
    view = next;
    clockOffset = (next.serverNow || Date.now()) - Date.now();
    mode = "game";
    if (phaseChanged) {
      ui.accuse = false;
      ui.peekPick = false;
      ui.shieldPick = false;
      ui.confirm = null;
      if (next.phase === "reveal" || next.phase === "lobby") ui.hasPeeked = false;
      if (next.phase === "vote" && lastPhase !== "vote") chime();
    }
    lastPhase = next.phase;
    var latest = next.log && next.log.length ? next.log[next.log.length - 1] : null;
    if (latest && latest.id !== seenLogId) {
      seenLogId = latest.id;
      say(latest.text);
    }
    if (next.phase === "vote" && phaseChanged) say("Vote now. " + (next.vote ? next.vote.accusedName : ""));
    paint();
  }

  function stopNet() {
    wantSocket = false;
    clearTimeout(reconnectTimer);
    clearInterval(pollTimer);
    clearInterval(pingTimer);
    pollTimer = null;
    if (ws) {
      try { ws.onclose = null; ws.close(); } catch (e) { /* ignore */ }
      ws = null;
    }
  }

  function connect() {
    var saved = session();
    if (!saved) return;
    wantSocket = true;
    openSocket();
    if (!pollTimer) {
      pollTimer = setInterval(pullState, 4000);
    }
  }

  function openSocket() {
    var saved = session();
    if (!saved || !wantSocket) return;
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
    var proto = location.protocol === "https:" ? "wss:" : "ws:";
    var url = proto + "//" + location.host + "/api/gobbler/rooms/" + saved.code + "/ws?token=" + encodeURIComponent(saved.token);
    var socket;
    try { socket = new WebSocket(url); }
    catch (e) { scheduleReconnect(); return; }
    ws = socket;
    socket.onopen = function () {
      backoff = 500;
      clearInterval(pingTimer);
      pingTimer = setInterval(function () {
        if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: "ping" }));
      }, 20000);
    };
    socket.onmessage = function (ev) {
      var msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.type === "state") applyView(msg.view);
      if (msg.type === "notice") toast(msg.text, false);
      if (msg.type === "error") toast(msg.text, true);
      if (msg.type === "pong" && msg.serverNow) clockOffset = msg.serverNow - Date.now();
    };
    socket.onclose = function () {
      if (ws === socket) ws = null;
      if (wantSocket) scheduleReconnect();
    };
    socket.onerror = function () { try { socket.close(); } catch (e) { /* ignore */ } };
  }

  function scheduleReconnect() {
    if (!wantSocket) return;
    clearTimeout(reconnectTimer);
    var wait = backoff;
    backoff = Math.min(5000, backoff * 2);
    reconnectTimer = setTimeout(function () {
      pullState();
      openSocket();
    }, wait);
  }

  function pullState() {
    var saved = session();
    if (!saved) return Promise.resolve();
    return fetch("/api/gobbler/rooms/" + saved.code + "/state?token=" + encodeURIComponent(saved.token), { cache: "no-store" })
      .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
      .then(function (result) {
        if (result.status === 401 || result.status === 404) {
          if (!view) {
            stopNet();
            clearSession();
            ui.error = (result.data && result.data.error) || "That table is gone.";
            mode = "landing";
            paint();
          }
          return;
        }
        if (result.data && result.data.view) applyView(result.data.view);
      })
      .catch(function () { /* the socket or the next poll will try again */ });
  }

  function send(action) {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(action));
      return;
    }
    var saved = session();
    if (!saved) return;
    fetch("/api/gobbler/rooms/" + saved.code + "/action", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.assign({ token: saved.token }, action))
    }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (result) {
      if (result.data && result.data.view) applyView(result.data.view);
      if (result.data && result.data.notice) toast(result.data.notice, false);
      if (!result.ok) toast((result.data && result.data.error) || "That did not go through.", true);
    }).catch(function () {
      toast("We can't reach the table. Check your signal and try again.", true);
    });
  }

  function postJSON(url, body) {
    return fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  function enterTable(data) {
    saveSession(data);
    history.replaceState(null, "", "/gobbler/?room=" + data.code);
    mode = "game";
    view = null;
    ui.error = "";
    paint();
    connect();
    pullState();
  }

  function createTable(name) {
    ui.busy = true;
    paint();
    postJSON("/api/gobbler/rooms", { name: name }).then(function (result) {
      ui.busy = false;
      if (!result.ok) {
        ui.error = (result.data && result.data.error) || "We couldn't open a table.";
        paint();
        return;
      }
      enterTable(result.data);
    }).catch(function () {
      ui.busy = false;
      ui.error = "We can't reach the table. Check your signal and try again.";
      paint();
    });
  }

  function joinTable(code, name) {
    ui.busy = true;
    paint();
    postJSON("/api/gobbler/rooms/" + code + "/join", { name: name }).then(function (result) {
      ui.busy = false;
      if (!result.ok) {
        ui.error = (result.data && result.data.error) || "Check the code and try again.";
        paint();
        return;
      }
      enterTable(result.data);
    }).catch(function () {
      ui.busy = false;
      ui.error = "We can't reach the table. Check your signal and try again.";
      paint();
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { toast("Copied.", false); });
    }
    toast(text, false);
    return Promise.resolve();
  }

  function rulesHtml() {
    return (
      '<div class="g-rules">' +
      '<p class="g-lede">One or two Gobblers are eating the feast. Everyone else is a Pilgrim. Every phone has a secret mission, so everybody looks a little suspicious.</p>' +
      "<h2>Set the table</h2>" +
      "<p>The host starts a table and reads the code out loud. Everyone else joins on their own phone. No app. No account. No TV.</p>" +
      "<h2>Peek</h2>" +
      "<p>Hold the card to see your role. Let go and it hides. You can also tap to peek for three seconds. Then tap ready.</p>" +
      "<h2>Courses</h2>" +
      "<p>Every 15 to 20 minutes, a new mission shows up. The host picks the time and can move on early. Pilgrim missions are harmless table talk. When a Gobbler marks a mission done, one dish disappears. The phones name the dish, never the person.</p>" +
      "<h2>Special Pilgrims</h2>" +
      "<ul>" +
      "<li><strong>Grandma</strong> can, once, secretly check one player's true role.</li>" +
      "<li><strong>Pie Guard</strong> shields one player each course. If the table votes that person out, the shield cancels it. They stay, and no dish is lost.</li>" +
      "<li><strong>Kid</strong> gets easier missions and double points.</li>" +
      "</ul>" +
      "<h2>Gobble!</h2>" +
      "<p>Tap Gobble! and name someone. Every phone gets 60 seconds. The vote ends early once everyone still in the game has answered. More than half of those people have to vote them out.</p>" +
      "<ul>" +
      "<li>Catch a Gobbler and they are out of the game.</li>" +
      "<li>Vote out an innocent player and the Pilgrims lose a dish.</li>" +
      "<li>Not enough votes, and they stay.</li>" +
      "<li>A pie shield can cancel the whole result.</li>" +
      "<li>You get one Gobble! per course.</li>" +
      "</ul>" +
      "<h2>Who wins</h2>" +
      "<p>The Gobblers win if the feast is empty before dessert. The Pilgrims win if every Gobbler is caught. Or the host calls pie time, and everyone names the Gobblers still in the game. If the table is right, the Pilgrims win.</p>" +
      "<p>Then the phones show every role, every mission, the points, and a few family awards.</p>" +
      "</div>"
    );
  }

  function roleOpen() {
    return ui.holding || Date.now() < ui.revealUntil;
  }

function roleCard(compact) {
  var you = view.you;
  if (!you || !you.role) return "";
  var open = roleOpen();
  var team = you.team === "gobbler" ? "gobbler" : "pilgrim";
  var card = (
    '<div class="g-role g-role-' + team + (compact ? " is-compact" : "") + (open ? " is-open" : "") + '" data-hold data-testid="role-card"' + (open ? ' data-role="' + esc(you.role) + '"' : "") + ">" +
    '<div class="g-role-back"><p class="g-role-kicker">Secret</p><p class="g-role-prompt">' + (compact ? "Hold to see your role" : "Hold to peek") + '</p>' +
    (compact ? "" : '<p class="g-role-hint">Let go and it hides.</p>') + "</div>" +
    '<div class="g-role-face" aria-hidden="' + (open ? "false" : "true") + '"><p class="g-role-kicker">' + esc(you.teamLabel) + " team</p><h2>" + esc(you.roleLabel) + "</h2><p>" + esc(you.blurb) + "</p></div>" +
    "</div>"
  );
  if (compact) return card;
  return card + '<button type="button" class="g-btn g-btn-ghost" data-act="peek-3">Tap to peek for 3 seconds</button>';
}

  function holdNote(kicker, title, body) {
    return (
      '<div class="g-note" data-hold>' +
      '<div class="g-role-back"><p class="g-role-kicker">' + esc(kicker) + '</p><p class="g-role-prompt">' + esc(title) + "</p></div>" +
      '<div class="g-role-face" aria-hidden="true"><p class="g-role-kicker">Only your phone</p><h2>' + esc(title) + "</h2><p>" + esc(body) + "</p></div>" +
      "</div>"
    );
  }

  function playerRows(canRemove) {
    return view.players.map(function (p) {
      var tags = "";
      if (p.isHost) tags += '<span class="g-tag">Host</span>';
      if (!p.connected) tags += '<span class="g-tag">Away</span>';
      if (p.caught) tags += '<span class="g-tag g-tag-hot">Caught</span>';
      else if (p.eliminated) tags += '<span class="g-tag g-tag-out">Out</span>';
      if (view.phase === "reveal" && p.ready) tags += '<span class="g-tag">Ready</span>';
      var remove = canRemove && !p.isHost
        ? '<button type="button" class="g-icon-btn" data-act="remove" data-id="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">×</button>'
        : "";
      return (
        '<div class="g-row" data-testid="player" data-name="' + esc(p.name) + '">' +
        '<div class="g-who"><span class="g-dot' + (p.connected ? " on" : "") + '"></span><span class="g-name">' + esc(p.name) + "</span></div>" +
        '<div class="g-who">' + tags + remove + "</div></div>"
      );
    }).join("");
  }

  function feastHtml() {
    var left = view.feastLeft;
    var tiles = view.feast.map(function (d) {
      var cls = "g-dish" + (d.eaten ? " is-gone" : "") + (freshIds[d.id] ? " is-fresh" : "");
      return '<li class="' + cls + '"><i aria-hidden="true">' + d.emoji + "</i><span>" + esc(d.name) + (d.eaten ? " · gone" : "") + "</span></li>";
    }).join("");
    return (
      '<div data-testid="feast" data-feast-left="' + left + '">' +
      '<div class="g-feast-head"><div><p class="g-label">The feast</p><p class="g-help">' + left + " of " + view.feast.length + " dishes left</p></div>" +
      '<p class="g-feast-count">' + left + "<span>left</span></p></div>" +
      '<ul class="g-feast">' + tiles + "</ul></div>"
    );
  }

  function timerHtml(ends, label) {
    var text = "Paused";
    if (ends) text = fmt(Math.max(0, ends - serverNow()));
    return '<div><p class="g-label">' + esc(label) + '</p><p class="g-timer" data-countdown data-ends="' + (ends || 0) + '">' + text + "</p></div>";
  }

  function startBlocker() {
    var n = view.players.length;
    if (n < 4) {
      var more = 4 - n;
      return "Need " + more + " more player" + (more === 1 ? "" : "s") + ". Four is the smallest table.";
    }
    var away = view.players.filter(function (p) { return !p.connected; });
    if (away.length) return away.map(function (p) { return p.name; }).join(", ") + (away.length === 1 ? " is" : " are") + " still connecting.";
    var pilgrims = n - view.settings.gobblerCount;
    var specials = [view.settings.grandma, view.settings.pieGuard, view.settings.kid].filter(Boolean).length;
    if (specials > pilgrims) return "Those special roles need " + specials + " Pilgrims. This setup has " + pilgrims + ".";
    return "";
  }

  function settingsReadout() {
    var s = view.settings;
    var bits = [s.gobblerCount + (s.gobblerCount === 1 ? " Gobbler" : " Gobblers"), s.roundMinutes + " minute courses"];
    if (s.grandma) bits.push("Grandma");
    if (s.pieGuard) bits.push("Pie Guard");
    if (s.kid) bits.push("Kid");
    return bits.join(" · ");
  }

  function lobbyHtml() {
    var code = view.code;
    var manager = view.youCanManage;
    var blocker = startBlocker();
    var s = view.settings;
    var controls = manager
      ? (
        '<div class="g-stack">' +
        '<p class="g-label">Gobblers</p>' +
        '<div class="g-choice">' +
        '<button type="button" class="g-btn g-btn-ghost' + (s.gobblerCount === 1 ? " is-on" : "") + '" data-act="gobblers" data-value="1">1 Gobbler</button>' +
        '<button type="button" class="g-btn g-btn-ghost' + (s.gobblerCount === 2 ? " is-on" : "") + '" data-act="gobblers" data-value="2">2 Gobblers</button>' +
        "</div>" +
        (view.players.length >= 8 && s.gobblerCount === 2 ? '<p class="g-help">Eight or more at the table. Two Gobblers is the classic setup. Change it if you want.</p>' : "") +
        '<button type="button" class="g-switch" role="switch" aria-checked="' + (s.grandma ? "true" : "false") + '" data-act="toggle" data-key="grandma"><span><strong>Grandma</strong><small>One secret peek</small></span><span class="g-knob"></span></button>' +
        '<button type="button" class="g-switch" role="switch" aria-checked="' + (s.pieGuard ? "true" : "false") + '" data-act="toggle" data-key="pieGuard"><span><strong>Pie Guard</strong><small>Shield one player each course</small></span><span class="g-knob"></span></button>' +
        '<button type="button" class="g-switch" role="switch" aria-checked="' + (s.kid ? "true" : "false") + '" data-act="toggle" data-key="kid"><span><strong>Kid</strong><small>Easier missions, double points</small></span><span class="g-knob"></span></button>' +
        '<label class="g-label" for="g-minutes-range">Course length: <span id="g-minutes">' + s.roundMinutes + " min</span></label>" +
        '<input class="g-slider" id="g-minutes-range" data-act="minutes" type="range" min="15" max="20" step="1" value="' + s.roundMinutes + '" />' +
        "</div>"
      )
      : '<p class="g-help">The host set this table: ' + esc(settingsReadout()) + ".</p>";
    var start = manager
      ? '<button type="button" class="g-btn g-btn-honey" data-testid="start" data-act="start"' + (blocker ? " disabled" : "") + ">Start dinner</button>" +
        (blocker ? '<p class="g-help">' + esc(blocker) + "</p>" : "")
      : '<p class="g-banner">Waiting for the host to start.</p>';
    return (
      '<section data-testid="lobby" class="g-stack-lg">' +
      '<div><p class="g-kicker">Table code</p><h1 class="g-code" data-testid="room-code">' + esc(code) + "</h1>" +
      '<p class="g-help" style="text-align:center">Read it out loud, or send the link.</p></div>' +
      '<div class="g-choice">' +
      '<button type="button" class="g-btn g-btn-navy" data-act="copy-link">Copy link</button>' +
      '<button type="button" class="g-btn g-btn-ghost" data-act="share-link">Share</button>' +
      "</div>" +
      '<div class="g-card"><p class="g-label">' + view.players.length + " at the table</p>" + playerRows(manager) + "</div>" +
      '<div class="g-card g-stack">' + controls + "</div>" +
      start +
      '<button type="button" class="g-linkish" data-act="leave">Leave this table</button>' +
      "</section>"
    );
  }

  function revealHtml() {
    var waiting = view.players.filter(function (p) { return !p.ready; }).map(function (p) { return p.name; });
    var force = view.youCanManage
      ? '<button type="button" class="g-btn g-btn-ghost" data-act="begin">Start the feast anyway</button><p class="g-help">Use this if a phone is stuck on the peek.</p>'
      : "";
    return (
      '<section data-testid="reveal" class="g-stack-lg">' +
      '<div><p class="g-kicker">Pass the phones close</p><h1 class="g-title" style="font-size:2.4rem">Your role</h1>' +
      "<p class=\"g-lede\">Hold the card, or tap to peek. The person beside you should see a blank card.</p></div>" +
      roleCard() +
      '<button type="button" class="g-btn g-btn-honey" data-testid="ready" data-act="ready"' + (view.you.ready || !ui.hasPeeked ? " disabled" : "") + ">" +
      (view.you.ready ? "You are ready" : "I have seen my role") + "</button>" +
      (!ui.hasPeeked ? '<p class="g-help">Peek once before you sit back.</p>' : "") +
      force +
      '<div class="g-card"><p class="g-label">Still peeking</p>' +
      (waiting.length ? "<p>" + esc(waiting.join(", ")) + "</p>" : "<p>Everyone is ready.</p>") +
      playerRows(false) + "</div></section>"
    );
  }

  function powersHtml() {
    var you = view.you;
    var html = "";
    if (you.grandma) {
      if (you.grandma.result) {
        var r = you.grandma.result;
        html += holdNote("Grandma's note", r.name, r.name + " is " + r.label + ". " + r.teamLabel + " team.");
      } else if (!you.grandma.used && you.alive && view.phase === "round") {
        html += '<button type="button" class="g-btn g-btn-navy" data-act="open-peek">Grandma: peek at one player</button>';
      }
    }
    if (you.pieGuard && you.alive && (view.phase === "round" || view.phase === "vote")) {
      var name = "Nobody yet";
      if (you.pieGuard.targetId) {
        var target = view.players.find(function (p) { return p.id === you.pieGuard.targetId; });
        name = target ? target.name : "Someone";
      }
      html += '<div class="g-card"><p class="g-label">Pie shield this course</p><p><strong>' + esc(name) + "</strong></p>";
      if (view.phase === "round") {
        html += '<button type="button" class="g-btn g-btn-ghost" data-act="open-shield">' + (you.pieGuard.targetId ? "Change the shield" : "Choose someone") + "</button>";
      } else html += '<p class="g-help">Locked while the vote is up.</p>';
      html += "</div>";
    }
    return html;
  }

  function missionHtml() {
    var mission = view.you.mission;
    if (!view.you.alive) {
      return '<div class="g-card"><p class="g-mission-warn">You are out of the votes. Stay at the table and watch the plates.</p></div>';
    }
    if (!mission) {
      return '<div class="g-card"><p>The kitchen is out of new missions for you. Watch the table.</p></div>';
    }
    if (mission.done) {
      return '<div class="g-card g-mission" data-testid="mission"><p class="g-label">Your mission</p><p class="g-done">Done.</p><p>' + esc(mission.text) + "</p></div>";
    }
    return (
      '<div class="g-card g-mission" data-testid="mission">' +
      '<p class="g-label">Secret mission</p><h2>' + esc(mission.text) + "</h2>" +
      (mission.eats ? '<p class="g-mission-warn">Marking this done eats a dish. The table sees the plate, not your name.</p>' : '<p class="g-help">Harmless on purpose. Do it out loud.</p>') +
      '<button type="button" class="g-btn g-btn-honey" data-testid="complete" data-act="complete">Mark it done</button></div>'
    );
  }

  function roundHtml() {
    var manager = view.youCanManage
      ? '<div class="g-choice"><button type="button" class="g-btn g-btn-ghost" data-act="ask-advance">Next course</button><button type="button" class="g-btn g-btn-navy" data-act="ask-pie">Pie time</button></div>' +
        (view.hostAway ? '<p class="g-help">The host phone is away, so anyone can move the table.</p>' : "")
      : "";
    var result = view.lastResult ? '<p class="g-banner' + (view.lastResult.kind === "caught" || view.lastResult.kind === "innocent" ? " g-banner-hot" : "") + '">' + esc(view.lastResult.text) + "</p>" : "";
    return (
      '<section data-testid="round" class="g-stack-lg">' +
      '<div class="g-topbar">' + timerHtml(view.round.endsAt, "Course " + view.round.number) +
      '<button type="button" class="g-icon-btn" data-act="mute" aria-pressed="' + (muted() ? "true" : "false") + '">' + (muted() ? "Sound off" : "Sound") + "</button></div>" +
      result +
      missionHtml() +
      feastHtml() +
      powersHtml() +
      roleCard(true) +
      manager +
      '<div class="g-card"><p class="g-label">The table</p>' + playerRows(false) + "</div>" +
      logHtml() +
      "</section>"
    );
  }

  function logHtml() {
    if (!view.log || !view.log.length) return "";
    var items = view.log.slice().reverse().map(function (line) {
      return "<li>" + esc(line.text) + "</li>";
    }).join("");
    return '<div class="g-card"><p class="g-label">At the table</p><ul class="g-log">' + items + "</ul></div>";
  }

  function voteHtml() {
    var vote = view.vote;
    var waiting = vote.yourVote
      ? '<p class="g-banner">Your vote is in. ' + vote.votesCast + " of " + vote.eligible + " have voted.</p>"
      : "";
    var buttons = vote.youCanVote
      ? '<button type="button" class="g-btn g-btn-danger" data-testid="vote-out" data-act="vote" data-choice="out">Send them out</button>' +
        '<button type="button" class="g-btn g-btn-ghost" data-testid="vote-stay" data-act="vote" data-choice="stay">Let them stay</button>'
      : (view.you.alive ? "" : '<p class="g-help">You are out of this vote. Watch how it lands.</p>');
    return (
      '<section data-testid="vote" class="g-stack-lg">' +
      '<p class="g-kicker">Gobble!</p>' +
      '<p class="g-help">' + esc(vote.accuserName) + " called it.</p>" +
      '<h1 class="g-vote-name">' + esc(vote.accusedName) + "</h1>" +
      '<p class="g-lede">Is ' + esc(vote.accusedName) + " the Gobbler? It takes " + vote.needed + " votes to send them out.</p>" +
      '<p class="g-big-timer" data-countdown data-ends="' + vote.endsAt + '">' + fmt(Math.max(0, vote.endsAt - serverNow())) + "</p>" +
      '<p class="g-help" style="text-align:center">' + vote.votesCast + " of " + vote.eligible + " voted</p>" +
      waiting +
      buttons +
      '<p class="g-help">The vote ends at 60 seconds, or sooner when every phone still in the game has answered. Ties stay.</p>' +
      "</section>"
    );
  }

  function pieHtml() {
    var pie = view.pie;
    var picks = pie.yourPicks || [];
    var people = pie.suspects.map(function (p) {
      var on = picks.indexOf(p.id) !== -1;
      return '<button type="button" class="g-person' + (on ? " is-on" : "") + '" data-act="pie-pick" data-id="' + esc(p.id) + '"' + (pie.locked ? " disabled" : "") + ">" + esc(p.name) + (on ? " · named" : "") + "</button>";
    }).join("");
    var need = pie.needed === 1 ? "Name the Gobbler still in the game." : "Name both Gobblers still in the game.";
    return (
      '<section data-testid="pie" class="g-stack-lg">' +
      '<p class="g-kicker">Pie time</p>' +
      '<h1 class="g-title" style="font-size:2.6rem">Last vote</h1>' +
      "<p class=\"g-lede\">" + need + " Lock it in. If the table's most common answer is right, the Pilgrims win.</p>" +
      '<p class="g-big-timer" data-countdown data-ends="' + pie.endsAt + '">' + fmt(Math.max(0, pie.endsAt - serverNow())) + "</p>" +
      '<p class="g-help">' + pie.lockedCount + " of " + pie.playerCount + " phones locked in.</p>" +
      '<div class="g-stack">' + people + "</div>" +
      (pie.locked
        ? '<p class="g-banner">Locked in. Waiting on the rest of the table.</p>'
        : '<button type="button" class="g-btn g-btn-honey" data-testid="pie-lock" data-act="pie-lock">Lock in my answer</button>') +
      (view.youCanManage ? '<button type="button" class="g-btn g-btn-ghost" data-act="close-pie">Close the vote now</button>' : "") +
      "</section>"
    );
  }

  function awardsHtml() {
    var recap = view.recap;
    if (!recap.awards.length) return "";
    return recap.awards.map(function (award, index) {
      return (
        '<article class="g-card g-award">' +
        '<p class="g-label">Family award</p><h3>' + esc(award.title) + "</h3>" +
        '<p class="g-who-name">' + esc(award.names.join(", ")) + "</p>" +
        "<p>" + esc(award.detail) + "</p>" +
        '<div class="g-choice">' +
        '<button type="button" class="g-btn g-btn-honey g-btn-small" data-act="share-award" data-index="' + index + '">Share</button>' +
        '<button type="button" class="g-btn g-btn-ghost g-btn-small" data-act="save-award" data-index="' + index + '">Save image</button>' +
        "</div></article>"
      );
    }).join("");
  }

  function recapHtml() {
    var rows = view.recap.players.slice().sort(function (a, b) { return b.points - a.points; }).map(function (p) {
      var missions = p.missions.map(function (m) {
        return '<p class="g-mission-line' + (m.done ? " is-done" : "") + '">Course ' + m.round + ": " + esc(m.text) + (m.done ? " · done" : " · not done") + "</p>";
      }).join("") || "<p>No missions this game.</p>";
      var bits = (p.pointLog || []).map(function (line) {
        return "<li>" + esc(line.reason) + ": " + (line.amount > 0 ? "+" : "") + line.amount + "</li>";
      }).join("");
      return (
        "<details" + (p.id === view.you.id ? " open" : "") + ">" +
        "<summary>" + esc(p.name) + " · " + esc(p.roleLabel) + " · " + p.points + " pts</summary>" +
        "<p>" + (p.caught ? "Caught. " : (!p.alive ? "Voted out. " : "Still at the table. ")) + esc(p.teamLabel) + " team.</p>" +
        (bits ? "<ul>" + bits + "</ul>" : "") +
        missions +
        "</details>"
      );
    }).join("");
    return '<div class="g-card g-recap"><p class="g-label">Every role, every mission</p>' + rows + "</div>";
  }

  function endHtml() {
    var pilgrims = view.winner === "pilgrims";
    var again = view.youCanManage
      ? '<button type="button" class="g-btn g-btn-honey" data-act="ask-rematch">Same table, play again</button>'
      : '<p class="g-help">The host can deal a new game on this code.</p>';
    return (
      '<section data-testid="end" class="g-stack-lg">' +
      '<p class="g-kicker">' + (pilgrims ? "Pilgrims win" : "Gobblers win") + "</p>" +
      '<h1 class="g-title" style="font-size:2.7rem">' + (pilgrims ? "Dessert is safe." : "The feast is gone.") + "</h1>" +
      '<p class="g-lede">' + esc(view.winReason) + "</p>" +
      awardsHtml() +
      '<div class="g-xmas"><h2>Play again at Christmas</h2><p>The plates are clear. The stories are not. Same phones, new alibis, leftover pie energy.</p>' +
      '<button type="button" class="g-btn g-btn-honey" data-act="share-christmas">Share the Christmas invite</button></div>' +
      '<div class="g-card"><p class="g-label">Points</p>' +
      view.recap.players.slice().sort(function (a, b) { return b.points - a.points; }).map(function (p) {
        return '<div class="g-row"><span class="g-name">' + esc(p.name) + "</span><span class=\"g-points\">" + p.points + "</span></div>";
      }).join("") + "</div>" +
      recapHtml() +
      '<button type="button" class="g-btn g-btn-ghost" data-act="share-recap">Share the recap</button>' +
      again +
      '<section class="final g-news" id="newsletter">' +
      '<div class="container">' +
      '<h2 class="final-headline">Tuesday mornings. Real numbers. Better trips.</h2>' +
      '<p class="final-sub">The Gobbler is free. The Tuesday email is where the trip math lives. One email a week. No card schemes.</p>' +
      '<form class="capture capture-final" data-source="gobbler-end" novalidate>' +
      '<label class="sr-only" for="email-gobbler">Email address</label>' +
      '<input id="email-gobbler" name="email" type="email" inputmode="email" autocomplete="email" placeholder="your@email.com" required />' +
      '<button type="submit" class="btn btn-honey-on-navy">Get the Tuesday brief</button>' +
      '<p class="trust trust-light">We won&rsquo;t sell your email. Ever.</p>' +
      '<p class="form-msg" aria-live="polite"></p>' +
      "</form></div></section>" +
      "</section>"
    );
  }

  function sheetHtml() {
    if (ui.confirm) {
      return (
        '<div class="g-sheet" data-testid="confirm"><div class="g-sheet-inner g-stack">' +
        "<h2>" + esc(ui.confirm.title) + "</h2><p>" + esc(ui.confirm.text) + "</p>" +
        '<button type="button" class="g-btn g-btn-honey" data-act="confirm-yes">Yes</button>' +
        '<button type="button" class="g-btn g-btn-ghost" data-act="confirm-no">Not yet</button></div></div>'
      );
    }
    if (ui.rules) {
      return '<div class="g-overlay"><div class="g-overlay-inner g-stack"><button type="button" class="g-btn g-btn-ghost" data-act="close-rules">Back to the table</button>' + rulesHtml() + "</div></div>";
    }
    if (ui.accuse) {
      var choices = view.players.filter(function (p) { return p.alive && p.id !== view.you.id; }).map(function (p) {
        return '<button type="button" class="g-person" data-act="accuse" data-id="' + esc(p.id) + '">' + esc(p.name) + "</button>";
      }).join("");
      return '<div class="g-sheet" data-testid="accuse"><div class="g-sheet-inner g-stack"><h2>Who is the Gobbler?</h2><p>This starts a 60 second vote on every phone.</p>' + choices +
        '<button type="button" class="g-btn g-btn-ghost" data-act="close-accuse">Cancel</button></div></div>';
    }
    if (ui.peekPick || ui.shieldPick) {
      var act = ui.peekPick ? "peek" : "shield";
      var people = view.players.filter(function (p) {
        if (ui.peekPick && p.id === view.you.id) return false;
        return ui.shieldPick ? p.alive : true;
      }).map(function (p) {
        return '<button type="button" class="g-person" data-act="' + act + '" data-id="' + esc(p.id) + '">' + esc(p.name) + "</button>";
      }).join("");
      return '<div class="g-sheet"><div class="g-sheet-inner g-stack"><h2>' + (ui.peekPick ? "Peek at whom?" : "Who gets the shield?") + "</h2>" + people +
        '<button type="button" class="g-btn g-btn-ghost" data-act="close-sheet">Cancel</button></div></div>';
    }
    return "";
  }

  function landingHtml() {
    var preset = roomFromUrl();
    var saved = session();
    var rejoin = saved
      ? '<div class="g-card g-stack"><p>This phone was at table <strong>' + esc(saved.code) + "</strong> as " + esc(saved.name) + ".</p>" +
        '<button type="button" class="g-btn g-btn-navy" data-act="rejoin">Rejoin the table</button>' +
        '<button type="button" class="g-linkish" data-act="forget">Forget this phone</button></div>'
      : "";
    return (
      '<section data-testid="landing" class="g-stack-lg">' +
      '<div><p class="g-kicker">Play it during dinner</p><h1 class="g-title">The Gobbler</h1>' +
      '<p class="g-lede">Someone at the table is <em>eating the feast.</em> A phone game for Thanksgiving. Secret roles. Secret missions. No app, no account, no TV.</p></div>' +
      (ui.error ? '<p class="g-error" role="alert">' + esc(ui.error) + "</p>" : "") +
      (ui.toast ? '<p class="' + (ui.toastBad ? "g-error" : "g-toast g-toast-ok") + '" role="status">' + esc(ui.toast) + "</p>" : "") +
      rejoin +
      '<form class="g-card g-stack" data-form="create">' +
      '<label class="g-label" for="host-name">Your name</label>' +
      '<input class="g-input" id="host-name" name="name" maxlength="20" autocomplete="off" enterkeyhint="go" required placeholder="Alex" />' +
      '<button class="g-btn g-btn-honey" type="submit"' + (ui.busy ? " disabled" : "") + ">" + (ui.busy ? "Setting the table..." : "Start a table") + "</button></form>" +
      '<form class="g-card g-stack" data-form="join">' +
      '<label class="g-label" for="join-code">Room code</label>' +
      '<input class="g-input" id="join-code" name="code" maxlength="4" autocapitalize="characters" autocomplete="off" value="' + esc(preset) + '" placeholder="AB3K" required />' +
      '<label class="g-label" for="join-name">Your name</label>' +
      '<input class="g-input" id="join-name" name="name" maxlength="20" autocomplete="off" placeholder="Sam" required />' +
      '<button class="g-btn g-btn-navy" type="submit"' + (ui.busy ? " disabled" : "") + ">Join with a code</button></form>" +
      '<button type="button" class="g-btn g-btn-ghost" data-act="howto">How to play</button>' +
      '<ol class="g-steps">' +
      '<li><span class="g-num">1</span><span>One phone starts a table and shares a short code.</span></li>' +
      '<li><span class="g-num">2</span><span>Hold your card close. You are a Pilgrim, or you are the Gobbler.</span></li>' +
      '<li><span class="g-num">3</span><span>Do your secret mission. Gobblers eat a dish when they finish.</span></li>' +
      '<li><span class="g-num">4</span><span>Hit Gobble! if you think you know. At pie time, name them.</span></li>' +
      "</ol>" +
      '<p class="g-help">A free table game from <a href="/">Vacation Math</a>. The Tuesday email still does the trip math.</p>' +
      "</section>"
    );
  }

  function howtoHtml() {
    return '<section data-testid="howto" class="g-stack"><button type="button" class="g-btn g-btn-ghost" data-act="back">Back</button><p class="g-kicker">How to play</p><h1 class="g-title" style="font-size:2.6rem">The rules</h1>' + rulesHtml() + "</section>";
  }

  function shell(inner, playing) {
    var offline = mode === "game" && session() && (!ws || ws.readyState !== 1)
      ? '<p class="g-status">Reconnecting this phone...</p>'
      : "";
    var toastHtml = ui.toast && mode === "game"
      ? '<p class="' + (ui.toastBad ? "g-error" : "g-toast g-toast-ok") + '" role="status">' + esc(ui.toast) + "</p>"
      : "";
    var tools = mode === "game" && view
      ? '<div class="g-topbar"><button type="button" class="g-linkish" data-act="rules">How to play</button><span class="g-tag">' + esc(view.code) + "</span></div>"
      : "";
    app.className = "gobbler-app" + (playing ? " is-playing" : "");
    app.innerHTML = offline + tools + toastHtml + inner + sheetHtml();
    document.body.classList.toggle("gobbler-lock", !!(ui.rules || (view && (view.phase === "vote" || view.phase === "pie"))));
  }

  function paint() {
    if (ui.holding) return;
    if (mode === "howto") { shell(howtoHtml(), false); return; }
    if (mode !== "game" || !view) { shell(landingHtml(), false); return; }
    var body = "";
    var playing = false;
    if (view.phase === "lobby") body = lobbyHtml();
    else if (view.phase === "reveal") body = revealHtml();
    else if (view.phase === "vote") {
      body = '<div class="g-overlay"><div class="g-overlay-inner">' + voteHtml() + "</div></div>";
      playing = false;
    } else if (view.phase === "pie") {
      body = '<div class="g-overlay"><div class="g-overlay-inner">' + pieHtml() + "</div></div>";
    }
    else if (view.phase === "ended") body = endHtml();
    else { body = roundHtml(); playing = view.you.alive && !ui.accuse && !ui.confirm && !ui.rules && !ui.peekPick && !ui.shieldPick; }
    shell(body, playing);
    if (playing) {
      var bar = document.createElement("div");
      bar.className = "g-bar";
      bar.innerHTML = '<button type="button" class="g-btn g-btn-danger" data-testid="gobble" data-act="open-accuse">Gobble!</button>';
      app.appendChild(bar);
    }
  }

  function ask(action, title, text) {
    ui.confirm = { action: action, title: title, text: text };
    paint();
  }

  function awardAt(index) {
    if (!view || !view.recap) return null;
    return view.recap.awards[index] || null;
  }

  function wrapText(ctx, text, x, y, max, lineHeight) {
    var words = String(text).split(" ");
    var line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > max && line) {
        ctx.fillText(line, x, y);
        line = words[i];
        y += lineHeight;
      } else line = test;
    }
    if (line) ctx.fillText(line, x, y);
    return y + lineHeight;
  }

  function drawCard(opts) {
    var canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FBF7EF";
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = "#0E2A47";
    ctx.fillRect(0, 0, 1080, 280);
    ctx.fillStyle = "#E6A340";
    ctx.fillRect(0, 280, 1080, 14);
    ctx.fillStyle = "#E6A340";
    ctx.font = "700 28px Inter, sans-serif";
    ctx.fillText("VACATION MATH", 80, 110);
    ctx.fillStyle = "#FBF7EF";
    ctx.font = "700 84px Fraunces, Georgia, serif";
    ctx.fillText("The Gobbler", 80, 210);
    ctx.fillStyle = "#8C2F39";
    ctx.font = "800 26px Inter, sans-serif";
    ctx.fillText(opts.kicker || "THANKSGIVING", 80, 390);
    ctx.fillStyle = "#0E2A47";
    ctx.font = "700 78px Fraunces, Georgia, serif";
    var y = wrapText(ctx, opts.title, 80, 490, 920, 88);
    ctx.fillStyle = "#C4501A";
    ctx.font = "750 42px Inter, sans-serif";
    y = wrapText(ctx, opts.name || "", 80, y + 20, 920, 52);
    ctx.fillStyle = "#3D3A36";
    ctx.font = "500 36px Inter, sans-serif";
    wrapText(ctx, opts.detail || "", 80, y + 24, 920, 50);
    ctx.fillStyle = "#0E2A47";
    ctx.fillRect(0, 1140, 1080, 210);
    ctx.fillStyle = "#E6A340";
    ctx.font = "700 40px Fraunces, Georgia, serif";
    ctx.fillText("Play again at Christmas", 80, 1230);
    ctx.fillStyle = "#FBF7EF";
    ctx.font = "600 32px Inter, sans-serif";
    ctx.fillText("vacationmath.co/gobbler", 80, 1288);
    return canvas;
  }

  function cardBlob(canvas) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, "image/png"); });
  }

  function shareCard(opts) {
    var canvas = drawCard(opts);
    var text = opts.title + ": " + (opts.name || "") + ". " + (opts.detail || "") + " Play again at Christmas: https://vacationmath.co/gobbler";
    return cardBlob(canvas).then(function (blob) {
      var file = new File([blob], "the-gobbler.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: "The Gobbler", text: text });
      }
      if (opts.save || !navigator.share) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "the-gobbler.png";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
        return;
      }
      return navigator.share({ title: "The Gobbler", text: text, url: "https://vacationmath.co/gobbler" });
    }).catch(function (err) {
      if (err && err.name === "AbortError") return;
      toast("Couldn't share from this phone. Try Save image.", true);
    });
  }

  function onClick(e) {
    var btn = e.target.closest("[data-act]");
    if (!btn || !app.contains(btn)) return;
    var act = btn.dataset.act;
    if (act === "howto") { mode = "howto"; paint(); return; }
    if (act === "back" || act === "close-rules") { ui.rules = false; mode = view ? "game" : "landing"; paint(); return; }
    if (act === "rules") { ui.rules = true; paint(); return; }
    if (act === "forget") { clearSession(); stopNet(); view = null; paint(); return; }
    if (act === "rejoin") { connect(); pullState(); return; }
    if (act === "copy-link" && view) { copyText(joinUrl(view.code)); return; }
    if (act === "share-link" && view) {
      var url = joinUrl(view.code);
      var text = "Pull up a chair at The Gobbler. Code " + view.code + ".";
      if (navigator.share) navigator.share({ title: "Join The Gobbler", text: text, url: url }).catch(function () { copyText(url); });
      else copyText(url);
      return;
    }
    if (act === "gobblers") { send({ type: "settings", gobblerCount: Number(btn.dataset.value) }); return; }
    if (act === "toggle") {
      var key = btn.dataset.key;
      var payload = { type: "settings" };
      payload[key] = btn.getAttribute("aria-checked") !== "true";
      send(payload);
      return;
    }
    if (act === "remove") { send({ type: "remove_player", targetId: btn.dataset.id }); return; }
    if (act === "leave") { ask({ type: "leave" }, "Leave the table?", "You can join again with the code before dinner starts."); return; }
    if (act === "start") { send({ type: "start" }); return; }
    if (act === "ready") { send({ type: "ready" }); return; }
    if (act === "begin") { send({ type: "begin_feast" }); return; }
    if (act === "peek-3") {
      ui.revealUntil = Date.now() + 3000;
      ui.hasPeeked = true;
      paint();
      setTimeout(function () { if (!ui.holding) paint(); }, 3100);
      return;
    }
    if (act === "complete") { send({ type: "complete_mission" }); return; }
    if (act === "open-accuse") { ui.accuse = true; paint(); return; }
    if (act === "close-accuse" || act === "close-sheet") { ui.accuse = false; ui.peekPick = false; ui.shieldPick = false; paint(); return; }
    if (act === "accuse") { ui.accuse = false; send({ type: "accuse", targetId: btn.dataset.id }); return; }
    if (act === "vote") { send({ type: "vote", choice: btn.dataset.choice }); return; }
    if (act === "open-peek") { ui.peekPick = true; paint(); return; }
    if (act === "peek") { ui.peekPick = false; send({ type: "peek", targetId: btn.dataset.id }); return; }
    if (act === "open-shield") { ui.shieldPick = true; paint(); return; }
    if (act === "shield") { ui.shieldPick = false; send({ type: "shield", targetId: btn.dataset.id }); return; }
    if (act === "ask-advance") { ask({ type: "advance" }, "Next course?", "Everyone gets a new secret mission. Unfinished ones stay unfinished."); return; }
    if (act === "ask-pie") { ask({ type: "pie_time" }, "Call pie time?", "This is the last vote. The table names the Gobblers still in the game."); return; }
    if (act === "pie-pick") { send({ type: "pie_pick", targetId: btn.dataset.id }); return; }
    if (act === "pie-lock") { send({ type: "pie_lock" }); return; }
    if (act === "close-pie") { send({ type: "close_pie" }); return; }
    if (act === "ask-rematch") { ask({ type: "rematch" }, "Deal a new game?", "Same phones, fresh roles, the whole feast comes back."); return; }
    if (act === "confirm-no") { ui.confirm = null; paint(); return; }
    if (act === "confirm-yes" && ui.confirm) {
      var action = ui.confirm.action;
      ui.confirm = null;
      send(action);
      return;
    }
    if (act === "mute") {
      localStorage.setItem(MUTE_KEY, muted() ? "0" : "1");
      paint();
      return;
    }
    if (act === "share-award" || act === "save-award") {
      var award = awardAt(Number(btn.dataset.index));
      if (!award) return;
      shareCard({
        kicker: "FAMILY AWARD",
        title: award.title,
        name: award.names.join(" and "),
        detail: award.detail,
        save: act === "save-award"
      });
      return;
    }
    if (act === "share-christmas") {
      shareCard({
        kicker: "SEE YOU AT CHRISTMAS",
        title: "Play again at Christmas",
        name: "Same table. New secrets.",
        detail: "The Gobbler comes back with the pie. vacationmath.co/gobbler"
      });
      return;
    }
    if (act === "share-recap" && view && view.recap) {
      var lines = [
        view.winner === "pilgrims" ? "The Pilgrims saved dessert." : "The Gobblers ate the feast.",
        view.winReason,
        ""
      ];
      view.recap.awards.forEach(function (award) {
        lines.push(award.title + ": " + award.names.join(", "));
      });
      lines.push("", "Play again at Christmas: https://vacationmath.co/gobbler");
      var text = lines.join("\n");
      if (navigator.share) navigator.share({ title: "The Gobbler", text: text }).catch(function () { copyText(text); });
      else copyText(text);
    }
  }

  app.addEventListener("click", onClick);
  app.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || !form.dataset || !form.dataset.form) return;
    e.preventDefault();
    var data = new FormData(form);
    if (form.dataset.form === "create") createTable(String(data.get("name") || ""));
    if (form.dataset.form === "join") {
      var code = String(data.get("code") || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      joinTable(code, String(data.get("name") || ""));
    }
  });
  app.addEventListener("input", function (e) {
    if (e.target && e.target.dataset.act === "minutes") {
      var label = document.getElementById("g-minutes");
      if (label) label.textContent = e.target.value + " min";
    }
  });
  app.addEventListener("change", function (e) {
    if (e.target && e.target.dataset.act === "minutes") {
      send({ type: "settings", roundMinutes: Number(e.target.value) });
    }
  });
  app.addEventListener("pointerdown", function (e) {
    var card = e.target.closest("[data-hold]");
    if (!card || !app.contains(card)) return;
    ui.holding = true;
    ui.hasPeeked = true;
    heldCard = card;
    card.classList.add("is-open");
    var face = card.querySelector(".g-role-face");
    if (face) face.setAttribute("aria-hidden", "false");
    if (card.dataset.testid === "role-card" && view && view.you && view.you.role) {
      card.setAttribute("data-role", view.you.role);
    }
    var ready = app.querySelector("[data-act='ready']");
    if (ready) ready.disabled = !!view.you.ready;
  });
  app.addEventListener("contextmenu", function (e) {
    if (e.target.closest("[data-hold]")) e.preventDefault();
  });

  function releaseHold() {
    if (!ui.holding) return;
    ui.holding = false;
    if (heldCard) {
      heldCard.classList.remove("is-open");
      heldCard.removeAttribute("data-role");
      var face = heldCard.querySelector(".g-role-face");
      if (face) face.setAttribute("aria-hidden", "true");
      heldCard = null;
    }
    paint();
  }
  window.addEventListener("pointerup", releaseHold);
  window.addEventListener("pointercancel", releaseHold);

  setInterval(function () {
    var nodes = app.querySelectorAll("[data-countdown]");
    for (var i = 0; i < nodes.length; i++) {
      var ends = Number(nodes[i].dataset.ends || 0);
      nodes[i].textContent = ends ? fmt(Math.max(0, ends - serverNow())) : "Paused";
    }
  }, 250);

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && session()) {
      pullState();
      openSocket();
    }
  });
  window.addEventListener("pageshow", function () {
    if (session()) { pullState(); openSocket(); }
  });

  var presetRoom = roomFromUrl();
  var saved = session();
  if (presetRoom && (!saved || saved.code !== presetRoom)) ui.joinOpen = true;
  if (saved && (!presetRoom || saved.code === presetRoom)) {
    mode = "game";
    connect();
    pullState();
  }
  paint();
})();
