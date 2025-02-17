import { Outlet, useLocation, Link } from 'react-router';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useAppSelector } from '@/redux/hooks';

export default function RootLayout() {
  const { mode } = useAppSelector((state) => state.theme);
  const { pathname } = useLocation();

  return (
    <div className={`${mode} bg-background text-foreground`}>
      <div className="flex flex-col min-h-svh max-w-screen-md mx-auto px-4">
        <Navbar />
        <div className="grow pt-24 pb-8 flex flex-col gap-y-8">
          {pathname !== '/' && (
            <Button asChild className="max-w-fit px-4" variant={'outline'}>
              <Link to=".." className="flex gap-2 items-center ">
                <Home className="inline" />
              </Link>
            </Button>
          )}
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
