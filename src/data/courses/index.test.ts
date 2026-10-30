import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { leaves, validateTemplate } from '@/core/tree';

import { courses, templates } from './index';
import { courseTemplateSchema } from './schema';

const dir = __dirname;
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

describe('course templates', () => {
  it.each(files)('%s passes validation', (file) => {
    const raw: unknown = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    const template = courseTemplateSchema.parse(raw);
    expect(validateTemplate(template)).toEqual([]);
    expect(`${template.id}.json`).toBe(file);
  });

  it('registers every JSON file', () => {
    expect(templates).toHaveLength(files.length);
  });

  it('ships the 7 courses with code and credits', () => {
    expect(courses.map((c) => [c.code, c.credits])).toEqual([
      ['0000AGEL0103', 2],
      ['0000AGEL0101', 3],
      ['0000AGEL0102', 2],
      ['0000AGEL0215', 2],
      ['0000BA0101', 3],
      ['0000BA0102', 3],
      ['0000BA0106', 3],
    ]);
  });

  it('keeps leaf names short enough for a chip', () => {
    for (const c of courses) {
      for (const leaf of leaves(c.root)) {
        if (leaf.children.length === 0 && c.root.children.includes(leaf)) continue;
        expect(leaf.name.length).toBeLessThanOrEqual(8);
      }
    }
  });
});
