export function formatSectionLabel(sectionNumber: number): string {
  const section = sectionNumber <= 2 ? 1 : 2;
  const mod = sectionNumber % 2 === 1 ? 1 : 2;
  return `Section ${section} Module ${mod}`;
}

export function formatSectionLabelWithDash(sectionNumber: number): string {
  const major = sectionNumber <= 2 ? 1 : 2;
  const minor = sectionNumber % 2 === 1 ? 1 : 2;
  return `${major}-${minor}`;
}
