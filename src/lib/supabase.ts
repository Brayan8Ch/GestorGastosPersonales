import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vzghwifgqakdhnntxkvq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z2h3aWZncWFrZGhubnR4a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTA1ODEsImV4cCI6MjA5Mjk4NjU4MX0.PsqlFigycryTFn8fmBD5wI5FO5kCUmPqB4-FG9yVXy8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
