import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.AI_NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.AI_NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
