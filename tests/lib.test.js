import { describe, it, expect } from 'vitest';
import { filterSessions, conflicts, orderTotal, countdown, toIcs, toMin } from '../src/lib.js';
import { SESSIONS, TICKETS, DAYS, EVENT } from '../src/data.js';

describe('agenda', () => {
  it('filtra por dia e trilha, mantendo palco principal', () => {
    const r = filterSessions(SESSIONS, { day: 'd1', track: 'dad' });
    expect(r.every((s) => s.day === 'd1' && ['dad', 'all'].includes(s.track))).toBe(true);
    expect(r.length).toBeGreaterThan(2);
  });
  it('busca por texto e minha agenda', () => {
    expect(filterSessions(SESSIONS, { q: 'rust' }).map((s) => s.id)).toEqual(['b2']);
    expect(filterSessions(SESSIONS, { onlyMine: true, mine: ['a1'] }).length).toBe(1);
  });
  it('detecta conflito de horário', () => {
    expect(conflicts(SESSIONS, ['a2', 'a3', 'a5'])).toEqual([['a2', 'a3']]);
    expect(conflicts(SESSIONS, ['a2', 'a5'])).toEqual([]);
  });
  it('sessões têm horário válido', () => SESSIONS.forEach((s) => expect(toMin(s.end)).toBeGreaterThan(toMin(s.start))));
});

describe('ingressos', () => {
  const [com, pad, time] = TICKETS;
  it('calcula total e cupom', () => {
    expect(orderTotal(pad, 2).total).toBe(1380);
    expect(orderTotal(pad, 2, 'latitude10').total).toBe(1242);
    expect(orderTotal(com, 99).n).toBe(com.limit);
  });
  it('exige mínimo no pacote Time', () => expect(orderTotal(time, 3).error).toMatch(/Mínimo/));
});

it('countdown', () => {
  expect(countdown(new Date('2027-05-13T09:00:00-03:00'), EVENT.start)).toEqual({ d: 1, h: 0, m: 0, s: 0 });
  expect(countdown(new Date('2030-01-01'), EVENT.start).d).toBe(0);
});
it('ics', () => {
  const ics = toIcs([SESSIONS[0]], DAYS, 'X');
  expect(ics).toContain('DTSTART;TZID=America/Sao_Paulo:20270514T093000');
  expect(ics.split('BEGIN:VEVENT').length).toBe(2);
});
