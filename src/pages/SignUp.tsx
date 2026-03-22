import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, Check } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/ui/InputField';
import { useAuth } from '../features/auth/AuthContext';

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const name = watch('name');
  const email = watch('email');

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      setApiError(null);
      clearError();

      // Additional validation
      if (data.password !== data.confirmPassword) {
        setApiError('Passwords do not match');
        return;
      }

      if (data.password.length < 6) {
        setApiError('Password must be at least 6 characters');
        return;
      }

      await signup(data.email, data.password, data.name);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
      setApiError(errorMessage);
    }
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const passwordLongEnough = password.length >= 6;
  const displayError = apiError || error;
  const isFormLoading = isLoading || isSubmitting;
  const isFormValid = name && email && password && confirmPassword &&
    passwordsMatch && passwordLongEnough;

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Get started with StockPulse"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* API Error Alert */}
        {displayError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        {/* Full Name Field */}
        <InputField
          label="Full Name"
          placeholder="John Doe"
          type="text"
          register={register('name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Full name must be at least 2 characters',
            },
          })}
          error={errors.name}
          disabled={isFormLoading}
          autoComplete="name"
        />

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
        <div>
          <InputField
            label="Password"
            type="password"
            placeholder="Create a strong password"
            register={register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password}
            disabled={isFormLoading}
            autoComplete="new-password"
          />
          {password && !errors.password && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>Password is strong enough</span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            register={register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            error={errors.confirmPassword}
            disabled={isFormLoading}
            autoComplete="new-password"
          />
          {confirmPassword && passwordsMatch && !errors.confirmPassword && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>Passwords match</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isFormLoading || !isFormValid}
          className={`w-full py-2.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 mt-6
            ${isFormLoading || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isFormLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account
            </>
          )}
        </button>

        {/* Sign In Link */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
