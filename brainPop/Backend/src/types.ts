export interface Set {
  id: number;
  user_id: number;
  name: string;
  created_at: Date;
}

export interface Card {
  id: number;
  set_id: number;
  question: string;
  answer: string;
  category?: string;
  weight?: number;
}

export interface Folder {
  id: number;
  user_id: number;
  name: string;
  parent_id?: number | null;
}

export interface FolderHierarchyNode extends Folder {
  children: FolderHierarchyNode[];
  sets: Set[];
}