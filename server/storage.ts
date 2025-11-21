// Storage interface for ShopFlow
// Note: This application uses Firebase for data storage
// This file is kept for potential future backend extensions

export interface IStorage {
  // Firebase handles all storage operations
  // No local storage implementation needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Placeholder for future backend features
  }
}

export const storage = new MemStorage();
