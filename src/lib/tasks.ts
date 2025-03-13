import { supabase } from './supabase';
import { toast } from 'sonner';

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
};

export type CreateTaskInput = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export async function createTask(task: CreateTaskInput) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    toast.error('Error creating task');
    return { error: userError };
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: userData.user.id }])
    .select()
    .single();

  if (error) {
    toast.error('Error creating task');
    return { error };
  }

  toast.success('Task created successfully');
  return { data, error: null };
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) {
    toast.error('Error fetching tasks');
    return { error };
  }

  return { data, error: null };
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    toast.error('Error updating task');
    return { error };
  }

  toast.success('Task updated successfully');
  return { data, error: null };
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error('Error deleting task');
    return { error };
  }

  toast.success('Task deleted successfully');
  return { error: null };
}