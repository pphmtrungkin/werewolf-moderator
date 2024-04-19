import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yevkqcofrtinwfhxuchd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldmtxY29mcnRpbndmaHh1Y2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzODgxMTcsImV4cCI6MjAyNTk2NDExN30.sEjFWo6SMufT4z0bkuTbdyIJyfzra4-jbk6iD1FRbvo'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)