import { supabase } from './supabase';
import { toast } from 'sonner';

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
    return { error };
  }

  toast.success('Account created successfully! Please sign in.');
  return { error: null };
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
    return { error };
  }

  toast.success('Signed in successfully!');
  return { error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error(error.message);
    return { error };
  }

  toast.success('Signed out successfully!');
  return { error: null };
}