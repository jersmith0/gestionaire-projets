// tools.constants.ts
// Liste centralisée des outils/technos avec icône Material Icons associée

export interface ToolInfo {
  name: string;           // Nom exact ou clé à matcher (insensible à la casse)
  displayName: string;    // Nom affiché à l'utilisateur
  icon: string;           // Nom de l'icône Material Icons
  color?: string;         // Couleur optionnelle pour l'icône (classe Tailwind ou hex)
}

export const TOOLS: ToolInfo[] = [
  // Frontend / UI
  { name: 'react', displayName: 'React', icon: 'code', color: 'text-cyan-400' },
  { name: 'nextjs', displayName: 'Next.js', icon: 'code', color: 'text-gray-200' },
  { name: 'angular', displayName: 'Angular', icon: 'code', color: 'text-red-400' },
  { name: 'vue', displayName: 'Vue.js', icon: 'code', color: 'text-green-400' },
  { name: 'svelte', displayName: 'Svelte', icon: 'code', color: 'text-orange-400' },
  { name: 'tailwind', displayName: 'Tailwind CSS', icon: 'brush', color: 'text-teal-400' },
  { name: 'shadcn', displayName: 'shadcn/ui', icon: 'design_services', color: 'text-violet-400' },
  { name: 'material', displayName: 'Material UI', icon: 'layers', color: 'text-blue-400' },
  { name: 'chakra', displayName: 'Chakra UI', icon: 'palette', color: 'text-purple-400' },

  // Backend / Server
  { name: 'nodejs', displayName: 'Node.js', icon: 'developer_board', color: 'text-green-500' },
  { name: 'express', displayName: 'Express', icon: 'api', color: 'text-gray-300' },
  { name: 'nestjs', displayName: 'NestJS', icon: 'architecture', color: 'text-red-500' },
  { name: 'fastify', displayName: 'Fastify', icon: 'speed', color: 'text-yellow-400' },
  { name: 'hono', displayName: 'Hono', icon: 'bolt', color: 'text-orange-500' },
  { name: 'springboot', displayName: 'Spring Boot', icon: 'code', color: 'text-green-600' },
  { name: 'fastapi', displayName: 'FastAPI', icon: 'api', color: 'text-teal-500' },
  { name: 'go', displayName: 'Go', icon: 'developer_board', color: 'text-cyan-500' },

  // Bases de données / BaaS
  { name: 'firebase', displayName: 'Firebase', icon: 'local_fire_department', color: 'text-amber-400' },
  { name: 'supabase', displayName: 'Supabase', icon: 'database', color: 'text-emerald-400' },
  { name: 'mongodb', displayName: 'MongoDB', icon: 'storage', color: 'text-green-400' },
  { name: 'postgresql', displayName: 'PostgreSQL', icon: 'storage', color: 'text-blue-400' },
  { name: 'mysql', displayName: 'MySQL', icon: 'storage', color: 'text-orange-400' },
  { name: 'prisma', displayName: 'Prisma', icon: 'schema', color: 'text-indigo-400' },
  { name: 'drizzle', displayName: 'Drizzle ORM', icon: 'schema', color: 'text-blue-500' },

  // Design / Prototyping
  { name: 'figma', displayName: 'Figma', icon: 'design_services', color: 'text-purple-400' },
  { name: 'sketch', displayName: 'Sketch', icon: 'draw', color: 'text-yellow-500' },
  { name: 'adobe xd', displayName: 'Adobe XD', icon: 'design_services', color: 'text-red-500' },

  // DevOps / Outils
  { name: 'docker', displayName: 'Docker', icon: 'anchor', color: 'text-blue-500' },
  { name: 'kubernetes', displayName: 'Kubernetes', icon: 'grid_view', color: 'text-blue-600' },
  { name: 'git', displayName: 'Git', icon: 'source', color: 'text-orange-500' },
  { name: 'github', displayName: 'GitHub', icon: 'source', color: 'text-gray-200' },
  { name: 'vercel', displayName: 'Vercel', icon: 'cloud_upload', color: 'text-black' },
  { name: 'netlify', displayName: 'Netlify', icon: 'cloud_upload', color: 'text-teal-400' },

  // Autres outils populaires
  { name: 'typescript', displayName: 'TypeScript', icon: 'code', color: 'text-blue-400' },
  { name: 'javascript', displayName: 'JavaScript', icon: 'code', color: 'text-yellow-400' },
  { name: 'python', displayName: 'Python', icon: 'code', color: 'text-blue-500' },
  { name: 'graphql', displayName: 'GraphQL', icon: 'api', color: 'text-pink-400' },
  { name: 'postman', displayName: 'Postman', icon: 'api', color: 'text-orange-400' },
  { name: 'vscode', displayName: 'VS Code', icon: 'code', color: 'text-blue-500' },
];

// Fonction utilitaire pour récupérer l'icône et la couleur d'un outil
export function getToolInfo(toolName: string): ToolInfo {
  const lowerName = toolName.toLowerCase().trim();
  return (
    TOOLS.find(t => lowerName.includes(t.name)) || {
      name: lowerName,
      displayName: toolName,
      icon: 'build',              // icône par défaut
      color: 'text-violet-400',
    }
  );
}