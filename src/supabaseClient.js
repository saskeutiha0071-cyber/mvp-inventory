import { createClient } from '@supabase/supabase-js';

// Эти переменные будут браться из настроек Netlify после развертывания.
// Для локальной разработки можно создать файл .env в корне проекта
// и добавить в него REACT_APP_SUPABASE_URL=... и REACT_APP_SUPABASE_ANON_KEY=...
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Проверяем, что переменные окружения загружены
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key are required. Make sure to set them in your .env file or environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);