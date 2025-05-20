import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Using dummy values for supabase URL and anon key - users will need to replace these
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);