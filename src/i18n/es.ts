/** Every user-facing string (ADR 0002). */
export const es = {
  appName: 'Mis notas',
  home: {
    title: 'Mis cursos',
    average: 'Promedio general',
    progress: (complete: number, total: number, credits: number) =>
      `${complete} de ${total} cursos completos · ${credits} ${credits === 1 ? 'crédito' : 'créditos'}`,
    credits: (n: number) => `${n} ${n === 1 ? 'crédito' : 'créditos'}`,
  },
  course: {
    finalGrade: 'Nota final',
    outOf: '/20',
    back: 'Volver',
    open: (name: string) => `Abrir ${name}`,
    notFound: 'Curso no encontrado',
    unsavedNotice:
      'Solo se guardan las notas con estrella. Las demás vuelven a 0 al cerrar la app.',
  },
  editor: {
    showReal: 'Ver real',
    markReal: 'Marcar real',
    unmarkReal: 'Quitar real',
    decrease: 'Bajar nota',
    increase: 'Subir nota',
    ruler: 'Regla de notas',
    close: 'Ocultar editor',
  },
  a11y: {
    real: 'Nota real',
    complete: 'Curso completo',
  },
} as const;
