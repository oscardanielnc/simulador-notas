import { buildCourse, validateTemplate, type Course } from '@/core/tree';

import antropologia from './antropologia.json';
import biologia from './biologia-celular-molecular.json';
import filosofia from './filosofia-general.json';
import gestion from './gestion-informacion.json';
import lenguaje from './lenguaje-comunicacion.json';
import matematica from './matematica.json';
import { courseTemplateSchema } from './schema';
import sociologia from './sociologia.json';

/** Home order. Add a course: drop its JSON here (course-format.md). */
export const templates: readonly unknown[] = [
  sociologia,
  gestion,
  antropologia,
  filosofia,
  lenguaje,
  matematica,
  biologia,
];

function load(raw: unknown): Course {
  const template = courseTemplateSchema.parse(raw);
  const errors = validateTemplate(template);
  if (errors.length > 0) throw new Error(`Invalid course ${template.id}: ${errors.join('; ')}`);
  return buildCourse(template);
}

export const courses: readonly Course[] = templates.map(load);

export function courseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
