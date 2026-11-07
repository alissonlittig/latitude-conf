export const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function filterSessions(list, { day, track, q = '', onlyMine = false, mine = [] }) {
  const needle = q.trim().toLowerCase();
  return list
    .filter((s) => (!day || s.day === day) && (!track || track === 'todas' || s.track === track || s.track === 'all'))
    .filter((s) => !onlyMine || mine.includes(s.id))
    .filter((s) => !needle || s.title.toLowerCase().includes(needle))
    .sort((a, b) => toMin(a.start) - toMin(b.start) || a.track.localeCompare(b.track));
}

// Pares de sessões da agenda pessoal que se sobrepõem no mesmo dia.
export function conflicts(sessions, mine) {
  const m = sessions.filter((s) => mine.includes(s.id));
  const out = [];
  for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
    const a = m[i], b = m[j];
    if (a.day === b.day && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end)) out.push([a.id, b.id]);
  }
  return out;
}

export function orderTotal(ticket, qty, coupon = '') {
  const n = Math.max(0, Math.min(qty, ticket.limit));
  const subtotal = n * ticket.price;
  if (ticket.min && n < ticket.min) return { n, subtotal, discount: 0, total: subtotal, error: `Mínimo de ${ticket.min} ingressos` };
  const discount = coupon.trim().toUpperCase() === 'LATITUDE10' ? Math.round(subtotal * 0.1) : 0;
  return { n, subtotal, discount, total: subtotal - discount, error: null };
}

export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

export function countdown(now, target) {
  const s = Math.floor(Math.max(0, new Date(target) - now) / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function toIcs(sessions, days, venue) {
  const stamp = (id, t) => `${days.find((d) => d.id === id).date.replaceAll('-', '')}T${t.replace(':', '')}00`;
  const esc = (t) => t.replace(/[,;]/g, (c) => '\\' + c);
  const ev = sessions.map((s) => ['BEGIN:VEVENT', `UID:${s.id}@latitude-demo`, 'DTSTAMP:20270101T000000Z',
    `DTSTART;TZID=America/Sao_Paulo:${stamp(s.day, s.start)}`, `DTEND;TZID=America/Sao_Paulo:${stamp(s.day, s.end)}`,
    `SUMMARY:${esc(s.title)}`, `LOCATION:${esc(venue)}`, 'END:VEVENT'].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Latitude Demo//PT', ...ev, 'END:VCALENDAR'].join('\r\n');
}
