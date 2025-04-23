
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgzilbcztlarvfmcuoxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nemlsYmN6dGxhcnZmbWN1b3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDM4MDYsImV4cCI6MjA2MDkxOTgwNn0.VVLBASCHAIYcsRX6gIv2JC4luPPirwuQtfop_6jAlGg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
