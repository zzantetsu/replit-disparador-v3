import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// For demo purposes, create a mock client if credentials are invalid
let actualUrl = supabaseUrl;
let actualKey = supabaseKey;

// Check if both values look like JWT tokens (indicating configuration issue)
const isUrlJWT = supabaseUrl.startsWith('eyJ');
const isKeyJWT = supabaseKey.startsWith('eyJ');

if (isUrlJWT && isKeyJWT) {
  // Both look like JWT tokens, use demo mode
  console.warn('⚠️ Invalid Supabase configuration detected. Using demo mode.');
  console.warn('Please provide correct VITE_SUPABASE_URL (should start with https://) and VITE_SUPABASE_ANON_KEY');
  
  // Use demo credentials for testing purposes
  actualUrl = 'https://demo.supabase.co';
  actualKey = supabaseUrl; // Use one of the JWT tokens as anon key for demo
}

if (!actualUrl || !actualKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
}

// Create client (will fail gracefully in demo mode)
export const supabase = createClient(actualUrl, actualKey);
