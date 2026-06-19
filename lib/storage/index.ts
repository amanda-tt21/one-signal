import { Store } from './types';
import { memoryStore } from './memory';

// Swap this to the Supabase store once you're ready to connect it
export function getStore(): Store {
  return memoryStore;
}
