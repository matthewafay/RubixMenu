export function setupHud({ onPlaceOrder, onRemove }) {
  const root = document.getElementById('hud');
  root.innerHTML = `
    <div class="hud-header">YOUR ORDER</div>
    <div class="hud-list" id="hud-list"></div>
    <div class="hud-empty" id="hud-empty">No items yet. Spin the cube and click stickers.</div>
    <div class="hud-totals">
      <div class="hud-line"><span>Subtotal</span><span id="hud-subtotal">$0.00</span></div>
      <div class="hud-line"><span>Tax (8%)</span><span id="hud-tax">$0.00</span></div>
      <div class="hud-line hud-total"><span>Total</span><span id="hud-total">$0.00</span></div>
    </div>
    <button class="hud-submit" id="hud-submit">Place Order</button>
    <div class="hud-toast" id="hud-toast"></div>
  `;

  document.getElementById('hud-submit').addEventListener('click', onPlaceOrder);

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.hud-remove');
    if (btn) onRemove(Number(btn.dataset.idx));
  });

  return {
    render: (cart) => render(root, cart),
    confirm: (orderNum) => confirm(root, orderNum),
    shake: () => shake(root),
    toast: (msg) => toast(root, msg),
  };
}

function render(root, cart) {
  const list = root.querySelector('#hud-list');
  const empty = root.querySelector('#hud-empty');
  list.innerHTML = '';

  if (cart.lines.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    cart.lines.forEach((line, idx) => {
      const el = document.createElement('div');
      el.className = 'hud-item';
      const mods = line.modifiers.length
        ? `<div class="hud-mods">${line.modifiers.map(m => escapeHtml(m.name)).join(' · ')}</div>`
        : '';
      el.innerHTML = `
        <div class="hud-name">${escapeHtml(line.name)}${mods}</div>
        <div class="hud-price">$${cart.lineTotal(line).toFixed(2)}</div>
        <button class="hud-remove" data-idx="${idx}" aria-label="Remove">×</button>
      `;
      list.appendChild(el);
    });
  }

  const subtotal = cart.subtotal();
  const tax = subtotal * 0.08;
  root.querySelector('#hud-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  root.querySelector('#hud-tax').textContent = `$${tax.toFixed(2)}`;
  root.querySelector('#hud-total').textContent = `$${(subtotal + tax).toFixed(2)}`;
}

function confirm(root, orderNum) {
  const overlay = document.createElement('div');
  overlay.className = 'hud-overlay';
  overlay.innerHTML = `
    <div class="hud-check">✓</div>
    <div class="hud-confirm">Order #${orderNum} placed!</div>
    <div class="hud-confirm-sub">Imaginary pizza is on its way.</div>
  `;
  root.appendChild(overlay);
  setTimeout(() => overlay.remove(), 3000);
}

function shake(root) {
  root.classList.remove('shake');
  void root.offsetWidth;
  root.classList.add('shake');
}

function toast(root, msg) {
  const el = root.querySelector('#hud-toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}
