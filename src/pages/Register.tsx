import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signUp } from '../lib/auth';

type FormData = {
  email: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { error } = await signUp(data.email, data.password);
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Enter your details to get started</p>
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
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}