import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import authImage from '@/assets/auth.jpg';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login } from '@/redux/features/auth-slice';

import { signUpUser, signInUser } from '@/api/auth';
import { Loader } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [authMode, setAuthMode] = React.useState<'sign-in' | 'sign-out'>(
    'sign-in'
  );

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });

  // Sign-up Mutation
  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      dispatch(login(data.user)); // Store user in Redux
      navigate('/'); // Redirect after sign-up
      setErrorMessage('');
      queryClient.invalidateQueries({
        queryKey: ['authUser'],
      });
    },
    onError: (error: any) => {
      console.error('Sign-up error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || '');
    },
  });

  // Sign-in Mutation
  const signInMutation = useMutation({
    mutationFn: signInUser,
    onSuccess: (data) => {
      dispatch(login(data.user)); // Store user in Redux
      navigate('/'); // Redirect after login
      setErrorMessage('');
      queryClient.invalidateQueries({
        queryKey: ['authUser'],
      });
    },
    onError: (error: any) => {
      console.log('Sign-in error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || '');
    },
  });

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'sign-in') {
      signInMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      signUpMutation.mutate(formData);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <motion.div className="space-y-4 pt-8" layout>
      <div className={cn('flex flex-col gap-6')}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                </div>
                {authMode === 'sign-out' && (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Name</Label>
                    <Input
                      id="name"
                      type="name"
                      placeholder="oggy"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="meow@cat.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  {(signInMutation.isPending || signUpMutation.isPending) && (
                    <span>
                      <Loader className="size-4 animate-spin" />
                    </span>
                  )}
                  {authMode === 'sign-in' ? 'Login' : 'Sign Up'}
                </Button>
                <span className="text-red-500">{errorMessage}</span>
                <div className="text-center text-sm space-x-1">
                  <span>
                    {authMode !== 'sign-in'
                      ? "Don't have an account?"
                      : 'Already have an account'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode((p) =>
                        p === 'sign-in' ? 'sign-out' : 'sign-in'
                      );
                      setErrorMessage('');
                    }}
                    className="underline underline-offset-4"
                  >
                    {authMode !== 'sign-in' ? 'Login' : 'Sign up'}
                  </button>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src={authImage}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
