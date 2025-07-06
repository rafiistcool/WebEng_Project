import db from "../db";
import { Card, Folder, FolderHierarchyNode, Set } from "../types";

// Set Services
export const getSets = (userId: number): Promise<Set[]> => {
  return db.any<Set>("SELECT * FROM sets WHERE user_id = $1", [userId]);
};

export const createSet = (userId: number, name: string): Promise<Set> => {
  return db.one<Set>("INSERT INTO sets (user_id, name) VALUES ($1, $2) RETURNING *", [userId, name]);
};

export const updateSet = (id: number, name: string): Promise<Set> => {
  return db.one<Set>("UPDATE sets SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
};

export const deleteSet = (id: number): Promise<null> => {
  return db.none("DELETE FROM sets WHERE id = $1", [id]);
};

// Card Services
export const getCards = (setId: number): Promise<Card[]> => {
  return db.any<Card>("SELECT * FROM cards WHERE set_id = $1", [setId]);
};

export const createCard = (setId: number, question: string, answer: string, category?: string, weight?: number): Promise<Card> => {
  return db.one<Card>("INSERT INTO cards (set_id, question, answer, category, weight) VALUES ($1, $2, $3, $4, $5) RETURNING *", [setId, question, answer, category, weight]);
};

export const updateCard = (id: number, question: string, answer: string, category?: string, weight?: number): Promise<Card> => {
  return db.one<Card>("UPDATE cards SET question = $1, answer = $2, category = $3, weight = $4 WHERE id = $5 RETURNING *", [question, answer, category, weight, id]);
};

export const deleteCard = (id: number): Promise<null> => {
  return db.none("DELETE FROM cards WHERE id = $1", [id]);
};

// Folder Services
export const getFolders = (userId: number, parentId?: number): Promise<Folder[]> => {
  if (parentId) {
    return db.any<Folder>("SELECT * FROM folders WHERE user_id = $1 AND parent_id = $2", [userId, parentId]);
  } else {
    return db.any<Folder>("SELECT * FROM folders WHERE user_id = $1 AND parent_id IS NULL", [userId]);
  }
};

export const createFolder = (userId: number, name: string, parentId?: number): Promise<Folder> => {
  return db.one<Folder>("INSERT INTO folders (user_id, name, parent_id) VALUES ($1, $2, $3) RETURNING *", [userId, name, parentId]);
};

export const updateFolder = (id: number, name: string, parentId?: number): Promise<Folder> => {
  return db.one<Folder>("UPDATE folders SET name = $1, parent_id = $2 WHERE id = $3 RETURNING *", [name, parentId, id]);
};

export const deleteFolder = (id: number): Promise<null> => {
  return db.none("DELETE FROM folders WHERE id = $1", [id]);
};

// Folder-Set Relationship Services
export const addSetToFolder = (folderId: number, setId: number): Promise<null> => {
  return db.none("INSERT INTO folder_sets (folder_id, set_id) VALUES ($1, $2)", [folderId, setId]);
};

export const removeSetFromFolder = (folderId: number, setId: number): Promise<null> => {
  return db.none("DELETE FROM folder_sets WHERE folder_id = $1 AND set_id = $2", [folderId, setId]);
};

// Helper Services
export const getFolderSets = (folderId: number): Promise<Set[]> => {
  return db.any<Set>("SELECT s.* FROM sets s JOIN folder_sets fs ON s.id = fs.set_id WHERE fs.folder_id = $1", [folderId]);
};

export const getFolderHierarchy = async (userId: number): Promise<FolderHierarchyNode[]> => {
    // This is a simplified approach that fetches all data and builds the tree in the application.
    // It's often more maintainable than a complex recursive SQL query.
    const allFolders = await db.any<Folder>('SELECT * FROM folders WHERE user_id = $1 ORDER BY name', [userId]);
    const allSets = await db.any<Set>('SELECT s.*, fs.folder_id FROM sets s LEFT JOIN folder_sets fs ON s.id = fs.set_id WHERE s.user_id = $1', [userId]);

    const folderMap: Map<number, FolderHierarchyNode> = new Map();
    const rootFolders: FolderHierarchyNode[] = [];

    allFolders.forEach(folder => {
        const node: FolderHierarchyNode = { ...folder, children: [], sets: [] };
        folderMap.set(folder.id, node);
    });
    
    allSets.forEach(set => {
        // @ts-ignore - folder_id is added by the query
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const folderId = set.folder_id;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (folderId && folderMap.has(folderId)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            folderMap.get(folderId)!.sets.push(set);
        }
    });

    allFolders.forEach(folder => {
        const node = folderMap.get(folder.id)!;
        if (folder.parent_id && folderMap.has(folder.parent_id)) {
            folderMap.get(folder.parent_id)!.children.push(node);
        } else {
            rootFolders.push(node);
        }
    });

    return rootFolders;
};