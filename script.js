const STORAGE_KEY = 'kitchflow-mvp-v1';

const initialData = {
  orders: [
    { id: 2042, items: '2 bowls de frango', channel: 'Delivery', time: '12:18', status: 'Preparando', notes: '' },
    { id: 2043, items: '1 combo executivo', channel: 'Delivery', time: '12:28', status: 'Recebido', notes: '' },
    { id: 2044, items: '3 massas ao pesto', channel: 'Delivery', time: '12:02', status: 'Pronto', notes: '' },
    { id: 2045, items: '2 saladas da casa', channel: 'Delivery', time: '11:45', status: 'Expedido', notes: '' },
    { id: 2046, items: '1 bowl vegetariano', channel: 'Retirada', time: '12:36', status: 'Recebido', notes: '' }
  ],

  stock: [
    { id: 1, name: 'Frango', quantity: 1.2, minimum: 2, unit: 'kg', emoji: '🍗' },
    { id: 2, name: 'Tomate italiano', quantity: 3.5, minimum: 2, unit: 'kg', emoji: '🍅' },
    { id: 3, name: 'Embalagem kraft', quantity: 24, minimum: 20, unit: 'un.', emoji: '▤' },
    { id: 4, name: 'Arroz integral', quantity: 5, minimum: 1.5, unit: 'kg', emoji: '🌾' },
    { id: 5, name: 'Molho pesto', quantity: .4, minimum: 1, unit: 'L', emoji: '🥬' }
  ]
};

let data = loadData();
let currentFilter = 'Todos';
let searchTerm = '';
let toastTimer;

const statuses = ['Recebido', 'Preparando', 'Pronto', 'Expedido'];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(initialData);
  } catch {
    return structuredClone(initialData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderAll();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function showToast(message) {
  const toast = $('#toast');

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function statusClass(status) {
  return status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function statusBadge(status) {
  return `<span class="status ${statusClass(status)}">${status}</span>`;
}

function goTo(page) {
  $$('.page').forEach(el => {
    el.classList.toggle('active', el.id === `page-${page}`);
  });

  $$('[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  const names = {
    overview: 'Visão geral',
    orders: 'Pedidos',
    stock: 'Estoque',
    production: 'Produção'
  };

  $('#breadcrumbPage').textContent = names[page];
  $('#sidebar').classList.remove('open');

  if (page === 'orders') renderOrders();
  if (page === 'stock') renderStock();
  if (page === 'production') renderProduction();
}

function renderOverview() {
  const active = data.orders.filter(o =>
    o.status === 'Recebido' || o.status === 'Preparando'
  );

  const ready = data.orders.filter(o => o.status === 'Pronto');

  const late = data.orders.filter(o =>
    o.status === 'Preparando' && o.time < '12:00'
  );

  const low = data.stock.filter(i => i.quantity < i.minimum);

  $('#activeCount').textContent = String(active.length).padStart(2, '0');
  $('#lateCount').textContent = String(late.length).padStart(2, '0');
  $('#readyCount').textContent = String(ready.length).padStart(2, '0');
  $('#alertCount').textContent = String(low.length).padStart(2, '0');

  $('#overviewOrders').innerHTML = data.orders
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 4)
    .map(o => `
      <tr>
        <td>
          <span class="item-primary">#${o.id} · ${escapeHTML(o.channel)}</span>
          <span class="item-secondary">${escapeHTML(o.items)}</span>
        </td>
        <td>${o.time}</td>
        <td>${statusBadge(o.status)}</td>
      </tr>
    `)
    .join('') || '<tr><td colspan="3">Nenhum pedido cadastrado.</td></tr>';

  $('#attentionList').innerHTML = low.length
    ? low.map(i => `
        <div class="attention-item">
          <span class="attention-name">
            <span class="attention-emoji">${i.emoji || '📦'}</span>
            ${escapeHTML(i.name)}
          </span>
          <span class="attention-qty">
            ${formatQty(i.quantity)} ${escapeHTML(i.unit)}
          </span>
        </div>
      `).join('')
    : '<p class="item-secondary">Todos os insumos estão acima do mínimo.</p>';
}

function renderOrders() {
  const filtered = data.orders.filter(o =>
    (currentFilter === 'Todos' || o.status === currentFilter) &&
    (`${o.id} ${o.items} ${o.channel}`.toLowerCase().includes(searchTerm))
  );

  $('#ordersTable').innerHTML = filtered
    .slice()
    .sort((a, b) => b.id - a.id)
    .map(o => `
      <tr>
        <td>
          <span class="item-primary">#${o.id}</span>
        </td>
        <td>
          ${escapeHTML(o.items)}
          ${o.notes ? `<span class="item-secondary">${escapeHTML(o.notes)}</span>` : ''}
        </td>
        <td>${escapeHTML(o.channel)}</td>
        <td>${o.time}</td>
        <td>${statusBadge(o.status)}</td>
        <td>
          ${o.status !== 'Expedido'
            ? `<button class="action-button" data-advance="${o.id}">Avançar etapa</button>`
            : '<span class="item-secondary">Concluído</span>'
          }
        </td>
      </tr>
    `)
    .join('');

  $('#ordersEmpty').classList.toggle('hidden', filtered.length > 0);
  $('#orderResultCount').textContent = `${filtered.length} pedido(s)`;
}

function formatQty(value) {
  return Number(value).toLocaleString('pt-BR', {
    maximumFractionDigits: 2
  });
}

function renderStock() {
  const low = data.stock.filter(i => i.quantity < i.minimum).length;

  $('#stockTotal').textContent = String(data.stock.length).padStart(2, '0');
  $('#stockLow').textContent = String(low).padStart(2, '0');
  $('#stockOk').textContent = String(data.stock.length - low).padStart(2, '0');

  $('#stockTable').innerHTML = data.stock.map(i => {
    const isLow = i.quantity < i.minimum;

    const percent = i.minimum === 0
      ? 100
      : Math.min(100, (i.quantity / (i.minimum * 1.5)) * 100);

    return `
      <tr>
        <td>
          <span class="item-primary">
            ${i.emoji || '📦'} &nbsp;${escapeHTML(i.name)}
          </span>
        </td>
        <td class="quantity-cell">
          ${formatQty(i.quantity)} ${escapeHTML(i.unit)}
          <div class="progress ${isLow ? 'low' : ''}">
            <span style="width:${percent}%"></span>
          </div>
        </td>
        <td>${formatQty(i.minimum)} ${escapeHTML(i.unit)}</td>
        <td class="${isLow ? 'low-label' : 'ok-label'}">
          ${isLow ? '● Repor' : '● Adequado'}
        </td>
        <td>
          <button class="action-button" data-update-stock="${i.id}">
            Atualizar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderProduction() {
  const board = $('#kanbanBoard');

  board.innerHTML = statuses.map((status, index) => {
    const orders = data.orders
      .filter(o => o.status === status)
      .sort((a, b) => a.id - b.id);

    return `
      <section class="kanban-column">
        <div class="column-heading">
          <span>${status}</span>
          <span class="column-count">${orders.length}</span>
        </div>

        ${orders.map(o => `
          <article class="kanban-card">
            <h3>Pedido #${o.id}</h3>
            <p>
              ${escapeHTML(o.items)}<br>
              ${escapeHTML(o.channel)}
            </p>

            <div class="kanban-meta">
              <span>◷ ${o.time}</span>
              <span>${status}</span>
            </div>

            <button data-advance="${o.id}">
              ${index === 3 ? 'Concluído' : 'Avançar →'}
            </button>
          </article>
        `).join('') || '<p class="item-secondary">Nenhum pedido nesta etapa.</p>'}
      </section>
    `;
  }).join('');
}

function renderAll() {
  renderOverview();
  renderOrders();
  renderStock();
  renderProduction();
}

function advanceOrder(id) {
  const order = data.orders.find(o => o.id === Number(id));

  if (!order) return;

  const index = statuses.indexOf(order.status);

  if (index < 0 || index === statuses.length - 1) return;

  order.status = statuses[index + 1];

  saveData();

  showToast(`Pedido #${order.id} movido para ${order.status.toLowerCase()}.`);
}

$$('[data-page]').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.page));
});

$$('[data-go]').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.go));
});

$('#mobileMenu').addEventListener('click', () => {
  $('#sidebar').classList.toggle('open');
});

$('#globalSearch').addEventListener('input', event => {
  searchTerm = event.target.value.trim().toLowerCase();

  renderOrders();

  if (searchTerm) goTo('orders');
});

$('#orderFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');

  if (!button) return;

  currentFilter = button.dataset.filter;

  $$('[data-filter]').forEach(b => {
    b.classList.toggle('selected', b === button);
  });

  renderOrders();
});

document.addEventListener('click', event => {
  const advance = event.target.closest('[data-advance]');

  if (advance) {
    advanceOrder(advance.dataset.advance);
  }

  const update = event.target.closest('[data-update-stock]');

  if (update) {
    const item = data.stock.find(
      i => i.id === Number(update.dataset.updateStock)
    );

    if (!item) return;

    const form = $('#quantityForm');

    form.elements.id.value = item.id;
    form.elements.quantity.value = item.quantity;

    $('#quantityItemName').textContent = item.name;

    $('#quantityDialog').showModal();
  }
});

$('#newOrderBtn').addEventListener('click', () => {
  const form = $('#orderForm');

  form.reset();

  form.elements.time.value = new Date().toTimeString().slice(0, 5);

  $('#orderDialog').showModal();
});

$('#orderForm').addEventListener('submit', event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);

  const nextId = Math.max(2041, ...data.orders.map(o => o.id)) + 1;

  data.orders.unshift({
    id: nextId,
    items: form.get('items').trim(),
    channel: form.get('channel'),
    time: form.get('time'),
    status: 'Recebido',
    notes: form.get('notes').trim()
  });

  $('#orderDialog').close();

  saveData();
  goTo('orders');

  showToast(`Pedido #${nextId} cadastrado com sucesso.`);
});

$('#newStockBtn').addEventListener('click', () => {
  $('#stockForm').reset();
  $('#stockDialog').showModal();
});

$('#stockForm').addEventListener('submit', event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);

  data.stock.push({
    id: Math.max(0, ...data.stock.map(i => i.id)) + 1,
    name: form.get('name').trim(),
    quantity: Number(form.get('quantity')),
    minimum: Number(form.get('minimum')),
    unit: form.get('unit').trim(),
    emoji: '📦'
  });

  $('#stockDialog').close();

  saveData();

  showToast('Insumo adicionado ao estoque.');
});

$('#quantityForm').addEventListener('submit', event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);

  const item = data.stock.find(
    i => i.id === Number(form.get('id'))
  );

  if (item) {
    item.quantity = Number(form.get('quantity'));
  }

  $('#quantityDialog').close();

  saveData();

  showToast('Quantidade atualizada.');
});

$$('[data-close]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.close).close();
  });
});

$('#todayLabel').textContent = new Date().toLocaleDateString('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short'
});

renderAll();
