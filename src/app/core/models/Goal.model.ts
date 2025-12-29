export interface Goal {
  id: string;
  projectId: string; // Lien avec ton interface Project
  title: string; // Ex: "Lancer la V2 avant fin Q1"
  type: 'OKR' | 'KPI';
  progress: number; // 0–100, calculé automatiquement
  linkedTasks: string[]; // IDs des tâches liées
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}