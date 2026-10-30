export type WeightUnit = 'percent' | 'units';

export interface TemplateNode {
  id: string;
  name: string;
  fullName?: string;
  weight?: number;
  childWeightUnit?: WeightUnit;
  children?: TemplateNode[];
}

export interface CourseTemplate {
  id: string;
  name: string;
  code: string;
  credits: number;
  version: number;
  childWeightUnit?: WeightUnit;
  children: TemplateNode[];
}

export interface GradeNode {
  id: string;
  name: string;
  fullName?: string;
  /** Raw weight relative to siblings; 1 when the template omits it. */
  weight: number;
  /** How the weights of this node's children are written. */
  unit: WeightUnit;
  children: GradeNode[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  version: number;
  root: GradeNode;
}

export const ROOT_ID = 'final';
export const MAX_CHILDREN = 14;

function toNode(t: TemplateNode): GradeNode {
  return {
    id: t.id,
    name: t.name,
    ...(t.fullName !== undefined && { fullName: t.fullName }),
    weight: t.weight ?? 1,
    unit: t.childWeightUnit ?? 'percent',
    children: (t.children ?? []).map(toNode),
  };
}

export function buildCourse(t: CourseTemplate): Course {
  return {
    id: t.id,
    name: t.name,
    code: t.code,
    credits: t.credits,
    version: t.version,
    root: toNode({
      id: ROOT_ID,
      name: t.name,
      ...(t.childWeightUnit && { childWeightUnit: t.childWeightUnit }),
      children: t.children,
    }),
  };
}

/** Returns every rule a template breaks; empty when valid (course-format.md). */
export function validateTemplate(t: CourseTemplate): string[] {
  const errors: string[] = [];
  const seen = new Set<string>([ROOT_ID]);
  const walk = (id: string, unit: WeightUnit | undefined, children: TemplateNode[]) => {
    if (children.length > MAX_CHILDREN) errors.push(`${id}: more than ${MAX_CHILDREN} children`);
    for (const c of children) {
      if (seen.has(c.id)) errors.push(`${c.id}: duplicated id`);
      seen.add(c.id);
      if (c.weight !== undefined && c.weight <= 0) errors.push(`${c.id}: weight must be > 0`);
    }
    const weighted = children.filter((c) => c.weight !== undefined);
    if (weighted.length > 0 && weighted.length < children.length) {
      errors.push(`${id}: weights must be set on all children or none`);
    }
    if ((unit ?? 'percent') === 'percent' && weighted.length > 0) {
      const sum = weighted.reduce((s, c) => s + (c.weight ?? 0), 0);
      if (Math.abs(sum - 100) > 1e-9) errors.push(`${id}: percent weights sum ${sum}, not 100`);
    }
    for (const c of children) walk(c.id, c.childWeightUnit, c.children ?? []);
  };
  if (t.credits <= 0) errors.push(`${t.id}: credits must be > 0`);
  walk(t.id, t.childWeightUnit, t.children);
  return errors;
}

export function leaves(node: GradeNode): GradeNode[] {
  return node.children.length === 0 ? [node] : node.children.flatMap(leaves);
}

export function findNode(node: GradeNode, id: string): GradeNode | undefined {
  if (node.id === id) return node;
  for (const c of node.children) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return undefined;
}
