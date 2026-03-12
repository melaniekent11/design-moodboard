import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://szjipectlkudmolkeafo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6amlwZWN0bGt1ZG1vbGtlYWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTg3NjksImV4cCI6MjA4ODg5NDc2OX0.UUVJyPTbYaBd1l8jRgtJId1zAXlskuzT3ist8KkXhWY";

export const supabase = createClient(supabaseUrl, supabaseKey);