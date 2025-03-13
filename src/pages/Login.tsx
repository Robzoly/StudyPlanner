import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signIn } from '../lib/auth';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { error } = await signIn(data.email, data.password);
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to sign in</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            {...register('email', { required: true })}
            id="email"
            className="w-full px-3 py-2 border rounded-md"
            type="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            {...register('password', { required: true })}
            id="password"
            className="w-full px-3 py-2 border rounded-md"
            type="password"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}