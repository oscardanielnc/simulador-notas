import { z } from 'zod';

import type { CourseTemplate, TemplateNode } from '@/core/tree';

const weightUnit = z.enum(['percent', 'units']);

const templateNode: z.ZodType<TemplateNode> = z.lazy(() =>
  z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    fullName: z.string().min(1).optional(),
    weight: z.number().optional(),
    childWeightUnit: weightUnit.optional(),
    children: z.array(templateNode).optional(),
  }),
);

export const courseTemplateSchema: z.ZodType<CourseTemplate> = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  credits: z.number().int(),
  version: z.number().int().positive(),
  childWeightUnit: weightUnit.optional(),
  children: z.array(templateNode).min(1),
});
