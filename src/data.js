// Dados 100% fictícios (demo de portfólio).
export const EVENT = { name: 'Latitude', year: 2027, start: '2027-05-14T09:00:00-03:00', city: 'Curitiba, PR', venue: 'Galpão Latitude (fictício)' };
export const DAYS = [
  { id: 'd1', label: 'Sex 14 mai', date: '2027-05-14' },
  { id: 'd2', label: 'Sáb 15 mai', date: '2027-05-15' },
];
export const TRACKS = [
  { id: 'sis', label: 'Sistemas' },
  { id: 'dad', label: 'Dados' },
  { id: 'pro', label: 'Produto' },
];
export const TRACK_LABEL = { sis: 'Sistemas', dad: 'Dados', pro: 'Produto', all: 'Palco principal' };
export const SPEAKERS = [
  { id: 's1', name: 'Helena Brandt', role: 'Eng. principal, Quirino Pay', hue: 14 },
  { id: 's2', name: 'Tomás Aguiar', role: 'Pesquisador, Instituto Bússola', hue: 220 },
  { id: 's3', name: 'Ioná Marques', role: 'Head de Produto, Cais', hue: 160 },
  { id: 's4', name: 'Rafael Duarte', role: 'SRE, Malha Cloud', hue: 30 },
  { id: 's5', name: 'Bianca Nogueira', role: 'Cientista de dados, Ônix', hue: 260 },
  { id: 's6', name: 'Caio Villar', role: 'Fundador, Pardal Labs', hue: 340 },
  { id: 's7', name: 'Sofia Lemos', role: 'Design engineer, Anel', hue: 190 },
  { id: 's8', name: 'Davi Cordeiro', role: 'Eng. de plataforma, Tarô', hue: 80 },
];
const S = (id, day, start, end, track, title, sp, level = 'Todos') => ({ id, day, start, end, track, title, sp, level });
export const SESSIONS = [
  S('a1', 'd1', '09:30', '10:30', 'all', 'Abertura: o que sobra quando o código roda sozinho', ['s1']),
  S('a2', 'd1', '11:00', '11:45', 'sis', 'Filas, retentativas e o custo escondido da idempotência', ['s4'], 'Avançado'),
  S('a3', 'd1', '11:00', '11:45', 'dad', 'Pipelines que falham em voz alta', ['s5'], 'Intermediário'),
  S('a4', 'd1', '11:00', '11:45', 'pro', 'Roadmap sem fé: decidir com evidência pequena', ['s3']),
  S('a5', 'd1', '13:30', '14:15', 'sis', 'Monólito modular em 40 mil linhas', ['s8'], 'Intermediário'),
  S('a6', 'd1', '13:30', '14:15', 'dad', 'Observabilidade de dados sem painel bonito demais', ['s2'], 'Avançado'),
  S('a7', 'd1', '13:30', '14:15', 'pro', 'Preço como produto: três experimentos reais', ['s6']),
  S('a8', 'd1', '15:00', '15:45', 'sis', 'Deploy às sextas: um pós-mortem feliz', ['s4', 's8']),
  S('a9', 'd1', '15:00', '15:45', 'pro', 'Design systems para times de cinco pessoas', ['s7'], 'Iniciante'),
  S('a10', 'd1', '16:30', '17:30', 'all', 'Conversa de palco: escalar sem perder o ofício', ['s1', 's3', 's6']),
  S('b1', 'd2', '09:30', '10:30', 'all', 'Keynote: software que envelhece bem', ['s2']),
  S('b2', 'd2', '11:00', '11:45', 'sis', 'Rust no caminho crítico: o que mudou em 18 meses', ['s8'], 'Avançado'),
  S('b3', 'd2', '11:00', '11:45', 'dad', 'Modelos pequenos, problemas grandes', ['s5'], 'Intermediário'),
  S('b4', 'd2', '11:00', '11:45', 'pro', 'Onboarding em 90 segundos', ['s7', 's3'], 'Iniciante'),
  S('b5', 'd2', '13:30', '14:15', 'sis', 'Bancos de dados no navegador: quando vale', ['s1'], 'Intermediário'),
  S('b6', 'd2', '13:30', '14:15', 'dad', 'Qualidade de dados é problema de contrato', ['s2', 's5']),
  S('b7', 'd2', '13:30', '14:15', 'pro', 'Vender para quem não decide sozinho', ['s6']),
  S('b8', 'd2', '15:00', '16:00', 'all', 'Painel aberto: carreira técnica depois dos 35', ['s3', 's4', 's7']),
  S('b9', 'd2', '16:30', '17:15', 'all', 'Encerramento e sorteios', ['s1', 's6']),
];
export const TICKETS = [
  { id: 'comunidade', name: 'Comunidade', price: 290, blurb: 'Para estudantes e pessoas em transição de carreira.', perks: ['2 dias de palestras', 'Almoço', 'Gravações após o evento'], limit: 4 },
  { id: 'padrao', name: 'Padrão', price: 690, blurb: 'A experiência completa para profissionais.', perks: ['2 dias de palestras', 'Almoço e coffee breaks', 'Oficinas do sábado', 'Gravações e slides'], featured: true, limit: 10 },
  { id: 'time', name: 'Time', price: 590, blurb: 'Preço por pessoa a partir de 5 ingressos.', perks: ['Tudo do Padrão', 'Mesa reservada no almoço', 'Fatura única'], limit: 30, min: 5 },
];
export const FAQ = [
  ['Isto é um evento de verdade?', 'Não. Latitude é um projeto de demonstração: marca, palestrantes, empresas e preços são fictícios, e nenhum pagamento é processado.'],
  ['Os ingressos têm meia-entrada?', 'O lote Comunidade cobre estudantes e pessoas em transição, mediante comprovação no credenciamento.'],
  ['Haverá transmissão?', 'O palco principal terá transmissão ao vivo; as trilhas ficam disponíveis em vídeo duas semanas depois.'],
  ['Posso trocar o nome do ingresso?', 'Sim, até 7 dias antes do evento, sem custo, pelo painel do comprador.'],
  ['Há acessibilidade?', 'Todo o espaço é acessível, com intérprete de Libras no palco principal e legendas ao vivo.'],
];
