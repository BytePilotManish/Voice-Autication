import { openDB } from 'idb';
import { VoiceSample } from '../types';

const DB_NAME = 'voiceAuthDB';
const STORE_NAME = 'voiceSamples';
const DB_VERSION = 2; // Increment version to trigger upgrade

let dbPromise: Promise<any> | null = null;

export const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // If store doesn't exist, create it
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        } else {
          // If store exists but needs index updates
          const store = transaction.objectStore(STORE_NAME);
          
          // Check and create indexes if they don't exist
          if (!store.indexNames.contains('userId')) {
            store.createIndex('userId', 'userId', { unique: false });
          }
          if (!store.indexNames.contains('timestamp')) {
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        }
      },
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs/windows.');
      },
      blocking() {
        console.warn('Database blocking other version. Please reload.');
      },
      terminated() {
        console.error('Database connection terminated unexpectedly.');
      },
    });
  }
  return dbPromise;
};

export const storeVoiceSample = async (sample: Omit<VoiceSample, 'id'>): Promise<number> => {
  try {
    const db = await initDB();
    
    // Convert Blob to ArrayBuffer before storing
    const audioArrayBuffer = await sample.audioData.arrayBuffer();
    
    // Create a new transaction for this operation
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const sampleToStore = {
      ...sample,
      audioData: audioArrayBuffer,
    };
    
    // Add the sample and wait for both the add operation and transaction to complete
    const id = await store.add(sampleToStore);
    await tx.done;
    
    return id;
  } catch (error) {
    console.error('Error storing voice sample:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to store voice sample: ${error.message}`
        : 'Failed to store voice sample'
    );
  }
};

export const getVoiceSamples = async (userId: string): Promise<VoiceSample[]> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('userId');
    
    // Get all samples and wait for the transaction to complete
    const samples = await index.getAll(userId);
    await tx.done;
    
    // Convert ArrayBuffer back to Blob for each sample
    return samples.map(sample => ({
      ...sample,
      audioData: new Blob([sample.audioData], { type: 'audio/webm' }),
    }));
  } catch (error) {
    console.error('Error retrieving voice samples:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to retrieve voice samples: ${error.message}`
        : 'Failed to retrieve voice samples'
    );
  }
};

export const deleteDatabase = async (): Promise<void> => {
  try {
    // Delete the entire database to clean up any corrupted state
    await window.indexedDB.deleteDatabase(DB_NAME);
    // Reset the dbPromise so it will be reinitialized on next use
    dbPromise = null;
  } catch (error) {
    console.error('Error deleting database:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to delete database: ${error.message}`
        : 'Failed to delete database'
    );
  }
};

export const clearVoiceSamples = async (userId: string): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('userId');
    
    // Get all keys for the user
    const keys = await index.getAllKeys(userId);
    
    // Delete each sample
    await Promise.all(keys.map(key => store.delete(key)));
    await tx.done;
  } catch (error) {
    console.error('Error clearing voice samples:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to clear voice samples: ${error.message}`
        : 'Failed to clear voice samples'
    );
  }
};