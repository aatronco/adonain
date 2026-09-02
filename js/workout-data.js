// js/workout-data.js
// Split de 5 días (Empuje/Tirón/Piernas/Empuje/Tirón) — 6 semanas, sin fases.
// Generado una sola vez a partir del cuestionario de Eduardo — mismo T1_SCHEME
// y misma lógica de Brute (ver docs/superpowers/specs/2026-09-02-crishern-adonain-design.md
// en el repo de Brute). Objetivo principal Fuerza (T1), secundario Hipertrofia
// (rep-range 8-15 en accesorios). Sentadilla fuera del programa — condromalacia,
// valgo y pie plano; Peso Muerto es el T1 de Piernas. Elbow: se priorizan
// variantes de agarre neutro/cuerda por dolor leve de codo.

export const PROGRAM_WEEKS = 6;

export const APP_NAME = 'Adonain';
export const APP_ICON = '🌀';
export const APP_TAGLINE = '5 días agrupados por patrón de movimiento';

// ── T1 — olas por levantamiento (idéntico esquema de Brute) ────────────────
const T1_SCHEME = [
  { week: 1, label: '2×4',  reps: 4, amrap: true,  rest: 180, comment: 'Volumen moderado con techo alto — el AMRAP mide si la base 2RM sigue siendo válida.' },
  { week: 2, label: '4×2',  reps: 2, amrap: false, rest: 180, comment: 'Sube intensidad, baja reps, sin AMRAP — consolida técnica bajo carga alta sin arriesgar fallo.' },
  { week: 3, label: '3×3',  reps: 3, amrap: false, rest: 180, comment: 'Retroceso leve de intensidad — acumula volumen técnico antes del bloque de picos.' },
  { week: 4, label: '8×1',  reps: 1, amrap: true,  rest: 240, comment: 'Mayor densidad de series pesadas — acondiciona el sistema nervioso para los máximos.' },
  { week: 5, label: '2×2',  reps: 2, amrap: true,  rest: 240, comment: 'Mini-descarga de volumen manteniendo intensidad — último test antes del máximo.' },
  { week: 6, label: '1×1',  reps: 1, amrap: false, rest: 300, comment: 'Single de cierre del bloque — referencia para la base 2RM del siguiente ciclo.' },
];

const ceil5 = kg => Math.ceil(kg / 5) * 5;

function barbellByWeek(base2RM, kgByWeek, { warmupReps = [8, 5, 2], warmupRest = [90, 90, 120] } = {}) {
  const warmupKg = [0.5, 0.7, 0.85].map(pct => ceil5(base2RM * pct));
  const byWeek = {};
  for (const s of T1_SCHEME) {
    const kg = kgByWeek[s.week];
    const warmup = warmupKg.map((kg, i) => ({
      label: `C${i + 1}`, reps: warmupReps[i], kg, rest: warmupRest[i], type: 'warmup',
    }));
    const work = [{ label: s.label, reps: s.reps, kg, rest: s.rest, type: 'work', note: s.comment }];
    if (s.amrap) work.push({ label: 'AMRAP', reps: `${s.reps}+`, kg, rest: 0, type: 'work', note: 'Serie extra a máximas reps con técnica sólida — no al fallo.' });
    byWeek[s.week] = { warmup, work };
  }
  return byWeek;
}

// ── Dominadas — carga relativa al peso corporal (PC 97 kg) ─────────────────
// PR declarado: 12 dominadas estrictas a peso corporal en una serie — nivel
// alto, así que el T1 progresa con lastre en vez de quedarse en peso corporal
// (a diferencia de Brute). Sin PR de dominadas lastradas real: kg estimados
// de forma conservadora, ajustar a mano si se sienten livianos o pesados.
function pullupByWeek() {
  const PLAN = {
    1: 'Peso corporal',
    2: 'Lastre +5 kg',
    3: 'Peso corporal',
    4: 'Lastre +10 kg',
    5: 'Lastre +5 kg',
    6: 'Lastre +15 kg',
  };
  const byWeek = {};
  for (const s of T1_SCHEME) {
    const kg = PLAN[s.week];
    const warmup = [{ label: 'Escapulares', reps: 10, kg: 'Peso corporal', rest: 30, type: 'warmup' }];
    const work = [{ label: s.label, reps: s.reps, kg, rest: s.rest, type: 'work', note: s.comment }];
    if (s.amrap) work.push({ label: 'AMRAP', reps: `${s.reps}+`, kg, rest: 0, type: 'work', note: 'Serie extra a máximas reps con técnica sólida — no al fallo.' });
    byWeek[s.week] = { warmup, work };
  }
  return byWeek;
}

// ── Accesorios — escalón fijo cada 2 semanas, rep-range de Hipertrofia (8-15) ──
function stepByWeek(w12, w34, w56) {
  return { 1: w12, 2: w12, 3: w34, 4: w34, 5: w56, 6: w56 };
}

// ── Día 1 — Empuje (pesado) ──────────────────────────────────────────────────
export const EMPUJE_PESADO = {
  name: 'Empuje',
  color: 'red',
  icon: '💪',
  dayLabel: 'Día 1',

  T1: [
    {
      exercise: 'Press Banca',
      note: 'Base 2RM 85 kg.',
      byWeek: barbellByWeek(85, { 1: 70, 2: 75, 3: 70, 4: 80, 5: 75, 6: 85 }),
    },
  ],

  T2: [
    { name: 'Press militar mancuerna sentado', setsReps: '4×8-10', rest: 90, note: 'Mancuerna en vez de barra — más amigable para el codo.', byWeek: stepByWeek(16, 18, 20) },
  ],

  accessories: [
    { name: 'Press cerrado mancuernas (floor press)', sets: 3, repRange: [8, 15], rest: 90, byWeek: stepByWeek(22, 24, 26) },
    { name: 'Elevación lateral mancuerna', sets: 3, repRange: [12, 15], rest: 60, byWeek: stepByWeek(8, 8, 10) },
    { name: 'Extensión tríceps en polea (cuerda)', sets: 3, repRange: [10, 15], rest: 60, note: 'Cuerda en vez de barra recta — cuida el codo.', byWeek: stepByWeek(20, 22, 25) },
  ],
};

// ── Día 2 — Tirón (pesado) ───────────────────────────────────────────────────
export const TIRON_PESADO = {
  name: 'Tirón',
  color: 'red',
  icon: '🎣',
  dayLabel: 'Día 2',

  T1: [
    {
      exercise: 'Dominadas',
      note: 'Carga relativa al peso corporal (PC 97 kg). PR: 12 estrictas a peso corporal.',
      byWeek: pullupByWeek(),
    },
  ],

  T2: [
    { name: 'Remo mancuerna unilateral', setsReps: '3×8-12/lado', rest: 90, byWeek: stepByWeek(24, 26, 28) },
  ],

  accessories: [
    { name: 'Face pull en polea', sets: 3, repRange: [12, 15], rest: 60, note: 'Salud de hombro y codo.', byWeek: stepByWeek(15, 18, 20) },
    { name: 'Curl martillo mancuerna', sets: 3, repRange: [10, 15], rest: 60, note: 'Agarre neutro — más amigable para el codo que barra recta.', byWeek: stepByWeek(10, 12, 12) },
  ],
};

// ── Día 3 — Piernas (sin Sentadilla) ─────────────────────────────────────────
// Condromalacia + valgo + pie plano: Sentadilla fuera del programa. Peso
// Muerto es el T1. Accesorios de rodilla en rango controlado, sin
// lunges/step-ups con carga ni saltos. El bloque de rodilla trabaja glúteo
// medio (valgo) y tobillo/pie (pie plano) en vez de "rehab de cuádriceps".
export const PIERNAS = {
  name: 'Piernas',
  color: 'red',
  icon: '🦵',
  dayLabel: 'Día 3',

  T1: [
    {
      exercise: 'Peso Muerto',
      note: 'Base 2RM 100 kg. Reemplaza a Sentadilla como principal del día.',
      technicalCues: [
        'Pies a ancho de cadera, barra sobre mediopiés',
        'Caderas atrás, espalda neutra',
        'Rodilla sigue la línea del pie — evita el colapso hacia adentro (valgo)',
      ],
      byWeek: barbellByWeek(100, { 1: 80, 2: 85, 3: 85, 4: 90, 5: 90, 6: 95 }, { warmupReps: [5, 3, 2] }),
    },
  ],

  T2: [
    { name: 'Prensa (rango parcial, sin flexión profunda)', setsReps: '4×8-15', rest: 90, note: 'Cortar el recorrido antes de compresión dolorosa de rodilla.', byWeek: stepByWeek(90, 100, 110) },
  ],

  kineBlock: {
    label: '— Rodilla / Pie Kine —',
    note: 'Condromalacia, valgo y pie plano: foco en glúteo medio y estabilidad de tobillo, no en cuádriceps aislado.',
    exercises: [
      { name: 'Abducción de cadera con banda (monster walk)', load: 'Banda media', setsReps: '3×15/lado', rest: 45 },
      { name: 'Puente de glúteo bilateral con banda sobre rodillas', load: 'Banda + peso corporal', setsReps: '3×15', rest: 45 },
      { name: 'Elevación de gemelos de pie', load: 'Peso corporal', setsReps: '3×15', rest: 30 },
      { name: 'Equilibrio a 1 pie sobre superficie inestable', load: 'Sin carga', setsReps: '3×30"/lado' },
    ],
  },

  accessories: [
    { name: 'Hip thrust bilateral', sets: 4, repRange: [8, 15], rest: 90, note: 'Pausa 2 seg arriba.', byWeek: stepByWeek(50, 55, 60) },
    { name: 'Leg curl sentado', sets: 3, repRange: [10, 15], rest: 75, note: 'Bajo estrés de rodilla en compresión — preferido sobre curl acostado.', byWeek: stepByWeek(35, 40, 40) },
  ],
};

// ── Día 4 — Empuje (liviano / hipertrofia) ──────────────────────────────────
export const EMPUJE_LIVIANO = {
  name: 'Empuje',
  color: 'red',
  icon: '💪',
  dayLabel: 'Día 4',

  accessories: [
    { name: 'Press inclinado mancuernas', sets: 4, repRange: [8, 12], rest: 90, byWeek: stepByWeek(20, 22, 24) },
    { name: 'Flexiones de pecho', sets: 3, repRange: [12, 20], rest: 60, note: 'Sin lastre.' },
    { name: 'Elevación lateral en polea', sets: 3, repRange: [12, 15], rest: 60, byWeek: stepByWeek(8, 10, 10) },
    { name: 'Extensión tríceps en polea (cuerda)', sets: 3, repRange: [10, 15], rest: 60, note: 'Cuerda — cuida el codo.', byWeek: stepByWeek(18, 20, 22) },
  ],
};

// ── Día 5 — Tirón (liviano / hipertrofia) ───────────────────────────────────
export const TIRON_LIVIANO = {
  name: 'Tirón',
  color: 'red',
  icon: '🎣',
  dayLabel: 'Día 5',

  accessories: [
    { name: 'Remo en polea sentado (agarre neutro)', sets: 4, repRange: [10, 15], rest: 75, note: 'Agarre neutro — cuida el codo.', byWeek: stepByWeek(45, 50, 55) },
    { name: 'Jalón al pecho agarre neutro', sets: 3, repRange: [10, 15], rest: 75, byWeek: stepByWeek(40, 45, 45) },
    { name: 'Face pull en polea', sets: 3, repRange: [12, 15], rest: 60, byWeek: stepByWeek(15, 18, 20) },
    { name: 'Curl martillo mancuerna', sets: 3, repRange: [10, 15], rest: 60, byWeek: stepByWeek(10, 12, 12) },
  ],
};

export const SESSIONS = {
  empujePesado: EMPUJE_PESADO,
  tironPesado: TIRON_PESADO,
  piernas: PIERNAS,
  empujeLiviano: EMPUJE_LIVIANO,
  tironLiviano: TIRON_LIVIANO,
};
