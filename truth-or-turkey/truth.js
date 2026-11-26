(function () {
  "use strict";

  var app = document.getElementById("app");
  var news = document.getElementById("tot-news");
  var live = document.getElementById("tot-live");
  var KEY = "vm-truth-session";
  var view = null;
  var mode = "landing";
  var ui = { error: "", toast: "", busy: false, confirm: null };
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
  function roomFromUrl() {
    return (new URLSearchParams(location.search).get("room") || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }
  function joinUrl(code) { return location.origin + "/truth-or-turkey/?room=" + code; }
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
    history.replaceState(null, "", "/truth-or-turkey/?room=" + data.code);
    mode = "game";
    view = null;
    ui.error = "";
    paint();
    connect();
    pull();
  }

  function playersHtml(canKick) {
    return view.players.filter(function (p) { return !p.kicked; }).map(function (p) {
      var tags = "";
      if (p.isHost) tags += '<span class="tot-tag">Host</span>';
      if (p.locked && view.phase === "write") tags += '<span class="tot-tag">Ready</span>';
      if (p.isUp) tags += '<span class="tot-tag">Up</span>';
      var kick = canKick && !p.isHost
        ? '<button type="button" class="tot-x" data-act="kick" data-id="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">×</button>'
        : "";
      return '<div class="tot-row" data-testid="player" data-name="' + esc(p.name) + '"><div class="tot-who"><span class="tot-dot' + (p.connected ? " on" : "") + '"></span><span class="tot-name">' + esc(p.name) + '</span></div><div class="tot-who"><span class="tot-score">' + p.points + '</span>' + tags + kick + "</div></div>";
    }).join("");
  }

  function rulesBlock() {
    return '<ol class="tot-rules"><li><span class="tot-num">1</span><span>Write one true thing and one fake thing.</span></li><li><span class="tot-num">2</span><span>Everyone else votes which one is true.</span></li><li><span class="tot-num">3</span><span>You score if you fool them. They score if they spot it.</span></li></ol>';
  }

  function landingHtml() {
    var preset = roomFromUrl();
    var saved = session();
    return '<section data-testid="landing" class="tot-stack">' +
      '<div><p class="tot-kicker">Play it at the table</p><h1 class="tot-title">Truth or <em>Turkey</em></h1>' +
      '<p class="tot-lede">A phone game for Thanksgiving. No app. No account. No TV.</p></div>' +
      rulesBlock() +
      (ui.error ? '<p class="tot-error" role="alert">' + esc(ui.error) + "</p>" : "") +
      (saved ? '<div class="tot-card tot-stack"><p>This phone was ' + esc(saved.name) + " at table " + esc(saved.code) + '.</p><button type="button" class="tot-btn tot-btn-navy" data-act="rejoin">Rejoin</button><button type="button" class="tot-link" data-act="forget">Forget this phone</button></div>' : "") +
      '<form class="tot-card tot-stack" data-form="create"><label class="tot-label" for="host-name">Your name</label><input class="tot-input" id="host-name" name="name" maxlength="20" autocomplete="off" required placeholder="Alex" /><button class="tot-btn tot-btn-honey" type="submit">Start a table</button></form>' +
      '<form class="tot-card tot-stack" data-form="join"><label class="tot-label" for="join-code">Room code</label><input class="tot-input" id="join-code" name="code" maxlength="4" autocapitalize="characters" autocomplete="off" value="' + esc(preset) + '" placeholder="AB3K" required /><label class="tot-label" for="join-name">Your name</label><input class="tot-input" id="join-name" name="name" maxlength="20" autocomplete="off" placeholder="Sam" required /><button class="tot-btn tot-btn-navy" type="submit">Join with a code</button></form>' +
      '<button type="button" class="tot-btn tot-btn-ghost" data-act="howto">How to play</button></section>';
  }

  function howtoHtml() {
    return '<section data-testid="howto" class="tot-stack"><button type="button" class="tot-btn tot-btn-ghost" data-act="back">Back</button><p class="tot-kicker">How to play</p><h1 class="tot-title" style="font-size:2.4rem">Three steps</h1>' +
      rulesBlock() +
      '<div class="tot-card"><p class="tot-label">Four rounds, in order</p><p>Thankful. Thanksgivings past. Food confessions. Kid me. The host picks how many, from 1 to 4.</p><p>You have about 30 seconds to defend both stories out loud. Then the truth comes out.</p><p>1 point for every truth you spot. The storyteller gets 1 point for every person they fool.</p></div></section>';
  }

  function lobbyHtml() {
    var rounds = view.settings.rounds;
    var buttons = [1, 2, 3, 4].map(function (n) {
      return '<button type="button" class="tot-btn tot-btn-ghost' + (rounds === n ? " is-on" : "") + '" data-act="rounds" data-value="' + n + '">' + n + "</button>";
    }).join("");
    var themes = view.themes.map(function (t) { return "<li>" + esc(t.title) + "</li>"; }).join("");
    var away = view.players.filter(function (p) { return !p.connected && !p.kicked; });
    var blocker = view.players.filter(function (p) { return !p.kicked; }).length < 2
      ? "Need one more player."
      : (away.length ? "Waiting for " + away.map(function (p) { return p.name; }).join(", ") + " to connect." : "");
    var start = view.youCanManage
      ? '<button type="button" class="tot-btn tot-btn-honey" data-testid="start" data-act="start"' + (blocker ? " disabled" : "") + ">Start</button>" + (blocker ? '<p class="tot-help">' + esc(blocker) + "</p>" : "")
      : '<p class="tot-banner">Waiting for the host to start.</p>';
    return '<section data-testid="lobby" class="tot-stack"><p class="tot-kicker">Table code</p><h1 class="tot-code" data-testid="room-code">' + esc(view.code) + '</h1><p class="tot-help" style="text-align:center">Read it out loud, or send the link.</p>' +
      '<div class="tot-choice"><button type="button" class="tot-btn tot-btn-navy" data-act="copy">Copy link</button><button type="button" class="tot-btn tot-btn-ghost" data-act="share">Share</button></div>' +
      '<div class="tot-card"><p class="tot-label">' + view.players.length + " at the table</p>" + playersHtml(view.youCanManage) + "</div>" +
      '<div class="tot-card tot-stack"><p class="tot-label">How many rounds</p><div class="tot-choice tot-choice-4">' + buttons + "</div><ul>" + themes + "</ul></div>" +
      start + '<button type="button" class="tot-link" data-act="leave">Leave this table</button></section>';
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
      ? '<div class="tot-card"><p class="tot-ok">Locked in. Hang on for the others.</p><p><strong>Truth:</strong> ' + esc(mine.truth) + "</p><p><strong>Turkey:</strong> " + esc(mine.turkey) + "</p></div>"
      : '<form class="tot-card tot-stack" data-form="write"><label class="tot-label" for="truth-box">The truth</label><textarea class="tot-area" id="truth-box" name="truth" maxlength="160" required placeholder="' + esc(view.round.truthHint) + '">' + esc(draft.truth) + '</textarea><p class="tot-help">Example: ' + esc(view.round.truthHint) + '</p><label class="tot-label" for="turkey-box">The turkey</label><textarea class="tot-area" id="turkey-box" name="turkey" maxlength="160" required placeholder="' + esc(view.round.turkeyHint) + '">' + esc(draft.turkey) + '</textarea><p class="tot-help">Example: ' + esc(view.round.turkeyHint) + '</p><button class="tot-btn tot-btn-honey" type="submit" data-testid="lock">Lock it in</button></form>';
    var skip = (view.you.sittingOut ? '<p class="tot-banner">You jumped in late. You will write on the next round.</p>' : "") +
      (view.youCanManage ? '<button type="button" class="tot-btn tot-btn-ghost" data-act="skip">Move on</button><p class="tot-help">Anyone who has not locked in gets skipped this round.</p>' : "") +
      '<button type="button" class="tot-link" data-act="step-out">Step out</button>';
    return '<section data-testid="write" class="tot-stack"><div class="tot-top"><p class="tot-kicker">Round ' + view.round.number + " of " + view.round.total + '</p><span class="tot-tag">' + esc(view.code) + "</span></div>" +
      '<h1 class="tot-title" style="font-size:2.3rem">' + esc(view.round.title) + "</h1><p class=\"tot-lede\">" + esc(view.round.prompt) + "</p>" +
      '<p class="tot-help" data-locked-count>' + locked + " of " + total + " locked in</p>" + body + skip +
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
      ? '<p class="tot-banner">You jumped in late. Watch this one. You play on the next round.</p>'
      : turn.youAreAuthor
      ? '<p class="tot-banner">Defend both out loud. Your truth is the ' + (turn.yourTruthPos === 0 ? "top" : "bottom") + " one. Don't point.</p>"
      : (turn.yourVote != null ? '<p class="tot-ok">Vote in. ' + turn.votesIn + " of " + turn.voters + " voted.</p>" : '<p class="tot-help">Tap the one you think is true.</p>');
    var skip = view.youCanManage ? '<button type="button" class="tot-btn tot-btn-ghost" data-act="skip">Reveal now</button>' : "";
    skip += '<button type="button" class="tot-link" data-act="step-out">Step out</button>';
    return '<section data-testid="defend" class="tot-stack"><p class="tot-kicker">' + esc(turn.authorName) + " says</p>" +
      '<p class="tot-clock" data-countdown data-ends="' + (turn.endsAt || 0) + '">' + fmt(Math.max(0, (turn.endsAt || 0) - (Date.now() + offset))) + "</p>" +
      note + cards + skip + '<div class="tot-card">' + playersHtml(view.youCanManage) + "</div></section>";
  }

  function revealHtml() {
    var reveal = view.reveal;
    var cards = reveal.statements.map(function (text, i) {
      var cls = "tot-statement " + (i === reveal.truthPos ? "is-truth" : "is-turkey");
      return '<div class="' + cls + '">' + esc(text) + "</div>";
    }).join("");
    var fool = reveal.fooled.length ? esc(reveal.authorName) + " fooled " + esc(reveal.fooled.join(", ")) + "." : esc(reveal.authorName) + " fooled nobody.";
    var spot = reveal.spotted.length ? " " + esc(reveal.spotted.join(", ")) + " spotted the truth." : "";
    var next = view.youCanManage ? '<button type="button" class="tot-btn tot-btn-honey" data-act="skip" data-testid="next">Next</button>' : '<p class="tot-help">Next story comes up in a few seconds.</p>';
    return '<section data-testid="reveal" class="tot-stack"><p class="tot-kicker">The truth</p><h1 class="tot-title" style="font-size:2.2rem">' + esc(reveal.authorName) + "</h1>" +
      cards + '<p class="tot-banner">' + fool + spot + "</p>" + next + '<div class="tot-card">' + playersHtml(view.youCanManage) + "</div></section>";
  }

  function endHtml() {
    var recap = view.recap;
    var awards = (recap.awards || []).map(function (award, index) {
      return '<article class="tot-card tot-award"><p class="tot-label">Family award</p><h3>' + esc(award.title) + "</h3><p class=\"tot-name\">" + esc(award.names.join(", ")) + "</p><p>" + esc(award.detail) + '</p><button type="button" class="tot-btn tot-btn-honey" data-act="share-award" data-index="' + index + '">Share</button></article>';
    }).join("");
    var rows = recap.players.slice().sort(function (a, b) { return b.points - a.points; }).map(function (p) {
      return '<div class="tot-row"><span class="tot-name">' + esc(p.name) + "</span><span class=\"tot-score\">" + p.points + "</span></div>";
    }).join("");
    var again = view.youCanManage ? '<button type="button" class="tot-btn tot-btn-navy" data-act="rematch">Same table, play again</button>' : '<p class="tot-help">The host can deal a new game on this code.</p>';
    return '<section data-testid="end" class="tot-stack"><p class="tot-kicker">Game over</p><h1 class="tot-title" style="font-size:2.4rem">Pass the pie.</h1><p class="tot-lede">' + esc(view.winReason) + "</p>" +
      awards +
      '<div class="tot-xmas"><h2>Play again at Christmas</h2><p>Same phones. New stories. The turkey comes back with the leftovers.</p><button type="button" class="tot-btn tot-btn-honey" data-act="share-christmas">Share the Christmas invite</button></div>' +
      '<div class="tot-card"><p class="tot-label">Scoreboard</p>' + rows + "</div>" + again +
      '<p class="tot-help">The Tuesday email is just below, if you want the trip math too.</p></section>';
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
        count.textContent = locked + " of " + total + " locked in";
      }
      return;
    }
    forcePaint = false;
    paintKey = key;
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
      var code = String(data.get("code") || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
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
