/** Every user-facing string (ADR 0002). */
export const es = {
  appName: 'Mis notas',
  home: {
    title: 'Mis cursos',
    average: 'Promedio general',
    noAverage: '—',
    progress: (complete: number, total: number, credits: number) =>
      `${complete} de ${total} cursos completos · ${credits} ${credits === 1 ? 'crédito' : 'créditos'}`,
    credits: (n: number) => `${n} ${n === 1 ? 'crédito' : 'créditos'}`,
    hint: 'La ★ marca los cursos con todas sus notas reales. Solo esos cuentan en el promedio.',
  },
  course: {
    finalGrade: 'Nota final',
    outOf: '/20',
    back: 'Volver',
    open: (name: string) => `Abrir ${name}`,
    notFound: 'Curso no encontrado',
  },
  editor: {
    showReal: 'Ver real',
    markReal: 'Marcar real',
    unmarkReal: 'Quitar real',
    decrease: 'Bajar nota',
    increase: 'Subir nota',
    ruler: 'Regla de notas',
  },
  a11y: {
    real: 'Nota real',
    complete: 'Curso completo',
  },
} as const;
