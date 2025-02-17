import { Link, useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import { toggle as themeToggle } from '@/redux/features/theme-slice';

import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Loader, LogOut, Mail, MoonIcon, SunIcon, User } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { signOutUser } from '@/api/auth';
import { login, logout } from '@/redux/features/auth-slice';
import { checkAuthStatus } from '@/api/check-auth';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);
  const navigate = useNavigate();

  // Fetch authentication status using React Query
  const { data: user } = useQuery({
    refetchInterval: 1000 * 1 * 60,
    queryKey: ['authUser'],
    queryFn: async () => {
      const data = await checkAuthStatus();
      dispatch(login(data));
      return data;
    },
    retry: false, // Don't retry if the request fails (token is invalid)
  });

  // React Query mutation for logging out
  const logoutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      dispatch(logout()); // Clear authentication from Redux
      navigate('/'); // Redirect to login page
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  return (
    <div className="fixed top-0 inset-x-0 bg-background/60 backdrop-blur-sm">
      <header className="max-w-screen-md mx-auto px-4 flex justify-between py-6">
        <div className="font-playfair">
          <Link to="/" className="font-serif text-2xl font-bold">
            Assign.
          </Link>
        </div>

        <div className="flex gap-2 font-playfair">
          <Button variant="ghost" onClick={() => dispatch(themeToggle())}>
            {mode === 'dark' ? (
              <SunIcon className="size-4 text-orange-300" />
            ) : (
              <MoonIcon className="size-4 text-sky-950" />
            )}

            <span className="sr-only">Toggle theme</span>
          </Button>
          {!isAuthenticated && (
            <Button className="text-lg" variant="ghost" asChild>
              <Link to="/auth">
                <LogOut />
                <span>Login</span>
              </Link>
            </Button>
          )}

          {isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{user && user.name[0]}</Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 bg-background/80 dark:bg-background backdrop-blur-sm"
                align="end"
              >
                <div className="grid gap-4 w-full">
                  <div className="truncate">
                    <h4 className="font-semibold text-lg leading-none truncate">
                      {user && user.name.split(' ')[0]}
                    </h4>
                    <p className="flex gap-1 justify-start items-center text-foreground font-medium text-sm truncate capitalize">
                      <User className="size-4" />
                      <span>{user && user.role.toLowerCase()}</span>
                    </p>
                    <p className="flex gap-1 justify-start items-center text-foreground font-medium text-sm truncate">
                      <Mail className="size-4" />
                      <span>{user && user.email}</span>
                    </p>
                  </div>

                  <Button
                    className="text-lg"
                    variant="destructive"
                    onClick={() => logoutMutation.mutate()} // Call React Query mutation
                  >
                    {logoutMutation.isPending ? (
                      <span>
                        <Loader className="size-4 animate-spin" />
                      </span>
                    ) : (
                      <span>Logout</span>
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>
    </div>
  );
}
