'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signupSchema, SignupFormInputs } from '@/lib/validation'; // Import the schema and type
import { useState } from 'react'; // Keep useState for messages

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema), // Use Zod resolver
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
 
  const handleSignup = async (data: SignupFormInputs) => {
    mutation.mutate(data);
  };

  const createUser = async (data: SignupFormInputs) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signup`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Signup failed.');
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setMessage('Signup successful! Redirecting to login...');
      setError(''); // Clear any previous errors
      setTimeout(() => router.push('/login'), 2000); // Redirect to login page after a delay
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* {mutation.status === 'pending' && <p>Signing up...</p>} */}
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg"> {/* Added rounded-lg */}
        <h3 className="text-2xl font-bold text-center">Sign up for an account</h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit(handleSignup)}>
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>} {/* Validation message */}
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
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>} {/* Validation message */}
            </div>
            <div className="mt-4"> {/* Added confirm password field */}
              <label className="block" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                {...register('confirmPassword', { required: true })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>} {/* Validation message */}
            </div>

            <div className="flex items-baseline justify-between mt-6"> {/* Adjusted margin top */}
              <p className="text-sm text-gray-600">
                Already have an account?{' '} // Added a space
                <Link href="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              </p>
              <button
                disabled={mutation.status === 'pending'}
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" // Added a space
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

