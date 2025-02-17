import { Heart, FileInput, ListTodo, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

import heroImage from '@/assets/hero.png';
import { useAppSelector } from '@/redux/hooks';

export default function LandingPage() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl text-center">
          Give us your Requirements
        </h2>
        <img
          className="max-w-64 mx-auto rounded-sm shadow-sm"
          src={heroImage}
          alt="hero-image"
        />
        <div className="space-y-0.5">
          <p className="text-base md:text-lg text-center">
            And We will deliver,
          </p>
          <p className="text-base md:text-lg text-center">
            With care <Heart className="inline fill-red-600 text-red-600" />{' '}
            obviously
          </p>
        </div>
      </div>
      <div className="mt-16 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground text-lg">
          Our Services
        </span>
      </div>
      <div className="py-8 text-center flex flex-wrap gap-4 justify-center">
        {!user && (
          <div className="text-lg">Log In To Avail the Services...</div>
        )}

        {user &&
          (user.role === 'USER' ||
            user.role === 'ADMIN' ||
            user.role === 'OWNER') && (
            <div
              onClick={() => navigate('/requirements/new')}
              className="hover:scale-105 transition-transform duration-300 group hover:cursor-pointer gap-4 max-w-48 w-full aspect-square p-4 rounded-sm bg-slate-100 dark:text-background border border-gray-300 dark:border-transparent flex items-center flex-col justify-center"
            >
              <FileInput className="group-hover:text-rose-700 size-16" />
              <span className="font-medium text-lg">Issue a Requirement</span>
            </div>
          )}

        {user && (user.role === 'ADMIN' || user.role === 'OWNER') && (
          <div
            onClick={() => navigate('/requirements/pending')}
            className="hover:scale-105 transition-transform duration-300 group hover:cursor-pointer gap-4 max-w-48 w-full aspect-square p-4 rounded-sm bg-slate-100 dark:text-background border border-gray-300 dark:border-transparent flex items-center flex-col justify-center"
          >
            <ListTodo className="size-16 group-hover:text-rose-700" />
            <span className="font-medium text-lg">Pending Requirements</span>
          </div>
        )}

        {user && user.role === 'OWNER' && (
          <div
            onClick={() => navigate('/admins')}
            className="hover:scale-105 transition-transform duration-300 group hover:cursor-pointer gap-4 max-w-48 w-full aspect-square p-4 rounded-sm bg-slate-100 dark:text-background border border-gray-300 dark:border-transparent flex items-center flex-col justify-center"
          >
            <Users className="size-16 group-hover:text-rose-700" />
            <span className="font-medium text-lg">Manage Roles</span>
          </div>
        )}
      </div>
    </>
  );
}
