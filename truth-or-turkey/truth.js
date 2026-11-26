(function () {
  "use strict";

  var app = document.getElementById("app");
  var news = document.getElementById("tot-news");
  var live = document.getElementById("tot-live");
  var KEY = "vm-truth-session";
  var view = null;
  var mode = "landing";
  var ui = { error: "", toast: "", busy: false, confirm: null, showHost: false };
  var draft = { truth: "", turkey: "" };
  var draftRound = -1;
  var paintKey = "";
  var forcePaint = false;
  var offset = 0;
  var ws = null;
  var want = false;
  var backoff = 500;
  var pollTimer = null;
  var reconnectTimer = null;

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function session() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function saveSession(data) {
    localStorage.setItem(KEY, JSON.stringify({ code: data.code, playerId: data.playerId, token: data.token, name: data.name }));
  }
  function clearSession() { localStorage.removeItem(KEY); }
  function cleanCode(value) {
    return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  }
  function roomFromUrl() {
    var params = new URLSearchParams(location.search);
    return cleanCode(params.get("code") || params.get("room") || "");
  }
  function joinUrl(code) { return location.origin + "/truth-or-turkey/?code=" + code; }
  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function say(text) { if (live && text) live.textContent = text; }
  function toast(text) {
    ui.toast = text || "";
    forcePaint = true;
    paint();
    if (text) setTimeout(function () { ui.toast = ""; forcePaint = true; paint(); }, 3800);
  }

  function applyView(next) {
    if (!next) return;
    if (view && next.rev <= view.rev) return;
    if (!next.you) {
      stop();
      clearSession();
      view = null;
      mode = "landing";
      ui.error = "You left the table.";
      paint();
      return;
    }
    offset = (next.serverNow || Date.now()) - Date.now();
    var phaseChanged = !view || view.phase !== next.phase || (view.turn && next.turn && view.turn.authorId !== next.turn.authorId);
    view = next;
    mode = "game";
    if (phaseChanged && next.phase === "reveal" && next.reveal) say(next.reveal.authorName + " is revealed.");
    if (news) news.hidden = next.phase !== "ended";
    paint();
    if (next.phase === "ended" && news) news.scrollIntoView({ block: "nearest" });
  }

  function stop() {
    want = false;
    clearTimeout(reconnectTimer);
    clearInterval(pollTimer);
    pollTimer = null;
    if (ws) { try { ws.onclose = null; ws.close(); } catch (e) { /* ignore */ } ws = null; }
  }

  function connect() {
    var saved = session();
    if (!saved) return;
    want = true;
    pull();
    openSocket();
  }

  function ensurePoll() {
    if (pollTimer) return;
    pollTimer = setInterval(pull, 2000);
  }

  function openSocket() {
    var saved = session();
    if (!saved || !want) return;
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
    var proto = location.protocol === "https:" ? "wss:" : "ws:";
    var socket = new WebSocket(proto + "//" + location.host + "/api/truth/rooms/" + saved.code + "/ws?token=" + encodeURIComponent(saved.token));
    ws = socket;
    socket.onopen = function () {
      backoff = 500;
      clearInterval(pollTimer);
      pollTimer = null;
    };
    socket.onmessage = function (ev) {
      var msg; try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.type === "state") applyView(msg.view);
      if (msg.type === "error") toast(msg.text);
      if (msg.type === "pong" && msg.serverNow) offset = msg.serverNow - Date.now();
    };
    socket.onclose = function () {
      if (ws === socket) ws = null;
      if (want) {
        ensurePoll();
        clearTimeout(reconnectTimer);
        var wait = backoff;
        backoff = Math.min(5000, backoff * 2);
        reconnectTimer = setTimeout(function () { pull(); openSocket(); }, wait);
      }
    };
  }

  function pull() {
    var saved = session();
    if (!saved) return;
    fetch("/api/truth/rooms/" + saved.code + "/state?token=" + encodeURIComponent(saved.token), { cache: "no-store" })
      .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
      .then(function (result) {
        if ((result.status === 401 || result.status === 404) && !view) {
          stop(); clearSession(); mode = "landing";
          ui.error = (result.data && result.data.error) || "That table is gone.";
          paint();
          return;
        }
        if (result.data && result.data.view) applyView(result.data.view);
      }).catch(function () {});
  }

  function send(action) {
    if (ws && ws.readyState === 1) { ws.send(JSON.stringify(action)); return; }
    var saved = session();
    if (!saved) return;
    fetch("/api/truth/rooms/" + saved.code + "/action", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.assign({ token: saved.token }, action))
    }).then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.data && result.data.view) applyView(result.data.view);
        if (!result.ok) toast((result.data && result.data.error) || "That did not go through.");
      }).catch(function () { toast("We can't reach the table. Check your signal and try again."); });
  }

  function post(url, body) {
    return fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; }); });
  }

  function enter(data) {
    saveSession(data);
    history.replaceState(null, "", "/truth-or-turkey/?code=" + data.code);
    mode = "game";
    view = null;
    ui.error = "";
    paint();
    connect();
    pull();
  }

  function playersHtml(canKick) {
    return '<div class="tot-people">' + view.players.filter(function (p) { return !p.kicked; }).map(function (p) {
      var tags = "";
      if (p.isHost) tags += '<span class="tot-tag">Host</span>';
      if (p.locked && view.phase === "write") tags += '<span class="tot-tag">Ready</span>';
      if (p.isUp) tags += '<span class="tot-tag">Up</span>';
      var kick = canKick && !p.isHost
        ? '<button type="button" class="tot-x" data-act="kick" data-id="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">×</button>'
        : "";
      return '<div class="tot-row" data-testid="player" data-name="' + esc(p.name) + '"><div class="tot-who"><span class="tot-dot' + (p.connected ? " on" : "") + '"></span><span class="tot-name">' + esc(p.name) + "</span></div><div class=\"tot-who\">" + tags + '<span class="tot-score">' + p.points + "</span>" + kick + "</div></div>";
    }).join("") + "</div>";
  }

  function rulesBlock() {
    return '<ol class="tot-rules">' +
      '<li><span class="tot-num">1</span><span>Write one truth and one turkey, the fake.</span></li>' +
      '<li><span class="tot-num">2</span><span>Read both out loud for 30 seconds.</span></li>' +
      '<li><span class="tot-num">3</span><span>Everyone else taps the true one.</span></li>' +
      '<li><span class="tot-num">4</span><span>A point for each person you fool. A point for each truth you spot.</span></li>' +
      "</ol>";
  }

  function joinForm(preset) {
    var ready = preset.length === 4;
    return '<form class="tot-card tot-tight" data-form="join" data-testid="join"><label class="tot-label" for="join-code">Room code</label><input class="tot-input tot-code-input" id="join-code" name="code" maxlength="8" inputmode="text" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" data-len="' + preset.length + '" value="' + esc(preset) + '" placeholder="ABCD" required /><label class="tot-label" for="join-name">Your name</label><input class="tot-input" id="join-name" name="name" maxlength="20" autocomplete="given-name" placeholder="Sam" required /><button class="tot-btn tot-btn-navy" type="submit"' + (ready ? "" : " disabled") + ">Join with a code</button></form>";
  }

  function landingHtml() {
    var preset = roomFromUrl();
    var saved = session();
    var savedCard = saved ? '<div class="tot-card tot-tight"><p class="tot-now">You were ' + esc(saved.name) + " at " + esc(saved.code) + '.</p><button type="button" class="tot-btn tot-btn-navy" data-act="rejoin">Rejoin</button><button type="button" class="tot-link" data-act="forget">Forget this phone</button></div>' : "";
    var error = ui.error ? '<p class="tot-error" role="alert">' + esc(ui.error) + "</p>" : "";
    if (preset && !ui.showHost) {
      return '<section data-testid="join-step" class="tot-stack">' +
        '<div><p class="tot-kicker">Your table</p><h1 class="tot-title">Join in</h1><p class="tot-now">Type your name, then join.</p></div>' +
        error + savedCard + joinForm(preset) +
        '<div class="tot-actions"><button type="button" class="tot-link" data-act="show-host">Start a new table</button><button type="button" class="tot-link" data-act="howto">How to play</button></div></section>';
    }
    return '<section data-testid="landing" class="tot-stack">' +
      '<div><p class="tot-kicker">Thanksgiving table game</p><h1 class="tot-title">Truth or <em>Turkey</em></h1>' +
      '<p class="tot-lede">A bluff you play from your phone while you eat. Two lines each turn: one true, one made up. The table has to tell them apart.</p></div>' +
      rulesBlock() +
      '<p class="tot-rounds">Rounds, in order: Thankful, Thanksgivings past, Food confessions, Kid me. The host picks how many. Awards: Top Truth Teller and Biggest Turkey.</p>' +
      error + savedCard +
      '<form class="tot-card tot-tight" data-form="create"><label class="tot-label" for="host-name">Your name</label><input class="tot-input" id="host-name" name="name" maxlength="20" autocomplete="off" required placeholder="Alex" /><button class="tot-btn tot-btn-honey" type="submit">Start a table</button></form>' +
      joinForm("") +
      '<div class="tot-actions"><button type="button" class="tot-link" data-act="howto">How to play</button></div></section>';
  }

  function howtoHtml() {
    return '<section data-testid="howto" class="tot-stack"><div class="tot-actions"><button type="button" class="tot-link" data-act="back">Back</button></div>' +
      '<div><p class="tot-kicker">How to play</p><h1 class="tot-title">How a turn goes</h1><p class="tot-now">Read both stories. Then tap the true one.</p></div>' +
      rulesBlock() +
      '<p class="tot-rounds">Thankful. Thanksgivings past. Food confessions. Kid me. About 30 seconds to defend both, then the truth comes out.</p></section>';
  }

  function lobbyHtml() {
    var rounds = view.settings.rounds;
    var buttons = [1, 2, 3, 4].map(function (n) {
      return '<button type="button" class="tot-btn tot-btn-ghost' + (rounds === n ? " is-on" : "") + '" data-act="rounds" data-value="' + n + '">' + n + "</button>";
    }).join("");
    var themes = view.themes.map(function (t) { return esc(t.title); }).join(" · ");
    var away = view.players.filter(function (p) { return !p.connected && !p.kicked; });
    var blocker = view.players.filter(function (p) { return !p.kicked; }).length < 2
      ? "Need one more player."
      : (away.length ? "Waiting for " + away.map(function (p) { return p.name; }).join(", ") + " to connect." : "");
    var start = view.youCanManage
      ? '<button type="button" class="tot-btn tot-btn-honey" data-testid="start" data-act="start"' + (blocker ? " disabled" : "") + ">Start</button>" + (blocker ? '<p class="tot-help">' + esc(blocker) + "</p>" : "")
      : '<p class="tot-banner">Waiting for the host to start.</p>';
    return '<section data-testid="lobby" class="tot-stack"><div><p class="tot-kicker">Table code</p><h1 class="tot-code" data-testid="room-code">' + esc(view.code) + '</h1><p class="tot-now" style="text-align:center">Say each letter. Start when everyone is in.</p></div>' +
      '<div class="tot-actions"><button type="button" class="tot-link" data-act="copy">Copy link</button><button type="button" class="tot-link" data-act="share">Share</button></div>' +
      '<div class="tot-card"><p class="tot-label">' + view.players.filter(function (p) { return !p.kicked; }).length + " here</p>" + playersHtml(view.youCanManage) + "</div>" +
      '<div class="tot-card tot-tight"><p class="tot-label">Rounds</p><div class="tot-pills">' + buttons + '</div><p class="tot-rounds">' + themes + "</p></div>" +
      start + '<div class="tot-actions"><button type="button" class="tot-link" data-act="leave">Leave</button></div></section>';
  }

  function writeHtml() {
    if (draftRound !== view.round.index) {
      draftRound = view.round.index;
      draft = { truth: "", turkey: "" };
      try {
        var savedDraft = JSON.parse(sessionStorage.getItem("tot-draft-" + view.code + "-" + view.round.index) || "null");
        if (savedDraft) draft = { truth: savedDraft.truth || "", turkey: savedDraft.turkey || "" };
      } catch (e) { /* keep the empty draft */ }
    }
    var mine = view.you.submission;
    var locked = view.players.filter(function (p) { return p.locked && !p.kicked; }).length;
    var total = view.players.filter(function (p) { return !p.kicked; }).length;
    var body = mine
      ? '<div class="tot-card tot-tight"><p class="tot-ok">Locked in.</p><p class="tot-now"><strong>Truth.</strong> ' + esc(mine.truth) + "</p><p class=\"tot-now\"><strong>Turkey.</strong> " + esc(mine.turkey) + "</p></div>"
      : '<form class="tot-card tot-tight" data-form="write"><label class="tot-label" for="truth-box">The truth</label><textarea class="tot-area" id="truth-box" name="truth" maxlength="160" required placeholder="' + esc(view.round.truthHint) + '">' + esc(draft.truth) + '</textarea><label class="tot-label" for="turkey-box">The turkey</label><textarea class="tot-area" id="turkey-box" name="turkey" maxlength="160" required placeholder="' + esc(view.round.turkeyHint) + '">' + esc(draft.turkey) + '</textarea><button class="tot-btn tot-btn-honey" type="submit" data-testid="lock">Lock it in</button></form>';
    var skip = (view.you.sittingOut ? '<p class="tot-banner">You jumped in late. You play on the next round.</p>' : "") +
      '<div class="tot-actions">' +
      (view.youCanManage ? '<button type="button" class="tot-link" data-act="skip">Move on</button>' : "") +
      '<button type="button" class="tot-link" data-act="step-out">Step out</button></div>';
    return '<section data-testid="write" class="tot-stack"><div class="tot-head"><p class="tot-kicker">Round ' + view.round.number + " of " + view.round.total + '</p><span class="tot-tag">' + esc(view.code) + "</span></div>" +
      '<div><h1 class="tot-title">' + esc(view.round.title) + '</h1><p class="tot-now">Write one true line and one fake line.</p><p class="tot-help">' + esc(view.round.prompt) + "</p></div>" +
      '<p class="tot-help" data-locked-count>' + locked + " of " + total + " ready</p>" + body + skip +
      '<div class="tot-card">' + playersHtml(view.youCanManage) + "</div></section>";
  }

  function defendHtml() {
    var turn = view.turn;
    var cards = turn.statements.map(function (text, i) {
      var cls = "tot-statement" + (turn.yourVote === i ? " is-pick" : "");
      if (turn.youAreAuthor || view.you.sittingOut || turn.yourVote != null) return '<div class="' + cls + '">' + esc(text) + "</div>";
      return '<button type="button" class="' + cls + '" data-testid="pick" data-act="vote" data-pick="' + i + '">' + esc(text) + "</button>";
    }).join("");
    var note = view.you.sittingOut
      ? '<p class="tot-banner">You jumped in late. You play on the next round.</p>'
      : turn.youAreAuthor
      ? '<p class="tot-banner">Defend both out loud. Your truth is the ' + (turn.yourTruthPos === 0 ? "top" : "bottom") + " one.</p>"
      : (turn.yourVote != null ? '<p class="tot-ok">Vote in. ' + turn.votesIn + " of " + turn.voters + ".</p>" : '<p class="tot-now">Tap the one you think is true.</p>');
    var skip = '<div class="tot-actions">' +
      (view.youCanManage ? '<button type="button" class="tot-link" data-act="skip">Reveal now</button>' : "") +
      '<button type="button" class="tot-link" data-act="step-out">Step out</button></div>';
    return '<section data-testid="defend" class="tot-stack"><div><p class="tot-kicker">' + esc(turn.authorName) + " says</p>" +
      '<p class="tot-clock" data-countdown data-ends="' + (turn.endsAt || 0) + '">' + fmt(Math.max(0, (turn.endsAt || 0) - (Date.now() + offset))) + "</p></div>" +
      note + '<div class="tot-tight">' + cards + "</div>" + skip + '<div class="tot-card">' + playersHtml(view.youCanManage) + "</div></section>";
  }

  function revealHtml() {
    var reveal = view.reveal;
    var cards = reveal.statements.map(function (text, i) {
      var truth = i === reveal.truthPos;
      var cls = "tot-statement " + (truth ? "is-truth" : "is-turkey");
      return '<div class="' + cls + '"><span class="tot-mark">' + (truth ? "Truth" : "Turkey") + "</span>" + esc(text) + "</div>";
    }).join("");
    var fool = reveal.fooled.length ? esc(reveal.authorName) + " fooled " + reveal.fooled.length + "." : esc(reveal.authorName) + " fooled nobody.";
    var next = view.youCanManage ? '<button type="button" class="tot-btn tot-btn-honey" data-act="skip" data-testid="next">Next</button>' : '<p class="tot-now">Wait for the host to tap Next.</p>';
    return '<section data-testid="reveal" class="tot-stack"><div><p class="tot-kicker">The truth</p><h1 class="tot-title">' + esc(reveal.authorName) + '</h1><p class="tot-now">Green is true.</p></div>' +
      '<div class="tot-tight">' + cards + '</div><p class="tot-banner">' + fool + "</p>" + next + '<div class="tot-card">' + playersHtml(view.youCanManage) + "</div></section>";
  }

  function endHtml() {
    var recap = view.recap;
    var awards = (recap.awards || []).map(function (award, index) {
      return '<article class="tot-card tot-award"><p class="tot-label">Family award</p><h3>' + esc(award.title) + "</h3><p class=\"tot-name\">" + esc(award.names.join(", ")) + "</p><p>" + esc(award.detail) + '</p><button type="button" class="tot-btn tot-btn-honey" data-act="share-award" data-index="' + index + '">Share</button></article>';
    }).join("");
    var rows = recap.players.slice().sort(function (a, b) { return b.points - a.points; }).map(function (p) {
      return '<div class="tot-row"><span class="tot-name">' + esc(p.name) + "</span><span class=\"tot-score\">" + p.points + "</span></div>";
    }).join("");
    var again = view.youCanManage ? '<button type="button" class="tot-btn tot-btn-navy" data-act="rematch">Play again</button>' : '<p class="tot-now">The host can deal another game.</p>';
    return '<section data-testid="end" class="tot-stack"><div><p class="tot-kicker">Game over</p><h1 class="tot-title">Pass the pie.</h1><p class="tot-now">Share an award, or play again.</p></div>' +
      awards +
      '<div class="tot-card"><p class="tot-label">Scoreboard</p>' + rows + "</div>" +
      '<div class="tot-xmas"><h2>Play again at Christmas</h2><p>Same phones. New stories.</p><button type="button" class="tot-btn tot-btn-honey" data-act="share-christmas">Share the invite</button></div>' +
      again + "</section>";
  }

  function confirmHtml() {
    if (!ui.confirm) return "";
    return '<div class="tot-card tot-stack"><h2>' + esc(ui.confirm.title) + "</h2><p>" + esc(ui.confirm.text) + '</p><button type="button" class="tot-btn tot-btn-hot" data-act="confirm-yes">Yes</button><button type="button" class="tot-btn tot-btn-ghost" data-act="confirm-no">Not now</button></div>';
  }

  function captureDraft() {
    var truth = document.getElementById("truth-box");
    var turkey = document.getElementById("turkey-box");
    if (truth) draft.truth = truth.value;
    if (turkey) draft.turkey = turkey.value;
  }

  function paint() {
    captureDraft();
    var key = mode + ":" + (view ? view.phase + ":" + view.round.index + ":" + (view.turn ? view.turn.authorId : "") + ":" + (view.you && view.you.submission ? "1" : "0") : "");
    var el = document.activeElement;
    var typing = el && app.contains(el) && el.tagName === "TEXTAREA";
    if (typing && key === paintKey && !forcePaint) {
      var count = app.querySelector("[data-locked-count]");
      if (count && view && view.phase === "write") {
        var locked = view.players.filter(function (p) { return p.locked && !p.kicked; }).length;
        var total = view.players.filter(function (p) { return !p.kicked; }).length;
        count.textContent = locked + " of " + total + " ready";
      }
      return;
    }
    forcePaint = false;
    paintKey = key;
    document.body.classList.toggle("tot-playing", mode === "game" && !!view && view.phase !== "ended");
    var body = landingHtml();
    if (mode === "howto") body = howtoHtml();
    else if (mode === "game" && view) {
      if (ui.confirm) body = confirmHtml();
      else if (view.phase === "lobby") body = lobbyHtml();
      else if (view.phase === "write") body = writeHtml();
      else if (view.phase === "defend") body = defendHtml();
      else if (view.phase === "reveal") body = revealHtml();
      else if (view.phase === "ended") body = endHtml();
      else body = '<p class="tot-banner">Pulling up chairs...</p>';
    } else if (mode === "game") body = '<p class="tot-banner">Pulling up chairs...</p>';
    var toastHtml = ui.toast ? '<p class="tot-error" role="status">' + esc(ui.toast) + "</p>" : "";
    app.innerHTML = toastHtml + body;
    var joinName = document.getElementById("join-name");
    if (joinName && roomFromUrl() && !ui.showHost && document.activeElement === document.body) joinName.focus();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { toast("Copied."); });
    toast(text);
  }

  function wrapText(ctx, text, x, y, max, lineHeight) {
    var words = String(text).split(" ");
    var line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > max && line) { ctx.fillText(line, x, y); line = words[i]; y += lineHeight; }
      else line = test;
    }
    if (line) ctx.fillText(line, x, y);
  }

  function shareCard(opts) {
    var canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1350;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FBF7EF"; ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = "#0E2A47"; ctx.fillRect(0, 0, 1080, 260);
    ctx.fillStyle = "#E6A340"; ctx.font = "700 28px Inter, sans-serif"; ctx.fillText("VACATION MATH", 80, 100);
    ctx.fillStyle = "#FBF7EF"; ctx.font = "700 72px Fraunces, Georgia, serif"; ctx.fillText("Truth or Turkey", 80, 190);
    ctx.fillStyle = "#8C2F39"; ctx.font = "800 26px Inter, sans-serif"; ctx.fillText(opts.kicker || "THANKSGIVING", 80, 360);
    ctx.fillStyle = "#0E2A47"; ctx.font = "700 72px Fraunces, Georgia, serif";
    var y = 460;
    wrapText(ctx, opts.title, 80, y, 920, 84);
    ctx.fillStyle = "#3D3A36"; ctx.font = "600 36px Inter, sans-serif";
    wrapText(ctx, opts.detail || "", 80, 760, 920, 50);
    ctx.fillStyle = "#0E2A47"; ctx.fillRect(0, 1140, 1080, 210);
    ctx.fillStyle = "#E6A340"; ctx.font = "700 40px Fraunces, Georgia, serif"; ctx.fillText("Play again at Christmas", 80, 1230);
    ctx.fillStyle = "#FBF7EF"; ctx.font = "600 32px Inter, sans-serif"; ctx.fillText("vacationmath.co/truth-or-turkey", 80, 1288);
    canvas.toBlob(function (blob) {
      var file = new File([blob], "truth-or-turkey.png", { type: "image/png" });
      var text = opts.title + ". " + (opts.detail || "") + " Play again at Christmas: https://vacationmath.co/truth-or-turkey";
      if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: "Truth or Turkey", text: text }).catch(function () {});
      else if (navigator.share) navigator.share({ title: "Truth or Turkey", text: text, url: "https://vacationmath.co/truth-or-turkey" }).catch(function () {});
      else {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = "truth-or-turkey.png"; a.click();
      }
    }, "image/png");
  }

  app.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-act]");
    if (!btn || !app.contains(btn)) return;
    var act = btn.dataset.act;
    if (act === "howto") { mode = "howto"; paint(); return; }
    if (act === "show-host") { ui.showHost = true; history.replaceState(null, "", "/truth-or-turkey/"); paint(); return; }
    if (act === "back") { mode = view ? "game" : "landing"; paint(); return; }
    if (act === "forget") { clearSession(); stop(); view = null; paint(); return; }
    if (act === "rejoin") { connect(); pull(); return; }
    if (act === "copy" && view) { copyText(joinUrl(view.code)); return; }
    if (act === "share" && view) {
      var url = joinUrl(view.code);
      if (navigator.share) navigator.share({ title: "Truth or Turkey", text: "Pull up a chair. Code " + view.code, url: url }).catch(function () { copyText(url); });
      else copyText(url);
      return;
    }
    if (act === "rounds") { send({ type: "settings", rounds: Number(btn.dataset.value) }); return; }
    if (act === "start") { send({ type: "start" }); return; }
    if (act === "leave" || act === "step-out") {
      ui.confirm = { action: { type: "leave" }, title: "Step out?", text: "You leave this game. The table keeps going." };
      paint();
      return;
    }
    if (act === "kick") { ui.confirm = { action: { type: "kick", targetId: btn.dataset.id }, title: "Remove this player?", text: "They drop out of the rest of the game." }; paint(); return; }
    if (act === "confirm-no") { ui.confirm = null; paint(); return; }
    if (act === "confirm-yes" && ui.confirm) { var action = ui.confirm.action; ui.confirm = null; send(action); return; }
    if (act === "skip") { send({ type: "skip", phase: view && view.phase }); return; }
    if (act === "vote") { send({ type: "vote", pick: Number(btn.dataset.pick) }); return; }
    if (act === "rematch") { send({ type: "rematch" }); return; }
    if (act === "share-award" && view && view.recap) {
      var award = view.recap.awards[Number(btn.dataset.index)];
      if (award) shareCard({ kicker: "FAMILY AWARD", title: award.title, detail: award.names.join(" and ") + ". " + award.detail });
      return;
    }
    if (act === "share-christmas") shareCard({ kicker: "SEE YOU AT CHRISTMAS", title: "Play again at Christmas", detail: "Same phones. New stories. vacationmath.co/truth-or-turkey" });
  });

  app.addEventListener("input", function (e) {
    if (!e.target || !e.target.name) return;
    if (e.target.id === "join-code") {
      var next = cleanCode(e.target.value);
      var prev = Number(e.target.dataset.len || 0);
      e.target.dataset.len = String(next.length);
      if (e.target.value !== next) e.target.value = next;
      var form = e.target.form;
      var joinBtn = form && form.querySelector("button[type=submit]");
      if (joinBtn) joinBtn.disabled = next.length !== 4;
      var name = form && form.querySelector("[name=name]");
      if (prev < 4 && next.length === 4 && name && String(name.value || "").trim()) form.requestSubmit();
      else if (prev < 4 && next.length === 4 && name) name.focus();
      return;
    }
    if (e.target.name === "truth" || e.target.name === "turkey") {
      draft[e.target.name] = e.target.value;
      if (view) sessionStorage.setItem("tot-draft-" + view.code + "-" + view.round.index, JSON.stringify(draft));
    }
  });

  app.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || !form.dataset || !form.dataset.form) return;
    e.preventDefault();
    var data = new FormData(form);
    if (form.dataset.form === "create") {
      ui.busy = true;
      post("/api/truth/rooms", { name: String(data.get("name") || "") }).then(function (result) {
        ui.busy = false;
        if (!result.ok) { ui.error = (result.data && result.data.error) || "We couldn't open a table."; paint(); return; }
        enter(result.data);
      }).catch(function () { ui.busy = false; ui.error = "We can't reach the table. Check your signal and try again."; paint(); });
    }
    if (form.dataset.form === "join") {
      var code = cleanCode(data.get("code"));
      post("/api/truth/rooms/" + code + "/join", { name: String(data.get("name") || "") }).then(function (result) {
        if (!result.ok) { ui.error = (result.data && result.data.error) || "Check the code and try again."; paint(); return; }
        enter(result.data);
      }).catch(function () { ui.error = "We can't reach the table. Check your signal and try again."; paint(); });
    }
    if (form.dataset.form === "write") {
      draft.truth = String(data.get("truth") || "");
      draft.turkey = String(data.get("turkey") || "");
      send({ type: "submit", truth: draft.truth, turkey: draft.turkey });
    }
  });


  setInterval(function () {
    var nodes = app.querySelectorAll("[data-countdown]");
    for (var i = 0; i < nodes.length; i++) {
      var ends = Number(nodes[i].dataset.ends || 0);
      nodes[i].textContent = ends ? fmt(Math.max(0, ends - (Date.now() + offset))) : "0:00";
    }
  }, 250);

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && session()) { pull(); openSocket(); }
  });

  var saved = session();
  var preset = roomFromUrl();
  if (saved && (!preset || saved.code === preset)) { mode = "game"; connect(); pull(); }
  try {
    if (view) draft = JSON.parse(sessionStorage.getItem("tot-draft-" + view.code + "-" + (view.round ? view.round.index : 0)) || "{}");
  } catch (e) { draft = { truth: "", turkey: "" }; }
  paint();
})();
