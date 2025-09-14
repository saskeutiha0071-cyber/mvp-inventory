import { supabase } from './supabaseClient';

// Получить список
export async function getItems({ q, category, minQty, page = 1, perPage = 20, sort = 'created_at', order = 'desc' } = {}) {
  let query = supabase.from('items').select('*');

  if (q) query = query.ilike('name', `%${q}%`);
  if (category) query = query.eq('category', category);
  if (minQty) query = query.gte('quantity', minQty);

  query = query.order(sort, { ascending: order === 'asc' });
  query = query.range((page - 1) * perPage, page * perPage - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Создать запись
export async function createItem({ name, category, quantity = 0, price = null, status = 'active' }) {
  const { data, error } = await supabase
    .from('items')
    .insert([{ name, category, quantity, price, status }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
