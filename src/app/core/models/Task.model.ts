export interface Task<T> {
  id: any;
  uid: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in-progress' | 'done' ;
  moved?: boolean;
  priority: 'low' | 'medium' | 'high';
  goalId?: string;
  createdAt: T;
  updatedAt: T;
}