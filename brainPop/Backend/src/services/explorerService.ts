import db from "../db";

// Since we're now using the sets table directly, we don't need a separate ExplorerItem interface
// We'll use the existing sets table structure

export async function getExplorerItems(userId: number, parentId: number | null = null) {
  try {
    // Since we're using the sets table which doesn't have parent_id or hierarchy,
    // we'll just return all sets for the user
    return await db.any(
      `SELECT id, user_id, name FROM sets WHERE user_id = $1`,
      [userId]
    );
  } catch (error) {
    console.error("Error getting explorer items:", error);
    throw error;
  }
}

export async function saveExplorerItem(item: { user_id: number, name: string }) {
  try {
    // Create a new set in the sets table
    return await db.one(
      `INSERT INTO sets(user_id, name) VALUES($1, $2) RETURNING id`,
      [item.user_id, item.name]
    );
  } catch (error) {
    console.error("Error saving explorer item:", error);
    throw error;
  }
}

export async function updateExplorerItem(id: number, updates: { name?: string }) {
  try {
    // Only name can be updated in the sets table
    if (updates.name) {
      return await db.none(
        `UPDATE sets SET name = $2 WHERE id = $1`,
        [id, updates.name]
      );
    }
    return null;
  } catch (error) {
    console.error("Error updating explorer item:", error);
    throw error;
  }
}

export async function deleteExplorerItem(id: number) {
  try {
    // Delete the set from the sets table
    return await db.none('DELETE FROM sets WHERE id = $1', [id]);
  } catch (error) {
    console.error("Error deleting explorer item:", error);
    throw error;
  }
}

export async function saveExplorerStructure(userId: number, items: any[]) {
  try {
    // Start a transaction
    return await db.tx(async t => {
      // Delete all existing sets for this user
      await t.none('DELETE FROM sets WHERE user_id = $1', [userId]);

      // Function to save items (simplified since we don't have hierarchy)
      const saveItems = async (items: any[]) => {
        for (const item of items) {
          // Only save non-folder items (sets)
          if (item.children === null) {
            await t.one(
              `INSERT INTO sets(user_id, name) VALUES($1, $2) RETURNING id`,
              [userId, item.name]
            );
          } else if (item.children && item.children.length > 0) {
            // If it's a folder, process its children
            await saveItems(item.children);
          }
        }
      };

      // Start saving from the root items
      await saveItems(items);

      return true;
    });
  } catch (error) {
    console.error("Error saving explorer structure:", error);
    throw error;
  }
}
