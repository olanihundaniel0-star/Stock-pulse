import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/ui/InputField';
import { useAuth } from '../context/AuthContext';

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignInFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data: SignInFormInputs) => {
    try {
      setApiError(null);
      clearError();
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
      setApiError(errorMessage);
    }
  };

  const displayError = apiError || error;
  const isFormLoading = isLoading || isSubmitting;

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your StockPulse account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* API Error Alert */}
        {displayError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        {/* Email Field */}
        <InputField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          register={register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.email}
          disabled={isFormLoading}
          autoComplete="email"
        />

        {/* Password Field */}
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register('password', {
            required: 'Password is required',
            minLength: {
              value: 1,
              message: 'Password is required',
            },
          })}
          error={errors.password}
          disabled={isFormLoading}
          autoComplete="current-password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isFormLoading || !emailValue || !passwordValue}
          className={`w-full py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 mt-6
            ${
              isFormLoading || !emailValue || !passwordValue
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isFormLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>

        {/* Sign Up Link */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
