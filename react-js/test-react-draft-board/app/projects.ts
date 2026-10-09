export interface Project {
  id: string;
  title: string;
  revision: number;
}

export const initialProjects: Project[] = [
  { id: "atlas", title: "Atlas onboarding", revision: 1 },
  { id: "boreal", title: "Boreal reporting", revision: 1 },
  { id: "cypress", title: "Cypress migration", revision: 1 },
];

export function refreshProject(project: Project): Project {
  const initial = initialProjects.find(item => item.id === project.id);
  if (!initial) throw new Error("Unknown project");
  const revision = project.revision + 1;
  return { ...project, revision, title: `${initial.title} (v${revision})` };
}
