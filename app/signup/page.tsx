'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormInputs } from '@/lib/validation'; // Import the schema and type
import { useState } from 'react'; // Keep useState for messages

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema), // Use Zod resolver
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
 
  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const data = await response.json();

      if (response.ok) {
        // Optionally redirect to login page after a delay
        // setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Sign up for an account</h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                type="email" // Correct input type
                placeholder="Email" // Correct placeholder
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                {...register('email', { required: true })}

              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                placeholder="Password" // Correct placeholder
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                {...register('password', { required: true })}
 // Add validation message below input

              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

