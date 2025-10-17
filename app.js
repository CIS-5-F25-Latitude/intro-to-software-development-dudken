// Minimal loop and input to get you moving quickly.
// Replace this with your own tiny project or 2D game.

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Example state: a ball and a paddle
const state = {
  ball: { x: 60, y: 60, r: 10, vx: 2, vy: 2 },
  paddle: { x: 200, y: canvas.height - 20, w: 80, h: 10, speed: 4 },
  score: 0,
  running: true,
  keys: { left: false, right: false },
  // Betting system #3
  betting: {
    active: false,
    amount: 5,
    target: 10,
    placedAtScore: 0,
  },
};

// Input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') state.keys.left = true;
  if (e.key === 'ArrowRight') state.keys.right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') state.keys.left = false;
  if (e.key === 'ArrowRight') state.keys.right = false;
});

document.getElementById('btn-restart').addEventListener('click', () => restart());
document.getElementById('btn-place-bet').addEventListener('click', () => placeBet());

// Balance stored in localStorage via store helpers
const BALANCE_KEY = 'player_balance_v1';
function loadBalance() {
  return window.store.loadData(BALANCE_KEY, 100);
}
function saveBalance(v) {
  window.store.saveData(BALANCE_KEY, v);
}

function updateBalanceDisplay() {
  const bal = loadBalance();
  document.getElementById('balance').textContent = `Balance: $${bal}`;
}

function placeBet() {
  const amtEl = document.getElementById('bet-amount');
  const tgtEl = document.getElementById('bet-target');
  const amt = Math.max(1, Number(amtEl.value) || 0);
  const tgt = Math.max(1, Number(tgtEl.value) || 0);
  const bal = loadBalance();
  if (amt > bal) {
    showNotification('Insufficient balance to place that bet.', 'error');
    return;
  }
  // lock the bet
  state.betting.active = true;
  state.betting.amount = amt;
  state.betting.target = tgt;
  state.betting.placedAtScore = state.score;
  // deduct immediately
  saveBalance(bal - amt);
  updateBalanceDisplay();
  // provide simple feedback
  document.getElementById('btn-place-bet').textContent = 'Bet Placed';
}

function restart() {
  state.ball.x = 60; state.ball.y = 60; state.ball.vx = 2; state.ball.vy = 2;
  state.paddle.x = (canvas.width - state.paddle.w) / 2;
  state.score = 0;
  state.running = true;
  drawHud();
}

function update() {
  if (!state.running) return;

  // Paddle movement
  if (state.keys.left) state.paddle.x -= state.paddle.speed;
  if (state.keys.right) state.paddle.x += state.paddle.speed;
  state.paddle.x = window.utils.clamp(state.paddle.x, 0, canvas.width - state.paddle.w);

  // Ball movement
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Wall bounce
  if (state.ball.x - state.ball.r < 0 || state.ball.x + state.ball.r > canvas.width) {
    state.ball.vx = -state.ball.vx;
  }
  if (state.ball.y - state.ball.r < 0) {
    state.ball.vy = -state.ball.vy;
  }

  // Paddle collision (simple AABB vs circle check)
  if (state.ball.y + state.ball.r >= state.paddle.y &&
      state.ball.x >= state.paddle.x &&
      state.ball.x <= state.paddle.x + state.paddle.w &&
      state.ball.vy > 0) {
    state.ball.vy = -Math.abs(state.ball.vy);
    state.score += 1;
    drawHud();
  }

  // Missed ball → stop
  if (state.ball.y - state.ball.r > canvas.height) {
    state.running = false;
    // Resolve any active bet as a loss (already deducted)
    if (state.betting.active) {
      // bet already removed from balance when placed; just clear state
      state.betting.active = false;
      document.getElementById('btn-place-bet').textContent = 'Place Bet';
        // show result via in-page notification
        showNotification(`You lost the bet of $${state.betting.amount}.`, 'error');
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ball
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
  ctx.fill();

  // Paddle
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);

  if (!state.running) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Game Over — Press Restart', 110, canvas.height / 2);
  }
}

function drawHud() {
  const scoreEl = document.getElementById('score');
  scoreEl.textContent = `Score: ${state.score}`;
  // betting HUD: if active show remaining to target
  if (state.betting.active) {
    const remaining = Math.max(0, state.betting.target - state.score);
    const betInfo = ` (Bet $${state.betting.amount} target ${state.betting.target}, ${remaining} to go)`;
    scoreEl.textContent += betInfo;
    // check for win
    if (state.score >= state.betting.target) {
      // payout: 2x the stake (simple even odds)
      const payout = state.betting.amount * 2;
      const bal = loadBalance();
      saveBalance(bal + payout);
      updateBalanceDisplay();
      state.betting.active = false;
      document.getElementById('btn-place-bet').textContent = 'Place Bet';
      showNotification(`You hit the target! You win $${payout}.`, 'success');
    }
  }
}

// In-page accessible notifications (replace alert()).
function showNotification(message, type = 'info', options = {}) {
  const container = document.getElementById('notifications');
  if (!container) {
    // Fallback to alert if notifications container missing
    alert(message);
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const content = document.createElement('div');
  content.className = 'toast-content';
  content.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.innerHTML = '✕';
  closeBtn.addEventListener('click', () => {
    removeToast();
  });

  toast.appendChild(content);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  const ttl = typeof options.ttl === 'number' ? options.ttl : 4500;

  const removeToast = () => {
    if (!toast.parentNode) return;
    toast.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      if (toast.parentNode) container.removeChild(toast);
    }, 160);
  };

  // Entrance animation
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-6px)';
  requestAnimationFrame(() => {
    toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  if (ttl > 0) {
    setTimeout(removeToast, ttl);
  }
}

// --- Blackjack implementation (6-deck shoe) ---
const BJ = {
  shoe: [],
  discard: [],
  penetration: 0.25, // when to reshuffle (25% remaining)
  inPlay: false,
  player: { cards: [] },
  dealer: { cards: [] },
};

function makeShoe(decks = 6) {
  const faces = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const shoe = [];
  for (let d = 0; d < decks; d++) {
    for (const f of faces) {
      // 4 suits per face
      for (let s = 0; s < 4; s++) shoe.push(f);
    }
  }
  return window.utils.shuffle(shoe);
}

function ensureShoe() {
  if (BJ.shoe.length === 0 || BJ.shoe.length / (6 * 52) < BJ.penetration) {
    BJ.shoe = makeShoe(6);
    BJ.discard = [];
    showNotification('Shuffling shoe', 'info');
  }
}

function drawCard() {
  ensureShoe();
  const c = BJ.shoe.pop();
  BJ.discard.push(c);
  return c;
}

function cardValue(card) {
  if (card === 'A') return 11;
  if (['J','Q','K'].includes(card)) return 10;
  return Number(card);
}

function handValue(cards) {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    if (c === 'A') aces += 1;
    total += cardValue(c);
  }
  // reduce A from 11 to 1 if bust
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function renderCards(elId, cards) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  for (const c of cards) {
    const d = document.createElement('div');
    d.className = 'card';
    d.textContent = c;
    el.appendChild(d);
  }
}

// Wire up Blackjack buttons
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnNext = document.getElementById('btn-next-hand');

btnHit.addEventListener('click', () => {
  if (!BJ.inPlay) return;
  BJ.player.cards.push(drawCard());
  renderCards('player-cards', BJ.player.cards);
  const pv = handValue(BJ.player.cards);
  if (pv > 21) {
    // player bust
    finishHand('lose');
  }
});

btnStand.addEventListener('click', () => {
  if (!BJ.inPlay) return;
  // Dealer draws until 17 or higher
  let dv = handValue(BJ.dealer.cards);
  while (dv < 17) {
    BJ.dealer.cards.push(drawCard());
    dv = handValue(BJ.dealer.cards);
  }
  renderCards('dealer-cards', BJ.dealer.cards);
  // determine outcome
  const pv = handValue(BJ.player.cards);
  if (dv > 21 || pv > dv) finishHand('win');
  else if (pv === dv) finishHand('push');
  else finishHand('lose');
});

btnNext.addEventListener('click', () => {
  // reset UI for next hand
  BJ.inPlay = false;
  BJ.player.cards = [];
  BJ.dealer.cards = [];
  renderCards('player-cards', []);
  renderCards('dealer-cards', []);
  document.getElementById('bj-message').textContent = '';
  btnHit.disabled = true; btnStand.disabled = true; btnNext.disabled = true;
});

function startHand() {
  // requires an active bet
  if (!state.betting.active) {
    showNotification('Place a bet before starting a hand.', 'info');
    return;
  }
  ensureShoe();
  BJ.inPlay = true;
  BJ.player.cards = [drawCard(), drawCard()];
  BJ.dealer.cards = [drawCard(), drawCard()];
  renderCards('player-cards', BJ.player.cards);
  renderCards('dealer-cards', [BJ.dealer.cards[0], '?']);
  btnHit.disabled = false; btnStand.disabled = false; btnNext.disabled = true;
  const pv = handValue(BJ.player.cards);
  const dv = handValue(BJ.dealer.cards);
  // check blackjacks
  if (pv === 21 && dv !== 21) {
    finishHand('blackjack');
  } else if (pv === 21 && dv === 21) {
    finishHand('push');
  }
}

function finishHand(result) {
  // reveal dealer cards
  renderCards('dealer-cards', BJ.dealer.cards);
  btnHit.disabled = true; btnStand.disabled = true; btnNext.disabled = false;
  BJ.inPlay = false;
  const bet = state.betting.amount;
  let bal = loadBalance();
  if (result === 'win') {
    const payout = bet * 2; // stake returned + winnings
    bal += payout;
    saveBalance(bal);
    showNotification(`You win $${payout}!`, 'success');
    state.betting.active = false;
    document.getElementById('btn-place-bet').textContent = 'Place Bet';
  } else if (result === 'blackjack') {
    const payout = Math.round(bet * 2.5); // 3:2 payout
    bal += payout;
    saveBalance(bal);
    showNotification(`Blackjack! You win $${payout}!`, 'success');
    state.betting.active = false;
    document.getElementById('btn-place-bet').textContent = 'Place Bet';
  } else if (result === 'push') {
    // return stake
    bal += bet;
    saveBalance(bal);
    showNotification('Push — your stake is returned.', 'info');
    state.betting.active = false;
    document.getElementById('btn-place-bet').textContent = 'Place Bet';
  } else { // lose
    showNotification(`You lost $${bet}.`, 'error');
    state.betting.active = false;
    document.getElementById('btn-place-bet').textContent = 'Place Bet';
  }
  updateBalanceDisplay();
}

// Start hand automatically when bet placed
const origPlaceBet = placeBet;
placeBet = function() {
  origPlaceBet();
  // if bet placed successfully, start blackjack hand
  if (state.betting.active) {
    startHand();
  }
};

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

restart();
loop();

