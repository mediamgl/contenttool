/**
 * @krisspy-file
 * @type page
 * @name "Register"
 * @title "Register"
 * @description "User registration page with email and password setup"
 * @routes ["/register"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z\d]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(formData.email, formData.password, formData.name);
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) {
      addToast('Registration failed. Please try again.', 'error');
    }
  };

  const strength = passwordStrength(formData.password);
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['text-danger', 'text-warning', 'text-warning', 'text-success', 'text-success'][strength];

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-lg py-xl">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
            <User className="w-8 h-8 text-inverse" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-xl">
          <h1 className="heading-2 mb-sm">Create Account</h1>
          <p className="body-base text-secondary">Join ContentFlow and start creating</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-lg bg-secondary rounded-xl p-xl shadow-sm border border-primary">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            disabled={isLoading}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            disabled={isLoading}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
            />
            {formData.password && (
              <div className="mt-md">
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-xs text-secondary">Password strength:</span>
                  <span className={`text-xs font-semibold ${strengthColor}`}>{strengthLabel}</span>
                </div>
                <div className="w-full h-1 bg-tertiary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      strength === 1
                        ? 'w-1/4 bg-danger'
                        : strength === 2
                          ? 'w-1/2 bg-warning'
                          : strength === 3
                            ? 'w-3/4 bg-success'
                            : 'w-full bg-success'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
            {formData.confirmPassword && !errors.confirmPassword && (
              <div className="absolute right-lg top-[42px] flex items-center justify-center">
                <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          <label className="flex items-start gap-md cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-primary accent-brand cursor-pointer mt-xs"
              defaultChecked
            />
            <span className="body-small text-secondary">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <Button type="submit" variant="primary" loading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-lg my-xl">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-secondary">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Sign In Link */}
        <p className="text-center body-small text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-brand hover:text-primary-hover transition-colors font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
