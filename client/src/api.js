import { supabase } from './supabaseClient';

export const fetchItems = async () => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) throw error;
  return data;
};

export const getItem = async (id) => {
  const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createItem = async (payload) => {
  const { data, error } = await supabase.from('items').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateItem = async (id, payload) => {
  const { data, error } = await supabase.from('items').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteItem = async (id) => {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
  return true;
};
