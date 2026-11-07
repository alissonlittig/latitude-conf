import './style.css';
import { EVENT, DAYS, TRACKS, TRACK_LABEL, SPEAKERS, SESSIONS, TICKETS, FAQ } from './data.js';
import { filterSessions, conflicts, orderTotal, brl, countdown, toIcs } from './lib.js';

const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const spById = Object.fromEntries(SPEAKERS.map((s) => [s.id, s]));
const initials = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
const avatar = (s, cls = '') => `<span class="av ${cls}" style="--h:${s.hue}" aria-hidden="true">${initials(s.name)}</span>`;

const state = { day: 'd1', track: 'todas', q: '', onlyMine: false, mine: [] };
try { state.mine = JSON.parse(localStorage.getItem('latitude-mine') || '[]'); } catch { state.mine = []; }

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.id); toast.id = setTimeout(() => (t.hidden = true), 2600);
}

/* Contagem regressiva */
function tick() {
  const c = countdown(new Date(), EVENT.start);
  const cell = (v, l) => `<div><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`;
  $('#count').innerHTML = cell(c.d, 'dias') + cell(c.h, 'horas') + cell(c.m, 'min') + cell(c.s, 'seg');
}
tick(); setInterval(tick, 1000);

/* Programação */
function seg(el, items, key) {
  el.innerHTML = items.map(([id, label]) => `<button type="button" role="${key === 'day' ? 'tab' : 'button'}" aria-${key === 'day' ? 'selected' : 'pressed'}="${state[key] === id}" data-id="${id}">${esc(label)}</button>`).join('');
}
function renderTools() {
  seg($('#days'), DAYS.map((d) => [d.id, d.label]), 'day');
  seg($('#tracks'), [['todas', 'Todas'], ...TRACKS.map((t) => [t.id, t.label])], 'track');
}
function renderAgenda() {
  const list = filterSessions(SESSIONS, { ...state, day: state.onlyMine ? null : state.day });
  const clash = new Set(conflicts(SESSIONS, state.mine).flat());
  $('#mineCount').textContent = state.mine.length;
  $('#ics').disabled = !state.mine.length;
  const w = $('#warn');
  const pairs = conflicts(SESSIONS, state.mine);
  w.hidden = !pairs.length;
  if (pairs.length) w.textContent = `Atenção: ${pairs.length} choque${pairs.length > 1 ? 's' : ''} de horário na sua agenda (destacado${pairs.length > 1 ? 's' : ''} abaixo).`;
  if (!list.length) { $('#agenda').innerHTML = `<li class="empty">Nenhuma sessão encontrada. ${state.onlyMine ? 'Marque algumas com ★.' : 'Tente outro filtro.'}</li>`; return; }
  $('#agenda').innerHTML = list.map((s) => {
    const on = state.mine.includes(s.id);
    return `<li class="sess t-${s.track}${clash.has(s.id) ? ' clash' : ''}">
      <time><b>${s.start}</b><span>${s.end}</span></time>
      <div class="sess-b"><p class="meta"><span class="tag">${TRACK_LABEL[s.track]}</span><span>${s.level}</span></p>
        <h3>${esc(s.title)}</h3>
        <p class="who">${s.sp.map((id) => avatar(spById[id], 'sm')).join('')}<span>${s.sp.map((id) => esc(spById[id].name)).join(', ')}</span></p></div>
      <button type="button" class="star" data-s="${s.id}" aria-pressed="${on}" aria-label="${on ? 'Remover da' : 'Adicionar à'} minha agenda: ${esc(s.title)}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg></button>
    </li>`;
  }).join('');
}
$('#days').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { state.day = b.dataset.id; renderTools(); renderAgenda(); } });
$('#tracks').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { state.track = b.dataset.id; renderTools(); renderAgenda(); } });
$('#q').addEventListener('input', (e) => { state.q = e.target.value; renderAgenda(); });
$('#onlyMine').addEventListener('change', (e) => {
  state.onlyMine = e.target.checked;
  renderAgenda();
});
$('#agenda').addEventListener('click', (e) => {
  const b = e.target.closest('.star'); if (!b) return;
  const id = b.dataset.s, i = state.mine.indexOf(id);
  i < 0 ? state.mine.push(id) : state.mine.splice(i, 1);
  try { localStorage.setItem('latitude-mine', JSON.stringify(state.mine)); } catch { /* modo privado */ }
  toast(i < 0 ? 'Adicionada à sua agenda' : 'Removida da sua agenda');
  renderAgenda();
});
$('#ics').addEventListener('click', () => {
  const chosen = SESSIONS.filter((s) => state.mine.includes(s.id));
  const url = URL.createObjectURL(new Blob([toIcs(chosen, DAYS, EVENT.venue)], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'minha-agenda-latitude.ics' });
  a.click(); URL.revokeObjectURL(url);
  toast(`${chosen.length} sessões exportadas`);
});

/* Palestrantes */
$('#people').innerHTML = SPEAKERS.map((s) => {
  const n = SESSIONS.filter((x) => x.sp.includes(s.id)).length;
  return `<li>${avatar(s)}<h3>${esc(s.name)}</h3><p>${esc(s.role)}</p><span class="count-s">${n} ${n > 1 ? 'sessões' : 'sessão'}</span></li>`;
}).join('');

/* Ingressos */
let sel = { id: 'padrao', qty: 1, coupon: '' };
function renderTickets() {
  $('#tickets').innerHTML = TICKETS.map((t) => `
    <article class="tk${t.featured ? ' feat' : ''}${sel.id === t.id ? ' on' : ''}">
      ${t.featured ? '<span class="pill">Mais escolhido</span>' : ''}
      <h3>${esc(t.name)}</h3><p class="price">${brl(t.price)}<small>/pessoa</small></p><p class="blurb">${esc(t.blurb)}</p>
      <ul>${t.perks.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <button type="button" class="btn ${sel.id === t.id ? '' : 'btn-ghost-d'}" data-t="${t.id}" aria-pressed="${sel.id === t.id}">${sel.id === t.id ? 'Selecionado' : 'Escolher'}</button>
    </article>`).join('');
  renderOrder();
}
function renderOrder() {
  const t = TICKETS.find((x) => x.id === sel.id);
  const o = orderTotal(t, sel.qty, sel.coupon);
  $('#order').innerHTML = `
    <div class="ord-l"><h3>Seu pedido</h3><p>${t.name}${t.min ? ` (mín. ${t.min})` : ''}</p>
      <div class="qty"><button type="button" data-q="-1" aria-label="Menos um ingresso">−</button><output aria-label="Quantidade">${sel.qty}</output><button type="button" data-q="1" aria-label="Mais um ingresso">+</button></div>
      <label class="cup"><span>Cupom</span><input id="cup" value="${esc(sel.coupon)}" placeholder="LATITUDE10" autocomplete="off"></label></div>
    <dl class="ord-r"><div><dt>Subtotal</dt><dd>${brl(o.subtotal)}</dd></div>
      ${o.discount ? `<div class="ok"><dt>Cupom aplicado</dt><dd>− ${brl(o.discount)}</dd></div>` : ''}
      <div class="tot"><dt>Total</dt><dd>${brl(o.total)}</dd></div>
      ${o.error ? `<p class="err">${o.error}</p>` : ''}
      <button type="button" class="btn" id="buy" ${o.error ? 'disabled' : ''}>Finalizar (demo)</button></dl>`;
}
$('#tickets').addEventListener('click', (e) => {
  const b = e.target.closest('[data-t]'); if (!b) return;
  sel.id = b.dataset.t; const t = TICKETS.find((x) => x.id === sel.id); sel.qty = Math.max(sel.qty, t.min || 1); renderTickets();
});
$('#order').addEventListener('click', (e) => {
  const q = e.target.closest('[data-q]');
  if (q) { const t = TICKETS.find((x) => x.id === sel.id); sel.qty = Math.min(t.limit, Math.max(1, sel.qty + Number(q.dataset.q))); renderOrder(); $('[data-q="1"]').focus(); return; }
  if (e.target.id === 'buy') toast('Demonstração: nenhum pagamento foi processado.');
});
$('#order').addEventListener('input', (e) => {
  if (e.target.id !== 'cup') return;
  sel.coupon = e.target.value; const p = e.target.selectionStart; renderOrder();
  const c = $('#cup'); c.focus(); c.setSelectionRange(p, p);
});

/* FAQ */
$('#faqList').innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');

renderTools(); renderAgenda(); renderTickets();
