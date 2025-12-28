/**
 * @krisspy-file
 * @type page
 * @name "Login"
 * @title "Login"
 * @description "User login page with email and password authentication"
 * @routes ["/login"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      addToast('Successfully logged in!', 'success');
      navigate('/');
    } catch (error) {
      addToast('Login failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-lg">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
            <Mail className="w-8 h-8 text-inverse" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-xl">
          <h1 className="heading-2 mb-sm">Welcome Back</h1>
          <p className="body-base text-secondary">Sign in to ContentFlow to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-lg bg-secondary rounded-xl p-xl shadow-sm border border-primary">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-lg top-[42px] text-secondary hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <label className="flex items-center gap-md cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-primary accent-brand cursor-pointer" />
            <span className="body-small text-secondary">Remember me</span>
          </label>

          <Button type="submit" variant="primary" loading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-lg my-xl">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-secondary">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Sign Up Link */}
        <p className="text-center body-small text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand hover:text-primary-hover transition-colors font-semibold">
            Sign up
          </Link>
        </p>

        {/* Demo Info */}
        <div className="mt-xl p-md bg-info/10 border border-info/30 rounded-lg">
          <p className="text-xs text-info font-semibold mb-xs">Demo Credentials</p>
          <p className="text-xs text-secondary">Email: demo@example.com</p>
          <p className="text-xs text-secondary">Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
